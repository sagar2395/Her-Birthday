# Personalized Keepsake App — Product Plan

This folder turns the one-off birthday app in this repo into a sellable product:
users answer a questionnaire, pick one of several occasion designs, upload their
own photos/videos/songs, pay, and get a private personal app hosted on a custom
subdomain under our domain.

Read in order:

1. **[00-feasibility.md](./00-feasibility.md)** — Is this realistic? Verdict, why,
   risks, and what the current code gives us for free.
2. **[01-requirements.md](./01-requirements.md)** — What it takes to be *sellable*:
   product surfaces, the 8 occasion templates, payments, hosting, legal.
3. **[02-architecture.md](./02-architecture.md)** — The recommended technical
   design: stack, multi-tenancy, content schema, media pipeline, subdomains.
4. **[03-roadmap.md](./03-roadmap.md)** — Phased build plan, MVP scope, milestones,
   and a pricing summary.
5. **[04-ai-personalization.md](./04-ai-personalization.md)** — The provider-agnostic
   AI adapter (swap any model behind one interface), cheap-by-default model choice,
   and the always-editable copy flow.
6. **[05-earnings-model.md](./05-earnings-model.md)** — How much you can earn: unit
   economics, monthly profit scenarios, the renewal flywheel, and acquisition math.
7. **[06-first-customers.md](./06-first-customers.md)** — How much and where to invest to
   get your first customers (~$300–500, mostly reaction video + a small paid test).

**Build progress:** [PHASE-1-DONE.md](./PHASE-1-DONE.md) — content-schema extraction is
complete; `src/App.jsx` now renders entirely from `src/siteConfig.json`.

## Decisions locked in (from our discussion)

- **Launch with 3 templates** (the ★ starred ones in
  [01-requirements.md](./01-requirements.md#b-the-8-occasion-templates)): *Our Story Map*
  (anniversary), *The Birthday Atlas*, *Two Become One* (wedding). The other 5 occasions
  come after revenue.
- **Deeply personalized & emotional** is the whole point — AI drafts warm, on-tone copy
  from the questionnaire, but the buyer can **always edit** every word.
- **AI behind an adapter** so Claude (default) or any other provider plugs in without
  product changes; **cheaper models** (Haiku-tier) do the text writing — pennies per app.
- **$30 base price.** You keep **~$28 per sale** (~93% margin). Break-even ~3–4 sales/mo.

> **TL;DR feasibility:** Highly feasible. The hard part — a genuinely moving,
> polished, emotional experience — is already built and proven. What remains is
> standard SaaS plumbing (accounts, payments, uploads, multi-tenant hosting) plus
> turning the hardcoded content into a config the questionnaire fills in. An MVP
> is reachable in ~6–8 focused weeks. Recommended next step: split this branch
> into its own repo and start with the **content-schema extraction** (Phase 1),
> because every other piece depends on it.
