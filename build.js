/* ==========================================================================
   BoostMySite - générateur du site statique
   Usage : node build.js
   Produit toutes les pages HTML (accueil, pages, blog, métiers, villes).
   Le sitemap n'est pas modifié par ce script.
   ========================================================================== */
const fs = require('fs');
const path = require('path');

const SITE = 'https://boost-my-site.com';
const EMAIL = 'brahim.bensaid.pro75@gmail.com';
const PHONE_DISPLAY = '06 98 72 72 47';
const PHONE_LINK = '+33698727247';

/* ------------------------------ Données ------------------------------ */

const VILLES = [
  { slug: 'paris', nom: 'Paris' },
  { slug: 'lyon', nom: 'Lyon' },
  { slug: 'marseille', nom: 'Marseille' },
  { slug: 'toulouse', nom: 'Toulouse' },
  { slug: 'bordeaux', nom: 'Bordeaux' },
  { slug: 'lille', nom: 'Lille' }
];

const METIERS = [
  {
    slug: 'plombier', nom: 'Plombier', desc: 'Dépannage, fuites, installations.',
    points: [
      ['Visible en urgence', "Vos clients cherchent depuis leur téléphone, souvent dans l'urgence. Votre numéro et votre zone d'intervention sont visibles dès l'accueil."],
      ["Zone d'intervention claire", 'Des pages par ville ou quartier pour apparaître dans les recherches locales du type « plombier + ville ».'],
      ['Confiance', 'Avis, photos de chantiers, garanties et assurances mis en avant pour rassurer avant l\'appel.']
    ]
  },
  {
    slug: 'electricien', nom: 'Électricien', desc: 'Mises aux normes, pannes de courant.',
    points: [
      ['Appel en un clic', 'Bouton d\'appel fixe sur mobile et formulaire court : le client vous contacte sans friction.'],
      ['Qualifications visibles', 'Mise aux normes, dépannage, installation : chaque prestation a sa page, claire et bien référencée.'],
      ['Réalisations', 'Galerie de chantiers et avis clients pour montrer votre sérieux.']
    ]
  },
  {
    slug: 'serrurier', nom: 'Serrurier', desc: 'Ouverture de porte, changement de serrure.',
    points: [
      ['Présent au bon moment', 'Un site rapide, lisible sur mobile, avec numéro et délai d\'intervention bien en vue.'],
      ['Tarifs transparents', 'Fourchettes de prix et déroulé d\'une intervention affichés pour lever les doutes avant l\'appel.'],
      ['Zone couverte', 'Des pages locales pour chaque secteur desservi, afin d\'être trouvé là où vous intervenez.']
    ]
  },
  {
    slug: 'vtc', nom: 'VTC', desc: 'Chauffeur privé, transferts aéroport.',
    points: [
      ['Réservation simple', 'Formulaire ou lien WhatsApp direct pour réserver un trajet en quelques secondes.'],
      ['Transferts et trajets longs', 'Pages dédiées aux aéroports, gares et trajets d\'affaires pour capter des demandes à forte valeur.'],
      ['Image soignée', 'Un site propre et moderne qui reflète la qualité de votre service.']
    ]
  },
  {
    slug: 'restaurant', nom: 'Restaurant', desc: 'Réservations, menus en ligne.',
    points: [
      ['Carte et réservation', 'Menu à jour, horaires et réservation en ligne : les informations que cherchent vos clients, au même endroit.'],
      ['Commande directe', 'Click & collect sans commission des plateformes de livraison.'],
      ['Google Maps', 'Fiche Google Business et données structurées pour apparaître dans les recherches autour de vous.']
    ]
  },
  {
    slug: 'fast-food', nom: 'Fast-Food', desc: 'Click & Collect, composition de menus, 0 % de commission.',
    points: [
      ['Zéro commission sur vos habitués', 'Affranchissez-vous des 30 % prélevés par les plateformes en permettant à vos clients de commander en direct sur votre site.'],
      ['Composition de menu fluide sur mobile', 'Choix Seul ou Menu, taille du burger ou tacos, suppléments, sauces et boisson en quelques secondes comme sur une borne.'],
      ['Conforme et visible sur Google Maps', 'Affichage légal de l\'origine des viandes et des allergènes inclus, optimisé pour les recherches locales (« smash burger », « tacos », « pizzeria » + ville).']
    ]
  },
  {
    slug: 'coiffeur', nom: 'Coiffeur', desc: 'Salon de beauté, prises de rendez-vous.',
    points: [
      ['Prise de rendez-vous', 'Un agenda en ligne intégré pour réserver sans passer par le téléphone.'],
      ['Vitrine de votre travail', 'Galerie avant / après et présentation de l\'équipe pour donner envie de pousser la porte.'],
      ['Visibilité locale', 'Référencement par quartier pour apparaître dans les recherches « coiffeur + ville ».']
    ]
  }
];

const FAQ = [
  {
    q: 'Pourquoi un artisan doit-il avoir un site internet ?',
    a: "Le bouche-à-oreille ne suffit plus. Un client qui entend parler de vous commence par chercher votre nom sur Google. Sans site, ou avec un site daté, il peut partir chez un concurrent qui inspire plus confiance. Un site est un point de contact ouvert 24 h sur 24, qui présente votre savoir-faire et vous fait trouver par les clients de votre zone."
  },
  {
    q: "Combien coûte la création d'un site professionnel ?",
    a: "Cela dépend de la taille du projet. Une page à haute conversion démarre à 490 €, un site multi-pages à 990 €, et une application sur mesure (espace utilisateurs, base de données, IA) à partir de 2 500 €."
  },
  {
    q: "Quel est le délai de livraison d'un site ?",
    a: "Une landing page est généralement en ligne sous 48 à 72 heures. Un site multi-pages demande environ une semaine, et une plateforme sur mesure entre une et trois semaines selon la complexité."
  },
  {
    q: 'Pourquoi ne pas utiliser Wix ou WordPress ?',
    a: "Ces outils produisent souvent un code lourd, lent à charger et difficile à optimiser pour Google. Un site développé sur mesure se charge en une fraction de seconde, reste simple à maintenir et se démarque des modèles que tout le monde utilise."
  }
];

