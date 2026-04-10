/* ========================================
   CLEBSON CASTRO — Main JS
   Vanilla JS, no dependencies
   ======================================== */

(function () {
  'use strict';

  // --- Scroll Reveal via IntersectionObserver ---
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Stagger reveal children ---
  function initStaggerReveal() {
    var staggerGroups = document.querySelectorAll('[data-stagger]');
    if (!staggerGroups.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var children = entry.target.querySelectorAll('.reveal');
            children.forEach(function (child, i) {
              child.style.transitionDelay = (i * 0.12) + 's';
              child.classList.add('visible');
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    staggerGroups.forEach(function (group) {
      observer.observe(group);
    });
  }

  // --- Animated counter for stats ---
  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-counter'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(start + (target - start) * eased);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // --- Mobile Nav Toggle ---
  function initMobileNav() {
    var toggle = document.querySelector('.nav__toggle');
    var links = document.querySelector('.nav__links');
    var closeBtn = document.querySelector('.nav__close');
    if (!toggle || !links) return;

    function openNav() {
      toggle.classList.add('active');
      links.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('nav-open');
    }

    function closeNav() {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
      document.body.classList.remove('nav-open');
    }

    toggle.addEventListener('click', function () {
      links.classList.contains('open') ? closeNav() : openNav();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeNav);
    }

    links.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  // --- Nav scroll effect ---
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var scrolled = false;
    window.addEventListener('scroll', function () {
      var isScrolled = window.scrollY > 80;
      if (isScrolled !== scrolled) {
        scrolled = isScrolled;
        nav.style.borderBottomColor = scrolled
          ? 'rgba(26,45,74,0.08)'
          : 'rgba(26,45,74,0.03)';
      }
    }, { passive: true });
  }

  // --- Scroll Spy: active nav link ---
  function initScrollSpy() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav__link');
    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { threshold: 0.2, rootMargin: '-72px 0px -40% 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // --- Scroll Progress Bar ---
  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', function () {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  // --- Article TOC ---
  function initArticleTOC() {
    var tocList = document.querySelector('.artigo-toc__lista');
    if (!tocList) return;

    var headings = document.querySelectorAll('.artigo-conteudo h2');
    if (!headings.length) return;

    headings.forEach(function (heading, i) {
      heading.id = 'section-' + (i + 1);
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + heading.id;
      a.textContent = heading.textContent;
      a.className = 'artigo-toc__link';
      li.appendChild(a);
      tocList.appendChild(li);
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocList.querySelectorAll('a').forEach(function (a) { a.classList.remove('active'); });
        var link = tocList.querySelector('a[href="#' + entry.target.id + '"]');
        if (link) link.classList.add('active');
      });
    }, { threshold: 0.5, rootMargin: '-72px 0px -50% 0px' });

    headings.forEach(function (h) { observer.observe(h); });
  }

  // --- Form Validation ---
  function initFormValidation() {
    var form = document.querySelector('.contact__form');
    if (!form) return;

    form.setAttribute('novalidate', '');

    // Inject error spans
    form.querySelectorAll('.contact__field').forEach(function (field) {
      var input = field.querySelector('input, textarea');
      if (!input) return;
      var err = document.createElement('span');
      err.className = 'contact__field__error';
      err.setAttribute('role', 'alert');
      err.textContent = input.type === 'email' ? 'E-mail inválido' : 'Campo obrigatório';
      field.appendChild(err);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll('.contact__field').forEach(function (field) {
        var input = field.querySelector('input, textarea');
        if (!input) return;
        var isEmpty = !input.value.trim();
        var isInvalidEmail = input.type === 'email' && input.value.trim() &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());

        if (isEmpty || isInvalidEmail) {
          field.classList.add('has-error');
          valid = false;
        } else {
          field.classList.remove('has-error');
        }
      });

      if (valid) {
        form.submit();
      }
    });

    // Clear error on input
    form.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.contact__field');
        if (field) field.classList.remove('has-error');
      });
    });
  }

  // --- Back to Top ---
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Cursor Magnético ---
  function initCursor() {
    var dot  = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    // Só ativa em dispositivos com mouse fino
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var mouseX = window.innerWidth  / 2;
    var mouseY = window.innerHeight / 2;
    var ringX  = mouseX;
    var ringY  = mouseY;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    document.addEventListener('mouseleave', function () {
      document.body.classList.add('cursor-hidden');
    });

    document.addEventListener('mouseenter', function () {
      document.body.classList.remove('cursor-hidden');
    });

    // Anel: lag suave de luxo
    (function animateRing() {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    // Hover: dot cresce em links e botões
    var interactives = document.querySelectorAll('a, button, [role="button"]');
    interactives.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor-hover');
      });
    });

    // Texto: dot vira cursor de texto em parágrafos
    var texts = document.querySelectorAll('p, h1, h2, h3, blockquote');
    texts.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor-text');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor-text');
      });
    });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initStaggerReveal();
    initCounters();
    initMobileNav();
    initNavScroll();
    initScrollSpy();
    initScrollProgress();
    initArticleTOC();
    initFormValidation();
    initBackToTop();
    initCursor();
  });
})();
