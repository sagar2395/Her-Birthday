# 03 — Roadmap, MVP & Cost Model

## Phasing philosophy

Get to **one buyer paying for one template on one subdomain** as fast as possible,
then widen. Every phase ships something demoable. The ordering is dependency-driven:
the content schema unblocks everything else, so it goes first.

---

## Phase 0 — Spin out (½ week)
- Split this branch into its own repo (`keepsake-app` or your brand name).
- Keep the current Vite app as `/reference` — the working experience we port from.
- Scaffold a Next.js app, set up Postgres, R2, Stripe (test mode), Clerk/Supabase
  Auth, env management, CI.

**Done when:** new repo builds and deploys a "hello" page on `*.ourdomain.com`.

## Phase 1 — Content-schema extraction *(the keystone)* (1–1.5 weeks)
- Define the JSON config schema ([02-architecture.md](./02-architecture.md#content-schema-the-heart-of-the-refactor)).
- Refactor the renderer so `MEMORIES`/`FEAST_PHOTOS`/`SONG_LIST`/finale/dates come
  from a config object/props instead of hardcoded constants.
- Prove it: render the *existing Nidhi site* purely from a config file — pixel-faithful.

**Done when:** the original app renders from a JSON config with zero hardcoded content.

## Phase 2 — Multi-tenant rendering (1 week)
- Subdomain middleware → resolve tenant → load config + media manifest → render.
- Wildcard DNS + TLS; reserved-subdomain list.
- Seed 2 tenants from JSON to prove isolation.

**Done when:** two different configs render at two different subdomains.

## Phase 3 — Accounts, builder & media upload (2 weeks)
- Auth + dashboard ("My apps").
- Questionnaire/builder wizard for the **first template**, writing the config.
- Live preview. R2 uploads with validation + image processing.
- **AI copywriting** pass (Claude API) on the story fields — editable drafts.

**Done when:** a logged-in user builds a complete site from scratch via the wizard
(no payment yet) and previews it.

## Phase 4 — Payments & provisioning (1 week)
- Subdomain picker + availability check.
- Stripe Checkout (one-time) → webhook → publish tenant → email live link.
- Basic admin: tenant list, manual unpublish/refund.

**Done when:** a stranger can pay and get a live `name.ourdomain.com` gift. **← MVP**

## Phase 5 — Trust, safety & polish (1–1.5 weeks)
- Moderation scan on upload + report/takedown flow.
- ToS, Privacy, Acceptable-Use, refund policy.
- Transactional emails (receipt, renewal reminder, expiry).
- Sentry, uptime monitoring, storage-usage metering.

**Done when:** safe and lawful enough to take real money publicly.

## Phase 6 — Template expansion & marketing (ongoing)
- Add templates 3→8 (one shared engine; new palette/tone/section-mix each).
- New section types as needed: RSVP (wedding), messages-wall (graduation),
  guestbook (memorial).
- Marketing site with live per-template demos, SEO, example gallery.
- Renewals/expiry lifecycle, custom-domain (premium) support.

---

## MVP scope (the line)

**In:** 1–3 templates · accounts · builder + AI copy · media upload · Stripe
checkout · subdomain provisioning · recipient gate · basic moderation + legal.
**Out (fast-follow):** templates 4–8, custom domains, RSVP/guestbook section types,
gift cards, multi-language, team/agency accounts.

**Realistic MVP timeline:** ~6–8 focused weeks (Phases 0–5) for one capable
full-stack dev; faster with two.

---

## Pricing & cost model

**Cost drivers (per published app):** storage + bandwidth dominate; AI drafting and
Stripe fees are small and one-time.

- A typical app: ~30–80 photos + 1–3 short videos. With WebP images and compressed
  video (or Stream), call it tens to low-hundreds of MB. On **R2 (zero egress)** the
  ongoing cost is mostly *storage*, measured in **cents/month per app** — bandwidth,
  the usual killer, is free to serve.
- AI copywriting: a handful of Claude calls per build — pennies.
- Stripe: ~2.9% + 30¢ per transaction.

**Suggested pricing:**

| Tier | Price | Includes |
|---|---|---|
| **Keepsake** | **$24 one-time** | 1 app, 1 yr hosting, up to N photos + 1 video, "Made with ❤️" footer |
| **Forever** | **$49 one-time** | More media, longer/HD video, remove footer, custom song |
| **Renewal** | **$12 / yr** | Keep it live after year one |
| **Custom domain** | **+$20 / yr** | `theirname.com` instead of a subdomain |

At ~$24–49 against single-digit-dollar lifetime media cost, **gross margin is
healthy** even before optimization. The renewal stream covers ongoing storage for
the long tail of sites people want to keep.

> Validate willingness-to-pay early: a simple landing page + the existing demo +
> a waitlist/pre-order before building Phases 3–5.

---

## Immediate next steps (this week)

1. **Approve the plan / pick the launch templates** (recommend the 3 starred ones).
2. **Convert this branch into its own repo** (your stated intent).
3. **Start Phase 1** — extract the content schema — since everything depends on it.
4. Reserve the product domain and stand up the wildcard DNS so subdomains are ready.
