# 08 — Feature Additions

Seven capabilities to fold into the product. Each notes **what it is**, **how to build
it (best practices)**, and **where it slots into the roadmap**
([03-roadmap.md](./03-roadmap.md)).

---

## 1) Aesthetic social sharing (Instagram / WhatsApp)

**Goal:** make every gift *want* to be posted — the share asset is itself marketing
(ties directly to [06-first-customers.md](./06-first-customers.md)).

**What to build:**
- **Auto-generated share cards**, on-brand and beautiful, in the formats people actually
  post: **9:16** (Instagram/WhatsApp Story, Reels cover) and **1:1** (feed). Each card =
  cinematic cover: hero photo, recipient name, occasion, a soft brand mark, and a
  "open the full story →" cue. Generated on publish, stored in object storage.
- **A 10–15s teaser reel** (the highest-converting format): cover → 3 photos → CTA, with
  music. Render server-side with **Remotion** or **ffmpeg** from a template.
- **Dynamic Open Graph / Twitter images** per tenant, so pasting the link *anywhere*
  (WhatsApp, IG bio, iMessage) unfurls into a gorgeous preview, not a bare URL.
- **In-app share flow** after the finale: a gentle prompt ("Loved it? Share a glimpse 💛")
  with one-tap buttons — **Instagram Story**, **WhatsApp**, **Download card**, **Copy
  link** — using the native **Web Share API** (`navigator.share`) on mobile.

**Best practices / tech:** server-side image gen with **Satori + resvg** or
**`@vercel/og`** (HTML/CSS → image); Remotion/ffmpeg for video. **Privacy-safe:** if the
gift is behind the recipient gate, the share card shows only the *cover/teaser*, never
private contents — and the buyer chooses what's shareable.

**Roadmap:** Phase 6 (template/marketing), but ship the static share card earlier (Phase 5)
because it fuels acquisition.

---

## 2) UPI + India-first payments

**Goal:** native, frictionless payment for an India-first audience.

**What to build:**
- Primary PSP: **Razorpay** (best DX in India; one integration covers **UPI** —
  Collect, **Intent/deep-link** to GPay/PhonePe/Paytm, and **UPI QR** — plus cards,
  netbanking, wallets). Alternatives: Cashfree, PhonePe PG, Paytm.
- **Razorpay Payment Links** are the secret weapon for non-tech buyers and the chat
  channels (§7): generate a link, send it over WhatsApp, they pay by UPI in two taps — no
  app login needed.
- **Flow:** create order server-side → Razorpay Checkout/Link (UPI/QR/intent) → **webhook
  `payment.captured`** (verify signature) → provision the tenant → deliver the live link.
