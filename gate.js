/* ============================================================
   GATE.JS — the pre-show tease + a couple of fun extras.
   Runs before birthday.js. Nothing here touches the original film.

   ✏️  EVERYTHING YOU MIGHT WANT TO EDIT IS RIGHT HERE AT THE TOP.
   ============================================================ */

// --- 1) THE QUIZ -------------------------------------------------
// Each question has options + the 0-based index of the correct one.
// `taunts` gives a custom line for every WRONG option (same length
// as options; the entry at `correct` is never used).
const QUIZ = [
  {
    q: "What's today, really?",
    options: [
      "a random tuesday",
      "kusum's birthday",
      "kartik ki behen ka birthday",
      "penguin's 🐧birthday",
    ],
    correct: 2,
    taunts: [
      "arey wah, kisi normal Tuesday ke liye itni mehnat karta kya main? 🙄 phir try kar",
      "achha nice guess, par nahi — ek aur chance 😏",
      "",
      "penguin ka birthday? tum sach me itna sochti ho kya 🐧😂 phir se try karo",
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
      "stranger itni mehnat kyu karega bhala? 🤨 phir try karo",
      "haha nahi, wo bechara khud confuse rehta hai 😂 ek aur try",
      "arey wo toh already busy hai timepass karne me 😂 phir try karo",
      "",
    ],
  },
  {
    q: "Ready for your actual gift?",
    options: ["not really", "haa jaldi se dikha"],
    correct: 1,
    taunts: [
      "achha? theek hai, thoda aur wait karwate hai tumhe 😌 (bas mazak, wapas click kar)",
      "",
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

// --- 3) THE SECRET HEART -----------------------------------------
// Tap the little heart (bottom-right) this many times to reveal it.
const SECRET_TAPS_NEEDED = 5;
const SECRET_MESSAGE =
  "If you're reading this, it means you actually tapped a tiny heart five times just to see what was hiding under it. That's exactly the kind of curious, wonderful thing about you. Happy Birthday, Kusum. 💗";

// --- 4) BACKGROUND MUSIC ------------------------------------------
// Drop an mp3 at public/audio/bday-song.mp3 (any filename you like,
// just update the line below to match) and it will autoplay quietly
// right after the name question is solved. If the file isn't there,
// the site just stays silent — nothing breaks.
const MUSIC_SRC = `${import.meta.env.BASE_URL}audio/bday-song.mp3`;

/* ============================================================
   Everything below this line is just wiring — no need to touch it.
   ============================================================ */

const $ = (id) => document.getElementById(id);

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
      }, 500);
    }
  }, 140);
}

/* ---------- phase 2: the quiz ----------------------------------- */
let qIndex = 0;

function startQuiz() {
  qIndex = 0;
  gateNameBlock.hidden = true;
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
    gateFeedback.textContent = item.taunts[i] || "nahi, wo sahi nahi tha 😏 phir try karo";
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
    unlock();
  } else {
    gateNameFeedback.textContent = NAME_WRONG_TAUNT;
    shakePanel();
  }
}

gateNameSubmit?.addEventListener('click', checkNameAnswer);
gateNameInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkNameAnswer();
});

/* ---------- unlock: reveal the real film + start music --------- */
function unlock() {
  gate.classList.add('is-hidden');
  document.body.style.overflow = '';
  setTimeout(() => { gate.style.display = 'none'; }, 650);

  // Try to start music — this runs inside the click/keydown handler
  // chain, so it counts as a user gesture and browsers will allow it.
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
