/* ============================================================
   GATE.JS — the pre-show tease + a couple of fun extras.
   Runs before birthday.js. Nothing here touches the original film
   (bow & arrow → heart → tree). That entire sequence is untouched.

   ✏️  EVERYTHING YOU MIGHT WANT TO EDIT IS RIGHT HERE AT THE TOP.
   ============================================================ */

// --- 0) SECURITY PASSWORD -------------------------------------------
// Checked only in this file — never shown on screen. (Note: since this
// runs in the browser, anyone who opens dev tools and reads the source
// could technically find it — this is a fun lock, not real security.)
const SECURITY_PASSWORD = "karttik.0007";
const SECURITY_WRONG_TAUNTS = [
  "nahi, wo sahi password nahi hai 🔒 phir try karo",
  "galat! ek aur chance 😏",
  "nope, dobara socho 🤔",
  "aacha try tha, par nahi 😂",
];

// --- 1) THE QUIZ (Q1–Q3) ------------------------------------------
// Each question has options + the 0-based index of the correct one.
// `taunts[i]` is a LIST of possible lines for wrong option i — one is
// picked at random every time (never the same one twice in a row for
// that option), so wrong clicks always feel fresh. The entry at
// `correct` is never used.
const QUIZ = [
  {
    q: "What's today, really?",
    options: [
      "a random tuesday",
      "kusum's birthday",
      "penguin's 🐧birthday",
      "sundar ladki ka birthday",
    ],
    correct: 2,
    taunts: [
      [
        "arey wah, kisi normal Tuesday ke liye itni mehnat karta kya main? 🙄 phir try kar",
        "Tuesday itna special kab se ho gaya bhala 😂 phir try karo",
        "agar ye sahi hota toh main itni mehnat kyu karta ek Tuesday ke liye 😭",
        "Tuesday? bhai Tuesday ko toh khud pata nahi hoga ki wo itna important hai 😂",
        "arre tuesday walo ko toh apna naam bhi yaad nahi rehta 😭 phir try karo",
        "itna basic answer dekh ke mera dil toot gaya 💔😂 ek aur try",
      ],
      [
        "achha nice guess, par nahi — ek aur chance 😏",
        "close tha... ek dum bhi nahi actually 😂 phir try karo",
        "nahi bhai, calendar dobara check karo 📅😜",
        "nice try, khud ko hi guess kar liya 😂 par galat hai",
        "arre thoda toh dimag lagao, aaj tumhara birthday nahi hai silly 😜",
        "cute guess tha, par bilkul galat 😂",
      ],
      [], // correct — unused
      [
        "haha nice try, par aaj sirf ek hi sundar cheez ka birthday hai... aur uska naam Kusum hai, ye wala nahi 😏",
        "flattery will get you nowhere 😂 galat jawab hai",
        "sweet answer, galat answer 😂 ek aur try karo",
        "haha smooth try, par yeh flattery kaam nahi aayegi 😏",
        "sweet talk se quiz pass nahi hota, dobara socho 😂",
        "nice compliment, wrong answer 💀😂",
      ],
    ],
  },
  {
    q: "Who made this for you?",
    options: [
      "a random stranger",
      "kartik",
      "jaipur ka jana mana berozgaar",
      "someone who cares about you 😒",
    ],
    correct: 3,
    taunts: [
      [
        "stranger itni mehnat kyu karega bhala? 🤨 phir try karo",
        "stranger ko itna time kaha hota hai yaar 😂",
        "random stranger, ha bilkul... jaise wo tumhare liye website banayega 😆",
        "stranger ko itna fursat kaha milta hai bhai 😂",
        "arre stranger hota toh mujhe tumhara naam bhi nahi pata hota 😭",
        "yeh answer dekh ke lagta hai tum bhi kisi stranger jaisa soch rahi ho 😂",
      ],
      [
        "haha nahi, wo bechara khud confuse rehta hai 😂 ek aur try",
        "kartik? uska khud ka schedule set nahi hai 😂",
        "nahi yaar, kartik ko toh khud gift chahiye kisi se 😜",
        "kartik? uska toh khud ka WiFi off rehta hai emotionally 😂",
        "nahi yaar, wo bandaa apna hi gift bhool jaata hai 😭",
        "kartik itni patience kaha se laayega bhala 😜",
      ],
      [
        "arey wo toh already busy hai timepass karne me 😂 phir try karo",
        "berozgaar log itni creativity kaha se laayenge 😂",
        "nahi bhai, uske paas toh WiFi bhi udhaar ka hai 😭",
        "berozgaar hai, par itna creative bhi nahi 😂",
        "uska toh apna hi kaam time pe nahi hota 😭",
        "nahi bhai, wo toh khud confuse baitha hai apni zindagi mein 😂",
      ],
      [], // correct — unused
    ],
  },
  {
    q: "Ready for your actual gift?",
    options: ["not really", "haa jaldi se dikha"],
    correct: 1,
    taunts: [
      [
        "achha? theek hai, thoda aur wait karwate hai tumhe 😌 (bas mazak, wapas click kar)",
        "arre itna bhi patience nahi? 😜 phir se try karo",
        "ok fine, tum abhi ready nahi ho... jhoothi kahin ki 😂 phir try karo",
        "arre patience thoda kam hai kya tumhara 😂",
        "not really? sach me? phir kyu click kar rahi ho baar baar 😜",
        "drama zyada mat karo, phir se try karo 😂",
      ],
      [], // correct — unused
    ],
  },
];

