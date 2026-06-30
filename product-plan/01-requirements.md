# 01 — What It Takes To Be Sellable

This is the gap between "a beautiful one-off" and "a product strangers will pay
for and trust with their memories."

## A. Product surfaces (what we have to build)

### 1. Marketing site (the storefront)
- Landing page that *shows* the magic (live demo of each template, muted autoplay).
- Template gallery with previews per occasion.
- Pricing, FAQ, example sites, testimonials.
- This sells the emotion — it must feel as good as the product.

### 2. Accounts
- Sign up / log in (email + magic link or OAuth Google).
- Dashboard: "My apps" — drafts, published sites, subdomains, status, edit/renew.
- Buyers may make several apps over time (birthday, then anniversary, then a baby).

### 3. The questionnaire / builder (the core differentiator)
- **Pick an occasion template** → a guided, multi-step wizard, not a code editor.
- Collects: recipient name & relationship, key dates, the "chapters"/memories
  (place, date, a prompt-driven story, photos, optional video), quiz questions,
  the final letter, song choice, private-gate on/off + password.
- **AI-assisted copywriting:** from short answers ("how did you meet?", "what do
  you love about them?") the builder drafts warm, personal prose in the chosen
  tone using the Claude API — **always editable**, never final. This recreates the
  "written in a husband's voice" magic at scale.
- **Live preview** of the actual app as they fill it in.
- Save draft / resume later.

### 4. Media upload & management
- Drag-drop photos/videos/audio, reorder, crop/set focal point (the existing
  `focus`/`fit` per-photo controls map directly to this), caption each item.
- Client-side validation (type, size, count per plan) + server-side processing.

### 5. Checkout & provisioning
- Choose subdomain (`their-name.ourdomain.com`), availability check.
- Stripe checkout (one-time + optional hosting renewal).
- On payment: build/publish the site, point the subdomain at it, email the buyer
  the live link + a shareable card.

### 6. Published site (the gift itself)
- The rendered app on `name.ourdomain.com`, optionally behind the recipient gate.
- "Made with ❤️ on [OurBrand]" footer (free marketing) — removable on a higher tier.

### 7. Admin / ops (internal)
- Tenant list, moderation queue, takedown tooling, refunds, storage usage,
  failed-build alerts.

## B. The 8 occasion templates

One shared **engine** (intro → chapters → optional map/timeline → optional quiz →
finale letter → music). Templates differ in **palette, typography, copy tone,
default section mix, iconography, and questionnaire prompts** — *not* in rewritten
components. Launch with the ★ starred ones; add the rest after revenue.

| # | Template | Occasion | Vibe / palette | Signature sections |
|---|---|---|---|---|
| 1 ★ | **Our Story Map** | Anniversary / couples | Warm gold on ink, cinematic | Journey map, timeline, "how well do you know us" quiz, love letter, feast |
| 2 ★ | **The Birthday Atlas** | Birthday (someone you love) | Festive gold/rose, confetti | Countdown to midnight, memory chapters, "reasons I love you", surprise finale |
| 3 ★ | **Two Become One** | Wedding / engagement | Elegant ivory & blush | Our-story timeline, the proposal reveal, optional RSVP, gallery |
| 4 | **Hello, Little One** | Newborn / baby announcement | Soft pastel, gentle | "The day you arrived", milestone timeline, letter to baby, family gallery |
| 5 | **Be My Valentine** | Valentine's Day | Deep red & gold, punchy | Short & intense: reasons, hearts burst, one perfect letter |
| 6 | **For My Person** | Best-friend tribute / friendship / farewell | Playful, bright | Inside-jokes quiz, "our greatest hits" memories, group gallery |
| 7 | **The Long Way Here** | Graduation / achievement | Bold, triumphant | Journey timeline, messages-from-people wall, congratulations finale |
| 8 | **In Loving Memory** | Memorial / tribute | Quiet, reverent, warm | Life timeline, gallery, guestbook of memories, candle finale |

> Templates 1, 2, and the existing finale/quiz/map machinery already exist in
> `App.jsx`. Templates 5 and 6 are *subsets* of what's built. The newborn,
> wedding, graduation, and memorial themes mostly need new copy/palette + one or
> two new section types (RSVP, messages-wall, guestbook).

## C. Commercial & legal requirements

- **Payments:** Stripe (Checkout + Billing for renewals). Tax handling via Stripe Tax.
- **Pricing tiers:** see [03-roadmap.md](./03-roadmap.md#pricing--cost-model).
- **Refund policy:** digital good; clear rules (e.g., full refund before publish,
  none after, given media is hosted).
- **Terms of Service + Acceptable Use Policy:** ownership of uploaded content,
  prohibited content, license we need to host/process it.
- **Privacy Policy + data protection:** GDPR/CCPA basics — what we store, deletion
  on request, retention after non-renewal, sub-processors (storage, Stripe, AI).
- **Content moderation:** automated scan on upload (nudity/CSAM), report + takedown
  flow, audit trail tied to the paying account.
- **Email/notifications:** transactional (receipt, live link, renewal reminder,
  expiry warning) — via Resend/Postmark.

## D. Non-functional requirements

- **Mobile-first** — the gift is opened on a phone (already true of the app).
- **Performance** — fast first paint even with heavy media; lazy-load galleries,
  responsive/optimized images, preconnect to media CDN.
- **Reliability** — a published gift must not 404 on the recipient's birthday.
  Health checks + uptime monitoring on tenant routing.
- **Accessibility** — captions, reduced-motion option (lots of animation today),
  keyboard nav.
- **Observability** — error tracking (Sentry), build/publish success metrics,
  storage-usage per tenant for billing.
- **Backups** — buyers' media and configs are irreplaceable to them; back up storage
  + DB.
