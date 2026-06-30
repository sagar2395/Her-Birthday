# 09 — PWA + Reaction Capture

Two more features. The second is strategically important: it turns the gift itself into a
**reaction-video factory**, which is the #1 growth channel in
[06-first-customers.md](./06-first-customers.md).

---

## 8) Progressive Web App (installable on mobile)

**Goal:** the gift installs to the home screen like a native app — full-screen, no browser
chrome, fast, and works on a flaky connection at the birthday dinner.

**What to build:**
- **Web App Manifest** per gift (`manifest.webmanifest`): name = the recipient ("Nidhi's
  Story"), icons (use the recipient portrait → generated icon set), `display:
  "standalone"`, theme/background `#0a0e22`, portrait orientation, start URL = the gift.
- **Service worker** for installability + an **offline app shell**: precache the JS/CSS
  shell and cache media on first view (stale-while-revalidate), so once opened the gift
  replays even with no signal. Keep media cache size-bounded.
- **Add-to-home-screen prompt**: a tasteful in-app "Install this gift 💛" button
  (capture `beforeinstallprompt` on Android; iOS shows manual "Add to Home Screen"
  instructions). Best shown *after* the finale, not on arrival.
- **Per-tenant manifest**: since each subdomain is its own origin-path, the manifest and
  icons are generated from that tenant's config (name + portrait).

**Best practices / tech:** use **`vite-plugin-pwa`** (Workbox under the hood) — it
generates the service worker, precache manifest, and handles updates. Test installability
with Lighthouse. Scope the SW per tenant; version the cache to avoid stale shells on
deploy.

**Why it matters here:** an installed PWA gives **persistent camera permission**,
**reliable full-screen**, and **`navigator.share` with files** — all of which the reaction
capture below depends on. PWA is a prerequisite for a smooth capture experience.

**Roadmap:** small and high-value — ship in **Phase 5/6** (and it's cheap to prototype on
the current Vite app via `vite-plugin-pwa`).

---

## 9) Reaction capture — record the gift *and* the recipient's face, then share

**Goal:** when someone opens their gift, capture **both** the on-screen experience **and
their reaction**, then let them **share to social** or **save to the phone** — one tap.
This is the cry-moment clip that *is* your advertising, captured automatically instead of
hoping someone films it.

### The opt-in flow (consent-first)

1. On open (PWA, mobile), offer a clear choice: **"Want to capture your reaction? 🎥"** →
   *Turn on camera* / *Start recording* / *No thanks*. Nothing records without explicit
   opt-in; show a recording indicator the whole time.
2. They experience the gift; the front camera + the app are captured together.
3. On stop: **Share as video** (Instagram / WhatsApp / etc.) or **Save to phone** — and
   optionally **delete**.

### How to capture "both together" (honest about platform limits)

There are two paths; ship the robust one first.

**A) Live composite — best where supported (mainly desktop / Android Chrome).**
- `getUserMedia` for the **camera**; `getDisplayMedia` to capture the **app surface**.
- Draw both onto a **`<canvas>`** every frame (app full-frame + camera as a
  picture-in-picture bubble), capture the canvas with **`canvas.captureStream()`** +
  **`MediaRecorder`** → one combined `webm`/`mp4`.
- ⚠️ **Mobile caveat:** `getDisplayMedia` (screen capture) is **not available on iOS
  Safari** and is unreliable on mobile in general. So live screen-capture compositing is a
  *desktop-first* path, not the mobile default.

**B) Robust cross-platform path — capture reaction on-device, composite server-side.**
- On the phone, record **only the front camera** with `MediaRecorder` (this *is* reliable
  on mobile PWAs) — that's the precious half (the face).
- We already generate a **share reel / walkthrough of the gift** (feature
  [§1](./08-feature-additions.md#1-aesthetic-social-sharing-instagram--whatsapp)). After
  recording, **stitch** the reaction with the gift reel **server-side** (ffmpeg / Remotion)
  into a polished **split-screen or PiP** video — captioned, on-brand, ready to post.
- This sidesteps mobile screen-capture entirely and produces a *better-looking* result
  than a raw screen recording. **Make this the default on mobile.**

> Net: **Path B (record face on-device → server stitch with the gift reel)** is the
> reliable, good-looking default everywhere; **Path A (live canvas composite)** is a nice
> enhancement on desktop/Android where `getDisplayMedia` works.

### Share & save

- **Share:** **Web Share API Level 2** — `navigator.share({ files: [videoFile], text, url })`
  opens the native share sheet (Instagram Stories/Reels, WhatsApp, etc.). Works best from
  an **installed PWA** (feature 8). Provide platform fallbacks (download + "open Instagram").
- **Save:** `a.download` / the File System Access API where available → straight to the
  camera roll / files.

### Privacy & trust (non-negotiable)

- **Explicit opt-in**, persistent recording indicator, easy stop + **delete**.
- **On-device by default**: the reaction never leaves the phone unless they choose to
  share/stitch. If server stitching is used, upload over TLS, process, return, and **purge**
  — with clear consent and a short retention window.
- The **gifter** (buyer) and the **recipient** are different people — get the recipient's
  consent in-flow (they're the one on camera), and let them control the result.

### Why this is a growth flywheel

Feature [06](./06-first-customers.md) says the reaction video is the cheapest, highest-ROI
marketing. This feature **manufactures that exact asset automatically**, polished and
share-ready, at the emotional peak — turning every gift opened into potential viral content
(with consent). It's the single most strategically aligned feature in the plan.

**Roadmap:** **Phase 6** (after PWA in 5/6 and the share-reel pipeline in §1), since the
robust path reuses the server-side reel renderer. A camera-only "record your reaction +
download" MVP can ship earlier once PWA lands.
