/*
  ════════════════════════════════════════════════════════════════════════════
   HER STORY  —  A birthday gift for Nidhi Arjariya Chhabra
   Her whole life, told with love: from the little girl in her very first
   photos, through every birthday and every year that made her, all the way
   to the life we're building together — and every plate we've loved along it.
  ════════════════════════════════════════════════════════════════════════════

  HOW TO MAKE THIS YOURS  (everything you need to edit is marked with  >>> )

  ── WHERE TO PUT YOUR PHOTOS & VIDEOS ──────────────────────────────────────
  Because this is a real project (not just a chat artifact), the EASIEST and
  most private option is the built-in `public/` folder:

      public/media/bali-1.jpg
      public/media/goa-clip.mp4

  …then reference them with a leading slash:  url: "/media/bali-1.jpg"
  (No uploading, no accounts, works offline. See SETUP.md for cloud options
   like Cloudinary if you'd rather host them online.)

  ── 1) 📸  TRIP / "MOMENTS" PHOTOS ──────────────────────────────────────────
        Each trip has a `photos: [ ... ]` list (the candid + place pics).
        Paste a URL into `url:` and a sweet `caption:`. Leave `url: ""` for an
        elegant placeholder. Add as many as you like.

  ── 2) 🍲  FOOD PHOTOS ──────────────────────────────────────────────────────
        All food photos live in the `FEAST_PHOTOS` array (below MEMORIES).
        They show up in the dedicated "Feast Together" view — one unified
        gallery of every dish from every trip.

  ── 3) 🎬  VIDEOS (optional, feasible!) ─────────────────────────────────────
        Each trip has a `video: ""`. Paste a DIRECT video file URL (.mp4) or a
        /public path like "/media/goa-clip.mp4". When she answers that trip's
        quiz, the video plays — and the moment it ends, the photos are revealed.
        (A YouTube *page* link won't work for the auto-advance; use an .mp4.)

  ── 4) 🎵  SONG ─────────────────────────────────────────────────────────────
        Set SONG_URL below to a DIRECT audio file (.mp3 / .m4a).
        Vibe: "Ilahi" (Yeh Jawaani Hai Deewani) or "Patakha Guddi" (Highway).

  ── 5) 📍  YOUR NEW FLAT'S LOCATION ─────────────────────────────────────────
        In the `flat` entry, replace lat/lng with your new home's coordinates
        (right-click the spot in Google Maps → first numbers are lat, lng).

  All the love notes, quiz questions and captions are already written for you
  in a husband's voice — but make them even more *you*.
  ════════════════════════════════════════════════════════════════════════════
*/

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ───────────────── SOUND EFFECTS (Web Audio API — no files needed) ───────────────── */
const AudioCtx = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx && AudioCtx) _audioCtx = new AudioCtx();
  if (_audioCtx && _audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}
function playChime() {
  const ctx = getAudioCtx(); if (!ctx) return;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.12 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.7);
  });
}
function playSparkle() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + 0.5);
}
function playEnvelopeSound() {
  const ctx = getAudioCtx(); if (!ctx) return;
  [200, 350, 500].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.07);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * 0.07 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.3);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.07);
    osc.stop(ctx.currentTime + i * 0.07 + 0.4);
  });
}
function playCelebrate() {
  const ctx = getAudioCtx(); if (!ctx) return;
  [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = i % 2 === 0 ? "sine" : "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.1 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.5);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.1);
    osc.stop(ctx.currentTime + i * 0.1 + 0.6);
  });
}

/* ───────────────── SHAKE DETECTION HOOK ───────────────── */
function useShake(callback, threshold = 25) {
  const cbRef = useRef(callback);
  cbRef.current = callback;
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0, lastTime = 0;
    function onMotion(e) {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x == null) return;
      const now = Date.now();
      if (now - lastTime < 150) return;
      const delta = Math.abs(acc.x - lastX) + Math.abs(acc.y - lastY) + Math.abs(acc.z - lastZ);
      if (delta > threshold && lastTime > 0) cbRef.current();
      lastX = acc.x; lastY = acc.y; lastZ = acc.z; lastTime = now;
    }
    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [threshold]);
}

/* >>> 🎵 PASTE YOUR SONG'S DIRECT AUDIO URL HERE (leave '' for none) */
const SONG_URL = "/media/hawayein.mp3";

/* >>> 🎂 HAPPY BIRTHDAY MUSIC — plays automatically at midnight on her birthday */
const BIRTHDAY_SONG_URL = "/media/happy-birthday.mp3";

/* >>> 🎂 HER BIRTHDAY — month is 0-indexed (5 = June) */
const BIRTHDAY_MONTH = 5; // June
const BIRTHDAY_DAY = 22;

/* 🎂 Midnight IST on her birthday = 18:30 UTC the day before (IST = UTC+5:30) */
const BIRTHDAY_MIDNIGHT_UTC = new Date("2026-06-21T18:30:00Z");

/* ────────────────────────────────────────────────────────────────────────────
   THE MEMORIES  —  placed by real latitude / longitude, in the order we lived them.
   Each one has:  photos (moments)  •  food (everything we ate)  •  video (optional)
   ──────────────────────────────────────────────────────────────────────────── */
const MEMORIES = [
  {
    id: "born",
    name: "The Day You Arrived",
    short: "Hello, World",
    when: "Once upon a beginning",
    type: "occasion",
    icon: "🍼",
    teaser: "Before us, before everything — there was you.",
    message:
      "Before me, before us, before a single page of our story was written — there was you. A tiny, perfect girl who arrived and quietly changed the world for everyone who would ever love you. I wasn't there yet, Nidhi, but when I look at these photos I feel something fierce and overwhelming: gratitude. Gratitude that you were born, that you made it here, that somewhere in the world a little girl was beginning a life that would one day become my whole world. This is where your story truly begins. Happy birthday, my love. 🤍",
    video: "",
    photos: [
      { url: "/media/born/born-01-newborn.jpg", focus: "74% 32%", caption: "The very first you — brand new to a world that had no idea how lucky it had just become." },
      { url: "/media/born/born-02-lifted-to-the-sky.jpg", caption: "Lifted to the sky, already reaching for everything. Some things never change. 🤍" },
      { url: "/media/born/born-03-flower-garden.jpg", caption: "A little flower among the flowers — you fit right in. 🌸" },
    ],
    food: [],
    quiz: null,
  },
  {
    id: "little-you",
    name: "Little You",
    short: "Little You",
    when: "A childhood full of light",
    type: "occasion",
    icon: "🌸",
    teaser: "Tiny hands, big eyes, a heart already too big for the frame.",
    message:
      "Look at you. Tiny hands, enormous eyes, and a personality already far too big for any photograph to hold. Dressed like royalty, fed sweets like a little princess, blowing out candles with your eyes squeezed shut — you've been the centre of everyone's love, the birthday girl, since the very beginning. I love that I get to see these little pieces of you, the years long before I knew you existed. Every one of them was quietly building the woman I would fall completely, hopelessly in love with.",
    video: "",
    photos: [
      { url: "/media/little-you/little-you-01-rajasthani-portrait.jpg", caption: "Dressed like a little queen — and already looking at the world like she owned it. 👑" },
      { url: "/media/little-you/little-you-02-being-fed.jpg", fit: "contain", caption: "Sweet tooth from the very start — being fed by hands that adored you. 🍬" },
      { url: "/media/childhood-birthdays/childhood-bday-01-cake.jpg", caption: "Eyes closed, wish ready, cake in front of you — you've always known how to make a wish count. 🎂" },
      { url: "/media/childhood-birthdays/childhood-bday-02-party-horn.jpg", caption: "Party hat on, horn blowing — the original birthday girl. Today is no different. 🎉" },
    ],
    food: [],
    quiz: null,
  },
  {
    id: "family",
    name: "Where You Come From",
    short: "Family",
    when: "The roots that made you",
    type: "occasion",
    icon: "🏡",
    teaser: "The love you were raised in.",
    message:
      "Every bit of warmth you carry, every way you turn a house into a home, every ounce of the fierce love you give so freely — it all started here, with these people. Your family. The ones who raised you, fed you, lifted you to the sky and caught you every single time. When I married you, Nidhi, I didn't just fall in love with you — I fell in love with where you come from, and with all the love that quietly shaped you into the woman I adore. And the best part? They're still right here — at every celebration, every hug, every photo. Some things only grow stronger with time. 💗",
    video: "",
    photos: [
      { url: "/media/family/family-01-beach.jpg", focus: "50% 24%", caption: "Toes in the water, your whole family laughing — the kind of day a childhood is made of. 🌊" },
      { url: "/media/family/family-02-grandmother.jpg", caption: "Generations in a single frame — the love you were raised in." },
      { url: "/media/family/family-05-with-grandmother.jpg", caption: "In your grandmother's lap — wrapped in the oldest, softest kind of love." },
      { url: "/media/family/family-03-with-dad.jpg", caption: "Safe in the arms that held you first." },
      { url: "/media/family/family-06-home.jpg", caption: "Everyday home, everyday love — the little moments that quietly built you." },
      { url: "/media/family/family-04-temple.jpg", caption: "Your first adventures — the whole family, exploring the world together. 🛕" },
      { url: "/media/siblings/siblings-04-joyful-hug.jpg", focus: "50% 24%", caption: "Caught mid-laugh, holding on tight — the joy you've carried your whole life." },
      { url: "/media/siblings/siblings-05-school.jpg", caption: "Years pass, you grow up — but some arms always feel like home." },
      { url: "/media/family/family-07-recent-four.jpg", focus: "50% 22%", caption: "All grown up, still together — the family that made you, still right beside you." },
      { url: "/media/family/family-08-with-mom.jpg", focus: "50% 16%", caption: "Your very first home was her arms — and it still is. 💗" },
      { url: "/media/family/family-09-recent-group.jpg", focus: "50% 46%", caption: "Last year, same love, brand-new smiles — your whole world in one frame." },
    ],
    food: [],
    quiz: null,
  },
  {
    id: "her-first-baby",
    name: "Her First Baby",
    short: "Her First Baby",
    when: "Her little brother, always",
    type: "occasion",
    icon: "🧡",
    teaser: "The first little one she ever loved like her own.",
    message:
      "He was the very first baby you ever loved like your own. Long before you were anyone's wife, you were his big sister — the one who mothered him, kissed his cheeks, carried him on your back, and decided early on that he was yours to protect. Watching how fiercely and tenderly you loved your little brother told me everything I needed to know about the heart you have. He was your first baby. And look at him now — all grown up, still laughing in your arms. Some bonds only grow stronger with time. 🧡",
    video: "",
    photos: [
      { url: "/media/siblings/siblings-01-little-brother-kiss.jpg", focus: "50% 20%", caption: "A kiss on the cheek and a bond for life." },
      { url: "/media/siblings/siblings-02-porch.jpg", caption: "Two against the world, right from the very start." },
      { url: "/media/siblings/siblings-09-piggyback-hug.jpg", caption: "Carrying him everywhere — you never once put him down. 🧡" },
      { url: "/media/siblings/siblings-07-cheek-kiss.jpg", caption: "The kind of love that needs no words — just a cheek to kiss." },
      { url: "/media/siblings/siblings-08-temple.jpg", caption: "Reaching for the sky together — some hands you never stop holding." },
      { url: "/media/siblings/siblings-10-brother-grown.jpg", focus: "50% 22%", caption: "All grown up now — and still, you're the one who makes him laugh like that. 🧡" },
      { url: "/media/siblings/siblings-11-brother-building.jpg", focus: "50% 55%", caption: "Your baby brother — taller than you now, but forever your first little one. 🧡" },
    ],
    food: [],
    quiz: null,
  },
  {
    id: "becoming-you",
    name: "Becoming You",
    short: "Becoming You",
    when: "Every phase that made her",
    type: "occasion",
    icon: "✨",
    teaser: "A little girl becoming the woman I'd adore.",
    message:
      "Watch a little girl become a young woman, frame by frame. That same smile, those same shining eyes — they were always there, just growing into the person you were meant to be. Dancing like no one was watching, chasing the sea, laughing at something just out of frame: independent, fearless, completely your own. You never needed anyone to complete you, Nidhi — you were already whole, already brilliant, already everything. And every single one of these years, every version of you, was quietly leading you straight to the day our roads would finally cross.",
    video: "",
    photos: [
      { url: "/media/growing-up/growing-up-01-smile.jpg", focus: "50% 6%", caption: "That smile. Even then, it could light up an entire room." },
      { url: "/media/growing-up/growing-up-03-portrait.jpg", caption: "A little older now — the same light in your eyes." },
      { url: "/media/growing-up/growing-up-02-portrait.jpg", caption: "Somewhere in this face is the woman I'd fall for — I just didn't know it yet. ✨" },
      { url: "/media/her-spirit/her-spirit-01-dancing.jpg", caption: "Dancing like the whole world was yours — because it was. 💃" },
      { url: "/media/her-spirit/her-spirit-02-beach.jpg", caption: "Just you and the sea — free, fearless, completely yourself. 🌊" },
      { url: "/media/her-spirit/her-spirit-03-candid.jpg", caption: "That quiet little smile — the one I'd fall for without even knowing it yet." },
    ],
    food: [],
    quiz: null,
  },
  {
    id: "her-friends",
    name: "The Friends Who Became Family",
    short: "Her Girls",
    when: "The ones who walked beside her",
    type: "occasion",
    icon: "👭",
    teaser: "Laughter, road trips, and friendships that became family.",
    message:
      "Everyone has a few people who feel like home — and these are yours. The girls who laughed with you until it hurt, travelled with you, kept your secrets and held your hand through everything life threw your way. The way you love your people — so loyally, so fully, so forever — was one of the very first things I admired about you. I'll always be grateful to the friends who loved you, shaped you, and helped make you the incredible woman who one day walked into my life.",
    video: "",
    photos: [
      { url: "/media/her-friends/her-friends-01-selfie.jpg", focus: "50% 28%", caption: "The kind of friendship that needs no occasion — just the two of you, always." },
      { url: "/media/her-friends/her-friends-02-trio.jpg", caption: "Your girls — laughter guaranteed, every single time." },
      { url: "/media/her-friends/her-friends-03-beach.jpg", caption: "Sun, sand, and your favourite people. Some days are just pure joy. ☀️" },
      { url: "/media/her-friends/her-friends-04-deer-wall.jpg", caption: "Cheek to cheek, smiles all the way — the friends who feel like home." },
      { url: "/media/her-friends/her-friends-05-cheek.jpg", focus: "50% 38%", caption: "No reason needed, just the two of you and a camera. 💛" },
    ],
    food: [],
    quiz: null,
  },
  {
    id: "first-met",
    name: "Where It All Began",
    short: "First Meet",
    when: "March 2022",
    type: "occasion",
    icon: "💕",
    teaser: "A Kwid, a terrible coffee, and the start of everything.",
    message:
      "March 2022. I drove my little Renault Kwid to Bada Ganpati to pick you up — you'd just finished office and parked your Activa. We went on a long drive through the Super Corridor, windows down, talking like we'd known each other forever. At Cafe Yolo, I tried to impress you by ordering something called 'Cafe Anaconda' — easily the worst coffee either of us has ever tasted. But you laughed, and I knew. Later, when I had a short work call, I gently caressed your head — and you went completely calm. That was the moment I realised: I never want to stop being the person who makes your world feel quieter. Every single day since has been proof that I was right.",
    video: "",
    photos: [
      { url: "/media/first-met/first-met-01-bada-ganpati.jpg", caption: "Bada Ganpati — where I picked you up that evening" },
      { url: "/media/first-met/first-met-02-kwid.jpg", caption: "The Kwid — our ride that started it all" },
      { url: "/media/first-met/first-met-03-cafe-yolo.jpg", caption: "Cafe Yolo — and the legendary Cafe Anaconda" },
    ],
    food: [],
    quiz: {
      q: "What terrible coffee did I order at Cafe Yolo to impress you on our first meet?",
      options: ["Cafe Tornado", "Cafe Anaconda", "Cafe Monsoon", "Cafe Everest"],
      correct: 1,
      right: "Cafe Anaconda! Terrible coffee, perfect evening. The beginning of us. 💛",
      wrong: "Not quite — the name was dramatic, the taste was awful, and the company was everything. Try again, my love.",
    },
  },
  {
    id: "roka",
    name: "Our Roka",
    short: "Roka",
    when: "October 2023",
    type: "occasion",
    icon: "🪷",
    teaser: "Making it official, with blessings and love.",
    message:
      "The day we made it official. We went to the gurudwara together, heads bowed, hearts full — and then celebrated over lunch at Cafe Oakaz. It was simple, beautiful, and perfectly us. No grand gestures, just two people quietly promising to spend their lives together. That day, I looked at you across the table and thought: every road in my life was always leading here, to you.",
    video: "",
    photos: [
      { url: "/media/roka/roka-01-celebration-wide.jpg", caption: "The room that held our promise — balloons, petals, and us" },
      { url: "/media/roka/roka-02-holding-hands.jpg", caption: "Holding hands, holding futures" },
      { url: "/media/roka/roka-03-together.jpg", caption: "Celebrating our roka together" },
      { url: "/media/roka/roka-04-candid-laughs.jpg", caption: "The laughs that made it all real" },
      { url: "/media/roka/roka-05-rose-petal-heart.jpg", caption: "Rose petals, balloons, and the start of forever" },
    ],
    food: [],
    quiz: null,
  },
  {
    id: "his-proposal",
    name: "The Night I Proposed",
    short: "His Proposal",
    when: "January 2024",
    type: "occasion",
    icon: "💍",
    teaser: "One knee, one slideshow, one chocolate box.",
    message:
      "I'd been planning this for weeks. The Eighteen restaurant, a custom slideshow playing on the big screen — every photo of us, every moment, building up to the question I already knew the answer to. When I got down on one knee and held out that chocolate box that said 'Will you marry me?' — Nidhi, the look on your face is burned into my heart forever. You said yes, and in that moment, I became the luckiest man alive. I still am.",
    video: "",
    photos: [
      { url: "/media/his-proposal/his-proposal-01-rooftop-selfie.jpg", caption: "The evening that changed everything — rooftop under fairy lights" },
      { url: "/media/his-proposal/his-proposal-02-her-smile.jpg", caption: "That smile — she had no idea what was coming" },
      { url: "/media/his-proposal/his-proposal-03-heart-hands.jpg", caption: "Heart hands — if only she knew what I had planned" },
      { url: "/media/his-proposal/his-proposal-04-forehead-kiss.jpg", caption: "The moment right before I asked the most important question" },
      { url: "/media/his-proposal/his-proposal-05-the-eighteen-inside.jpg", caption: "The Eighteen — where I asked her to be mine forever" },
      { url: "/media/his-proposal/his-proposal-06-the-eighteen-entrance.jpg", caption: "Together at The Eighteen — the night she said yes" },
      { url: "/media/his-proposal/his-proposal-07-chocolate-box.jpg", caption: "Will U Marry Me — the chocolate box that sealed the deal" },
    ],
    food: [],
    quiz: {
      q: "What was written on the chocolate box I gave you when I proposed?",
      options: ["I Love You Forever", "Be Mine", "Will you marry me?", "You + Me = Always"],
      correct: 2,
      right: "'Will you marry me?' — and you said yes. The best answer I've ever heard. 💍",
      wrong: "Close but not quite — think chocolate, think a very specific question on the box. Try again, my love.",
    },
  },
  {
    id: "her-proposal",
    name: "The Day She Proposed Back",
    short: "Her Proposal",
    when: "March 2024",
    type: "occasion",
    icon: "💗",
    teaser: "My birthday, her chaos, one perfect ring.",
    message:
      "My birthday, March 2024 — and you had the sweetest secret plan. You wanted to propose somewhere truly special, somewhere grand and worthy of the moment. But I kept changing my birthday plans — one idea after another — and your perfect plan kept slipping right through your fingers. So with barely any time and your whole heart, you made a split-second decision: you pulled me up to the top floor of Cafe Oakaz (freshly renovated and gorgeous) and proposed to me right there, on the spot. It wasn't the venue you'd dreamed of — but Nidhi, it was perfect. Because in that instant I understood: you don't just love me, you adapt for us, you fight for us, even against my own chaotic, indecisive birthday self. I'd choose that messy, beautiful, instant 'yes' a thousand times over.",
    video: "",
    photos: [
      { url: "/media/her-proposal/her-proposal-01-couch-selfie.jpg", caption: "Cafe Oakaz — where her backup plan turned out perfect" },
      { url: "/media/her-proposal/her-proposal-02-intimate-moment.jpg", caption: "The moment she made my heart stop" },
      { url: "/media/her-proposal/her-proposal-03-her-at-oakaz.jpg", caption: "The top floor, just the two of us" },
      { url: "/media/her-proposal/her-proposal-04-together-wide.jpg", caption: "Together at Oakaz — where she turned my birthday into forever" },
      { url: "/media/her-proposal/her-proposal-05-holding-hands.jpg", caption: "Holding hands, holding on to this moment" },
    ],
    food: [],
    quiz: {
      q: "Why was it so chaotic for Nidhi to plan her proposal on my birthday?",
      options: ["The restaurant was closed", "I kept changing my birthday plans", "It was raining", "She forgot the ring at home"],
      correct: 1,
      right: "I kept changing plans! Poor Nidhi was silently going mad trying to keep her surprise alive. Worth it. 💗",
      wrong: "Not this one — think about whose birthday it was and how unpredictable the birthday boy was being. Try again!",
    },
  },
  {
    id: "wedding",
    name: "The Day We Said Forever",
    short: "Wedding",
    when: "July 2024",
    type: "occasion",
    icon: "💒",
    teaser: "11th July — the day everything began.",
    message:
      "11th July 2024. The day I married the most beautiful woman in the world. Nidhi, you managed everything — every detail, every flower, every moment — and still looked absolutely breathtaking. You danced in my baarat, just for me, and I couldn't look anywhere else. Your mother, your mausi, and your cousins gave the most beautiful dance performances to welcome me, and I felt so loved by your whole family. And then, during the mala exchange, I couldn't help myself — I had a short little dance on stage to 'Tu Hai To Dil Dhadakta Hai.' Because my heart really was doing exactly that. It still does. Every single day.",
    video: "",
    photos: [
      { url: "/media/wedding/wedding-01-grand-entry.jpg", caption: "Walking into forever — our grand entry with sparklers" },
      { url: "/media/wedding/wedding-02-on-stage.jpg", caption: "On stage, jaimala done — the moment it all became real" },
      { url: "/media/wedding/wedding-03-stage-together.jpg", caption: "The most beautiful bride I've ever seen — and my little dance" },
      { url: "/media/wedding/wedding-04-havan.jpg", caption: "Seven rounds, one promise — by the sacred fire" },
      { url: "/media/wedding/wedding-05-temple-visit.jpg", caption: "First temple visit as Mr. and Mrs. — blessings for the road ahead" },
    ],
    food: [],
    quiz: {
      q: "What song did I dance to on stage during the mala exchange at our wedding?",
      options: ["Gallan Goodiyan", "Tu Hai To Dil Dhadakta Hai", "Tum Hi Ho", "London Thumakda"],
      correct: 1,
      right: "'Tu Hai To Dil Dhadakta Hai' — because with you, it really does. Every day. 💒",
      wrong: "Not that one — think about what my heart was doing the moment I put the mala around your neck. Try again!",
    },
  },
  {
    id: "bali",
    name: "Bali & Malaysia",
    short: "Bali",
    when: "July 2024",
    type: "trip",
    icon: "✈️",
    teaser: "Where our forever began.",
    message:
      "Malaysia AND Bali — our honeymoon was an epic double feature. We ate thepla in the airport like proper Indori newlyweds, then spent the next days chasing every thrill we could find. The ATV ride through the Balinese jungle was wild, snorkeling made us feel like we'd discovered a secret ocean, and the dolphin centre — Nidhi, seeing your face when your childhood dream came true — I'll carry that forever. We lived on acai bowls, mango acai bowls, and drank from coconuts bigger than our heads by the beach. And somehow, in between all the adventure, we found the most incredible Indian food abroad. Two newlyweds, sandy feet, impossibly full hearts. This is where our forever really began.",
    video: "",
    photos: [
      { url: "/media/bali/bali-01-passport-selfie.jpg", caption: "Passports out — the adventure begins" },
      { url: "/media/bali/bali-02-boarding.jpg", caption: "Boarding our honeymoon flight" },
      { url: "/media/bali/bali-03-beach.jpg", caption: "That beach, that sunset, you" },
      { url: "/media/bali/bali-04-cafe.jpg", caption: "Café mornings in Bali" },
      { url: "/media/bali/bali-05-atv-jungle.jpg", caption: "Jungle ATV adventure" },
      { url: "/media/bali/bali-06-dolphin.jpg", caption: "Making friends with dolphins" },
      { url: "/media/bali/bali-12-scooter-ride.jpg", caption: "Helmets on, exploring Bali two-wheeler style" },
      { url: "/media/bali/bali-07-kl-tower.jpg", caption: "Standing tall at KL Tower" },
      { url: "/media/bali/bali-08-kl-observation.jpg", caption: "Taking in the KL skyline" },
      { url: "/media/bali/bali-09-kl-dinner.jpg", caption: "Dinner dates in Kuala Lumpur" },
      { url: "/media/bali/bali-13-kl-petronas.jpg", focus: "50% 60%", caption: "Under the Petronas Towers — Malaysia, hand in hand" },
      { url: "/media/bali/bali-10-ocean-walkway.jpg", caption: "That ocean view walkway — paradise found" },
      { url: "/media/bali/bali-11-stone-garden.jpg", caption: "Posing with the ancient stone guardians" },
    ],
    food: [],
    quiz: {
      q: "What was Nidhi's childhood dream that came true on our honeymoon?",
      options: ["Seeing the Eiffel Tower", "Visiting a dolphin centre", "Climbing a volcano", "Riding a hot air balloon"],
      correct: 1,
      right: "The dolphin centre! Seeing your face light up was the best part of the whole trip. 🐬",
      wrong: "Not this one — think about something Nidhi had dreamed about since she was little. Try again, my love.",
    },
  },
  {
    id: "goa",
    name: "Goa",
    short: "Goa",
    when: "January 2026",
    type: "trip",
    icon: "🌊",
    teaser: "Where we healed, together.",
    message:
      "This one's tender. We came to Goa to heal — together. We partied on Tito's Street, took long drives all the way to Arambol with the windows down, stayed right by the beach where we could hear the waves at night. Neither of us knows how to swim — but that never stopped us for a second. We spent hours bathing in the ocean, laughing as the waves knocked us over, splashing about like two kids without a single worry in the world. We didn't need to swim; we just needed the water, and each other. We came carrying something heavy, and we left a little lighter. You reminded me that the right person makes even the hard chapters feel survivable. I quietly, completely fell in love with you all over again here.",
    video: "",
    photos: [
      { url: "/media/goa/goa-01-flight-selfie.jpg", caption: "On the flight — couldn't stop looking at each other" },
      { url: "/media/goa/goa-02-beach-hug.jpg", caption: "The sea that healed us" },
      { url: "/media/goa/goa-03-waves.jpg", focus: "50% 26%", caption: "Ocean bath — just us and the waves" },
      { url: "/media/goa/goa-04-sunset-together.jpg", caption: "Watching the sunset, side by side" },
      { url: "/media/goa/goa-05-sunset-kiss.jpg", caption: "A kiss as the sun went down" },
      { url: "/media/goa/goa-06-her-at-sunset.jpg", caption: "Her, the sunset, and my whole world in one frame" },
      { url: "/media/goa/goa-07-hotel-selfie.jpg", caption: "Our beachside stay" },
      { url: "/media/goa/goa-08-night-dance.jpg", caption: "Dancing on the beach at night" },
      { url: "/media/goa/goa-09-night-beach.jpg", caption: "She owns the night" },
      { url: "/media/goa/goa-10-butterfly-wall.jpg", caption: "The butterfly wall — our spot" },
    ],
    food: [],
    quiz: {
      q: "Goa wasn't just a holiday — what did we really do there?",
      options: ["Healed and found our way back to each other", "Ran a marathon", "Opened a café", "Learned to surf"],
      correct: 0,
      right: "We healed there, side by side. I'll never forget what that meant. 🩵",
      wrong: "Gently no — it was something far more important than any activity. 🩵",
    },
  },
  {
    id: "snowops",
    name: "Snowops — Our Company",
    short: "Snowops",
    when: "March 2026",
    type: "occasion",
    icon: "🚀",
    teaser: "Building something beautiful, together.",
    message:
      "Most couples share a Netflix account. We started a company. Snowops — built from late-night conversations, shared ambitions, and the wild belief that we could create something real, together. You are my co-founder in every sense: in business, in life, in dreaming bigger than either of us could alone. Building Snowops with you isn't just work — it's proof that when two people trust each other completely, there's nothing they can't build.",
    video: "",
    photos: [
      { url: "/media/snowops/snowops-01-company.jpg", caption: "The beginning of Snowops" },
      { url: "/media/snowops/snowops-02-luxury.jpg", caption: "Co-founders in life and everything else" },
    ],
    food: [],
    quiz: null,
  },
  {
    id: "jaipur",
    name: "Jaipur",
    short: "Jaipur",
    when: "April 2026",
    type: "trip",
    icon: "🕌",
    teaser: "Temples and forts, hand in hand.",
    message:
      "The Pink City, hand in hand — but it was the temples that stole this trip. We visited Khatu Shyam Mandir and Salasar Balaji Mandir, and Nidhi, watching you there — the peace on your face, the devotion — I fell in love with this side of you, too. You absolutely loved it. We climbed the forts, explored every corner, and ate incredible food at Johari. Walking those golden walls beside you, I kept thinking how lucky I am that I get to explore this entire life with you.",
    video: "",
    photos: [
      { url: "/media/jaipur/jaipur-01-amber-fort.jpg", caption: "Together at Amber Fort" },
      { url: "/media/jaipur/jaipur-02-hawa-mahal.jpg", caption: "Hawa Mahal lit up at night" },
      { url: "/media/jaipur/jaipur-03-jal-mahal.jpg", caption: "Dreaming by Jal Mahal" },
      { url: "/media/jaipur/jaipur-04-night-view.jpg", caption: "The Pink City sparkling below" },
      { url: "/media/jaipur/jaipur-05-palace-throne.jpg", caption: "Our royal palace moment" },
      { url: "/media/jaipur/jaipur-06-hotel-mirror.jpg", caption: "Mirror selfie at our Rajasthani haveli" },
    ],
    food: [],
    quiz: {
      q: "Which two temples did we visit on our Jaipur trip that Nidhi absolutely loved?",
      options: ["Birla Mandir and ISKCON", "Khatu Shyam Mandir and Salasar Balaji Mandir", "Govind Dev Ji and Galtaji", "Moti Dungri and Garh Ganesh"],
      correct: 1,
      right: "Khatu Shyam and Salasar Balaji! The peace on your face there is something I'll never forget. 🙏",
      wrong: "Not those — think about the two temples where Nidhi felt the most at home. Try again!",
    },
  },
  {
    id: "flat-purchased",
    name: "Our Home",
    short: "Our Home",
    when: "June 2026",
    type: "occasion",
    icon: "🏠",
    teaser: "We explored every corner of the city — and found home.",
    message:
      "We walked through so many areas, debated so many floor plans, imagined so many futures — and finally, we found it. Our flat. Our first real home, just for us. No more temporary, no more 'someday.' This is where we'll cook our first meal together, where we'll argue about wall colours, where we'll build the life we've been dreaming about since that first drive down the Super Corridor. Every room in this flat is a promise. And I can't wait to fill it with us.",
    video: "",
    photos: [
      { url: "/media/home/home-01-coming-soon.jpg", caption: "Coming soon — the next chapter of us" },
    ],
    food: [],
    quiz: null,
  },
  {
    id: "indore",
    name: "Indore — Home",
    short: "Indore",
    when: "Every ordinary, perfect day",
    type: "trip",
    icon: "☕",
    teaser: "Home — our everyday love, one long drive at a time.",
    message:
      "Not every love story needs a passport. Our own city holds our smallest, sweetest moments — and the truth is, our favourite thing was never a café or a fancy table. It was the open road: long, aimless drives in our little Kwid, windows down, music up, talking about everything and nothing. Yes, we ate together at plenty of places — but we were never the crazy-about-cafés kind. No restaurant in Indore knows us by name, none of them remember 'our order.' We were always more about the drive than the destination. Home isn't a place, Nidhi — it's the passenger seat right next to me.",
    video: "",
    photos: [
      { url: "/media/indore/indore-01-event-night.jpg", focus: "50% 22%", caption: "Dressed up, showing up — always together" },
      { url: "/media/indore/indore-02-holi-family.jpg", caption: "Holi with family — colours, chaos, and us" },
      { url: "/media/indore/indore-03-burger-king-queen.jpg", caption: "My Burger King queen" },
      { url: "/media/indore/indore-04-cafe-hug.jpg", caption: "Our favourite corner of every café" },
      { url: "/media/indore/indore-05-coffee-outdoors.jpg", caption: "Coffee and sunshine — her happy place" },
      { url: "/media/indore/indore-06-cafe-smile.jpg", caption: "That smile across the table" },
      { url: "/media/indore/indore-07-railway-track.jpg", caption: "Free spirit on the tracks" },
      { url: "/media/indore/indore-08-romantic-dinner.jpg", caption: "The hand-kiss that stopped time" },
    ],
    food: [],
    quiz: {
      q: "What was our absolute favourite thing to do together in Indore?",
      options: ["Café-hopping every weekend", "Long, aimless drives in our Kwid", "Shopping at the mall", "Watching late-night movies"],
      correct: 1,
      right: "Long drives in our little Kwid — windows down, music up, nowhere to be. Our happy place. 🚗",
      wrong: "Close, but think simpler — windows down, open road, just us and the Kwid. Try again, my love!",
    },
  },
  {
    id: "finale",
    name: "A Birthday Promise",
    short: "Forever ★",
    when: "Happy Birthday, my love",
    type: "occasion",
    icon: "💛",
    isFinale: true,
    teaser: "A promise for the year ahead — and every year after.",
    message:
      "My dearest Nidhi,\n\nEvery card before this one is a piece of your story — from the tiny girl who arrived and changed the world, to little you blowing out birthday candles, to the years that quietly shaped you — and then to us: that first drive in my Kwid to Cafe Yolo, our roka at the gurudwara, to the night I proposed at The Eighteen, to the day you proposed right back at Cafe Oakaz, to our wedding on 11th July when you danced in my baarat, to our honeymoon in Bali where your dolphin dream came true, to every trip, every meal, every quiet moment that made us us.\n\nWe built Snowops together. We found our flat together. And now, on your birthday, I want you to know: you are the bravest, most brilliant person I've ever met. A lawyer, a company secretary, a dreamer who chose to bet on us and build something beautiful together.\n\nSo here's my promise for this year and every year after:\n\nI promise to be your safest place when the world feels loud. I promise to cook with you, travel with you, laugh with you until our cheeks hurt. I promise to celebrate you — not just today, but on every ordinary Tuesday, every tired evening, every quiet morning.\n\nYou are not just my wife. You are my favourite person, my best adventure, my home.\n\nHappy birthday, Nidhi. This is just the beginning.\n— Forever and always yours.",
    ps:
      "P.S. You just proved you know our story by heart. But here's a secret only I know: every single day with you has been my favourite day — right up until the next one. Now close your eyes, make a wish… and come find me. 🥂",
    birthdayNote:
      "This year, I wish for you: a thousand more sunsets together, every flavour you've ever craved, and the kind of happiness that makes your heart feel too full to hold.\n\nAnd here's what I see when I dream about our future:\n\nTravelling the world together — every continent, every culture, every sunset we haven't seen yet. Buying great cars — because you deserve to arrive in style (and I deserve a co-pilot who controls the playlist). Enjoying life — really, truly, deeply. Building Snowops into something we're both proud of. And most of all: growing old together, still laughing, still adventuring, still falling in love with you every morning.\n\nYou deserve the whole world, Nidhi — and I'm going to spend my life making sure you feel it. Happy birthday, my love. 💛",
    video: "",
    photos: [
      { url: "/media/finale/finale-01-queen.jpg", caption: "Live life, queen size" },
    ],
    food: [],
    quiz: null,
  },
];

