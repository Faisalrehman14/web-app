(function () {
  'use strict';

  const SCREEN_INTRO = 'intro-screen';
  const SCREEN_LOADING = 'loading-screen';
  const SCREEN_LOGIN = 'login-screen';

  const screens = {
    intro: document.getElementById(SCREEN_INTRO),
    loading: document.getElementById(SCREEN_LOADING),
    login: document.getElementById(SCREEN_LOGIN),
  };

  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
      if (!el) return;
      if (key === name) {
        el.classList.add('screen-visible');
      } else {
        el.classList.remove('screen-visible');
      }
    });
  }

  /* =========================
     INTRO SPARKLES
     ========================= */
  function createIntroSparkles() {
    const container = document.getElementById('intro-sparkles');
    if (!container) return;
    const count = 60;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      const size = 2 + Math.random() * 5;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.animationDelay = (Math.random() * 3) + 's';
      s.style.animationDuration = (1.5 + Math.random() * 2.5) + 's';
      if (Math.random() > 0.6) {
        s.style.background = 'radial-gradient(circle, #fff 0%, #ff6b9d 50%, transparent 70%)';
      } else if (Math.random() > 0.5) {
        s.style.background = 'radial-gradient(circle, #fff 0%, #67e8f9 50%, transparent 70%)';
      }
      container.appendChild(s);
    }
  }

  /* =========================
     FIREWORKS
     ========================= */
  const FW_COLORS = ['#ff4d6d', '#4361ee', '#ffd60a', '#c77dff', '#00f5d4', '#ff8500', '#ef476f'];

  function launchFirework(container) {
    if (!container) return;
    const x = 10 + Math.random() * 80;
    const y = 15 + Math.random() * 45;
    const color = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];

    const travel = document.createElement('div');
    travel.className = 'firework';
    travel.style.left = x + '%';
    travel.style.top = y + 15 + '%';
    travel.style.background = color;
    travel.style.boxShadow = '0 0 10px 2px ' + color;
    container.appendChild(travel);

    travel.animate(
      [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: `translateY(-${15 + Math.random() * 10}vh)`, opacity: 1 },
        { opacity: 0 },
      ],
      { duration: 600 + Math.random() * 250, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', fill: 'forwards' }
    ).onfinish = () => {
      travel.remove();
      const boom = document.createElement('div');
      boom.className = 'firework-explosion';
      boom.style.left = x + '%';
      boom.style.top = y + '%';
      boom.style.color = color;
      container.appendChild(boom);
      setTimeout(() => boom.remove(), 1400);
    };
  }

  /* =========================
     LOADING PROGRESS
     ========================= */
  let loadingInterval = null;

  function startLoadingSequence() {
    const bar = document.getElementById('progress-fill');
    const txt = document.getElementById('progress-text');
    const barContainer = document.querySelector('.progress-bar-container');
    const status = document.getElementById('loading-status');
    const fwContainer = document.getElementById('fireworks-container');

    if (!bar || !txt) return;

    let progress = 0;
    bar.style.width = '0%';
    txt.textContent = '0%';
    if (barContainer) barContainer.setAttribute('aria-valuenow', '0');

    const messages = [
      'Initializing game engine...',
      'Loading graphics library...',
      'Fetching game assets...',
      'Configuring audio subsystem...',
      'Establishing secure connection...',
      'Validating user session...',
      'Preparing casino floor...',
      'Almost ready...',
    ];
    let msgIdx = 0;
    if (status) status.textContent = messages[0];

    if (loadingInterval) clearInterval(loadingInterval);
    loadingInterval = setInterval(() => {
      const inc = Math.random() < 0.15 ? Math.random() * 3 : 0.8 + Math.random() * 1.4;
      progress = Math.min(100, progress + inc);
      bar.style.width = progress + '%';
      txt.textContent = Math.floor(progress) + '%';
      if (barContainer) barContainer.setAttribute('aria-valuenow', String(Math.floor(progress)));

      if (progress > 12 && msgIdx === 0) { if (status) status.textContent = messages[++msgIdx]; }
      else if (progress > 28 && msgIdx === 1) { if (status) status.textContent = messages[++msgIdx]; }
      else if (progress > 45 && msgIdx === 2) { if (status) status.textContent = messages[++msgIdx]; }
      else if (progress > 60 && msgIdx === 3) { if (status) status.textContent = messages[++msgIdx]; }
      else if (progress > 73 && msgIdx === 4) { if (status) status.textContent = messages[++msgIdx]; }
      else if (progress > 85 && msgIdx === 5) { if (status) status.textContent = messages[++msgIdx]; }
      else if (progress > 94 && msgIdx === 6) { if (status) status.textContent = messages[++msgIdx]; }

      if (fwContainer && Math.random() < 0.45) {
        launchFirework(fwContainer);
      }

      if (progress >= 100) {
        clearInterval(loadingInterval);
        loadingInterval = null;
        setTimeout(() => showLoginScreen(), 550);
      }
    }, 130);
  }

  /* =========================
     SCREEN FLOW
     ========================= */
  function showLoadingScreen() {
    showScreen('loading');
    const loadingVideo = document.getElementById('loading-video');
    if (loadingVideo) {
      loadingVideo.currentTime = 0;
      loadingVideo.play().catch(() => {});
    }
    startLoadingSequence();
  }

  function showLoginScreen() {
    showScreen('login');
    initLoginPolish();
  }

  function initIntroVideo() {
    const introVideo = document.getElementById('intro-video');
    if (!introVideo) {
      setTimeout(showLoadingScreen, 3800);
      return;
    }

    const onIntroEnd = () => showLoadingScreen();
    introVideo.addEventListener('ended', onIntroEnd, { once: true });

    const playPromise = introVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        setTimeout(showLoadingScreen, 4000);
      });
    }

    setTimeout(() => {
      if (screens.intro.classList.contains('screen-visible')) {
        if (introVideo.readyState < 2) showLoadingScreen();
      }
    }, 9000);
  }

  /* =========================
     LOGIN PARTICLES
     ========================= */
  function createLoginParticles() {
    const container = document.getElementById('login-particles');
    if (!container) return;
    const colors = [
      'rgba(167, 139, 250, 0.85)',
      'rgba(255, 200, 80, 0.7)',
      'rgba(103, 232, 249, 0.75)',
      'rgba(244, 114, 182, 0.7)',
      'rgba(180, 220, 255, 0.7)',
    ];
    const count = 35;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'login-particle';
      const size = 2 + Math.random() * 5;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = (Math.random() * 85 + 5) + '%';
      p.style.top = (85 + Math.random() * 20) + '%';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.boxShadow = '0 0 ' + (size * 2) + 'px ' + (size * 0.7) + 'px rgba(255,255,255,0.2)';
      const dur = 10 + Math.random() * 16;
      p.style.animationDuration = dur + 's';
      p.style.animationDelay = (-Math.random() * dur) + 's';
      container.appendChild(p);
    }
  }

  /* =========================
     LOGIN 3D CARD TILT
     ========================= */
  function initCardTilt() {
    const card3d = document.getElementById('login-card-3d');
    const inner = card3d && card3d.querySelector('.login-card-inner');
    if (!card3d || !inner) return;

    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let currX = 0;
    let currY = 0;

    const MAX = 6;

    card3d.addEventListener('pointermove', (e) => {
      const rect = card3d.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      targetY = (px - 0.5) * MAX * 2;
      targetX = (0.5 - py) * MAX * 2;
      if (!rafId) loop();
    });

    card3d.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
      if (!rafId) loop();
    });

    function loop() {
      rafId = requestAnimationFrame(() => {
        currX += (targetX - currX) * 0.08;
        currY += (targetY - currY) * 0.08;
        inner.style.transform = `rotateX(${currX}deg) rotateY(${currY}deg) translateZ(0)`;
        if (Math.abs(targetX - currX) < 0.05 && Math.abs(targetY - currY) < 0.05 && targetX === 0 && targetY === 0) {
          inner.style.transform = `rotateX(0) rotateY(0) translateZ(0)`;
          rafId = null;
          return;
        }
        loop();
      });
    }
  }

  /* =========================
     BUTTON RIPPLE
     ========================= */
  function initButtonRipple() {
    const btn = document.getElementById('login-submit');
    if (!btn) return;
    btn.addEventListener('pointerdown', (e) => {
      const ripple = document.getElementById('btn-ripple');
      if (!ripple) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      ripple.style.animation = 'none';
      ripple.offsetHeight;
      ripple.style.animation = '';
    });
  }

  /* =========================
     CHECKBOX TOGGLE
     ========================= */
  function initCheckbox() {
    const visual = document.getElementById('custom-checkbox');
    const input = document.getElementById('remember');
    const hitbox = document.querySelector('.checkbox-hitbox');
    if (!visual || !input) return;

    const sync = () => {
      visual.classList.toggle('checked', !!input.checked);
    };
    sync();

    const toggle = (e) => {
      if (e) e.preventDefault();
      input.checked = !input.checked;
      sync();
    };

    if (hitbox) hitbox.addEventListener('click', toggle);
  }

  /* =========================
     FORGOT LINK
     ========================= */
  function initForgotLink() {
    const link = document.getElementById('forgot-link');
    if (!link) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showLoginError('Password recovery is not available in demo version.');
    });
  }

  /* =========================
     LOGIN SUBMIT - ALWAYS INVALID
     ========================= */
  const ERROR_TEXT_WRONG = 'Wrong username or password.';
  const ERROR_TEXT_EMPTY = 'Please enter account and password.';
  const ERROR_TEXT_NO_ACCOUNT = 'Please enter your account.';
  const ERROR_TEXT_NO_PASSWORD = 'Please enter your password.';

  function showLoginError(message) {
    const overlay = document.getElementById('login-error');
    const span = overlay && overlay.querySelector('.error-text-span');
    const form = document.getElementById('login-form');
    if (!overlay || !span || !form) return;
    span.textContent = message;
    overlay.classList.add('visible');
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 520);
  }

  function hideLoginError() {
    const overlay = document.getElementById('login-error');
    if (overlay) overlay.classList.remove('visible');
  }

  function initLoginForm() {
    const form = document.getElementById('login-form');
    const user = document.getElementById('username');
    const pass = document.getElementById('password');
    if (!form || !user || !pass) return;

    [user, pass].forEach((el) => {
      el.addEventListener('input', hideLoginError);
      el.addEventListener('focus', hideLoginError);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = user.value.trim();
      const p = pass.value;
      if (!u && !p) { showLoginError(ERROR_TEXT_EMPTY); return; }
      if (!u) { showLoginError(ERROR_TEXT_NO_ACCOUNT); return; }
      if (!p) { showLoginError(ERROR_TEXT_NO_PASSWORD); return; }
      showLoginError(ERROR_TEXT_WRONG);
    });
  }

  /* =========================
     FIREWORKS BACKGROUND LOOP (loading screen)
     ========================= */
  let fwLoopInterval = null;
  function startFireworksLoop() {
    const container = document.getElementById('fireworks-container');
    if (!container) return;
    if (fwLoopInterval) clearInterval(fwLoopInterval);
    fwLoopInterval = setInterval(() => {
      if (!screens.loading.classList.contains('screen-visible')) return;
      launchFirework(container);
    }, 550);
  }

  /* =========================
     LOGIN POLISH
     ========================= */
  let loginPolishDone = false;
  function initLoginPolish() {
    if (loginPolishDone) return;
    loginPolishDone = true;
    createLoginParticles();
    initCardTilt();
    initButtonRipple();
    initCheckbox();
    initForgotLink();
    initLoginForm();
  }

  /* =========================
     BOOT
     ========================= */
  document.addEventListener('DOMContentLoaded', () => {
    createIntroSparkles();
    startFireworksLoop();
    setTimeout(initIntroVideo, 400);
  });

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(() => {
      createIntroSparkles();
      startFireworksLoop();
      initIntroVideo();
    }, 150);
  }
})();
