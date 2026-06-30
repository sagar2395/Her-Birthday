# Personalized Gift App — a config-driven, multi-tenant keepsake builder

> Started life as a one-off birthday gift; now a **productized, sellable platform**: people
> answer a questionnaire, pick an occasion design, add their media, pay, and get a private,
> beautiful personal app hosted on their own subdomain.

This repo is the seed for that product. The full strategy, architecture, financials, and
phased build plan live in **[`product-plan/`](./product-plan/README.md)** — start there.

## What works today (in this repo)

| Capability | How to see it |
|---|---|
| **The gift renderer** — a cinematic, emotional keepsake app | `npm run dev` → open the site |
| **Config-driven** — zero hardcoded content; the whole app renders from one JSON config | `src/tenants/nidhi.json` is the content; `src/App.jsx` is a pure renderer |
| **Multi-tenant** — different config per subdomain | `nidhi.localhost:5173` vs `demo.localhost:5173`, or `/?tenant=demo` |
| **The builder** — a wizard that *writes* a config, with live preview + AI drafting | open **`/?builder=1`** |

```bash
npm install
npm run dev      # then open the printed localhost URL
npm run build    # production build → dist/
npm run lint
```

- **Build a gift:** `/?builder=1` → fill the wizard → "✨ Draft with AI" → preview live →
  download `config.json`.
- **Preview a draft full-screen:** the builder's review step opens `/?preview=1` in the
  real renderer.

## Structure

```
src/
  App.jsx              the gift renderer (pure — reads one config)
  siteConfig.js        tenant resolver: subdomain → config (+ /?preview= override)
  tenants/             one JSON config per tenant (nidhi.json, demo.json)
  builder/             the questionnaire/builder that writes a config
  ai/textProvider.js   provider-agnostic AI adapter (mock default; Claude/Haiku ready)
public/media/          photos, videos, audio
product-plan/          feasibility, architecture, roadmap, pricing, feature specs
```

## Build status (see [`product-plan/`](./product-plan/README.md))

- ✅ **Phase 1** — content-schema extraction (pure renderer)
- ✅ **Phase 2** — multi-tenant rendering by subdomain
- ✅ **Phase 3 (front-end core)** — the builder + live preview + AI adapter
- ⏭️ **Phase 4+** — UPI/Razorpay checkout, accounts/dashboard, media upload, security,
  social share, PWA + reaction capture, non-tech channels (WhatsApp/IG/Forms)

> Splitting this into its own product repo? See **[`SPLIT-GUIDE.md`](./SPLIT-GUIDE.md)**.

## Environment

Copy `.env.example` → `.env.local` and set values as you add backend services. Today the
only knob is `VITE_AI_PROVIDER` (defaults to `mock`).