const PROJECTS = [
  {
    tag: 'Fast-Food & Click-and-Collect',
    title: "L'Atelier du Smash Paris",
    img: 'project-fastfood.jpg',
    alt: "L'Atelier du Smash, site de commande Click & Collect sans commission pour fast-food et smash burger",
    short: 'Commande Click & Collect sans commission : configurateur de menu (taille, suppléments, sauces, boissons), traçabilité des viandes et simulateur de marge.',
    long: "Conception d'un site de commande directe pensé pour les fast-foods, smash burgers et enseignes de street-food artisanale. L'interface permet au client de composer son menu sur téléphone en quelques secondes (formule, suppléments, sauces maison, heure de retrait au comptoir) tout en affranchissant le restaurateur des 30 % de commission des plateformes.",
    href: 'sites/fastfood-smash.html',
    cta: 'Tester la démo Fast-Food',
    external: false
  },
  {
    tag: 'Artisanat & Salle de Bain',
    title: 'Atelier Apex Rénovation',
    img: 'project-artisan.jpg',
    alt: "Atelier Apex Rénovation, site pour artisan salle de bain et rénovation d'intérieur",
    short: 'Carnet de matériaux 3D (pierre, chêne, laiton), comparateur Avant / Après chantier, chiffrage de travaux en ligne et barème légal transparent.',
    long: "Site vitrine et outil de chiffrage pour une entreprise artisanale de rénovation de salles de bains et d'appartements à Paris. Présentation claire des compagnons par corps d'état, visualisation 3D des matériaux (travertin, béton ciré, chêne), comparateur Avant/Après et estimateur de budget conforme aux obligations légales du bâtiment.",
    href: 'sites/artisan-elite.html',
    cta: 'Tester la démo Artisan',
    external: false
  },
  {
    tag: 'Bistronomie & Feu de Bois',
    title: 'Maison Braise Paris',
    img: 'project-restaurant.jpg',
    alt: 'Maison Braise, site web de restaurant au feu de bois avec réservation de table et vente à emporter',
    short: 'Ardoise de saison, choix de sa table en salle ou sous la verrière, réservation directe et retrait au comptoir sans intermédiaire.',
    long: "Site chaleureux conçu pour une rôtisserie et table bistronomique au feu de bois. Carte de saison avec origine certifiée des viandes françaises, sélection de son emplacement préféré (cheminée, verrière ou cour intérieure), carnet de réservation en direct et commande à emporter.",
    href: 'sites/restaurant-braise.html',
    cta: 'Tester la démo Restaurant',
    external: false
  },
  {
    tag: 'Chauffeur Privé & VTC',
    title: 'Prestige Drive Paris',
    img: 'project-chauffeur.jpg',
    alt: 'Prestige Drive Paris, site vitrine pour chauffeur privé VTC',
    short: 'Réservation de transferts gares et aéroports, présentation de la flotte et estimation de course en direct.',
    long: "Création d'une vitrine dédiée aux chauffeurs privés et artisans VTC pour capter une clientèle directe sur les transferts aéroports (CDG, Orly) et mises à disposition, sans dépendre des applications.",
    href: 'sites/chauffeur-prestige.html',
    cta: 'Tester la démo VTC',
    external: false
  },
  {
    tag: 'SaaS & Intelligence Artificielle',
    title: 'Devis-AI',
    img: 'devis-ai.jpg',
    alt: 'Devis-AI, plateforme SaaS de génération de devis par intelligence artificielle',
    short: 'Application SaaS complète de génération de devis pour professionnels : interface Next.js, base de données sécurisée et moteur IA.',
    long: "Outil SaaS complet développé sur mesure pour les indépendants et professionnels du BTP. L'application intègre une interface moderne et réactive, une gestion d'authentification et de profils, une base de données chiffrée et un moteur d'intelligence artificielle automatisant la création de devis complexes.",
    href: 'https://devis-ai.fr',
    cta: 'Visiter le SaaS en direct',
    external: true
  },
  {
    tag: 'Web3 & Architecture DeFi',
    title: 'cGAS Crypto',
    img: 'cgascrypto.jpg',
    alt: 'cGAS Crypto, interface Web3 pour token indiciel sur Arbitrum',
    short: "Architecture et interface Web3 du premier token indiciel adossé au gaz naturel, déployé sur le réseau Arbitrum.",
    long: "Conception de l'interface décentralisée et de l'intégration Web3 pour le premier token indiciel adossé au gaz naturel sur la blockchain Arbitrum. Expérience utilisateur financière institutionnelle : interaction avec les smart contracts, connexion de wallets Web3 (MetaMask, WalletConnect) et suivi temps réel des flux de liquidité. Architecture et projet livrés avec succès.",
    href: null
  },
  {
    tag: 'Plateforme E-Learning',
    title: 'SES Campus',
    img: 'ses-campus.jpg',
    alt: "SES Campus, plateforme d'apprentissage et de révision en ligne",
    short: "Plateforme pédagogique sur mesure pour enseignants et étudiants en Sciences Économiques : cours structurés et parcours clair.",
    long: "Conception d'une plateforme d'apprentissage privée dédiée à la préparation aux examens de Sciences Économiques et Sociales. Gestion hiérarchisée des contenus de cours, fiches méthodologiques interactives, espace de révision optimisé pour la lecture sur mobile et tablette. Architecture et projet livrés avec succès.",
    href: null
  }
];