// --- 2) THE NAME SUB-QUESTION --------------------------------------
// Shown right after Q3's correct answer, on the same page. No
// options — she just types it in. Matching is case-insensitive and
// ignores extra spaces.
const NAME_QUESTION = "What was the first name I gave you??";
const NAME_ANSWER = "mathri";
const NAME_WRONG_TAUNT = "nahi, wo naam nahi tha… ek aur try karo 😏";

// --- 3) Q4 — the runaway "No" button --------------------------------
// If the cursor (or a touch) gets within this many pixels of the
// "No" button, it teleports somewhere else on screen.
const Q4_REPEL_DISTANCE = 90;
const Q4_NO_TAUNTS = [
  "nahi bhaagne dungi... i mean, 'No' bolne nahi dunga 😏",
  "arre pakadna toh padega pehle 😜",
  "'No' aaj chhutti pe hai 😂",
  "itni jaldi haar mat maano, thoda aur try karo 😏",
];

// --- 4) Q5 — "cuz I send u reel everyday" ---------------------------
// If she taps "Yes", this image shows for a few seconds, then Q5 is
// asked again — on repeat, for as long as she keeps saying "Yes".
// Saying "No" moves straight on to the real film.
const Q5_IMAGE_SRC = `${import.meta.env.BASE_URL}images/sorry-flower.jpg`;
const Q5_IMAGE_SECONDS = 7;

// --- 5) THE SECRET HEART -----------------------------------------
// Tap the little heart (bottom-right) this many times to reveal it.
const SECRET_TAPS_NEEDED = 5;
const SECRET_MESSAGE =
  "If you're reading this, it means you actually tapped a tiny heart five times just to see what was hiding under it. That's exactly the kind of curious, wonderful thing about you. Happy Birthday, Kusum. 💗";

// --- 6) BACKGROUND MUSIC ------------------------------------------
// Drop an mp3 at public/audio/bday-song.mp3 (any filename you like,
// just update the line below to match) and it will autoplay quietly
// right after the final question is solved. If the file isn't there,
// the site just stays silent — nothing breaks.
const MUSIC_SRC = `${import.meta.env.BASE_URL}audio/bday-song.mp3`;

/* ============================================================
   Everything below this line is just wiring — no need to touch it.
   ============================================================ */

const $ = (id) => document.getElementById(id);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

// Anti-repeat random picker: never returns the same string twice in a
// row for the same `key`.
const _lastPick = {};
function pickNoRepeat(key, pool) {
  if (!pool || !pool.length) return null;
  if (pool.length === 1) { _lastPick[key] = pool[0]; return pool[0]; }
  let choice;
  do { choice = pick(pool); } while (choice === _lastPick[key]);
  _lastPick[key] = choice;
  return choice;
}

