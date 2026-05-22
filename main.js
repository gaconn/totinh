// ================================================
// Config
// ================================================
// const TARGET_DATE = new Date(Date.now() + 1 * 10 * 1000); // TEST: 1 phút sau khi load
const TARGET_DATE = new Date('2026-06-12T09:00:00+07:00'); // PRODUCTION
const UNLOCK_PASSWORD = '612'; // ← đổi mật khẩu tại đây
const STAR_COUNT        = 90;
const HEART_COUNT       = 12;
const HEART_CHARS       = ['♥', '❤', '💕', '💗', '💓'];
const HEART_P2_COUNT    = 35;
const HEART_P2_COLORS   = [
  'rgba(180, 60, 70, VAL)',
  'rgba(210, 100, 90, VAL)',
  'rgba(255, 160, 150, VAL)',
  'rgba(230, 80, 100, VAL)',
  'rgba(255, 200, 180, VAL)',
];

// ================================================
// Helpers
// ================================================

function pad(n) {
  return String(n).padStart(2, '0');
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// ================================================
// Stars & Hearts (Page 1 decoration)
// ================================================

function createStar(container) {
  const el = document.createElement('div');
  el.classList.add('star');
  const sz = randomBetween(0.8, 3.3).toFixed(1);
  el.style.cssText = `
    width:${sz}px; height:${sz}px;
    top:${randomBetween(0, 100).toFixed(2)}%;
    left:${randomBetween(0, 100).toFixed(2)}%;
    --dur:${randomBetween(2, 6).toFixed(1)}s;
    --delay:${randomBetween(0, 4).toFixed(2)}s;
  `;
  container.appendChild(el);
}

function createHeart(container) {
  const el = document.createElement('div');
  el.classList.add('heart-float');
  el.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
  const sz = randomBetween(0.7, 1.9).toFixed(2);
  el.style.cssText = `
    left:${randomBetween(0, 96).toFixed(1)}%;
    bottom:0;
    --sz:${sz}rem;
    --fdur:${randomBetween(7, 15).toFixed(1)}s;
    --fdelay:${randomBetween(0, 10).toFixed(1)}s;
    color:rgba(255,255,255,${randomBetween(0.15, 0.5).toFixed(2)});
  `;
  container.appendChild(el);
}

function initDecorations() {
  const container = document.getElementById('starsContainer');
  for (let i = 0; i < STAR_COUNT; i++) createStar(container);
  for (let i = 0; i < HEART_COUNT; i++) createHeart(container);
}

function createHeartP2(container) {
  const el = document.createElement('div');
  el.classList.add('heart-float-p2');
  el.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
  const sz    = randomBetween(1.8, 4.5).toFixed(2);
  const alpha = randomBetween(0.2, 0.55).toFixed(2);
  const colorTemplate = HEART_P2_COLORS[Math.floor(Math.random() * HEART_P2_COLORS.length)];
  const color = colorTemplate.replace('VAL', alpha);
  el.style.cssText = `
    left:${randomBetween(0, 96).toFixed(1)}%;
    bottom:0;
    --sz:${sz}rem;
    --fdur:${randomBetween(6, 14).toFixed(1)}s;
    --fdelay:${randomBetween(0, 12).toFixed(1)}s;
    color:${color};
  `;
  container.appendChild(el);
}

function initPageTwoHearts() {
  const container = document.getElementById('heartsP2');
  for (let i = 0; i < HEART_P2_COUNT; i++) createHeartP2(container);
}

// ================================================
// Countdown
// ================================================

function getRemainingTime(target) {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  };
}

function updateDisplay(time) {
  document.getElementById('days').textContent    = pad(time ? time.days    : 0);
  document.getElementById('hours').textContent   = pad(time ? time.hours   : 0);
  document.getElementById('minutes').textContent = pad(time ? time.minutes : 0);
  document.getElementById('seconds').textContent = pad(time ? time.seconds : 0);
}

function revealLetterElements() {
  const els = document.querySelectorAll('.letter-reveal');
  els.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 600);
  });
}

function transitionToLetter(timerId) {
  clearInterval(timerId);
  initPageTwoHearts();
  document.getElementById('page1').classList.add('fade-out');
  document.getElementById('page2').classList.add('visible');
  setTimeout(() => {
    document.getElementById('page1').style.display = 'none';
    document.body.style.overflow = 'auto';
    revealLetterElements();
  }, 2400);
}

function startCountdown() {
  let timerId;

  function tick() {
    const time = getRemainingTime(TARGET_DATE);
    updateDisplay(time);
    if (!time) transitionToLetter(timerId);
  }

  tick();
  timerId = setInterval(tick, 1000);
  initUnlock(() => timerId);
}

function initUnlock(getTimerId) {
  const input = document.getElementById('unlockInput');
  const btn   = document.getElementById('unlockBtn');
  const hint  = document.getElementById('unlockHint');

  function tryUnlock() {
    if (input.value === UNLOCK_PASSWORD) {
      transitionToLetter(getTimerId());
    } else {
      hint.textContent = 'Sai rồi ơi... thử lại đi ♡';
      input.value = '';
      input.focus();
      setTimeout(() => { hint.textContent = ''; }, 2000);
    }
  }

  btn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });
}

// ================================================
// Init
// ================================================

function init() {
  initDecorations();
  startCountdown();
}

document.addEventListener('DOMContentLoaded', init);
