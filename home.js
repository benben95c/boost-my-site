/* BoostMySite - showcase 3D piloté par le scroll (sans dépendance) */
(function () {
  'use strict';
  var section = document.querySelector('.showcase');
  var inner = document.querySelector('.stage-inner');
  if (!section || !inner) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    inner.style.setProperty('--rx', '52deg'); inner.style.setProperty('--rz', '-16deg'); inner.style.setProperty('--sc', '1');
    inner.style.setProperty('--z2', '80px'); inner.style.setProperty('--z3', '160px');
    return;
  }

  var current = 0, target = 0, ticking = false;
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  function measure() {
    var r = section.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    /* 0 quand la section entre par le bas, 1 quand elle atteint le haut */
    var p = (vh - r.top) / (vh + r.height * 0.5);
    target = Math.max(0, Math.min(1, p));
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }

  function frame(t) {
    current = lerp(current, target, 0.09);
    var e = 1 - Math.pow(1 - current, 3);
    var float = Math.sin((t || 0) / 900) * 6;
    inner.style.setProperty('--rx', lerp(62, 50, e).toFixed(2) + 'deg');
    inner.style.setProperty('--rz', lerp(-36, -12, e).toFixed(2) + 'deg');
    inner.style.setProperty('--sc', lerp(0.86, 1, e).toFixed(3));
    inner.style.setProperty('--z2', (lerp(0, 90, e) + float).toFixed(1) + 'px');
    inner.style.setProperty('--z3', (lerp(0, 180, e) + float * 1.6).toFixed(1) + 'px');

    var r = section.getBoundingClientRect();
    var onScreen = r.bottom > 0 && r.top < window.innerHeight;
    if (onScreen || Math.abs(target - current) > 0.001) requestAnimationFrame(frame);
    else ticking = false;
  }

  window.addEventListener('scroll', measure, { passive: true });
  window.addEventListener('resize', measure);
  measure();
})();
