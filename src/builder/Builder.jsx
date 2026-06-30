/*
  ════════════════════════════════════════════════════════════════════════════
   THE BUILDER  (Phase 3) — the questionnaire that WRITES a tenant config.
   ════════════════════════════════════════════════════════════════════════════

  A guided wizard (not a code editor) that turns a buyer's answers into the exact
  JSON config Phases 1–2 render. It includes:
    • a live inline preview that updates as you type,
    • "✨ Draft with AI" buttons (provider-agnostic adapter; mock by default),
    • a one-click full-fidelity preview in the real renderer (/?preview=1),
    • config export (download / copy JSON) — the deliverable a backend would store.

  Backend pieces (real auth, DB, media upload to R2, real AI key behind a proxy)
  arrive with the repo split; this proves the questionnaire→config→render pipeline.
*/
import { useMemo, useState } from "react";
import { makeDefaultConfig, makeChapter, makeQuiz, OCCASIONS, voiceFor } from "./defaultConfig.js";
import { getTextProvider } from "../ai/textProvider.js";

const STEPS = ["Occasion & who", "The chapters", "Letter & extras", "Review & preview"];

export default function Builder() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState(() => makeDefaultConfig("birthday"));
  const provider = useMemo(() => getTextProvider(), []);

  const patch = (updater) => setConfig((c) => structuredCloneSafe(updater(structuredCloneSafe(c))));

  return (
    <div className="bld">
      <style>{CSS}</style>
      <header className="bld-top">
        <div className="bld-brand">Gift Builder <span>· {provider.id} AI</span></div>
        <div className="bld-steps">
          {STEPS.map((s, i) => (
            <button key={s} className={"bld-step" + (i === step ? " on" : "") + (i < step ? " done" : "")} onClick={() => setStep(i)}>
              <b>{i + 1}</b> {s}
            </button>
          ))}
        </div>
      </header>

      <div className="bld-body">
        <main className="bld-form">
          {step === 0 && <StepWho config={config} patch={patch} />}
          {step === 1 && <StepChapters config={config} patch={patch} provider={provider} />}
          {step === 2 && <StepLetter config={config} patch={patch} provider={provider} />}
          {step === 3 && <StepReview config={config} />}

          <div className="bld-nav">
            <button disabled={step === 0} onClick={() => setStep((s) => s - 1)}>← Back</button>
            <button className="primary" disabled={step === STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>Next →</button>
          </div>
        </main>

        <aside className="bld-preview">
          <div className="bld-preview-head">Live preview</div>
          <PreviewPane config={config} />
        </aside>
      </div>
    </div>
  );
}