const POSTS = [
  {
    slug: 'artisan-site-web-google-maps',
    tag: 'Stratégie locale',
    title: 'Créer un site web pour artisan : dominer Google Maps',
    short: 'Comment créer un site web d\'artisan qui génère réellement des demandes de devis, et passer devant la concurrence dans les recherches locales.',
    metaTitle: 'Créer un site web pour artisan : le guide pour dominer Google Maps | BoostMySite',
    metaDesc: 'Comment créer un site web pour artisan qui génère réellement des demandes de devis. Référencement local et Google Maps : les bases pour passer devant vos concurrents.',
    read: '8 min',
    html: `
      <p>Un artisan sans site web est un artisan invisible. Pourtant, une simple « carte de visite » en ligne ne suffit plus. Pour <strong>créer un site web d'artisan</strong> qui transforme les visiteurs en demandes de devis, il faut comprendre la mécanique du référencement local.</p>
      <h2>1. Pourquoi Google Maps est votre meilleur allié</h2>
      <p>Quand un client cherche « plombier à Paris » ou « électricien à Lyon », Google affiche d'abord le « Local Pack », le bloc avec la carte. Pour y figurer, votre site doit être techniquement irréprochable. Chez <strong>BoostMySite</strong>, le code est structuré (JSON-LD) pour que Google comprenne immédiatement votre zone d'intervention et votre métier.</p>
      <h2>2. Les éléments vitaux d'un site d'artisan performant</h2>
      <ul>
        <li><strong>Preuve sociale :</strong> vos avis clients et vos photos de chantiers doivent être mis en avant de façon claire.</li>
        <li><strong>Vitesse sur mobile :</strong> la majorité de vos clients vous cherchent sur smartphone, souvent dans l'urgence. Un site lent est un client perdu.</li>
        <li><strong>Formulaire de contact court :</strong> plus c'est simple, plus vous recevez de demandes.</li>
      </ul>
      <h2>3. Le contenu qui attire des clients qualifiés</h2>
      <p>Ne parlez pas seulement de vous, parlez des problèmes de vos clients. Créez une page par service : « pose de carrelage salle de bain », « rénovation de toiture », etc. Votre site se positionne ainsi sur des recherches très précises, celles de clients prêts à passer commande.</p>
      <div class="callout">
        <h3>Besoin d'un site qui vous ramène des chantiers ?</h3>
        <p>Je vous accompagne avec une solution clé en main, optimisée pour le référencement local.</p>
        <a href="../index.html#contact" class="btn btn--primary">Parlons de votre projet</a>
      </div>
      <h2>Conclusion</h2>
      <p><strong>Créer un site web pour artisan</strong> est un investissement stratégique. En soignant votre présence sur Google Maps et l'expérience de vos visiteurs, vous assurez un flux régulier de prospects qualifiés.</p>`
  },
  {
    slug: 'fast-food-commande-en-ligne',
    tag: 'Restauration',
    title: 'Fast food : multiplier les commandes avec un site web',
    short: 'Click & collect, commande en ligne sans commission : comment transformer votre restaurant en machine à ventes directes.',
    metaTitle: 'Comment multiplier les commandes de son fast food avec un site web | BoostMySite',
    metaDesc: 'Click & collect, commande en ligne sans commission, réseaux sociaux : comment un site web propre augmente les ventes directes de votre fast food.',
    read: '6 min',
    html: `
      <p>Les plateformes de livraison (UberEats, Deliveroo) sont des partenaires utiles, mais elles pèsent sur vos marges, jusqu'à 30 % de commission. Posséder son propre <strong>site web de restaurant</strong> n'est plus une option : c'est le moyen de reprendre la main sur votre rentabilité.</p>
      <h2>1. Le Click & Collect : votre nouvelle arme</h2>
      <p>En proposant le Click & Collect directement sur votre site, vous éliminez les commissions et fidélisez vos clients. Vos habitués commandent en quelques clics, et vous suivez la préparation de chaque commande en temps réel.</p>
      <h2>2. L'esthétique au service de l'appétit</h2>
      <p>On mange d'abord avec les yeux. Votre site doit présenter des visuels de qualité de vos burgers, tacos ou pizzas. Une interface fluide et des animations soignées renforcent la perception de qualité de votre établissement.</p>
      <h2>3. Transformer les réseaux sociaux en commandes</h2>
      <p>Instagram et TikTok attirent l'attention, mais où envoyez-vous vos abonnés ? Un lien vers votre propre site permet de convertir cette attention en commandes, sans que le client ne se perde sur une application concurrente.</p>
      <div class="callout">
        <h3>Prêt à développer vos ventes directes ?</h3>
        <p>Lancez votre propre système de commande en ligne, sans commission.</p>
        <a href="../index.html#contact" class="btn btn--primary">Me contacter</a>
      </div>
      <h2>Conclusion</h2>
      <p>La digitalisation de votre fast food est le levier le plus efficace pour augmenter votre chiffre d'affaires. Ne laissez plus les plateformes décider de votre réussite.</p>`
  },
  {
    slug: 'erreurs-seo-commercants-locaux',
    tag: 'Référencement',
    title: 'SEO local : 5 erreurs qui freinent votre boutique',
    short: 'Données structurées, vitesse, contenu local : les pièges qui empêchent votre commerce de remonter sur Google.',
    metaTitle: 'Top 5 des erreurs SEO qui freinent les commerçants locaux | BoostMySite',
    metaDesc: 'Mobile, données structurées, contenu local, vitesse, confiance : les 5 erreurs SEO les plus fréquentes chez les commerçants locaux, et comment les corriger.',
    read: '7 min',
    html: `
      <p>Avoir un site web, c'est bien. Qu'il soit visible par vos voisins et futurs clients, c'est mieux. La <strong>création d'un site de commerce</strong> ne s'arrête pas au design. Voici les 5 erreurs les plus fréquentes chez les commerçants locaux.</p>
      <h2>1. Négliger le mobile</h2>
      <p>Google indexe d'abord la version mobile de votre site. S'il n'est pas rapide et parfaitement lisible sur smartphone, vous serez relégué en deuxième page. Mes sites sont testés sur tous les supports pour garantir une navigation fluide.</p>
      <h2>2. Oublier les données structurées (JSON-LD)</h2>
      <p>Les données structurées sont un langage que lisent les robots de Google. Elles permettent d'afficher vos horaires, votre adresse et vos avis directement dans les résultats de recherche. Sans elles, vous perdez des clics.</p>
      <h2>3. Un contenu trop générique</h2>
      <p>Ne dites pas « Je vends des vêtements », dites « Boutique de prêt-à-porter féminin à [votre ville] ». Le SEO local repose sur la précision géographique : chaque page doit montrer votre ancrage local.</p>
      <h2>4. La lenteur de chargement</h2>
      <p>Chaque seconde supplémentaire de chargement fait baisser votre taux de conversion. Un site alourdi par des images non compressées pénalise votre référencement comme votre image.</p>
      <h2>5. L'absence de preuves de confiance</h2>
      <p>Photos de votre boutique, de votre équipe, logos de vos partenaires locaux : le web est un outil de réassurance. Si l'internaute ne se sent pas en confiance, il n'ira jamais jusqu'au formulaire de contact.</p>
      <div class="callout">
        <h3>Votre site actuel respecte-t-il ces règles ?</h3>
        <p>Je regarde avec vous où se situent les points à améliorer pour gagner en visibilité locale.</p>
        <a href="../index.html#contact" class="btn btn--primary">Faire le point</a>
      </div>`
  }
];

/* ------------------------------ Helpers ------------------------------ */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const jsonLd = (obj) => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;

const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const LOGO_SVG = `<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="bmsLogo" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3d6bff"/><stop offset="100%" stop-color="#8a5cff"/></linearGradient></defs><rect x="4" y="4" width="32" height="32" rx="11" fill="url(#bmsLogo)"/><rect x="10" y="12" width="20" height="16" rx="4" fill="#05060d"/></svg>`;

const GTM_HEAD = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MBK7JZFG');</script>`;
const GTM_BODY = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MBK7JZFG" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;

function header(r, current) {
  const links = [
    ['Services', `${r}index.html#services`, ''],
    ['Réalisations', `${r}portfolio.html`, 'portfolio'],
    ['Tarifs', `${r}index.html#tarifs`, ''],
    ['FAQ', `${r}faq.html`, 'faq'],
    ['Blog', `${r}blog.html`, 'blog']
  ];
  const nav = links.map(([t, h, k]) => `<a href="${h}"${k && k === current ? ' aria-current="page"' : ''}>${t}</a>`).join('\n        ');
  const mobile = links.map(([t, h]) => `<a href="${h}">${t}</a>`).join('\n    ');
  return `<header class="site-header">
    <div class="container nav">
      <a href="${r}index.html" class="logo" aria-label="BoostMySite, accueil">${LOGO_SVG}BoostMySite</a>
      <nav class="nav-links" aria-label="Navigation principale">
        ${nav}
      </nav>
      <div class="nav-right">
        <a href="${r}index.html#contact" class="btn btn--primary btn--sm">Me contacter</a>
        <button class="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="mobile-menu" id="mobileMenu">
    ${mobile}
    <a href="${r}index.html#contact" class="btn btn--primary">Me contacter</a>
  </div>`;
}

