(function () {
  /* Active tab follows scroll position. #top wraps the whole page, so it can't be
     observed like the others: Home stays active until the Work section reaches
     40% of the viewport; Contact wins once you hit the bottom of the page. */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  function setActive(id) {
    links.forEach(function (a) {
      var on = a.getAttribute('data-spy') === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  var order = ['work', 'about', 'contact'];
  function update() {
    var line = window.innerHeight * 0.4, current = 'top';
    order.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= line) current = id;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = 'contact';
    setActive(current);
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* Scroll reveal + count-up. Skipped entirely for reduced motion; only applied to
   elements below the fold so nothing visible at load ever flickers. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var groups = [
    ['.sec-head', 0], ['.featured', 0], ['.grid3 .card', 110], ['.center', 0],
    ['.quote .label', 0], ['.quote blockquote', 0], ['.about-card', 0],
    ['.step', 90], ['.tools .chip', 35], ['.cta-left', 0], ['.contacts', 120], ['.bottom-bar', 0]
  ];
  var vh = window.innerHeight;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
      if (e.target.classList.contains('featured')) countUp(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  groups.forEach(function (g) {
    var els = document.querySelectorAll(g[0]);
    Array.prototype.forEach.call(els, function (el, i) {
      if (el.getBoundingClientRect().top < vh) return;
      el.style.setProperty('--d', (i * g[1]) + 'ms');
      el.classList.add('reveal');
      io.observe(el);
    });
  });
  function countUp(root) {
    Array.prototype.forEach.call(root.querySelectorAll('.impact b'), function (b) {
      var m = b.textContent.match(/^(\d+)(.*)$/); if (!m) return;
      var end = +m[1], suffix = m[2], t0 = null, dur = 1200;
      b.style.fontVariantNumeric = 'tabular-nums';
      function tick(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        b.textContent = Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      b.textContent = '0' + suffix;
      requestAnimationFrame(tick);
    });
  }
})();
