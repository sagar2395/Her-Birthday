# Splitting this into its own product repo

You're ready to move the product out of the personal-gift repo and into a dedicated one
you'll build the SaaS in. This branch (`claude/personalized-app-feasibility-f3hz66`) is a
clean, self-contained seed: the config-driven renderer, multi-tenant resolver, the builder,
the AI adapter, and the full `product-plan/`.

> **Note:** the assistant can't create the new GitHub repo for you in this session — its
> GitHub access is scoped to this repo only. So **you** create the empty repo (one click /
> one command), then run the push below. Everything else is ready.

## Recommended: new repo, history preserved

Keeps the commit history of this branch as the new repo's `main`.

```bash
# 1) Create an EMPTY repo on GitHub named e.g. `gift-app` (no README/license).
#    UI: github.com/new      or, if you have gh:  gh repo create <you>/gift-app --private

# 2) From a local clone of THIS repo, on this branch:
git checkout claude/personalized-app-feasibility-f3hz66

# 3) Point a new remote at the new repo and push this branch as `main`:
git remote add product https://github.com/<you>/gift-app.git
git push product claude/personalized-app-feasibility-f3hz66:main

# 4) In the new repo, set `main` as default and start working there.
git clone https://github.com/<you>/gift-app.git
cd gift-app && npm install && npm run dev
```

That's it — the new repo has the working app + the whole plan, with history.

## Alternative: clean seed (no history)

If you'd rather start the product repo with a single fresh commit:

```bash
# from a checkout of this branch
rm -rf .git
git init && git add -A && git commit -m "Seed: config-driven multi-tenant gift app + product plan"
git branch -M main
git remote add origin https://github.com/<you>/gift-app.git
git push -u origin main
```

## What to do right after the split

1. **Rename** in `package.json` (`"name"`) and the README to your chosen brand.
2. **Keep the original `sagar2395/her-birthday` repo** as Nidhi's personal gift — don't
   reuse it for the product. The product lives in the new repo from here on.
3. **`.env.local`** — copy from `.env.example`; add backend secrets as you reach Phase 4.
4. **Pick the stack for Phase 4** (per [`product-plan/02-architecture.md`](./product-plan/02-architecture.md)):
   Next.js + Postgres (Supabase/Neon) + **Razorpay (UPI)** + Cloudflare R2. Suggested
   target layout for the new repo as the backend grows:

   ```
   apps/web/            Next.js — marketing site, dashboard, builder, tenant renderer
   apps/web/app/api/    server routes: AI proxy, Razorpay webhook, media upload, provisioning
   packages/renderer/   the current gift renderer (App.jsx & co.), as a shared package
   packages/config/     the config schema + types (today's src/tenants shape)
   channels/whatsapp/   the WhatsApp intake bot (Phase 7)
   ```

   You don't have to adopt that on day one — the current flat Vite app keeps working. Move
   to it when you add the Next.js backend.

5. **First Phase-4 task:** wire the builder's exported config + a **Razorpay UPI** payment
   link → on `payment.captured` webhook, write a tenant row and publish the subdomain. See
   [`product-plan/03-roadmap.md`](./product-plan/03-roadmap.md#phase-4--payments--provisioning-1-week).