function footer(r) {
  const metiers = METIERS.map((m) => `<li><a href="${r}metiers/creation-site-web-${m.slug}.html">${m.nom}</a></li>`).join('');
  const villes = VILLES.map((v) => `<li><a href="${r}villes/creation-site-web-${v.slug}.html">${v.nom}</a></li>`).join('');
  return `<footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a href="${r}index.html" class="logo">${LOGO_SVG.replaceAll('bmsLogo', 'bmsLogoF')}BoostMySite</a>
          <p>Création de sites web et d'applications sur mesure pour artisans, commerçants et indépendants.</p>
        </div>
        <div>
          <h4>Pages</h4>
          <ul>
            <li><a href="${r}index.html#services">Services</a></li>
            <li><a href="${r}portfolio.html">Réalisations</a></li>
            <li><a href="${r}index.html#tarifs">Tarifs</a></li>
            <li><a href="${r}faq.html">FAQ</a></li>
            <li><a href="${r}blog.html">Blog</a></li>
            <li><a href="${r}contact.html">Contact</a></li>
          </ul>
        </div>
        <div><h4>Métiers</h4><ul>${metiers}</ul></div>
        <div><h4>Villes</h4><ul>${villes}</ul></div>
      </div>
      <div class="footer-bottom">
        <span>&copy; <span id="year">${new Date().getFullYear()}</span> BoostMySite</span>
        <span><a href="mailto:${EMAIL}">${EMAIL}</a> &middot; <a href="${r}mentions-legales.html">Mentions légales</a></span>
      </div>
    </div>
  </footer>`;
}

function contactForm(idPrefix = '') {
  return `<form class="form" data-contact>
          <div class="field"><label for="${idPrefix}name">Nom</label><input id="${idPrefix}name" name="name" type="text" required autocomplete="name" placeholder="Votre nom"></div>
          <div class="field"><label for="${idPrefix}email">Email</label><input id="${idPrefix}email" name="email" type="email" required autocomplete="email" placeholder="vous@exemple.fr"></div>
          <div class="field"><label for="message">Votre projet</label><textarea id="message" name="message" required placeholder="Votre activité, ce que vous attendez du site, vos délais..."></textarea></div>
          <div class="hp" aria-hidden="true"><input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off"></div>
          <button type="submit" class="btn btn--primary">Envoyer le message</button>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>`;
}

/**
 * Gabarit de page.
 * opts : { r, title, desc, canonical, current, extraHead, body, ogImage, ogType, scripts, headScripts, robots }
 */