/* ──────────────────────────────────────────────────────────────────────────── */

const FEAST_PHOTOS = [
  { url: "/media/feast/feast-14-coconut-bowl.jpg", caption: "Breakfast served in a coconut, the ocean for company — Bali spoiled us 🥥" },
  { url: "/media/feast/feast-12-fine-dining.jpg", caption: "Fine-dining art on a plate — almost too pretty to disturb" },
  { url: "/media/feast/feast-13-crepes-curry.jpg", caption: "Candle-lit dinner abroad — handmade crepes and a fragrant curry, just for two" },
  { url: "/media/feast/feast-09-tandoori-platter.jpg", caption: "A grand tandoori platter on a banana leaf — paneer tikka, kebabs and all" },
  { url: "/media/feast/feast-01-malai-kofta.jpg", caption: "Malai kofta in velvety tomato gravy — comfort food that tastes like home" },
  { url: "/media/feast/feast-07-rajasthani-thali.jpg", caption: "A royal Rajasthani thali — dal baati churma and a dozen little bowls of joy" },
  { url: "/media/feast/feast-08-bao-buns.jpg", caption: "Bao buns lined up and dressed to impress — gone in minutes" },
  { url: "/media/feast/feast-06-mocktail-stirfry.jpg", caption: "Tangy mocktails and a sizzling stir-fry — an evening, unplugged" },
  { url: "/media/feast/feast-10-veg-pizza.jpg", caption: "A wood-fired pizza loaded with peppers and jalapeños — our kind of cheesy" },
  { url: "/media/feast/feast-04-sandwich-fries.jpg", caption: "A loaded sandwich, a mountain of fries, and every sauce within reach" },
  { url: "/media/feast/feast-03-purple-burger.jpg", caption: "A burger almost too pretty to eat — purple bun, crispy wedges, a dunk of sauce" },
  { url: "/media/feast/feast-02-cafe-croissant.jpg", caption: "Lazy café mornings — a croissant, a cheese puff, and the coldest coffee" },
  { url: "/media/feast/feast-05-street-dessert.jpg", caption: "Street-side sweetness eaten on the move — cherries, custard, zero regrets" },
  { url: "/media/feast/feast-11-churros.jpg", caption: "Christmas-tree churros under a waterfall of warm chocolate — need I say more?" },
  { url: "/media/jaipur/jaipur-08-wine-appetizers.jpg", caption: "Mango mocktail and tiny bites — Jaipur" },
  { url: "/media/jaipur/jaipur-09-dessert.jpg", caption: "Desserts on a banana leaf — Jaipur" },
  { url: "/media/jaipur/jaipur-10-chaat.jpg", caption: "Chaat so good we almost cried — Jaipur" },
  { url: "/media/jaipur/jaipur-11-naan-curry.jpg", caption: "Naan, curry, and no regrets — Jaipur" },
  { url: "/media/jaipur/jaipur-12-thali.jpg", caption: "The Rajasthani thali of dreams — Jaipur" },
  { url: "/media/jaipur/jaipur-13-thali-lassi.jpg", caption: "Thali round two with lassi — Jaipur" },
  { url: "/media/jaipur/jaipur-14-poori-kachori.jpg", caption: "Poori-kachori breakfast — Jaipur" },
];

const QUIZ_TOTAL = MEMORIES.filter((m) => m.quiz).length;

const FIRST_MET_DATE = new Date("2022-03-07");

const LOVE_QUOTES = [
  "In all the world, there is no heart for me like yours.",
  "Every love story is beautiful, but ours is my favourite.",
  "I choose you. And I'll choose you over and over.",
  "You are my today and all of my tomorrows.",
  "Wherever you are is my home.",
  "I loved you yesterday. I love you still. I always have, I always will.",
  "You are my sun, my moon, and all my stars.",
  "From Cafe Yolo to forever — I'd choose this story every time.",
  "You danced in my baarat. I'll dance for you every day.",
  "Co-founders in love, in life, in everything.",
];

