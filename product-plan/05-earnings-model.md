# 05 — How Much Can You Earn? (The Money Model)

This is the part you asked me to teach. I'll build it bottom-up: what one sale earns you
after costs, what it costs to keep the lights on, then realistic monthly scenarios and
the levers that move the number. Base price is **$30** (your call), with an optional
premium tier and a small annual renewal.

> **Important honesty up front:** the numbers below show that *per-sale economics are
> excellent* (you keep ~$27–28 of every $30). The real variable in "how much will I
> earn" is **how many people you can reach** — i.e. marketing, not technology. I model
> sales volume as scenarios precisely because that's the lever you don't control with code.

## Pricing (recommended)

| Plan | Price | What the buyer gets |
|---|---|---|
| **Keepsake** | **$30 one-time** | 1 app, 1 year hosting, up to ~60 photos + 1 short video, "Made with ❤️" footer |
| **Forever** (upsell) | **$59 one-time** | More media, HD/longer video, footer removed, custom song, premium AI polish |
| **Renewal** | **$12 / year** | Keep the gift live after year one |
| **Custom domain** | **+$20 / year** | `theirname.com` instead of a subdomain |

Assume a conservative **blended average sale of ~$33** once a slice of buyers take Forever
or add-ons. I'll use the plain **$30** for the tables below to stay pessimistic.

## Unit economics (per app)

What it costs *you* to deliver one $30 app:

| Cost item | Per app | Notes |
|---|---|---|
| Stripe fee | ~$1.17 | 2.9% + $0.30 on $30 |
| AI copywriting | ~$0.05–0.15 | Haiku 4.5 (~$1/$5 per 1M tok); a few cents of tokens per build — see [04](./04-ai-personalization.md#b-default-models-cheap-for-text-per-your-instruction) |
| Media storage + serving (year 1) | ~$0.20–0.50 | Cloudflare R2: storage is cents/GB/mo; **bandwidth (egress) is free** — the usual killer is gone |
| Image/video processing | ~$0.05 | Serverless transcode on upload |
| Email (receipt + links) | ~$0.01 | Resend/Postmark free tiers cover early volume |
| **Total cost per app** | **≈ $1.50–2.00** | |
| **Contribution margin per app** | **≈ $28** | **~93% gross margin** |

The decisive design choices that make this work: **R2 has zero egress fees** (media
bandwidth, normally the #1 cost, is free), and **Haiku-tier AI is pennies**. Storage is
the only recurring per-app cost, and it's cents/month — which the **$12 renewal** more
than covers in year two.

## Fixed monthly costs (the platform itself)

These don't scale with sales until you're large:

| Item | Early (~$/mo) | Notes |
|---|---|---|
| Hosting (Vercel/Cloudflare) | $0–20 | Free tier covers low traffic |
| Database (Supabase/Neon) | $0–25 | Free tier, then ~$25 |
| Auth (Clerk/Supabase) | $0 | Free to ~10k users |
| Email, monitoring (Sentry), misc | $0–20 | Free tiers early |
| Domain + wildcard TLS | ~$2 | TLS is auto/free |
| **Total fixed** | **≈ $50–100/mo** | Stays flat for a long time |

Your **break-even is ~3–4 sales per month.** Everything above that is mostly profit.

## Monthly profit scenarios

Profit ≈ (sales × ~$28 margin) − ~$100 fixed. Renewals from prior years stack on top.

| Scenario | Sales / mo | Gross revenue | − costs | **≈ Monthly profit** | ≈ Annual |
|---|---|---|---|---|---|
| **Hobby / soft launch** | 20 | $600 | ~$140 | **~$460** | ~$5.5k |
| **Side income** | 100 | $3,000 | ~$300 | **~$2,700** | ~$32k |
| **Real business** | 500 | $15,000 | ~$1,100 | **~$13,900** | ~$167k |
| **Scaling** | 2,000 | $60,000 | ~$4,100 | **~$55,900** | ~$670k |

These use the pessimistic flat $30. With a realistic ~$33 blended sale (some Forever +
add-ons) and renewals compounding from year two, each row is **~10–20% higher**.

### The renewal flywheel (why year 2+ is better)

Year 1 is all new sales. From year 2, a fraction of last year's apps renew at $12 (near-
pure profit — storage is cents). If you sell ~100/mo (1,200/yr) and even **30% renew**,
that's ~360 renewals × $12 = **~$4,300/yr of recurring profit added on top**, growing
every year you operate. The longer you run, the larger this passive base gets.

## Seasonality — plan for spikes

Demand is **event-driven and seasonal**, which is good news if you prepare for it:

- **Valentine's Day (Feb)** — biggest single spike; the romantic templates sell hardest.
- **Christmas / New Year (Dec)** — gifting season, all occasions.
- **Mother's / Father's Day** — birthday/tribute templates.
- **Wedding season (spring–summer)** — wedding/anniversary templates.
- Plus a steady year-round base of birthdays and anniversaries (every day is *someone's*).

A single good Valentine's campaign can do a month's volume in a week. Pre-build inventory
of templates and ad creative before each spike.

## The real lever: cost to *acquire* a customer (CAC)

With **~$28 of margin per sale**, you can afford to pay to get customers and still profit:

- **Organic / viral (best ROI):** the product *is* the ad. Every gift is opened by a
  recipient and shown to friends; the "Made with ❤️ on [brand]" footer turns each sale
  into a tiny billboard. The emotional reveal (the cry-moment) is highly shareable on
  TikTok/Instagram Reels — short videos of real reactions are the cheapest growth you'll
  find. **Lean here first.**
- **Paid ads:** even at a $10–15 CAC, you net ~$13–18 per sale — payback is immediate
  (one purchase), so you can scale spend as long as CAC < margin.
- **SEO:** "anniversary gift website", "personalized birthday app", "digital memory book"
  — evergreen, compounding, free traffic once ranked.

**Rule of thumb:** as long as it costs you less than ~$28 to make a sale, spend more to
make more. That's an unusually forgiving unit economic.

## What would break the model (watch these)

- **Heavy video usage** blowing past storage/transcode assumptions → cap video length/
  count per plan, push large clips to Cloudflare Stream, charge for HD on Forever.
- **Low conversion** from visitor → buyer → the marketing problem, not the tech problem.
  Validate willingness-to-pay early with a landing page + the existing demo + pre-orders.
- **Refund/chargeback abuse** → publish only after payment; clear refund policy (full
  before publish, none after media is hosted).
- **Churned renewals** with rising storage → purge media after a grace period when an app
  expires unpaid (already in the [provisioning lifecycle](./02-architecture.md#provisioning-flow)).

## Bottom line

- **You keep ~$28 of every $30** — a ~93% margin, because R2 kills bandwidth cost and
  Haiku-tier AI is pennies.
- **Break-even is ~3–4 sales/month;** the platform costs almost nothing to idle.
- **Realistic outcomes** span ~$460/mo (hobby) to ~$14k/mo (real business) purely on
  sales volume, plus a **compounding renewal base** from year two.
- **The only thing standing between you and the higher rows is reach** — so put the
  energy into the shareable cry-moment videos and a couple of seasonal campaigns, not
  into over-building the tech.
