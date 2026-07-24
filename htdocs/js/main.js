/* ==========================================================================
   Woodintole Property Ltd — Shared JavaScript
   No frameworks or dependencies. Organised by feature. Every feature checks
   that its markup exists on the page before running, so this one file can
   be safely included on every page of the site.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     SHARED SPINNING HOUSE
     ------------------------------------------------------------------ */
  (function spinningHouse() {
    var heroes = document.querySelectorAll('[data-spinning-house]');
    if (!heroes.length) return;

    heroes.forEach(function (hero) {
      if (hero.querySelector('.wireframe-stage')) return;

      var stage = document.createElement('div');
      stage.className = 'wireframe-stage';
      stage.setAttribute('aria-hidden', 'true');
      stage.innerHTML =
        '<div class="ground-ring r2"></div>' +
        '<div class="ground-ring"></div>' +
        '<div class="rig">' +
          '<div class="house-anchor">' +
            '<div class="house">' +
              '<div class="face wall front"></div>' +
              '<div class="face wall back"></div>' +
              '<div class="face wall left"></div>' +
              '<div class="face wall right"></div>' +
              '<div class="face door"></div>' +
              '<div class="face window w1"></div>' +
              '<div class="face window w2"></div>' +
              '<div class="face roof-front crisp"></div>' +
              '<div class="face roof-back crisp"></div>' +
              '<div class="gable left">' +
                '<svg viewBox="0 0 220 80"><polygon points="110,0 0,80 220,80" fill="none" stroke="#33d9c9" stroke-width="1.2" stroke-opacity="0.62"></polygon></svg>' +
              '</div>' +
              '<div class="gable right">' +
                '<svg viewBox="0 0 220 80"><polygon points="110,0 0,80 220,80" fill="none" stroke="#33d9c9" stroke-width="1.2" stroke-opacity="0.62"></polygon></svg>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';

      hero.appendChild(stage);
    });
  })();

  /* ------------------------------------------------------------------
     1. MOBILE NAVIGATION MENU
     ------------------------------------------------------------------ */
  (function mobileNav() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.nav-links');
    var scrim = document.querySelector('.nav-scrim');
    if (!toggle || !nav) return;

    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      if (scrim) scrim.classList.remove('is-visible');
    }
    function openMenu() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      if (scrim) scrim.classList.add('is-visible');
    }
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });
    if (scrim) scrim.addEventListener('click', closeMenu);
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  })();

  /* ------------------------------------------------------------------
     2. SCROLL-TRIGGERED REVEALS
     ------------------------------------------------------------------ */
  (function scrollReveals() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  })();

  /* ------------------------------------------------------------------
     3. ANIMATED STATISTICS (count up when scrolled into view)
     ------------------------------------------------------------------ */
  (function animatedStats() {
    var stats = document.querySelectorAll('[data-count-to]');
    if (!stats.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

      if (prefersReducedMotion) {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
        return;
      }

      var duration = 1400;
      var start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = target * eased;
        el.textContent = prefix + value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      stats.forEach(animate);
      return;
    }

    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    stats.forEach(function (el) { statObserver.observe(el); });
  })();

  /* ------------------------------------------------------------------
     4. CURSOR-RESPONSIVE HERO LIGHTING
     ------------------------------------------------------------------ */
  (function heroGlow() {
    var hero = document.querySelector('.hero');
    var glow = document.querySelector('.hero-glow');
    if (!hero || !glow || prefersReducedMotion) return;

    hero.addEventListener('pointermove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      glow.style.transform = 'translate(' + (x - rect.width / 2) * 0.12 + 'px, ' + (y - rect.height / 2) * 0.12 + 'px)';
    });
  })();

  /* ------------------------------------------------------------------
     5. PORTFOLIO FILTERING
     ------------------------------------------------------------------ */
  (function portfolioFilter() {
    var buttons = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('[data-property-type]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        var filter = btn.getAttribute('data-filter');

        cards.forEach(function (card) {
          var type = card.getAttribute('data-property-type');
          var show = filter === 'all' || filter === type;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  })();

  /* ------------------------------------------------------------------
     6. IMAGE GALLERY LIGHTBOX
     ------------------------------------------------------------------ */
  (function galleryLightbox() {
    var gallery = document.querySelector('.gallery');
    var lightbox = document.querySelector('.lightbox');
    if (!gallery || !lightbox) return;

    var lightboxImg = lightbox.querySelector('img');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('button'));
    var currentIndex = 0;
    var lastFocused = null;

    function show(index) {
      currentIndex = (index + thumbs.length) % thumbs.length;
      var img = thumbs[currentIndex].querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
    function open(index) {
      lastFocused = document.activeElement;
      show(index);
      lightbox.classList.add('is-open');
      closeBtn.focus();
    }
    function close() {
      lightbox.classList.remove('is-open');
      if (lastFocused) lastFocused.focus();
    }

    thumbs.forEach(function (btn, i) {
      btn.addEventListener('click', function () { open(i); });
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(currentIndex - 1); });
    nextBtn.addEventListener('click', function () { show(currentIndex + 1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(currentIndex - 1);
      if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
  })();

  /* ------------------------------------------------------------------
     7. STATIC CONTACT FORM (no backend yet)
     ------------------------------------------------------------------ */
  (function contactForm() {
    var form = document.querySelector('#contact-form');
    if (!form) return;

    /*
      SUBMISSION HANDLER PLACEHOLDER
      This form currently prevents default submission and shows a static
      confirmation message. To connect it to a real service later:
        - Replace this handler with a fetch() call to a form endpoint
          (e.g. Formspree, Netlify Forms, a custom API route), or
        - Remove preventDefault() and set a real `action` and `method`
          on the <form> element in contact.html.
    */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var confirmation = document.querySelector('#form-confirmation');
      form.setAttribute('hidden', 'true');
      if (confirmation) confirmation.removeAttribute('hidden');
    });
  })();

  /* ------------------------------------------------------------------
     8. SMOOTH SCROLL FOR ON-PAGE ANCHORS
     ------------------------------------------------------------------ */
  (function anchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  })();

  /* ------------------------------------------------------------------
     9. HEADER SHADOW / STATE ON SCROLL
     ------------------------------------------------------------------ */
  (function headerState() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    function update() {
      if (window.scrollY > 8) header.style.boxShadow = '0 12px 30px -20px rgba(0,0,0,0.5)';
      else header.style.boxShadow = 'none';
    }
    document.addEventListener('scroll', update, { passive: true });
    update();
  })();

});
