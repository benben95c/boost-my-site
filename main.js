/* BoostMySite - comportements partagés (aucune dépendance) */
(function () {
  'use strict';
  var d = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header : fond au scroll */
  var header = d.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 10); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menu mobile */
  var burger = d.querySelector('.burger');
  var menu = d.querySelector('.mobile-menu');
  function setMenu(open) {
    if (!burger || !menu) return;
    header.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    window.addEventListener('resize', function () { if (window.innerWidth > 920) setMenu(false); });
  }

  /* Apparition au scroll */
  var items = d.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* Légère inclinaison 3D des cartes projets (souris uniquement) */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    d.querySelectorAll('.project').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = 'border-color .3s ease';
        card.style.transform = 'rotateX(' + (-y * 7).toFixed(2) + 'deg) rotateY(' + (x * 9).toFixed(2) + 'deg) translateZ(0)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transition = 'border-color .3s ease, transform .6s ease';
        card.style.transform = '';
      });
    });
  }

  /* Pré-remplissage du message depuis un tarif */
  d.querySelectorAll('[data-offer]').forEach(function (a) {
    a.addEventListener('click', function () {
      var field = d.getElementById('message');
      if (field) field.value = "Bonjour, je souhaite en savoir plus sur l'offre : " + a.getAttribute('data-offer') + ".\n\nMon besoin : ";
    });
  });

  /* Formulaire de contact sécurisé (validation stricte, anti-spam honeypot, anti-flood) */
  var form = d.querySelector('form[data-contact]');
  if (form) {
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('button[type="submit"]');
    var isSubmitting = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isSubmitting) return;

      var hp = form.querySelector('.hp input');
      if (hp && hp.checked) return;

      var name = (form.elements.name ? form.elements.name.value : '').trim().slice(0, 100);
      var email = (form.elements.email ? form.elements.email.value : '').trim().slice(0, 120);
      var msg = (form.elements.message ? form.elements.message.value : '').trim().slice(0, 3000);

      if (!name || name.length < 2) {
        status.className = 'form-status err';
        status.textContent = 'Veuillez renseigner votre nom.';
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.className = 'form-status err';
        status.textContent = 'Veuillez saisir une adresse email valide.';
        return;
      }
      if (!msg || msg.length < 5) {
        status.className = 'form-status err';
        status.textContent = 'Votre message est trop court.';
        return;
      }

      isSubmitting = true;
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Envoi en cours...';
      status.className = 'form-status';
      status.textContent = '';

      var data = new FormData();
      data.append('access_key', '04b21b20-e74c-4086-981e-e7c6585a54d6');
      data.append('subject', 'Nouveau message depuis boost-my-site.com');
      data.append('name', name);
      data.append('email', email);
      data.append('message', msg);

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
        .then(function (res) { return res.json().then(function (j) { return { ok: res.ok && j.success !== false }; }); })
        .then(function (r) {
          if (r.ok) {
            status.className = 'form-status ok';
            status.textContent = 'Message envoyé. Je vous réponds rapidement.';
            form.reset();
          } else {
            status.className = 'form-status err';
            status.textContent = "L'envoi a échoué. Réessayez ou écrivez-moi directement par email.";
          }
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = 'Erreur réseau. Réessayez dans un instant.';
        })
        .then(function () {
          setTimeout(function () {
            btn.disabled = false;
            btn.textContent = label;
            isSubmitting = false;
          }, 1500);
        });
    });
  }

  /* Année du pied de page */
  var y = d.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Accès secret Équipe Dev : 4 clics rapides sur le copyright du bas (ou Shift+Alt+D sur PC) */
  var copySpan = d.querySelector('.footer-bottom span');
  var tapCount = 0;
  var tapTimer = null;
  function goDevApp() {
    var inSubdir = window.location.pathname.indexOf('/metiers/') !== -1 || window.location.pathname.indexOf('/villes/') !== -1;
    window.location.href = (inSubdir ? '../' : '') + 'outils/tournee-clients.html';
  }
  if (copySpan) {
    copySpan.style.userSelect = 'none';
    copySpan.addEventListener('click', function () {
      tapCount++;
      clearTimeout(tapTimer);
      if (tapCount >= 4) {
        tapCount = 0;
        goDevApp();
      } else {
        tapTimer = setTimeout(function () { tapCount = 0; }, 1200);
      }
    });
  }
  window.addEventListener('keydown', function (e) {
    if (e.shiftKey && e.altKey && (e.key === 'D' || e.key === 'd')) {
      goDevApp();
    }
  });
})();