function layout(opts) {
  const r = opts.r || '';
  const ogImage = opts.ogImage || `${SITE}/hero-bg.jpg`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  ${GTM_HEAD}
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>document.documentElement.classList.add('js')</script>
  <link rel="icon" type="image/svg+xml" href="${r}favicon.svg">
  <link rel="apple-touch-icon" href="${r}favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="${r}favicon_io/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="${r}favicon_io/favicon-16x16.png">
  <link rel="manifest" href="${r}favicon_io/site.webmanifest">

  <title>${esc(opts.title)}</title>
  <meta name="description" content="${esc(opts.desc)}">
  <meta name="author" content="Brahim Ben Said, BoostMySite">
  <meta name="robots" content="${opts.robots || 'index, follow, max-image-preview:large'}">
  <link rel="canonical" href="${SITE}/${opts.canonical}">
  <meta name="theme-color" content="#05060d">
  <meta name="google-site-verification" content="-qv0pwPyFWboVcbo-5XUCJR_fuNZbnwRECb7p6D97Q8">

  <meta property="og:type" content="${opts.ogType || 'website'}">
  <meta property="og:site_name" content="BoostMySite">
  <meta property="og:url" content="${SITE}/${opts.canonical}">
  <meta property="og:title" content="${esc(opts.title)}">
  <meta property="og:description" content="${esc(opts.desc)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:locale" content="fr_FR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(opts.title)}">
  <meta name="twitter:description" content="${esc(opts.desc)}">
  <meta name="twitter:image" content="${ogImage}">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${r}styles.css">
  ${opts.extraHead || ''}
</head>
<body>
  ${GTM_BODY}
  ${header(r, opts.current)}

  <main>
${opts.body}
  </main>

  ${footer(r)}

  ${opts.scripts || ''}
  <script src="${r}main.js"></script>
</body>
</html>
`;
}

function pageHero({ eyebrow, title, lead, center, actions }) {
  return `    <section class="page-hero${center ? ' page-hero--center' : ''}">
      <div class="container">
        ${eyebrow ? `<span class="eyebrow" data-reveal>${eyebrow}</span>` : ''}
        <h1 data-reveal>${title}</h1>
        ${lead ? `<p class="lead" data-reveal style="--d:.1s">${lead}</p>` : ''}
        ${actions ? `<div class="hero-actions" data-reveal style="--d:.2s">${actions}</div>` : ''}
      </div>
    </section>`;
}

function ctaBand(r, title = 'Un projet en tête ?') {
  return `    <section class="cta-band">
      <div class="container">
        <h2 class="h-lg" data-reveal>${title}</h2>
        <div class="hero-actions" data-reveal style="--d:.1s">
          <a href="${r}index.html#contact" class="btn btn--primary">Me contacter</a>
          <a href="${r}portfolio.html" class="btn btn--ghost">Voir les réalisations</a>
        </div>
      </div>
    </section>`;
}

function write(rel, html) {
  const full = path.join(__dirname, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
}

const faqSchema = () => ({
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
});

const plansHtml = (r) => `<div class="pricing">
        <article class="plan" data-reveal>
          <div class="plan-name">Starter</div>
          <div class="plan-price">490 €</div>
          <p class="plan-desc">Pour les artisans et commerces locaux.</p>
          <ul>
            <li>Page vitrine claire et rapide</li>
            <li>Design sur mesure, adapté au mobile</li>
            <li>Optimisé pour Google Maps</li>
            <li>Formulaire de contact ou réservation</li>
          </ul>
          <a href="${r}index.html#contact" class="btn btn--ghost" data-offer="Starter (490 €)">Choisir Starter</a>
        </article>
        <article class="plan plan--featured" data-reveal style="--d:.1s">
          <div class="plan-name">Pro <span class="plan-badge">Le plus choisi</span></div>
          <div class="plan-price">990 €</div>
          <p class="plan-desc">Un site complet pour dominer votre marché local.</p>
          <ul>
            <li>Site multi-pages (jusqu'à 5 pages)</li>
            <li>Développement Next.js / React</li>
            <li>Intégrations : Calendly, CRM, API</li>
            <li>Hébergement cloud inclus</li>
          </ul>
          <a href="${r}index.html#contact" class="btn btn--primary" data-offer="Pro (990 €)">Choisir Pro</a>
        </article>
        <article class="plan" data-reveal style="--d:.2s">
          <div class="plan-name">Sur mesure</div>
          <div class="plan-price"><small>dès</small>2 500 €</div>
          <p class="plan-desc">Application web, outil métier, plateforme.</p>
          <ul>
            <li>Application full-stack sur mesure</li>
            <li>Base de données et espace utilisateurs</li>
            <li>Intégration d'IA</li>
            <li>Motion design et 3D temps réel</li>
          </ul>
          <a href="${r}index.html#contact" class="btn btn--ghost" data-offer="Sur mesure (dès 2 500 €)">Parler de mon projet</a>
        </article>
      </div>
      <p class="note" data-reveal>Évolutions facturées 50 €/h ou au forfait mensuel. Paiement : 50 % à la commande, 50 % à la livraison.</p>`;

/* ------------------------------ Accueil ------------------------------ */

function buildHome() {
  const projects = PROJECTS.map((p, i) => `
          <article class="project" data-reveal style="--d:${i * 0.1}s">
            <div class="project-img"><img src="${p.img}" alt="${esc(p.alt)}" loading="lazy" width="1200" height="750"></div>
            <div class="project-body">
              <span class="tag">${p.tag}</span>
              <h3>${p.title}</h3>
              <p>${p.short}</p>
              ${p.href
                ? `<a class="link-arrow" href="${p.href}" target="_blank" rel="noopener noreferrer">${p.cta} ${ARROW}</a>`
                : `<a class="link-arrow" href="portfolio.html">Voir le projet ${ARROW}</a>`}
            </div>
          </article>`).join('');

  const marqueeWords = ['Site vitrine', 'Référencement local', 'Application web', 'Motion design', '3D temps réel', 'Next.js', 'Performance'];
  const marquee = marqueeWords.concat(marqueeWords).map((w) => `<span>${w}</span>`).join('');

  const body = `
    <section class="hero">
      <div class="hero-canvas" aria-hidden="true"></div>
      <div class="container hero-inner">
        <span class="eyebrow">Création de sites web</span>
        <h1 class="h-xl">
          <span class="line"><span>Des sites web</span></span>
          <span class="line"><span>qui font venir</span></span>
          <span class="line"><span class="grad-text">des clients.</span></span>
        </h1>
        <p class="lead">Je conçois des sites rapides, bien référencés et soignés pour les artisans, commerçants et indépendants. Du site vitrine à l'application sur mesure.</p>
        <div class="hero-actions">
          <a href="#contact" class="btn btn--primary">Me contacter</a>
          <a href="portfolio.html" class="btn btn--ghost">Voir les réalisations</a>
        </div>
        <div class="hero-meta">
          <span>Sur mesure, sans template</span>
          <span>Référencement local inclus</span>
          <span>Livraison dès 48 h</span>
        </div>
      </div>
      <div class="scroll-hint" aria-hidden="true"></div>
    </section>

    <section class="section" id="services">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow" data-reveal>Services</span>
            <h2 class="h-lg" data-reveal style="--d:.05s">Ce que je fais</h2>
          </div>
          <p class="lead" data-reveal style="--d:.1s">Un seul interlocuteur, de la maquette à la mise en ligne.</p>
        </div>
        <div class="rows">
          <a class="row" href="#tarifs" data-reveal>
            <span class="row-num">01</span>
            <h3>Site vitrine</h3>
            <p>Un site clair, rapide et adapté au mobile pour présenter votre activité et recevoir des demandes de contact.</p>
            <span class="row-arrow">${ARROW}</span>
          </a>
          <a class="row" href="faq.html" data-reveal>
            <span class="row-num">02</span>
            <h3>Référencement local</h3>
            <p>Structure, fiche Google Business et données structurées pour apparaître quand vos clients vous cherchent.</p>
            <span class="row-arrow">${ARROW}</span>
          </a>
          <a class="row" href="portfolio.html" data-reveal>
            <span class="row-num">03</span>
            <h3>Application web</h3>
            <p>Outils métier, espaces clients, plateformes : interface, serveur et base de données sur mesure.</p>
            <span class="row-arrow">${ARROW}</span>
          </a>
          <a class="row" href="#motion" data-reveal>
            <span class="row-num">04</span>
            <h3>Motion et 3D</h3>
            <p>Animations et éléments 3D pour donner de la présence à votre marque, sans alourdir le site.</p>
            <span class="row-arrow">${ARROW}</span>
          </a>
        </div>
      </div>
    </section>

    <section class="showcase" id="motion">
      <div class="showcase-pin">
        <div class="container showcase-grid">
          <div class="showcase-text">
            <span class="eyebrow" data-reveal>Motion et 3D</span>
            <h2 class="h-lg" data-reveal style="--d:.05s">Du mouvement, <span class="grad-text">de la profondeur.</span></h2>
            <p class="lead" data-reveal style="--d:.1s">Un site peut aussi se démontrer. Ce que vous voyez sur cette page, la scène 3D du début et ces calques qui pivotent avec le scroll, est réalisable pour votre marque.</p>
            <ul class="showcase-list" data-reveal style="--d:.15s">
              <li>Éléments 3D temps réel (WebGL)</li>
              <li>Animations déclenchées au scroll</li>
              <li>Interactions fluides, pensées pour le mobile</li>
              <li>Réglé pour rester rapide et accessible</li>
            </ul>
          </div>
          <div class="stage" aria-hidden="true">
            <div class="stage-inner">
              <div class="layer layer--1"><div class="bar"><i></i><i></i><i></i></div><div class="body"><div class="blk w40"></div><div class="blk w80"></div><div class="cols"><i></i><i></i><i></i></div></div></div>
              <div class="layer layer--2"><div class="bar"><i></i><i></i><i></i></div><div class="body"><div class="blk w60"></div><div class="blk w80"></div><div class="blk w40"></div><div class="cols"><i></i><i></i><i></i></div></div></div>
              <div class="layer layer--3"><div class="bar"><i></i><i></i><i></i></div><div class="body"><div class="blk banner"></div><div class="blk w80"></div><div class="blk w60"></div><div class="cols"><i></i><i></i><i></i></div></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="marquee" aria-hidden="true"><div class="marquee-track">${marquee}</div></div>

    <section class="section" id="realisations">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow" data-reveal>Réalisations & Démos</span>
            <h2 class="h-lg" data-reveal style="--d:.05s">Démos interactives et projets livrés</h2>
          </div>
          <p class="lead" data-reveal style="--d:.1s">Découvrez ce que peut être votre futur site : simulateurs de tarifs instantanés, modules Avant/Après, réservation directe et SaaS IA.</p>
        </div>
        <div class="projects">${projects}
        </div>
      </div>
    </section>

    <section class="section section--alt" id="methode">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow" data-reveal>Méthode</span>
            <h2 class="h-lg" data-reveal style="--d:.05s">Trois étapes, sans détour</h2>
          </div>
        </div>
        <div class="steps">
          <article class="step" data-reveal><b>01</b><h3>Échange</h3><p>On définit vos objectifs : plus d'appels, des réservations ou une image plus solide.</p></article>
          <article class="step" data-reveal style="--d:.1s"><b>02</b><h3>Conception</h3><p>Je construis votre site sur mesure. Livraison entre 48 h et une semaine selon le projet.</p></article>
          <article class="step" data-reveal style="--d:.2s"><b>03</b><h3>Mise en ligne</h3><p>Le site est publié et optimisé pour Google. Je reste disponible pour les évolutions.</p></article>
        </div>
      </div>
    </section>

    <section class="section" id="tarifs">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="eyebrow" data-reveal>Tarifs</span>
            <h2 class="h-lg" data-reveal style="--d:.05s">Des offres lisibles</h2>
          </div>
          <p class="lead" data-reveal style="--d:.1s">Du commerce local à la plateforme sur mesure.</p>
        </div>
        ${plansHtml('')}
      </div>
    </section>

    <section class="section section--alt" id="contact">
      <div class="container contact-grid">
        <div>
          <span class="eyebrow" data-reveal>Contact</span>
          <h2 class="h-lg" data-reveal style="--d:.05s">Parlons de votre projet</h2>
          <p class="lead" data-reveal style="margin-top:22px;--d:.1s">Décrivez simplement votre activité et ce que vous attendez. Je vous réponds rapidement.</p>
          <dl class="contact-info" data-reveal style="--d:.15s">
            <div><dt>Email</dt><dd><a href="mailto:${EMAIL}">${EMAIL}</a></dd></div>
            <div><dt>Téléphone</dt><dd><a href="tel:${PHONE_LINK}">${PHONE_DISPLAY}</a></dd></div>
            <div><dt>Zone</dt><dd>France, échanges à distance</dd></div>
          </dl>
        </div>
        <div data-reveal style="--d:.1s">
          ${contactForm()}
        </div>
      </div>
    </section>`;

  const schema = jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE}/#business`,
        name: 'BoostMySite',
        url: SITE,
        logo: `${SITE}/favicon.svg`,
        description: "Création de sites web, applications sur mesure, référencement local, motion design et 3D pour artisans, commerçants et indépendants.",
        priceRange: '€€',
        address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressCountry: 'FR' },
        contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: EMAIL, availableLanguage: ['French', 'English'] },
        sameAs: ['https://devis-ai.fr'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Services BoostMySite',
          itemListElement: [
            { '@type': 'Offer', name: 'Starter, page vitrine', price: '490', priceCurrency: 'EUR', description: 'Page vitrine responsive, optimisée pour Google Maps' },
            { '@type': 'Offer', name: 'Pro, site multi-pages', price: '990', priceCurrency: 'EUR', description: 'Site Next.js / React, multi-pages, intégrations CRM et API' },
            { '@type': 'Offer', name: 'Application sur mesure', price: '2500', priceCurrency: 'EUR', description: 'Application full-stack avec base de données, espace utilisateurs et IA' }
          ]
        }
      },
      {
        '@type': 'Person', '@id': `${SITE}/#person`, name: 'Brahim Ben Said', jobTitle: 'Développeur web full-stack',
        url: SITE, email: EMAIL,
        knowsAbout: ['Next.js', 'React', 'SEO local', 'Three.js', 'Motion design', 'Web3', 'UX/UI']
      },
      { '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'BoostMySite', url: SITE, publisher: { '@id': `${SITE}/#business` } },
      faqSchema()
    ]
  });

  const importmap = `<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"}}</script>`;

  write('index.html', layout({
    title: 'BoostMySite | Création de sites web, SEO local et applications sur mesure',
    desc: "Je crée des sites web rapides, bien référencés et soignés pour artisans, commerçants et indépendants. Sites vitrines, applications sur mesure, motion design et 3D.",
    canonical: '',
    body,
    extraHead: `${schema}\n  ${importmap}`,
    scripts: `<script src="home.js"></script>
  <script type="module" src="hero3d.js"></script>`
  }));
}

