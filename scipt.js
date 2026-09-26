'use strict';

/* =========================================================================
   DOM SELECTORS
   ========================================================================= */

const dom = {
  header: document.getElementById('siteHeader'),
  nav: document.getElementById('primaryNav'),
  navToggle: document.getElementById('navToggle'),
  navScrim: document.getElementById('navScrim'),
  navLinks: document.querySelectorAll('.nav-link'),
  themeToggle: document.getElementById('themeToggle'),
  sections: document.querySelectorAll('.section, .hero'),
  yearEl: document.getElementById('year'),
};

const THEME_KEY = 'portfolio_theme';

/* =========================================================================
   THEME
   ========================================================================= */

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = dom.themeToggle.querySelector('i');
  if (icon) icon.className = `fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`;
}

function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'dark';
  } catch (error) {
    console.error('Could not read saved theme.', error);
    return 'dark';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (error) {
    console.error('Could not save theme preference.', error);
  }
}

/* =========================================================================
   MOBILE NAVIGATION
   ========================================================================= */

function openNav() {
  dom.nav.classList.add('is-open');
  dom.navScrim.hidden = false;
  dom.navScrim.setAttribute('data-open', '');
  dom.navToggle.setAttribute('aria-expanded', 'true');
}

function closeNav() {
  dom.nav.classList.remove('is-open');
  dom.navScrim.hidden = true;
  dom.navScrim.removeAttribute('data-open');
  dom.navToggle.setAttribute('aria-expanded', 'false');
}

function toggleNav() {
  const isOpen = dom.nav.classList.contains('is-open');
  if (isOpen) closeNav(); else openNav();
}

/* =========================================================================
   ACTIVE SECTION HIGHLIGHTING (scroll spy)
   ========================================================================= */

function setActiveNavLink(sectionId) {
  dom.navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.dataset.section === sectionId);
  });
}

function setupScrollSpy() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveNavLink(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  dom.sections.forEach((section) => observer.observe(section));
}

/* =========================================================================
   SCROLL REVEAL
   Adds a class once a section enters the viewport. Skips itself entirely
   when the user prefers reduced motion, so content is simply visible.
   ========================================================================= */

function setupScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return; // sections are visible by default in CSS — nothing to do

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  dom.sections.forEach((section) => {
    section.classList.add('reveal-init'); // opt in to the hidden-until-scrolled state
    observer.observe(section);
  });
}

/* =========================================================================
   EVENT LISTENERS
   ========================================================================= */

function setupEventListeners() {
  dom.themeToggle.addEventListener('click', toggleTheme);
  dom.navToggle.addEventListener('click', toggleNav);
  dom.navScrim.addEventListener('click', closeNav);

  dom.navLinks.forEach((link) => {
    link.addEventListener('click', () => closeNav());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });
}

/* =========================================================================
   INITIALIZATION
   ========================================================================= */

function initPortfolio() {
  applyTheme(loadTheme());
  setupEventListeners();
  setupScrollSpy();
  setupScrollReveal();
  if (dom.yearEl) dom.yearEl.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', initPortfolio);