- **INR-native pricing** (don't just convert dollars). Suggested: **₹999** base /
  **₹1,799** premium, **₹499** founding price for launch (mirrors the $15 idea in
  [07-launch-strategy.md](./07-launch-strategy.md)); renewal **₹299/yr**.
- Keep **Stripe** for international buyers later (route by geo).

**Best practices:** never touch card data (PSP-hosted checkout = PCI handled); verify
every webhook signature; idempotent provisioning keyed on order id; handle GST/invoicing
and keep INR/GST records; reconcile via webhooks, never trust client-side success.

**Roadmap:** Phase 4 (payments) — make **Razorpay/UPI the default gateway**, Stripe second.

---

## 3) Interactive landing page + customer support

**Goal:** a storefront that sells the emotion, and support channels a non-tech buyer trusts.

**Landing page (interactive):**
- An **embedded live demo** of a real gift (not a screenshot), template gallery with
  hover/scroll-triggered previews, real **reaction-video reels**, testimonials.
- A **"see it personalized in 10 seconds"** teaser: type a name → the cover re-renders
  with it, then "make the full one →".
- Scroll-driven, cinematic motion (Framer Motion / GSAP). Fast first paint; mobile-first.

**Customer support (India-appropriate):**
- **WhatsApp click-to-chat** (`wa.me`) button front-and-centre — the channel Indians
  trust most — plus it doubles as an entry to the WhatsApp builder (§7).
- **Live chat widget** (Crisp / Tawk.to free tier → Intercom later) with an **AI support
  bot** built on the provider-agnostic adapter
  ([04-ai-personalization.md](./04-ai-personalization.md)) trained on the FAQ.
- Help centre / FAQ, email support, a simple **status page**, and clear refund/again info.

**Roadmap:** Phase 6 (marketing site) for the full build; a basic validation page +
WhatsApp button ships in Phase 0/4 so you can sell while building.

---

## 4) Multi-tenant + best-practice DNS routing

**Goal:** scale to many tenants with zero per-customer DevOps, on their own subdomain (or
custom domain), securely.

**Best-practice routing:**
- **Wildcard DNS** `*.ourdomain.com` (single record) → one app resolves the tenant from
  the **Host header** server-side (no per-tenant deploy). Phase 2 already proves the
  resolution; production moves it server-side.
- **Wildcard TLS** auto-provisioned (Vercel/Cloudflare managed, or Let's Encrypt
  **DNS-01**). Apex uses **CNAME flattening / ALIAS**.
- **Subdomain hygiene:** RFC-1123 validation, **reserved-subdomain blocklist**
  (`www`, `app`, `api`, `admin`…), profanity filter, uniqueness check at checkout.
- **Custom domains (premium):** the canonical pattern is **Cloudflare for SaaS (SSL for
  SaaS)** or Vercel Domains / Caddy **on-demand TLS** — buyer adds a **CNAME** to their
  domain, we verify and issue a cert automatically. Automate via the provider's API.
- **Hardening:** **CAA** records, **DNSSEC**, sensible **TTLs**, health checks + failover,
  and the app/edge in front (Cloudflare) for WAF/DDoS (see §5).

**Roadmap:** Phase 2 (done, client-side proof) → server-side resolution + wildcard
DNS/TLS at the repo split; custom domains in Phase 6.

---

## 5) Security layer

**Goal:** protect strangers' precious personal media and your business. Treat this as a
cross-cutting workstream, not one phase.

- **Auth & sessions:** magic-link / OAuth (Google) + optional password hashed with
  **argon2/bcrypt**; secure, httpOnly, SameSite cookies; optional MFA; **bot protection**
  (Turnstile/captcha) on signup/checkout.
- **Tenant isolation:** **Postgres row-level security (RLS)** — every query scoped to
  `owner_id` / `tenant_id`; a user can only ever read/write their own apps. Media in
  **private buckets** served via **signed URLs**.
- **The recipient gate done right:** the current app ships a *client-side* password
  (`AUTH_USER`/`AUTH_PASS` in JS) — fine for a personal gift, **not secure for the
  product**. In the SaaS, the gate password is **hashed server-side** and verified via an
  API (or replaced with an unguessable signed URL token). *Flagged as a required change.*
- **Web hardening:** input validation + output encoding (XSS), **CSRF** protection,
  security headers (**CSP, HSTS, X-Frame-Options, Referrer-Policy**), per-IP/per-account
  **rate limiting**, **WAF + DDoS** at the edge (Cloudflare).
- **Payments:** PSP-hosted checkout (no card data on us); **verify all webhook
  signatures**; idempotency keys.
- **Media safety:** automated **nudity/CSAM scanning** on upload, report/takedown flow,
  audit trail tied to the paying account ([01-requirements.md](./01-requirements.md)).
- **Secrets & ops:** secrets in a vault/env (never client), dependency + secret scanning,
  audit logging, **encryption at rest + in transit**, backups, and **GDPR/DPDP
  (India)** data-deletion on request.

**Roadmap:** baked into every phase; the explicit hardening pass is **Phase 5 (trust &
safety)**.

---

## 6) Multiple apps per account

**Goal:** one account, many gifts over a lifetime (birthday, then anniversary, then a baby).

**What to build:**
- Data model already supports it: `users 1—* tenants`. The **dashboard ("My Gifts")**
  lists all apps — drafts and published — each with its own subdomain, status, billing,
  and **edit / duplicate / renew** actions.
- Each purchase **creates a new app** under the account; **per-app renewals**, account-level
  billing history. "**Duplicate**" lets someone reuse last year's gift as a starting point.

**Roadmap:** Phase 3 (dashboard) + Phase 4 (per-app checkout/renewal).

---

## 7) Non-tech buying channels (WhatsApp / Instagram / Google Forms) — *dashboard optional*

**Goal:** let non-technical buyers create and pay for a gift **without ever logging into a
dashboard.** This is a major differentiator for the India-first audience.

**Core idea — decouple "collecting the content" from "the dashboard."** Every channel is
just a *front door* that feeds one **normalized intake API** → the same
questionnaire-to-config pipeline (AI drafts copy via the adapter) → preview → **UPI payment
link** → provision → deliver the live link + share card **back in the same channel**. The
dashboard is **emailed only if they want it** — never required to get the gift made.

| Channel | How it works | Why it fits non-tech India |
|---|---|---|
| **WhatsApp chatbot** | **WhatsApp Business / Cloud API** (or an India BSP — **AiSensy, Interakt, Gupshup**, Twilio). A guided chat collects answers and **photos sent right in the chat**, AI drafts the copy, sends a preview link + **UPI payment link**, then replies with the live gift + share card on payment. | People already live in WhatsApp; sending photos in chat is second nature; UPI link pays in two taps. |
| **Instagram chatbot** | **Instagram Messaging API** (Meta) — DM flow, same pipeline. Pairs with IG ads: "DM us **GIFT** to start." | Ads run on IG → the DM *is* the funnel. |
| **Google Forms** | A structured form + Drive photo upload → **Apps Script / Make / Zapier webhook** → intake API → we generate it and send preview + payment link by WhatsApp/email. | Maximally familiar, zero app install. |
| **Concierge (white-glove)** | A human fills it from a WhatsApp conversation on the buyer's behalf, for a small fee. | The least-technical buyers, gifting help. |

**Email-optional account:** on creation we **auto-create a lightweight account** keyed to
their **phone/email** and send a **magic link** to a dashboard *if they want to edit or
manage later* — but everything (create, preview, pay, receive, share) works end-to-end in
the channel they came from. They can **claim the dashboard later** with that link.

**Best practices:** one **normalized intake schema** behind all channels (so there's one
backend, many front doors); resumable conversations (save partial state, continue later);
media received via chat goes through the same processing + moderation; idempotent
provisioning; consent + opt-in records for WhatsApp/IG messaging (Meta policy).

**Roadmap:** new **Phase 7 — ingestion channels** (after the core SaaS works in Phases
3–5), starting with **WhatsApp** (highest-leverage for India).

---

## Summary → roadmap mapping

| Feature | Primary phase |
|---|---|
| 1 · Social share cards / reels / OG | Phase 5 (static cards) → Phase 6 (reels) |
| 2 · UPI / Razorpay (India-first) | **Phase 4** (default gateway) |
| 3 · Interactive landing + support | Phase 6 (full) · basic page in Phase 0/4 |
| 4 · Multi-tenant + DNS best practices | Phase 2 (done) → server-side at repo split · custom domains Phase 6 |
| 5 · Security layer | Cross-cutting · explicit pass in **Phase 5** |
| 6 · Multiple apps per account | Phase 3 (dashboard) + Phase 4 (billing) |
| 7 · Non-tech channels (WhatsApp/IG/Forms) | **Phase 7** (WhatsApp first) |
