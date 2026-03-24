/* ═══════════════════════════════════════════════════════════
   Wedding Invitation Script
   - Language switcher
   - Falling petals animation
   - Scroll-triggered animations
═══════════════════════════════════════════════════════════ */

// ── Language Switcher ──────────────────────────────────────
const langBtns = document.querySelectorAll('.lang-btn');
let currentLang = 'hy';

function setLanguage(lang) {
  currentLang = lang;

  // Update all data-{lang} elements
  document.querySelectorAll('[data-hy]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text !== null) el.textContent = text;
  });

  // Update html lang attribute
  document.documentElement.lang = lang === 'hy' ? 'hy' : lang === 'ru' ? 'ru' : 'en';

  // Update font family for Armenian vs Latin/Cyrillic
  const isArm = lang === 'hy';
  document.body.style.fontFamily = isArm
    ? "'Noto Serif Armenian', 'Noto Serif', serif"
    : "'Cormorant Garamond', 'Noto Serif', Georgia, serif";

  // Active button
  langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
}

langBtns.forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

// Init with Armenian
setLanguage('hy');


// ── Falling Petals ─────────────────────────────────────────
const canvas = document.getElementById('petals-canvas');
const ctx = canvas.getContext('2d');

let W = window.innerWidth;
let H = window.innerHeight;
canvas.width = W;
canvas.height = H;

window.addEventListener('resize', () => {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
});

const PETAL_COUNT = 28;
const petals = [];

const petalColors = [
  'rgba(232, 213, 163, 0.55)',
  'rgba(255, 220, 200, 0.45)',
  'rgba(255, 200, 180, 0.40)',
  'rgba(201, 169, 110, 0.35)',
  'rgba(255, 240, 220, 0.50)',
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function createPetal() {
  return {
    x: randomBetween(0, W),
    y: randomBetween(-200, -10),
    size: randomBetween(8, 18),
    speedY: randomBetween(0.6, 1.8),
    speedX: randomBetween(-0.5, 0.5),
    rotation: randomBetween(0, Math.PI * 2),
    rotSpeed: randomBetween(-0.02, 0.02),
    opacity: randomBetween(0.3, 0.7),
    color: petalColors[Math.floor(Math.random() * petalColors.length)],
    sway: randomBetween(0.3, 1.2),
    swayOffset: randomBetween(0, Math.PI * 2),
  };
}

for (let i = 0; i < PETAL_COUNT; i++) {
  const p = createPetal();
  p.y = randomBetween(0, H); // spread initial positions
  petals.push(p);
}

function drawPetal(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  // Ellipse petal shape
  ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

let frame = 0;
function animatePetals() {
  ctx.clearRect(0, 0, W, H);
  frame++;

  petals.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX + Math.sin(frame * 0.01 + p.swayOffset) * p.sway * 0.3;
    p.rotation += p.rotSpeed;

    if (p.y > H + 30) {
      Object.assign(p, createPetal());
    }

    drawPetal(p);
  });

  requestAnimationFrame(animatePetals);
}

animatePetals();


// ── Scroll Animations ──────────────────────────────────────
const timelineItems = document.querySelectorAll('.timeline-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 150);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

timelineItems.forEach(item => observer.observe(item));


// ── Smooth hero parallax ───────────────────────────────────
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (hero && scrollY < window.innerHeight) {
    hero.style.backgroundPositionY = `${50 + scrollY * 0.25}%`;
  }
}, { passive: true });


// ── Countdown Timer ────────────────────────────────────────
const WEDDING_DATE = new Date('2026-06-26T11:00:00');

function pad(n) { return String(n).padStart(2, '0'); }

function tickNum(el, newVal) {
  if (el.textContent !== newVal) {
    el.textContent = newVal;
    el.classList.remove('tick');
    void el.offsetWidth; // reflow
    el.classList.add('tick');
    setTimeout(() => el.classList.remove('tick'), 200);
  }
}

function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  const cdEl = document.getElementById('countdown');
  if (!cdEl) return;

  if (diff <= 0) {
    cdEl.innerHTML = `<span class="countdown-done" data-hy="Այսօր է մեր օրը ✦" data-ru="Сегодня наш день ✦" data-en="Today is our day ✦"></span>`;
    // re-apply current language to the new element
    const span = cdEl.querySelector('[data-hy]');
    if (span) {
      const text = span.getAttribute(`data-${currentLang}`);
      if (text) span.textContent = text;
    }
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  tickNum(document.getElementById('cd-days'),  pad(days));
  tickNum(document.getElementById('cd-hours'), pad(hours));
  tickNum(document.getElementById('cd-mins'),  pad(mins));
  tickNum(document.getElementById('cd-secs'),  pad(secs));
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ── Map toggle panels ──────────────────────────────────────
document.querySelectorAll('.map-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const panel = document.getElementById(targetId);
    if (!panel) return;

    const isOpen = panel.classList.contains('open');

    // Close all panels first
    document.querySelectorAll('.map-panel').forEach(p => p.classList.remove('open'));
    document.querySelectorAll('.map-toggle-btn').forEach(b => b.classList.remove('open'));

    if (!isOpen) {
      panel.classList.add('open');
      btn.classList.add('open');
      // Update button text to "hide map"
      const labels = {
        hy: '✕ Փակել քարտեզը',
        ru: '✕ Скрыть карту',
        en: '✕ Hide Map',
      };
      btn.textContent = labels[currentLang] || labels.hy;
    } else {
      // Restore original text
      const labels = {
        hy: '🗺 Քարտեզ տեսնել',
        ru: '🗺 Показать карту',
        en: '🗺 Show Map',
      };
      btn.textContent = labels[currentLang] || labels.hy;
    }
  });
});

// Keep map toggle button text in sync with language changes
const origSetLanguage = setLanguage;
// patch: after language switch, re-sync open/closed button labels
document.querySelectorAll('.lang-btn').forEach(b => {
  b.addEventListener('click', () => {
    // re-sync map toggle buttons after lang switch
    setTimeout(() => {
      document.querySelectorAll('.map-toggle-btn').forEach(btn => {
        const isOpen = btn.classList.contains('open');
        const openLabels  = { hy: '✕ Փակել քարտեզը', ru: '✕ Скрыть карту', en: '✕ Hide Map' };
        const closeLabels = { hy: '🗺 Քարտեզ տեսնել', ru: '🗺 Показать карту', en: '🗺 Show Map' };
        btn.textContent = isOpen ? openLabels[currentLang] : closeLabels[currentLang];
      });
    }, 10);
  });
});


// ── Photo strip duplicate for infinite scroll ──────────────
const stripInner = document.querySelector('.strip-inner');
if (stripInner) {
  const imgs = stripInner.innerHTML;
  stripInner.innerHTML = imgs + imgs;
}
