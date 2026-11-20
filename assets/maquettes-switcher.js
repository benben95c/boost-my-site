/**
 * BoostMySite — Système Universel de Maquettes Métiers & Projection Client en Direct
 * Menu défilant (12 secteurs d'activité) + Personnalisation instantanée au nom du commerce
 */
(function () {
  'use strict';

  const MAQUETTES_CATALOG = [
    {
      id: 'fastfood',
      label: 'Fast-Food & Burger',
      shortLabel: 'Fast-Food',
      icon: '🍔',
      file: 'fastfood-smash.html',
      defaultBrand: "L'Atelier du Smash",
      pack: 'pro',
      price: 990,
      tagline: 'Click & Collect 0% commission, composition menu, suppléments & sauces',
      features: ['Commande Click & Collect sans commission', 'Choix viandes, sauces & suppléments', 'Réception directe WhatsApp Caisse', 'QR Code tables & comptoir']
    },
    {
      id: 'restaurant',
      label: 'Restaurant & Brasserie',
      shortLabel: 'Restaurant',
      icon: '🥩',
      file: 'restaurant-braise.html',
      defaultBrand: "L'Atelier Braise",
      pack: 'pro',
      price: 990,
      tagline: 'Réservation de table en direct, choix de salle, carte de saison & à emporter',
      features: ['Réservation de table avec choix de zone', 'Carte interactive & origines produits', 'Module Click & Collect à emporter', 'Fiche Google Maps & avis clients']
    },
    {
      id: 'boulangerie',
      label: 'Boulangerie & Pâtisserie',
      shortLabel: 'Boulangerie',
      icon: '🥖',
      file: 'boulangerie-patisserie.html',
      defaultBrand: 'Maison Levain & Dorure',
      pack: 'pro',
      price: 990,
      tagline: 'Pré-commande formules midi coupe-file, gâteaux d’anniversaire sur-mesure & fournées',
      features: ['Click & Collect Formules Midi sans queue', 'Configurateur gâteaux événements & plaque', 'Horaires des fournées chaudes en direct', 'Catalogue pains au levain & pâtisseries']
    },
    {
      id: 'barber',
      label: 'Barber Shop & Coiffeur',
      shortLabel: 'Barber / Coiffeur',
      icon: '💈',
      file: 'barber-coiffure.html',
      defaultBrand: 'Maison Lame & Ciseaux',
      pack: 'starter',
      price: 490,
      tagline: 'Réservation de créneau en ligne, choix du barbier/coiffeur, tarifs & lookbook',
      features: ['Prise de RDV par coiffeur & créneau', 'Carte des coupes, dégradés & soins barbe', 'Lookbook photos & réalisations', 'Rappel WhatsApp anti-lapin']
    },
    {
      id: 'beaute',
      label: 'Institut de Beauté & Nails',
      shortLabel: 'Institut / Nails',
      icon: '💅',
      file: 'institut-beaute.html',
      defaultBrand: "L'Écrin de Soie",
      pack: 'starter',
      price: 490,
      tagline: 'Carte des soins (Onglerie, Head Spa, Visage), réservation en ligne & carte cadeau',
      features: ['Réservation soins par durée & praticienne', 'Catalogue Onglerie, Head Spa & Visage', 'Générateur de Carte Cadeau personnalisée', 'Galerie résultats & avis vérifiés']
    },
    {
      id: 'pizzeria',
      label: 'Pizzeria & Trattoria Italienne',
      shortLabel: 'Pizzeria',
      icon: '🍕',
      file: 'pizzeria-italien.html',
      defaultBrand: 'Forno Napoli',
      pack: 'pro',
      price: 990,
      tagline: 'Commande pizzas à emporter avec heure de sortie du four, suppléments & table',
      features: ['Commande Click & Collect sortie du four', 'Personnalisation pizza (burrata, truffe...)', 'Offre fidélité (10ème pizza offerte)', 'Réservation de table en salle ou terrasse']
    },
    {
      id: 'sushi',
      label: 'Sushi, Poké Bowl & Asiatique',
      shortLabel: 'Sushi & Poké',
      icon: '🍣',
      file: 'sushi-asiatique.html',
      defaultBrand: 'Kensho Sushi & Poké',
      pack: 'pro',
      price: 990,
      tagline: 'Box plateaux signatures, composeur de Poké Bowl sur-mesure & commande en ligne',
      features: ['Configurateur Poké Bowl étape par étape', 'Catalogue Plateaux, California & Wok', 'Panier Click & Collect & Livraison', 'Photos HD de chaque pièce']
    },
    {
      id: 'garage',
      label: 'Garage Auto & Carrosserie',
      shortLabel: 'Garage Auto',
      icon: '🔧',
      file: 'garage-auto.html',
      defaultBrand: 'Pôle Auto Performance',
      pack: 'pro',
      price: 990,
      tagline: 'Devis entretien instantané, RDV atelier (révision, pneus, freins) & véhicules occasion',
      features: ['Simulateur tarif révision / freins / pneus', 'Prise de RDV atelier par immatriculation', 'Catalogue véhicules d’occasion garantis', 'Bouton dépannage & remorquage']
    },
    {
      id: 'artisan',
      label: 'Artisan Rénovation & BTP',
      shortLabel: 'Artisan BTP',
      icon: '🏗️',
      file: 'artisan-elite.html',
      defaultBrand: 'Atelier Apex Rénovation',
      pack: 'pro',
      price: 990,
      tagline: 'Comparateur Avant/Après interactif, configurateur matériaux & chiffrage travaux',
      features: ['Slider Avant / Après chantiers réels', 'Estimateur de budget travaux en direct', 'Mise en avant Décennale & RGE Qualibat', 'Prise de RDV visite technique']
    },
    {
      id: 'depannage',
      label: 'Plombier, Serrurier & Électricien 24/7',
      shortLabel: 'Dépannage 24/7',
      icon: '🚨',
      file: 'depannage-urgence.html',
      defaultBrand: 'SOS Artisans Express',
      pack: 'pro',
      price: 990,
      tagline: 'Diagnostic urgence avec prix fixe annoncé avant déplacement & appel direct 30 min',
      features: ['Simulateur tarif fixe anti-arnaque', 'Urgence Plomberie, Serrurerie, Électricité', 'Agrément assurances habitation', 'Appel d’urgence 1-clic & WhatsApp photo']
    },
    {
      id: 'commerce',
      label: 'Boucherie, Épicerie, Fleuriste & Boutique',
      shortLabel: 'Boucherie / Boutique',
      icon: '🥩',
      file: 'commerce-boutique.html',
      defaultBrand: 'Les Halles du Terroir',
      pack: 'pro',
      price: 990,
      tagline: 'Colis boucherie, plateaux traiteur, calculateur de portions & retrait coupe-file',
      features: ['Pré-commande colis viande & rôtisserie', 'Calculateur de quantités par convives', 'Retrait coupe-file en boutique', 'Mise en avant savoir-faire & producteurs']
    },
    {
      id: 'vtc',
      label: 'Chauffeur Privé VTC & Taxi',
      shortLabel: 'Chauffeur VTC',
      icon: '🚘',
      file: 'chauffeur-prestige.html',
      defaultBrand: 'Prestige Drive Paris',
      pack: 'pro',
      price: 990,
      tagline: 'Calculateur de tarif course, forfaits aéroports CDG/Orly & réservation directe',
      features: ['Simulateur de tarif course & aéroports', 'Présentation flotte Berline & Van VIP', 'Réservation sans commission Uber/Bolt', 'Confirmation instantanée WhatsApp']
    }
  ];

  window.BMSMaquettes = {
    catalog: MAQUETTES_CATALOG,
    getById: function (id) {
      return MAQUETTES_CATALOG.find(m => m.id === id) || MAQUETTES_CATALOG[0];
    },
    getByFile: function (filename) {
      return MAQUETTES_CATALOG.find(m => filename.indexOf(m.file) !== -1) || MAQUETTES_CATALOG[0];
    }
  };

  // Ne pas injecter la barre si on est sur la page parente maquettes.html ou portfolio.html
  const path = window.location.pathname || '';
  if (path.indexOf('/sites/') === -1) return;

  function initSwitcherBar() {
    const params = new URLSearchParams(window.location.search);
    // Si la maquette est chargée dans l'iframe d'aperçu avec ?embed=1, on garde la barre compacte ou on applique juste le nom client
    const isEmbed = params.get('embed') === '1';
    const currentItem = window.BMSMaquettes.getByFile(path);

    // Récupérer le nom du client personnalisé (URL ?client=... ou sessionStorage)
    let clientName = params.get('client') || '';
    if (clientName) {
      try { sessionStorage.setItem('bms_demo_client_name', clientName); } catch (e) {}
    } else {
      try { clientName = sessionStorage.getItem('bms_demo_client_name') || ''; } catch (e) {}
    }

    // Appliquer le nom du client sur la maquette
    function applyCustomClientName(name) {
      const clean = (name || '').trim();
      const targetName = clean || currentItem.defaultBrand;
      document.querySelectorAll('[data-bms-brand], .brand, .logo-text, .nav-brand').forEach(el => {
        if (!el.dataset.originalBrand) {
          el.dataset.originalBrand = el.textContent.trim();
        }
        el.textContent = clean ? clean : el.dataset.originalBrand;
      });
      const badgeEl = document.getElementById('bmsClientInput');
      if (badgeEl && badgeEl.value !== clean) {
        badgeEl.value = clean;
      }
      if (clean) {
        document.title = `${clean} — Maquette ${currentItem.shortLabel} | BoostMySite`;
      }
    }

    if (clientName) {
      setTimeout(() => applyCustomClientName(clientName), 50);
    }

    if (isEmbed) return;

    // Supprimer l'ancienne .demo-bar statique si présente pour éviter un doublon
    const oldDemoBar = document.querySelector('.demo-bar');
    if (oldDemoBar) oldDemoBar.style.display = 'none';

    const style = document.createElement('style');
    style.textContent = `
      .bms-switcher-wrap {
        position: sticky;
        top: 0;
        z-index: 99990;
        background: rgba(15, 23, 42, 0.97);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        color: #F8FAFC;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.28);
        user-select: none;
      }
      .bms-sw-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 7px 14px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        flex-wrap: wrap;
      }
      .bms-sw-brand {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font-size: 12px;
        font-weight: 800;
        color: #fff;
        text-decoration: none;
        letter-spacing: -0.01em;
      }
      .bms-sw-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10B981;
        box-shadow: 0 0 8px #10B981;
      }
      .bms-sw-controls {
        display: flex;
        align-items: center;
        gap: 7px;
        flex-wrap: wrap;
      }
      .bms-client-box {
        display: inline-flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.09);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 7px;
        padding: 3px 8px;
        gap: 5px;
      }
      .bms-client-box span {
        font-size: 11px;
        color: #94A3B8;
        font-weight: 600;
      }
      .bms-client-inp {
        background: transparent;
        border: none;
        color: #34D399;
        font-size: 12px;
        font-weight: 700;
        width: 145px;
        outline: none;
        font-family: inherit;
      }
      .bms-client-inp::placeholder {
        color: #64748B;
        font-weight: 500;
      }
      .bms-btn-devis {
        background: linear-gradient(135deg, #16A34A, #10B981);
        color: #fff !important;
        text-decoration: none !important;
        font-size: 11.5px;
        font-weight: 800;
        padding: 5px 11px;
        border-radius: 7px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border: none;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.35);
        transition: transform 0.15s;
        white-space: nowrap;
      }
      .bms-btn-devis:hover {
        transform: translateY(-1px);
      }
      .bms-btn-hide {
        background: rgba(255, 255, 255, 0.08);
        color: #CBD5E1;
        border: 1px solid rgba(255, 255, 255, 0.14);
        font-size: 11px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 6px;
        cursor: pointer;
      }
      .bms-sw-scroll {
        display: flex;
        align-items: center;
        gap: 6px;
        overflow-x: auto;
        padding: 7px 14px;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }
      .bms-sw-scroll::-webkit-scrollbar {
        display: none;
      }
      .bms-sw-pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 11px;
        border-radius: 999px;
        font-size: 11.5px;
        font-weight: 600;
        color: #CBD5E1 !important;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-decoration: none !important;
        white-space: nowrap;
        transition: all 0.15s;
        flex-shrink: 0;
      }
      .bms-sw-pill:hover {
        background: rgba(255, 255, 255, 0.14);
        color: #fff !important;
      }
      .bms-sw-pill.active {
        background: #3B82F6;
        color: #fff !important;
        border-color: #60A5FA;
        font-weight: 700;
        box-shadow: 0 2px 10px rgba(59, 130, 246, 0.45);
      }
      .bms-sw-reopen {
        position: fixed;
        bottom: 16px;
        left: 16px;
        z-index: 99995;
        background: #0F172A;
        color: #fff;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 999px;
        padding: 8px 14px;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(0,0,0,0.35);
        display: none;
        align-items: center;
        gap: 6px;
      }
      @media (max-width: 640px) {
        .bms-sw-top { padding: 6px 10px; }
        .bms-sw-scroll { padding: 6px 10px; }
        .bms-client-inp { width: 115px; }
      }
    `;
    document.head.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.className = 'bms-switcher-wrap';
    wrapper.id = 'bmsSwitcherBar';

    const pillsHtml = MAQUETTES_CATALOG.map(item => {
      const isActive = item.id === currentItem.id;
      return `<a href="${item.file}" class="bms-sw-pill ${isActive ? 'active' : ''}" data-maquette-id="${item.id}">
        <span>${item.icon}</span>
        <span>${item.shortLabel}</span>
      </a>`;
    }).join('');

    wrapper.innerHTML = `
      <div class="bms-sw-top">
        <div style="display:flex; align-items:center; gap:10px;">
          <a href="../portfolio.html" class="bms-sw-brand" title="Retour aux réalisations">
            <span class="bms-sw-dot"></span>
            <span>BoostMySite • Showroom (${MAQUETTES_CATALOG.length} métiers)</span>
          </a>
        </div>
        <div class="bms-sw-controls">
          <div class="bms-client-box" title="Tapez le nom du commerce pour personnaliser la maquette en direct">
            <span>✏️ Nom client :</span>
            <input type="text" id="bmsClientInput" class="bms-client-inp" placeholder="Ex: ${currentItem.defaultBrand}" value="${clientName.replace(/"/g, '&quot;')}">
          </div>
          <button type="button" id="bmsCreateQuoteBtn" class="bms-btn-devis">
            ⚡ Créer Devis (${currentItem.price} €)
          </button>
          <button type="button" id="bmsHideBarBtn" class="bms-btn-hide" title="Masquer la barre pour présentation plein écran">
            Plein écran ✕
          </button>
        </div>
      </div>
      <div class="bms-sw-scroll" id="bmsSwitcherScroll">
        ${pillsHtml}
      </div>
    `;

    const reopenBtn = document.createElement('button');
    reopenBtn.type = 'button';
    reopenBtn.className = 'bms-sw-reopen';
    reopenBtn.id = 'bmsReopenBtn';
    reopenBtn.innerHTML = `<span>✨ Changer de métier (${MAQUETTES_CATALOG.length} maquettes)</span>`;

    document.body.insertBefore(wrapper, document.body.firstChild);
    document.body.appendChild(reopenBtn);

    // Centrer la pilule active dans le menu défilant
    const activePill = wrapper.querySelector('.bms-sw-pill.active');
    if (activePill) {
      setTimeout(() => {
        activePill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }, 100);
    }

    // Écouteur personnalisation du nom du client en direct
    const inp = document.getElementById('bmsClientInput');
    if (inp) {
      inp.addEventListener('input', function () {
        const val = this.value;
        try { sessionStorage.setItem('bms_demo_client_name', val.trim()); } catch (e) {}
        applyCustomClientName(val);
      });
    }

    // Conserver le nom du client lors du changement de maquette
    wrapper.querySelectorAll('.bms-sw-pill').forEach(link => {
      link.addEventListener('click', function (e) {
        const currentClient = (document.getElementById('bmsClientInput')?.value || '').trim();
        if (currentClient) {
          e.preventDefault();
          const href = this.getAttribute('href');
          window.location.href = `${href}?client=${encodeURIComponent(currentClient)}`;
        }
      });
    });

    // Bouton Créer Devis
    document.getElementById('bmsCreateQuoteBtn').addEventListener('click', function () {
      const currentClient = (document.getElementById('bmsClientInput')?.value || '').trim();
      const q = new URLSearchParams({
        pack: currentItem.pack,
        price: String(currentItem.price)
      });
      if (currentClient) q.set('client', currentClient);
      window.location.href = `../outils/devis-express.html?${q.toString()}`;
    });

    // Masquer / Ré-afficher la barre
    document.getElementById('bmsHideBarBtn').addEventListener('click', function () {
      wrapper.style.display = 'none';
      reopenBtn.style.display = 'inline-flex';
    });
    reopenBtn.addEventListener('click', function () {
      wrapper.style.display = 'block';
      reopenBtn.style.display = 'none';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwitcherBar);
  } else {
    initSwitcherBar();
  }
})();
