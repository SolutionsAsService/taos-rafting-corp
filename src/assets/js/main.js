/* Taos River Adventures — progressive enhancement. The site works without JS. */
(function () {
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile navigation */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); } });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  }

  /* Header becomes solid after scrolling past the hero */
  var header = document.querySelector('.site-header');
  var heroMedia = document.querySelector('[data-parallax]');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || 0;
    if (header && !header.classList.contains('site-header--solid')) header.classList.toggle('is-solid', y > 40);
    if (heroMedia && !reduce && y < window.innerHeight * 1.2) heroMedia.style.transform = 'translate3d(0,' + (y * 0.35).toFixed(1) + 'px,0)';
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Trip filters */
  var filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    var cards = document.querySelectorAll('[data-categories]');
    var status = document.querySelector('[data-filter-status]');
    var chips = filterBar.querySelectorAll('[data-filter]');
    var apply = function (key, updateHash) {
      var shown = 0;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.filter === key)); });
      cards.forEach(function (card) {
        var match = key === 'all' || card.dataset.categories.split(' ').indexOf(key) !== -1;
        card.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });
      if (status) status.textContent = 'Showing ' + shown + ' of ' + cards.length + ' trips';
      if (updateHash) history.replaceState(null, '', key === 'all' ? location.pathname : '#' + key);
    };
    chips.forEach(function (c) { c.addEventListener('click', function () { apply(c.dataset.filter, true); }); });
    var initial = (location.hash || '').slice(1);
    if (initial && filterBar.querySelector('[data-filter="' + initial + '"]')) apply(initial, false);
  }

  /* Booking request form: composes an email (no server, no tracking) */
  var form = document.querySelector('[data-booking-form]');
  if (form) {
    var params = new URLSearchParams(location.search);
    var trip = params.get('trip');
    var select = form.querySelector('[name="trip"]');
    if (trip && select && select.querySelector('option[value="' + trip + '"]')) select.value = trip;
    var dateInput = form.querySelector('[name="date"]');
    if (dateInput) { var t = new Date(); dateInput.min = new Date(t.getTime() - t.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var tripLabel = select ? select.options[select.selectedIndex].text : '';
      var lines = [
        'Hello! I would like to request a trip.', '',
        'Trip: ' + tripLabel,
        'Preferred date: ' + (d.get('date') || 'Flexible'),
        'Adults: ' + (d.get('adults') || ''),
        'Children: ' + (d.get('children') || '0'),
        'Name: ' + (d.get('name') || ''),
        'Phone: ' + (d.get('phone') || ''), '',
        'Notes / questions:', (d.get('notes') || '')
      ];
      var subject = 'Trip request: ' + tripLabel + (d.get('date') ? ' on ' + d.get('date') : '');
      var href = 'mailto:' + form.dataset.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      var out = form.querySelector('[data-form-status]');
      if (out) out.textContent = 'Opening your email app… If nothing happens, email us at ' + form.dataset.email + '.';
      window.location.href = href;
    });
  }

  /* Gallery lightbox */
  var dialog = document.querySelector('[data-lightbox]');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox-item]'));
  if (dialog && items.length && typeof dialog.showModal === 'function') {
    var img = dialog.querySelector('img');
    var cap = dialog.querySelector('figcaption');
    var idx = 0, opener = null;
    var show = function (i) {
      idx = (i + items.length) % items.length;
      var b = items[idx];
      img.src = b.dataset.full; img.alt = b.dataset.alt;
      img.width = b.dataset.w; img.height = b.dataset.h;
      cap.innerHTML = b.dataset.caption;
    };
    items.forEach(function (b, i) { b.addEventListener('click', function () { opener = b; show(i); dialog.showModal(); }); });
    dialog.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    dialog.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    dialog.querySelector('.lb-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () { if (opener) opener.focus(); });
  }
})();
