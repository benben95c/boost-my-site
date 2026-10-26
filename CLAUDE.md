# CLAUDE.md — Guide & Règles Officielles du Projet BoostMySite

Bienvenue dans le dépôt **BoostMySite** (`boost-my-site.com`). Ce fichier définit l'architecture technique, les règles de design **100 % humain (Zéro look IA)**, les normes de **sécurité** et la **conformité légale française (LCEN, RGPD, DGCCRF)** à respecter impérativement sur chaque page et chaque site client.

---

## 1. Architecture du Projet & Règle d'Or (`build.js`)

Le site principal **BoostMySite** est un site statique ultra-rapide généré par un script Node.js sans dépendances externes lourdes :

- **`build.js`** : **SOURCE DE VÉRITÉ DU SITE PRINCIPAL.**
  - C'est ce fichier qui génère `index.html`, `portfolio.html`, `services.html`, `faq.html`, `blog.html`, `contact.html`, `mentions-legales.html`, ainsi que toutes les pages SEO dans `metiers/*.html` et `villes/*.html` et les articles dans `blog/*.html`.
  - ⚠️ **RÈGLE CRITIQUE** : Ne modifie **jamais** directement `index.html`, `portfolio.html`, `metiers/*.html` ou `villes/*.html` à la main sans modifier `build.js`, sinon tes changements seront écrasés au prochain `node build.js`.
  - Pour régénérer tout le site après une modification dans `build.js`, exécute :
    ```bash
    node build.js
    ```
- **`styles.css` & `main.js`** : Feuille de style et scripts globaux de l'agence BoostMySite.
- **`sites/`** : Contient les **démonstrations interactives autonomes** (fichiers HTML complets avec leur propre CSS/JS embarqué) :
  - `sites/fastfood-smash.html` : Démo Fast-Food / Smash Burger & Click-and-Collect sans commission.
  - `sites/restaurant-braise.html` : Démo Restaurant / Rôtisserie au feu de bois & Réservation de table.
  - `sites/artisan-elite.html` : Démo Artisan BTP / Rénovation de salles de bain & Devis en ligne.
  - `sites/chauffeur-prestige.html` : Démo Chauffeur Privé VTC.
- **`outils/tournee-clients.html`** : Outil interne d'optimisation de tournée commerciale (calcul de l'itinéraire le plus court entre plusieurs prospects).

---

## 2. Direction Artistique : 100 % Humain, Métier & Authentique (ZÉRO Look IA)

Nos clients sont des **commerçants locaux, restaurateurs, gérants de fast-foods et artisans du bâtiment**. Ils veulent un site qui inspire confiance à leurs vrais clients de quartier, **pas un vaisseau spatial ni une interface de science-fiction**.

### 🚫 Ce qui est STRICTEMENT INTERDIT sur les sites et démos clients :
1. **Zéro néon / Zéro lueur cyber** : Pas de `box-shadow: 0 0 20px #00ffcc`, pas de vert fluo (`#34d399`), pas de dégradés violet/cyan typiques des sites générés par IA.
2. **Zéro typographie "Tech/Crypto" hors-sujet** : N'utilise pas `Space Grotesk` ou des polices futuristes pour un artisan plombier, une salle de bain ou un restaurant à la braise.
3. **Zéro jargon robotique ou militaire** : Interdiction d'utiliser des termes comme *"Télémétrie temps réel"*, *"Radar sonar"*, *"Holographique"*, *"Moteur quantique"*, *"Écosystème synergique"*. Parle comme un vrai artisan ou un vrai restaurateur passionné par son métier.
4. **Zéro fausse notification trompeuse** : Pas de faux popups *"Jean de Lyon vient d'acheter il y a 2 minutes"* (interdit par la DGCCRF — pratique commerciale trompeuse).

### ✅ Les Identités Visuelles par Métier :
- **Fast-Food / Street-Food / Smash Burger / Tacos** :
  - **Ambiance** : Chaleureuse, gourmande, papier kraft / diner artisanal (style *Dumbo*, *Shake Shack*, *Blend*).
  - **Palette** : Fond crème papier boucher (`#FBF7F0`), Noir fonte/plancha (`#1A1615`), Rouge Ketchup/Paprika (`#C92A2A`), Jaune Cheddar fondu (`#E69500`).
  - **Polices** : `Fraunces` ou `Barlow Condensed` (titres) + `DM Sans` (corps et menu).
- **Restaurant / Bistronomie / Cuisson à la Braise** :
  - **Ambiance** : Authentique, boisée, linge de table en lin, terroir et feu de bois.
  - **Palette** : Fond lin/parchemin chaud (`#FAF6F0`) et bois brûlé (`#1C1613`), Terre cuite / Brique (`#A63A22`), Laiton brossé (`#C59B6D`), Vert sauge/olive (`#3F6244`).
  - **Polices** : `Cormorant Garamond` ou `Lora` (titres) + `Work Sans` ou `DM Sans` (carte).
