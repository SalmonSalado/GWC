/* ==============================================================
     1. CUSTOM CURSOR
     The dot tracks the mouse exactly. The ring uses "lerp"
     (linear interpolation): each frame it moves 15% of the
     remaining distance toward the mouse. That tiny formula —
     pos += (target - pos) * 0.15 — is the heart of almost every
     smooth-feeling effect on sites like Cuberto's.
     ============================================================== */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const ringLabel = ring.querySelector('span');

  let mouseX = -100, mouseY = -100;   // real mouse position
  let ringX  = -100, ringY  = -100;   // ring's lagging position

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // the dot is glued to the mouse — no lag
    dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  function animateRing() {
    // Lerp: try changing 0.15 to 0.05 (dreamier) or 0.4 (snappier)
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX - 22}px, ${ringY - 22}px)`;
    requestAnimationFrame(animateRing); // ~60 times per second
  }
  animateRing();

  // Anything with a data-cursor attribute activates the labelled ring
  document.querySelectorAll('[data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('is-active');
      ringLabel.textContent = el.dataset.cursor;
    });
    el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
  });

  /* ==============================================================
     2. TEXT REVEAL — CSS does the animating; JS just flips the
     switch after fonts settle so the first paint isn't janky.
     ============================================================== */
  window.addEventListener('load', () => {
    setTimeout(() => document.body.classList.add('is-loaded'), 150);
  });

  /* ==============================================================
     3. MAGNETIC BUTTONS
     Measure how far the cursor is from the button's center and
     translate the button by a fraction (0.35) of that offset.
     The padded wrapper is the invisible "gravity field".
     ============================================================== */
  document.querySelectorAll('.magnet-wrap').forEach((wrap) => {
    const btn = wrap.querySelector('.magnet');
    wrap.addEventListener('mousemove', (e) => {
      const r = wrap.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`;
    });
    wrap.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)'; // CSS spring pulls it home
    });
  });

  /* ==============================================================
     5. COUNTDOWN — set your real hackathon date here
     ============================================================== */
  const target = new Date('2026-10-17T09:00:00-04:00'); // ← change me
  const pad = (n) => String(n).padStart(2, '0');
  function tick() {
    const diff = Math.max(0, target - new Date());
    document.getElementById('cd-d').textContent = pad(Math.floor(diff / 86400000));
    document.getElementById('cd-h').textContent = pad(Math.floor(diff / 3600000) % 24);
    document.getElementById('cd-m').textContent = pad(Math.floor(diff / 60000) % 60);
    document.getElementById('cd-s').textContent = pad(Math.floor(diff / 1000) % 60);
  }
  tick();
  setInterval(tick, 1000);

  /* ==============================================================
     6. MARQUEE — duplicate the track once so the -50% translate
     loops seamlessly (the second copy slides in as the first exits)
     ============================================================== */
  const track = document.getElementById('marquee-track');
  track.innerHTML += track.innerHTML;