const REASONS_I_LOVE_YOU = [
  { reason: "The way you laugh — really laugh — with your whole heart", icon: "😂" },
  { reason: "How you make every meal feel like a celebration", icon: "🍽️" },
  { reason: "Your courage to chase every dream, no matter how big", icon: "🦋" },
  { reason: "The way you light up when you talk about something you love", icon: "✨" },
  { reason: "How you always know exactly what to say to make everything okay", icon: "💬" },
  { reason: "Your strength — you are the bravest person I know", icon: "💪" },
  { reason: "The way you look at me like I'm your favourite person in any room", icon: "👀" },
  { reason: "How you turn every trip into the best adventure of my life", icon: "🗺️" },
  { reason: "Your kindness — the way you treat everyone with so much warmth", icon: "🤗" },
  { reason: "The little notes, the little touches, the little ways you love me", icon: "💌" },
  { reason: "How you challenge me to be a better version of myself every day", icon: "🌟" },
  { reason: "The fact that you chose me — and keep choosing me", icon: "💍" },
  { reason: "Your smile first thing in the morning", icon: "🌅" },
  { reason: "The way you make our house feel like home", icon: "🏠" },
  { reason: "How you never give up on anything — especially us", icon: "💛" },
  { reason: "Your voice when you call my name", icon: "🎵" },
  { reason: "The way you steal all the blankets and I don't even mind", icon: "🛏️" },
  { reason: "How every photo of us is my new favourite photo", icon: "📸" },
  { reason: "Your passion for food — and for sharing it with me", icon: "🍕" },
  { reason: "The way you make even ordinary days feel extraordinary", icon: "🌈" },
  { reason: "How safe I feel when I'm with you", icon: "🫂" },
  { reason: "Your determination — lawyer, company secretary, dreamer, all at once", icon: "⚡" },
  { reason: "How you kept your proposal a secret even when I kept changing plans", icon: "🎁" },
  { reason: "The way you managed our entire wedding and still looked like a dream", icon: "👰" },
  { reason: "How you light up at temples — Khatu Shyam, Salasar Balaji, Nathdwara", icon: "🙏" },
  { reason: "Your courage to start Snowops with me — co-founder of my whole life", icon: "🚀" },
  { reason: "The way you calmed down when I touched your head at Cafe Yolo — and I knew", icon: "🤍" },
  { reason: "Our long, aimless drives in the Kwid — windows down, just you and me", icon: "🚗" },
  { reason: "The way you jumped into the ocean with me, even though neither of us can swim", icon: "🌊" },
  { reason: "The fierce, tender way you love your little brother — your first baby", icon: "🧡" },
  { reason: "How you dance like the whole world is yours — and it is", icon: "💃" },
  { reason: "Because you are my today, my tomorrow, and every day after", icon: "♾️" },
];

const SECRET_MESSAGES = [
  "The first coffee I ever ordered for you was 'Cafe Anaconda.' Still embarrassed. ☕",
  "Remember how you calmed down when I touched your head at Cafe Yolo? That's when I knew. 🤍",
  "You kept your proposal secret while I kept changing plans. You're incredible. 💍",
  "We ate thepla in the airport on our honeymoon. Most Indori thing ever. 🫓",
  "The day you danced in my baarat — I couldn't see anyone else. 💃",
  "From a Kwid and an Activa to our own flat and our own company. Look how far we've come. 🏠",
  "Every new day with you is still my favourite chapter. 💛",
];

const ALL_STORY_PHOTOS = MEMORIES.flatMap((m) =>
  (m.photos || []).filter((p) => p.url).map((p) => ({ ...p, memoryName: m.name, memoryIcon: m.icon }))
);

const PROMISES = [
  { text: "Travel somewhere new together", icon: "✈️" },
  { text: "Cook your favourite dish from scratch", icon: "🍳" },
  { text: "Take 100 more photos of us", icon: "📸" },
  { text: "Go on a long, aimless Kwid drive at sunset", icon: "🚗" },
  { text: "Watch the sunrise together at least once", icon: "🌅" },
  { text: "Build our home into the warmest place on earth", icon: "🏠" },
  { text: "Surprise you when you least expect it", icon: "🎁" },
  { text: "Dance with you in the kitchen", icon: "💃" },
  { text: "Hold your hand through every hard day", icon: "🤝" },
  { text: "Love you louder, every single day", icon: "💛" },
];

/* ───────────────────────────── OCCASION CARDS (replaces MapView) ───────────────────────────── */
function OccasionCards({ answered, unlocked, onOpen }) {
  return (
    <div className="cards-view">
      <div className="collage-strip">
        <div className="collage-title">Her Story</div>
        {MEMORIES.filter((m) => {
          const p = (m.photos || []).find((p) => p.url);
          return p;
        })
          .slice(0, 6)
          .map((m, i) => {
            const p = m.photos.find((p) => p.url);
            return (
              <div className="collage-img" key={m.id} style={{ animationDelay: i * 2 + "s" }}>
                <img src={p.url} alt={m.name} />
              </div>
            );
          })}
      </div>

      <div className="cards-grid">
        {MEMORIES.map((m, i) => {
          const done = answered[m.id] === "correct";
          const finale = m.isFinale;
          const locked = finale && !unlocked;
          const tilt = ((i * 7 + 3) % 7) - 3;

          let status = "";
          if (finale && unlocked) status = "★";
          else if (finale) status = "🔒";
          else if (done) status = "♥";

          const coverPhoto = (m.photos || []).find((p) => p.url);

          return (
            <button
              key={m.id}
              className={
                "occasion-card" +
                (done ? " oc-done" : "") +
                (finale ? " oc-finale" : "") +
                (locked ? " oc-locked" : "") +
                (finale && unlocked ? " oc-unlocked" : "")
              }
              style={{ "--tilt": tilt + "deg", animationDelay: i * 0.06 + "s" }}
              onClick={() => onOpen(m.id)}
            >
              <div className="oc-clip" />
              <div className="oc-body">
                <div className="oc-cover">
                  {coverPhoto ? (
                    <img src={coverPhoto.url} alt={m.name} className="oc-cover-img" style={coverPhoto.focus ? { objectPosition: coverPhoto.focus } : undefined} />
                  ) : (
                    <span className="oc-icon">{m.icon || "💛"}</span>
                  )}
                </div>
                <div className="oc-info">
                  <span className="oc-name">{m.short}</span>
                  <span className="oc-when">{m.when}</span>
                </div>
                {status && <div className="oc-status">{status}</div>}
              </div>
            </button>
          );
        })}
      </div>

      <SecretSparkles />
    </div>
  );
}

/* ───────────────────────────── SECRET SPARKLES (with hint) ───────────────────────────── */
function SecretSparkles() {
  const [found, setFound] = useState(new Set());
  const [active, setActive] = useState(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 25000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (found.size > 0 && showHint) setShowHint(false);
  }, [found.size, showHint]);

  function reveal(idx) {
    if (found.has(idx)) return;
    playSparkle();
    setFound((s) => new Set(s).add(idx));
    setActive(idx);
    setShowHint(false);
    setTimeout(() => setActive(null), 3500);
  }

  const positions = [
    { top: "12%", left: "8%" },
    { top: "28%", right: "6%" },
    { top: "45%", left: "4%" },
    { top: "62%", right: "10%" },
    { top: "78%", left: "12%" },
    { top: "35%", right: "3%" },
    { top: "88%", left: "6%" },
  ];

  return (
    <>
      {SECRET_MESSAGES.map((msg, idx) => (
        <button
          key={idx}
          className={"secret-sparkle" + (found.has(idx) ? " ss-found" : "") + (showHint && idx === 0 ? " ss-hinted" : "")}
          style={positions[idx % positions.length]}
          onClick={() => reveal(idx)}
          aria-label="Secret message"
        >
          ✦
        </button>
      ))}
      {showHint && found.size === 0 && (
        <div className="sparkle-hint">
          Psst… there are secrets hidden on this page. Look for the ✦
        </div>
      )}
      {active !== null && (
        <div className="secret-bubble" key={active}>
          {SECRET_MESSAGES[active]}
        </div>
      )}
      {found.size > 0 && (
        <div className="secret-counter">
          ✨ {found.size}/{SECRET_MESSAGES.length} secrets found
        </div>
      )}
    </>
  );
}

