/* ============================================================
   GATE.JS — the pre-show tease + a couple of fun extras.
   Runs before birthday.js. Nothing here touches the original film
   (bow & arrow → heart → tree). That entire sequence is untouched.

   ✏️  EVERYTHING YOU MIGHT WANT TO EDIT IS RIGHT HERE AT THE TOP.
   ============================================================ */

// --- 1) THE QUIZ (Q1–Q3) ------------------------------------------
// Each question has options + the 0-based index of the correct one.
// `taunts[i]` is a LIST of possible lines for wrong option i — one is
// picked at random every time, so repeated wrong clicks don't repeat
// the same joke. The entry at `correct` is never used.
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
      ],
      [
        "achha nice guess, par nahi — ek aur chance 😏",
        "close tha... ek dum bhi nahi actually 😂 phir try karo",
        "nahi bhai, calendar dobara check karo 📅😜",
      ],
      [], // correct — unused
      [
        "haha nice try, par aaj sirf ek hi sundar cheez ka birthday hai... aur uska naam Kusum hai, ye wala nahi 😏",
        "flattery will get you nowhere 😂 galat jawab hai",
        "sweet answer, galat answer 😂 ek aur try karo",
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
      ],
      [
        "haha nahi, wo bechara khud confuse rehta hai 😂 ek aur try",
        "kartik? uska khud ka schedule set nahi hai 😂",
        "nahi yaar, kartik ko toh khud gift chahiye kisi se 😜",
      ],
      [
        "arey wo toh already busy hai timepass karne me 😂 phir try karo",
        "berozgaar log itni creativity kaha se laayenge 😂",
        "nahi bhai, uske paas toh WiFi bhi udhaar ka hai 😭",
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

// --- 4) Q5 — the "are you angry" image ------------------------------
// Shown only if she taps "Yes" here, for exactly this many seconds.
const Q5_IMAGE_SRC = `${import.meta.env.BASE_URL}images/angry-guilt.jpg`;
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

const gate = $('gate');
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

const secretHeart = $('secretHeart');
const secretModal = $('secretModal');
const secretModalText = $('secretModalText');
const secretModalClose = $('secretModalClose');

const bgMusic = $('bgMusic');
const muteBtn = $('muteBtn');

function showPhase(el) {
  [gateLoading, gatePage2].forEach((p) => { p.hidden = p !== el; });
}

function shakePanel() {
  gatePanel.classList.remove('shake');
  void gatePanel.offsetWidth; // reflow so the animation can restart
  gatePanel.classList.add('shake');
}

/* ---------- phase 1: big loader + live percentage --------------- */
function runLoadingPrank() {
  showPhase(gateLoading);
  let pct = 0;
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
    gateFeedback.textContent = (pool && pool.length) ? pick(pool) : "nahi, wo sahi nahi tha 😏 phir try karo";
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
const q4NoTaunts = [
  "nahi bhaagne dungi... i mean, 'No' bolne nahi dunga 😏",
  "arre pakadna toh padega pehle 😜",
  "'No' aaj chhutti pe hai 😂",
  "itni jaldi haar mat maano, thoda aur try karo 😏",
];

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
  gateQ4Feedback.textContent = pick(q4NoTaunts);
  shakePanel();
  const rect = gateQ4No.getBoundingClientRect();
  moveNoIfClose(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

/* ---------- Q5: "are you angry" — yes shows a 7s image ----------- */
function showQ5() {
  gateQ5Block.hidden = false;
}

gateQ5No?.addEventListener('click', () => {
  gateQ5Block.hidden = true;
  unlock();
});

gateQ5Yes?.addEventListener('click', () => {
  gateQ5Block.hidden = true;
  imgPopupImg.src = Q5_IMAGE_SRC;
  imgPopup.hidden = false;
  setTimeout(() => {
    imgPopup.hidden = true;
    unlock();
  }, Q5_IMAGE_SECONDS * 1000);
});

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

/* ---------- go ---------------------------------------------------- */
document.body.style.overflow = 'hidden';
runLoadingPrank();
