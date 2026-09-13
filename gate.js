/* ============================================================
   GATE.JS — the pre-show tease + a couple of fun extras.
   Runs before birthday.js. Nothing here touches the original film.

   ✏️  EVERYTHING YOU MIGHT WANT TO EDIT IS RIGHT HERE AT THE TOP.
   ============================================================ */

// --- 1) THE QUIZ -------------------------------------------------
// Add / remove / edit questions freely. `correct` is the 0-based
// index of the right option. Keep at least 1 question.
const QUIZ = [
  {
    q: "What's today, really?",
    options: ["A random Tuesday", "Kusum's birthday", "April Fools' Day", "National Cat Day"],
    correct: 1,
  },
  {
    q: "Who made this for you?",
    options: ["A random stranger", "A confused robot", "Someone who thinks about you", "Google"],
    correct: 2,
  },
  {
    q: "Ready for your actual gift?",
    options: ["Not really", "Maybe later", "Yes! Show me!", "Ask me tomorrow"],
    correct: 2,
  },
];

// Shown (at random) under a wrong answer. Add as many as you like.
const WRONG_LINES = [
  "hmm, not quite 😏",
  "try again, you've got this",
  "close! …okay not that close",
  "nope — one more shot",
];

// --- 2) THE SECRET HEART -----------------------------------------
// Tap the little heart (bottom-right) this many times to reveal it.
const SECRET_TAPS_NEEDED = 5;
const SECRET_MESSAGE =
  "If you're reading this, it means you actually tapped a tiny heart five times just to see what was hiding under it. That's exactly the kind of curious, wonderful thing about you. Happy Birthday, Kusum. 💗";

// --- 3) BACKGROUND MUSIC ------------------------------------------
// Drop an mp3 at public/audio/bday-song.mp3 (any filename you like,
// just update the line below to match) and it will autoplay quietly
// right after the quiz is solved. If the file isn't there, the site
// just stays silent — nothing breaks.
const MUSIC_SRC = `${import.meta.env.BASE_URL}audio/bday-song.mp3`;

/* ============================================================
   Everything below this line is just wiring — no need to touch it.
   ============================================================ */

const $ = (id) => document.getElementById(id);

const gate = $('gate');
const gateLoading = $('gateLoading');
const gateError = $('gateError');
const gateQuiz = $('gateQuiz');
const gateBarFill = $('gateBarFill');
const gateQuestion = $('gateQuestion');
const gateOptions = $('gateOptions');
const gateFeedback = $('gateFeedback');
const gateProgress = $('gateProgress');
const gatePanel = $('gatePanel');

const secretHeart = $('secretHeart');
const secretModal = $('secretModal');
const secretModalText = $('secretModalText');
const secretModalClose = $('secretModalClose');

const bgMusic = $('bgMusic');
const muteBtn = $('muteBtn');

function showPhase(el) {
  [gateLoading, gateError, gateQuiz].forEach((p) => { p.hidden = p !== el; });
}

function shakePanel() {
  gatePanel.classList.remove('shake');
  // reflow so the animation can restart
  void gatePanel.offsetWidth;
  gatePanel.classList.add('shake');
}

/* ---------- phase 1 + 2: fake loading, then a fake glitch --------- */
function runLoadingPrank() {
  showPhase(gateLoading);
  let pct = 0;
  const tick = setInterval(() => {
    pct = Math.min(100, pct + (6 + Math.random() * 10));
    gateBarFill.style.width = pct + '%';
    if (pct >= 100) clearInterval(tick);
  }, 140);

  setTimeout(() => {
    clearInterval(tick);
    showPhase(gateError);
    shakePanel();
  }, 1900);

  setTimeout(() => {
    startQuiz();
  }, 3300);
}

/* ---------- phase 3: the quiz --------------------------------- */
let qIndex = 0;

function startQuiz() {
  qIndex = 0;
  showPhase(gateQuiz);
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
        unlock();
      }
    }, 450);
  } else {
    btn.classList.add('is-wrong');
    gateFeedback.textContent = WRONG_LINES[(Math.random() * WRONG_LINES.length) | 0];
    shakePanel();
    setTimeout(() => {
      allBtns.forEach((b) => {
        b.disabled = false;
        b.classList.remove('is-wrong');
      });
    }, 500);
  }
}

/* ---------- unlock: reveal the real film + start music --------- */
function unlock() {
  gate.classList.add('is-hidden');
  document.body.style.overflow = '';
  setTimeout(() => { gate.style.display = 'none'; }, 650);

  // Try to start music — this runs inside the click handler chain,
  // so it counts as a user gesture and browsers will allow it.
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