/* ------------------------------ Portfolio ------------------------------ */

function buildPortfolio() {
  const cases = PROJECTS.map((p, i) => `
        <article class="case" data-reveal>
          <div>
            <span class="tag">${p.tag}</span>
            <h2>${p.title}</h2>
            <p>${p.long}</p>
            ${p.href
              ? `<a href="${p.href}" ${p.external || p.href.startsWith('sites/') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn ${i % 2 === 0 ? 'btn--primary' : 'btn--ghost'}">${p.cta}</a>`
              : `<span class="tag" style="display:inline-block; margin-top:16px; padding:8px 16px; background:var(--surface-2); border:1px solid var(--line); border-radius:var(--radius-pill); font-size:13px; color:var(--text-dim);">Architecture livrée / Étude de cas</span>`}
          </div>
          <div class="case-img"><img src="${p.img}" alt="${esc(p.alt)}" loading="lazy" width="1200" height="750"></div>
        </article>`).join('');

  const body = `${pageHero({ eyebrow: 'Réalisations & Démos', title: 'Démos métiers et projets en ligne.', lead: "Découvrez nos démonstrations interactives orientées conversion et nos projets logiciels déployés en production." })}
    <section class="section" style="padding-top:20px">
      <div class="container">${cases}
      </div>
    </section>
${ctaBand('')}`;

  const schema = jsonLd({
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'Réalisations BoostMySite',
    itemListElement: PROJECTS.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: `${p.title} — ${p.tag}`,
      url: p.href ? (p.href.startsWith('http') ? p.href : `${SITE}/${p.href}`) : `${SITE}/portfolio.html`
    }))
  });

  write('portfolio.html', layout({
    title: 'Réalisations & Démos interactives | BoostMySite',
    desc: "Découvrez les démos interactives et projets réalisés par BoostMySite : Chauffeur VIP, Artisan BTP, Restaurant & Click-and-Collect, SaaS IA et Web3.",
    canonical: 'portfolio.html', current: 'portfolio', body, extraHead: schema, ogImage: `${SITE}/project-chauffeur.jpg`
  }));
}

/* ------------------------------ FAQ ------------------------------ */

function buildFaq() {
  const items = FAQ.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${f.q}</summary><p>${f.a}</p></details>`).join('\n        ');
  const body = `${pageHero({ eyebrow: 'FAQ', title: 'Vos questions, mes réponses.', lead: 'Prix, délais, choix techniques : les réponses claires aux questions les plus fréquentes.', center: true })}
    <section class="section" style="padding-top:20px">
      <div class="container">
        <div class="faq" data-reveal>
        ${items}
        </div>
      </div>
    </section>
${ctaBand('', 'Une autre question ?')}`;

  write('faq.html', layout({
    title: 'FAQ | Prix, délais et conseils pour votre site web | BoostMySite',
    desc: "Combien coûte un site professionnel ? En combien de temps ? Pourquoi pas Wix ou WordPress ? Les réponses de BoostMySite.",
    canonical: 'faq.html', current: 'faq', body,
    extraHead: jsonLd(Object.assign({ '@context': 'https://schema.org' }, faqSchema()))
  }));
}

