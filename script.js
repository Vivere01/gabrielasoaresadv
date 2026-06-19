/* ═══════════════════════════════════════════════
   GABRIELA SOARES ADVOCACIA – script.js
   ═══════════════════════════════════════════════ */

'use strict';

/* ─── Header scroll shadow ─── */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── Mobile menu ─── */
(function initMobileMenu() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu?.querySelectorAll('.mobile-link, .btn-cta-mobile');
  if (!hamburger || !mobileMenu) return;

  const toggle = (open) => {
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    toggle(!isOpen);
  });

  mobileLinks?.forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });
})();

/* ─── Active nav link on scroll ─── */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id], header[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            const href = link.getAttribute('href')?.replace('#', '');
            link.classList.toggle('active', href === entry.target.id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach(sec => observer.observe(sec));
})();

/* ─── Intersection Observer – animate on scroll ─── */
(function initAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ─── Animated counters ─── */
(function initCounters() {
  const items = document.querySelectorAll('[data-count]');
  if (!items.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.count, 10);
    const counter  = el.querySelector('.counter');
    if (!counter) return;

    const duration = 1800;
    const start    = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      counter.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  items.forEach(item => observer.observe(item));
})();

/* ─── FAQ accordion ─── */
(function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const ans = item.querySelector('.faq-answer');
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      items.forEach(i => {
        const b = i.querySelector('.faq-question');
        const a = i.querySelector('.faq-answer');
        if (b && a) {
          b.setAttribute('aria-expanded', 'false');
          a.classList.remove('open');
        }
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        ans.classList.add('open');
      }
    });
  });
})();

/* ─── Contact form ─── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submit  = document.getElementById('form-submit');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const nome     = form.querySelector('#nome');
    const email    = form.querySelector('#email');
    const mensagem = form.querySelector('#mensagem');
    const inputs   = [nome, email, mensagem];
    let valid = true;

    inputs.forEach(inp => {
      if (!inp) return;
      inp.style.borderColor = '';
      if (!inp.value.trim()) {
        inp.style.borderColor = '#ba1a1a';
        valid = false;
      }
    });

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.style.borderColor = '#ba1a1a';
      valid = false;
    }

    if (!valid) return;

    // Simulate submission
    const originalText = submit.innerHTML;
    submit.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="0" style="animation:spin .8s linear infinite"/></svg> Enviando…';
    submit.disabled = true;

    await new Promise(r => setTimeout(r, 1800));

    form.reset();
    submit.innerHTML = originalText;
    submit.disabled = false;
    success.hidden = false;

    setTimeout(() => { success.hidden = true; }, 6000);
  });
})();

/* ─── Smooth scroll for anchor links ─── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '80',
        10
      );
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─── Footer year ─── */
(function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ─── Phone mask ─── */
(function initPhoneMask() {
  const tel = document.getElementById('telefone');
  if (!tel) return;

  tel.addEventListener('input', () => {
    let v = tel.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) {
      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    tel.value = v;
  });
})();

/* ─── Spin keyframe for button loading ─── */
(function injectSpinKeyframe() {
  const style = document.createElement('style');
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
})();
