
'use strict';

/* ---------- LOADER ---------- */
window.addEventListener('load', function () {
  var loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(function () {
    loader.classList.add('hidden');
    // Trigger initial reveals after load
    triggerReveal();
  }, 1600);
});

/* ---------- SCROLL TO TOP ---------- */
var scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function () {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
  updateActiveNav();
  triggerReveal();
}, { passive: true });

scrollTopBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- STICKY NAVBAR ---------- */
var navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ---------- HAMBURGER MENU ---------- */
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', function () {
  var isOpen = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen.toString());
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(function (link) {
  link.addEventListener('click', function () {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', function (e) {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ---------- ACTIVE NAV LINK HIGHLIGHTING ---------- */
var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  var scrollY = window.scrollY + 120;
  var currentSection = '';

  sections.forEach(function (section) {
    var sectionTop = section.offsetTop;
    var sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(function (link) {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

/* ---------- SMOOTH SCROLLING ---------- */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var targetId = this.getAttribute('href').slice(1);
    var target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    var offset = 80;
    var targetY = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
});

/* ---------- TYPING EFFECT ---------- */
var typedEl = document.getElementById('typedText');
var phrases = [
  'Digital Marketer',
  'Facebook Ads Expert',
  'Google Ads Manager',
  'Social Media Strategist',
  'Meta Certified Professional',
  'Content Creator'
];
var phraseIndex = 0;
var charIndex = 0;
var isDeleting = false;
var typingPause = false;

function type() {
  if (!typedEl) return;
  var currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
    charIndex++;
  }

  var typeSpeed = isDeleting ? 50 : 90;

  if (!isDeleting && charIndex === currentPhrase.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 400;
  }

  setTimeout(type, typeSpeed);
}

setTimeout(type, 1200);

/* ---------- REVEAL ON SCROLL ---------- */
function triggerReveal() {
  var reveals = document.querySelectorAll('.reveal:not(.visible)');
  reveals.forEach(function (el) {
    var rect = el.getBoundingClientRect();
    var windowH = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < windowH - 60) {
      el.classList.add('visible');
      // Trigger counter if inside this element
      var counters = el.querySelectorAll('[data-target]');
      counters.forEach(animateCounter);
    }
  });
}

// Also observe reveal elements using IntersectionObserver for performance
if ('IntersectionObserver' in window) {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger counters
        var counters = entry.target.querySelectorAll('[data-target]');
        counters.forEach(animateCounter);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });
}

/* ---------- ANIMATED COUNTERS ---------- */
var animated = new Set();

function animateCounter(el) {
  if (animated.has(el)) return;
  animated.add(el);

  var target = parseInt(el.getAttribute('data-target'), 10);
  var duration = 1800;
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    // Ease out cubic
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(step);
}

/* Counter observer */
if ('IntersectionObserver' in window) {
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(function (el) {
    counterObserver.observe(el);
  });
}

/* ---------- FLOATING ANIMATION ON HOVER ---------- */
document.querySelectorAll('.service-card').forEach(function (card) {
  card.addEventListener('mouseenter', function () {
    this.style.willChange = 'transform';
  });
  card.addEventListener('mouseleave', function () {
    this.style.willChange = 'auto';
  });
});

/* ---------- SPINNER KEYFRAME ---------- */
var styleTag = document.createElement('style');
styleTag.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
document.head.appendChild(styleTag);

/* ---------- INITIAL CALL ---------- */
updateActiveNav();
