/**
 * BoostMySite — Barre de navigation des démonstrations métiers
 * Menu déroulant sobre (12 secteurs d'activité) + personnalisation du nom d'enseigne
 */
(function () {
  'use strict';

  const MAQUETTES_CATALOG = [
    {
      id: 'fastfood',
      label: 'Fast-Food & Smash Burger',
      shortLabel: 'Fast-Food & Burger',
      file: 'fastfood-smash.html',
      defaultBrand: "L'Atelier du Smash",
      pack: 'pro',
      price: 990,
      img: 'project-fastfood.jpg',
      tagline: 'Commande Click & Collect sans commission, composition de menu et retrait comptoir.',
      long: "Conception d'un site de commande directe pensé pour les fast-foods, smash burgers et enseignes de street-food artisanale. L'interface permet au client de composer son menu sur téléphone en quelques secondes (formule, suppléments, sauces maison, heure de retrait au comptoir) tout en affranchissant le restaurateur des commissions des plateformes."
    },
    {
      id: 'restaurant',
      label: 'Restaurant, Brasserie & Bistronomie',
      shortLabel: 'Restaurant & Brasserie',
      file: 'restaurant-braise.html',
      defaultBrand: "L'Atelier Braise",
      pack: 'pro',
      price: 990,
      img: 'project-restaurant.jpg',
      tagline: 'Ardoise de saison, réservation de table par espace et vente à emporter.',
      long: "Site chaleureux conçu pour une rôtisserie et table bistronomique au feu de bois. Carte de saison avec origine certifiée des viandes françaises, sélection de son emplacement préféré (cheminée, verrière ou cour intérieure), carnet de réservation en direct et commande à emporter."
    },
    {
      id: 'boulangerie',
      label: 'Boulangerie & Pâtisserie Artisanale',
      shortLabel: 'Boulangerie & Pâtisserie',
      file: 'boulangerie-patisserie.html',
      defaultBrand: 'Maison Levain & Dorure',
      pack: 'pro',
      price: 990,
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
      tagline: 'Pré-commande formules midi coupe-file, pains au levain et gâteaux sur commande.',
      long: "Vitrine gourmande et comptoir numérique pour boulangerie-pâtisserie artisanale. Présentation des pains au levain naturel et viennoiseries pur beurre AOP, retrait express des formules déjeuner sans file d'attente et commande de pâtisseries grand format personnalisées pour les événements."
    },
    {
      id: 'barber',
      label: 'Salon de Coiffure & Barber Shop',
      shortLabel: 'Coiffure & Barber Shop',
      file: 'barber-coiffure.html',
      defaultBrand: 'Maison Lame & Ciseaux',
      pack: 'starter',
      price: 490,
      img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80',
      tagline: 'Carte des coupes et soins barbe, choix du coiffeur et prise de rendez-vous en ligne.',
      long: "Site de réservation conçu pour les salons de coiffure et maîtres barbiers. Présentation claire des forfaits coupe et rituel barbe à la serviette chaude, sélection nominative du coiffeur, prise de rendez-vous par créneau horaire en trente secondes et galerie de réalisations."
    },
    {
      id: 'beaute',
      label: 'Institut de Beauté, Onglerie & Spa',
      shortLabel: 'Institut de Beauté & Soins',
      file: 'institut-beaute.html',
      defaultBrand: "L'Écrin de Soie",
      pack: 'starter',
      price: 490,
      img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
      tagline: 'Carte des soins visage, onglerie et massage, réservation par praticienne et bons cadeaux.',
      long: "Écrin digital pensé pour les instituts de beauté, bars à ongles et spas urbains. Organisation fluide des prestations par univers (manucure russe, soins du visage, Head Spa et massages), réservation directe selon les disponibilités de chaque praticienne et édition de bons cadeaux personnalisés."
    },
    {
      id: 'pizzeria',
      label: 'Pizzeria au Feu de Bois & Trattoria',
      shortLabel: 'Pizzeria & Trattoria',
      file: 'pizzeria-italien.html',
      defaultBrand: 'Forno Napoli',
      pack: 'pro',
      price: 990,
      img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=80',
      tagline: 'Commande à emporter calée sur la sortie du four, carte napolitaine et réservation de table.',
      long: "Interface dédiée aux pizzerias artisanales et trattorias italiennes. Mise en valeur de la fermentation lente et des produits DOP, commande à emporter avec sélection précise du créneau de sortie du four et réservation de table en salle ou en terrasse."
    },
    {
      id: 'sushi',
      label: 'Restaurant Japonais, Sushi & Poké',
      shortLabel: 'Sushi & Cuisine Asiatique',
      file: 'sushi-asiatique.html',
      defaultBrand: 'Kensho Sushi',
      pack: 'pro',
      price: 990,
      img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=80',
      tagline: 'Plateaux signatures, composition de Poké Bowl sur mesure et commande directe.',
      long: "Plateforme de commande en ligne pour restaurant japonais et bar à Poké. Photographies détaillées des plateaux et créations du chef, module permettant au client de composer son bol sur mesure (base, protéine marinée, sauce maison) et commande Click & Collect sans intermédiaire."
    },
    {
      id: 'garage',
      label: 'Garage Automobile, Entretien & Occasion',
      shortLabel: 'Garage Automobile',
      file: 'garage-auto.html',
      defaultBrand: 'Pôle Auto Performance',
      pack: 'pro',
      price: 990,
      img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      tagline: 'Forfaits révision et mécanique, prise de rendez-vous atelier et parc de véhicules révisés.',
      long: "Outil complet pour garage indépendant et atelier mécanique toutes marques. Consultation transparente des forfaits d'entretien (révision constructeur, freinage, pneumatiques, distribution), prise de rendez-vous par immatriculation avec véhicule de courtoisie et vitrine des véhicules d'occasion garantis."
    },
    {
      id: 'artisan',
      label: 'Artisanat, Rénovation & Architecture d’Intérieur',
      shortLabel: 'Artisanat & Rénovation',
      file: 'artisan-elite.html',
      defaultBrand: 'Maison Valmont',
      pack: 'pro',
      price: 990,
      img: 'project-artisan.jpg',
      tagline: 'Carnet de matériaux 3D, comparateur Avant / Après chantier et estimation de travaux.',
      long: "Site vitrine et outil de chiffrage pour une entreprise artisanale de rénovation de salles de bains et d'appartements. Présentation claire des compagnons par corps d'état, visualisation 3D des matériaux (travertin, béton ciré, chêne), comparateur Avant/Après et estimateur de budget conforme aux obligations légales du bâtiment."
    },
    {
      id: 'depannage',
      label: 'Plombier, Serrurier & Électricien Dépannage',
      shortLabel: 'Plomberie & Serrurerie',
      file: 'depannage-urgence.html',
      defaultBrand: 'Atelier Dépannage & Cie',
      pack: 'pro',
      price: 990,
      img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80',
      tagline: 'Barème tarifaire annoncé avant déplacement, garanties assurances et contact direct.',
      long: "Site de confiance pour artisans dépanneurs (plomberie, serrurerie, électricité). Affichage clair des forfaits d'intervention avant déplacement pour rassurer immédiatement le particulier, mise en avant de la garantie décennale et des agréments assurances habitation."
    },
    {
      id: 'commerce',
      label: 'Boucherie, Traiteur, Primeur & Commerce',
      shortLabel: 'Boucherie & Commerce',
      file: 'commerce-boutique.html',
      defaultBrand: 'Les Halles du Terroir',
      pack: 'pro',
      price: 990,
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
      tagline: 'Réservation colis boucherie, rôtisserie du week-end, plateaux traiteur et retrait boutique.',
      long: "Vitrine de pré-commande pour commerces de bouche indépendants (boucherie-charcuterie, rôtisserie, fromagerie, épicerie fine). Réservation en ligne des pièces du week-end et colis familiaux, calculateur de portions selon le nombre de convives et retrait prioritaire en boutique."
    },
    {
      id: 'vtc',
      label: 'Chauffeur Privé VTC & Grande Remise',
      shortLabel: 'Chauffeur Privé & VTC',
      file: 'chauffeur-prestige.html',
      defaultBrand: 'Maison Chabé & Prestige',
      pack: 'pro',
      price: 990,
      img: 'project-chauffeur.jpg',
      tagline: 'Estimation de course en direct, forfaits aéroports CDG / Orly et réservation privée.',
      long: "Création d'une vitrine dédiée aux chauffeurs privés et artisans VTC pour capter une clientèle directe sur les transferts aéroports (CDG, Orly) et mises à disposition, sans dépendre des applications."
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

  const path = window.location.pathname || '';
  if (path.indexOf('/sites/') === -1) return;

  function initSwitcherBar() {
    const params = new URLSearchParams(window.location.search);
    const isEmbed = params.get('embed') === '1';
    const currentItem = window.BMSMaquettes.getByFile(path);

    let clientName = params.get('client') || '';
    if (clientName) {
      try { sessionStorage.setItem('bms_demo_client_name', clientName); } catch (e) {}
    } else {
      try { clientName = sessionStorage.getItem('bms_demo_client_name') || ''; } catch (e) {}
    }

    function applyCustomClientName(name) {
      const clean = (name || '').trim();
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
        document.title = `${clean} — ${currentItem.shortLabel}`;
      }
    }

    if (clientName) {
      setTimeout(() => applyCustomClientName(clientName), 40);
    }

    if (isEmbed) return;

    const oldDemoBar = document.querySelector('.demo-bar');
    if (oldDemoBar) oldDemoBar.style.display = 'none';

    const style = document.createElement('style');
    style.textContent = `
      .bms-demo-bar {
        background: #141413;
        color: #D6D3CD;
        font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Plus Jakarta Sans', sans-serif;
        font-size: 12.5px;
        border-bottom: 1px solid #2A2926;
        padding: 8px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        flex-wrap: wrap;
        position: relative;
        z-index: 99990;
      }
      .bms-demo-left, .bms-demo-right {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .bms-demo-back {
        color: #FFFFFF !important;
        text-decoration: none !important;
        font-weight: 600;
        letter-spacing: 0.01em;
        opacity: 0.9;
      }
      .bms-demo-back:hover {
        opacity: 1;
        text-decoration: underline !important;
      }
      .bms-demo-sep {
        color: #4A4843;
      }
      .bms-demo-label {
        color: #9C968C;
        font-size: 12px;
      }
      .bms-demo-select {
        background: #1F1E1C;
        color: #F5F3EF;
        border: 1px solid #3A3834;
        border-radius: 5px;
        padding: 5px 28px 5px 10px;
        font-size: 12.5px;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239C968C' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
      }
      .bms-demo-select:hover, .bms-demo-select:focus {
        border-color: #78736A;
      }
      .bms-demo-inp {
        background: #1F1E1C;
        color: #FFFFFF;
        border: 1px solid #3A3834;
        border-radius: 5px;
        padding: 5px 10px;
        font-size: 12.5px;
        font-family: inherit;
        width: 175px;
        outline: none;
      }
      .bms-demo-inp::placeholder {
        color: #78736A;
      }
      .bms-demo-inp:focus {
        border-color: #A8A29E;
      }
      .bms-demo-link {
        color: #F5F3EF !important;
        background: #292825;
        border: 1px solid #3E3C38;
        padding: 5px 12px;
        border-radius: 5px;
        text-decoration: none !important;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s;
      }
      .bms-demo-link:hover {
        background: #3A3834;
      }
      .bms-demo-close {
        background: transparent;
        border: none;
        color: #8C867B;
        font-size: 12px;
        cursor: pointer;
        padding: 4px 6px;
      }
      .bms-demo-close:hover {
        color: #FFFFFF;
      }
      @media (max-width: 720px) {
        .bms-demo-bar { padding: 8px 12px; gap: 8px; }
        .bms-demo-sep, .bms-demo-label { display: none; }
        .bms-demo-inp { width: 135px; }
      }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.className = 'bms-demo-bar';
    bar.id = 'bmsSwitcherBar';

    const optionsHtml = MAQUETTES_CATALOG.map(item => {
      const sel = item.id === currentItem.id ? 'selected' : '';
      return `<option value="${item.file}" ${sel}>${item.label}</option>`;
    }).join('');

    bar.innerHTML = `
      <div class="bms-demo-left">
        <a href="../portfolio.html" class="bms-demo-back">← BoostMySite</a>
        <span class="bms-demo-sep">|</span>
        <span class="bms-demo-label">Secteur :</span>
        <select id="bmsSectorSelect" class="bms-demo-select" aria-label="Choisir un secteur d'activité">
          ${optionsHtml}
        </select>
      </div>
      <div class="bms-demo-right">
        <span class="bms-demo-label">Personnaliser l'enseigne :</span>
        <input type="text" id="bmsClientInput" class="bms-demo-inp" placeholder="Nom du commerce..." value="${clientName.replace(/"/g, '&quot;')}">
        <button type="button" id="bmsCreateQuoteBtn" class="bms-demo-link">Chiffrer ce modèle</button>
        <button type="button" id="bmsHideBarBtn" class="bms-demo-close" title="Masquer ce bandeau">✕</button>
      </div>
    `;

    document.body.insertBefore(bar, document.body.firstChild);

    document.getElementById('bmsSectorSelect').addEventListener('change', function () {
      const targetFile = this.value;
      const currentClient = (document.getElementById('bmsClientInput')?.value || '').trim();
      if (currentClient) {
        window.location.href = `${targetFile}?client=${encodeURIComponent(currentClient)}`;
      } else {
        window.location.href = targetFile;
      }
    });

    const inp = document.getElementById('bmsClientInput');
    if (inp) {
      inp.addEventListener('input', function () {
        const val = this.value;
        try { sessionStorage.setItem('bms_demo_client_name', val.trim()); } catch (e) {}
        applyCustomClientName(val);
      });
    }

    document.getElementById('bmsCreateQuoteBtn').addEventListener('click', function () {
      const currentClient = (document.getElementById('bmsClientInput')?.value || '').trim();
      const q = new URLSearchParams({
        pack: currentItem.pack,
        price: String(currentItem.price)
      });
      if (currentClient) q.set('client', currentClient);
      window.location.href = `../outils/devis-express.html?${q.toString()}`;
    });

    document.getElementById('bmsHideBarBtn').addEventListener('click', function () {
      bar.style.display = 'none';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwitcherBar);
  } else {
    initSwitcherBar();
  }
})();