- **Artisan BTP / Salle de Bain / Rénovation** :
  - **Ambiance** : Architecturale, minérale, pierre naturelle, bois de chêne, Compagnon du Devoir.
  - **Palette** : Pierre de travertin / Blanc chaud (`#F6F3EC`), Anthracite minéral (`#1E1D1A`), Bronze / Chêne (`#8C5A32`), Vert forêt assurance (`#2D5A43`).
  - **Polices** : `Newsreader` ou `Lora` (titres) + `DM Sans` (corps).

---

## 3. Sécurité Web "En Béton" (Exigences Systématiques)

Chaque page créée ou modifiée doit respecter la checklist `/securite-beton` :
1. **Protection XSS (Cross-Site Scripting)** :
   - Ne jamais injecter de saisie utilisateur dans `innerHTML`. Utiliser systématiquement `textContent` ou une fonction d'échappement stricte (`&`, `<`, `>`, `"`, `'`).
2. **Sécurité des Formulaires & Anti-Spam** :
   - Champ **Honeypot** invisible (`name="botcheck"`, `tabindex="-1"`, `autocomplete="off"`) sur tous les formulaires.
   - Validation HTML5 stricte (`type="email"`, `type="tel"`, `required`, `maxlength`) + validation JavaScript avant envoi.
3. **Liens & Ressources Externes** :
   - Tous les liens `target="_blank"` doivent obligatoirement comporter `rel="noopener noreferrer"`.
   - Chargement exclusivement en `https://`.
4. **Zéro Secret dans le Code Front-End** :
   - Aucune clé API privée, token ou mot de passe ne doit jamais figurer dans les fichiers `.html` ou `.js`.
5. **En-têtes de Sécurité HTTP (`vercel.json`)** :
   - Maintenir les en-têtes `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.

---

## 4. Conformité Légale Française (LCEN, RGPD, DGCCRF)

Chaque site livré à un client doit être **100 % conforme à la loi française** (utiliser la commande `/conformite-legale`) :
1. **Mentions Légales Obligatoires (Loi LCEN du 21 juin 2004)** :
   - Identité de l'éditeur (Raison sociale, forme juridique, capital, adresse, SIRET, RCS/RM, TVA intracommunautaire, Directeur de la publication, contact).
   - Identité complète de l'hébergeur (Nom, raison sociale, adresse postale, numéro de téléphone).
2. **Médiateur de la Consommation (Art. L.612-1 du Code de la consommation)** :
   - Obligatoire pour tout site B2C (artisan, restaurant, fast-food, VTC). Absence passible de 3 000 € à 15 000 € d'amende DGCCRF.
3. **RGPD & CNIL** :
   - Mention d'information sous chaque formulaire (finalité, durée de conservation, email de contact pour exercer ses droits d'accès/suppression).
   - Pas de dépôt de cookies publicitaires/traceurs sans consentement préalable.
4. **Obligations Spécifiques Restauration / Fast-Food** :
   - **Origine des viandes (Décret du 26 janvier 2022)** : Mention obligatoire des pays de naissance, d'élevage et d'abattage pour le bœuf, et pays d'élevage et d'abattage pour la volaille, le porc et le mouton (même en vente à emporter / Click & Collect).
   - **Tableau des 14 Allergènes majeurs (Décret n°2015-447)** : Accessible clairement depuis la carte en ligne.
   - **Prix TTC** : Mention *"Prix nets TTC, service compris"* et contenance des boissons (ex: 33 cl, 50 cl).
   - **Droit de rétractation Click & Collect** : Mentionner l'exception légale de l'article L.221-28 4° du Code de la consommation (pas de droit de rétractation sur les denrées alimentaires préparées à la commande et rapidement périssables).
5. **Obligations Spécifiques Artisan BTP** :
   - Mention de l'**Assurance Décennale** et **RC Pro** (Nom de l'assureur, n° de police, zone géographique).
   - Mention du barème tarifaire (taux horaire TTC, frais de déplacement TTC, devis gratuit ou payant — Arrêté du 24 janvier 2017).

---

## 5. Commandes Rapides (Skills Claude Code disponibles)

Tape `/` dans Claude Code pour lancer l'une des commandes pré-configurées dans `.claude/commands/` :
- `/conformite-legale` : Vérifie et génère toutes les mentions légales, RGPD, allergènes, origine des viandes et obligations DGCCRF.
- `/securite-beton` : Audite et blinde la sécurité du code (XSS, CSP, formulaires, en-têtes HTTP, liens).
- `/design-humain` : Nettoie tout aspect "IA / néon / sci-fi" d'une page et applique une charte métier authentique et humaine.
- `/nouveau-fastfood` : Crée une démo personnalisée complète pour un prospect Fast-Food (Smash Burger, Tacos, Pizzeria, Kebab) en 5 minutes.
- `/nouveau-client` : Crée un site complet sur mesure pour n'importe quel commerce local ou artisan.
- `/seo-local-pack` : Optimise une page pour dominer Google Maps (JSON-LD LocalBusiness, balises meta, mots-clés locaux).
- `/audit-prospect` : Génère un audit commercial + calcul d'économies UberEats + script de vente pour aller voir un commerçant.
- `/checklist-mise-en-ligne` : Passe la checklist finale en 30 points avant de livrer un site client.