const gate = $('gate');
const gateSecurity = $('gateSecurity');
const gateMirror = $('gateMirror');
const gateShardLayer = $('gateShardLayer');
const gateSecurityInput = $('gateSecurityInput');
const gateSecuritySubmit = $('gateSecuritySubmit');
const gateSecurityFeedback = $('gateSecurityFeedback');

const gateBalloons = $('gateBalloons');
const gateRibbon = $('gateRibbon');
const gatePenguin = $('gatePenguin');
const gatePenguinBubble = $('gatePenguinBubble');

const gateLoading = $('gateLoading');
const gatePage2 = $('gatePage2');
const gatePercent = $('gatePercent');
const gateQuizBlock = $('gateQuizBlock');
const gateQuestion = $('gateQuestion');
const gateOptions = $('gateOptions');
const gateFeedback = $('gateFeedback');
const gateProgress = $('gateProgress');
const gatePanel = $('gatePanel');

const gateNameBlock = $('gateNameBlock');
const gateSubQ = $('gateSubQ');
const gateNameInput = $('gateNameInput');
const gateNameSubmit = $('gateNameSubmit');
const gateNameFeedback = $('gateNameFeedback');

const gateQ4Block = $('gateQ4Block');
const gateQ4Yes = $('gateQ4Yes');
const gateQ4No = $('gateQ4No');
const gateQ4Feedback = $('gateQ4Feedback');

const gateQ5Block = $('gateQ5Block');
const gateQ5Yes = $('gateQ5Yes');
const gateQ5No = $('gateQ5No');

const imgPopup = $('imgPopup');
const imgPopupImg = $('imgPopupImg');

const gateThanks = $('gateThanks');
const gateThanksPercent = $('gateThanksPercent');

const secretHeart = $('secretHeart');
const secretModal = $('secretModal');
const secretModalText = $('secretModalText');
const secretModalClose = $('secretModalClose');

const bgMusic = $('bgMusic');
const muteBtn = $('muteBtn');

const ALL_PHASES = [gateSecurity, gateLoading, gatePage2, gateThanks];
function showPhase(el) {
  ALL_PHASES.forEach((p) => { p.hidden = p !== el; });
}

function shakePanel() {
  gatePanel.classList.remove('shake');
  void gatePanel.offsetWidth; // reflow so the animation can restart
  gatePanel.classList.add('shake');
}

function shakeMirror() {
  gateMirror.classList.remove('shake');
  void gateMirror.offsetWidth;
  gateMirror.classList.add('shake');
}

/* ---------- security page decorations: balloons/ribbon/penguin --- */
const DECOR_COLORS = ['#ff5f8f', '#ffb648', '#5fc9ff', '#ff8fd0', '#ffd25f', '#8fd7ff'];
let balloonWaveTimer = null;
let penguinFallTimer = null;

function buildRibbon() {
  if (!gateRibbon) return;
  const words = ['HAPPY', 'BIRTHDAY'];
  gateRibbon.innerHTML = '';
  let idx = 0;
  words.forEach((word) => {
    const wordWrap = document.createElement('div');
    wordWrap.className = 'gate__ribbonWord';
    [...word].forEach((ch) => {
      const el = document.createElement('span');
      el.className = 'gate__ribbonLetter';
      el.textContent = ch;
      el.style.setProperty('--i', idx);
      el.style.setProperty('--rot', (idx % 2 === 0 ? -4 : 3) + 'deg');
      el.style.background = DECOR_COLORS[idx % DECOR_COLORS.length];
      wordWrap.appendChild(el);
      idx++;
    });
    gateRibbon.appendChild(wordWrap);
  });
}

function spawnBalloon(zone) {
  if (!gateBalloons) return;
  const b = document.createElement('div');
  b.className = 'gate__balloon';
  b.style.background = pick(DECOR_COLORS);
  let leftPct;
  if (zone === 'left') leftPct = -4 + Math.random() * 16;
  else if (zone === 'right') leftPct = 88 + Math.random() * 16;
  else leftPct = 40 + Math.random() * 20; // rises up right behind the box
  b.style.left = leftPct + '%';
  const dur = 8 + Math.random() * 5;
  const drift = (Math.random() - 0.5) * 120;
  gateBalloons.appendChild(b);
  requestAnimationFrame(() => {
    b.style.transition = `transform ${dur}s linear, opacity 1.2s ease ${dur - 1.2}s`;
    b.style.transform = `translate(${drift}px, -135vh)`;
    b.style.opacity = '0';
  });
  setTimeout(() => { b.remove(); }, (dur + 0.5) * 1000);
}

