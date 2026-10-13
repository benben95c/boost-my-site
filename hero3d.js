/* BoostMySite - scène 3D du hero (Three.js) */
import * as THREE from 'three';

(function () {
  var wrap = document.querySelector('.hero-canvas');
  if (!wrap) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { return; }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  wrap.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  var BLUE = new THREE.Color(0x3d6bff);
  var VIOLET = new THREE.Color(0x8a5cff);

  /* Lumières */
  scene.add(new THREE.AmbientLight(0x8ea0ff, 0.25));
  var l1 = new THREE.DirectionalLight(0x6f8cff, 1.5); l1.position.set(5, 4, 6); scene.add(l1);
  var l2 = new THREE.DirectionalLight(0xa070ff, 1.6); l2.position.set(-6, -3, 4); scene.add(l2);

  var rig = new THREE.Group();
  scene.add(rig);

  /* Noyau facetté, dégradé bleu -> violet par sommet */
  var coreGeo = new THREE.IcosahedronGeometry(1.45, 1).toNonIndexed();
  var pos = coreGeo.attributes.position;
  var colors = new Float32Array(pos.count * 3);
  var tmp = new THREE.Color();
  for (var i = 0; i < pos.count; i++) {
    var t = (pos.getY(i) + 1.45) / 2.9;
    tmp.copy(BLUE).lerp(VIOLET, t);
    colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
  }
  coreGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  var core = new THREE.Mesh(coreGeo, new THREE.MeshStandardMaterial({
    vertexColors: true, flatShading: true, metalness: 0.7, roughness: 0.28
  }));
  rig.add(core);

  /* Cage filaire */
  var cage = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.2, 1)),
    new THREE.LineBasicMaterial({ color: 0x8a5cff, transparent: true, opacity: 0.28 })
  );
  rig.add(cage);

  /* Anneaux + satellites */
  var rings = [];
  var ringDefs = [
    { r: 2.9, tilt: [1.15, 0.2, 0], color: 0x3d6bff, speed: 0.35 },
    { r: 3.3, tilt: [0.4, 0.9, 0.3], color: 0x8a5cff, speed: -0.25 },
    { r: 3.7, tilt: [-0.7, 0.3, 0.8], color: 0x6a7dff, speed: 0.18 }
  ];
  ringDefs.forEach(function (def) {
    var g = new THREE.Group();
    g.rotation.set(def.tilt[0], def.tilt[1], def.tilt[2]);
    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(def.r, 0.008, 8, 220),
      new THREE.MeshBasicMaterial({ color: def.color, transparent: true, opacity: 0.35 })
    );
    var sat = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.13, 0),
      new THREE.MeshStandardMaterial({ color: def.color, emissive: def.color, emissiveIntensity: 0.6, flatShading: true })
    );
    g.add(ring); g.add(sat);
    rig.add(g);
    rings.push({ group: g, sat: sat, r: def.r, speed: def.speed, a: Math.random() * Math.PI * 2 });
  });

  /* Mise en page responsive */
  var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  var w = 1, h = 1;
  function layout() {
    w = wrap.clientWidth || 1; h = wrap.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    var wide = w / h > 1.15;
    rig.position.x = wide ? 3.6 : 0;
    rig.position.y = wide ? 0 : 2.6;
    var s = wide ? 0.95 : Math.min(0.7, w / 640);
    rig.scale.setScalar(s);
    rig.userData.base = { x: rig.position.x, y: rig.position.y, s: s };
    if (reduce) draw(0);
  }
  window.addEventListener('resize', layout);
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(wrap);

  window.addEventListener('pointermove', function (e) {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* Boucle (en pause quand le hero n'est plus visible) */
  var visible = true, running = false, last = performance.now(), time = 0;
  function draw(dt) {
    time += dt;
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    var p = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.4);
    var b = rig.userData.base || { x: 0, y: 0, s: 1 };

    core.rotation.y = time * 0.25 + p * 1.6;
    core.rotation.x = time * 0.12;
    cage.rotation.y = -time * 0.08 - p * 0.8;
    cage.rotation.z = time * 0.05;

    rig.rotation.y = mouse.x * 0.35;
    rig.rotation.x = mouse.y * 0.2 + p * 0.5;
    rig.position.x = b.x - p * 0.8;
    rig.position.y = b.y + p * 1.4;
    rig.scale.setScalar(b.s * (1 - p * 0.18));

    rings.forEach(function (rg) {
      rg.a += rg.speed * dt;
      rg.sat.position.set(Math.cos(rg.a) * rg.r, Math.sin(rg.a) * rg.r, 0);
    });
    renderer.render(scene, camera);
  }
  function loop(now) {
    if (!visible) { running = false; return; }
    var dt = Math.min((now - last) / 1000, 0.05); last = now;
    draw(dt);
    requestAnimationFrame(loop);
  }
  function start() { if (running || reduce) return; running = true; last = performance.now(); requestAnimationFrame(loop); }

  layout();
  if (reduce) { draw(0); return; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start();
    }, { threshold: 0 }).observe(wrap);
  }
  start();
})();
