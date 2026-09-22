/* ============================================
   HumanaOpen Landing Site — Script
   ============================================ */

(function () {
  'use strict';

  // ---- State ----
  let currentLang = localStorage.getItem('hopen-lang') || 'en';

  // ---- DOM refs ----
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const langToggle = document.getElementById('langToggle');
  const htmlEl = document.documentElement;

  // ---- Mobile nav toggle ----
  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ---- Scroll: nav shadow ----
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Language switcher ----
  function applyLang(lang) {
    currentLang = lang;
    htmlEl.setAttribute('data-lang', lang);
    htmlEl.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    localStorage.setItem('hopen-lang', lang);

    // Update toggle label
    langToggle.textContent = lang === 'en' ? '中/EN' : 'EN/中';

    // Swap all data-en / data-zh elements
    var attr = 'data-' + lang;
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var text = el.getAttribute(attr);
      if (text !== null) {
        // For elements with HTML children (e.g. <strong>), preserve them
        if (el.children.length === 0 || el.tagName === 'STRONG') {
          el.innerHTML = text;
        } else {
          // Elements with mixed content — set innerHTML to preserve tags
          el.innerHTML = text;
        }
      }
    });

    var heroImg = document.querySelector('.hero__img');
    if (heroImg) {
      var imgSrc = heroImg.getAttribute('data-' + lang + '-src');
      if (imgSrc) heroImg.src = imgSrc;
    }

    // Swap placeholders (aria-label + text)
    document.querySelectorAll('.placeholder').forEach(function (el) {
      var label = el.getAttribute('data-' + lang + '-aria');
      if (label) el.setAttribute('aria-label', label);
    });
  }

  langToggle.addEventListener('click', function () {
    applyLang(currentLang === 'en' ? 'zh' : 'en');
  });

  // Apply stored/default language on load
  applyLang(currentLang);

  // ---- Scroll reveal (IntersectionObserver) ----
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();