/* ── Step 1: occasion + recipient ── */
function StepWho({ config, patch }) {
  return (
    <section>
      <h2>Who is this for?</h2>
      <Field label="Occasion">
        <select value={config._occasion} onChange={(e) => patch((c) => applyOccasion(c, e.target.value))}>
          {Object.entries(OCCASIONS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </Field>
      <Field label="Their name (shown big everywhere)">
        <input value={config.recipient.name} onChange={(e) => patch((c) => set(c, "recipient.name", e.target.value))} placeholder="e.g. Nidhi" />
      </Field>
      <Field label="Their full name (the elegant subtitle)">
        <input value={config.recipient.fullName} onChange={(e) => patch((c) => set(c, "recipient.fullName", e.target.value))} placeholder="e.g. Nidhi Arjariya Chhabra" />
      </Field>
      <Field label="From (who it's by)">
        <input value={config.author.name} onChange={(e) => patch((c) => set(c, "author.name", e.target.value))} placeholder="e.g. Sagar" />
      </Field>
      <Field label="Portrait image URL (the cover photo)">
        <input value={config.recipient.portrait} onChange={(e) => patch((c) => set(c, "recipient.portrait", e.target.value))} placeholder="/media/… or https://…" />
      </Field>
      <Field label="Private gate password (recipient types this to enter)">
        <input value={config.auth.pass} onChange={(e) => patch((c) => set(c, "auth.pass", e.target.value))} />
        <small>The username is their name. (In production this is hashed server-side — see security plan.)</small>
      </Field>
    </section>
  );
}

/* ── Step 2: chapters ── */
function StepChapters({ config, patch, provider }) {
  return (
    <section>
      <h2>The chapters</h2>
      <p className="hint">Each chapter is a memory: a title, a note, photos, and an optional quiz. Mark the last one as the finale.</p>
      {config.memories.map((m, i) => (
        <ChapterEditor key={m.id} m={m} i={i} count={config.memories.length} patch={patch} provider={provider} config={config} />
      ))}
      <button className="add" onClick={() => patch((c) => { c.memories.push(makeChapter({ name: "New Chapter" })); return c; })}>+ Add chapter</button>
    </section>
  );
}

function ChapterEditor({ m, i, count, patch, provider, config }) {
  const [busy, setBusy] = useState(false);
  const upd = (key, val) => patch((c) => { c.memories[i][key] = val; return c; });

  async function aiDraft() {
    setBusy(true);
    try {
      const res = await provider.generate({
        system: voiceFor(config, `This chapter is titled "${m.name}".`),
        prompt: m.teaser || m.name,
        tier: "cheap",
      });
      upd("message", res.text);
    } finally { setBusy(false); }
  }

  return (
    <div className="ch">
      <div className="ch-row">
        <input className="ch-icon" value={m.icon} onChange={(e) => upd("icon", e.target.value)} />
        <input className="ch-name" value={m.name} onChange={(e) => upd("name", e.target.value)} placeholder="Chapter title" />
        <button className="del" title="Remove" disabled={count <= 1} onClick={() => patch((c) => { c.memories.splice(i, 1); return c; })}>✕</button>
      </div>
      <input value={m.when} onChange={(e) => upd("when", e.target.value)} placeholder="When (e.g. July 2024)" />
      <input value={m.teaser} onChange={(e) => upd("teaser", e.target.value)} placeholder="One-line teaser / a detail for the AI to build on" />
      <div className="ch-msg">
        <textarea rows={4} value={m.message} onChange={(e) => upd("message", e.target.value)} placeholder="The note for this chapter…" />
        <button className="ai" disabled={busy} onClick={aiDraft}>{busy ? "…" : "✨ Draft with AI"}</button>
      </div>

      <PhotoRows photos={m.photos} onChange={(photos) => upd("photos", photos)} />

      <label className="chk"><input type="checkbox" checked={!!m.quiz} onChange={(e) => upd("quiz", e.target.checked ? makeQuiz() : null)} /> Add a quiz to this chapter</label>
      {m.quiz && <QuizEditor quiz={m.quiz} onChange={(q) => upd("quiz", q)} />}
      <label className="chk"><input type="checkbox" checked={!!m.isFinale} onChange={(e) => upd("isFinale", e.target.checked)} /> This is the finale chapter (the grand letter)</label>
      {m.isFinale && (
        <div className="finale-extra">
          <textarea rows={3} value={m.birthdayNote || ""} onChange={(e) => upd("birthdayNote", e.target.value)} placeholder="Handwritten birthday wish (shown in the finale)" />
          <textarea rows={2} value={m.ps || ""} onChange={(e) => upd("ps", e.target.value)} placeholder="A secret P.S. revealed at the very end" />
        </div>
      )}
    </div>
  );
}

function PhotoRows({ photos, onChange }) {
  return (
    <div className="photos">
      {photos.map((p, i) => (
        <div className="photo-row" key={i}>
          <input value={p.url} onChange={(e) => onChange(photos.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} placeholder="Photo URL (/media/… or https://…)" />
          <input value={p.caption} onChange={(e) => onChange(photos.map((x, j) => j === i ? { ...x, caption: e.target.value } : x))} placeholder="Caption" />
          <button className="del" onClick={() => onChange(photos.filter((_, j) => j !== i))}>✕</button>
        </div>
      ))}
      <button className="add sm" onClick={() => onChange([...photos, { url: "", caption: "" }])}>+ Add photo</button>
    </div>
  );
}

function QuizEditor({ quiz, onChange }) {
  const set2 = (k, v) => onChange({ ...quiz, [k]: v });
  return (
    <div className="quiz-ed">
      <input value={quiz.q} onChange={(e) => set2("q", e.target.value)} placeholder="Question" />
      {quiz.options.map((o, i) => (
        <label key={i} className="opt">
          <input type="radio" name={"correct-" + (quiz.q || "q")} checked={quiz.correct === i} onChange={() => set2("correct", i)} />
          <input value={o} onChange={(e) => set2("options", quiz.options.map((x, j) => j === i ? e.target.value : x))} placeholder={"Option " + (i + 1) + (quiz.correct === i ? " (correct)" : "")} />
        </label>
      ))}
    </div>
  );
}

/* ── Step 3: letter & extras ── */
function StepLetter({ config, patch, provider }) {
  const [busy, setBusy] = useState(false);
  async function aiLetter() {
    setBusy(true);
    try {
      const res = await provider.generate({ system: voiceFor(config, "Write the opening love-letter paragraphs."), prompt: config.recipient.name + " — " + (config.copy.intro.line || ""), tier: "standard" });
      patch((c) => { c.copy.openingLetter.paragraphs = res.text.split(/\n+/).filter(Boolean); return c; });
    } finally { setBusy(false); }
  }
  const lines = (v) => v.split("\n").filter((s) => s.trim());
  return (
    <section>
      <h2>The opening letter</h2>
      <div className="ch-msg">
        <textarea rows={6} value={config.copy.openingLetter.paragraphs.join("\n")} onChange={(e) => patch((c) => { c.copy.openingLetter.paragraphs = e.target.value.split("\n"); return c; })} placeholder="One paragraph per line…" />
        <button className="ai" disabled={busy} onClick={aiLetter}>{busy ? "…" : "✨ Draft with AI"}</button>
      </div>
      <Field label="Closing line"><input value={config.copy.openingLetter.closing} onChange={(e) => patch((c) => set(c, "copy.openingLetter.closing", e.target.value))} /></Field>
      <Field label="Sign-off"><input value={config.copy.openingLetter.signer} onChange={(e) => patch((c) => set(c, "copy.openingLetter.signer", e.target.value))} /></Field>

      <h2>Little extras (one per line)</h2>
      <Field label="Reasons I love you"><textarea rows={4} value={config.reasons.map((r) => r.reason).join("\n")} onChange={(e) => patch((c) => { c.reasons = lines(e.target.value).map((reason) => ({ reason, icon: "💛" })); return c; })} /></Field>
      <Field label="Love quotes"><textarea rows={3} value={config.loveQuotes.join("\n")} onChange={(e) => patch((c) => { c.loveQuotes = lines(e.target.value); return c; })} /></Field>
      <Field label="Secret little messages"><textarea rows={3} value={config.secretMessages.join("\n")} onChange={(e) => patch((c) => { c.secretMessages = lines(e.target.value); return c; })} /></Field>
      <Field label="Promises"><textarea rows={3} value={config.promises.map((p) => p.text).join("\n")} onChange={(e) => patch((c) => { c.promises = lines(e.target.value).map((text) => ({ text, icon: "💛" })); return c; })} /></Field>
    </section>
  );
}

/* ── Step 4: review / export / full preview ── */
function StepReview({ config }) {
  const json = useMemo(() => JSON.stringify(stripBuilderKeys(config), null, 2), [config]);
  const issues = validate(config);

  function download() {
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (config.recipient.name || "gift").toLowerCase().replace(/\s+/g, "-") + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function openFullPreview() {
    try {
      localStorage.setItem("previewConfig", JSON.stringify(stripBuilderKeys(config)));
      localStorage.setItem("osm-authed", "yes"); // skip the login gate for preview
      window.open("/?preview=1", "_blank");
    } catch { /* storage blocked */ }
  }

  return (
    <section>
      <h2>Review & preview</h2>
      {issues.length > 0 && (
        <ul className="issues">{issues.map((x) => <li key={x}>⚠ {x}</li>)}</ul>
      )}
      <div className="review-actions">
        <button className="primary" onClick={openFullPreview}>▶ Open full live preview</button>
        <button onClick={download}>⬇ Download config.json</button>
        <button onClick={() => navigator.clipboard && navigator.clipboard.writeText(json)}>⧉ Copy JSON</button>
      </div>
      <p className="hint">This JSON is the deliverable — exactly what a tenant row stores and the renderer reads. The full preview opens the real app from this config.</p>
      <pre className="json">{json}</pre>
    </section>
  );
}

/* ── live inline preview ── */
function PreviewPane({ config }) {
  const c = config;
  return (
    <div className="pv">
      <div className="pv-cover" style={c.recipient.portrait ? { backgroundImage: `url(${c.recipient.portrait})` } : undefined}>
        <div className="pv-kicker">{c.copy.intro.kicker}</div>
        <div className="pv-name">{c.recipient.name || "Their name"}</div>
        <div className="pv-sub">{c.recipient.fullName}</div>
      </div>
      <div className="pv-line">{c.copy.intro.line}</div>
      {c.memories.map((m) => (
        <div className={"pv-ch" + (m.isFinale ? " fin" : "")} key={m.id}>
          <div className="pv-ch-top"><span className="pv-ico">{m.icon}</span> <b>{m.name}</b> {m.when && <i>· {m.when}</i>} {m.quiz && <em>quiz</em>} {m.isFinale && <em className="fin">finale</em>}</div>
          {m.message && <div className="pv-msg">{m.message}</div>}
          {m.photos.filter((p) => p.url).length > 0 && <div className="pv-photos">{m.photos.filter((p) => p.url).map((p, i) => <img key={i} src={p.url} alt="" />)}</div>}
        </div>
      ))}
      <div className="pv-letter">
        {c.copy.openingLetter.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        <div className="pv-sign">{c.copy.openingLetter.closing}<br />— {c.copy.openingLetter.signer}</div>
      </div>
    </div>
  );
}

/* ── helpers ── */
function Field({ label, children }) {
  return <label className="fld"><span>{label}</span>{children}</label>;
}
function set(obj, path, value) {
  const keys = path.split(".");
  let o = obj;
  for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
  o[keys[keys.length - 1]] = value;
  return obj;
}
function applyOccasion(c, key) {
  const fresh = makeDefaultConfig(key);
  // keep what the user already typed; refresh only occasion-driven copy
  fresh.recipient = c.recipient; fresh.author = c.author; fresh.auth = c.auth;
  fresh.memories = c.memories; fresh.reasons = c.reasons; fresh.loveQuotes = c.loveQuotes;
  fresh.secretMessages = c.secretMessages; fresh.promises = c.promises;
  return fresh;
}
function stripBuilderKeys(c) {
  const copy = structuredCloneSafe(c);
  delete copy._occasion;
  copy.memories = copy.memories.map((m) => { const { ...rest } = m; return rest; });
  return copy;
}
function validate(c) {
  const out = [];
  if (!c.recipient.name) out.push("Add the recipient's name.");
  if (!c.memories.some((m) => m.isFinale)) out.push("Mark one chapter as the finale.");
  if (c.memories.some((m) => m.quiz && !m.quiz.q)) out.push("A quiz is missing its question.");
  return out;
}
function structuredCloneSafe(o) {
  return typeof structuredClone === "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o));
}

const CSS = `
.bld{min-height:100vh;background:#0a0e22;color:#e8e6f0;font:15px/1.5 system-ui,sans-serif}
.bld-top{position:sticky;top:0;z-index:5;background:#0d1230;border-bottom:1px solid #23284d;padding:10px 16px}
.bld-brand{font-weight:700;color:#f4d58d}.bld-brand span{color:#8a8fb5;font-weight:400;font-size:12px}
.bld-steps{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.bld-step{background:#171c3d;border:1px solid #2a3060;color:#aab;border-radius:20px;padding:5px 12px;cursor:pointer;font-size:13px}
.bld-step b{color:#f4d58d}.bld-step.on{background:#2a2050;color:#fff;border-color:#f4d58d}.bld-step.done{opacity:.8}
.bld-body{display:grid;grid-template-columns:1fr 380px;gap:18px;padding:18px;max-width:1200px;margin:0 auto}
@media(max-width:880px){.bld-body{grid-template-columns:1fr}.bld-preview{order:-1}}
.bld-form h2{color:#f4d58d;font-size:18px;margin:18px 0 8px}
.fld{display:block;margin:10px 0}.fld>span{display:block;font-size:12px;color:#9aa;margin-bottom:4px}
.bld input,.bld textarea,.bld select{width:100%;box-sizing:border-box;background:#11163a;border:1px solid #2a3060;color:#fff;border-radius:8px;padding:8px 10px;font:inherit}
.bld small{color:#777ea6;font-size:11px}
.hint{color:#8a8fb5;font-size:13px}
.ch{background:#11163a;border:1px solid #23284d;border-radius:12px;padding:12px;margin:12px 0}
.ch input,.ch textarea{margin:5px 0}
.ch-row{display:flex;gap:6px;align-items:center}.ch-icon{width:46px;text-align:center}.ch-name{flex:1;font-weight:600}
.ch-msg{position:relative}.ch-msg .ai{position:absolute;right:8px;bottom:14px}
.ai,.add,.del,.primary,.review-actions button,.bld-nav button{cursor:pointer;border-radius:8px;border:1px solid #2a3060;background:#1c2350;color:#dfe;padding:7px 12px;font:inherit}
.ai{background:#3a2a66;border-color:#f4d58d;color:#f4d58d;font-size:12px;padding:5px 9px}
.primary{background:#f4d58d;color:#1a1330;font-weight:700;border-color:#f4d58d}
.del{background:transparent;border-color:#553;color:#c88;padding:4px 8px}
.add{background:#172046;margin-top:6px}.add.sm{font-size:12px;padding:5px 9px}
.photos{margin:6px 0}.photo-row{display:flex;gap:6px}.photo-row input:first-child{flex:1}
.chk{display:flex;gap:8px;align-items:center;margin:8px 0;font-size:13px}.chk input{width:auto}
.quiz-ed{background:#0d1230;border-radius:8px;padding:8px;margin:6px 0}.opt{display:flex;gap:6px;align-items:center}.opt input[type=radio]{width:auto}
.finale-extra{margin-top:6px}
.bld-nav{display:flex;justify-content:space-between;margin:20px 0}
.bld-preview{position:sticky;top:90px;align-self:start;background:#0d1230;border:1px solid #23284d;border-radius:14px;padding:12px;max-height:calc(100vh - 110px);overflow:auto}
.bld-preview-head{color:#9aa;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
.pv-cover{background:#1a1440 center/cover;border-radius:12px;padding:24px 14px;text-align:center;margin-bottom:10px}
.pv-kicker{color:#f4d58d;font-size:12px}.pv-name{font-size:30px;font-weight:800;color:#fff;font-family:Georgia,serif}.pv-sub{color:#bcd;font-size:12px}
.pv-line{font-size:13px;color:#cdd;font-style:italic;margin-bottom:10px}
.pv-ch{background:#11163a;border:1px solid #23284d;border-radius:10px;padding:9px;margin:7px 0}
.pv-ch.fin{border-color:#f4d58d}
.pv-ch-top b{color:#fff}.pv-ch-top i{color:#9aa;font-style:normal;font-size:12px}.pv-ch-top em{background:#2a2050;color:#f4d58d;font-size:10px;padding:1px 6px;border-radius:8px;font-style:normal;margin-left:4px}.pv-ch-top em.fin{background:#f4d58d;color:#1a1330}
.pv-msg{font-size:12px;color:#cdd;margin-top:5px}
.pv-photos{display:flex;gap:4px;margin-top:6px;flex-wrap:wrap}.pv-photos img{width:46px;height:46px;object-fit:cover;border-radius:6px}
.pv-letter{background:#1a1440;border-radius:10px;padding:12px;margin-top:10px;font-size:12px;color:#dde}.pv-letter p{margin:0 0 6px}.pv-sign{color:#f4d58d;margin-top:8px}
.issues{background:#3a1a1a;border:1px solid #6a3030;border-radius:8px;padding:8px 8px 8px 26px;color:#fcc;font-size:13px}
.review-actions{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
.json{background:#0d1230;border:1px solid #23284d;border-radius:8px;padding:12px;font:11px/1.4 ui-monospace,monospace;color:#bcd;max-height:340px;overflow:auto;white-space:pre-wrap}
`;