/* ------------------------------ Blog ------------------------------ */

function buildBlog() {
  const cards = POSTS.map((p, i) => `
        <a class="post${i === 2 ? ' post--wide' : ''}" href="blog/${p.slug}.html" data-reveal style="--d:${i * 0.08}s">
          <span class="tag">${p.tag}</span>
          <h2>${p.title}</h2>
          <p>${p.short}</p>
          <span class="link-arrow">Lire l'article ${ARROW}</span>
        </a>`).join('');

  const body = `${pageHero({ eyebrow: 'Blog', title: 'Conseils web et référencement local.', lead: 'Des articles concrets pour comprendre ce qui fait vraiment venir des clients sur un site.' })}
    <section class="section" style="padding-top:20px">
      <div class="container">
        <div class="posts">${cards}
        </div>
      </div>
    </section>
${ctaBand('')}`;

  const schema = jsonLd({
    '@context': 'https://schema.org', '@type': 'Blog', name: 'Blog BoostMySite', url: `${SITE}/blog.html`,
    description: 'Articles sur la création de sites web, le référencement local et la conversion.',
    publisher: { '@type': 'Organization', name: 'BoostMySite', url: SITE },
    blogPost: POSTS.map((p) => ({
      '@type': 'BlogPosting', headline: p.title, description: p.short, url: `${SITE}/blog/${p.slug}.html`,
      author: { '@type': 'Person', name: 'Brahim Ben Said' }
    }))
  });

  write('blog.html', layout({
    title: 'Blog | Création de site web, SEO local et conversion | BoostMySite',
    desc: 'Articles sur la création de sites web pour artisans et commerçants, le référencement local et les bonnes pratiques de conversion.',
    canonical: 'blog.html', current: 'blog', body, extraHead: schema, ogType: 'blog'
  }));

  POSTS.forEach((p) => {
    const art = `    <section class="page-hero">
      <div class="container article">
        <span class="eyebrow">${p.tag}</span>
        <h1 style="max-width:none">${p.title}</h1>
        <div class="article-meta"><span>Par Brahim Ben Said</span><span>Lecture ${p.read}</span></div>
      </div>
    </section>
    <section class="section" style="padding-top:20px">
      <div class="container">
        <article class="article prose">${p.html}
        </article>
      </div>
    </section>`;
    write(`blog/${p.slug}.html`, layout({
      r: '../', title: p.metaTitle, desc: p.metaDesc, canonical: `blog/${p.slug}.html`, current: 'blog', body: art, ogType: 'article',
      extraHead: jsonLd({
        '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.metaDesc,
        author: { '@type': 'Person', name: 'Brahim Ben Said' }, publisher: { '@type': 'Organization', name: 'BoostMySite' },
        mainEntityOfPage: `${SITE}/blog/${p.slug}.html`
      })
    }));
  });
}

/* ------------------------------ Contact / Services / Légal ------------------------------ */

function buildContact() {
  const body = `    <section class="page-hero">
      <div class="container contact-grid" style="padding-top:20px">
        <div>
          <span class="eyebrow" data-reveal>Contact</span>
          <h1 data-reveal style="--d:.05s">Parlons de votre projet.</h1>
          <p class="lead" style="margin-top:22px" data-reveal>Expliquez simplement votre situation. Même si ce n'est pas très structuré, on clarifie ensemble ce qui est le plus adapté.</p>
          <dl class="contact-info" data-reveal style="--d:.15s">
            <div><dt>Email</dt><dd><a href="mailto:${EMAIL}">${EMAIL}</a></dd></div>
            <div><dt>Téléphone</dt><dd><a href="tel:${PHONE_LINK}">${PHONE_DISPLAY}</a></dd></div>
            <div><dt>Zone</dt><dd>France, échanges à distance</dd></div>
          </dl>
        </div>
        <div data-reveal style="--d:.1s">
          ${contactForm()}
        </div>
      </div>
    </section>`;
  write('contact.html', layout({
    title: 'Contact | BoostMySite',
    desc: 'Contactez BoostMySite pour parler de votre projet de site vitrine, de référencement local ou d\'application sur mesure.',
    canonical: 'contact.html', body
  }));
}

function buildServices() {
  const options = [
    ['Google Business', 'Visibilité locale', ['Création ou optimisation de la fiche', 'Description claire de votre activité', 'Catégories, horaires et services renseignés']],
    ['Logo simple', 'Identité de base', ['Logo minimaliste adapté au web', 'Couleurs cohérentes avec le site', 'Fichiers utilisables sur vos réseaux']],
    ['Mises à jour', 'Évolutions du site', ['Ajout ou modification de texte', 'Nouvelles sections ou photos', "Facturation à l'heure ou au forfait"]]
  ].map(([t, s, l], i) => `
          <article class="card" data-reveal style="--d:${i * 0.1}s"><h3>${t}</h3><small>${s}</small><ul>${l.map((x) => `<li>${x}</li>`).join('')}</ul></article>`).join('');

  const body = `${pageHero({ eyebrow: 'Services', title: 'Offres et options.', lead: 'Trois offres claires, et des options à ajouter selon vos besoins.' })}
    <section class="section" style="padding-top:20px">
      <div class="container">
        ${plansHtml('')}
      </div>
    </section>
    <section class="section section--alt">
      <div class="container">
        <div class="section-head"><div><span class="eyebrow">Options</span><h2 class="h-lg">À ajouter à toute offre</h2></div></div>
        <div class="cards">${options}
        </div>
      </div>
    </section>
${ctaBand('', "Vous ne savez pas par où commencer ?")}`;
  write('services.html', layout({
    title: 'Services et tarifs | BoostMySite',
    desc: 'Les offres BoostMySite : page vitrine à 490 €, site multi-pages à 990 €, application sur mesure dès 2 500 €, et options.',
    canonical: 'services.html', body
  }));
}