function runBalloonLoop() {
  const pattern = [4, 3, 5, 3, 4];
  let p = 0;
  const zones = ['left', 'right', 'center'];
  function wave() {
    const count = pattern[p % pattern.length];
    p++;
    for (let i = 0; i < count; i++) {
      const zone = pick(zones);
      setTimeout(() => spawnBalloon(zone), i * 150);
    }
    balloonWaveTimer = setTimeout(wave, 1300 + Math.random() * 600);
  }
  wave();
}

function triggerPenguinFall() {
  if (!gatePenguin) return;
  gatePenguin.classList.add('is-falling');
  setTimeout(() => { gatePenguinBubble.classList.add('is-show'); }, 500);
  setTimeout(() => { gatePenguinBubble.classList.remove('is-show'); }, 1900);
  setTimeout(() => { gatePenguin.classList.remove('is-falling'); }, 1800);
}

function runPenguinLoop() {
  penguinFallTimer = setTimeout(function loop() {
    triggerPenguinFall();
    penguinFallTimer = setTimeout(loop, 11000 + Math.random() * 5000);
  }, 6000 + Math.random() * 3000);
}

function stopSecurityDecorations() {
  if (balloonWaveTimer) clearTimeout(balloonWaveTimer);
  if (penguinFallTimer) clearTimeout(penguinFallTimer);
  if (gateBalloons) gateBalloons.innerHTML = '';
}

/* ---------- phase 0: security / password ------------------------ */
function checkSecurityPassword() {
  const val = (gateSecurityInput.value || '').trim();
  if (val === SECURITY_PASSWORD) {
    gateSecurityFeedback.textContent = '';
    shatterMirror();
  } else {
    gateSecurityFeedback.textContent = pickNoRepeat('security', SECURITY_WRONG_TAUNTS);
    shakeMirror();
  }
}
gateSecuritySubmit?.addEventListener('click', checkSecurityPassword);
gateSecurityInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkSecurityPassword();
});

function shatterMirror() {
  stopSecurityDecorations();

  // fade the real content out first so it doesn't linger behind the shards
  [...gateMirror.children].forEach((child) => {
    if (child !== gateShardLayer) child.style.opacity = '0';
  });

  // the whole screen breaks apart, not just the little card — tile the
  // full viewport with pieces that share one continuous background so
  // they line up perfectly before flying apart.
  const w = window.innerWidth, h = window.innerHeight;
  const cols = 7, rows = 9;
  const cw = w / cols, ch = h / rows;
  const gateBg = 'radial-gradient(120% 120% at 50% 20%, #2a1420 0%, #150910 60%, #0c060a 100%)';
  gateShardLayer.innerHTML = '';

  const shards = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const shard = document.createElement('div');
      shard.className = 'gate__shard';
      shard.style.left = (c * cw) + 'px';
      shard.style.top = (r * ch) + 'px';
      shard.style.width = cw + 'px';
      shard.style.height = ch + 'px';
      // background-attachment:fixed keeps the gradient anchored to the
      // viewport, so every tile shows the exact slice it should — the
      // pieces read as one broken image, not a repeated pattern.
      shard.style.backgroundImage = gateBg;
      shard.style.backgroundAttachment = 'fixed';
      gateShardLayer.appendChild(shard);
      shards.push(shard);
    }
  }
  void gateShardLayer.offsetWidth; // reflow so transitions actually animate

  shards.forEach((shard) => {
    const dx = (Math.random() - 0.5) * 1100;
    const dy = (Math.random() - 0.15) * 1100;
    const rot = (Math.random() - 0.5) * 720;
    shard.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
    shard.style.opacity = '0';
  });

  setTimeout(() => {
    showPhase(gateLoading);
    runLoadingPrank();
  }, 850);
}

