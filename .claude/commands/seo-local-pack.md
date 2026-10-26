---
description: Optimise le SEO local (Google Maps, JSON-LD, pages Métiers/Villes) et met à jour build.js
---

# Skill : SEO Local & Domination Google Maps (`build.js` + JSON-LD)

Optimise le référencement local pour la cible demandée : **$ARGUMENTS**.

## Rappel Important sur `build.js` :
Sur le site principal BoostMySite :
- Les pages `metiers/creation-site-web-*.html`, `villes/creation-site-web-*.html`, `blog/*.html`, `index.html` et `portfolio.html` sont générées par **`build.js`**.
- Si tu ajoutes un nouveau métier, une nouvelle ville ou un nouvel article de blog sur BoostMySite, **modifie les tableaux `METIERS`, `VILLES`, `PROJECTS` ou `POSTS` dans `build.js`**, puis exécute `node build.js` pour régénérer proprement tout le site.

## Checklist SEO Local à appliquer sur chaque page :
1. **Balises `<head>` irréprochables** :
   - `<title>` unique de 50 à 60 caractères incluant `[Métier / Spécialité] + [Ville / Quartier]`.
   - `<meta name="description">` de 140 à 160 caractères orientée clic (bénéfice + localisation + appel à l'action).
   - `<link rel="canonical">` exacte.
   - Balises OpenGraph (`og:title`, `og:description`, `og:image`, `og:locale="fr_FR"`).
2. **Données Structurées `application/ld+json` (Schema.org)** :
   - Utiliser le type le plus précis : `FastFoodRestaurant`, `Restaurant`, `HomeAndConstructionBusiness`, `Plumber`, `Electrician`, `Locksmith`, `HairSalon`, `ProfessionalService`.
   - Renseigner : `name`, `address` (`PostalAddress`), `geo` (`GeoCoordinates`), `telephone`, `openingHoursSpecification`, `priceRange`, `url`, `hasMenu` (si restaurant) et `FAQPage` (questions/réponses locales).
3. **Structure Sémantique HTML5 & Performance Mobile** :
   - Un seul `<h1>` par page contenant le mot-clé principal + la ville.
   - Hiérarchie logique `<h2>` -> `<h3>` sans saut de niveau.
   - Attributs `alt` descriptifs et localisés sur chaque image + `loading="lazy"` sous la ligne de flottaison + dimensions `width` et `height` explicites (zéro décalage CLS).
