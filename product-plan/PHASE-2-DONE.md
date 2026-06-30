# Phase 2 — Multi-Tenant Rendering ✅ DONE

**Goal (from [03-roadmap.md](./03-roadmap.md#phase-2--multi-tenant-rendering-1-week)):**
resolve a tenant by hostname (subdomain) → load that tenant's config → render. Seed two
tenants from two JSON configs to prove isolation.

**Status: complete.** Two different configs now render at two different subdomains, from
one unchanged renderer.

## What changed

| File | Change |
|---|---|
| **`src/tenants/nidhi.json`** | The original site config (moved here from `src/siteConfig.json`). |
| **`src/tenants/demo.json`** *(new)* | A second, fully distinct tenant — a friend's birthday ("Aarav"), different name, copy, chapters, quiz, and finale — proving the renderer is genuinely content-agnostic. |
| **`src/siteConfig.js`** *(new)* | The **tenant resolver**: picks the active config from the visitor's subdomain (with a `?tenant=` override for local dev and a reserved-subdomain list). Exposes `resolveTenantKey()`, `TENANTS`, `DEFAULT_TENANT`, `activeTenant`. |
| **`src/App.jsx`** | One-line import change (`./siteConfig.json` → `./siteConfig.js`). No component logic touched. |

## How resolution works

```
nidhi.ourdomain.com   → tenants/nidhi.json
demo.ourdomain.com    → tenants/demo.json
ourdomain.com / www   → default tenant (reserved subdomains never match)

local dev:  http://demo.localhost:5173   or   http://localhost:5173/?tenant=demo
```

Resolution is **synchronous at import time**, which is what let `App.jsx` keep its
module-level constants (`MEMORIES`, `COPY`, …) untouched — they simply read from whichever
tenant the resolver selected.

## How it was verified

- `vite build` → succeeds; **both** tenant configs are present in the bundle (checked for
  `Nidhi Arjariya Chhabra`, `Aarav Mehta`, and the demo's `Always, The Crew` signer).
- `resolveTenantKey()` passes all cases: correct subdomain → tenant, apex/`www`/reserved →
  default, unknown subdomain → default, and `?tenant=` override wins.
- `eslint` → no new issues vs. baseline.

## Production note (what changes for real scale)

This client-side registry bundles every tenant — fine as a proof of isolation, not how
production runs. In the real SaaS the **same resolution moves server-side**: middleware
reads the `Host` header, looks up the tenant row, and loads *only that tenant's* config
JSON from the database / object storage. Wildcard DNS (`*.ourdomain.com`) + wildcard TLS
means a new tenant is a new row, not a new deploy. The resolver here is written so that
swap is a small change, not a rewrite. See
[02-architecture.md](./02-architecture.md#multi-tenancy--subdomains).

## Next (Phase 3)

Accounts + the questionnaire/builder that *writes* a tenant config (instead of us authoring
JSON by hand), live preview, and media upload — with the AI copywriting pass from
[04-ai-personalization.md](./04-ai-personalization.md). See
[03-roadmap.md](./03-roadmap.md#phase-3--accounts-builder--media-upload-2-weeks).
