---
description: Checklist finale en 30 points (Sécurité, Légal DGCCRF/RGPD, Design Humain, Mobile, SEO) avant livraison client
---

# Skill : Checklist Finale de Mise en Ligne (30 Points)

Passe en revue le site ou la page cible ($ARGUMENTS) selon cette grille de contrôle stricte en 5 piliers avant toute livraison client ou mise en production :

## Pilier 1 : Design Humain & Identité Métier (6 points)
- [ ] Aucun élément visuel "IA générique" (zéro néon, zéro dégradé violet/cyan, zéro radar/télémétrie sci-fi).
- [ ] Typographie adaptée au secteur (Diner/Artisanal pour Fast-Food, Serif gastronomique pour Restaurant, Minéral/Architectural pour BTP).
- [ ] Textes rédigés dans un français naturel, chaleureux et professionnel (zéro jargon robotique).
- [ ] Vraies photographies cohérentes avec le métier, avec attributs `alt` descriptifs.
- [ ] Contrastes de lecture irréprochables (WCAG AA minimum).
- [ ] Affichage mobile (375px iPhone SE à 430px iPhone Pro Max) testé : aucun débordement horizontal (`overflow-x`), boutons faciles à toucher au pouce (min 44px de hauteur).

## Pilier 2 : Conformité Légale & DGCCRF (8 points)
- [ ] Mentions légales LCEN complètes (Raison sociale, SIRET, RCS/RM, TVA, Directeur de publication, Adresse, Email, Téléphone).
- [ ] Coordonnées complètes de l'hébergeur (Raison sociale, adresse, téléphone).
- [ ] Médiateur de la consommation mentionné (Art. L.612-1 Code de la consommation).
- [ ] Mention RGPD sous chaque formulaire (finalité, durée de conservation, email d'exercice des droits).
- [ ] Si Restauration/Fast-Food : **Origine des viandes (Décret 2022)** affichée clairement.
- [ ] Si Restauration/Fast-Food : **Liste des 14 Allergènes (Décret 2015-447)** accessible depuis la carte.
- [ ] Si Restauration/Click & Collect : Prix TTC service compris + contenance des boissons (cl) + exception au droit de rétractation (Art. L.221-28 4°).
- [ ] Si Artisan BTP : **Assurance Décennale & RC Pro** (assureur, n° de police, zone) + barème tarifaire dépannage (Arrêté du 24 janvier 2017).

## Pilier 3 : Sécurité "En Béton" (6 points)
- [ ] Zéro utilisation non protégée de `innerHTML` avec des entrées utilisateur (protection XSS).
- [ ] Champ Honeypot anti-spam actif sur tous les formulaires.
- [ ] Validation stricte des champs (`type="email"`, `type="tel"`, `required`, `maxlength`).
- [ ] Tous les liens `target="_blank"` possèdent `rel="noopener noreferrer"`.
- [ ] En-têtes HTTP de sécurité présents dans `vercel.json` (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`).
- [ ] Aucune clé API privée ni secret exposé dans le code source.

## Pilier 4 : SEO Local & Google Maps (5 points)
- [ ] `<title>` et `<meta name="description">` uniques incluant le métier et la ville.
- [ ] Balise `<link rel="canonical">` et balises OpenGraph (`og:title`, `og:image`, etc.) valides.
- [ ] Données structurées Schema.org (`application/ld+json`) valides et sans erreur de syntaxe JSON.
- [ ] Un seul `<h1>` pertinent par page.
- [ ] Coordonnées NAP (Nom, Adresse, Téléphone) identiques à la fiche Google Business du client.

## Pilier 5 : Fonctionnel & Conversion (5 points)
- [ ] Tous les liens de navigation, ancres et boutons fonctionnent (aucun lien mort 404).
- [ ] Le numéro de téléphone est cliquable (`href="tel:+33..."`).
- [ ] Les modules interactifs (Menu Composer, Panier Click & Collect, Calculateur de devis, Réservation) calculent des totaux exacts sans erreur dans la console JS.
- [ ] Si modification de `build.js` : `node build.js` a bien été exécuté et les pages ont été régénérées.
- [ ] `git status` et `git diff` vérifiés.

---

### Action à réaliser :
Exécute cette vérification point par point sur la cible, affiche le score sur 30, et corrige immédiatement tout point défaillant.
