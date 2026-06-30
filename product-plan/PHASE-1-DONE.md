# Phase 1 — Content-Schema Extraction ✅ DONE

**Goal (from [03-roadmap.md](./03-roadmap.md#phase-1--content-schema-extraction-the-keystone)):**
make `App.jsx` render the existing site *entirely from a config object*, with zero
hardcoded content — proving the renderer is config-driven and ready to be filled by a
questionnaire / stored as a per-tenant DB row.

**Status: complete.** The original Nidhi site now renders, pixel-faithfully, from a single
JSON config. The build passes and there are zero new lint regressions vs. the original.

## What changed

| File | Change |
|---|---|
| **`src/siteConfig.json`** *(new)* | The entire site's content as one JSON-serializable object — recipient, author, auth, dates, songs, copy, and all 18 story chapters (with 8 quizzes), feast photos, love quotes, reasons, secret messages, promises. |
| **`src/App.jsx`** | Now a **pure renderer**. All hardcoded constants (`MEMORIES`, `FEAST_PHOTOS`, `SONG_LIST`, `LOVE_QUOTES`, `REASONS_I_LOVE_YOU`, `SECRET_MESSAGES`, `PROMISES`, the birthday/first-met dates, `AUTH_USER`/`AUTH_PASS`) and every inline literal (the name "Nidhi", the portrait path, the full name, the opening letter, intro/login/countdown prose, finale strings) are read from `siteConfig.json`. The only remaining literal "Nidhi" is one historical line in the file header comment. |

The trick that kept the diff small and safe: components already referenced module-level
constants (`MEMORIES`, etc.) by name, so those names were simply re-pointed at
`siteConfig.*`. No component logic changed — only where the data comes from.

## The config schema (proven shape)

```jsonc
{
  "recipient": { "name", "fullName", "portrait" },
  "author":    { "name" },
  "auth":      { "user", "pass" },
  "dates":     { "birthdayMonth", "birthdayDay", "birthdayMidnightUTC", "firstMetDate" },
  "songs":     { "list": [{ "url", "name" }], "birthdaySongUrl" },
  "copy":      { "intro", "openingLetter", "login", "letterDate", "countdownMessage", ... },
  "memories":  [ { "id", "name", "short", "when", "icon", "teaser", "message",
                   "video", "photos": [{ "url", "caption", "focus?", "fit?" }],
                   "food": [...], "quiz": { "q", "options", "correct", "right" } | null,
                   "ps?", "birthdayNote?" } ],
  "feastPhotos": [ { "url", "caption" } ],
  "loveQuotes": [string], "reasons": [{ "reason", "icon" }],
  "secretMessages": [string], "promises": [{ "text", "icon" }]
}
```

This is the **content schema** the rest of the product is built on
([02-architecture.md](./02-architecture.md#content-schema-the-heart-of-the-refactor)):
the questionnaire writes this JSON, the builder previews it, a tenant row stores it, and
the renderer (this `App.jsx`) reads it. Media URLs (`/media/...`) become object-storage
URLs in the multi-tenant version with no renderer change.

## How it was verified

- `npx vite build` → succeeds (no errors).
- `npx eslint src/App.jsx` → only the **same** unused-var warnings the original already
  had (`BIRTHDAY_MONTH`, `BIRTHDAY_DAY`, `useMemo`, …); **no new** issues introduced.
- Spot-checked the built bundle contains the recipient name, a unique photo caption, the
  opening-letter prose, a quiz question, and the finale P.S. — i.e. the config content
  actually flows through to the output.

## Next (Phase 2)

Subdomain middleware → resolve tenant by hostname → load this config + media manifest →
render. Seed two tenants from two JSON configs to prove isolation. See
[03-roadmap.md](./03-roadmap.md#phase-2--multi-tenant-rendering-1-week).
