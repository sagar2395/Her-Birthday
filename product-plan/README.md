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
   and a rough cost/pricing model.

> **TL;DR feasibility:** Highly feasible. The hard part — a genuinely moving,
> polished, emotional experience — is already built and proven. What remains is
> standard SaaS plumbing (accounts, payments, uploads, multi-tenant hosting) plus
> turning the hardcoded content into a config the questionnaire fills in. An MVP
> is reachable in ~6–8 focused weeks. Recommended next step: split this branch
> into its own repo and start with the **content-schema extraction** (Phase 1),
> because every other piece depends on it.
