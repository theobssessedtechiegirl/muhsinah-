/* =========================================================
   Muhsinah — Portfolio interactivity
   Vanilla JavaScript only.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  initThemeToggle();
  initMobileMenu();
  initActiveTabOnScroll();
  initNavBackgroundOnScroll();
  initTerminalTyping();
  initRevealOnScroll();
  initContactForm();
});

/* ---------------------------------
   Footer year
---------------------------------- */
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ---------------------------------
   Theme toggle (persisted)
---------------------------------- */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const stored = localStorage.getItem('muhsinah-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = stored || (prefersLight ? 'light' : 'dark');

  applyTheme(initial);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('muhsinah-theme', next);
  });

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      toggle.setAttribute('aria-pressed', 'true');
      toggle.setAttribute('aria-label', 'Switch to dark theme');
    } else {
      document.documentElement.removeAttribute('data-theme');
      toggle.setAttribute('aria-pressed', 'false');
      toggle.setAttribute('aria-label', 'Switch to light theme');
    }
  }
}

/* ---------------------------------
   Mobile menu toggle
---------------------------------- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileTabs = document.getElementById('mobileTabs');
  if (!menuToggle || !mobileTabs) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileTabs.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileTabs.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileTabs.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------
   Highlight active nav tab while scrolling
---------------------------------- */
function initActiveTabOnScroll() {
  const sections = document.querySelectorAll('main section[id]');
  const allTabs = document.querySelectorAll('.tab');
  if (!sections.length || !allTabs.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          allTabs.forEach((tab) => {
            tab.classList.toggle('active', tab.dataset.target === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------------
   Nav bar background/shadow on scroll
---------------------------------- */
function initNavBackgroundOnScroll() {
  const tabbar = document.getElementById('tabbar');
  if (!tabbar) return;

  const onScroll = () => {
    tabbar.style.boxShadow = window.scrollY > 10 ? '0 6px 20px rgba(0,0,0,0.25)' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------
   Terminal typing effect (About section)
---------------------------------- */
function initTerminalTyping() {
  const codeEl = document.getElementById('typedCode');
  if (!codeEl) return;

  const snippet =
`const muhsinah = {
  role: "Aspiring Software Developer",
  stack: ["HTML", "CSS", "JavaScript"],
  tools: ["Git", "GitHub", "SPCK", "VS Code"],
  location: "Lagos, Nigeria",
  currentlyLearning: "JavaScript",
  status: "building..."
};`;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    codeEl.textContent = snippet;
    return;
  }

  let i = 0;
  const speed = 18;

  function typeChar() {
    if (i <= snippet.length) {
      codeEl.textContent = snippet.slice(0, i);
      i++;
      setTimeout(typeChar, speed);
    }
  }

  const terminal = codeEl.closest('.terminal');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeChar();
          obs.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  if (terminal) observer.observe(terminal);
}

/* ---------------------------------
   Reveal sections as they enter view
---------------------------------- */
function initRevealOnScroll() {
  const targets = document.querySelectorAll(
    '.about-grid, .skills-grid, .projects-grid, .contact-grid'
  );
  if (!targets.length) return;

  targets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------------------------------
   Contact form validation + mailto handoff
---------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const note = document.getElementById('formNote');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    note.textContent = '';

    const isNameValid = validateField(nameInput, 'nameError', () =>
      nameInput.value.trim().length > 0 ? '' : 'Please enter your name.'
    );
    const isEmailValid = validateField(emailInput, 'emailError', () =>
      emailPattern.test(emailInput.value.trim()) ? '' : 'Please enter a valid email address.'
    );
    const isMessageValid = validateField(messageInput, 'messageError', () =>
      messageInput.value.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'
    );

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      return;
    }

    const subject = encodeURIComponent(`Portfolio message from ${nameInput.value.trim()}`);
    const body = encodeURIComponent(
      `${messageInput.value.trim()}\n\n— ${nameInput.value.trim()} (${emailInput.value.trim()})`
    );

    window.location.href = `mailto:muhsinaholuwadamilola@gmail.com?subject=${subject}&body=${body}`;
    note.textContent = 'Opening your email client…';
    form.reset();
  });

  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener('input', () => clearError(input));
  });

  function validateField(input, errorId, getMessage) {
    const message = getMessage();
    const errorEl = document.getElementById(errorId);
    const row = input.closest('.form-row');

    if (message) {
      errorEl.textContent = message;
      row.classList.add('has-error');
      return false;
    }

    errorEl.textContent = '';
    row.classList.remove('has-error');
    return true;
  }

  function clearError(input) {
    const row = input.closest('.form-row');
    const errorEl = row.querySelector('.form-error');
    row.classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
  }
}
