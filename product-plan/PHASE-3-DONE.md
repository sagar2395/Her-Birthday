# Phase 3 — The Builder (questionnaire → config) ✅ core built

**Goal (from [03-roadmap.md](./03-roadmap.md#phase-3--accounts-builder--media-upload-2-weeks)):**
a guided builder that *writes* a tenant config (instead of us hand-authoring JSON), with
live preview and an AI copywriting pass — so a non-coder can create a gift.

**Status: the front-end core is built and working.** A wizard produces the exact config
Phases 1–2 render, previews it live (instantly *and* full-fidelity through the real
renderer), drafts copy via the provider-agnostic AI adapter, and exports the config JSON.
The backend pieces (real accounts, DB-backed dashboard, media upload to R2, a real AI key
behind a server proxy) land with the repo split — they need infrastructure, not more
front-end.

## What was built

| File | Role |
|---|---|
| **`src/builder/Builder.jsx`** | The 4-step wizard: *occasion & who → chapters → letter & extras → review*. Editable everything; add/remove chapters, photos, quizzes; mark the finale. |
| **`src/builder/defaultConfig.js`** | `makeDefaultConfig(occasion)` produces a **complete, renderer-safe** config (no field the renderer reads is ever missing → the preview never crashes), plus per-occasion copy/voice presets (birthday / anniversary / friendship). |
| **`src/ai/textProvider.js`** | The **provider-agnostic AI adapter** from [04-ai-personalization.md](./04-ai-personalization.md): one `TextProvider` interface, a tier system (`cheap`/`standard`/`premium`), a deterministic **MockProvider** default, and a commented `AnthropicProvider` stub (cheap **Haiku** tier) showing exactly where the real model plugs in behind the same interface. |
| **`src/siteConfig.js`** | Added a **preview override**: `/?preview=1` renders the real app from the builder's draft (stashed in `localStorage`) — full-fidelity preview through the *same* renderer. |
| **`src/main.jsx`** | `/?builder=1` opens the builder; everything else renders the gift. |

## How to use it (local)

- **Build a gift:** open `/?builder=1` → fill the wizard → watch the live preview pane
  update as you type → "✨ Draft with AI" to auto-write a chapter note or the letter
  (editable) → step 4 to **download `config.json`** or **open the full live preview**.
- **Full preview:** the review step stashes the draft and opens `/?preview=1` in the real
  renderer (login gate auto-skipped for preview).

## Proven end-to-end

- `vite build` passes; all new files **lint clean**.
- A generated config has **every** top-level and `copy.*` key the renderer needs
  (verified) — so any partially-filled gift still previews without crashing.
- Occasion presets apply (e.g. anniversary → "Happy Anniversary" copy + voice).
- The AI adapter returns a warm, **editable** draft at **$0** (mock) and is swappable to
  any real provider via one factory change.

## What's intentionally deferred to the repo split (needs a backend)

- **Real accounts + the "My Gifts" dashboard** (multiple apps per account —
  [08 §6](./08-feature-additions.md#6-multiple-apps-per-account)).
- **Media upload to R2** (here, photos are URLs; the builder UI is upload-ready).
- **Real AI provider** behind a server proxy that holds the key (the adapter is ready —
  flip `VITE_AI_PROVIDER` and uncomment `AnthropicProvider`).
- **Persisting the config to a tenant row** + the publish/pay flow (Phase 4, UPI-first).

## Next (Phase 4)

Subdomain picker + **Razorpay/UPI checkout** → webhook → write the tenant row from this
config → deliver the live link. See
[03-roadmap.md](./03-roadmap.md#phase-4--payments--provisioning-1-week) and
[08 §2](./08-feature-additions.md#2-upi--india-first-payments).
