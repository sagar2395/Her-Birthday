/*
  ════════════════════════════════════════════════════════════════════════════
   AI TEXT PROVIDER — provider-agnostic adapter  (see product-plan/04-ai-personalization.md)
   ════════════════════════════════════════════════════════════════════════════

  The builder talks to ONE narrow interface. Providers implement it; product
  code never imports a vendor SDK directly. Swapping Claude ↔ any other model is
  a config change, not a code change. The app requests a *tier*
  ("cheap" | "standard" | "premium"), and each provider maps that to a concrete
  model — so upgrading model IDs never touches callers.

  In this front-end-only phase the default provider is a deterministic MOCK
  (you can't safely hold an API key in a browser). The real AnthropicProvider —
  defaulting to the cheap Haiku tier for copy — plugs in behind the SAME
  interface once there's a backend to proxy the key. The stub below shows where.
*/

/**
 * @typedef {Object} GenRequest
 * @property {string} system   Voice / tone / relationship instructions.
 * @property {string} prompt   The filled prompt (the buyer's short answers).
 * @property {"cheap"|"standard"|"premium"} [tier]
 * @property {number} [maxOutputTokens]
 * @property {Record<string,string>} [metadata]
 *
 * @typedef {Object} GenResult
 * @property {string} text
 * @property {string} providerId
 * @property {string} modelId
 * @property {{inputTokens:number,outputTokens:number,costUsd:number}} usage
 *
 * @typedef {Object} TextProvider
 * @property {string} id
 * @property {(req: GenRequest) => Promise<GenResult>} generate
 */

/** A deterministic, offline draft generator — stands in for a real model. */
class MockProvider {
  id = "mock";

  async generate(req) {
    const text = draftFromPrompt(req);
    return {
      text,
      providerId: this.id,
      modelId: "mock-warm-v1",
      usage: { inputTokens: 0, outputTokens: 0, costUsd: 0 },
    };
  }
}

/*
// Real provider — same interface. Plugs in once a backend proxies the API key.
// Defaults to the CHEAP tier (Haiku) for short, warm copy; see doc 04.
class AnthropicProvider {
  id = "anthropic";
  constructor(modelMap) { this.modelMap = modelMap; } // { cheap:"claude-haiku-4-5", ... }
  async generate(req) {
    const model = this.modelMap[req.tier ?? "cheap"];
    const res = await fetch("/api/ai/generate", {           // server proxies the key
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model, system: req.system, prompt: req.prompt }),
    });
    const data = await res.json();
    return { text: data.text, providerId: this.id, modelId: model, usage: data.usage };
  }
}
*/

const PROVIDERS = {
  mock: () => new MockProvider(),
  // anthropic: () => new AnthropicProvider({ cheap: "claude-haiku-4-5", standard: "claude-sonnet-4-6", premium: "claude-opus-4-8" }),
};

let _provider = null;
/** Factory — the one place that knows which providers exist. */
export function getTextProvider() {
  if (_provider) return _provider;
  const id =
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_AI_PROVIDER) ||
    "mock";
  _provider = (PROVIDERS[id] || PROVIDERS.mock)();
  return _provider;
}

/* ── mock drafting: warm, on-tone, derived from the inputs (always editable) ── */

function draftFromPrompt({ system = "", prompt = "" }) {
  const name = firstMatch(system, /recipient:\s*([^\n;]+)/i) || "you";
  const tone = /husband|wife|love|partner/i.test(system)
    ? "love"
    : /friend|crew/i.test(system)
    ? "friend"
    : /parent|baby|newborn/i.test(system)
    ? "tender"
    : "warm";
  const detail = prompt.trim().replace(/\s+/g, " ");
  const seed = detail || "this moment";

  const openers = {
    love: [
      `${name}, when I think of ${lower(seed)}, my whole heart goes quiet.`,
      `There's a kind of love that lives in the small things — and ${lower(seed)} is one of mine.`,
    ],
    friend: [
      `${name}, ${lower(seed)} is the stuff our best stories are made of.`,
      `Some memories just stick — and ${lower(seed)} is right at the top.`,
    ],
    tender: [
      `${name}, ${lower(seed)} is a part of you I never want to forget.`,
      `Long before the world knew you, there was ${lower(seed)} — and already, so much love.`,
    ],
    warm: [
      `${name}, ${lower(seed)} is one of those moments worth holding onto.`,
      `Of all the things to remember, ${lower(seed)} is one of the brightest.`,
    ],
  };
  const closers = [
    "I hope you feel, reading this, exactly how much you're loved.",
    "Here's to this — and to everything still ahead.",
    "Some things only grow more precious with time. This is one of them.",
  ];

  const o = pick(openers[tone], seed);
  const c = pick(closers, seed + tone);
  const middle = detail
    ? `${capitalize(detail)} — and somehow it says everything.`
    : `It's a small thing, and it means the world.`;
  return `${o} ${middle} ${c}`;
}

const lower = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
function firstMatch(s, re) { const m = re.exec(s || ""); return m && m[1] && m[1].trim(); }
function pick(arr, seedStr) {
  let h = 0;
  for (const ch of String(seedStr)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return arr[h % arr.length];
}
