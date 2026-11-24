(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var vh = function () { return window.innerHeight; };

  // title words: stagger index
  $$('.title .w').forEach(function (w, i) { w.style.setProperty('--k', i); });

  // reveal on scroll
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  // counters
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, to = +el.dataset.to, t0 = performance.now();
      (function tick(t) { var k = clamp((t - t0) / 1600, 0, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4))); if (k < 1 && !reduce) requestAnimationFrame(tick); else el.textContent = to; })(t0);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-to]').forEach(function (el) { cio.observe(el); });

  // header, progress, parallax, scroll-linked sections
  var bar = $('#progress'), head = $('header.top'), hero = $('.hero');
  var pin = $('.pin'), fan = $('.fan'), tl = $('#tl'), tlf = $('#tlfill'), st = $('#steps'), stf = $('#sfill'), map = $('.map'), trail = $('#rmask');
  var par = $$('[data-speed]'), mx = 0, my = 0, ticking = false;
  var stepsEls = st ? $$('.step', st) : [];
  function frac(el, start, end) { var r = el.getBoundingClientRect(); return clamp((vh() * start - r.top) / (r.height + vh() * (start - end)), 0, 1); }
  function frame() {
    ticking = false;
    var y = window.scrollY, h = document.documentElement;
    if (bar) bar.style.width = (y / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
    if (head) head.classList.toggle('stuck', y > 40);
    if (!reduce) {
      par.forEach(function (el) { var s = +el.dataset.speed, m = +el.dataset.mx || 0; el.style.transform = 'translate3d(' + (mx * m) + 'px,' + (y * s + my * m * 0.5) + 'px,0)'; });
      $$('[data-mx]:not([data-speed])').forEach(function (el) { var m = +el.dataset.mx; el.style.translate = (mx * m) + 'px ' + (my * m * .5) + 'px'; });
    }
    if (pin && fan && window.innerWidth > 860) { var r = pin.getBoundingClientRect(); var p = clamp(-r.top / (r.height - vh()) * 1.7, 0, 1); fan.parentNode.style.setProperty('--p', reduce ? 1 : p.toFixed(3)); }
    else if (fan) fan.parentNode.style.setProperty('--p', 1);
    if (tl && tlf) tlf.style.height = (frac(tl, 0.65, 0.35) * 100) + '%';
    if (st && stf) { var f = frac(st, 0.7, 0.4); stf.style.height = (f * 100) + '%'; }
    if (map && trail) { var q = clamp(frac(map, 0.85, 0.35) * 1.15, 0, 1); trail.setAttribute('stroke-dashoffset', (1 - q).toFixed(3)); map.querySelector('.x').style.opacity = q > 0.97 ? 1 : 0; }
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  window.addEventListener('mousemove', function (e) {
    mx = (e.clientX / window.innerWidth - 0.5); my = (e.clientY / window.innerHeight - 0.5);
    var g = $('#glow'); if (g) g.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    if (hero) req();
  });
  frame();

  // 3D tilt on cards
  $$('.era .card, .num').forEach(function (c) {
    c.addEventListener('mousemove', function (e) { var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = 'perspective(700px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)'; });
    c.addEventListener('mouseleave', function () { c.style.transform = ''; });
  });

  // menu
  var bg = $('.burger'), menu = $('#menu');
  if (bg) { bg.addEventListener('click', function () { var o = menu.classList.toggle('open'); bg.setAttribute('aria-expanded', o); }); $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); }); }); }

  // colour themes
  var names = {
    gilded: 'Gilded — gold leaf on dark leather, each era with its own accents.', sepia: 'Sepia — a faded photograph, copper and old gold.', ember: 'Ember — fire and brass on red-brown grounds.',
    regal: 'Regal — oxblood and gold, the colours of courts and crowns.', bronze: 'Bronze — ochre and olive-brown, roads and camps.', ivory: 'Ivory — bone and umber, a daylight manuscript.', smoke: 'Smoke — ash and umber with a lantern glow.'
  };
  var tbs = $$('.tb'), sls = $$('.tsl'), tn = $('#tname'), auto = true, idx = 0;
  function pick(k) { tbs.forEach(function (b) { b.classList.toggle('on', b.dataset.k === k); }); sls.forEach(function (s) { s.classList.toggle('on', s.dataset.k === k); }); if (tn) tn.textContent = names[k]; }
  tbs.forEach(function (b, i) { b.addEventListener('click', function () { auto = false; idx = i; pick(b.dataset.k); }); });
  if (tbs.length && !reduce) setInterval(function () { if (!auto) return; idx = (idx + 1) % tbs.length; pick(tbs[idx].dataset.k); }, 3200);

  // embers
  var cv = $('#embers');
  if (cv && !reduce) {
    var cx = cv.getContext('2d'), W, H, P = [], dpr = Math.min(2, window.devicePixelRatio || 1);
    function size() { W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr; }
    size(); addEventListener('resize', size);
    for (var i = 0; i < 70; i++) P.push({ x: Math.random(), y: Math.random(), r: Math.random() * 2.2 + .5, v: Math.random() * .00035 + .00012, a: Math.random() * 6.28, s: Math.random() * .8 + .2 });
    (function loop(t) {
      cx.clearRect(0, 0, W, H);
      P.forEach(function (p) { p.y -= p.v * 16; p.a += .01; if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        var x = (p.x + Math.sin(p.a) * .02) * W, y = p.y * H, g = cx.createRadialGradient(x, y, 0, x, y, p.r * 6 * dpr);
        g.addColorStop(0, 'rgba(255,220,140,' + (.75 * p.s) + ')'); g.addColorStop(1, 'rgba(217,164,65,0)'); cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, p.r * 6 * dpr, 0, 6.28); cx.fill(); });
      requestAnimationFrame(loop);
    })(0);
  }
})();
