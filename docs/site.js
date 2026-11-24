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
    if (pin && fan && window.innerWidth > 860) { var r = pin.getBoundingClientRect(); var p = clamp(-r.top / (r.height - vh()) * 1.3, 0, 1); fan.parentNode.style.setProperty('--p', reduce ? 1 : p.toFixed(3)); }
    else if (fan) fan.parentNode.style.setProperty('--p', 1);
    if (tl && tlf) tlf.style.height = (frac(tl, 0.65, 0.35) * 100) + '%';
    
    if (map && trail) {
      var q = clamp(frac(map, 0.85, 0.3) * 1.2, 0, 1);
      trail.setAttribute('stroke-dasharray', q.toFixed(3) + ' 2');
      $$('.pl', map).forEach(function (g) { g.classList.toggle('on', q >= +g.dataset.at - 0.02); });
      var xm = $('.xm', map); if (xm) xm.classList.toggle('on', q > 0.98);
    }
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

  // back to top and menu scroll-spy
  var bt = $('.backtop');
  if (bt) { bt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }); addEventListener('scroll', function () { bt.classList.toggle('show', scrollY > 900); }, { passive: true }); }
  var links = $$('#menu a'), secs = links.map(function (a) { var h = a.getAttribute('href'); return h.indexOf('#') > -1 && h.indexOf('index.html') === 0 ? $(h.slice(h.indexOf('#'))) : null; });
  if (secs.some(Boolean) && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a, i) { a.classList.toggle('on', secs[i] === e.target); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { if (s) spy.observe(s); });
  }

  // table of contents of the legal pages
  var tocs = $$('.toc a');
  if (tocs.length && 'IntersectionObserver' in window) {
    var tspy = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) tocs.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); }); }, { rootMargin: '-20% 0px -70% 0px' });
    $$('.doc h2[id]').forEach(function (h) { tspy.observe(h); });
  }

  // library filters
  var libEl = $('#lib');
  if (libEl) {
    var flt = { era: 'all', series: 'all' }, cards = $$('.lcard', libEl), emp = $('#libempty');
    $$('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        flt[c.dataset.f] = c.dataset.v;
        $$('.chip[data-f="' + c.dataset.f + '"]').forEach(function (x) { x.classList.toggle('on', x === c); });
        var n = 0;
        cards.forEach(function (k) { var ok = (flt.era === 'all' || k.dataset.era === flt.era) && (flt.series === 'all' || k.dataset.series === flt.series); k.classList.toggle('off', !ok); if (ok) n++; });
        emp.hidden = n > 0;
      });
    });
  }

  // copy buttons of the press kit
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var txt = b.dataset.copy.charAt(0) === '#' && b.dataset.copy.length < 8 ? b.dataset.copy : ($(b.dataset.copy) || {}).innerText || b.dataset.copy, old = b.innerHTML;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { b.classList.add('done'); b.innerHTML = b.dataset.done || 'Copied'; setTimeout(function () { b.classList.remove('done'); b.innerHTML = old; }, 1600); }).catch(function () {});
    });
  });

  // menu
  var bg = $('.burger'), menu = $('#menu');
  if (bg) { bg.addEventListener('click', function () { var o = menu.classList.toggle('open'); bg.setAttribute('aria-expanded', o); }); $$('#menu a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); }); }); }

  // colour themes
  var tbs = $$('.tb'), sls = $$('.tsl'), tn = $('#tname'), auto = true, idx = 0;
  function pick(k) { tbs.forEach(function (b) { b.classList.toggle('on', b.dataset.k === k); }); sls.forEach(function (s) { s.classList.toggle('on', s.dataset.k === k); }); var b = tbs.filter(function (x) { return x.dataset.k === k; })[0]; if (tn && b) tn.innerHTML = b.dataset.desc; }
  tbs.forEach(function (b, i) { b.addEventListener('click', function () { auto = false; idx = i; pick(b.dataset.k); }); });
  if (tbs.length && !reduce) setInterval(function () { if (!auto) return; idx = (idx + 1) % tbs.length; pick(tbs[idx].dataset.k); }, 3200);

  // embers (a glow sprite drawn once and stamped per frame; paused while the tab is hidden)
  var cv = $('#embers');
  if (cv && !reduce) {
    var cx = cv.getContext('2d'), W, H, P = [], dpr = Math.min(2, window.devicePixelRatio || 1), spr = document.createElement('canvas');
    spr.width = spr.height = 64; var sg = spr.getContext('2d'), gr = sg.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,225,150,1)'); gr.addColorStop(0.35, 'rgba(240,180,80,.45)'); gr.addColorStop(1, 'rgba(217,164,65,0)'); sg.fillStyle = gr; sg.fillRect(0, 0, 64, 64);
    function size() { W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr; }
    size(); addEventListener('resize', size);
    var n = innerWidth < 700 ? 34 : 64;
    for (var i = 0; i < n; i++) P.push({ x: Math.random(), y: Math.random(), r: Math.random() * 12 + 5, v: Math.random() * .00035 + .00012, a: Math.random() * 6.28, s: Math.random() * .7 + .25 });
    (function loop() {
      if (!document.hidden) {
        cx.clearRect(0, 0, W, H);
        P.forEach(function (p) {
          p.y -= p.v * 16; p.a += .01; if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
          cx.globalAlpha = p.s; var r = p.r * dpr; cx.drawImage(spr, (p.x + Math.sin(p.a) * .02) * W - r, p.y * H - r, r * 2, r * 2);
        });
      }
      requestAnimationFrame(loop);
    })();
  }
})();
