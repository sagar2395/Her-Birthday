/*
  ════════════════════════════════════════════════════════════════════════════
   OUR STORY MAP  —  A birthday surprise for Nidhi Arjariya Chhabra
   An interactive memory atlas of every place we've loved each other.
  ════════════════════════════════════════════════════════════════════════════

  HOW TO MAKE THIS YOURS  (everything you need to edit is marked with  >>> )

  1) 📸  ADD YOUR PHOTOS
        Scroll to the MEMORIES array below. Each trip has a `photos: [ ... ]`
        list. To add a photo, paste a direct image URL into `url:` and write a
        sweet `caption:`. Leave `url: ''` to show an elegant gold placeholder.
        Add as many photos as you like — the gallery handles any number.

        Easiest way to get image URLs:
          • Upload to imgur.com / cloudinary / Google Drive (set "anyone with
            link" + use the direct image link), or any image host.
          • The URL should end in .jpg / .png / .webp (a DIRECT image link).

  2) 🎵  ADD YOUR SONG
        Set SONG_URL below to a DIRECT audio file link (.mp3 / .m4a).
        (A YouTube page link will NOT work — it must be a direct media file.)
        Suggested vibe: "Ilahi" (Yeh Jawaani Hai Deewani) or "Patakha Guddi"
        (Highway) — playful Hindi travel-love energy.

  3) 📍  SET YOUR NEW FLAT'S LOCATION  (the golden finale pin)
        Find the `flat` entry in MEMORIES and replace its lat/lng with the real
        coordinates of your new home (right-click the spot in Google Maps →
        the first numbers are lat, lng).

  4) ✍️  EVERYTHING ELSE (the love notes, the quiz, the captions) is already
        written for you in a husband's voice — but feel free to make it even
        more you.

  ════════════════════════════════════════════════════════════════════════════
*/

import React, { useState, useEffect, useRef } from "react";

/* >>> 🎵 PASTE YOUR SONG'S DIRECT AUDIO URL HERE (leave '' for none) */
const SONG_URL = ""; // e.g. "https://example.com/ilahi.mp3"

/* ────────────────────────────────────────────────────────────────────────────
   THE MEMORIES  —  placed by real latitude / longitude, in the order we lived them.
   The dotted golden path connects them top-to-bottom, ending at our new home.
   ──────────────────────────────────────────────────────────────────────────── */
