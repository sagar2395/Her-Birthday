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

## Phase 1 — Content-schema extraction *(the keystone)* ✅ DONE
- Define the JSON config schema ([02-architecture.md](./02-architecture.md#content-schema-the-heart-of-the-refactor)).
- Refactor the renderer so `MEMORIES`/`FEAST_PHOTOS`/`SONG_LIST`/finale/dates come
  from a config object/props instead of hardcoded constants.
- Prove it: render the *existing Nidhi site* purely from a config file — pixel-faithful.

**Done when:** the original app renders from a JSON config with zero hardcoded content.
**→ Completed.** Content lives in `src/siteConfig.json`; `src/App.jsx` is a pure
renderer; build passes with no new lint regressions. Details: [PHASE-1-DONE.md](./PHASE-1-DONE.md).

## Phase 2 — Multi-tenant rendering ✅ DONE
- Subdomain middleware → resolve tenant → load config + media manifest → render.
- Wildcard DNS + TLS; reserved-subdomain list.
- Seed 2 tenants from JSON to prove isolation.

**Done when:** two different configs render at two different subdomains.
**→ Completed.** `src/siteConfig.js` resolves the tenant from the subdomain; `tenants/nidhi.json`
+ `tenants/demo.json` render at their own subdomains. Details: [PHASE-2-DONE.md](./PHASE-2-DONE.md).
(Server-side per-tenant config loading + real wildcard DNS land when the app moves to its own repo/stack.)

## Phase 3 — Accounts, builder & media upload (2 weeks)
- Auth + dashboard ("My apps").
- Questionnaire/builder wizard for the **first template**, writing the config.
- Live preview. R2 uploads with validation + image processing.
- **AI copywriting** pass (Claude API) on the story fields — editable drafts.

**Done when:** a logged-in user builds a complete site from scratch via the wizard
(no payment yet) and previews it.

## Phase 4 — Payments & provisioning (1 week)
- Subdomain picker + availability check.
- **Razorpay/UPI as the default gateway** (India-first — UPI intent/QR/links), Stripe
  second for international. Webhook (signature-verified) → publish tenant → deliver link.
  See [08-feature-additions.md §2](./08-feature-additions.md#2-upi--india-first-payments).
- **Per-app checkout + renewals** so one account can buy many gifts
  ([§6](./08-feature-additions.md#6-multiple-apps-per-account)).
- Basic admin: tenant list, manual unpublish/refund.

**Done when:** a stranger can pay by UPI and get a live `name.ourdomain.com` gift. **← MVP**

## Phase 5 — Trust, safety & polish (1–1.5 weeks)
- **Security hardening pass** — RLS tenant isolation, server-side recipient gate (hashed),
  CSP/HSTS/CSRF, rate limiting, WAF/DDoS, signed media URLs. See
  [08-feature-additions.md §5](./08-feature-additions.md#5-security-layer).
- Moderation scan on upload + report/takedown flow.
- **Aesthetic social-share cards + dynamic OG images** (acquisition fuel —
  [§1](./08-feature-additions.md#1-aesthetic-social-sharing-instagram--whatsapp)).
- ToS, Privacy, Acceptable-Use, refund policy (incl. India DPDP).
- Transactional emails (receipt, renewal reminder, expiry).
- Sentry, uptime monitoring, storage-usage metering.

**Done when:** safe and lawful enough to take real money publicly.

## Phase 6 — Template expansion & marketing (ongoing)
- Add templates 3→8 (one shared engine; new palette/tone/section-mix each).
- New section types as needed: RSVP (wedding), messages-wall (graduation),
  guestbook (memorial).
- **Interactive marketing site + customer support** (live demos, WhatsApp support, AI
  FAQ bot — [§3](./08-feature-additions.md#3-interactive-landing-page--customer-support)).
- **Share teaser reels** ([§1](./08-feature-additions.md#1-aesthetic-social-sharing-instagram--whatsapp)).
- Renewals/expiry lifecycle, **custom-domain (premium) via Cloudflare for SaaS**
  ([§4](./08-feature-additions.md#4-multi-tenant--best-practice-dns-routing)).

## Phase 7 — Non-tech buying channels (after the core SaaS works)
- One **normalized intake API** behind every channel → the same questionnaire→config→pay
  →provision pipeline; the dashboard is **emailed only if wanted**, never required.
- Build order: **WhatsApp chatbot first** (highest leverage in India), then Instagram DM,
  then Google Forms, plus an optional concierge flow.
- See [08-feature-additions.md §7](./08-feature-additions.md#7-non-tech-buying-channels-whatsapp--instagram--google-forms--dashboard-optional).

**Done when:** a non-technical buyer can create, pay for (UPI), and receive a gift entirely
inside WhatsApp — no dashboard, no app install.

---

> **New features added in [08-feature-additions.md](./08-feature-additions.md):** social
> share, UPI/Razorpay, interactive landing + support, DNS best practices, security layer,
> multiple apps per account, and non-tech ingestion channels.

---

## MVP scope (the line)

**In:** 1–3 templates · accounts · builder + AI copy · media upload · Stripe
checkout · subdomain provisioning · recipient gate · basic moderation + legal.
**Out (fast-follow):** templates 4–8, custom domains, RSVP/guestbook section types,
gift cards, multi-language, team/agency accounts.

**Realistic MVP timeline:** ~6–8 focused weeks (Phases 0–5) for one capable
full-stack dev; faster with two.

---

## Pricing & cost model (summary)

Base price is **$30 one-time** (your call), with a **$59 Forever** upsell, **$12/yr**
renewal, and **+$20/yr** custom domain. You keep **~$28 of every $30** — a ~93% gross
margin, because Cloudflare R2 has **zero egress fees** (media bandwidth, the usual
killer, is free) and Haiku-tier AI copywriting is **pennies per app**.

| Scenario | Sales/mo | ≈ Monthly profit |
|---|---|---|
| Hobby / soft launch | 20 | ~$460 |
| Side income | 100 | ~$2,700 |
| Real business | 500 | ~$13,900 |

**Break-even is ~3–4 sales/month.** The full bottom-up model — unit economics, fixed
costs, seasonality, the renewal flywheel, and customer-acquisition math — is in
**[05-earnings-model.md](./05-earnings-model.md)**.

> Validate willingness-to-pay early: a simple landing page + the existing demo +
> a waitlist/pre-order before building Phases 3–5.

---

## Immediate next steps (this week)

1. **Approve the plan / pick the launch templates** (recommend the 3 starred ones).
2. **Convert this branch into its own repo** (your stated intent).
3. **Start Phase 1** — extract the content schema — since everything depends on it.
4. Reserve the product domain and stand up the wildcard DNS so subdomains are ready.
