/*
  Builds a COMPLETE, renderer-safe config from the builder's inputs. Every field
  the renderer reads has a sensible default here, so a partially-filled gift never
  crashes the preview. The output is exactly the JSON shape Phases 1–2 render and
  the backend will store as a tenant row.
*/

const TODAY = new Date();
const isoMidnight = (y, m, d) =>
  new Date(Date.UTC(y, m, d, 0, 0, 0)).toISOString();

/** Per-occasion copy + voice defaults (the questionnaire picks one). */
export const OCCASIONS = {
  birthday: {
    label: "Birthday",
    voice: "a loving partner writing to someone they adore",
    kicker: "Happy Birthday, my love",
    calligraphyKicker: "for the one who makes everything brighter",
    countdownKicker: "It's here",
    countdownMessage: "Another year of loving you begins right now.\nYou make every day feel like magic.",
    reasonsEnd: "…and a thousand reasons more.",
    closing: "Happy birthday, my love.",
  },
  anniversary: {
    label: "Anniversary",
    voice: "a devoted partner writing to their love",
    kicker: "Happy Anniversary",
    calligraphyKicker: "for the love of my life",
    countdownKicker: "Our day",
    countdownMessage: "Another year of us begins right now.\nI'd choose this story every single time.",
    reasonsEnd: "…and forever more.",
    closing: "Forever yours.",
  },
  friendship: {
    label: "Friendship / Birthday for a friend",
    voice: "a best friend, warm and a little playful",
    kicker: "Happy Birthday, legend",
    calligraphyKicker: "for the one who makes the room brighter",
    countdownKicker: "It's here",
    countdownMessage: "Another year of you begins right now.\nLet's make it the best one yet.",
    reasonsEnd: "…and a hundred reasons more.",
    closing: "Happy birthday, legend.",
  },
};

export function makeDefaultConfig(occasionKey = "birthday") {
  const occ = OCCASIONS[occasionKey] || OCCASIONS.birthday;
  const y = TODAY.getFullYear();
  return {
    _occasion: occasionKey, // builder-only hint (harmless to the renderer)
    recipient: { name: "", fullName: "", portrait: "" },
    author: { name: "" },
    auth: { user: "", pass: "preview" },
    dates: {
      birthdayMonth: TODAY.getMonth(),
      birthdayDay: TODAY.getDate(),
      birthdayMidnightUTC: isoMidnight(y, TODAY.getMonth(), TODAY.getDate()),
      firstMetDate: isoMidnight(y - 1, 0, 1),
    },
    songs: { list: [{ url: null, name: "Off" }], birthdaySongUrl: "" },
    copy: {
      letterDate: TODAY.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      intro: { kicker: occ.kicker, line: "Before you open anything else, let me take you back to the beginning — every moment that made you, all the way to now." },
      calligraphyKicker: occ.calligraphyKicker,
      countdownKicker: occ.countdownKicker,
      countdownMessage: occ.countdownMessage,
      reasonsEnd: occ.reasonsEnd,
      openingLetter: {
        paragraphs: ["This is a little world I built for you — every chapter ahead is a piece of your story. Take your time, and enjoy it."],
        closing: occ.closing,
        signer: "Always yours",
      },
      finale: { bdayNoteLabel: "A wish, handwritten from my heart" },
      login: { kicker: "A private little world", line: "This surprise is locked away just for you. Step inside. 💛" },
    },
    memories: [makeChapter({ name: "Where It Began", isFinale: false })],
    feastPhotos: [],
    loveQuotes: [],
    reasons: [],
    secretMessages: [],
    promises: [],
  };
}

export function makeChapter(over = {}) {
  return {
    id: "ch_" + Math.random().toString(36).slice(2, 8),
    name: "New Chapter",
    short: "Chapter",
    when: "",
    type: "occasion",
    icon: "🌟",
    teaser: "",
    message: "",
    video: "",
    photos: [],
    food: [],
    quiz: null,
    ...over,
  };
}

export function makeQuiz() {
  return { q: "", options: ["", "", ""], correct: 0, right: "Exactly right. 💛", wrong: "Not quite — try again!" };
}

/** Voice string for the AI adapter, from the config + chapter context. */
export function voiceFor(config, extra = "") {
  const occ = OCCASIONS[config._occasion] || OCCASIONS.birthday;
  return `You are ${occ.voice}. Write warm, specific, second-person prose; no clichés; leave room for the reader's own memories. recipient: ${config.recipient.name || "them"}. ${extra}`.trim();
}