const MEMORIES = [
  {
    id: "bali",
    name: "Bali & Malaysia",
    short: "Bali",
    when: "July 2024",
    teaser: "Where our forever began.",
    lat: -8.4095,
    lng: 115.1889,
    message:
      "This is where we said “forever” and meant it. Two newlyweds chasing waterfalls through the Balinese jungle, getting happily lost in Kuala Lumpur's lights, eating like the day might run out. I watched you laugh with the ocean behind you and thought — this is the woman I get to spend my whole life loving. Our story began right here, with sandy feet and impossibly full hearts.",
    /* >>> 📸 ADD BALI / MALAYSIA PHOTOS BELOW */
    photos: [
      { url: "", caption: "Chasing waterfalls in Bali" },
      { url: "", caption: "That beach, that sunset, you" },
      { url: "", caption: "Eating our way through KL" },
      { url: "", caption: "Just married, just us" },
    ],
    quiz: {
      q: "On our honeymoon, what did we chase through the Balinese jungle?",
      options: ["Waterfalls", "Snow", "Trains", "Deadlines"],
      correct: 0,
      right: "Yes — waterfalls and you. The perfect beginning. 💛",
      wrong: "Aw, almost — think jungle, mist and a lot of splashing. Try again, my love. 💧",
    },
  },
  {
    id: "pachmarhi",
    name: "Pachmarhi",
    short: "Pachmarhi",
    when: "May 2025",
    teaser: "An unplanned escape into the hills.",
    lat: 22.4676,
    lng: 78.4336,
    message:
      "No plan, just us and a long, winding drive into the Satpura hills. We dragged ourselves up before sunrise for the safari — half asleep, fully in love — and then stood quietly together at Gupt Mahadev, as if the temple was keeping our little secrets. Some of my favourite memories are the unplanned ones, because they're just you, me and the open road.",
    /* >>> 📸 ADD PACHMARHI PHOTOS BELOW */
    photos: [
      { url: "", caption: "The long drive in" },
      { url: "", caption: "Dawn at the Satpura safari" },
      { url: "", caption: "A quiet moment at Gupt Mahadev" },
      { url: "", caption: "Hills, mist, and you" },
    ],
    quiz: {
      q: "What did we drag ourselves out of bed before sunrise for in Pachmarhi?",
      options: ["A breakfast buffet", "An early-morning Satpura safari", "A flight home", "A cricket match"],
      correct: 1,
      right: "Exactly — that sleepy 5 a.m. safari. Worth every single yawn.",
      wrong: "So close — picture the jungle waking up around us. One more guess. 🌅",
    },
  },
  {
    id: "udaipur",
    name: "Udaipur & Nathdwara",
    short: "Udaipur",
    when: "July 2025",
    teaser: "Our first anniversary, on the lakes.",
    lat: 24.5854,
    lng: 73.7125,
    message:
      "One whole year of being your husband, and I'd choose you a thousand times over. We drifted past palaces on the lake, bowed our heads together at Nathdwara, and ate street food until we couldn't stop grinning. Udaipur shimmered that week — but honestly, I only ever had eyes for you.",
    /* >>> 📸 ADD UDAIPUR / NATHDWARA PHOTOS BELOW */
    photos: [
      { url: "", caption: "On the lake at Udaipur" },
      { url: "", caption: "Blessings at Nathdwara" },
      { url: "", caption: "Anniversary street food" },
      { url: "", caption: "One year of us" },
    ],
    quiz: {
      q: "What were we celebrating in the city of lakes?",
      options: ["A work trip", "New Year", "Our first wedding anniversary", "Diwali"],
      correct: 2,
      right: "Our first anniversary — one year down, a whole forever to go.",
      wrong: "Not quite — think about what we promised each other a year before. 💍",
    },
  },
  {
    id: "delhi",
    name: "Delhi",
    short: "Delhi",
    when: "August 2025",
    teaser: "Short, chaotic, delicious.",
    lat: 28.6139,
    lng: 77.209,
    message:
      "A quick escape — barely a weekend — but you make even the loudest, most chaotic places feel like ours. We followed our noses through the lanes, ate everything in sight, and laughed at how easily the two of us can turn any city into an adventure. No photos this time, but I remember every flavour — and every one of your smiles.",
    /* >>> 📸 No photos for Delhi (handled gracefully). Add some here if you like. */
    photos: [],
    quiz: {
      q: "Delhi was short and sweet — what stole the show?",
      options: ["The traffic", "The street food", "The shopping malls", "The paperwork"],
      correct: 1,
      right: "The street food, obviously. We're a proud team of two foodies.",
      wrong: "Hehe, no — think of us, a plate of chaat, and zero regrets. 😋",
    },
  },
  {
    id: "goa",
    name: "Goa",
    short: "Goa",
    when: "January 2026",
    teaser: "Where we healed, together.",
    lat: 15.2993,
    lng: 74.124,
    message:
      "This one's tender. We came to Goa carrying something heavy, and we left a little lighter — together. The sea held us while we healed, and you reminded me that the right person makes even the hard chapters feel survivable. I quietly, completely fell in love with you all over again here.",
    /* >>> 📸 ADD GOA PHOTOS BELOW */
    photos: [
      { url: "", caption: "The sea that healed us" },
      { url: "", caption: "Slow mornings by the water" },
      { url: "", caption: "Finding our smiles again" },
    ],
    quiz: {
      q: "Goa wasn't just a holiday — what did we really do there?",
      options: ["Healed and found our way back to each other", "Ran a marathon", "Opened a café", "Learned to surf"],
      correct: 0,
      right: "We healed there, side by side. I'll never forget what that meant.",
      wrong: "Gently no — it was something far more important than any activity. 🩵",
    },
  },
  {
    id: "jaipur",
    name: "Jaipur",
    short: "Jaipur",
    when: "April 2026",
    teaser: "Temples and forts, hand in hand.",
    lat: 26.9124,
    lng: 75.7873,
    message:
      "The Pink City, hand in hand. We climbed the fort, stood small and quiet beneath ancient temples, and you looked at every carving with that wonder I adore. Walking those golden walls beside you, I kept thinking how lucky I am that I get to explore this entire life with you.",
    /* >>> 📸 ADD JAIPUR PHOTOS BELOW */
    photos: [
      { url: "", caption: "Walking the fort walls" },
      { url: "", caption: "Temple bells and you" },
      { url: "", caption: "The Pink City glow" },
    ],
    quiz: {
      q: "In the Pink City, what did we wander through together?",
      options: ["A ski slope", "A tech expo", "Temples and the grand fort", "A beach"],
      correct: 2,
      right: "Temples and the fort, fingers laced together. My favourite kind of day.",
      wrong: "Not this time — think ancient stone, bells, and a fort on a hill. 🔔",
    },
  },
  {
    id: "indore",
    name: "Indore — Home",
    short: "Indore",
    when: "Every ordinary, perfect day",
    teaser: "Home — our everyday love.",
    lat: 22.7196,
    lng: 75.8577,
    message:
      "Not every love story needs a passport. Our own city holds our smallest, sweetest moments — the cafés we keep going back to, the restaurants where they already know our order, the lazy mall evenings that somehow become my favourite dates. Home isn't a place, Nidhi. It's wherever you are.",
    /* >>> 📸 ADD INDORE PHOTOS BELOW (your everyday dates!) */
    photos: [
      { url: "", caption: "Our usual café table" },
      { url: "", caption: "Food-hopping nights" },
      { url: "", caption: "Lazy mall evenings" },
    ],
    quiz: {
      q: "Back home in Indore, what's our favourite kind of everyday date?",
      options: ["Skydiving", "Cafés, good food & a little mall therapy", "Deep-sea diving", "Mountaineering"],
      correct: 1,
      right: "Cafés and good food — our everyday love language. ☕",
      wrong: "Ha, no — think comfort, good food, and zero adrenaline. 😉",
    },
  },
  {
    id: "flat",
    name: "Our New Flat",
    short: "Home ★",
    when: "The beginning of forever",
    teaser: "The beginning of forever.",
    isFinale: true,
    /* >>> 📍 REPLACE WITH YOUR NEW FLAT'S REAL COORDINATES */
    lat: 22.776,
    lng: 75.901,
    message:
      "My Nidhi,\n\nEvery pin on this map is a place we've loved each other. This last one is where we get to love each other from now on.\n\nYou are the bravest person I know — a brilliant lawyer and computer scientist who chose, with both eyes wide open, to bet on us and build something of our very own. Watching you dream up our business, fuss over paint swatches and corners and the exact morning light for our new home — I fall a little more in love with you every single day.\n\nRight now this flat is just walls and floors. But with you, it's already becoming the warmest place in the world. I can picture all of it: the kitchen where we'll cook the food we love, the corner that will be yours, the door we'll walk through tired and happy for the rest of our lives.\n\nThank you for being my home, my partner, my forever adventure.\n\nHere's to every place we've been — and every place we've yet to go.\n\nHappy birthday, Nidhi. I love you, today and in every chapter still to come.\n— Always yours.",
    /* >>> ✍️ The hidden P.S. surprise (revealed only after she completes the quiz). Edit freely! */
    ps:
      "P.S. You just proved you know our story by heart. But here's a secret only I know: every single day with you has been my favourite day — right up until the next one. Now come find me. 🥂",
    /* >>> 📸 ADD NEW-FLAT PHOTOS BELOW (or progress pics of the home!) */
    photos: [
      { url: "", caption: "Where forever begins" },
      { url: "", caption: "Dreaming up our home" },
      { url: "", caption: "Our four walls (soon)" },
    ],
    quiz: null, // the finale has no question — it's the reward
  },
];

/* ──────────────────────────────────────────────────────────────────────────── */

