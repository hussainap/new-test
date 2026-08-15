/* =====================================================================
   The Night We Became a Memory — script.js
   Built incrementally, scene by scene. So far: Scene 0 (intro), Scene 1
   (constellation). More scenes get added here as we build them.
   ===================================================================== */

const scenes = ['intro', 'constellation', 'book', 'universe', 'garden', 'letter', 'time', 'corner'];
let currentSceneIndex = 0;

/* NOTE: scenes are only ever faded via opacity — no transform is ever put
   on a .scene element or any of its ancestors. In the last project, a
   transform on a scene ancestor silently hijacked position:fixed children's
   containing block and caused a bad centering bug. Keeping transforms
   local to individual scene content (never on the scene wrapper itself)
   avoids that entirely. */
function showScene(name) {
  const next = document.getElementById('scene-' + name);
  if (!next) return;
  const current = document.querySelector('.scene.active');
  if (current === next) return;
  currentSceneIndex = scenes.indexOf(name);

  if (current) {
    current.classList.remove('active');
    current.classList.add('leaving');
    setTimeout(() => { current.classList.remove('leaving'); }, 1650);
  }

  next.classList.add('entering');
  void next.offsetWidth;
  next.classList.remove('entering');
  next.classList.add('active');
}

/* ---------- ambient stars (used from the constellation scene onward) ---------- */
function buildStars() {
  const field = document.getElementById('stars');
  const count = window.innerWidth < 500 ? 60 : 110;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star' + (Math.random() < 0.15 ? ' big' : '');
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = (Math.random() * 4) + 's';
    s.style.animationDuration = (3 + Math.random() * 3) + 's';
    field.appendChild(s);
  }
}

/* ---------- Scene 0: the dark opening ---------- */
function runIntro() {
  showScene('intro');
  const star1 = document.getElementById('introStar1');
  const line1 = document.getElementById('introLine1');
  const star2 = document.getElementById('introStar2');
  const line2 = document.getElementById('introLine2');
  const sky = document.getElementById('sky');

  setTimeout(() => star1.classList.add('show'), 1000);
  setTimeout(() => line1.classList.add('show'), 2000);
  setTimeout(() => star2.classList.add('show'), 4600);
  setTimeout(() => line2.classList.add('show'), 5600);
  setTimeout(() => sky.classList.add('reveal'), 8600);
  setTimeout(() => {
    showScene('constellation');
    runConstellation();
  }, 11000);
}

/* ---------- Scene 1: the constellation ---------- */
function runConstellation() {
  const scene = document.getElementById('scene-constellation');
  const text = document.getElementById('constText');
  const btn = document.getElementById('beginBtn');

  // kick off the line-draw + dot-appear animation (staggered via CSS transition-delay)
  setTimeout(() => scene.classList.add('drawing'), 300);

  // the lines/dots finish drawing by roughly 2.3s + 1.1s transition ≈ 3.4s after 'drawing' starts
  setTimeout(() => text.classList.add('show'), 4200);
  setTimeout(() => btn.classList.add('show'), 5600);
}

document.getElementById('beginBtn').addEventListener('click', () => {
  showScene('book');
});

/* ---------- Scene 2: the memory book ---------- */
const START_DATE = new Date('2023-04-19T00:00:00');
let bookTimerHandle = null;

function startBookTimer() {
  const el = document.getElementById('bookTimer');
  if (bookTimerHandle) return;
  function update() {
    const now = new Date();
    let years = now.getFullYear() - START_DATE.getFullYear();
    let months = now.getMonth() - START_DATE.getMonth();
    let days = now.getDate() - START_DATE.getDate();
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) { months += 12; years--; }
    el.textContent = `${years} year${years === 1 ? '' : 's'} \u2022 ${months} month${months === 1 ? '' : 's'} \u2022 ${days} day${days === 1 ? '' : 's'}`;
  }
  update();
  bookTimerHandle = setInterval(update, 60000);
}

document.getElementById('book').addEventListener('click', function onBookTap() {
  const book = document.getElementById('book');
  const hint = document.getElementById('bookHint');
  if (book.classList.contains('open')) return;
  book.classList.add('open');
  hint.style.opacity = '0';
  setTimeout(() => {
    book.classList.add('timer-show');
    startBookTimer();
  }, 900);
});

document.getElementById('turnPageBtn').addEventListener('click', (e) => {
  e.stopPropagation(); // don't let this bubble up to the book's own click handler
  showScene('universe');
});

/* ---------- Scene 3: the little universe ---------- */
const memoryCard = document.getElementById('memoryCard');
const memoryCardLabel = document.getElementById('memoryCardLabel');
const memoryCardText = document.getElementById('memoryCardText');

document.querySelectorAll('.memory-star').forEach(star => {
  star.addEventListener('click', () => {
    memoryCardLabel.textContent = star.getAttribute('data-label');
    memoryCardText.textContent = star.getAttribute('data-text');
    memoryCard.classList.add('show');
  });
});
document.getElementById('memoryCardClose').addEventListener('click', () => {
  memoryCard.classList.remove('show');
});
memoryCard.addEventListener('click', (e) => e.stopPropagation());
document.addEventListener('click', (e) => {
  if (memoryCard.classList.contains('show') && !memoryCard.contains(e.target) && !e.target.classList.contains('memory-star')) {
    memoryCard.classList.remove('show');
  }
});

