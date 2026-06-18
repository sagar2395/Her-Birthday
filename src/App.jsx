/*
  ════════════════════════════════════════════════════════════════════════════
   OUR STORY MAP & FEAST  —  A birthday surprise for Nidhi Arjariya Chhabra
   An interactive memory atlas of every place — and every plate — we've loved.
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

import { useState, useEffect, useRef, useCallback } from "react";

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
      "My birthday, March 2024 — and you had a secret plan. You wanted to propose right back at Cafe Oakaz (freshly renovated and gorgeous), on the top floor. But I kept changing my birthday plans — one idea after another — and you were silently losing your mind trying to keep your surprise alive. When we finally got there, you pulled out a ring, and I understood everything. All the stress, all the sneaky planning — it was all for this moment. You proposed to me, Nidhi. And in that moment, I realised you don't just love me — you fight for us, even against my own chaotic birthday plans.",
    video: "",
    photos: [
      { url: "/media/her-proposal/her-proposal-01-couch-selfie.jpg", caption: "Cafe Oakaz — renovated and ready for her surprise" },
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
      { url: "/media/bali/bali-07-kl-tower.jpg", caption: "Standing tall at KL Tower" },
      { url: "/media/bali/bali-08-kl-observation.jpg", caption: "Taking in the KL skyline" },
      { url: "/media/bali/bali-09-kl-dinner.jpg", caption: "Dinner dates in Kuala Lumpur" },
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
    id: "pachmarhi",
    name: "Pachmarhi",
    short: "Pachmarhi",
    when: "May 2025",
    type: "trip",
    icon: "🏔️",
    teaser: "An unplanned escape into the hills.",
    message:
      "No plan, just us and a long, winding drive into the Satpura hills. We dragged ourselves up before sunrise for the safari — half asleep, fully in love — and then stood quietly together at Gupt Mahadev, as if the temple was keeping our little secrets. Some of my favourite memories are the unplanned ones, because they're just you, me and the open road.",
    video: "",
    photos: [
      { url: "/media/pachmarhi/pachmarhi-01-satpura-tiger.jpg", caption: "Satpura National Park — posing with the tiger" },
      { url: "/media/pachmarhi/pachmarhi-02-viewpoint.jpg", caption: "On top of the world at the viewpoint" },
    ],
    food: [],
    quiz: null,
  },
  {
    id: "delhi",
    name: "Delhi",
    short: "Delhi",
    when: "August 2025",
    type: "trip",
    icon: "🍛",
    teaser: "Short, chaotic, delicious.",
    message:
      "A short trip — barely a weekend — but we packed in more street food than most people eat in a month. This whole trip was one long, glorious eating spree through Delhi's lanes, and I wouldn't change a single bite. Every chaat stall, every paratha, every sticky-sweet jalebi — we devoured it all together. The Food tab is where this memory truly lives, Nidhi. I remember every flavour — and every one of your smiles between bites.",
    video: "",
    photos: [],
    food: [],
    quiz: null,
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
      "This one's tender. We came to Goa to heal — together. We partied on Tito's Street, took long drives all the way to Arambol with the windows down, stayed right by the beach where we could hear the waves at night. Every morning, we walked into the ocean together — not swimming, just standing, letting the sea hold us. We came carrying something heavy, and we left a little lighter. You reminded me that the right person makes even the hard chapters feel survivable. I quietly, completely fell in love with you all over again here.",
    video: "",
    photos: [
      { url: "/media/goa/goa-01-flight-selfie.jpg", caption: "On the flight — couldn't stop looking at each other" },
      { url: "/media/goa/goa-02-beach-hug.jpg", caption: "The sea that healed us" },
      { url: "/media/goa/goa-03-waves.jpg", caption: "Ocean bath — just us and the waves" },
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
      "The Pink City, hand in hand — but it was the temples that stole this trip. We visited Khatu Shyam Mandir and Salasar Balaji Mandir, and Nidhi, watching you there — the peace on your face, the devotion — I fell in love with a new side of you. You absolutely loved it. We climbed the forts, explored every corner, and ate incredible food at Johari. Walking those golden walls beside you, I kept thinking how lucky I am that I get to explore this entire life with you.",
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
    teaser: "Home — our everyday love (and our food capital).",
    message:
      "Not every love story needs a passport. Our own city holds our smallest, sweetest moments — the cafés we keep going back to, the restaurants where they already know our order, the lazy mall evenings that somehow become my favourite dates. And let's be honest: Indore feeds us better than anywhere on earth. Home isn't a place, Nidhi. It's wherever you are (preferably with chaat).",
    video: "",
    photos: [
      { url: "/media/indore/indore-01-event-night.jpg", caption: "Dressed up, showing up — always together" },
      { url: "/media/indore/indore-02-holi-family.jpg", caption: "Holi with family — colours, chaos, and us" },
      { url: "/media/indore/indore-03-burger-king-queen.jpg", caption: "My Burger King queen" },
      { url: "/media/indore/indore-04-cafe-hug.jpg", caption: "Our favourite corner of every café" },
      { url: "/media/indore/indore-05-coffee-outdoors.jpg", caption: "Coffee and sunshine — her happy place" },
      { url: "/media/indore/indore-06-cafe-smile.jpg", caption: "That smile across the table" },
      { url: "/media/indore/indore-07-railway-track.jpg", caption: "Free spirit on the tracks" },
      { url: "/media/indore/indore-08-romantic-dinner.jpg", caption: "The hand-kiss that stopped time" },
    ],
    food: [],
    quiz: null,
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
      "My dearest Nidhi,\n\nEvery card before this one is a chapter of us — from that first drive in my Kwid to Cafe Yolo, to our roka at the gurudwara, to the night I proposed at The Eighteen, to the day you proposed right back at Cafe Oakaz, to our wedding on 11th July when you danced in my baarat, to our honeymoon in Bali where your dolphin dream came true, to every trip, every meal, every quiet moment that made us us.\n\nWe built Snowops together. We found our flat together. And now, on your birthday, I want you to know: you are the bravest, most brilliant person I've ever met. A lawyer, a computer scientist, a dreamer who chose to bet on us and build something beautiful together.\n\nSo here's my promise for this year and every year after:\n\nI promise to be your safest place when the world feels loud. I promise to cook with you, travel with you, laugh with you until our cheeks hurt. I promise to celebrate you — not just today, but on every ordinary Tuesday, every tired evening, every quiet morning.\n\nYou are not just my wife. You are my favourite person, my best adventure, my home.\n\nHappy birthday, Nidhi. This is just the beginning.\n— Forever and always yours.",
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
  { url: "/media/goa/goa-food-01-dinner.jpg", caption: "Beach-shack seafood — Goa" },
  { url: "/media/goa/goa-food-02-beachside-cafe.jpg", caption: "Beachside café daydreams — Goa" },
  { url: "/media/pachmarhi/pachmarhi-03-cafe-croissant.jpg", caption: "Croissants, coffee, and that smile — Pachmarhi" },
  { url: "/media/jaipur/jaipur-07-dinner-date.jpg", caption: "Dinner date — Jaipur" },
  { url: "/media/jaipur/jaipur-08-wine-appetizers.jpg", caption: "Wine and tiny bites — Jaipur" },
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
  { reason: "Your determination — lawyer, tech wizard, dreamer, all at once", icon: "⚡" },
  { reason: "How you kept your proposal a secret even when I kept changing plans", icon: "🎁" },
  { reason: "The way you managed our entire wedding and still looked like a dream", icon: "👰" },
  { reason: "How you light up at temples — Khatu Shyam, Salasar Balaji, Nathdwara", icon: "🙏" },
  { reason: "Your courage to start Snowops with me — co-founder of my whole life", icon: "🚀" },
  { reason: "The way you calmed down when I touched your head at Cafe Yolo — and I knew", icon: "🤍" },
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

/* ───────────────────────────── OCCASION CARDS (replaces MapView) ───────────────────────────── */
function OccasionCards({ answered, unlocked, onOpen }) {
  return (
    <div className="cards-view">
      <div className="collage-strip">
        <div className="collage-title">Our Story</div>
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
                    <img src={coverPhoto.url} alt={m.name} className="oc-cover-img" />
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

/* ───────────────────────────── SECRET SPARKLES ───────────────────────────── */
function SecretSparkles() {
  const [found, setFound] = useState(new Set());
  const [active, setActive] = useState(null);

  function reveal(idx) {
    if (found.has(idx)) return;
    setFound((s) => new Set(s).add(idx));
    setActive(idx);
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
          className={"secret-sparkle" + (found.has(idx) ? " ss-found" : "")}
          style={positions[idx % positions.length]}
          onClick={() => reveal(idx)}
          aria-label="Secret message"
        >
          ✦
        </button>
      ))}
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

/* ───────────────────────────── FOR YOU — REASONS I LOVE YOU ───────────────────────────── */
function ReasonsILoveYou() {
  const [revealed, setRevealed] = useState(3);
  const bottomRef = useRef(null);

  function showMore() {
    setRevealed((r) => Math.min(r + 5, REASONS_I_LOVE_YOU.length));
  }

  useEffect(() => {
    if (revealed > 3 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [revealed]);

  return (
    <div className="reasons">
      <div className="reasons-head">
        <div className="reasons-kicker">A birthday list, just for you</div>
        <h2 className="reasons-title">Reasons I Love You</h2>
        <p className="reasons-sub">I could write a thousand more, but let's start here.</p>
      </div>

      <div className="reasons-list">
        {REASONS_I_LOVE_YOU.slice(0, revealed).map((r, i) => (
          <div
            key={i}
            className="reason-card"
            style={{ animationDelay: (i % 5) * 0.12 + "s" }}
          >
            <span className="reason-num">{i + 1}</span>
            <span className="reason-icon">{r.icon}</span>
            <span className="reason-text">{r.reason}</span>
          </div>
        ))}
      </div>

      {revealed < REASONS_I_LOVE_YOU.length ? (
        <button className="reasons-more" onClick={showMore}>
          Show me more {"💛"}
        </button>
      ) : (
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

/* ───────────────────────────── PHOTO GALLERY ───────────────────────────── */
function Gallery({ photos, emptyText }) {
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [photos]);

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

/* ───────────────────────────── MEMORY MODAL ─────────────────────────────
   Reveal flow she'll experience:
     1) read the love note (envelope she taps open) + answer the quiz
     2) ✨ PHOTO REVEAL POPUP — a hero photo slides in as her reward (dismissable with ×)
     3) the trip's VIDEO plays (if you added one)
     4) the moment the video ends → the PHOTOS (Moments / Food) are revealed
   (Already-answered memories open fully unlocked when revisited.)                */
function MemoryModal({ mem, answered, wrongPicks, burst, unlocked, onClose, onAnswer }) {
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

        {mem.isFinale && mem.birthdayNote && (
          <div className="bday-note">
            <div className="bday-note-label">A birthday wish, handwritten from my heart</div>
            <div className="bday-note-paper">
              <p className="bday-note-text">{mem.birthdayNote}</p>
            </div>
          </div>
        )}

        {mem.isFinale && unlocked && mem.ps && <div className="ps">{mem.ps}</div>}
        {mem.isFinale && <div className="sign">Happy birthday, Nidhi. {"💛"}</div>}
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

  return opened ? (
    <div className="envelope-content" key="content">{children}</div>
  ) : (
    <button className="envelope-sealed" onClick={() => setOpened(true)}>
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
  const photo = (mem.photos || []).find((p) => p.url) || null;
  const hasVideo = !!mem.video;

  return (
    <div className="photo-reveal">
      <button className="pr-close" onClick={onClose} aria-label="Close">{"×"}</button>
      <div className="pr-inner">
        {photo && photo.url ? (
          <div className="pr-photo-wrap">
            <img className="pr-photo" src={photo.url} alt={photo.caption || ""} />
            <div className="pr-gradient" />
          </div>
        ) : (
          <div className="pr-placeholder">
            <span className="pr-ph-icon">{"✨"}</span>
          </div>
        )}
        <div className="pr-overlay">
          <div className="pr-trip-name">{mem.name}</div>
          <div className="pr-caption">{photo && photo.caption ? photo.caption : mem.teaser}</div>
          <div className="pr-heart-divider">{"♥"}</div>
          <div className="pr-unlocked-text">
            {hasVideo ? "Your video & photos are unlocked" : "Your photos are unlocked"}
          </div>
          <button className="pr-continue" onClick={onClose}>
            {hasVideo ? "Watch our video →" : "See our photos →"}
          </button>
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
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) setScrolled(true);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bday-letter">
      <div className="bday-letter-stars" />
      <div className="bday-letter-content" ref={contentRef}>
        <div className="bday-letter-inner">
          <div className="bday-letter-seal">{"💌"}</div>
          <div className="bday-letter-date">22nd June, 2026</div>
          <h2 className="bday-letter-greeting">My dearest Nidhi,</h2>
          <div className="bday-letter-body">
            <p>
              Before I show you everything I've made, I need you to know something.
            </p>
            <p>
              From the moment we met on 7th March 2022, my world changed colour.
              Every day since then has been a little more beautiful, a little more
              full, a little more ours. And now, on your birthday, I want to pause
              everything — just for a moment — and tell you what you mean to me.
            </p>
            <p>
              You are the reason I believe in forever. Not the forever in stories,
              but the real kind — the one made of small moments: your laugh over
              morning chai, your hand reaching for mine in a crowd, the way you
              look at a sunset like it's performing just for you.
            </p>
            <p>
              I've built you a little world tonight. Every card ahead is
              a memory of us. Every quiz is a question only you and I would know.
              And at the end of it all, there's something waiting just for you.
            </p>
            <p>
              So take your time. Explore. Remember. Smile.
            </p>
            <p>
              This is my love letter to you, Nidhi — not in words alone,
              but in every place we've ever been, every plate we've shared,
              every moment that made us <em>us</em>.
            </p>
            <p className="bday-letter-closing">
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
            Take me to our story {"→"}
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
          Before you open anything else, let me take you somewhere first —
          across every place our story has ever touched, every meal we've
          shared, all the way to where forever begins.
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
                Our Story
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
            />
          )}

          {lightbox && <Lightbox item={lightbox} onClose={() => setLightbox(null)} />}

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

/* ——— VIEW BAR (Our Story / For You / Our Feast) ——— */
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
`;