/* ---------- phase 1: big loader + live percentage --------------- */
function runLoadingPrank() {
  let pct = 0;
  gatePercent.textContent = '0%';
  const tick = setInterval(() => {
    pct = Math.min(100, pct + (5 + Math.random() * 9));
    gatePercent.textContent = Math.floor(pct) + '%';
    if (pct >= 100) {
      clearInterval(tick);
      gatePercent.textContent = '100%';
      setTimeout(() => {
        showPhase(gatePage2);
        shakePanel();
        startQuiz();
      }, 3000);
    }
  }, 140);
}

/* ---------- phase 2: the quiz (Q1–Q3) ---------------------------- */
let qIndex = 0;

function startQuiz() {
  qIndex = 0;
  gateNameBlock.hidden = true;
  gateQ4Block.hidden = true;
  gateQ5Block.hidden = true;
  gateQuizBlock.hidden = false;
  renderQuestion();
}

function renderQuestion() {
  const item = QUIZ[qIndex];
  gateQuestion.textContent = item.q;
  gateFeedback.textContent = '';
  gateProgress.textContent = `${qIndex + 1} / ${QUIZ.length}`;
  gateOptions.innerHTML = '';

  item.options.forEach((label, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gate__opt';
    btn.textContent = label;
    btn.addEventListener('click', () => handleAnswer(i, btn));
    gateOptions.appendChild(btn);
  });
}

function handleAnswer(i, btn) {
  const item = QUIZ[qIndex];
  const allBtns = [...gateOptions.querySelectorAll('.gate__opt')];
  allBtns.forEach((b) => (b.disabled = true));

  if (i === item.correct) {
    btn.classList.add('is-correct');
    gateFeedback.textContent = '';
    setTimeout(() => {
      qIndex++;
      if (qIndex < QUIZ.length) {
        renderQuestion();
      } else {
        showNameStep();
      }
    }, 450);
  } else {
    btn.classList.add('is-wrong');
    const pool = item.taunts[i];
    gateFeedback.textContent = pickNoRepeat(`q${qIndex}-${i}`, pool) || "nahi, wo sahi nahi tha 😏 phir try karo";
    shakePanel();
    setTimeout(() => {
      allBtns.forEach((b) => {
        b.disabled = false;
        b.classList.remove('is-wrong');
      });
    }, 600);
  }
}

/* ---------- the hidden name sub-question ------------------------ */
function showNameStep() {
  gateQuizBlock.hidden = true;
  gateNameBlock.hidden = false;
  gateSubQ.textContent = NAME_QUESTION;
  gateNameInput.value = '';
  gateNameFeedback.textContent = '';
  gateNameInput.focus();
}

function checkNameAnswer() {
  const val = (gateNameInput.value || '').trim().toLowerCase();
  if (val === NAME_ANSWER.toLowerCase()) {
    gateNameFeedback.textContent = '';
    showQ4();
  } else {
    gateNameFeedback.textContent = NAME_WRONG_TAUNT;
    shakePanel();
  }
}

gateNameSubmit?.addEventListener('click', checkNameAnswer);
gateNameInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkNameAnswer();
});

/* ---------- Q4: "wanna go out with me" — the runaway No --------- */
let q4Active = false;

function showQ4() {
  gateNameBlock.hidden = true;
  gateQ4Block.hidden = false;
  gateQ4Feedback.textContent = '';
  gateQ4No.style.position = '';
  gateQ4No.style.left = '';
  gateQ4No.style.top = '';
  gateQ4No.style.margin = '';
  q4Active = true;
  document.addEventListener('mousemove', onQ4PointerMove);
  document.addEventListener('touchmove', onQ4TouchMove, { passive: true });
}

function onQ4PointerMove(e) {
  if (!q4Active) return;
  moveNoIfClose(e.clientX, e.clientY);
}
function onQ4TouchMove(e) {
  if (!q4Active) return;
  const t = e.touches && e.touches[0];
  if (t) moveNoIfClose(t.clientX, t.clientY);
}

