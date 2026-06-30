# 02 — Technical Architecture

## Guiding principle

**One app, many tenants, resolved by hostname.** Do *not* build and deploy a
separate site per buyer — that doesn't scale and makes updates impossible. Instead,
a single application resolves the incoming subdomain to a tenant config + media
manifest and renders the existing React experience. Wildcard DNS means new buyers
need zero DNS work.

## Recommended stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router)** | The existing React components drop in; gives us the marketing site, the builder, API routes, and tenant rendering in one codebase. Subdomain middleware is first-class. |
| Hosting | **Vercel** or **Cloudflare Pages/Workers** | Both support wildcard custom domains + per-request tenant routing. Cloudflare pairs naturally with R2 (current app already targets CF Pages). |
| Database | **Postgres (Supabase or Neon)** | Tenants, users, orders, configs, media records. JSONB column stores the story config directly. |
| Auth | **Supabase Auth / Clerk / Auth.js** | Email magic-link + Google. Clerk is fastest to ship. |
| Object storage | **Cloudflare R2** (S3-compatible) | **Zero egress fees** — decisive for media-heavy bandwidth. Supabase Storage is a fine alternative if staying all-Supabase. |
| Video | **Cloudflare Stream** (optional) | Offloads transcoding/adaptive playback for large clips; current app already supports a `video:` URL field. |
| Image optimization | Next/Image or Cloudflare Images | WebP/AVIF, resizing, lazy-load. |
| Payments | **Stripe** (Checkout + Billing) | One-time purchase + optional annual renewal; webhooks drive provisioning. |
| AI copywriting | **Claude API** (`claude-opus-4-8` for drafting; a smaller model for cheap edits) | Turns questionnaire answers into editable, on-tone prose. |
| Email | **Resend** or **Postmark** | Receipts, live links, renewal reminders. |
| Errors/uptime | Sentry + an uptime monitor | A gift that 404s is a disaster. |

> The current app is plain Vite + React. Migrating the **renderer** into Next is
> mostly moving components and replacing hardcoded constants with props. Keep the
> existing app runnable during the transition as the reference implementation.

## Multi-tenancy & subdomains

```
                       *.ourdomain.com  (one wildcard DNS record + wildcard TLS)
                                │
                    ┌──────────┴───────────┐
   nidhi.ourdomain.com   raj.ourdomain.com   app.ourdomain.com (dashboard/builder)
                                │
                     Next.js middleware reads Host header
                                │
                 looks up tenant by subdomain  ──►  Postgres (tenants)
                                │
              loads story config (JSONB) + media manifest (R2 URLs)
                                │
                 renders the React experience (the engine + theme)
```

- **Wildcard DNS:** a single `*.ourdomain.com` record. New buyers = a new DB row,
  **no DNS change**.
- **Wildcard TLS:** one wildcard certificate (Vercel/Cloudflare issue these
  automatically for the apex+wildcard).
- **Reserved subdomains:** `app`, `www`, `api`, `admin`, `mail`, etc. blocked at
  checkout.
- **Custom domains (premium):** allow `theirname.com` via a verified CNAME — a
  later, higher-tier feature.

## Content schema (the heart of the refactor)

Extract the hardcoded `MEMORIES`, `FEAST_PHOTOS`, `SONG_LIST`, `REASONS_I_LOVE_YOU`,
`SECRET_MESSAGES`, and date constants from `App.jsx` into a single versioned config
object. The renderer reads this; the questionnaire writes it.

```jsonc
{
  "schemaVersion": 1,
  "template": "birthday-atlas",
  "theme": { "palette": "gold-rose", "font": "serif-warm", "music": "uploaded|preset", "reduceMotion": false },
  "recipient": { "name": "Nidhi", "relationship": "wife" },
  "dates": { "occasion": "2026-06-22", "countdownTo": "2026-06-21T18:30:00Z" },
  "gate": { "enabled": true, "promptName": "Nidhi", "password": "..." },  // hashed server-side
  "chapters": [
    {
      "id": "born",
      "name": "The Day You Arrived",
      "when": "Once upon a beginning",
      "icon": "🍼",
      "teaser": "Before us, before everything — there was you.",
      "message": "…",                      // AI-drafted, buyer-edited
      "media": [
        { "type": "image", "url": "r2://.../born-01.jpg", "focus": "74% 32%", "caption": "…" },
        { "type": "video", "url": "stream://…", "caption": "…" }
      ],
      "quiz": { "q": "…", "options": ["…"], "correct": 0, "right": "…" }  // optional
    }
  ],
  "finale": { "letter": "…", "promises": ["…"], "secretMessages": ["…"] },
  "feast": [ { "url": "…", "caption": "…", "place": "…" } ]   // optional, romantic templates
}
```

Notice this is **the existing data model with media URLs swapped for storage refs**.
That's the whole point — the refactor is faithful extraction, not a rewrite.

## Media pipeline

1. Buyer uploads in the builder → presigned PUT directly to **R2** (or via an API
   route). Validate type/size/count against their plan client- and server-side.
2. **Process on ingest:** images → resized WebP/AVIF variants; video → either a
   compressed MP4 or pushed to **Cloudflare Stream**; audio left as-is (MP3/M4A).
3. **Moderate on ingest:** automated nudity/CSAM scan; flag/hold on hit.
4. Store the resulting URLs + metadata in the `media` table; reference them from the
   config manifest.
5. Serve via CDN with long cache headers; lazy-load galleries (the `Gallery`/
   `MediaTabs` components already paginate).

## Data model (sketch)

- `users` (auth) · `orders` (Stripe, plan, status) · `tenants` (subdomain, owner,
  template, status: draft/published/expired, expiry) · `site_configs` (tenant_id,
  JSONB config, schemaVersion) · `media` (tenant_id, kind, url, bytes, moderation
  status) · `subscriptions` (renewals).

## Provisioning flow

1. Buyer completes builder + picks subdomain → Stripe Checkout.
2. Stripe webhook → mark order paid → set tenant `status = published`, store config.
3. Send email with the live `name.ourdomain.com` link + shareable preview card.
4. Renewal: Stripe Billing reminder; on lapse → `status = expired` (show a gentle
   "this gift has paused" page, keep media for a grace period, then purge).

## Build vs. buy summary

Almost everything heavy is **buy/managed**: auth (Clerk/Supabase), payments
(Stripe), storage+CDN (R2), video (Stream), AI (Claude API), email (Resend),
errors (Sentry). What **we build** is the glue: the questionnaire/builder, the
config schema, the tenant router, and the moderation/admin tooling — plus porting
the already-built experience into the renderer. That keeps the team small and the
timeline short.
