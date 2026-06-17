# Our Story Map & Feast 💛 — Setup Guide

A heartfelt, interactive birthday surprise for **Nidhi Arjariya Chhabra**.
The app lives in **`src/App.jsx`** (mounted by the tiny `src/main.jsx`) — a Vite +
React project. Everything is built; you just drop in your photos, food pics,
videos and a song.

---

## ▶️ How to run it
```bash
npm install      # first time only
npm run dev      # then open the http://localhost:____ link it prints
```
It's mobile-first, so it looks best on a phone.

---

## ☁️ Hosting it on Cloudflare Pages (recommended — yes, it works great)

This is a plain static site (`npm run build` → a `dist/` folder), which is exactly
what Cloudflare Pages serves. **All your photos/videos in `public/` get copied
into `dist/` and served automatically** — that's the "serving all the files" part.

### Method 1 — Connect your Git repo (auto-deploy on every push) ✅ easiest long-term
1. Put this project on GitHub (or GitLab). From this folder:
   ```bash
   git init && git add -A && git commit -m "Our Story Map"
   # create an EMPTY repo on github.com, then:
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. Go to **Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo and set:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. **Save and Deploy.** You'll get a free `https://<project>.pages.dev` link.
   Every `git push` re-deploys automatically.

### Method 2 — Upload directly (no Git needed)
```bash
npm run build
npx wrangler login          # opens browser, one-time
npx wrangler pages deploy dist --project-name nidhi-birthday
```
Or in the dashboard: **Create → Pages → Upload assets**, then drag in the `dist/`
folder.

### ⚠️ One thing to know about VIDEOS on Cloudflare Pages
Cloudflare Pages has a **25 MB limit per file** (and 20,000 files per deploy).
Photos are tiny, so they're no problem. For video:
- Keep clips **small** (a short, compressed `.mp4` under 25 MB) → put in `public/media/`.
- If a video is bigger, host it on **Cloudflare Stream** or **Cloudflare R2**, or on
  **Cloudinary**, and paste that URL into the trip's `video:` field instead.

> No other config needed. The map tiles, fonts and map library load from the
> internet automatically, so they work the same once hosted. (An internet
> connection is needed to show the map — that was always the case.)

> Want a custom domain (e.g. `forneveryou.com`)? In the Pages project →
> **Custom domains** → add it and follow the DNS steps.

---

## ✅ What's inside
- Cinematic **intro** that fades in with her name.
- A real **interactive map** (Leaflet, dark tiles) spanning India → Bali, golden dotted path.
- **Three views**: **Map** · **Timeline** · **Feast** (the food map of us).
- Per-trip memory cards with a **quiz → video → photos** reveal.
- Each card has **Moments** and **Food** photo tabs (swipeable gallery).
- **Feast view** = every dish, grouped by place, tap any to enlarge.
- The **"How Well Do You Know Us?"** quiz with hearts; finishing it unlocks the
  golden finale + a hidden love letter.
- Stats bar: Journeys · Countries · Memories · **Flavours** · Hearts.
- Ambient music toggle.

---

## 📍 WHERE TO HOST YOUR PHOTOS & VIDEOS

### Option A — the `public/` folder (recommended, easiest, private)
Because this is a real project, just drop files into the `public/` folder and
reference them with a leading slash. No accounts, no uploads, works offline.

```
public/media/bali-coconut.jpg
public/media/goa-clip.mp4
```
then in `src/main.jsx`:
```js
{ url: "/media/bali-coconut.jpg", caption: "Fresh coconut by the beach" }
video: "/media/goa-clip.mp4"
```
> Tip: make a folder `public/media/` and keep everything there.
> Big videos make the project heavy — keep clips short (a few seconds–a minute)
> or use Option B for video.

### Option B — host online and paste the URL
Good if you'd rather not store big files in the project (or you're deploying).
You need a **direct file link** (ends in `.jpg`/`.png`/`.webp` or `.mp4`).

| Service | Best for | Notes |
|---|---|---|
| **Cloudinary** (free tier) | photos **and** video | Best all-rounder; gives clean direct URLs, auto-optimises, free. |
| **ImgBB** / **Imgur** | photos | Quick; use the *direct image* link (right-click → Copy image address). |
| **GitHub** (this repo) | photos/small video | Put in `public/`, or use a raw.githubusercontent.com link. |
| **Supabase / Firebase Storage** | photos/video | If you want a tidy cloud bucket. |

Then just paste the link into `url:` or `video:`.

---

## ✍️ What to edit in `src/main.jsx`

### 1. 📸 Moments photos
Each trip's `photos: [ ... ]` list (places & candids). Paste a `url` + `caption`.

### 2. 🍲 Food photos
Each trip's `food: [ ... ]` list. **This is your one place to add all the food** —
it shows up in the card's *Food* tab **and** the *Feast* view automatically.
Add as many dishes as you want.

### 3. 🎬 Videos (optional)
Each trip has `video: ""`. Paste a **direct `.mp4`** link or a `/media/clip.mp4`
path. When she answers that trip's quiz, the video **plays**, and the **moment it
ends, the photos appear** (there's also a "Skip to photos" button).
> A YouTube *page* link won't work for the auto-advance — use an actual `.mp4`.
> If a trip has no video, the flow is simply: quiz → photos.

### 4. 🎵 Song
At the top: `const SONG_URL = "";` → a direct `.mp3`/`.m4a`
(e.g. `/media/ilahi.mp3`). Vibe: "Ilahi" or "Patakha Guddi".

### 5. 📍 Your new flat's coordinates
In the `flat` entry, replace `lat` / `lng` with your home's real coordinates
(right-click the spot in Google Maps → first two numbers).

> You can also personalise the hidden `ps:` line on the `flat` entry — the secret
> surprise shown after she aces the quiz.

---

## 💡 Polish ideas
- Add a short, soft 10–20s clip per trip — they hit hardest right after the quiz.
- Swap quiz answers for inside jokes only the two of you share.
- Point the finale P.S. at a real gift ("look inside the blue box…").

Happy birthday to Nidhi — go make her cry the good kind of tears. 💛
