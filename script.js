/* =========================================================
   NAV TOGGLE
========================================================= */
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
if (toggle && links) {
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

/* =========================================================
   SCROLL PROGRESS BAR
========================================================= */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);
function updateProgress() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
  progressBar.style.width = pct + '%';
}
document.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* =========================================================
   CURSOR GLOW (desktop / mouse users only)
========================================================= */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (window.matchMedia('(hover: hover)').matches && !reduceMotion) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  let tx = 0, ty = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    glow.classList.add('active');
  });
  document.addEventListener('mouseleave', () => glow.classList.remove('active'));
  (function loop() {
    gx += (tx - gx) * 0.14;
    gy += (ty - gy) * 0.14;
    glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .btn, .path-card').forEach(el => {
    el.addEventListener('mouseenter', () => glow.classList.add('hover'));
    el.addEventListener('mouseleave', () => glow.classList.remove('hover'));
  });
}

/* =========================================================
   STAGGERED REVEAL ON SCROLL (grid children get a delay)
========================================================= */
document.querySelectorAll('.skill-groups, .path-grid, .bug-grid, .stat-strip, .metric-strip').forEach(group => {
  Array.from(group.children).forEach((child, i) => {
    child.classList.add('reveal');
    child.style.setProperty('--d', (i * 70) + 'ms');
  });
});

const revealTargets = document.querySelectorAll('.reveal');
if (revealTargets.length) {
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in'); });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealIO.observe(el));
}

/* =========================================================
   TILT EFFECT ON CARDS
========================================================= */
if (!reduceMotion) {
  document.querySelectorAll('.path-card, .skill-card, .proj-card, .bug-card, .thru-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* Magnetic buttons */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const mx = (e.clientX - r.left - r.width / 2) * 0.25;
      const my = (e.clientY - r.top - r.height / 2) * 0.35;
      btn.style.transform = `translate(${mx}px, ${my}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* =========================================================
   ANIMATED COUNTERS (stat numbers count up on scroll into view)
========================================================= */
document.querySelectorAll('.num, .n, .pct').forEach(el => {
  const raw = el.textContent.trim();
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return;
  const target = parseInt(match[1], 10);
  const suffix = match[2];
  el.textContent = '0' + suffix;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const dur = 1100;
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.disconnect();
    });
  }, { threshold: 0.4 });
  obs.observe(el);
});

/* =========================================================
   QA PASS-RATE RING
========================================================= */
const ring = document.getElementById('ringFg');
const dash = document.querySelector('.dash');
if (ring && dash) {
  const ringIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        ring.style.strokeDashoffset = '0';
        ringIo.disconnect();
      }
    });
  }, { threshold: 0.4 });
  ringIo.observe(dash);
}

/* =========================================================
   DEV PAGE: TERMINAL TYPEWRITER REVEAL
========================================================= */
const termpanel = document.querySelector('.termpanel');
if (termpanel) {
  const lines = termpanel.querySelectorAll('.termbody .ln');
  const termIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      lines.forEach((line, i) => {
        setTimeout(() => line.classList.add('shown'), i * 250);
      });
      termIo.disconnect();
    });
  }, { threshold: 0.3 });
  termIo.observe(termpanel);
}

/* =========================================================
   HERO HEADING — WORD-BY-WORD REVEAL
========================================================= */
document.querySelectorAll('h1.name, h1.home-name').forEach(h => {
  const words = h.textContent.trim().split(' ');
  h.innerHTML = words.map((w, i) =>
    `<span style="display:inline-block; opacity:0; transform:translateY(20px); transition:opacity .6s ease ${i * 90}ms, transform .6s cubic-bezier(.2,.7,.2,1) ${i * 90}ms;">${w}&nbsp;</span>`
  ).join('');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    h.querySelectorAll('span').forEach(s => { s.style.opacity = '1'; s.style.transform = 'translateY(0)'; });
  }));
});