const QUIZ_TOTAL = MEMORIES.filter((m) => m.quiz).length;

/* Inject Leaflet (dark interactive map) from CDN, once. */
function useLeaflet() {
  const [ready, setReady] = useState(typeof window !== "undefined" && !!window.L);
  useEffect(() => {
    if (typeof window === "undefined" || window.L) {
      setReady(true);
      return;
    }
    if (!document.getElementById("leaflet-css")) {
      const css = document.createElement("link");
      css.id = "leaflet-css";
      css.rel = "stylesheet";
      css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(css);
    }
    let script = document.getElementById("leaflet-js");
    const onload = () => setReady(true);
    if (!script) {
      script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = onload;
      document.body.appendChild(script);
    } else {
      script.addEventListener("load", onload);
    }
    return () => script && script.removeEventListener("load", onload);
  }, []);
  return ready;
}

/* Build a custom golden Leaflet pin (teardrop). Answered = rose heart, finale = star. */
function makeIcon(m, answered, unlocked) {
  const L = window.L;
  const done = answered[m.id] === "correct";
  const finale = m.isFinale;
  let cls = "pin";
  let glyph = "";
  if (finale) {
    cls += unlocked ? " pin-finale pin-unlocked" : " pin-finale pin-locked";
    glyph = unlocked ? "★" : "🔒";
  } else if (done) {
    cls += " pin-done";
    glyph = "♥";
  }
  const html =
    '<div class="' + cls + '"><span class="pin-glyph">' + glyph + "</span></div>" +
    '<div class="pin-label">' + m.short + "</div>";
  return L.divIcon({
    html,
    className: "pin-wrap",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

/* ───────────────────────────── MAP VIEW ───────────────────────────── */
function MapView({ answered, unlocked, onOpen }) {
  const ready = useLeaflet();
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    const L = window.L;
    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });
    mapRef.current = map;

    // Dark, cinematic map tiles (CartoDB dark matter)
    L.tileLayer("https://{s}.basemap.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    const latlngs = MEMORIES.map((m) => [m.lat, m.lng]);

    // Dotted golden path connecting the journey, in order
    L.polyline(latlngs, {
      color: "#d4af37",
      weight: 2,
      opacity: 0.85,
      dashArray: "1, 12",
      lineCap: "round",
    }).addTo(map);

    MEMORIES.forEach((m) => {
      const marker = L.marker([m.lat, m.lng], {
        icon: makeIcon(m, answered, unlocked),
      }).addTo(map);
      marker.on("click", () => onOpen(m.id));
      markersRef.current[m.id] = marker;
    });

    map.fitBounds(latlngs, { padding: [55, 55] });
    const t = setTimeout(() => map.invalidateSize(), 250);
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, [ready]);

  // Refresh pin icons when answers / unlock state change
  useEffect(() => {
    MEMORIES.forEach((m) => {
      const marker = markersRef.current[m.id];
      if (marker) marker.setIcon(makeIcon(m, answered, unlocked));
    });
  }, [answered, unlocked]);

  return (
    <div className="map-wrap">
      {!ready && <div className="map-loading">Unrolling the map of us…</div>}
      <div ref={containerRef} className="map-container" />
    </div>
  );
}

/* ───────────────────────────── TIMELINE VIEW ───────────────────────────── */
function Timeline({ answered, unlocked, onOpen }) {
  return (
    <div className="timeline">
      <div className="tl-spine" />
      {MEMORIES.map((m) => {
        const done = answered[m.id] === "correct";
        const locked = m.isFinale && !unlocked;
        return (
          <button
            key={m.id}
            className={"tl-item" + (m.isFinale ? " tl-finale" : "")}
            onClick={() => onOpen(m.id)}
          >
            <span className={"tl-node" + (done ? " tl-node-done" : "") + (m.isFinale ? " tl-node-finale" : "")}>
              {m.isFinale ? (unlocked ? "★" : "🔒") : done ? "♥" : ""}
            </span>
            <span className="tl-body">
              <span className="tl-when">{m.when}</span>
              <span className="tl-name">{m.name}</span>
              <span className="tl-teaser">{locked ? "Answer our little questions to unlock…" : m.teaser}</span>
            </span>
            <span className="tl-arrow">{"›"}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────────── PHOTO GALLERY ───────────────────────────── */
function Gallery({ photos }) {
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [photos]);

  if (!photos || photos.length === 0) {
    return (
      <div className="gallery">
        <div className="photo placeholder no-photos">
          <div className="ph-mark">✨</div>
          <div className="ph-cap">
            This memory lives in flavours and laughter — no photos, just the
            feeling of being there with you.
          </div>
        </div>
      </div>
    );
  }

  const p = photos[i];
  const go = (d) => setI((x) => (x + d + photos.length) % photos.length);

  return (
    <div className="gallery">
      <div className="photo-frame">
        {p.url ? (
          <img className="photo" src={p.url} alt={p.caption || ""} />
        ) : (
          <div className="photo placeholder">
            <div className="ph-mark">{"📷"}</div>
            <div className="ph-hint">Paste a photo URL in the code</div>
          </div>
        )}

        {photos.length > 1 && (
          <>
            <button className="nav nav-l" onClick={() => go(-1)} aria-label="Previous">
              {"‹"}
            </button>
            <button className="nav nav-r" onClick={() => go(1)} aria-label="Next">
              {"›"}
            </button>
            <div className="counter">
              {i + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {p.caption && <div className="caption">{p.caption}</div>}

      {photos.length > 1 && (
        <div className="thumbs">
          {photos.map((ph, idx) => (
            <button
              key={idx}
              className={"thumb" + (idx === i ? " thumb-active" : "")}
              onClick={() => setI(idx)}
            >
              {ph.url ? (
                <img src={ph.url} alt="" />
              ) : (
                <span className="thumb-ph">{idx + 1}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────── QUIZ BLOCK ───────────────────────────── */
function Quiz({ mem, state, wrongPicks, onAnswer }) {
  const done = state === "correct";
  return (
    <div className="quiz">
      <div className="quiz-tag">How well do you know us?</div>
      <div className="quiz-q">{mem.quiz.q}</div>
      <div className="quiz-opts">
        {mem.quiz.options.map((opt, idx) => {
          const isCorrect = done && idx === mem.quiz.correct;
          const isWrong = (wrongPicks || []).includes(idx);
          return (
            <button
              key={idx}
              className={
                "option" +
                (isCorrect ? " option-correct" : "") +
                (isWrong ? " option-wrong" : "")
              }
              disabled={done || isWrong}
              onClick={() => onAnswer(mem, idx)}
            >
              <span className="opt-text">{opt}</span>
              {isCorrect && <span className="opt-mark">{"♥"}</span>}
              {isWrong && <span className="opt-mark">{"•"}</span>}
            </button>
          );
        })}
      </div>
      {done && <div className="quiz-msg">{mem.quiz.right}</div>}
    </div>
  );
}

/* Floating-heart burst (plays on a correct answer / celebration). */
function HeartBurst({ trigger, full }) {
  if (!trigger) return null;
  const hearts = ["💛", "❤️", "🤍", "💗", "🤍"];
  return (
    <div className={"burst" + (full ? " burst-full" : "")} key={trigger}>
      {Array.from({ length: full ? 28 : 16 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * (full ? 0.8 : 0.3);
        const dur = 1 + Math.random() * (full ? 1.6 : 1);
        const size = 14 + Math.random() * 22;
        return (
          <span
            key={i}
            className="burst-heart"
            style={{
              left: left + "%",
              animationDelay: delay + "s",
              animationDuration: dur + "s",
              fontSize: size + "px",
            }}
          >
            {hearts[i % hearts.length]}
          </span>
        );
      })}
    </div>
  );
}

/* ───────────────────────────── MEMORY MODAL ───────────────────────────── */
function MemoryModal({ mem, answered, wrongPicks, burst, unlocked, onClose, onAnswer }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <HeartBurst trigger={burst} />
        <button className="close" onClick={onClose} aria-label="Close">
          {"×"}
        </button>

        <div className="card-when">{mem.when}</div>
        <h2 className="card-title">{mem.name}</h2>

        <Gallery photos={mem.photos} />

        <div className="card-message">
          {mem.message.split("\n\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {mem.quiz && (
          <Quiz
            mem={mem}
            state={answered[mem.id]}
            wrongPicks={wrongPicks[mem.id]}
            onAnswer={onAnswer}
          />
        )}

        {mem.isFinale && unlocked && mem.ps && (
          <div className="ps">{mem.ps}</div>
        )}

        {mem.isFinale && (
          <div className="sign">Happy birthday, Nidhi. {"💛"}</div>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────────── INTRO SCREEN ───────────────────────────── */
function Intro({ onBegin }) {
  return (
    <div className="intro">
      <div className="intro-stars" />
      <div className="intro-inner">
        <div className="intro-kicker">Happy Birthday, my love</div>
        <h1 className="intro-name">Nidhi</h1>
        <div className="intro-rule">
          <span>{"❀"}</span>
        </div>
        <p className="intro-line">
          Before you open anything else, let me take you somewhere first —
          across every place our story has ever touched, all the way to where
          forever begins.
        </p>
        <button className="begin" onClick={onBegin}>
          Begin our story
        </button>
        <div className="intro-sub">Nidhi Arjariya Chhabra</div>
      </div>
    </div>
  );
}

/* ───────────────────────────── ROOT APP ───────────────────────────── */
export default function App() {
  const [started, setStarted] = useState(false);
  const [view, setView] = useState("map"); // 'map' | 'timeline'
  const [openId, setOpenId] = useState(null);
  const [answered, setAnswered] = useState({}); // id -> 'correct'
  const [wrongPicks, setWrongPicks] = useState({}); // id -> [indices]
  const [burst, setBurst] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [toast, setToast] = useState("");
  const [celebrate, setCelebrate] = useState(0);

  const audioRef = useRef(null);
  const unlockFired = useRef(false);

  const hearts = Object.values(answered).filter((v) => v === "correct").length;
  const unlocked = hearts >= QUIZ_TOTAL;
  const totalPhotos = MEMORIES.reduce((n, m) => n + (m.photos ? m.photos.length : 0), 0);
  const openMem = openId ? MEMORIES.find((m) => m.id === openId) : null;

  // toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // finale unlock celebration (fires once)
  useEffect(() => {
    if (unlocked && !unlockFired.current) {
      unlockFired.current = true;
      setCelebrate((c) => c + 1);
      setToast("You know us by heart 💛  Our final memory is unlocked.");
      const t = setTimeout(() => setCelebrate(0), 4500);
      return () => clearTimeout(t);
    }
  }, [unlocked]);

  function begin() {
    setStarted(true);
    // try to start the music (only works once a song URL is added)
    if (SONG_URL && audioRef.current) {
      audioRef.current.volume = 0.55;
      audioRef.current
        .play()
        .then(() => setMusicOn(true))
        .catch(() => setMusicOn(false));
    }
  }

  function toggleMusic() {
    const a = audioRef.current;
    if (!SONG_URL || !a) {
      setToast("Add your song's URL in the code to play music 🎵");
      return;
    }
    if (musicOn) {
      a.pause();
      setMusicOn(false);
    } else {
      a.volume = 0.55;
      a.play()
        .then(() => setMusicOn(true))
        .catch(() => setToast("Tap again to start the music 🎵"));
    }
  }

  function openPin(id) {
    const m = MEMORIES.find((x) => x.id === id);
    if (m.isFinale && !unlocked) {
      setToast(
        "Almost there, my love — answer the little question at each place to unlock our final stop. (" +
          hearts +
          " of " +
          QUIZ_TOTAL +
          ")"
      );
      return;
    }
    setOpenId(id);
  }

  function answerQuiz(mem, idx) {
    if (answered[mem.id] === "correct") return;
    if (idx === mem.quiz.correct) {
      setAnswered((a) => ({ ...a, [mem.id]: "correct" }));
      setBurst((b) => b + 1);
      setToast(mem.quiz.right);
    } else {
      setWrongPicks((w) => ({
        ...w,
        [mem.id]: [...(w[mem.id] || []), idx],
      }));
      setToast(mem.quiz.wrong);
    }
  }

  return (
    <div className="osm-root">
      <style>{STYLES}</style>

      {/* 🎵 ambient music — set SONG_URL at the top of the file */}
      <audio ref={audioRef} src={SONG_URL || undefined} loop preload="none" />

      {!started ? (
        <Intro onBegin={begin} />
      ) : (
        <>
          <header className="header">
            <div className="brand">
              <span className="brand-mark">{"❀"}</span>
              <span className="brand-text">Our Story Map</span>
            </div>
            <div className="header-right">
              <div className="toggle">
                <button
                  className={"tg" + (view === "map" ? " tg-on" : "")}
                  onClick={() => setView("map")}
                >
                  Map
                </button>
                <button
                  className={"tg" + (view === "timeline" ? " tg-on" : "")}
                  onClick={() => setView("timeline")}
                >
                  Timeline
                </button>
              </div>
              <button
                className={"music" + (musicOn ? " music-on" : "")}
                onClick={toggleMusic}
                aria-label="Toggle music"
                title={SONG_URL ? "Toggle music" : "Add a song URL in the code"}
              >
                {musicOn ? "♫" : "♪"}
              </button>
            </div>
          </header>

          <div className="stats">
            <div className="stat">
              <span className="stat-num">{MEMORIES.length}</span>
              <span className="stat-label">Journeys</span>
            </div>
            <div className="stat">
              <span className="stat-num">3</span>
              <span className="stat-label">Countries</span>
            </div>
            <div className="stat">
              <span className="stat-num">{totalPhotos}</span>
              <span className="stat-label">Memories</span>
            </div>
            <div className="stat stat-hearts">
              <span className="stat-num">
                {hearts}
                <span className="of">/{QUIZ_TOTAL}</span> {"♥"}
              </span>
              <span className="stat-label">Hearts</span>
            </div>
          </div>

          <main className="content">
            {view === "map" ? (
              <MapView answered={answered} unlocked={unlocked} onOpen={openPin} />
            ) : (
              <Timeline answered={answered} unlocked={unlocked} onOpen={openPin} />
            )}
          </main>

          {openMem && (
            <MemoryModal
              mem={openMem}
              answered={answered}
              wrongPicks={wrongPicks}
              burst={burst}
              unlocked={unlocked}
              onClose={() => setOpenId(null)}
              onAnswer={answerQuiz}
            />
          )}

          {celebrate > 0 && (
            <div className="celebrate">
              <HeartBurst trigger={celebrate} full />
              <div className="celebrate-msg">
                You know us by heart {"💛"}
                <span>Tap the golden pin to open our final memory.</span>
              </div>
            </div>
          )}

          {toast && <div className="toast">{toast}</div>}
        </>
      )}
    </div>
  );
}

/* ───────────────────────────── STYLES ───────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marcellus&display=swap');

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

.osm-root {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Cormorant Garamond', serif;
  color: #f3ead3;
  background:
    radial-gradient(1200px 600px at 70% -10%, #1b2a5e 0%, rgba(27,42,94,0) 60%),
    radial-gradient(900px 500px at 10% 110%, #3a1430 0%, rgba(58,20,48,0) 55%),
    linear-gradient(160deg, #0a0f24 0%, #0c1330 45%, #0a0e22 100%);
}

/* ——— starfield ——— */
.intro-stars, .osm-root::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    radial-gradient(1.6px 1.6px at 20% 30%, rgba(255,245,210,.9), transparent),
    radial-gradient(1.4px 1.4px at 75% 20%, rgba(255,245,210,.8), transparent),
    radial-gradient(1.2px 1.2px at 50% 65%, rgba(255,245,210,.7), transparent),
    radial-gradient(1.5px 1.5px at 85% 75%, rgba(255,245,210,.85), transparent),
    radial-gradient(1.2px 1.2px at 33% 85%, rgba(255,245,210,.6), transparent),
    radial-gradient(1.3px 1.3px at 65% 45%, rgba(255,245,210,.7), transparent),
    radial-gradient(1.1px 1.1px at 12% 60%, rgba(255,245,210,.6), transparent),
    radial-gradient(1.4px 1.4px at 90% 40%, rgba(255,245,210,.7), transparent);
  pointer-events: none;
  z-index: 0;
  animation: twinkle 6s ease-in-out infinite alternate;
}
@keyframes twinkle { from { opacity: .55; } to { opacity: 1; } }

/* ——— INTRO ——— */
.intro {
  position: absolute; inset: 0; z-index: 30;
  display: flex; align-items: center; justify-content: center;
  text-align: center; padding: 28px;
  animation: fadeIn 1.4s ease both;
}
.intro-inner { position: relative; z-index: 2; max-width: 540px; }
.intro-kicker {
  font-family: 'Marcellus', serif; letter-spacing: .42em; text-transform: uppercase;
  font-size: 12px; color: #e7b9c4; opacity: 0; animation: fadeUp 1s ease .3s both;
}
.intro-name {
  font-family: 'Cormorant Garamond', serif; font-weight: 600; font-style: italic;
  font-size: clamp(64px, 22vw, 132px); line-height: .95; margin: 10px 0 6px;
  background: linear-gradient(180deg, #fbe6b4 0%, #e8c46a 50%, #c79a36 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 0 50px rgba(212,175,55,.35);
  opacity: 0; animation: fadeUp 1.2s ease .55s both;
}
.intro-rule {
  display: flex; align-items: center; justify-content: center; gap: 14px;
  color: #d4af37; margin: 8px 0 18px; opacity: 0; animation: fadeUp 1s ease .85s both;
}
.intro-rule::before, .intro-rule::after {
  content: ""; height: 1px; width: 70px;
  background: linear-gradient(90deg, transparent, #d4af37);
}
.intro-rule::after { background: linear-gradient(90deg, #d4af37, transparent); }
.intro-line {
  font-size: clamp(18px, 5vw, 23px); line-height: 1.6; color: #efe4cb;
  font-style: italic; margin: 0 auto 30px; max-width: 460px;
  opacity: 0; animation: fadeUp 1.1s ease 1.1s both;
}
.begin {
  font-family: 'Marcellus', serif; font-size: 16px; letter-spacing: .12em;
  color: #1a1206; cursor: pointer; border: none; border-radius: 999px;
  padding: 15px 40px;
  background: linear-gradient(180deg, #fbe6b4, #e0b955 60%, #caa13c);
  box-shadow: 0 10px 34px rgba(212,175,55,.4), inset 0 1px 0 rgba(255,255,255,.6);
  opacity: 0; animation: fadeUp 1s ease 1.45s both, glowPulse 3.2s ease-in-out 2.6s infinite;
  transition: transform .2s ease;
}
.begin:hover { transform: translateY(-2px) scale(1.03); }
.begin:active { transform: translateY(0) scale(.99); }
.intro-sub {
  margin-top: 26px; font-family: 'Marcellus', serif; letter-spacing: .3em;
  text-transform: uppercase; font-size: 11px; color: #9aa6cf;
  opacity: 0; animation: fadeUp 1s ease 1.8s both;
}

/* ——— HEADER ——— */
.header {
  position: relative; z-index: 5;
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(212,175,55,.18);
  background: linear-gradient(180deg, rgba(8,12,30,.85), rgba(8,12,30,.4));
  backdrop-filter: blur(6px);
}
.brand { display: flex; align-items: center; gap: 9px; }
.brand-mark { color: #e8c46a; font-size: 17px; }
.brand-text {
  font-family: 'Marcellus', serif; font-size: 17px; letter-spacing: .12em;
  color: #f3ead3;
}
.header-right { display: flex; align-items: center; gap: 10px; }
.toggle {
  display: flex; border: 1px solid rgba(212,175,55,.35); border-radius: 999px;
  overflow: hidden; background: rgba(255,255,255,.03);
}
.tg {
  font-family: 'Marcellus', serif; font-size: 12.5px; letter-spacing: .08em;
  padding: 7px 15px; border: none; background: transparent; color: #cdbf9a;
  cursor: pointer; transition: all .2s ease;
}
.tg-on { background: linear-gradient(180deg, #e8c46a, #caa13c); color: #1a1206; }
.music {
  width: 38px; height: 38px; border-radius: 50%; cursor: pointer;
  border: 1px solid rgba(212,175,55,.35); background: rgba(255,255,255,.03);
  color: #e8c46a; font-size: 17px; line-height: 1;
  display: flex; align-items: center; justify-content: center; transition: all .2s ease;
}
.music-on { background: linear-gradient(180deg, #e8c46a, #caa13c); color: #1a1206;
  box-shadow: 0 0 16px rgba(212,175,55,.5); animation: glowPulse 2.4s ease-in-out infinite; }

/* ——— STATS ——— */
.stats {
  position: relative; z-index: 5;
  display: flex; gap: 8px; padding: 12px 14px;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  border-bottom: 1px solid rgba(212,175,55,.12);
  background: rgba(8,12,30,.45);
}
.stat {
  flex: 1 0 auto; min-width: 78px; text-align: center;
  padding: 8px 6px; border-radius: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
  border: 1px solid rgba(212,175,55,.14);
}
.stat-num {
  display: block; font-family: 'Cormorant Garamond', serif; font-weight: 600;
  font-size: 26px; line-height: 1; color: #f0d98a;
}
.stat-num .of { font-size: 15px; opacity: .7; }
.stat-hearts .stat-num { color: #ef9fb0; }
.stat-label {
  display: block; margin-top: 4px; font-family: 'Marcellus', serif;
  font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: #9aa6cf;
}

/* ——— CONTENT / MAP ——— */
.content { position: relative; z-index: 4; flex: 1; min-height: 0; }
.map-wrap { position: relative; width: 100%; height: 100%; }
.map-container { width: 100%; height: 100%; background: #0a0e22; }
.map-loading {
  position: absolute; inset: 0; z-index: 2; display: flex; align-items: center;
  justify-content: center; font-style: italic; font-size: 19px; color: #cdbf9a;
}
.leaflet-container { background: #0a0e22 !important; font-family: 'Cormorant Garamond', serif; }
.leaflet-control-attribution {
  background: rgba(8,12,30,.7) !important; color: #8390b8 !important; font-size: 9px !important;
}
.leaflet-control-attribution a { color: #b9a05a !important; }
.leaflet-bar a {
  background: rgba(12,18,42,.9) !important; color: #e8c46a !important;
  border-color: rgba(212,175,55,.3) !important;
}

/* ——— PINS ——— */
.pin-wrap { background: transparent !important; border: none !important; }
.pin {
  width: 22px; height: 22px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
  background: linear-gradient(135deg, #f5e29a, #d4af37);
  border: 1.5px solid #fff3cf;
  box-shadow: 0 0 12px 2px rgba(212,175,55,.7);
  display: flex; align-items: center; justify-content: center;
  animation: pinDrop .5s cubic-bezier(.2,1.2,.4,1) both;
}
.pin-glyph { transform: rotate(45deg); font-size: 11px; color: #2a1d05; line-height: 1; }
.pin-done {
  background: linear-gradient(135deg, #f7c3cd, #d98695);
  box-shadow: 0 0 15px 3px rgba(217,134,149,.85);
}
.pin-finale { width: 32px; height: 32px; }
.pin-finale .pin-glyph { font-size: 15px; }
.pin-locked { filter: grayscale(.55) brightness(.7); box-shadow: 0 0 8px 1px rgba(212,175,55,.35); }
.pin-unlocked {
  background: linear-gradient(135deg, #fff0b8, #e8c046);
  box-shadow: 0 0 22px 6px rgba(240,217,138,.9);
  animation: glowPulse 1.5s ease-in-out infinite;
}
.pin-label {
  position: absolute; left: 50%; top: 24px; transform: translateX(-50%);
  font-family: 'Marcellus', serif; font-size: 11px; color: #f0d98a;
  white-space: nowrap; text-shadow: 0 1px 5px #000, 0 0 8px #000; pointer-events: none;
}
@keyframes pinDrop { from { opacity: 0; transform: rotate(-45deg) translateY(-14px) scale(.6); } to { opacity: 1; } }

/* ——— TIMELINE ——— */
.timeline {
  position: relative; height: 100%; overflow-y: auto; -webkit-overflow-scrolling: touch;
  padding: 26px 18px 60px; max-width: 720px; margin: 0 auto;
}
.tl-spine {
  position: absolute; left: 31px; top: 30px; bottom: 30px; width: 2px;
  background: repeating-linear-gradient(to bottom, #d4af37 0 3px, transparent 3px 11px);
  opacity: .5;
}
.tl-item {
  position: relative; display: flex; align-items: center; gap: 14px;
  width: 100%; text-align: left; cursor: pointer;
  background: linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.012));
  border: 1px solid rgba(212,175,55,.16); border-radius: 16px;
  padding: 16px 16px 16px 14px; margin: 0 0 16px 0; color: inherit;
  transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
}
.tl-item:hover { transform: translateY(-2px); border-color: rgba(212,175,55,.4);
  box-shadow: 0 10px 30px rgba(0,0,0,.35); }
.tl-finale { border-color: rgba(240,217,138,.45);
  background: linear-gradient(180deg, rgba(232,196,106,.12), rgba(232,196,106,.03)); }
.tl-node {
  flex: 0 0 auto; width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 12px;
  background: rgba(12,18,42,.95); border: 2px solid #d4af37; color: #f0d98a;
  box-shadow: 0 0 10px rgba(212,175,55,.5); z-index: 1;
}
.tl-node-done { border-color: #d98695; color: #f7c3cd; box-shadow: 0 0 12px rgba(217,134,149,.7); }
.tl-node-finale { border-color: #f0d98a; box-shadow: 0 0 14px rgba(240,217,138,.8); }
.tl-body { flex: 1; min-width: 0; }
.tl-when {
  display: block; font-family: 'Marcellus', serif; font-size: 10.5px;
  letter-spacing: .14em; text-transform: uppercase; color: #9aa6cf;
}
.tl-name { display: block; font-size: 23px; color: #f3ead3; line-height: 1.15; margin: 2px 0; }
.tl-teaser { display: block; font-style: italic; font-size: 15px; color: #cdbf9a; }
.tl-arrow { flex: 0 0 auto; color: #d4af37; font-size: 22px; opacity: .7; }

/* ——— OVERLAY / CARD ——— */
.overlay {
  position: fixed; inset: 0; z-index: 40; display: flex; align-items: center;
  justify-content: center; padding: 16px;
  background: radial-gradient(circle at 50% 30%, rgba(20,28,60,.6), rgba(4,6,16,.88));
  backdrop-filter: blur(5px); animation: fadeIn .3s ease both;
}
.card {
  position: relative; width: 100%; max-width: 560px; max-height: 92vh; overflow-y: auto;
  -webkit-overflow-scrolling: touch; border-radius: 22px; padding: 22px 20px 26px;
  background:
    radial-gradient(600px 200px at 50% -10%, rgba(212,175,55,.12), transparent 60%),
    linear-gradient(170deg, #131a3a 0%, #0f1430 60%, #140f29 100%);
  border: 1px solid rgba(212,175,55,.35);
  box-shadow: 0 30px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.06);
  animation: cardIn .42s cubic-bezier(.2,1,.3,1) both;
}
@keyframes cardIn { from { opacity: 0; transform: translateY(24px) scale(.97); } to { opacity: 1; } }
.close {
  position: absolute; top: 12px; right: 14px; z-index: 3;
  width: 34px; height: 34px; border-radius: 50%; cursor: pointer;
  background: rgba(0,0,0,.35); border: 1px solid rgba(212,175,55,.3);
  color: #e8c46a; font-size: 20px; line-height: 1;
  display: flex; align-items: center; justify-content: center;
}
.card-when {
  font-family: 'Marcellus', serif; font-size: 11px; letter-spacing: .22em;
  text-transform: uppercase; color: #e7b9c4; text-align: center;
}
.card-title {
  font-family: 'Cormorant Garamond', serif; font-weight: 600; font-style: italic;
  font-size: clamp(30px, 8vw, 42px); text-align: center; margin: 4px 0 16px;
  background: linear-gradient(180deg, #fbe6b4, #d8b052);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

/* ——— GALLERY ——— */
.gallery { margin-bottom: 16px; }
.photo-frame {
  position: relative; width: 100%; aspect-ratio: 4 / 3; border-radius: 16px;
  overflow: hidden; border: 1px solid rgba(212,175,55,.3); background: #0c1230;
}
.photo { width: 100%; height: 100%; object-fit: cover; display: block; }
.placeholder {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; text-align: center; padding: 20px;
  background:
    radial-gradient(circle at 50% 35%, rgba(212,175,55,.14), transparent 60%),
    repeating-linear-gradient(45deg, rgba(255,255,255,.025) 0 12px, transparent 12px 24px),
    linear-gradient(160deg, #14193a, #0f1330);
}
.ph-mark { font-size: 34px; opacity: .9; }
.ph-hint { font-family: 'Marcellus', serif; font-size: 11px; letter-spacing: .12em;
  text-transform: uppercase; color: #9aa6cf; }
.no-photos .ph-cap { font-style: italic; font-size: 17px; color: #d8cba8; max-width: 320px; line-height: 1.5; }
.nav {
  position: absolute; top: 50%; transform: translateY(-50%); z-index: 2;
  width: 40px; height: 40px; border-radius: 50%; cursor: pointer;
  background: rgba(8,12,30,.55); border: 1px solid rgba(212,175,55,.4);
  color: #f0d98a; font-size: 24px; line-height: 1;
  display: flex; align-items: center; justify-content: center; transition: background .2s;
}
.nav:hover { background: rgba(8,12,30,.85); }
.nav-l { left: 10px; } .nav-r { right: 10px; }
.counter {
  position: absolute; bottom: 10px; right: 12px; z-index: 2;
  font-family: 'Marcellus', serif; font-size: 12px; letter-spacing: .1em;
  color: #f3ead3; background: rgba(8,12,30,.6); padding: 3px 10px; border-radius: 999px;
  border: 1px solid rgba(212,175,55,.3);
}
.caption {
  text-align: center; font-style: italic; font-size: 17px; color: #e9dcbd;
  margin-top: 10px;
}
.thumbs { display: flex; gap: 8px; margin-top: 12px; overflow-x: auto; padding-bottom: 4px; }
.thumb {
  flex: 0 0 auto; width: 52px; height: 52px; border-radius: 10px; overflow: hidden;
  cursor: pointer; padding: 0; border: 1px solid rgba(212,175,55,.25);
  background: #0c1230; opacity: .6; transition: opacity .2s, border-color .2s;
}
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb-ph { display: flex; width: 100%; height: 100%; align-items: center; justify-content: center;
  color: #b9a05a; font-family: 'Marcellus', serif; font-size: 14px; }
.thumb-active { opacity: 1; border-color: #e8c46a; box-shadow: 0 0 10px rgba(212,175,55,.45); }

/* ——— MESSAGE ——— */
.card-message p {
  font-size: 18.5px; line-height: 1.66; color: #efe4cb; margin: 0 0 14px;
}
.card-message p:first-child::first-letter {
  font-size: 1.6em; color: #f0d98a; font-style: italic; line-height: 1; padding-right: 2px;
}

/* ——— QUIZ ——— */
.quiz {
  margin-top: 18px; padding: 16px 16px 18px; border-radius: 16px;
  background: linear-gradient(180deg, rgba(232,196,106,.07), rgba(232,196,106,.02));
  border: 1px solid rgba(212,175,55,.25);
}
.quiz-tag {
  font-family: 'Marcellus', serif; font-size: 10.5px; letter-spacing: .2em;
  text-transform: uppercase; color: #e7b9c4; margin-bottom: 7px;
}
.quiz-q { font-size: 20px; font-style: italic; color: #f3ead3; margin-bottom: 14px; line-height: 1.4; }
.quiz-opts { display: flex; flex-direction: column; gap: 9px; }
.option {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  text-align: left; cursor: pointer; padding: 12px 15px; border-radius: 12px;
  font-family: 'Cormorant Garamond', serif; font-size: 17.5px; color: #ecdfc0;
  background: rgba(255,255,255,.04); border: 1px solid rgba(212,175,55,.2);
  transition: transform .15s ease, border-color .15s ease, background .15s ease;
}
.option:not(:disabled):hover { transform: translateX(3px); border-color: rgba(212,175,55,.55);
  background: rgba(255,255,255,.07); }
.option:disabled { cursor: default; }
.option-correct {
  background: linear-gradient(180deg, rgba(217,134,149,.28), rgba(217,134,149,.1));
  border-color: #e89fb0; color: #fff; box-shadow: 0 0 16px rgba(217,134,149,.4);
}
.option-wrong { opacity: .42; text-decoration: line-through; }
.opt-mark { color: #f7c3cd; font-size: 16px; }
.quiz-msg {
  margin-top: 13px; text-align: center; font-style: italic; font-size: 17px; color: #f7c3cd;
  animation: fadeUp .5s ease both;
}

/* ——— FINALE EXTRAS ——— */
.ps {
  margin-top: 18px; padding: 15px 16px; border-radius: 14px; font-style: italic;
  font-size: 17.5px; line-height: 1.6; color: #f7e7c2;
  background: linear-gradient(180deg, rgba(212,175,55,.14), rgba(212,175,55,.04));
  border: 1px dashed rgba(240,217,138,.5);
  animation: fadeUp .7s ease .2s both;
}
.sign {
  margin-top: 18px; text-align: center; font-family: 'Cormorant Garamond', serif;
  font-style: italic; font-size: clamp(24px, 6vw, 32px);
  background: linear-gradient(180deg, #fbe6b4, #d8b052);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

/* ——— HEART BURST ——— */
.burst { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 5; }
.burst-full { position: fixed; z-index: 60; }
.burst-heart {
  position: absolute; bottom: -10%; opacity: 0;
  animation-name: floatUp; animation-timing-function: ease-out; animation-fill-mode: forwards;
}
@keyframes floatUp {
  0% { opacity: 0; transform: translateY(0) scale(.6) rotate(0deg); }
  15% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-110vh) scale(1.1) rotate(40deg); }
}

/* ——— CELEBRATION BANNER ——— */
.celebrate {
  position: fixed; inset: 0; z-index: 55; pointer-events: none;
  display: flex; align-items: flex-start; justify-content: center;
}
.celebrate-msg {
  margin-top: 16vh; text-align: center; padding: 16px 26px; border-radius: 18px;
  font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 26px; color: #1a1206;
  background: linear-gradient(180deg, #fbe6b4, #e0b955);
  box-shadow: 0 16px 50px rgba(212,175,55,.5);
  animation: cardIn .5s ease both;
}
.celebrate-msg span { display: block; font-size: 15px; font-style: normal;
  font-family: 'Marcellus', serif; letter-spacing: .06em; margin-top: 6px; color: #3a2a08; }

/* ——— TOAST ——— */
.toast {
  position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%); z-index: 65;
  max-width: 88%; text-align: center; padding: 12px 20px; border-radius: 999px;
  font-size: 16.5px; font-style: italic; color: #f6ecd2;
  background: rgba(12,18,42,.95); border: 1px solid rgba(212,175,55,.45);
  box-shadow: 0 12px 40px rgba(0,0,0,.5); animation: toastIn .35s ease both;
}
@keyframes toastIn { from { opacity: 0; transform: translate(-50%, 14px); } to { opacity: 1; transform: translate(-50%, 0); } }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes glowPulse {
  0%,100% { box-shadow: 0 0 18px rgba(212,175,55,.45); }
  50% { box-shadow: 0 0 32px rgba(240,217,138,.85); }
}

@media (min-width: 700px) {
  .stat { min-width: 110px; }
  .card-message p { font-size: 19.5px; }
}
`;
