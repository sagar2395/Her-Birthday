# 00 — Feasibility

## Verdict: Feasible, and unusually well-positioned

This is a **strong idea with a real moat**, and the riskiest part is already done.

Most "personalized gift app" startups die because they can't make the output feel
special — they ship a generic photo slideshow with a name swapped in. This repo
has already solved that: a cinematic intro, an interactive journey map, a
memory-by-memory reveal flow, a "how well do you know us" quiz that unlocks a
finale, a handwritten-letter envelope, ambient music with ducking, fireworks, a
countdown to midnight. It made a real person cry the good kind of tears. **That
emotional quality is the product. Everything else is plumbing we know how to
build.**

## What the current code gives us for free

The existing app (`src/App.jsx`, ~4,700 lines) is, structurally, already a
template engine — it just has the content baked in instead of injected:

- **The content is already a clean data model.** `MEMORIES` (line 207) is an array
  of section objects, each with `id`, `name`, `when`, `type`, `icon`, `teaser`,
  `message`, `video`, `photos[]` (with per-photo `caption`/`focus`/`fit`), `food[]`,
  and an optional `quiz` (`{ q, options, correct, right }`). `FEAST_PHOTOS`,
  `SONG_LIST`, `REASONS_I_LOVE_YOU`, `SECRET_MESSAGES`, `PROMISES`, and the
  birthday date constants are all top-of-file constants. **Converting hardcoded
  constants into an injected JSON config is mechanical, not architectural.**
- **The hard UX is component-ized.** `Intro`, `Gallery`, `MediaTabs`, `Quiz`,
  `Feast`, `Lightbox`, `FinaleExperience`, `BirthdayCountdown`, `Fireworks`,
  `Envelope`, `Typewriter`, `LoveQuotes`, etc. are discrete React components that
  take props. They port into a multi-tenant renderer almost unchanged.
- **It already ships the way the product needs to.** `npm run build` → a static
  `dist/` deployed to Cloudflare Pages, media served from `public/`, custom-domain
  support documented (`SETUP.md`). The "host it on a subdomain" requirement is a
  known, solved deployment shape.
- **A privacy gate already exists.** `LoginGate` (line 2288) with a name/password.
  Per-recipient privacy is a feature we already have, not one we must invent.

## What has to change (the actual work)

| Today (single-tenant gift) | Product (multi-tenant SaaS) |
|---|---|
| Content hardcoded in `App.jsx` | Content is a per-site **JSON config** the renderer reads |
| Media in `public/media/`, committed to git | Media **uploaded by buyers** to object storage, referenced by URL |
| One design (romantic journey) | **8 occasion templates** sharing one engine |
| Author edits code | Buyer fills a **questionnaire** that generates the config |
| Hardcoded login (`AUTH_USER`/`AUTH_PASS`) | Real **accounts + auth**, plus optional per-site recipient gate |
| Free, you deploy by hand | **Payment** + automated **provisioning** to a subdomain |
| One site | **Wildcard subdomains** `name.ourdomain.com`, many tenants |

None of these are research problems. They're well-trodden SaaS patterns. See
[02-architecture.md](./02-architecture.md) for exactly how.

## Risk assessment

| Risk | Severity | Mitigation |
|---|---|---|
| **Media storage & bandwidth cost** — videos are heavy; this is the #1 ongoing cost driver | High | Transcode/compress on upload (images→WebP, video→compressed MP4 or Cloudflare Stream); cap file sizes/counts per plan; use R2 (zero egress fees) |
| **Content moderation** — buyers upload personal media; some will upload illegal/abusive content | High (legal) | ToS + acceptable-use policy, automated nudity/CSAM scanning on upload, takedown/report flow, keep buyer identity via payment |
| **"AI-written copy" quality** — the magic is the husband's-voice prose; a bad auto-generator breaks the spell | Medium | Use the questionnaire to draft copy with the Claude API, but **always let the buyer edit**; ship strong human-written templates as fallback |
| **Per-occasion design effort** — 8 genuinely distinct, polished themes is real design work | Medium | Share one engine; differentiate by palette/typography/copy-tone/section-mix, not by rewriting components. Launch with 2–3, add the rest after revenue |
| **Subdomain/DNS provisioning at scale** | Low | Wildcard DNS `*.ourdomain.com` + a single dynamic app resolves tenant by hostname — no per-site DNS record needed |
| **Privacy / data protection** (storing strangers' personal photos & faces) | Medium (legal) | Clear privacy policy, data-deletion on request, EU data residency option, encryption at rest |
| **Payment, refunds, chargebacks** | Low | Stripe handles the hard parts; clear refund policy (digital good, partial after publish) |

## Market reality check

- **Comparable products exist** (digital wedding invites, "loveboxes", anniversary
  microsites, Joy/Zola wedding sites) — which proves demand, but means we compete
  on *emotional depth and interactivity*, where this app is genuinely differentiated.
- **Occasion breadth widens the market** beyond couples: birthdays, weddings,
  newborns, graduations, friendships, memorials, retirements. Each is a recurring,
  emotionally-motivated, willing-to-pay moment.
- **Unit economics work** if media cost is controlled: a one-time price of roughly
  **$19–$49 per app** with an optional **annual hosting renewal (~$9–15/yr)** covers
  storage and leaves margin. See [03-roadmap.md](./03-roadmap.md#pricing--cost-model).

## Bottom line

The creative risk — the thing that's actually hard and usually fatal — is retired.
What's left is a conventional SaaS build on top of an emotional engine that already
works. **Recommend proceeding.** Start by extracting the content schema (Phase 1),
since the questionnaire, templates, and hosting all depend on it.