document.getElementById('universeContinueBtn').addEventListener('click', () => {
  showScene('garden');
  runGarden();
});

/* ---------- Scene 4: the garden ---------- */
function runGarden() {
  document.getElementById('sky').classList.add('dim');
  const line1 = document.getElementById('gardenLine1');
  const line2 = document.getElementById('gardenLine2');
  setTimeout(() => line1.classList.add('show'), 4000);
  setTimeout(() => line2.classList.add('show'), 6200);
  setTimeout(() => {
    showScene('letter');
    runLetterScene();
  }, 9000);
}

/* ---------- Scene 5: your letter ---------- */
// Fill in the real letter below. Leave a blank line between paragraphs.
const LETTER_TEXT = `My dearest,

[ Paste your letter here. Keep paragraph breaks by leaving a blank line
between paragraphs — the typewriter will honor them. ]

Forever yours.`;

function runLetterScene() {
  playMusicOnce();

  const body = document.getElementById('letterBody');
  const caret = document.getElementById('letterCaret');
  const turnBtn = document.getElementById('letterTurnPageBtn');
  body.innerHTML = '';
  body.appendChild(caret);
  caret.style.display = '';
  turnBtn.classList.remove('show');

  // split into whole user-perceived characters (grapheme clusters), not raw
  // UTF-16 code units — slicing by text[i] instead breaks emoji like 🫶🏻
  // (a base character plus a separate skin-tone modifier) into unrenderable
  // fragments, as we found the hard way on the first project
  let units;
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
    units = Array.from(seg.segment(LETTER_TEXT), s => s.segment);
  } else {
    units = Array.from(LETTER_TEXT);
  }

  let i = 0;
  const speed = 32;
  function tick() {
    if (i < units.length) {
      body.insertBefore(document.createTextNode(units[i]), caret);
      i++;
      setTimeout(tick, speed);
    } else {
      caret.style.display = 'none';
      setTimeout(() => turnBtn.classList.add('show'), 500);
    }
  }
  tick();
}

function playMusicOnce() {
  const audio = document.getElementById('bgAudio');
  if (!audio.currentSrc && !audio.src) return; // no song added yet — nothing to play
  try { audio.currentTime = 0; } catch (e) {}
  const p = audio.play();
  if (p && p.catch) p.catch(() => {});
}

document.getElementById('letterTurnPageBtn').addEventListener('click', () => {
  showScene('time');
  runTimeScene();
});

/* ---------- Scene 6: time ---------- */
let timeGridHandle = null;
function startTimeGrid() {
  if (timeGridHandle) return;
  function update() {
    const now = new Date();
    let years = now.getFullYear() - START_DATE.getFullYear();
    let months = now.getMonth() - START_DATE.getMonth();
    let days = now.getDate() - START_DATE.getDate();
    let hours = now.getHours() - START_DATE.getHours();
    let mins = now.getMinutes() - START_DATE.getMinutes();
    let secs = now.getSeconds() - START_DATE.getSeconds();

    if (secs < 0) { secs += 60; mins--; }
    if (mins < 0) { mins += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) { months += 12; years--; }

    document.getElementById('tYears').textContent = years;
    document.getElementById('tMonths').textContent = months;
    document.getElementById('tDays').textContent = days;
    document.getElementById('tHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('tMins').textContent = String(mins).padStart(2, '0');
    document.getElementById('tSecs').textContent = String(secs).padStart(2, '0');
  }
  update();
  timeGridHandle = setInterval(update, 1000);
}

function runTimeScene() {
  const clock = document.getElementById('glowClock');
  const line1 = document.getElementById('timeLine1');
  const grid = document.getElementById('timeGrid');
  const line2 = document.getElementById('timeLine2');
  const btn = document.getElementById('timeContinueBtn');

  setTimeout(() => clock.classList.add('show'), 400);
  setTimeout(() => line1.classList.add('show'), 1600);
  setTimeout(() => { grid.classList.add('show'); startTimeGrid(); }, 3000);
  setTimeout(() => line2.classList.add('show'), 4600);
  setTimeout(() => btn.classList.add('show'), 5800);
}

document.getElementById('timeContinueBtn').addEventListener('click', () => {
  showScene('corner');
});

/* ---------- Scene 7: our little corner ---------- */
// paste your real links here when you have them
const CORNER_SPOTIFY_URL = '#';
const CORNER_TIKTOK_URL = '#';
document.getElementById('cornerSpotifyBtn').setAttribute('href', CORNER_SPOTIFY_URL);
document.getElementById('cornerTiktokBtn').setAttribute('href', CORNER_TIKTOK_URL);

document.getElementById('cornerLastPageBtn').addEventListener('click', () => {
  // Scene 8 — The Last Page — not built yet. Coming next.
  console.log('One Last Page → Scene 8 (The Last Page) not built yet.');
});

/* ---------- boot ---------- */
window.addEventListener('DOMContentLoaded', () => {
  buildStars();
  runIntro();
});