/* ───────────────────────────── FOR YOU — REASONS I LOVE YOU (flip cards) ───────────────────────────── */
function ReasonsILoveYou() {
  const [flipped, setFlipped] = useState(new Set());
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef(null);
  const bottomRef = useRef(null);
  const lastIdx = REASONS_I_LOVE_YOU.length - 1;

  const allFlipped = flipped.size >= REASONS_I_LOVE_YOU.length;

  function flipCard(i) {
    if (flipped.has(i)) return;
    if (i === lastIdx) return;
    playSparkle();
    setFlipped((s) => new Set(s).add(i));
  }

  function onLastDown() {
    if (flipped.has(lastIdx)) return;
    setHoldProgress(0);
    let start = Date.now();
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / 2000, 1);
      setHoldProgress(progress);
      if (progress >= 1) {
        clearInterval(holdTimerRef.current);
        playCelebrate();
        setFlipped((s) => new Set(s).add(lastIdx));
        setHoldProgress(0);
      }
    }, 30);
  }

  function onLastUp() {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (!flipped.has(lastIdx)) setHoldProgress(0);
  }

  useEffect(() => {
    if (allFlipped && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [allFlipped]);

  return (
    <div className="reasons">
      <div className="reasons-head">
        <div className="reasons-kicker">A birthday list, just for you</div>
        <h2 className="reasons-title">Reasons I Love You</h2>
        <p className="reasons-sub">Thirty-two reasons — one for every beautiful year of you.</p>
        <p className="reasons-instruction">Tap each card to reveal 💛</p>
      </div>

      <div className="reasons-list">
        {REASONS_I_LOVE_YOU.map((r, i) => {
          const isFlipped = flipped.has(i);
          const isLast = i === lastIdx;
          return (
            <div
              key={i}
              className={"reason-flip" + (isFlipped ? " rf-flipped" : "") + (isLast ? " rf-last" : "")}
              style={{ animationDelay: Math.min(i, 8) * 0.06 + "s" }}
              onClick={() => isLast ? undefined : flipCard(i)}
              onMouseDown={isLast ? onLastDown : undefined}
              onMouseUp={isLast ? onLastUp : undefined}
              onMouseLeave={isLast ? onLastUp : undefined}
              onTouchStart={isLast ? onLastDown : undefined}
              onTouchEnd={isLast ? onLastUp : undefined}
            >
              <div className="rf-inner">
                <div className="rf-front">
                  <span className="rf-num">{i + 1}</span>
                  <span className="rf-icon-hidden">{r.icon}</span>
                  {isLast && !isFlipped && (
                    <>
                      <span className="rf-hold-label">Hold to reveal</span>
                      {holdProgress > 0 && (
                        <div className="rf-hold-ring" style={{ "--prog": holdProgress }} />
                      )}
                    </>
                  )}
                  {!isLast && <span className="rf-tap-hint">tap</span>}
                </div>
                <div className="rf-back">
                  <span className="rf-num-back">{i + 1}</span>
                  <span className="rf-icon-back">{r.icon}</span>
                  <span className="rf-text">{r.reason}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="reasons-progress">
        {flipped.size} / {REASONS_I_LOVE_YOU.length} revealed
      </div>

      {allFlipped && (
        <div className="reasons-end">
          <span className="reasons-end-heart">{"💛"}</span>
          <p>…and a million reasons more.</p>
          <p className="reasons-end-sign">Happy Birthday, Nidhi.</p>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

/* ───────────────────────────── FEAST VIEW (all our food) ───────────────────────────── */
function Feast({ onLightbox }) {
  return (
    <div className="feast">
      <div className="feast-head">
        <div className="feast-kicker">Two foodies, one love story</div>
        <h2>Feast Together</h2>
        <p>Every plate we shared, in every place we loved — a map of us, in flavours.</p>
      </div>

      <div className="feast-row feast-row-unified">
        {FEAST_PHOTOS.map((f, i) => (
          <button
            key={i}
            className="feast-card"
            onClick={() => onLightbox({ ...f, place: "Our Feast" })}
          >
            {f.url ? (
              <img src={f.url} alt={f.caption} />
            ) : (
              <span className="feast-ph">🍴</span>
            )}
            <span className="feast-cap">{f.caption}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Lightbox for tapping a single food photo in the Feast view. */
function Lightbox({ item, onClose }) {
  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lb-inner" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close">
          {"×"}
        </button>
        {item.url ? (
          <img src={item.url} alt={item.caption || ""} />
        ) : (
          <div className="lb-ph">
            {"🍴"}
            <span>Add this photo's URL in the code</span>
          </div>
        )}
        <div className="lb-cap">
          <strong>{item.caption}</strong>
          <span>{item.place}</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── PHOTO GALLERY (crossfade + double-tap heart) ───────────────────────────── */
function Gallery({ photos, emptyText }) {
  const [i, setI] = useState(0);
  const [heartPos, setHeartPos] = useState(null);
  const touchX = useRef(null);
  const lastTap = useRef(0);
  useEffect(() => setI(0), [photos]);

  function handleDoubleTap(e) {
    const now = Date.now();
    if (now - lastTap.current < 350) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = e.clientX ?? (e.changedTouches && e.changedTouches[0]?.clientX) ?? rect.width / 2;
      const clientY = e.clientY ?? (e.changedTouches && e.changedTouches[0]?.clientY) ?? rect.height / 2;
      setHeartPos({ x: clientX - rect.left, y: clientY - rect.top });
      playSparkle();
      setTimeout(() => setHeartPos(null), 1200);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="gallery">
        <div className="photo placeholder no-photos">
          <div className="ph-mark">✨</div>
          <div className="ph-cap">
            {emptyText ||
              "This memory lives in flavours and laughter — no photos, just the feeling of being there with you."}
          </div>
        </div>
      </div>
    );
  }

  const p = photos[i];
  const go = (d) => setI((x) => (x + d + photos.length) % photos.length);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 45) {
      if (dx > 0) go(-1); else go(1);
    } else {
      handleDoubleTap(e);
    }
    touchX.current = null;
  };

  return (
    <div className="gallery">
      <div className="photo-frame" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onClick={handleDoubleTap}>
        {p.url ? (
          <img className="photo" key={p.url + "-" + i} src={p.url} alt={p.caption || ""} style={{ objectFit: p.fit || undefined, objectPosition: p.focus || undefined }} />
        ) : (
          <div className="photo placeholder">
            <div className="ph-mark">{"📷"}</div>
            <div className="ph-hint">Paste a photo URL in the code</div>
          </div>
        )}

        {heartPos && (
          <div className="dbl-tap-heart" key={heartPos.x + "-" + heartPos.y} style={{ left: heartPos.x, top: heartPos.y }}>
            {"❤️"}
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

      {p.caption && <div className="caption" key={"cap-" + i}>{p.caption}</div>}

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

/* Photos inside a memory card (food is now in the unified Feast section) */
function MediaTabs({ photos }) {
  return <Gallery key="moments" photos={photos} />;
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

/* Floating-heart + rose-petal burst (plays on a correct answer / celebration). */
function HeartBurst({ trigger, full }) {
  if (!trigger) return null;
  const petals = ["💛", "❤️", "🌹", "💗", "🌸", "🤍", "💐", "🥀", "✨"];
  return (
    <div className={"burst" + (full ? " burst-full" : "")} key={trigger}>
      {Array.from({ length: full ? 36 : 20 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * (full ? 0.8 : 0.3);
        const dur = 1 + Math.random() * (full ? 1.6 : 1);
        const size = 14 + Math.random() * 22;
        const drift = (Math.random() - 0.5) * 60;
        return (
          <span
            key={i}
            className="burst-heart"
            style={{
              left: left + "%",
              animationDelay: delay + "s",
              animationDuration: dur + "s",
              fontSize: size + "px",
              "--drift": drift + "px",
            }}
          >
            {petals[i % petals.length]}
          </span>
        );
      })}
    </div>
  );
}

/* ───────────────────────────── FINALE EXPERIENCE (full-screen takeover) ───────────────────────────── */
function FinaleExperience({ mem, unlocked, onClose }) {
  const [stage, setStage] = useState(0);
  const [typewriterDone, setTypewriterDone] = useState(false);
  const [slideshowIdx, setSlideshowIdx] = useState(0);
  const [revealedPromises, setRevealedPromises] = useState(new Set());
  const slideshowTimer = useRef(null);

  useEffect(() => {
    playCelebrate();
    const t = setTimeout(() => setStage(1), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (stage === 1) {
      const t = setTimeout(() => setStage(2), 3000);
      return () => clearTimeout(t);
    }
    if (stage === 2) {
      const t = setTimeout(() => setStage(3), 2500);
      return () => clearTimeout(t);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 5 && ALL_STORY_PHOTOS.length > 0) {
      slideshowTimer.current = setInterval(() => {
        setSlideshowIdx((prev) => (prev + 1) % ALL_STORY_PHOTOS.length);
      }, 4000);
      return () => clearInterval(slideshowTimer.current);
    }
  }, [stage]);

  function revealPromise(i) {
    if (revealedPromises.has(i)) return;
    playSparkle();
    setRevealedPromises((s) => new Set(s).add(i));
  }

  return (
    <div className="finale-exp" onClick={(e) => e.stopPropagation()}>
      <button className="finale-exp-close" onClick={onClose} aria-label="Close">{"×"}</button>
      <Fireworks active duration={12000} />

      {stage === 0 && (
        <div className="finale-stage finale-entrance">
          <div className="finale-entrance-stars" />
        </div>
      )}

      {stage === 1 && (
        <div className="finale-stage finale-name-stage">
          <div className="finale-calligraphy">Nidhi</div>
        </div>
      )}

      {stage === 2 && (
        <div className="finale-stage finale-hbd-stage">
          <div className="finale-crown-big">{"👑"}</div>
          <h1 className="finale-hbd-text">Happy Birthday</h1>
          <h2 className="finale-hbd-name">Nidhi</h2>
          <div className="finale-hbd-sparkles">{"✨ 🎂 ✨"}</div>
        </div>
      )}

      {stage === 3 && (
        <div className="finale-stage finale-letter-stage">
          <div className="finale-letter-scroll">
            <div className="finale-letter-paper">
              <div className="finale-letter-date">22nd June, 2026</div>
              <h3 className="finale-letter-greeting">My dearest Nidhi,</h3>
              <div className="finale-letter-body">
                {mem.message.split("\n\n").map((para, idx) => (
                  <p key={idx}>
                    <Typewriter text={para} speed={18} onDone={idx === mem.message.split("\n\n").length - 1 ? () => setTypewriterDone(true) : undefined} />
                  </p>
                ))}
              </div>
              {typewriterDone && (
                <div className="finale-letter-actions">
                  {mem.birthdayNote && (
                    <div className="finale-bday-note">
                      <div className="finale-bday-note-label">A birthday wish, handwritten from my heart</div>
                      <p className="finale-bday-note-text">{mem.birthdayNote}</p>
                    </div>
                  )}
                  {mem.ps && <div className="finale-ps">{mem.ps}</div>}
                  <div className="finale-sign">Happy birthday, Nidhi. {"💛"}</div>
                  <button className="finale-continue-btn" onClick={() => setStage(5)}>
                    See our story in photos {"→"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {stage === 5 && (
        <div className="finale-stage finale-slideshow-stage">
          {ALL_STORY_PHOTOS.length > 0 && (
            <div className="finale-slideshow">
              <img
                className="finale-slideshow-img"
                key={slideshowIdx}
                src={ALL_STORY_PHOTOS[slideshowIdx].url}
                alt={ALL_STORY_PHOTOS[slideshowIdx].caption || ""}
              />
              <div className="finale-slideshow-caption" key={"sc-" + slideshowIdx}>
                <span className="finale-slideshow-icon">{ALL_STORY_PHOTOS[slideshowIdx].memoryIcon}</span>
                {ALL_STORY_PHOTOS[slideshowIdx].caption || ALL_STORY_PHOTOS[slideshowIdx].memoryName}
              </div>
              <div className="finale-slideshow-counter">
                {slideshowIdx + 1} / {ALL_STORY_PHOTOS.length}
              </div>
            </div>
          )}
          <button className="finale-continue-btn finale-continue-bottom" onClick={() => setStage(6)}>
            One last thing {"→"}
          </button>
        </div>
      )}

      {stage === 6 && (
        <div className="finale-stage finale-promises-stage">
          <div className="finale-promises-scroll">
            <h2 className="finale-promises-title">My Promises to You</h2>
            <p className="finale-promises-sub">Tap each one to seal it {"💛"}</p>
            <div className="finale-promises-list">
              {PROMISES.map((p, i) => (
                <button
                  key={i}
                  className={"finale-promise" + (revealedPromises.has(i) ? " fp-sealed" : "")}
                  style={{ animationDelay: i * 0.08 + "s" }}
                  onClick={() => revealPromise(i)}
                >
                  <span className="fp-icon">{p.icon}</span>
                  <span className="fp-text">{p.text}</span>
                  {revealedPromises.has(i) && <span className="fp-seal">{"💛"}</span>}
                </button>
              ))}
            </div>
            <div className="finale-promises-progress">
              {revealedPromises.size} / {PROMISES.length} sealed
            </div>
            {revealedPromises.size >= PROMISES.length && (
              <div className="finale-promises-end">
                <p>Every promise, sealed with love.</p>
                <p className="finale-promises-sign">Happy birthday, my love. Always yours, Sagar. {"💛"}</p>
                <button className="finale-continue-btn" onClick={onClose}>
                  Back to her story
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────── AUTO SLIDESHOW (montage mode) ───────────────────────────── */
function AutoSlideshow({ onClose }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || ALL_STORY_PHOTOS.length === 0) return;
    const t = setInterval(() => {
      setIdx((prev) => (prev + 1) % ALL_STORY_PHOTOS.length);
    }, 4000);
    return () => clearInterval(t);
  }, [paused]);

  if (ALL_STORY_PHOTOS.length === 0) return null;
  const p = ALL_STORY_PHOTOS[idx];

  return (
    <div className="auto-slideshow">
      <div className="as-bg" key={idx}>
        <img src={p.url} alt="" className="as-bg-img" />
      </div>
      <img className="as-photo" key={"p-" + idx} src={p.url} alt={p.caption || ""} />
      <div className="as-caption" key={"c-" + idx}>
        <span className="as-icon">{p.memoryIcon}</span>
        <span>{p.caption || p.memoryName}</span>
      </div>
      <div className="as-counter">{idx + 1} / {ALL_STORY_PHOTOS.length}</div>
      <div className="as-controls">
        <button className="as-btn" onClick={() => setIdx((x) => (x - 1 + ALL_STORY_PHOTOS.length) % ALL_STORY_PHOTOS.length)}>{"‹"}</button>
        <button className="as-btn" onClick={() => setPaused((x) => !x)}>{paused ? "▶" : "❚❚"}</button>
        <button className="as-btn" onClick={() => setIdx((x) => (x + 1) % ALL_STORY_PHOTOS.length)}>{"›"}</button>
      </div>
      <button className="as-close" onClick={onClose}>{"×"}</button>
    </div>
  );
}

/* ───────────────────────────── MEMORY MODAL ─────────────────────────────
   Reveal flow she'll experience:
     1) read the love note (envelope she taps open) + answer the quiz
     2) ✨ PHOTO REVEAL POPUP — a hero photo slides in as her reward (dismissable with ×)
     3) the trip's VIDEO plays (if you added one)
     4) the moment the video ends → the PHOTOS (Moments / Food) are revealed
   (Already-answered memories open fully unlocked when revisited.)                */
function MemoryModal({ mem, answered, wrongPicks, burst, unlocked, onClose, onAnswer, onNext }) {
  if (mem.isFinale) {
    return <FinaleExperience mem={mem} unlocked={unlocked} onClose={onClose} />;
  }

  const alreadyDone = !mem.quiz || answered[mem.id] === "correct";
  const hasVideo = !!mem.video;
  const [stage, setStage] = useState(alreadyDone ? "full" : "quiz");
  const [showReveal, setShowReveal] = useState(false);
  const videoRef = useRef(null);
  const prevAnswered = useRef(answered[mem.id]);

  useEffect(() => {
    if (prevAnswered.current !== "correct" && answered[mem.id] === "correct" && stage === "quiz") {
      setShowReveal(true);
    }
    prevAnswered.current = answered[mem.id];
  }, [answered, mem.id, stage]);

  function dismissReveal() {
    setShowReveal(false);
    setStage(hasVideo ? "video" : "full");
  }

  useEffect(() => {
    if (stage === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [stage]);

  const mediaLocked = mem.quiz && stage === "quiz";

  return (
    <div className="overlay" onClick={onClose}>
      <div className={"card" + (mem.isFinale ? " card-finale" : "")} onClick={(e) => e.stopPropagation()}>
        <HeartBurst trigger={burst} />
        {mem.isFinale && <Fireworks active duration={10000} />}
        <button className="close" onClick={onClose} aria-label="Close">
          {"×"}
        </button>

        {mem.isFinale && (
          <div className="finale-hero">
            <div className="finale-confetti-layer">
              {Array.from({ length: 30 }).map((_, i) => {
                const emojis = ["🎂", "🎁", "🎀", "🌹", "💛", "✨", "🎉", "💗", "🎊", "🥂", "👑", "🎈"];
                return (
                  <span
                    key={i}
                    className="finale-confetti"
                    style={{
                      left: Math.random() * 100 + "%",
                      animationDelay: Math.random() * 3 + "s",
                      animationDuration: 2.5 + Math.random() * 2 + "s",
                      fontSize: 14 + Math.random() * 18 + "px",
                    }}
                  >
                    {emojis[i % emojis.length]}
                  </span>
                );
              })}
            </div>
            <div className="finale-crown">👑</div>
            <h1 className="finale-bday-title">Happy Birthday</h1>
            <h2 className="finale-bday-name">Nidhi</h2>
            <div className="finale-sparkle-row">
              {"✨ 🎂 ✨"}
            </div>
          </div>
        )}

        <div className="card-when">{mem.when}</div>
        <h2 className="card-title">{mem.name}</h2>

        <Envelope name={mem.name}>
          <div className="card-message">
            {mem.isFinale ? (
              mem.message.split("\n\n").map((para, idx) => <p key={idx}>{para}</p>)
            ) : (
              mem.message.split("\n\n").map((para, idx) => (
                <p key={idx}>
                  <Typewriter text={para} speed={22} />
                </p>
              ))
            )}
          </div>
        </Envelope>

        {mem.quiz && (
          <Quiz
            mem={mem}
            state={answered[mem.id]}
            wrongPicks={wrongPicks[mem.id]}
            onAnswer={onAnswer}
          />
        )}

        {showReveal && (
          <PhotoReveal mem={mem} onClose={dismissReveal} />
        )}

        {mediaLocked ? (
          <div className="locked-media">
            <span className="lm-lock">🔒</span>
            Answer our little question to unlock our {hasVideo ? "video & photos" : "photos"} 💛
          </div>
        ) : (
          <div className="media-zone">
            {hasVideo && (
              <div className="video-block">
                <div className="video-tag">🎬 A little moment, just for you</div>
                <video
                  ref={videoRef}
                  className="memory-video"
                  src={mem.video}
                  controls
                  playsInline
                  preload="metadata"
                  onEnded={() => setStage("full")}
                />
                {stage === "video" && (
                  <button className="skip-btn" onClick={() => setStage("full")}>
                    Skip to our photos →
                  </button>
                )}
              </div>
            )}
            {stage === "full" && <MediaTabs photos={mem.photos} />}
          </div>
        )}

        {onNext && (
          <button className="next-chapter-btn" onClick={onNext}>
            Next chapter {"→"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────────── GOLDEN SPARKLES ───────────────────────────── */
function GoldenSparkles() {
  return (
    <div className="sparkles-layer">
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="sparkle"
          style={{
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            animationDelay: Math.random() * 8 + "s",
            animationDuration: 3 + Math.random() * 4 + "s",
            fontSize: 4 + Math.random() * 8 + "px",
          }}
        />
      ))}
    </div>
  );
}

/* ───────────────────────────── TYPEWRITER TEXT ───────────────────────────── */
function Typewriter({ text, speed = 28, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);
    const id = setInterval(() => {
      indexRef.current++;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(id);
        if (onDone) onDone();
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span className="tw-cursor">|</span>}
    </span>
  );
}

/* ───────────────────────────── ENVELOPE (tap to open love note) ───────────────────────────── */
function Envelope({ children, name }) {
  const [opened, setOpened] = useState(false);

  function open() {
    playEnvelopeSound();
    setOpened(true);
  }

  return opened ? (
    <div className="envelope-content" key="content">{children}</div>
  ) : (
    <button className="envelope-sealed" onClick={open}>
      <div className="env-flap" />
      <div className="env-body">
        <span className="env-icon">💌</span>
        <span className="env-label">A letter for you</span>
        <span className="env-hint">tap to open</span>
      </div>
    </button>
  );
}

/* ───────────────────────────── PHOTO REVEAL POPUP ───────────────────────────── */
function PhotoReveal({ mem, onClose }) {
  const photos = (mem.photos || []).filter((p) => p.url);
  const count = photos.length;
  const [i, setI] = useState(0);
  const touchX = useRef(null);

  const go = useCallback(
    (d) => setI((x) => (count ? (x + d + count) % count : 0)),
    [count]
  );

  // keyboard: ← → to browse, Esc to close
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  function onTouchStart(e) { touchX.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx > 45) go(-1);
    else if (dx < -45) go(1);
    touchX.current = null;
  }

  const photo = photos[i] || null;

  return (
    <div className="photo-reveal" onClick={onClose}>
      <button className="pr-close" onClick={onClose} aria-label="Close">{"×"}</button>
      <div className="pr-inner" onClick={(e) => e.stopPropagation()}>
        <div className="pr-banner">{"🎉 Your photos are unlocked"}</div>

        <div className="pr-photo-wrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {photo ? (
            <img
              key={photo.url}
              className="pr-photo"
              src={photo.url}
              alt={photo.caption || ""}
              style={{ objectFit: photo.fit || undefined, objectPosition: photo.focus || undefined }}
            />
          ) : (
            <div className="pr-placeholder"><span className="pr-ph-icon">{"✨"}</span></div>
          )}
          <div className="pr-gradient" />

          {count > 1 && (
            <>
              <button className="pr-nav pr-nav-l" onClick={() => go(-1)} aria-label="Previous photo">{"‹"}</button>
              <button className="pr-nav pr-nav-r" onClick={() => go(1)} aria-label="Next photo">{"›"}</button>
            </>
          )}

          <div className="pr-overlay">
            <div className="pr-trip-name">{mem.name}</div>
            <div className="pr-caption" key={i}>{photo && photo.caption ? photo.caption : mem.teaser}</div>
            {count > 1 && (
              <div className="pr-dots">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    className={"pr-dot" + (idx === i ? " pr-dot-on" : "")}
                    onClick={() => setI(idx)}
                    aria-label={"Photo " + (idx + 1)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pr-footer">
          {count > 1 ? (
            <span className="pr-hint">{(i + 1) + " / " + count} · swipe or tap ‹ › to browse</span>
          ) : (
            <span className="pr-hint">A little moment, just for you 💛</span>
          )}
          <button className="pr-continue" onClick={onClose}>Done 💛</button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── FLOATING LOVE QUOTES ───────────────────────────── */
function LoveQuotes() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % LOVE_QUOTES.length);
        setFade(true);
      }, 600);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={"love-quote" + (fade ? " lq-visible" : "")}>
      <span className="lq-mark">"</span>
      {LOVE_QUOTES[idx]}
      <span className="lq-mark">"</span>
    </div>
  );
}

/* ───────────────────────────── BIRTHDAY COUNTDOWN ─────────────────────────
   Countdown starts 10 minutes before midnight IST on June 22 (= 18:30 UTC June 21).
   At midnight IST → explodes into "Happy Birthday" celebration + plays birthday music.
   Stays in birthday phase for 10 minutes after midnight so she can see it.          */
function useBirthdayCountdown() {
  const [phase, setPhase] = useState("idle"); // "idle" | "counting" | "birthday"
  const [secsLeft, setSecsLeft] = useState(0);

  useEffect(() => {
    function tick() {
      const now = new Date();
      const target = BIRTHDAY_MIDNIGHT_UTC;
      const diff = (target - now) / 1000;

      if (diff <= 0 && diff > -600) {
        setPhase("birthday");
        setSecsLeft(0);
      } else if (diff > 0 && diff <= 600) {
        setPhase("counting");
        setSecsLeft(Math.ceil(diff));
      } else {
        setPhase("idle");
        setSecsLeft(Math.max(0, Math.ceil(diff)));
      }
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return { phase, secsLeft };
}

function BirthdayCountdown({ phase, secsLeft, onDismiss }) {
  const audioRef = useRef(null);
  const playedRef = useRef(false);

  useEffect(() => {
    if (phase === "birthday" && BIRTHDAY_SONG_URL && audioRef.current && !playedRef.current) {
      playedRef.current = true;
      audioRef.current.volume = 0.7;
      audioRef.current.play().catch(() => {});
    }
  }, [phase]);

  if (phase === "idle") return null;

  const mins = Math.floor(secsLeft / 60);
  const secs = secsLeft % 60;
  const pad = (n) => String(n).padStart(2, "0");

  if (phase === "birthday") {
    return (
      <div className="cd-overlay cd-birthday">
        <audio ref={audioRef} src={BIRTHDAY_SONG_URL || undefined} preload="auto" />
        <div className="cd-stars" />
        <div className="cd-burst-layer">
          {Array.from({ length: 40 }).map((_, i) => {
            const emojis = ["🎂", "🎁", "🎀", "🌹", "💛", "✨", "🎉", "💗", "🌸", "🥂"];
            return (
              <span
                key={i}
                className="cd-confetti"
                style={{
                  left: Math.random() * 100 + "%",
                  animationDelay: Math.random() * 2 + "s",
                  animationDuration: 2 + Math.random() * 2 + "s",
                  fontSize: 16 + Math.random() * 20 + "px",
                }}
              >
                {emojis[i % emojis.length]}
              </span>
            );
          })}
        </div>
        <div className="cd-inner cd-inner-bday">
          <div className="cd-bday-kicker">It's here</div>
          <h1 className="cd-bday-title">Happy Birthday</h1>
          <h2 className="cd-bday-name">Nidhi</h2>
          <div className="cd-bday-heart">{"💛"}</div>
          <p className="cd-bday-msg">
            Another year of loving you begins right now.
            <br />
            You make every single day feel like magic.
          </p>
          <div className="cd-bday-cake">{"🎂"}</div>
          <button className="cd-bday-continue" onClick={onDismiss}>
            Open your surprise →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cd-overlay cd-counting">
      <div className="cd-stars" />
      <div className="cd-candle-glow" />
      <div className="cd-inner">
        <div className="cd-kicker">Something magical is about to happen</div>
        <div className="cd-timer">
          <div className="cd-digit-group">
            <span className="cd-digit" key={"m" + mins}>{pad(mins)}</span>
            <span className="cd-unit">min</span>
          </div>
          <span className="cd-colon">:</span>
          <div className="cd-digit-group">
            <span className="cd-digit" key={"s" + secs}>{pad(secs)}</span>
            <span className="cd-unit">sec</span>
          </div>
        </div>
        <div className="cd-until">until your birthday</div>
        <div className="cd-hearts-row">
          {["💛", "🌹", "💛", "🌹", "💛"].map((h, i) => (
            <span key={i} className="cd-float-heart" style={{ animationDelay: i * 0.4 + "s" }}>
              {h}
            </span>
          ))}
        </div>
        <p className="cd-whisper">
          Close your eyes for a moment… and when you open them,
          <br />
          everything changes.
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────────── FIREWORKS (canvas) ───────────────────────────── */
function Fireworks({ active, duration = 6000 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    const rockets = [];
    const colors = [
      "#fbe6b4", "#e8c46a", "#f7c3cd", "#d98695",
      "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
      "#ff8fab", "#ffc971", "#a0e7e5", "#e2b0ff",
    ];
    const start = Date.now();

    function spawnRocket() {
      rockets.push({
        x: w * (0.15 + Math.random() * 0.7),
        y: h,
        vx: (Math.random() - 0.5) * 2,
        vy: -(7 + Math.random() * 5),
        targetY: h * (0.12 + Math.random() * 0.35),
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
      });
    }

    function explode(x, y, color) {
      const count = 60 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.012 + Math.random() * 0.016,
          color,
          size: 1.5 + Math.random() * 2,
          sparkle: Math.random() > 0.7,
        });
      }
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.008 + Math.random() * 0.01,
          color: "#fff",
          size: 1 + Math.random() * 1.5,
          sparkle: true,
        });
      }
    }

    let nextRocket = 0;
    function loop() {
      const elapsed = Date.now() - start;
      if (elapsed > duration + 2000) {
        ctx.clearRect(0, 0, w, h);
        return;
      }
      animRef.current = requestAnimationFrame(loop);

      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, w, h);

      if (elapsed < duration && elapsed > nextRocket) {
        spawnRocket();
        nextRocket = elapsed + 200 + Math.random() * 400;
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 8) r.trail.shift();
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.06;

        for (let t = 0; t < r.trail.length; t++) {
          const alpha = t / r.trail.length * 0.5;
          ctx.beginPath();
          ctx.arc(r.trail[t].x, r.trail[t].y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = r.color.replace(")", "," + alpha + ")").replace("rgb", "rgba").replace("#", "");
          ctx.fillStyle = `rgba(255,245,210,${alpha})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();

        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.985;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        const sz = p.sparkle ? p.size * (0.5 + Math.random()) : p.size;
        ctx.arc(p.x, p.y, sz * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [active, duration]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fireworks-canvas"
    />
  );
}

/* ───────────────────────────── CALLIGRAPHY LOADING SCREEN ───────────────────────────── */
function CalligraphyLoader({ onComplete }) {
  const [phase, setPhase] = useState("drawing"); // "drawing" | "glowing" | "done"

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("glowing"), 2800);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className={"calli-loader" + (phase === "done" ? " calli-fadeout" : "")}>
      <div className="calli-stars" />
      <div className="calli-inner">
        <div className="calli-kicker">for the one who makes everything beautiful</div>
        <div className={"calli-name-wrap" + (phase === "glowing" ? " calli-glow-on" : "")}>
          <span className="calli-name">Nidhi</span>
          <span className="calli-mask" />
        </div>
        <div className="calli-swirl-wrap">
          <svg viewBox="0 0 200 30" className="calli-swirl-svg">
            <path
              d="M10,15 Q30,2 50,15 T90,15 T130,15 Q150,8 160,15 Q170,22 180,15 L190,15"
              fill="none" stroke="url(#calliSwirl)" strokeWidth="1.8" strokeLinecap="round"
              className="calli-swirl-path"
            />
            <defs>
              <linearGradient id="calliSwirl" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
                <stop offset="20%" stopColor="#e8c46a" />
                <stop offset="80%" stopColor="#e8c46a" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className={"calli-sub" + (phase === "glowing" ? " calli-sub-show" : "")}>
          <span className="calli-heart">{"💛"}</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── BIRTHDAY LETTER (between intro & main app) ───────────────────────────── */
function BirthdayLetter({ onContinue }) {
  const [scrolled, setScrolled] = useState(false);
  const [revealed, setRevealed] = useState(new Set([0]));
  const contentRef = useRef(null);
  const paraRefs = useRef([]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) setScrolled(true);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            setRevealed((s) => new Set(s).add(idx));
          }
        });
      },
      { threshold: 0.3, root: contentRef.current }
    );
    paraRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const paragraphs = [
    "Before I show you everything I've made, I need you to know something.",
    "From the moment we met on 7th March 2022, my world changed colour. Every day since then has been a little more beautiful, a little more full, a little more ours. And now, on your birthday, I want to pause everything — just for a moment — and tell you what you mean to me.",
    "You are the reason I believe in forever. Not the forever in stories, but the real kind — the one made of small moments: your laugh over morning chai, your hand reaching for mine in a crowd, the way you look at a sunset like it's performing just for you.",
    "I've built you a little world tonight — your whole story, Nidhi. Every card ahead is a piece of you: from the tiny girl in those first photos, through every birthday and every year that shaped you, all the way to the life we're building now. And at the end of it all, there's something waiting just for you.",
    "So take your time. Explore. Remember. Smile.",
    "This is my love letter to you, Nidhi — not in words alone, but in every place we've ever been, every plate we've shared, every moment that made us _us_.",
  ];

  return (
    <div className="bday-letter">
      <div className="bday-letter-stars" />
      <div className="bday-letter-content" ref={contentRef}>
        <div className="bday-letter-inner">
          <div className="bday-letter-seal">{"💌"}</div>
          <div className="bday-letter-date">22nd June, 2026</div>
          <h2 className="bday-letter-greeting">My dearest Nidhi,</h2>
          <div className="bday-letter-body">
            {paragraphs.map((text, idx) => (
              <p
                key={idx}
                ref={(el) => (paraRefs.current[idx] = el)}
                data-idx={idx}
                className={"letter-para" + (revealed.has(idx) ? " letter-para-visible" : "")}
              >
                {text.includes("_us_") ? (
                  <>{text.replace("_us_", "")}<em>us</em>.</>
                ) : text}
              </p>
            ))}
            <p
              ref={(el) => (paraRefs.current[paragraphs.length] = el)}
              data-idx={paragraphs.length}
              className={"bday-letter-closing letter-para" + (revealed.has(paragraphs.length) ? " letter-para-visible" : "")}
            >
              Happy birthday, my love.
              <br />
              — Always yours, Sagar
            </p>
          </div>
          <div className="bday-letter-hearts">
            {"💛 🌹 💛"}
          </div>
          <button
            className={"bday-letter-btn" + (scrolled ? " bday-letter-btn-show" : "")}
            onClick={onContinue}
          >
            Take me to her story {"→"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── INTRO SCREEN ───────────────────────────── */
function Intro({ onBegin }) {
  return (
    <div className="intro">
      <div className="intro-stars" />

      {/* portrait background — fills the screen with a cinematic blur */}
      <div className="intro-bg">
        <img src="/media/nidhi-portrait.png" alt="" className="intro-bg-img" />
      </div>

      <div className="intro-inner">
        {/* portrait in a golden frame */}
        <div className="intro-portrait">
          <div className="intro-portrait-ring" />
          <div className="intro-portrait-ring intro-portrait-ring2" />
          <img src="/media/nidhi-portrait.png" alt="Nidhi" className="intro-portrait-img" />
          <div className="intro-portrait-shine" />
        </div>

        <div className="intro-kicker">Happy Birthday, my love</div>
        <h1 className="intro-name">Nidhi</h1>
        <div className="intro-rule">
          <span>{"❀"}</span>
        </div>
        <p className="intro-line">
          Before you open anything else, let me take you all the way back to the
          beginning — to the little girl in these photos, through every birthday
          and every year that made you, all the way to the day our roads crossed
          and forever began.
        </p>
        <button className="begin" onClick={onBegin}>
          Begin her story
        </button>
        <div className="intro-sub">Nidhi Arjariya Chhabra</div>
      </div>
    </div>
  );
}

/* ───────────────────────────── LOGIN GATE ─────────────────────────────
   A private little doorway — only she has the key.
   >>> The one username & password live here. Change them if you like. */
const AUTH_USER = "Nidhi";
const AUTH_PASS = "birthdaygirl";

function LoginGate({ onUnlock }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [opening, setOpening] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (opening) return;
    const ok =
      user.trim().toLowerCase() === AUTH_USER.toLowerCase() &&
      pass === AUTH_PASS;
    if (ok) {
      setError(false);
      setOpening(true);
      setTimeout(onUnlock, 900);
    } else {
      setError(true);
    }
  }

  return (
    <div className={"login" + (opening ? " login-opening" : "")}>
      <div className="login-stars" />
      <div className="intro-bg">
        <img src="/media/nidhi-portrait.png" alt="" className="intro-bg-img" />
      </div>

      <form className={"login-card" + (error ? " login-shake" : "")} onSubmit={submit}>
        <div className="login-lock">{opening ? "🔓" : "🔒"}</div>
        <div className="login-kicker">A private little world</div>
        <h1 className="login-title">For Nidhi's eyes only</h1>
        <div className="intro-rule"><span>{"❀"}</span></div>
        <p className="login-line">
          This birthday surprise is locked away just for you, my love.
          Sign in to step inside. 💛
        </p>

        <label className="login-field">
          <span className="login-label">Username</span>
          <input
            className="login-input"
            type="text"
            value={user}
            autoComplete="username"
            placeholder="Your name"
            onChange={(e) => { setUser(e.target.value); setError(false); }}
          />
        </label>

        <label className="login-field">
          <span className="login-label">Password</span>
          <div className="login-pass-wrap">
            <input
              className="login-input"
              type={show ? "text" : "password"}
              value={pass}
              autoComplete="current-password"
              placeholder="Your secret word"
              onChange={(e) => { setPass(e.target.value); setError(false); }}
            />
            <button
              type="button"
              className="login-eye"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? "🙈" : "👁️"}
            </button>
          </div>
        </label>

        {error && (
          <div className="login-error">That's not quite it — try again, birthday girl. 💔</div>
        )}

        <button className="login-btn" type="submit" disabled={opening}>
          {opening ? "Opening…" : "Unlock my surprise"}
        </button>
        <div className="login-hint">Hint: this is your day, birthday girl. 🎂</div>
      </form>
    </div>
  );
}

/* ───────────────────────────── ROOT APP ───────────────────────────── */
export default function App() {
  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem("osm-authed") === "yes"; } catch { return false; }
  });
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [view, setView] = useState("story"); // 'story' | 'foryou' | 'feast'
  const [openId, setOpenId] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [answered, setAnswered] = useState(() => {
    try { return JSON.parse(localStorage.getItem("osm-answered")) || {}; } catch { return {}; }
  });
  const [wrongPicks, setWrongPicks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("osm-wrongPicks")) || {}; } catch { return {}; }
  });
  const [burst, setBurst] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [toast, setToast] = useState("");
  const [celebrate, setCelebrate] = useState(0);
  const [countdownDismissed, setCountdownDismissed] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [shakeConfetti, setShakeConfetti] = useState(0);

  const audioRef = useRef(null);
  const unlockFired = useRef(false);
  const onCalliDone = useCallback(() => setLoading(false), []);

  const { phase: bdayPhase, secsLeft: bdaySecsLeft } = useBirthdayCountdown();

  const hearts = Object.values(answered).filter((v) => v === "correct").length;
  const unlocked = hearts >= QUIZ_TOTAL;
  const totalPhotos = MEMORIES.reduce((n, m) => n + (m.photos ? m.photos.length : 0), 0);
  const openMem = openId ? MEMORIES.find((m) => m.id === openId) : null;
  const daysSinceMet = Math.floor((Date.now() - FIRST_MET_DATE.getTime()) / 86400000);

  // persist answered & wrongPicks to localStorage
  useEffect(() => { localStorage.setItem("osm-answered", JSON.stringify(answered)); }, [answered]);
  useEffect(() => { localStorage.setItem("osm-wrongPicks", JSON.stringify(wrongPicks)); }, [wrongPicks]);

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
      const t = setTimeout(() => setCelebrate(0), 8000);
      return () => clearTimeout(t);
    }
  }, [unlocked]);

  function begin() {
    setShowLetter(true);
  }

  function enterApp() {
    setShowLetter(false);
    setStarted(true);
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
      playChime();
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

  function handleNextChapter() {
    const currentIdx = MEMORIES.findIndex((m) => m.id === openId);
    if (currentIdx < 0 || currentIdx >= MEMORIES.length - 1) return;
    const next = MEMORIES[currentIdx + 1];
    if (next.isFinale && !unlocked) {
      setToast("Almost there — answer every quiz to unlock the finale. (" + hearts + "/" + QUIZ_TOTAL + ")");
      return;
    }
    setOpenId(next.id);
  }

  useShake(() => {
    setShakeConfetti((c) => c + 1);
    playSparkle();
    setTimeout(() => setShakeConfetti(0), 4000);
  });

  function login() {
    try { localStorage.setItem("osm-authed", "yes"); } catch { /* ignore */ }
    setAuthed(true);
  }

  if (!authed) {
    return (
      <div className="osm-root">
        <style>{STYLES}</style>
        <LoginGate onUnlock={login} />
      </div>
    );
  }

  return (
    <div className="osm-root">
      <style>{STYLES}</style>

      {/* 🎵 ambient music — set SONG_URL at the top of the file */}
      <audio ref={audioRef} src={SONG_URL || undefined} loop preload="none" />

      {/* ✍️ calligraphy loading screen */}
      {loading && <CalligraphyLoader onComplete={onCalliDone} />}

      {/* 🎂 birthday countdown — auto-appears 5 min before midnight */}
      {!loading && !countdownDismissed && (bdayPhase === "counting" || bdayPhase === "birthday") && (
        <BirthdayCountdown
          phase={bdayPhase}
          secsLeft={bdaySecsLeft}
          onDismiss={() => setCountdownDismissed(true)}
        />
      )}

      {!loading && showLetter && <BirthdayLetter onContinue={enterApp} />}

      {!loading && !started && !showLetter ? (
        <Intro onBegin={begin} />
      ) : started ? (
        <>
          <GoldenSparkles />
          <header className="header">
            <div className="brand">
              <span className="brand-mark">{"❀"}</span>
              <span className="brand-text">Happy birthday Kukku</span>
            </div>
            <button
              className="slideshow-btn"
              onClick={() => setShowSlideshow(true)}
              aria-label="Photo slideshow"
              title="Watch our photo montage"
            >
              {"▶"}
            </button>
            <button
              className={"music" + (musicOn ? " music-on" : "")}
              onClick={toggleMusic}
              aria-label="Toggle music"
              title={SONG_URL ? "Toggle music" : "Add a song URL in the code"}
            >
              {musicOn ? "♫" : "♪"}
            </button>
          </header>

          <LoveQuotes />

          <div className="viewbar">
            <div className="toggle">
              <button
                className={"tg" + (view === "story" ? " tg-on" : "")}
                onClick={() => setView("story")}
              >
                Her Story
              </button>
              <button
                className={"tg" + (view === "foryou" ? " tg-on" : "")}
                onClick={() => setView("foryou")}
              >
                For You
              </button>
              <button
                className={"tg" + (view === "feast" ? " tg-on" : "")}
                onClick={() => setView("feast")}
              >
                Our Feast
              </button>
            </div>
          </div>

          <div className="stats">
            <div className="stat stat-bday">
              <span className="stat-num">{"🎂"}</span>
              <span className="stat-label">Happy Birthday</span>
            </div>
            <div className="stat stat-love">
              <span className="stat-num">{daysSinceMet}</span>
              <span className="stat-label">Days Together</span>
            </div>
            <div className="stat">
              <span className="stat-num">{totalPhotos}</span>
              <span className="stat-label">Memories</span>
            </div>
            <div className="stat stat-infinite">
              <span className="stat-num">{"∞"}</span>
              <span className="stat-label">Reasons I Love You</span>
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
            {view === "story" ? (
              <OccasionCards answered={answered} unlocked={unlocked} onOpen={openPin} />
            ) : view === "foryou" ? (
              <ReasonsILoveYou />
            ) : (
              <Feast onLightbox={setLightbox} />
            )}
          </main>

          {openMem && (
            <MemoryModal
              key={openMem.id}
              mem={openMem}
              answered={answered}
              wrongPicks={wrongPicks}
              burst={burst}
              unlocked={unlocked}
              onClose={() => setOpenId(null)}
              onAnswer={answerQuiz}
              onNext={openMem.isFinale ? undefined : handleNextChapter}
            />
          )}

          {lightbox && <Lightbox item={lightbox} onClose={() => setLightbox(null)} />}

          {showSlideshow && <AutoSlideshow onClose={() => setShowSlideshow(false)} />}

          {shakeConfetti > 0 && (
            <div className="shake-confetti-layer">
              <HeartBurst trigger={shakeConfetti} full />
            </div>
          )}

          {celebrate > 0 && (
            <div className="celebrate">
              <Fireworks active={celebrate > 0} duration={7000} />
              <HeartBurst trigger={celebrate} full />
              <div className="celebrate-msg">
                You know us by heart {"💛"}
                <span>Tap the golden card to open our final memory.</span>
              </div>
            </div>
          )}

          {toast && <div className="toast">{toast}</div>}
        </>
      ) : null}
    </div>
  );
}

/* ───────────────────────────── STYLES ───────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Great+Vibes&family=Marcellus&display=swap');

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
/* ——— LOGIN GATE ——— */
.login {
  position: absolute; inset: 0; z-index: 60;
  display: flex; align-items: center; justify-content: center;
  text-align: center; padding: 24px;
  animation: fadeIn 1s ease both;
  transition: opacity .8s ease, transform .8s ease;
}
.login-opening { opacity: 0; transform: scale(1.04); pointer-events: none; }
.login-stars { position: absolute; inset: 0; z-index: 0; }
.login-card {
  position: relative; z-index: 2; width: 100%; max-width: 392px;
  padding: 34px 30px 28px; border-radius: 24px;
  background: linear-gradient(165deg, rgba(24,28,58,.92), rgba(14,17,42,.95));
  border: 1px solid rgba(212,175,55,.4);
  box-shadow: 0 24px 70px rgba(0,0,0,.55), 0 0 50px rgba(212,175,55,.12),
    inset 0 1px 0 rgba(255,255,255,.06);
  backdrop-filter: blur(8px);
  animation: portraitIn 1.1s cubic-bezier(.2,1,.3,1) both;
}
.login-shake { animation: loginShake .45s ease both; }
@keyframes loginShake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-9px); } 40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); } 80% { transform: translateX(4px); }
}
.login-lock {
  font-size: 38px; line-height: 1; margin-bottom: 12px;
  filter: drop-shadow(0 0 14px rgba(212,175,55,.5));
  animation: portraitFloat 5s ease-in-out 1s infinite;
}
.login-kicker {
  font-family: 'Marcellus', serif; letter-spacing: .36em; text-transform: uppercase;
  font-size: 11px; color: #e7b9c4;
}
.login-title {
  font-family: 'Cormorant Garamond', serif; font-weight: 600; font-style: italic;
  font-size: clamp(28px, 8vw, 38px); line-height: 1.05; margin: 8px 0 4px;
  background: linear-gradient(180deg, #fbe6b4 0%, #e8c46a 50%, #c79a36 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 0 40px rgba(212,175,55,.3);
}
.login-line {
  font-size: 15px; line-height: 1.55; color: #efe4cb; font-style: italic;
  margin: 4px auto 22px; max-width: 320px;
}
.login-field { display: block; text-align: left; margin: 0 0 14px; }
.login-label {
  display: block; font-family: 'Marcellus', serif; font-size: 11px;
  letter-spacing: .16em; text-transform: uppercase; color: #d4af37; margin-bottom: 6px;
}
.login-input {
  width: 100%; box-sizing: border-box; padding: 13px 15px; border-radius: 12px;
  font-family: inherit; font-size: 15px; color: #f4ecd6;
  background: rgba(255,255,255,.05); border: 1px solid rgba(212,175,55,.3);
  outline: none; transition: border-color .2s ease, box-shadow .2s ease;
}
.login-input::placeholder { color: rgba(244,236,214,.4); }
.login-input:focus {
  border-color: rgba(232,196,106,.8);
  box-shadow: 0 0 0 3px rgba(212,175,55,.16);
}
.login-pass-wrap { position: relative; }
.login-pass-wrap .login-input { padding-right: 48px; }
.login-eye {
  position: absolute; top: 50%; right: 8px; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; font-size: 18px;
  padding: 6px; line-height: 1; opacity: .85;
}
.login-error {
  color: #ff9bb0; font-size: 13px; margin: 2px 0 14px;
  animation: fadeIn .3s ease both;
}
.login-btn {
  width: 100%; margin-top: 6px;
  font-family: 'Marcellus', serif; font-size: 15px; letter-spacing: .1em;
  color: #1a1206; cursor: pointer; border: none; border-radius: 999px; padding: 14px 28px;
  background: linear-gradient(180deg, #fbe6b4, #e0b955 60%, #caa13c);
  box-shadow: 0 10px 30px rgba(212,175,55,.38), inset 0 1px 0 rgba(255,255,255,.6);
  transition: transform .2s ease, filter .2s ease;
}
.login-btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
.login-btn:disabled { opacity: .8; cursor: default; transform: none; }
.login-hint {
  margin-top: 14px; font-size: 12px; color: rgba(231,185,196,.65); font-style: italic;
}

.intro {
  position: absolute; inset: 0; z-index: 30;
  display: flex; align-items: center; justify-content: center;
  text-align: center; padding: 28px;
  animation: fadeIn 1.4s ease both;
}
.intro-inner { position: relative; z-index: 2; max-width: 540px; }

/* ——— CINEMATIC BACKGROUND PORTRAIT ——— */
.intro-bg {
  position: absolute; inset: 0; z-index: 0; overflow: hidden;
}
.intro-bg-img {
  width: 100%; height: 100%; object-fit: cover; object-position: center 20%;
  filter: blur(28px) brightness(.35) saturate(.6);
  transform: scale(1.15);
  opacity: .55;
}

/* ——— PORTRAIT FRAME ——— */
.intro-portrait {
  position: relative; width: 172px; height: 172px; margin: 0 auto 18px;
  border-radius: 50%; opacity: 0;
  animation: portraitIn 1.3s cubic-bezier(.2,1,.3,1) .15s both;
}
@keyframes portraitIn {
  from { opacity: 0; transform: scale(.75) translateY(16px); }
  to { opacity: 1; transform: none; }
}
.intro-portrait-ring {
  position: absolute; inset: -5px; border-radius: 50%;
  border: 2.5px solid rgba(212,175,55,.6);
  animation: ringGlow 3.5s ease-in-out infinite;
}
.intro-portrait-ring2 {
  inset: -12px;
  border: 1.5px solid rgba(212,175,55,.25);
  animation-delay: 1.2s;
}
@keyframes ringGlow {
  0%,100% { box-shadow: 0 0 12px 2px rgba(212,175,55,.2); border-color: rgba(212,175,55,.5); }
  50% { box-shadow: 0 0 28px 6px rgba(212,175,55,.45); border-color: rgba(212,175,55,.8); }
}
.intro-portrait-img {
  width: 100%; height: 100%; border-radius: 50%; object-fit: cover; object-position: center 15%;
  border: 3px solid rgba(240,217,138,.5);
  box-shadow:
    0 0 30px 8px rgba(212,175,55,.25),
    0 16px 40px rgba(0,0,0,.45);
  animation: portraitFloat 6s ease-in-out 1.5s infinite;
}
@keyframes portraitFloat {
  0%,100% { transform: translateY(0); box-shadow: 0 0 30px 8px rgba(212,175,55,.25), 0 16px 40px rgba(0,0,0,.45); }
  50% { transform: translateY(-7px); box-shadow: 0 0 40px 12px rgba(212,175,55,.35), 0 24px 50px rgba(0,0,0,.35); }
}
.intro-portrait-shine {
  position: absolute; inset: 0; border-radius: 50%; pointer-events: none;
  background: linear-gradient(135deg, rgba(255,255,255,.18) 0%, transparent 50%, transparent 100%);
  animation: portraitIn 1.3s cubic-bezier(.2,1,.3,1) .15s both;
}

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
  animation: slideDown .6s cubic-bezier(.2,1,.3,1) both;
}
@keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: none; } }
.brand { display: flex; align-items: center; gap: 9px; }
.brand-mark { color: #e8c46a; font-size: 17px; animation: gentleSpin 6s linear infinite; }
@keyframes gentleSpin { 0%,100% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.15); } }
.brand-text {
  font-family: 'Marcellus', serif; font-size: 17px; letter-spacing: .12em;
  background: linear-gradient(90deg, #f3ead3, #e8c46a, #f3ead3);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: shimmerText 4s ease-in-out infinite;
}
@keyframes shimmerText { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
.music {
  width: 38px; height: 38px; border-radius: 50%; cursor: pointer;
  border: 1px solid rgba(212,175,55,.35); background: rgba(255,255,255,.03);
  color: #e8c46a; font-size: 17px; line-height: 1;
  display: flex; align-items: center; justify-content: center; transition: all .2s ease;
  animation: slideDown .6s cubic-bezier(.2,1,.3,1) .1s both;
}
.music:hover { transform: scale(1.1); border-color: rgba(212,175,55,.6); }
.music-on { background: linear-gradient(180deg, #e8c46a, #caa13c); color: #1a1206;
  box-shadow: 0 0 16px rgba(212,175,55,.5); animation: glowPulse 2.4s ease-in-out infinite, musicBounce .8s ease; }
@keyframes musicBounce { 0% { transform: scale(1); } 30% { transform: scale(1.2); } 60% { transform: scale(.95); } 100% { transform: scale(1); } }

/* ——— VIEW BAR (Her Story / For You / Our Feast) ——— */
.viewbar {
  position: relative; z-index: 5; display: flex; justify-content: center;
  padding: 10px 12px 2px; background: rgba(8,12,30,.45);
  animation: fadeUp .5s ease .15s both;
}
.toggle {
  display: flex; border: 1px solid rgba(212,175,55,.35); border-radius: 999px;
  overflow: hidden; background: rgba(255,255,255,.03);
}
.tg {
  font-family: 'Marcellus', serif; font-size: 13px; letter-spacing: .08em;
  padding: 8px 20px; border: none; background: transparent; color: #cdbf9a;
  cursor: pointer; transition: all .2s ease;
}
.tg + .tg { border-left: 1px solid rgba(212,175,55,.2); }
.tg-on { background: linear-gradient(180deg, #e8c46a, #caa13c); color: #1a1206; }

/* ——— STATS ——— */
.stats {
  position: relative; z-index: 5;
  display: flex; gap: 8px; padding: 10px 14px 12px;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  border-bottom: 1px solid rgba(212,175,55,.12);
  background: rgba(8,12,30,.45);
  animation: fadeUp .5s ease .25s both;
}
.stat {
  flex: 1 0 auto; min-width: 72px; text-align: center;
  padding: 8px 6px; border-radius: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
  border: 1px solid rgba(212,175,55,.14);
  animation: statPop .5s cubic-bezier(.2,1.2,.4,1) both;
  transition: transform .2s ease, box-shadow .2s ease;
}
.stat:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(212,175,55,.2); }
.stat:nth-child(1) { animation-delay: .3s; }
.stat:nth-child(2) { animation-delay: .4s; }
.stat:nth-child(3) { animation-delay: .5s; }
.stat:nth-child(4) { animation-delay: .6s; }
.stat:nth-child(5) { animation-delay: .7s; }
@keyframes statPop { from { opacity: 0; transform: scale(.85) translateY(10px); } to { opacity: 1; } }
.stat-num {
  display: block; font-family: 'Cormorant Garamond', serif; font-weight: 600;
  font-size: 26px; line-height: 1; color: #f0d98a;
  text-shadow: 0 0 8px rgba(240,217,138,.3);
}
.stat-num .of { font-size: 15px; opacity: .7; }
.stat-hearts .stat-num { color: #ef9fb0; }
.stat-label {
  display: block; margin-top: 4px; font-family: 'Marcellus', serif;
  font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: #9aa6cf;
}

/* ——— CONTENT / MAP ——— */
.content { position: relative; z-index: 4; flex: 1; min-height: 0; animation: contentReveal .7s ease .35s both; }
@keyframes contentReveal { from { opacity: 0; } to { opacity: 1; } }
/* ——— CLOTHESLINE CARDS ——— */
.cards-view {
  height: 100%; overflow-y: auto; -webkit-overflow-scrolling: touch;
  padding: 0 0 64px; position: relative;
}
.collage-strip {
  position: relative; width: 100%; height: 140px; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(180deg, rgba(212,175,55,.08), transparent);
  border-bottom: 1px solid rgba(212,175,55,.15);
}
.collage-title {
  position: absolute; z-index: 3; text-align: center;
  font-family: 'Cormorant Garamond', serif; font-weight: 600; font-style: italic;
  font-size: clamp(28px, 8vw, 40px);
  background: linear-gradient(180deg, #fbe6b4, #d8b052);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 0 40px rgba(212,175,55,.3);
  pointer-events: none;
}
.collage-img {
  position: absolute; inset: 0;
  opacity: 0;
  animation: kenBurns 12s ease-in-out infinite;
}
.collage-img img {
  width: 100%; height: 100%; object-fit: cover;
  filter: brightness(.45) saturate(.7);
}
.collage-img::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(10,14,34,.8) 0%, transparent 15%, transparent 85%, rgba(10,14,34,.8) 100%);
}
@keyframes kenBurns {
  0% { opacity: 0; transform: scale(1.05); }
  8% { opacity: 1; }
  28% { opacity: 1; transform: scale(1); }
  34% { opacity: 0; }
  100% { opacity: 0; }
}

.cards-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px;
  padding: 24px 16px; max-width: 900px; margin: 0 auto;
}
@media (min-width: 560px) { .cards-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 860px) { .cards-grid { grid-template-columns: repeat(4, 1fr); } }

.occasion-card {
  position: relative; cursor: pointer; padding: 0;
  border: none; background: transparent; text-align: center;
  transform: rotate(var(--tilt, 0deg));
  animation: cardDangle 4s ease-in-out infinite, ocFadeIn .5s ease both;
  transition: transform .25s ease, box-shadow .25s ease;
}
.occasion-card:hover {
  transform: rotate(0deg) translateY(-6px) scale(1.04);
  z-index: 2;
}
@keyframes cardDangle {
  0%,100% { transform: rotate(var(--tilt, 0deg)); }
  50% { transform: rotate(calc(var(--tilt, 0deg) + 0.5deg)); }
}
@keyframes ocFadeIn {
  from { opacity: 0; transform: rotate(var(--tilt, 0deg)) translateY(20px) scale(.9); }
  to { opacity: 1; }
}

.oc-clip {
  width: 20px; height: 20px; margin: 0 auto -8px;
  background: linear-gradient(180deg, #f0d98a, #caa13c);
  border-radius: 50%; border: 2px solid #fff3cf;
  box-shadow: 0 0 8px rgba(212,175,55,.5);
  position: relative; z-index: 2;
}
.oc-body {
  border-radius: 10px; overflow: hidden;
  background: linear-gradient(170deg, #1a1f3e, #131738);
  border: 1px solid rgba(212,175,55,.25);
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  transition: border-color .25s ease, box-shadow .25s ease;
}
.occasion-card:hover .oc-body {
  border-color: rgba(212,175,55,.55);
  box-shadow: 0 14px 36px rgba(0,0,0,.5), 0 0 20px rgba(212,175,55,.15);
}
.oc-cover {
  height: 110px; display: flex; align-items: center; justify-content: center;
  background:
    radial-gradient(circle at 50% 40%, rgba(212,175,55,.12), transparent 60%),
    linear-gradient(160deg, #14193a, #0f1330);
  overflow: hidden;
}
.oc-cover-img { width: 100%; height: 100%; object-fit: cover; }
.oc-icon { font-size: 36px; }
.oc-info { padding: 10px 8px 12px; }
.oc-name {
  display: block; font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-weight: 600; font-size: 16px; color: #f0d98a; line-height: 1.2;
}
.oc-when {
  display: block; margin-top: 3px;
  font-family: 'Marcellus', serif; font-size: 9.5px; letter-spacing: .14em;
  text-transform: uppercase; color: #9aa6cf;
}
.oc-status {
  position: absolute; top: 26px; right: 6px; font-size: 14px;
  background: rgba(8,12,30,.7); border-radius: 50%; width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(212,175,55,.3);
}
.oc-done .oc-body { border-color: rgba(217,134,149,.4); }
.oc-done .oc-status { color: #f7c3cd; border-color: rgba(217,134,149,.4); }
.oc-finale.oc-locked { opacity: .6; filter: grayscale(.3); }
.oc-finale.oc-unlocked .oc-body {
  border-color: rgba(240,217,138,.6);
  box-shadow: 0 0 22px rgba(240,217,138,.3), 0 8px 24px rgba(0,0,0,.4);
}
.oc-finale.oc-unlocked .oc-clip {
  animation: glowPulse 1.5s ease-in-out infinite;
}

/* ——— SECRET SPARKLES ——— */
.secret-sparkle {
  position: fixed; z-index: 6; cursor: pointer;
  width: 22px; height: 22px; border: none; border-radius: 50%;
  background: radial-gradient(circle, rgba(240,217,138,.7), rgba(212,175,55,.2), transparent);
  color: #f0d98a; font-size: 10px; display: flex; align-items: center; justify-content: center;
  animation: sparkleFloat 5s ease-in-out infinite;
  transition: transform .2s ease, opacity .3s ease;
}
.secret-sparkle:hover { transform: scale(1.5); }
.ss-found { opacity: .2; pointer-events: none; }
.secret-bubble {
  position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); z-index: 65;
  max-width: 88%; text-align: center; padding: 14px 22px; border-radius: 16px;
  font-size: 16px; font-style: italic; color: #f6ecd2;
  background: rgba(12,18,42,.95); border: 1px solid rgba(212,175,55,.45);
  box-shadow: 0 12px 40px rgba(0,0,0,.5);
  animation: secretReveal .5s ease both;
}
@keyframes secretReveal {
  from { opacity: 0; transform: translateX(-50%) scale(.9) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
}
.secret-counter {
  position: fixed; top: 60px; right: 12px; z-index: 6;
  font-family: 'Marcellus', serif; font-size: 10px; letter-spacing: .1em;
  color: #f0d98a; background: rgba(8,12,30,.8); padding: 4px 10px; border-radius: 999px;
  border: 1px solid rgba(212,175,55,.25);
}

/* ——— FEAST VIEW ——— */
.feast {
  height: 100%; overflow-y: auto; -webkit-overflow-scrolling: touch;
  padding: 24px 16px 64px; max-width: 860px; margin: 0 auto;
}
.feast-head { text-align: center; margin-bottom: 26px; }
.feast-kicker {
  font-family: 'Marcellus', serif; font-size: 11px; letter-spacing: .3em;
  text-transform: uppercase; color: #e7b9c4;
}
.feast-head h2 {
  font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 600;
  font-size: clamp(36px, 10vw, 52px); margin: 6px 0 4px;
  background: linear-gradient(180deg, #fbe6b4, #d8b052);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.feast-head p { font-style: italic; font-size: 17px; color: #cdbf9a; margin: 0 auto; max-width: 440px; }
.feast-group { margin-bottom: 28px; }
.feast-group-head {
  display: flex; align-items: baseline; gap: 10px; margin-bottom: 12px;
  padding-bottom: 8px; border-bottom: 1px solid rgba(212,175,55,.18);
}
.fg-name { font-family: 'Cormorant Garamond', serif; font-weight: 600; font-size: 25px; color: #f3ead3; }
.fg-when {
  font-family: 'Marcellus', serif; font-size: 10px; letter-spacing: .14em;
  text-transform: uppercase; color: #9aa6cf; margin-left: auto;
}
.feast-empty { font-style: italic; color: #8c97bf; font-size: 15px; padding: 6px 2px; }
.feast-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.feast-card {
  position: relative; cursor: pointer; padding: 0; border-radius: 14px; overflow: hidden;
  border: 1px solid rgba(212,175,55,.22); background: #0c1230; text-align: left;
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
  animation: feastCardIn .5s cubic-bezier(.2,1,.3,1) both;
}
@keyframes feastCardIn { from { opacity: 0; transform: scale(.9) translateY(12px); } to { opacity: 1; } }
.feast-card:hover { transform: translateY(-4px) scale(1.02); border-color: rgba(212,175,55,.55);
  box-shadow: 0 12px 28px rgba(0,0,0,.4), 0 0 20px rgba(212,175,55,.15); }
.feast-card img { width: 100%; height: 132px; object-fit: cover; display: block; }
.feast-ph {
  display: flex; align-items: center; justify-content: center; height: 132px; font-size: 30px;
  background:
    radial-gradient(circle at 50% 40%, rgba(212,175,55,.16), transparent 60%),
    repeating-linear-gradient(45deg, rgba(255,255,255,.025) 0 12px, transparent 12px 24px),
    linear-gradient(160deg, #14193a, #0f1330);
}
.feast-cap { display: block; padding: 9px 11px; font-style: italic; font-size: 14.5px; color: #e9dcbd; line-height: 1.35; }
@media (min-width: 560px) { .feast-row { grid-template-columns: repeat(3, 1fr); } }

/* ——— LIGHTBOX ——— */
.lightbox {
  position: fixed; inset: 0; z-index: 70; display: flex; align-items: center; justify-content: center;
  padding: 18px; background: rgba(4,6,16,.93); backdrop-filter: blur(6px);
  animation: fadeIn .25s ease both;
}
.lb-inner { position: relative; max-width: 640px; width: 100%; }
.lb-inner img {
  width: 100%; max-height: 72vh; object-fit: contain; border-radius: 16px;
  border: 1px solid rgba(212,175,55,.35); box-shadow: 0 20px 60px rgba(0,0,0,.6);
}
.lb-ph {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; height: 50vh; font-size: 44px; color: #b9a05a; border-radius: 16px;
  border: 1px dashed rgba(212,175,55,.4); background: linear-gradient(160deg, #14193a, #0f1330);
}
.lb-ph span { font-size: 13px; font-family: 'Marcellus', serif; letter-spacing: .1em; }
.lb-cap { text-align: center; margin-top: 14px; }
.lb-cap strong {
  display: block; font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-weight: 600; font-size: 23px; color: #f3ead3;
}
.lb-cap span {
  font-family: 'Marcellus', serif; font-size: 11px; letter-spacing: .18em;
  text-transform: uppercase; color: #e7b9c4;
}

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
  animation: cardIn .5s cubic-bezier(.2,1,.3,1) both;
}
@keyframes cardIn { from { opacity: 0; transform: translateY(30px) scale(.94); } to { opacity: 1; transform: none; } }
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
  background: linear-gradient(90deg, #d8b052, #fbe6b4, #fff5d4, #fbe6b4, #d8b052);
  background-size: 300% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: cardTitleShimmer 5s ease-in-out infinite;
}
@keyframes cardTitleShimmer { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

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
  animation: quizReveal .6s ease .2s both;
}
@keyframes quizReveal { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
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

/* ——— LOCKED MEDIA + VIDEO + TABS ——— */
.locked-media {
  margin-top: 18px; padding: 22px 16px; border-radius: 16px; text-align: center;
  font-style: italic; font-size: 17px; color: #e7d9b6;
  background:
    repeating-linear-gradient(45deg, rgba(255,255,255,.02) 0 14px, transparent 14px 28px),
    rgba(212,175,55,.05);
  border: 1px dashed rgba(212,175,55,.35);
}
.locked-media .lm-lock { display: block; font-size: 26px; margin-bottom: 6px; }
.media-zone { margin-top: 18px; }
.video-block { margin-bottom: 16px; }
.video-tag {
  font-family: 'Marcellus', serif; font-size: 10.5px; letter-spacing: .2em;
  text-transform: uppercase; color: #e7b9c4; text-align: center; margin-bottom: 8px;
}
.memory-video {
  width: 100%; border-radius: 16px; display: block; background: #000;
  border: 1px solid rgba(212,175,55,.4); box-shadow: 0 0 26px rgba(212,175,55,.28);
}
.skip-btn {
  display: block; margin: 12px auto 0; cursor: pointer;
  font-family: 'Marcellus', serif; font-size: 13px; letter-spacing: .08em;
  color: #1a1206; border: none; border-radius: 999px; padding: 9px 22px;
  background: linear-gradient(180deg, #f0d98a, #caa13c);
  box-shadow: 0 6px 18px rgba(212,175,55,.35);
}
.media-tabs { display: flex; gap: 8px; margin-bottom: 12px; justify-content: center; }
.mt {
  font-family: 'Marcellus', serif; font-size: 13px; letter-spacing: .06em;
  padding: 8px 18px; border-radius: 999px; cursor: pointer; color: #cdbf9a;
  background: rgba(255,255,255,.04); border: 1px solid rgba(212,175,55,.25);
  transition: all .2s ease;
}
.mt-on { background: linear-gradient(180deg, #e8c46a, #caa13c); color: #1a1206; border-color: transparent; }

/* ——— GALLERY ——— */
.gallery { margin-bottom: 4px; }
.photo-frame {
  position: relative; width: 100%; aspect-ratio: 4 / 3; border-radius: 16px;
  overflow: hidden; border: 1px solid rgba(212,175,55,.3); background: #0c1230;
}
.photo { width: 100%; height: 100%; object-fit: cover; display: block;
  animation: photoReveal .6s ease both; }
@keyframes photoReveal { from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: none; } }
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

/* ——— GOLDEN SPARKLES ——— */
.sparkles-layer {
  position: fixed; inset: 0; pointer-events: none; z-index: 3; overflow: hidden;
}
.sparkle {
  position: absolute; width: 1em; height: 1em; border-radius: 50%;
  background: radial-gradient(circle, rgba(240,217,138,.9), rgba(212,175,55,.4), transparent 70%);
  animation: sparkleFloat 5s ease-in-out infinite;
}
@keyframes sparkleFloat {
  0%,100% { opacity: 0; transform: translateY(0) scale(.5); }
  20% { opacity: .8; }
  50% { opacity: 1; transform: translateY(-40px) scale(1); }
  80% { opacity: .6; }
}

/* ——— TOGGLE BUTTON TRANSITIONS ——— */
.tg { position: relative; overflow: hidden; }
.tg::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.1), transparent);
  transform: translateX(-100%); transition: none;
}
.tg-on::after { animation: btnShine .6s ease both; }
@keyframes btnShine { from { transform: translateX(-100%); } to { transform: translateX(100%); } }

/* ——— OVERLAY BACKDROP ——— */
.overlay { animation: overlayIn .35s ease both; }
@keyframes overlayIn { from { opacity: 0; backdrop-filter: blur(0); } to { opacity: 1; backdrop-filter: blur(5px); } }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes glowPulse {
  0%,100% { box-shadow: 0 0 18px rgba(212,175,55,.45); }
  50% { box-shadow: 0 0 32px rgba(240,217,138,.85); }
}

/* ——— LOVE QUOTES ——— */
.love-quote {
  position: relative; z-index: 5; text-align: center;
  padding: 8px 18px; font-style: italic; font-size: 14.5px; color: #d8cba8;
  background: rgba(8,12,30,.45);
  transition: opacity .6s ease;
  opacity: 0;
  min-height: 36px; display: flex; align-items: center; justify-content: center;
}
.lq-visible { opacity: 1; }
.lq-mark { color: #d4af37; font-size: 18px; margin: 0 4px; opacity: .7; }

/* ——— DAYS OF LOVE STAT ——— */
.stat-love .stat-num {
  background: linear-gradient(180deg, #f7c3cd, #e89fb0);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: none;
}
.stat-love { border-color: rgba(217,134,149,.3); }

/* ——— TYPEWRITER CURSOR ——— */
.tw-cursor {
  color: #e8c46a; font-weight: 300; animation: twBlink .8s step-end infinite;
}
@keyframes twBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

/* ——— ENVELOPE ——— */
.envelope-sealed {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  width: 100%; padding: 28px 16px; margin: 8px 0 4px; cursor: pointer;
  border-radius: 16px; border: 1px solid rgba(212,175,55,.3);
  background:
    radial-gradient(ellipse at 50% 20%, rgba(212,175,55,.12), transparent 60%),
    linear-gradient(170deg, #1a1f3e 0%, #131738 100%);
  position: relative; overflow: hidden;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  animation: envelopePulse 3s ease-in-out infinite;
}
.envelope-sealed:hover {
  transform: translateY(-3px) scale(1.02);
  border-color: rgba(212,175,55,.6);
  box-shadow: 0 12px 36px rgba(212,175,55,.2);
}
@keyframes envelopePulse {
  0%,100% { box-shadow: 0 4px 20px rgba(212,175,55,.15); }
  50% { box-shadow: 0 8px 32px rgba(212,175,55,.35); }
}
.env-flap {
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 0; height: 0;
  border-left: 80px solid transparent; border-right: 80px solid transparent;
  border-top: 45px solid rgba(212,175,55,.18);
  pointer-events: none;
}
.env-body { position: relative; z-index: 1; text-align: center; }
.env-icon { display: block; font-size: 38px; margin-bottom: 8px;
  animation: envFloat 2.5s ease-in-out infinite; }
@keyframes envFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.env-label {
  display: block; font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: 21px; color: #f0d98a;
}
.env-hint {
  display: block; margin-top: 6px; font-family: 'Marcellus', serif; font-size: 10.5px;
  letter-spacing: .2em; text-transform: uppercase; color: #9aa6cf;
}
.envelope-content { animation: envOpen .6s ease both; }
@keyframes envOpen {
  from { opacity: 0; transform: translateY(-8px) scale(.97); }
  to { opacity: 1; transform: none; }
}

/* ——— PHOTO REVEAL POPUP ——— */
.photo-reveal {
  position: fixed; inset: 0; z-index: 80;
  display: flex; align-items: center; justify-content: center;
  background: rgba(4,6,16,.95); backdrop-filter: blur(12px);
  animation: prIn .6s cubic-bezier(.2,1,.3,1) both;
  padding: 16px;
}
@keyframes prIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.pr-close {
  position: absolute; top: 16px; right: 18px; z-index: 5;
  width: 40px; height: 40px; border-radius: 50%; cursor: pointer;
  background: rgba(255,255,255,.1); border: 1px solid rgba(212,175,55,.4);
  color: #f0d98a; font-size: 22px; line-height: 1;
  display: flex; align-items: center; justify-content: center;
  transition: transform .2s ease, background .2s ease;
}
.pr-close:hover { background: rgba(255,255,255,.2); transform: scale(1.1); }
.pr-inner {
  position: relative; width: 100%; max-width: 480px;
  border-radius: 24px; overflow: hidden;
  border: 1px solid rgba(212,175,55,.4);
  box-shadow: 0 30px 80px rgba(0,0,0,.7), 0 0 60px rgba(212,175,55,.15);
  animation: prSlideUp .7s cubic-bezier(.2,1,.3,1) .15s both;
}
@keyframes prSlideUp {
  from { opacity: 0; transform: translateY(40px) scale(.92); }
  to { opacity: 1; transform: none; }
}
.pr-photo-wrap { position: relative; }
.pr-photo {
  width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block;
  animation: prPhotoZoom 8s ease-out both;
}
@keyframes prPhotoZoom {
  from { transform: scale(1.15); }
  to { transform: scale(1); }
}
.pr-gradient {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(4,6,16,.9) 0%, rgba(4,6,16,.3) 40%, transparent 70%);
}
.pr-placeholder {
  aspect-ratio: 4 / 3; display: flex; align-items: center; justify-content: center;
  background: radial-gradient(circle at 50% 40%, rgba(212,175,55,.16), #0c1230);
}
.pr-ph-icon { font-size: 56px; }
.pr-overlay {
  position: absolute; bottom: 0; left: 0; right: 0; padding: 24px 20px 28px;
  text-align: center;
  animation: prFadeUp .8s ease .4s both;
}
@keyframes prFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}
.pr-trip-name {
  font-family: 'Cormorant Garamond', serif; font-weight: 600; font-style: italic;
  font-size: clamp(28px, 7vw, 38px);
  background: linear-gradient(180deg, #fbe6b4, #d8b052);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.pr-caption {
  font-style: italic; font-size: 17px; color: #efe4cb; margin-top: 4px;
}
.pr-heart-divider {
  color: #f7c3cd; font-size: 18px; margin: 12px 0 8px;
  animation: prHeartPulse 1.2s ease-in-out infinite;
}
@keyframes prHeartPulse {
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
.pr-unlocked-text {
  font-family: 'Marcellus', serif; font-size: 11px; letter-spacing: .18em;
  text-transform: uppercase; color: #e7b9c4;
}
.pr-continue {
  display: inline-block; margin-top: 16px; cursor: pointer;
  font-family: 'Marcellus', serif; font-size: 14px; letter-spacing: .1em;
  color: #1a1206; border: none; border-radius: 999px; padding: 12px 28px;
  background: linear-gradient(180deg, #fbe6b4, #e0b955 60%, #caa13c);
  box-shadow: 0 8px 24px rgba(212,175,55,.4);
  transition: transform .2s ease;
  animation: glowPulse 2.5s ease-in-out infinite;
}
.pr-continue:hover { transform: translateY(-2px) scale(1.04); }

.pr-banner {
  text-align: center; font-family: 'Marcellus', serif; font-size: 11px;
  letter-spacing: .18em; text-transform: uppercase; color: #1a1206;
  background: linear-gradient(180deg, #fbe6b4, #e0b955 60%, #caa13c);
  padding: 10px 12px;
}
.pr-nav {
  position: absolute; top: 50%; transform: translateY(-50%); z-index: 4;
  width: 44px; height: 44px; border-radius: 50%; cursor: pointer;
  background: rgba(10,14,34,.55); border: 1px solid rgba(212,175,55,.5);
  color: #f0d98a; font-size: 26px; line-height: 1;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px); transition: background .2s ease, transform .2s ease;
}
.pr-nav:hover { background: rgba(10,14,34,.85); }
.pr-nav:active { transform: translateY(-50%) scale(.9); }
.pr-nav-l { left: 10px; }
.pr-nav-r { right: 10px; }
.pr-dots { display: flex; gap: 7px; justify-content: center; margin-top: 12px; flex-wrap: wrap; }
.pr-dot {
  width: 8px; height: 8px; border-radius: 50%; cursor: pointer; padding: 0;
  background: rgba(255,255,255,.32); border: none; transition: all .2s ease;
}
.pr-dot-on { background: #f0d98a; transform: scale(1.4); box-shadow: 0 0 8px rgba(212,175,55,.6); }
.pr-footer {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 12px 16px 14px; background: #0c1230;
}
.pr-hint { font-size: 12px; color: #cdbf9a; font-style: italic; text-align: left; }
.pr-footer .pr-continue { margin-top: 0; }
.pr-caption { animation: prFadeUp .4s ease both; }

/* ——— BIRTHDAY COUNTDOWN OVERLAY ——— */
.cd-overlay {
  position: fixed; inset: 0; z-index: 100;
  display: flex; align-items: center; justify-content: center;
  text-align: center; padding: 28px;
  animation: fadeIn .8s ease both;
}
.cd-counting {
  background:
    radial-gradient(800px 500px at 50% 35%, rgba(30,20,60,.95), rgba(6,4,18,.98));
}
.cd-birthday {
  background:
    radial-gradient(900px 600px at 50% 30%, rgba(60,30,20,.9), rgba(6,4,18,.97));
}
.cd-stars {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(1.6px 1.6px at 15% 25%, rgba(255,245,210,.9), transparent),
    radial-gradient(1.3px 1.3px at 70% 15%, rgba(255,245,210,.8), transparent),
    radial-gradient(1.1px 1.1px at 45% 70%, rgba(255,245,210,.7), transparent),
    radial-gradient(1.5px 1.5px at 88% 68%, rgba(255,245,210,.85), transparent),
    radial-gradient(1.2px 1.2px at 30% 90%, rgba(255,245,210,.6), transparent);
  pointer-events: none;
  animation: twinkle 4s ease-in-out infinite alternate;
}
.cd-candle-glow {
  position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%);
  width: 300px; height: 300px; border-radius: 50%;
  background: radial-gradient(circle, rgba(240,180,80,.15), transparent 70%);
  animation: candlePulse 2s ease-in-out infinite;
  pointer-events: none;
}
@keyframes candlePulse {
  0%,100% { opacity: .6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
}
.cd-inner {
  position: relative; z-index: 2; max-width: 480px;
}
.cd-kicker {
  font-family: 'Marcellus', serif; font-size: 12px; letter-spacing: .35em;
  text-transform: uppercase; color: #e7b9c4;
  animation: fadeUp 1s ease .2s both;
}
.cd-timer {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin: 28px 0 16px;
  animation: fadeUp 1s ease .5s both;
}
.cd-digit-group { text-align: center; }
.cd-digit {
  display: block;
  font-family: 'Cormorant Garamond', serif; font-weight: 600;
  font-size: clamp(72px, 22vw, 120px); line-height: 1;
  background: linear-gradient(180deg, #fbe6b4 0%, #e8c46a 40%, #c79a36 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 0 60px rgba(212,175,55,.3);
  animation: digitPop .35s cubic-bezier(.2,1.2,.4,1) both;
}
@keyframes digitPop {
  from { transform: scale(.85) translateY(6px); opacity: .4; }
  to { transform: none; opacity: 1; }
}
.cd-unit {
  display: block; font-family: 'Marcellus', serif; font-size: 11px;
  letter-spacing: .2em; text-transform: uppercase; color: #9aa6cf; margin-top: 4px;
}
.cd-colon {
  font-family: 'Cormorant Garamond', serif; font-weight: 600;
  font-size: clamp(48px, 14vw, 80px); color: #e8c46a;
  animation: colonBlink 1s step-end infinite;
  padding-bottom: 20px;
}
@keyframes colonBlink { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
.cd-until {
  font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 500;
  font-size: clamp(22px, 6vw, 30px); color: #f0d98a;
  animation: fadeUp 1s ease .7s both;
}
.cd-hearts-row {
  display: flex; justify-content: center; gap: 12px; margin: 22px 0;
  animation: fadeUp 1s ease .9s both;
}
.cd-float-heart {
  font-size: 20px; animation: cdHeartFloat 2.5s ease-in-out infinite;
}
@keyframes cdHeartFloat {
  0%,100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.15); }
}
.cd-whisper {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: clamp(16px, 4.5vw, 20px); line-height: 1.6; color: #d8cba8;
  max-width: 380px; margin: 0 auto;
  animation: fadeUp 1.2s ease 1.2s both;
}

/* ——— BIRTHDAY CELEBRATION SCREEN ——— */
.cd-burst-layer {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 1;
}
.cd-confetti {
  position: absolute; top: -10%;
  animation-name: cdConfettiFall; animation-timing-function: ease-in;
  animation-fill-mode: forwards; animation-iteration-count: infinite;
}
@keyframes cdConfettiFall {
  0% { opacity: 0; transform: translateY(0) rotate(0deg) scale(.7); }
  10% { opacity: 1; }
  100% { opacity: 0; transform: translateY(110vh) rotate(360deg) scale(1.1); }
}
.cd-inner-bday { position: relative; z-index: 2; }
.cd-bday-kicker {
  font-family: 'Marcellus', serif; font-size: 13px; letter-spacing: .4em;
  text-transform: uppercase; color: #e7b9c4;
  animation: fadeUp .8s ease .2s both;
}
.cd-bday-title {
  font-family: 'Cormorant Garamond', serif; font-weight: 600; font-style: italic;
  font-size: clamp(36px, 12vw, 60px); line-height: 1.05; margin: 8px 0 0;
  background: linear-gradient(180deg, #fbe6b4 0%, #e8c46a 50%, #c79a36 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 0 50px rgba(212,175,55,.35);
  animation: fadeUp 1s ease .4s both;
}
.cd-bday-name {
  font-family: 'Cormorant Garamond', serif; font-weight: 600; font-style: italic;
  font-size: clamp(52px, 18vw, 100px); line-height: .95; margin: 0;
  background: linear-gradient(180deg, #f7c3cd, #e89fb0, #d98695);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 0 40px rgba(217,134,149,.3);
  animation: fadeUp 1.1s ease .6s both;
}
.cd-bday-heart {
  font-size: 36px; margin: 16px 0;
  animation: fadeUp 1s ease .8s both, prHeartPulse 1.2s ease-in-out 1.8s infinite;
}
.cd-bday-msg {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: clamp(18px, 5vw, 22px); line-height: 1.65; color: #efe4cb;
  max-width: 400px; margin: 0 auto;
  animation: fadeUp 1s ease 1s both;
}
.cd-bday-cake {
  font-size: 48px; margin: 20px 0 8px;
  animation: fadeUp 1s ease 1.2s both, cdCakeBounce 2s ease-in-out 2.2s infinite;
}
@keyframes cdCakeBounce {
  0%,100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(-5deg); }
  50% { transform: scale(1.05) rotate(0deg); }
  75% { transform: scale(1.1) rotate(5deg); }
}
.cd-bday-continue {
  display: inline-block; margin-top: 16px; cursor: pointer;
  font-family: 'Marcellus', serif; font-size: 15px; letter-spacing: .1em;
  color: #1a1206; border: none; border-radius: 999px; padding: 14px 34px;
  background: linear-gradient(180deg, #fbe6b4, #e0b955 60%, #caa13c);
  box-shadow: 0 10px 34px rgba(212,175,55,.45), inset 0 1px 0 rgba(255,255,255,.6);
  animation: fadeUp 1s ease 1.5s both, glowPulse 3s ease-in-out 2.5s infinite;
  transition: transform .2s ease;
}
.cd-bday-continue:hover { transform: translateY(-2px) scale(1.04); }

/* ——— FIREWORKS CANVAS ——— */
.fireworks-canvas {
  position: fixed; inset: 0; z-index: 58; pointer-events: none;
  width: 100%; height: 100%;
}

/* ——— CALLIGRAPHY LOADING SCREEN ——— */
.calli-loader {
  position: fixed; inset: 0; z-index: 200;
  display: flex; align-items: center; justify-content: center;
  background:
    radial-gradient(600px 400px at 50% 42%, rgba(40,28,60,.95), transparent),
    linear-gradient(160deg, #060414 0%, #0a0820 50%, #060414 100%);
  transition: opacity .9s ease;
}
.calli-fadeout { opacity: 0; pointer-events: none; }
.calli-stars {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(1.4px 1.4px at 18% 28%, rgba(255,245,210,.85), transparent),
    radial-gradient(1.2px 1.2px at 72% 18%, rgba(255,245,210,.7), transparent),
    radial-gradient(1.1px 1.1px at 48% 68%, rgba(255,245,210,.6), transparent),
    radial-gradient(1.3px 1.3px at 88% 58%, rgba(255,245,210,.75), transparent),
    radial-gradient(1px 1px at 35% 85%, rgba(255,245,210,.5), transparent),
    radial-gradient(1.5px 1.5px at 60% 12%, rgba(255,245,210,.6), transparent);
  pointer-events: none;
  animation: twinkle 5s ease-in-out infinite alternate;
}
.calli-inner {
  position: relative; z-index: 2; text-align: center; max-width: 560px; width: 100%;
  padding: 0 24px;
}
.calli-kicker {
  font-family: 'Marcellus', serif; font-size: 11.5px; letter-spacing: .35em;
  text-transform: uppercase; color: #e7b9c4; margin-bottom: 18px;
  opacity: 0; animation: fadeUp .9s ease .15s both;
}

/* name with font + gradient reveal mask */
.calli-name-wrap {
  position: relative; display: inline-block;
  opacity: 0; animation: calliNameIn 1s ease .5s both;
}
@keyframes calliNameIn {
  from { opacity: 0; transform: scale(.88) translateY(10px); }
  to { opacity: 1; transform: none; }
}
.calli-name {
  font-family: 'Great Vibes', cursive; font-size: clamp(72px, 24vw, 130px);
  line-height: 1.1;
  background: linear-gradient(135deg, #fbe6b4 0%, #e8c46a 35%, #d4af37 60%, #f0d98a 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 0 60px rgba(212,175,55,.3);
  animation: calliShimmer 4s ease-in-out 1.5s infinite;
}
@keyframes calliShimmer {
  0%,100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
/* gradient wipe mask that reveals the text left-to-right */
.calli-mask {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, #060414 0%, #0a0820 50%, #060414 100%);
  animation: calliReveal 2s cubic-bezier(.4,.0,.2,1) .6s both;
}
@keyframes calliReveal {
  from { clip-path: inset(0 0 0 0); }
  to { clip-path: inset(0 0 0 100%); }
}
/* soft glow pulse after reveal */
.calli-glow-on .calli-name {
  text-shadow: 0 0 40px rgba(212,175,55,.5), 0 0 80px rgba(212,175,55,.2);
  transition: text-shadow .8s ease;
}

/* decorative swirl underline */
.calli-swirl-wrap {
  margin-top: -4px;
  opacity: 0; animation: fadeUp .6s ease 2.2s both;
}
.calli-swirl-svg {
  width: 180px; height: auto;
}
.calli-swirl-path {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: calliSwirl 1.4s cubic-bezier(.4,.0,.2,1) 2.3s both;
}
@keyframes calliSwirl {
  to { stroke-dashoffset: 0; }
}

.calli-sub {
  margin-top: 22px; font-size: 30px;
  opacity: 0; transition: opacity .7s ease;
}
.calli-sub-show { opacity: 1; }
.calli-heart {
  display: inline-block;
  animation: prHeartPulse 1.2s ease-in-out infinite;
}

/* ——— BIRTHDAY STATS ——— */
.stat-bday .stat-num { font-size: 30px; line-height: 1; }
.stat-bday { border-color: rgba(240,180,80,.3); background: linear-gradient(180deg, rgba(240,180,80,.1), rgba(240,180,80,.02)); }
.stat-infinite .stat-num {
  font-size: 34px; font-weight: 300;
  background: linear-gradient(180deg, #f7c3cd, #e89fb0);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: none;
}

/* ——— ENHANCED BURST (drift) ——— */
@keyframes floatUp {
  0% { opacity: 0; transform: translateY(0) translateX(0) scale(.6) rotate(0deg); }
  15% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-110vh) translateX(var(--drift, 0px)) scale(1.1) rotate(40deg); }
}

/* ——— BIRTHDAY LETTER ——— */
.bday-letter {
  position: fixed; inset: 0; z-index: 35;
  display: flex; align-items: center; justify-content: center;
  background:
    radial-gradient(800px 500px at 50% 30%, rgba(30,18,50,.97), transparent),
    linear-gradient(160deg, #060414 0%, #0a0820 50%, #060414 100%);
  animation: fadeIn .8s ease both;
}
.bday-letter-stars {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(1.4px 1.4px at 18% 28%, rgba(255,245,210,.85), transparent),
    radial-gradient(1.2px 1.2px at 72% 18%, rgba(255,245,210,.7), transparent),
    radial-gradient(1.1px 1.1px at 48% 68%, rgba(255,245,210,.6), transparent),
    radial-gradient(1.3px 1.3px at 88% 58%, rgba(255,245,210,.75), transparent),
    radial-gradient(1px 1px at 35% 85%, rgba(255,245,210,.5), transparent);
  pointer-events: none;
  animation: twinkle 5s ease-in-out infinite alternate;
}
.bday-letter-content {
  position: relative; z-index: 2; width: 100%; max-width: 560px; max-height: 88vh;
  overflow-y: auto; -webkit-overflow-scrolling: touch;
  padding: 20px;
}
.bday-letter-inner {
  text-align: center; padding: 36px 28px 40px;
  border-radius: 24px;
  background:
    radial-gradient(600px 200px at 50% -10%, rgba(212,175,55,.1), transparent 60%),
    linear-gradient(170deg, rgba(20,26,58,.95) 0%, rgba(15,20,48,.97) 60%, rgba(20,15,41,.95) 100%);
  border: 1px solid rgba(212,175,55,.3);
  box-shadow: 0 30px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.05);
  animation: cardIn .7s cubic-bezier(.2,1,.3,1) both;
}
.bday-letter-seal {
  font-size: 48px; margin-bottom: 12px;
  animation: envFloat 2.5s ease-in-out infinite, fadeUp .8s ease .2s both;
}
.bday-letter-date {
  font-family: 'Marcellus', serif; font-size: 11px; letter-spacing: .3em;
  text-transform: uppercase; color: #9aa6cf;
  opacity: 0; animation: fadeUp .8s ease .35s both;
}
.bday-letter-greeting {
  font-family: 'Great Vibes', cursive; font-size: clamp(36px, 10vw, 52px);
  line-height: 1.2; margin: 16px 0 20px;
  background: linear-gradient(180deg, #fbe6b4, #e8c46a, #d4af37);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 0 40px rgba(212,175,55,.3);
  opacity: 0; animation: fadeUp 1s ease .5s both;
}
.bday-letter-body {
  text-align: left;
  opacity: 0; animation: fadeUp 1s ease .8s both;
}
.bday-letter-body p {
  font-size: 17.5px; line-height: 1.7; color: #efe4cb; margin: 0 0 16px;
  font-style: italic;
}
.bday-letter-body p:first-child::first-letter {
  font-size: 1.6em; color: #f0d98a; font-style: italic; line-height: 1; padding-right: 2px;
}
.bday-letter-closing {
  text-align: right; color: #f0d98a !important; margin-top: 24px !important;
  font-size: 19px !important;
}
.bday-letter-hearts {
  margin: 24px 0 20px; font-size: 22px; letter-spacing: 8px;
  opacity: 0; animation: fadeUp .8s ease 1.2s both;
}
.bday-letter-btn {
  display: inline-block; cursor: pointer;
  font-family: 'Marcellus', serif; font-size: 15px; letter-spacing: .1em;
  color: #1a1206; border: none; border-radius: 999px; padding: 14px 34px;
  background: linear-gradient(180deg, #fbe6b4, #e0b955 60%, #caa13c);
  box-shadow: 0 10px 34px rgba(212,175,55,.4), inset 0 1px 0 rgba(255,255,255,.6);
  opacity: 0; animation: fadeUp 1s ease 1.5s both, glowPulse 3s ease-in-out 2.5s infinite;
  transition: transform .2s ease;
}
.bday-letter-btn:hover { transform: translateY(-2px) scale(1.04); }

/* ——— REASONS I LOVE YOU ——— */
.reasons {
  height: 100%; overflow-y: auto; -webkit-overflow-scrolling: touch;
  padding: 28px 16px 80px; max-width: 640px; margin: 0 auto;
}
.reasons-head { text-align: center; margin-bottom: 28px; }
.reasons-kicker {
  font-family: 'Marcellus', serif; font-size: 11px; letter-spacing: .3em;
  text-transform: uppercase; color: #e7b9c4;
}
.reasons-title {
  font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 600;
  font-size: clamp(32px, 9vw, 48px); margin: 6px 0 6px;
  background: linear-gradient(180deg, #fbe6b4, #d8b052);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.reasons-sub {
  font-style: italic; font-size: 16px; color: #cdbf9a; margin: 0;
}
.reasons-list { display: flex; flex-direction: column; gap: 12px; }
.reason-card {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px; border-radius: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.015));
  border: 1px solid rgba(212,175,55,.18);
  animation: reasonSlide .5s cubic-bezier(.2,1,.3,1) both;
  transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
}
.reason-card:hover {
  transform: translateX(4px);
  border-color: rgba(212,175,55,.45);
  box-shadow: 0 8px 24px rgba(0,0,0,.3), 0 0 16px rgba(212,175,55,.12);
}
@keyframes reasonSlide {
  from { opacity: 0; transform: translateX(-24px) scale(.96); }
  to { opacity: 1; transform: none; }
}
.reason-num {
  flex: 0 0 auto; width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Marcellus', serif; font-size: 12px; font-weight: 600;
  color: #1a1206;
  background: linear-gradient(180deg, #f0d98a, #caa13c);
  box-shadow: 0 0 10px rgba(212,175,55,.4);
}
.reason-icon { font-size: 22px; flex: 0 0 auto; }
.reason-text {
  font-size: 17.5px; line-height: 1.45; color: #efe4cb; font-style: italic;
}
.reasons-more {
  display: block; margin: 28px auto 0; cursor: pointer;
  font-family: 'Marcellus', serif; font-size: 14px; letter-spacing: .1em;
  color: #1a1206; border: none; border-radius: 999px; padding: 12px 30px;
  background: linear-gradient(180deg, #fbe6b4, #e0b955 60%, #caa13c);
  box-shadow: 0 8px 24px rgba(212,175,55,.35);
  transition: transform .2s ease;
  animation: glowPulse 3s ease-in-out infinite;
}
.reasons-more:hover { transform: translateY(-2px) scale(1.04); }
.reasons-end {
  text-align: center; margin-top: 32px; padding: 24px 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(212,175,55,.1), rgba(212,175,55,.03));
  border: 1px solid rgba(212,175,55,.25);
  animation: fadeUp .6s ease both;
}
.reasons-end-heart {
  font-size: 36px; display: block; margin-bottom: 12px;
  animation: prHeartPulse 1.2s ease-in-out infinite;
}
.reasons-end p {
  font-style: italic; font-size: 18px; color: #efe4cb; margin: 0 0 8px;
  line-height: 1.5;
}
.reasons-end-sign {
  font-family: 'Cormorant Garamond', serif; font-weight: 600; font-style: italic;
  font-size: 24px !important; margin-top: 8px !important;
  background: linear-gradient(180deg, #fbe6b4, #d8b052);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

/* ——— BIRTHDAY NOTE (handwritten style in finale) ——— */
.bday-note {
  margin-top: 20px;
  animation: fadeUp .7s ease .3s both;
}
.bday-note-label {
  font-family: 'Marcellus', serif; font-size: 10.5px; letter-spacing: .2em;
  text-transform: uppercase; color: #e7b9c4; text-align: center; margin-bottom: 10px;
}
.bday-note-paper {
  padding: 22px 24px; border-radius: 16px;
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 31px,
      rgba(212,175,55,.08) 31px,
      rgba(212,175,55,.08) 32px
    ),
    linear-gradient(170deg, rgba(255,248,220,.06) 0%, rgba(255,248,220,.02) 100%);
  border: 1px solid rgba(212,175,55,.3);
  box-shadow: 0 8px 30px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.04);
  position: relative;
}
.bday-note-paper::before {
  content: ""; position: absolute; left: 24px; top: 0; bottom: 0; width: 1px;
  background: rgba(217,134,149,.2);
}
.bday-note-text {
  font-family: 'Great Vibes', cursive; font-size: clamp(20px, 5vw, 26px);
  line-height: 1.8; color: #f0d98a; margin: 0; padding-left: 12px;
  text-shadow: 0 0 20px rgba(212,175,55,.15);
}

@media (min-width: 700px) {
  .stat { min-width: 96px; }
  .card-message p { font-size: 19.5px; }
  .bday-letter-body p { font-size: 18.5px; }
  .reason-text { font-size: 18.5px; }
}

/* ——— FINALE CELEBRATION ——— */
.card-finale {
  border: 2px solid rgba(251,230,180,.25);
  box-shadow:
    0 0 40px rgba(251,230,180,.15),
    0 0 80px rgba(251,230,180,.08),
    inset 0 0 60px rgba(251,230,180,.04);
}
.card-finale > .fireworks-canvas {
  position: fixed;
  border-radius: 0;
  z-index: 58;
  pointer-events: none;
}
.finale-hero {
  position: relative;
  text-align: center;
  padding: 32px 16px 20px;
  margin: -22px -20px 20px;
  border-radius: 20px 20px 0 0;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(251,230,180,.12) 0%, transparent 70%),
    linear-gradient(180deg, rgba(20,15,40,.9) 0%, transparent 100%);
  overflow: hidden;
  z-index: 1;
}
.finale-confetti-layer {
  position: absolute; inset: 0;
  pointer-events: none; overflow: hidden;
  z-index: 0;
}
.finale-confetti {
  position: absolute; top: -30px;
  animation: finaleConfettiFall linear infinite;
  opacity: .85;
  pointer-events: none;
}
@keyframes finaleConfettiFall {
  0%   { transform: translateY(-30px) rotate(0deg); opacity: 0; }
  10%  { opacity: .85; }
  90%  { opacity: .7; }
  100% { transform: translateY(250px) rotate(720deg); opacity: 0; }
}
.finale-crown {
  font-size: 48px;
  animation: finaleCrownBounce 2s ease-in-out infinite;
  margin-bottom: 8px;
}
@keyframes finaleCrownBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-8px) scale(1.1); }
}
.finale-bday-title {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(36px, 9vw, 56px);
  color: transparent;
  background: linear-gradient(135deg, #fbe6b4 0%, #e8c46a 30%, #f7c3cd 60%, #fbe6b4 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: finaleShimmer 3s ease-in-out infinite;
  margin: 0; line-height: 1.2;
  text-shadow: none;
}
@keyframes finaleShimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.finale-bday-name {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(28px, 7vw, 44px);
  color: #f7c3cd;
  margin: 4px 0 0;
  line-height: 1.2;
  text-shadow: 0 0 20px rgba(247,195,205,.4);
}
.finale-sparkle-row {
  font-size: 22px;
  margin-top: 12px;
  letter-spacing: 8px;
  animation: finalePulse 2s ease-in-out infinite;
}
@keyframes finalePulse {
  0%, 100% { opacity: .7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

/* ——— NEXT CHAPTER BUTTON ——— */
.next-chapter-btn {
  display: block; width: 100%; margin: 28px 0 0; padding: 16px 24px;
  font-family: 'Marcellus', serif; font-size: 15px; letter-spacing: .08em;
  color: #1a1206; cursor: pointer; border: none; border-radius: 999px;
  background: linear-gradient(180deg, #fbe6b4, #e0b955 60%, #caa13c);
  box-shadow: 0 8px 24px rgba(212,175,55,.3), inset 0 1px 0 rgba(255,255,255,.5);
  transition: transform .2s ease, filter .2s ease;
  animation: fadeUp .6s ease both;
}
.next-chapter-btn:hover { transform: translateY(-2px); filter: brightness(1.06); }

/* ——— DOUBLE-TAP HEART ——— */
.dbl-tap-heart {
  position: absolute; transform: translate(-50%, -50%) scale(0);
  font-size: 48px; pointer-events: none; z-index: 10;
  animation: dblTapHeart 1.2s ease-out forwards;
}
@keyframes dblTapHeart {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  30% { transform: translate(-50%, -50%) scale(1.4); opacity: 1; }
  100% { transform: translate(-50%, -80%) scale(1); opacity: 0; }
}

/* ——— FLIP CARDS (Reasons I Love You) ——— */
.reason-flip {
  perspective: 800px; cursor: pointer;
  animation: fadeUp .5s ease both;
}
.rf-inner {
  position: relative; width: 100%; padding-top: 110%;
  transform-style: preserve-3d; transition: transform .6s ease;
}
.rf-flipped .rf-inner { transform: rotateY(180deg); }
.rf-front, .rf-back {
  position: absolute; inset: 0; backface-visibility: hidden;
  border-radius: 16px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 16px;
  border: 1px solid rgba(212,175,55,.3);
  box-shadow: 0 4px 16px rgba(0,0,0,.2);
}
.rf-front {
  background: linear-gradient(160deg, rgba(20,24,52,.95), rgba(12,15,38,.95));
}
.rf-back {
  background: linear-gradient(160deg, rgba(30,18,40,.95), rgba(20,12,32,.95));
  transform: rotateY(180deg);
}
.rf-num {
  font-family: 'Great Vibes', cursive; font-size: 42px;
  background: linear-gradient(180deg, #fbe6b4, #c79a36);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.rf-icon-hidden { font-size: 28px; margin-top: 8px; filter: blur(6px); opacity: .4; }
.rf-tap-hint {
  font-family: 'Marcellus', serif; font-size: 10px; letter-spacing: .2em;
  text-transform: uppercase; color: rgba(212,175,55,.5); margin-top: 12px;
}
.rf-hold-label {
  font-family: 'Marcellus', serif; font-size: 11px; letter-spacing: .15em;
  text-transform: uppercase; color: #e7b9c4; margin-top: 12px;
}
.rf-hold-ring {
  position: absolute; inset: 8px; border-radius: 16px; pointer-events: none;
  border: 3px solid transparent;
  border-top-color: #d4af37;
  transform: rotate(calc(var(--prog) * 360deg));
  transition: transform .03s linear;
  opacity: .8;
}
.rf-num-back {
  font-family: 'Great Vibes', cursive; font-size: 24px; color: #e7b9c4;
}
.rf-icon-back { font-size: 32px; margin: 6px 0; }
.rf-text {
  font-family: 'Cormorant Garamond', serif; font-size: 15px; font-style: italic;
  line-height: 1.45; color: #f3ead3; text-align: center;
}
.rf-last .rf-front { border-color: rgba(247,195,205,.5); }
.reasons-list {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 14px; padding: 0 16px;
}
.reasons-progress {
  text-align: center; margin-top: 18px; font-family: 'Marcellus', serif;
  font-size: 13px; letter-spacing: .12em; color: rgba(212,175,55,.6);
}

/* ——— SPARKLE HINTS ——— */
.ss-hinted {
  animation: sparkleHintPulse 1.2s ease-in-out infinite !important;
}
@keyframes sparkleHintPulse {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(212,175,55,.4)); }
  50% { transform: scale(1.6); filter: drop-shadow(0 0 12px rgba(212,175,55,.8)); }
}
.sparkle-hint {
  position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
  background: rgba(20,15,40,.9); color: #f0d98a;
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: 14px; padding: 10px 20px; border-radius: 999px;
  border: 1px solid rgba(212,175,55,.3);
  box-shadow: 0 4px 20px rgba(0,0,0,.4);
  animation: fadeUp .6s ease both;
  z-index: 20; pointer-events: none;
}

/* ——— SCROLL-REVEAL LETTER PARAGRAPHS ——— */
.letter-para {
  opacity: 0; transform: translateY(24px);
  transition: opacity .8s ease, transform .8s ease;
}
.letter-para-visible {
  opacity: 1; transform: translateY(0);
}

/* ——— SLIDESHOW BUTTON ——— */
.slideshow-btn {
  background: none; border: 1px solid rgba(212,175,55,.35);
  color: #f0d98a; font-size: 14px; width: 36px; height: 36px;
  border-radius: 50%; cursor: pointer; margin-right: 8px;
  display: flex; align-items: center; justify-content: center;
  transition: all .2s ease;
}
.slideshow-btn:hover { border-color: rgba(212,175,55,.7); background: rgba(212,175,55,.1); }

/* ——— AUTO SLIDESHOW (full-screen montage) ——— */
.auto-slideshow {
  position: fixed; inset: 0; z-index: 100;
  background: #0a0e22; display: flex; align-items: center; justify-content: center;
  animation: fadeIn .5s ease both;
}
.as-bg {
  position: absolute; inset: 0; z-index: 0;
  animation: fadeIn .8s ease both;
}
.as-bg-img {
  width: 100%; height: 100%; object-fit: cover;
  filter: blur(40px) brightness(.2) saturate(.5);
  transform: scale(1.2);
}
.as-photo {
  position: relative; z-index: 1; max-width: 85vw; max-height: 75vh;
  object-fit: contain; border-radius: 8px;
  box-shadow: 0 16px 60px rgba(0,0,0,.6);
  animation: kenBurns 4s ease-in-out both;
}
@keyframes kenBurns {
  0% { transform: scale(1.08); opacity: 0; }
  8% { opacity: 1; }
  92% { opacity: 1; }
  100% { transform: scale(1); opacity: .7; }
}
.as-caption {
  position: absolute; bottom: 90px; left: 0; right: 0; text-align: center;
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: 16px; color: #f3ead3; padding: 0 24px;
  animation: fadeUp .6s ease .3s both; z-index: 2;
}
.as-icon { margin-right: 8px; }
.as-counter {
  position: absolute; top: 20px; right: 20px;
  font-family: 'Marcellus', serif; font-size: 12px;
  letter-spacing: .1em; color: rgba(212,175,55,.5); z-index: 2;
}
.as-controls {
  position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 16px; z-index: 2;
}
.as-btn {
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(255,255,255,.08); border: 1px solid rgba(212,175,55,.3);
  color: #f0d98a; font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .2s ease;
}
.as-btn:hover { background: rgba(212,175,55,.15); }
.as-close {
  position: absolute; top: 16px; left: 16px; z-index: 3;
  background: rgba(0,0,0,.4); border: 1px solid rgba(255,255,255,.15);
  color: #f3ead3; font-size: 24px; width: 40px; height: 40px;
  border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}

/* ——— FINALE EXPERIENCE (full-screen takeover) ——— */
.finale-exp {
  position: fixed; inset: 0; z-index: 80;
  background: #0a0e22; overflow-y: auto;
  animation: fadeIn .8s ease both;
}
.finale-exp-close {
  position: fixed; top: 16px; right: 16px; z-index: 90;
  background: rgba(0,0,0,.5); border: 1px solid rgba(255,255,255,.15);
  color: #f3ead3; font-size: 26px; width: 42px; height: 42px;
  border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.finale-stage {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  animation: fadeIn .8s ease both;
  text-align: center; padding: 24px;
}
.finale-entrance {
  background: radial-gradient(ellipse at 50% 50%, #1b2a5e 0%, #0a0e22 70%);
}
.finale-entrance-stars {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(2px 2px at 20% 30%, rgba(255,245,210,.9), transparent),
    radial-gradient(2px 2px at 75% 20%, rgba(255,245,210,.8), transparent),
    radial-gradient(1.5px 1.5px at 50% 65%, rgba(255,245,210,.7), transparent),
    radial-gradient(2px 2px at 85% 75%, rgba(255,245,210,.85), transparent);
  animation: twinkle 3s ease-in-out infinite alternate;
}
.finale-calligraphy {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(72px, 20vw, 140px);
  background: linear-gradient(180deg, #fbe6b4, #e8c46a 50%, #c79a36);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: none;
  animation: finaleCalliIn 2.5s cubic-bezier(.2,1,.3,1) both;
}
@keyframes finaleCalliIn {
  0% { opacity: 0; transform: scale(.5) translateY(30px); letter-spacing: .3em; }
  60% { opacity: 1; }
  100% { transform: scale(1) translateY(0); letter-spacing: 0; }
}

.finale-name-stage { background: radial-gradient(ellipse at 50% 50%, rgba(58,20,48,.4) 0%, #0a0e22 70%); }
.finale-hbd-stage { background: radial-gradient(ellipse at 50% 50%, rgba(27,42,94,.3) 0%, #0a0e22 70%); }
.finale-crown-big { font-size: 64px; animation: finaleCrownBounce 2s ease-in-out infinite; margin-bottom: 16px; }
.finale-hbd-text {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(42px, 12vw, 72px);
  background: linear-gradient(135deg, #fbe6b4, #e8c46a 30%, #f7c3cd 60%, #fbe6b4);
  background-size: 200% 200%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: finaleShimmer 3s ease-in-out infinite;
  margin: 0; line-height: 1.2;
}
.finale-hbd-name {
  font-family: 'Great Vibes', cursive; font-size: clamp(32px, 9vw, 52px);
  color: #f7c3cd; margin: 8px 0 0;
  text-shadow: 0 0 24px rgba(247,195,205,.4);
}
.finale-hbd-sparkles { font-size: 26px; margin-top: 16px; letter-spacing: 10px; animation: finalePulse 2s ease-in-out infinite; }

/* finale letter */
.finale-letter-stage {
  align-items: stretch; justify-content: flex-start; padding: 0;
  overflow-y: auto;
}
.finale-letter-scroll {
  width: 100%; max-width: 600px; margin: 0 auto; padding: 48px 24px 80px;
}
.finale-letter-paper {
  background: linear-gradient(170deg, rgba(255,248,220,.06), rgba(255,248,220,.02));
  border: 1px solid rgba(212,175,55,.3);
  border-radius: 16px; padding: 32px 24px;
  box-shadow: 0 8px 40px rgba(0,0,0,.3);
}
.finale-letter-date {
  font-family: 'Marcellus', serif; font-size: 12px; letter-spacing: .15em;
  color: rgba(212,175,55,.6); margin-bottom: 16px;
}
.finale-letter-greeting {
  font-family: 'Great Vibes', cursive; font-size: clamp(28px, 7vw, 40px);
  color: #f0d98a; margin: 0 0 20px;
}
.finale-letter-body p {
  font-family: 'Cormorant Garamond', serif; font-size: 16.5px;
  line-height: 1.7; color: #efe4cb; margin: 0 0 16px; font-style: italic;
}
.finale-letter-actions { animation: fadeUp .8s ease both; margin-top: 24px; }
.finale-bday-note {
  margin: 20px 0; padding: 20px; border-radius: 12px;
  background: linear-gradient(170deg, rgba(255,248,220,.05), rgba(255,248,220,.02));
  border: 1px solid rgba(212,175,55,.2);
}
.finale-bday-note-label {
  font-family: 'Marcellus', serif; font-size: 11px; letter-spacing: .15em;
  text-transform: uppercase; color: #e7b9c4; margin-bottom: 12px;
}
.finale-bday-note-text {
  font-family: 'Great Vibes', cursive; font-size: clamp(20px, 5vw, 26px);
  line-height: 1.8; color: #f0d98a; margin: 0;
}
.finale-ps {
  font-family: 'Cormorant Garamond', serif; font-size: 15px;
  font-style: italic; color: #e7b9c4; margin: 16px 0;
}
.finale-sign {
  font-family: 'Cormorant Garamond', serif; font-size: 18px;
  font-style: italic; color: #f0d98a; margin: 16px 0;
  text-align: center;
}
.finale-continue-btn {
  display: block; width: 100%; margin-top: 24px; padding: 16px 24px;
  font-family: 'Marcellus', serif; font-size: 15px; letter-spacing: .08em;
  color: #1a1206; cursor: pointer; border: none; border-radius: 999px;
  background: linear-gradient(180deg, #fbe6b4, #e0b955 60%, #caa13c);
  box-shadow: 0 8px 24px rgba(212,175,55,.3), inset 0 1px 0 rgba(255,255,255,.5);
  transition: transform .2s ease, filter .2s ease;
  animation: fadeUp .6s ease both;
}
.finale-continue-btn:hover { transform: translateY(-2px); filter: brightness(1.06); }
.finale-continue-bottom { position: absolute; bottom: 24px; left: 24px; right: 24px; width: auto; }

/* finale slideshow */
.finale-slideshow-stage { padding: 0; }
.finale-slideshow {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
}
.finale-slideshow-img {
  max-width: 88vw; max-height: 72vh; object-fit: contain;
  border-radius: 8px; box-shadow: 0 12px 50px rgba(0,0,0,.5);
  animation: kenBurns 4s ease-in-out both;
}
.finale-slideshow-caption {
  position: absolute; bottom: 100px; left: 0; right: 0; text-align: center;
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: 15px; color: #f3ead3; padding: 0 24px;
  animation: fadeUp .5s ease .2s both;
}
.finale-slideshow-icon { margin-right: 8px; }
.finale-slideshow-counter {
  position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
  font-family: 'Marcellus', serif; font-size: 12px;
  letter-spacing: .1em; color: rgba(212,175,55,.5);
}

/* finale promises */
.finale-promises-stage { align-items: stretch; justify-content: flex-start; padding: 0; overflow-y: auto; }
.finale-promises-scroll {
  width: 100%; max-width: 500px; margin: 0 auto; padding: 60px 24px 80px;
}
.finale-promises-title {
  font-family: 'Great Vibes', cursive; font-size: clamp(32px, 8vw, 48px);
  color: #f0d98a; margin: 0 0 8px; text-align: center;
}
.finale-promises-sub {
  font-family: 'Cormorant Garamond', serif; font-size: 15px;
  font-style: italic; color: #e7b9c4; text-align: center; margin: 0 0 28px;
}
.finale-promises-list { display: flex; flex-direction: column; gap: 10px; }
.finale-promise {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px; border-radius: 14px; cursor: pointer;
  background: linear-gradient(160deg, rgba(20,24,52,.9), rgba(12,15,38,.9));
  border: 1px solid rgba(212,175,55,.2);
  transition: all .3s ease;
  animation: fadeUp .5s ease both;
  text-align: left;
}
.finale-promise:hover { border-color: rgba(212,175,55,.5); }
.fp-sealed {
  background: linear-gradient(160deg, rgba(40,30,55,.9), rgba(25,18,42,.9));
  border-color: rgba(212,175,55,.4);
}
.fp-icon { font-size: 28px; flex-shrink: 0; }
.fp-text {
  font-family: 'Cormorant Garamond', serif; font-size: 16px;
  font-style: italic; color: #f3ead3; flex: 1;
}
.fp-seal {
  font-size: 20px; animation: fadeIn .3s ease both;
}
.finale-promises-progress {
  text-align: center; margin-top: 16px;
  font-family: 'Marcellus', serif; font-size: 12px;
  letter-spacing: .12em; color: rgba(212,175,55,.5);
}
.finale-promises-end {
  text-align: center; margin-top: 28px; animation: fadeUp .6s ease both;
}
.finale-promises-end p {
  font-family: 'Cormorant Garamond', serif; font-size: 17px;
  font-style: italic; color: #f3ead3; margin: 0 0 8px;
}
.finale-promises-sign {
  color: #f0d98a; font-size: 19px;
  margin-top: 16px;
}

/* ——— SHAKE CONFETTI ——— */
.shake-confetti-layer {
  position: fixed; inset: 0; pointer-events: none; z-index: 50;
  animation: fadeIn .2s ease both;
}
`;
