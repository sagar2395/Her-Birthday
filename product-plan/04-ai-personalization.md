# 04 — AI Personalization (Provider-Agnostic, Editable, Cheap)

The emotional core of this product is the writing — the "husband's voice" prose that
makes a stranger cry. We recreate that at scale by turning short questionnaire answers
into warm, personal copy. Three hard requirements drive the design:

1. **Provider-agnostic** — Claude today, but any model can be swapped in behind an
   adapter without touching product code.
2. **Cheap by default** — use a small/fast model for text; reserve bigger models for
   when quality demands it.
3. **Always editable** — AI output is a *draft*, never the final word. Every generated
   field lands in an editor the buyer controls.

## A. The adapter (the abstraction you asked for)

Define one narrow interface that all of the app talks to. Providers implement it; the
rest of the codebase never imports a vendor SDK directly.

```ts
// The only surface the app knows about.
export interface TextProvider {
  readonly id: string;                       // "anthropic" | "openai" | "local" | ...
  generate(req: GenRequest): Promise<GenResult>;
  // optional: stream(req): AsyncIterable<string>  for live "writing…" UX
}

export interface GenRequest {
  system: string;                            // role/voice/tone instructions
  prompt: string;                            // the filled prompt template
  maxOutputTokens?: number;
  // quality tier the *app* asks for; the adapter maps it to a concrete model
  tier?: "cheap" | "standard" | "premium";
  metadata?: Record<string, string>;         // tenant id, chapter id — for logging/limits
}

export interface GenResult {
  text: string;
  providerId: string;
  modelId: string;
  usage: { inputTokens: number; outputTokens: number; costUsd: number };
}
```

Key design choices:

- **The app requests a *tier*, not a model.** `cheap` / `standard` / `premium` map to
  concrete models *inside* each provider. Swapping providers, or upgrading a model id,
  is a one-line config change — no caller edits.
- **Selection is config-driven**, e.g. `AI_PROVIDER=anthropic`, with a per-tier model
  map. A factory returns the right `TextProvider` at startup.
- **Cost is returned on every call** so we can meter per-tenant spend and enforce caps
  (see [05-earnings-model.md](./05-earnings-model.md)).
- **No vendor types leak.** `GenRequest`/`GenResult` are ours. The Anthropic SDK lives
  only inside `AnthropicProvider`; an `OpenAIProvider` (or a mock for tests) implements
  the same interface.

```ts
// Factory — the one place that knows which providers exist.
const PROVIDERS: Record<string, () => TextProvider> = {
  anthropic: () => new AnthropicProvider(MODEL_MAP.anthropic),
  // openai: () => new OpenAIProvider(MODEL_MAP.openai),
};
export const textProvider = PROVIDERS[process.env.AI_PROVIDER ?? "anthropic"]();
```

## B. Default models (cheap for text, per your instruction)

Use the small/fast tier for the bulk of copywriting; it's more than good enough for
short, warm, first-draft prose, and the cost is negligible.

| Tier | Anthropic model (default mapping) | Price (in / out per 1M tok) | When used |
|---|---|---|---|
| **cheap** *(default for all copy)* | `claude-haiku-4-5` | $1 / $5 | Chapter messages, teasers, quiz suggestions, letter drafts |
| **standard** | `claude-sonnet-4-6` | $3 / $15 | "Make it more emotional / longer" re-rolls if the buyer wants better |
| **premium** | `claude-opus-4-8` | $5 / $25 | Optional "polish my whole story" upsell on a higher tier |

> **Cost reality:** a full build drafts ~8–10 chapters + a finale letter ≈ a few
> thousand output tokens. On Haiku that's **single-digit cents per app**, even with a
> couple of re-rolls. AI is not a meaningful cost driver — see the model in
> [05-earnings-model.md](./05-earnings-model.md#unit-economics-per-app).

The `AnthropicProvider` uses the official SDK with adaptive thinking off for these short
generations (latency matters more than deep reasoning here) and streams output so the
builder can show a live "writing your story…" effect.

## C. Editable by design

- Every AI-generated field is stored as **two values**: the `aiDraft` and the
  `final` (what the buyer edited). The renderer always uses `final`; `final` defaults
  to `aiDraft` until touched.
- The builder shows each draft in a normal text field with **"✨ Rewrite"**,
  **"Make it warmer / shorter / funnier"**, and **"Undo to my version"** controls. A
  rewrite calls the adapter again (optionally bumping the tier) but never overwrites the
  buyer's manual edits without confirmation.
- **Tone presets** map to system prompts per template/occasion ("a husband writing to
  his wife", "a parent to a newborn", "a best friend, playful and teasing", "a gentle,
  reverent tribute"). The buyer picks the voice; the adapter fills the `system` field.
- Strong **human-written fallback templates** ship for every occasion, so the product
  works even if AI is disabled, rate-limited, or the buyer wants zero AI involvement.

## D. Prompt structure (kept out of provider code)

Prompts are data, not code — stored per template/occasion and composed at runtime, so
they're decoupled from whichever provider is active:

```
system:  voice + relationship + tone preset + "write 2–4 warm sentences, second person,
         specific not generic, no clichés, leave room for the reader's own memories"
prompt:  the buyer's short answers for THIS chapter
         (place, date, what happened, an inside detail, how it felt)
```

This separation means switching from Claude to another provider changes *nothing* about
the prompts or the product — only the `TextProvider` implementation behind the adapter.

## E. Safety & guardrails (cheap to add, important to have)

- Cap tokens per call and **re-rolls per build** (e.g. 3 free re-rolls/chapter) to bound
  cost and abuse.
- Log `usage.costUsd` per tenant; alert on anomalies.
- Run generated text through a light profanity/PII check before saving (the buyer's
  *uploaded media* still goes through the heavier moderation in
  [02-architecture.md](./02-architecture.md#media-pipeline)).
- Never send the buyer's media to the text model — only their typed answers.