function moveNoIfClose(x, y) {
  const rect = gateQ4No.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dist = Math.hypot(x - cx, y - cy);
  if (dist < Q4_REPEL_DISTANCE) {
    const w = rect.width, h = rect.height;
    const maxX = Math.max(12, window.innerWidth - w - 12);
    const maxY = Math.max(12, window.innerHeight - h - 12);
    let nx, ny, tries = 0;
    do {
      nx = 12 + Math.random() * (maxX - 12);
      ny = 12 + Math.random() * (maxY - 12);
      tries++;
    } while (Math.hypot((nx + w / 2) - x, (ny + h / 2) - y) < Q4_REPEL_DISTANCE * 1.6 && tries < 12);

    gateQ4No.style.position = 'fixed';
    gateQ4No.style.margin = '0';
    gateQ4No.style.left = nx + 'px';
    gateQ4No.style.top = ny + 'px';
    gateQ4No.style.zIndex = '1005';
  }
}

function stopQ4Repel() {
  q4Active = false;
  document.removeEventListener('mousemove', onQ4PointerMove);
  document.removeEventListener('touchmove', onQ4TouchMove);
}

gateQ4Yes?.addEventListener('click', () => {
  stopQ4Repel();
  gateQ4Block.hidden = true;
  showQ5();
});

gateQ4No?.addEventListener('click', () => {
  // it shouldn't really be reachable, but just in case — tease + move again
  gateQ4Feedback.textContent = pickNoRepeat('q4no', Q4_NO_TAUNTS);
  shakePanel();
  const rect = gateQ4No.getBoundingClientRect();
  moveNoIfClose(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

/* ---------- Q5: "reel everyday" — yes loops back with an image --- */
function showQ5() {
  gateQ5Block.hidden = false;
}

gateQ5No?.addEventListener('click', () => {
  gateQ5Block.hidden = true;
  showThanks();
});

gateQ5Yes?.addEventListener('click', () => {
  gateQ5Block.hidden = true;
  imgPopupImg.src = Q5_IMAGE_SRC;
  imgPopup.hidden = false;
  setTimeout(() => {
    imgPopup.hidden = true;
    showQ5(); // ask again — loops until she picks "No"
  }, Q5_IMAGE_SECONDS * 1000);
});

/* ---------- final "thank you" pause before the real film -------- */
function showThanks() {
  showPhase(gateThanks);
  const totalMs = 5000, stepMs = 140;
  const totalSteps = totalMs / stepMs;
  let step = 0;
  gateThanksPercent.textContent = '0%';
  const tick = setInterval(() => {
    step++;
    const pct = Math.min(100, (step / totalSteps) * 100);
    gateThanksPercent.textContent = Math.floor(pct) + '%';
    if (step >= totalSteps) {
      clearInterval(tick);
      gateThanksPercent.textContent = '100%';
      setTimeout(unlock, 200);
    }
  }, stepMs);
}

/* ---------- unlock: reveal the real film + start music --------- */
function unlock() {
  gate.classList.add('is-hidden');
  document.body.style.overflow = '';
  setTimeout(() => { gate.style.display = 'none'; }, 650);

  // Try to start music — this runs inside a click handler chain, so
  // it counts as a user gesture and browsers will allow it.
  if (bgMusic && MUSIC_SRC) {
    bgMusic.src = MUSIC_SRC;
    bgMusic.volume = 0.55;
    bgMusic.play()
      .then(() => { muteBtn.hidden = false; })
      .catch(() => { /* no audio file yet, or autoplay blocked — fine either way */ });
  }
}

/* ---------- secret heart -------------------------------------- */
let secretTaps = 0;
secretHeart?.addEventListener('click', () => {
  secretTaps++;
  if (secretTaps >= SECRET_TAPS_NEEDED) {
    secretTaps = 0;
    secretModalText.textContent = SECRET_MESSAGE;
    secretModal.hidden = false;
  }
});
secretModalClose?.addEventListener('click', () => { secretModal.hidden = true; });
secretModal?.addEventListener('click', (e) => {
  if (e.target === secretModal) secretModal.hidden = true;
});

/* ---------- mute toggle ----------------------------------------- */
muteBtn?.addEventListener('click', () => {
  if (!bgMusic) return;
  bgMusic.muted = !bgMusic.muted;
  muteBtn.textContent = bgMusic.muted ? '🔇' : '🔊';
});

/* ---------- go: start on the security phase ---------------------- */
document.body.style.overflow = 'hidden';
buildRibbon();
runBalloonLoop();
runPenguinLoop();
showPhase(gateSecurity);