function buildLegal() {
  const body = `${pageHero({ eyebrow: 'Informations', title: 'Mentions légales.', lead: 'Informations fournies à titre indicatif, complétées une fois le statut professionnel officiellement créé.' })}
    <section class="section" style="padding-top:20px">
      <div class="container legal">
        <h2>Éditeur du site</h2>
        <ul>
          <li><strong>Nom :</strong> Brahim Bensaid</li>
          <li><strong>Nom commercial :</strong> BoostMySite</li>
          <li><strong>Pays :</strong> France</li>
          <li><strong>Email :</strong> <a href="mailto:${EMAIL}">${EMAIL}</a></li>
        </ul>
        <h2>Hébergeur</h2>
        <p>Le site <strong>boost-my-site.com</strong> est hébergé par :</p>
        <ul>
          <li><strong>Raison sociale :</strong> o2switch</li>
          <li><strong>Forme :</strong> SAS au capital de 100 000 €</li>
          <li><strong>Adresse :</strong> Chemin des Pardiaux, 63000 Clermont-Ferrand, France</li>
          <li><strong>Site web :</strong> <a href="https://www.o2switch.fr" target="_blank" rel="noopener noreferrer">www.o2switch.fr</a></li>
          <li><strong>Téléphone :</strong> 04 44 44 60 40</li>
        </ul>
        <h2>Données personnelles</h2>
        <p>Les informations envoyées via le formulaire de contact ou par email sont utilisées uniquement pour répondre aux demandes et ne sont pas revendues à des tiers.</p>
        <p>Conformément à la réglementation en vigueur, vous pouvez demander l'accès, la modification ou la suppression de vos données en écrivant à <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
      </div>
    </section>`;
  write('mentions-legales.html', layout({
    title: 'Mentions légales | BoostMySite', desc: 'Mentions légales du site BoostMySite.', canonical: 'mentions-legales.html', body
  }));
}

/* ------------------------------ Villes & métiers ------------------------------ */

function buildVilles() {
  VILLES.forEach((v) => {
    const points = [
      [`Référencement à ${v.nom}`, `Votre site est structuré pour apparaître dans les recherches locales à ${v.nom} et alentours, sur Google et Google Maps.`],
      ['Rapide sur mobile', "La plupart des recherches locales se font sur smartphone : le site se charge en une fraction de seconde."],
      ['Un seul interlocuteur', `Design, développement et référencement sont gérés au même endroit, en visio ou par téléphone, où que vous soyez à ${v.nom}.`]
    ].map(([t, p], i) => `<article class="point" data-reveal style="--d:${i * 0.1}s"><h3>${t}</h3><p>${p}</p></article>`).join('');
    const others = VILLES.filter((o) => o.slug !== v.slug).map((o) => `<a class="chip" href="creation-site-web-${o.slug}.html">${o.nom}</a>`).join('');
    const trades = METIERS.map((m) => `<a class="chip" href="../metiers/creation-site-web-${m.slug}.html">${m.nom}</a>`).join('');

    const body = `${pageHero({
      eyebrow: 'Artisans et commerçants', title: `Création de site web à ${v.nom}.`,
      lead: `Artisans et commerçants de ${v.nom} : un site rapide et bien référencé pour transformer votre présence locale en demandes de clients.`,
      center: true,
      actions: `<a href="../index.html#contact" class="btn btn--primary">Lancer mon projet à ${v.nom}</a><a href="../index.html#tarifs" class="btn btn--ghost">Voir les tarifs</a>`
    })}
    <section class="section" style="padding-top:40px">
      <div class="container"><div class="points">${points}</div></div>
    </section>
    <section class="section section--alt section--tight">
      <div class="container">
        <span class="eyebrow">Autres villes</span>
        <div class="chips" style="margin-bottom:44px">${others}</div>
        <span class="eyebrow">Métiers</span>
        <div class="chips">${trades}</div>
      </div>
    </section>`;

    write(`villes/creation-site-web-${v.slug}.html`, layout({
      r: '../',
      title: `Création de site web à ${v.nom} | BoostMySite`,
      desc: `Création de site web à ${v.nom} pour artisans et commerçants : design sur mesure, performance et référencement local.`,
      canonical: `villes/creation-site-web-${v.slug}.html`, body
    }));
  });
}

function buildMetiers() {
  METIERS.forEach((m) => {
    const points = m.points.map(([t, p], i) => `<article class="point" data-reveal style="--d:${i * 0.1}s"><h3>${t}</h3><p>${p}</p></article>`).join('');
    const others = METIERS.filter((o) => o.slug !== m.slug).map((o) => `<a class="chip" href="creation-site-web-${o.slug}.html">${o.nom}</a>`).join('');
    const villes = VILLES.map((v) => `<a class="chip" href="../villes/creation-site-web-${v.slug}.html">${v.nom}</a>`).join('');

    const body = `${pageHero({
      eyebrow: 'Artisans et indépendants', title: `Site web pour ${m.nom.toLowerCase() === 'vtc' ? 'chauffeur VTC' : m.nom.toLowerCase()}.`,
      lead: `Attirez plus de clients dans votre zone d'intervention. ${m.desc} Un site rapide qui transforme les visiteurs en appels et en demandes.`,
      center: true,
      actions: `<a href="../index.html#contact" class="btn btn--primary">Me contacter</a><a href="../index.html#tarifs" class="btn btn--ghost">Voir les tarifs</a>`
    })}
    <section class="section" style="padding-top:40px">
      <div class="container"><div class="points">${points}</div></div>
    </section>
    <section class="section section--alt section--tight">
      <div class="container">
        <span class="eyebrow">Autres métiers</span>
        <div class="chips" style="margin-bottom:44px">${others}</div>
        <span class="eyebrow">Villes</span>
        <div class="chips">${villes}</div>
      </div>
    </section>`;

    write(`metiers/creation-site-web-${m.slug}.html`, layout({
      r: '../',
      title: `Création de site web pour ${m.nom.toLowerCase() === 'vtc' ? 'chauffeur VTC' : m.nom.toLowerCase()} | BoostMySite`,
      desc: `Site internet performant pour ${m.nom.toLowerCase() === 'vtc' ? 'chauffeur VTC' : m.nom.toLowerCase()} : acquisition de clients, visibilité sur Google Maps et design soigné.`,
      canonical: `metiers/creation-site-web-${m.slug}.html`, body
    }));
  });
}

/* ------------------------------ Build ------------------------------ */

buildHome();
buildPortfolio();
buildFaq();
buildBlog();
buildContact();
buildServices();
buildLegal();
buildVilles();
buildMetiers();
console.log('Site généré.');
