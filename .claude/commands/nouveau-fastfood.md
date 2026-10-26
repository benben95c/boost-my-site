---
description: Génère une démo de site Fast-Food / Smash Burger / Tacos personnalisée pour un prospect en 5 minutes
---

# Skill : Générateur de Site Fast-Food Personnalisé (Click & Collect 0% Commission)

Crée une démo interactive complète et personnalisée pour le fast-food suivant : **$ARGUMENTS** (si aucun nom n'est fourni, demande le nom du fast-food, sa ville/quartier, sa spécialité — Smash Burger, Tacos, Pizzeria, Kebab gourmet, Poulet croustillant — et ses couleurs).

## Étapes d'exécution :
1. **Base de départ** :
   - Prends comme modèle de référence le fichier `sites/fastfood-smash.html`.
   - Si c'est une démo dédiée à un prospect précis, enregistre-la dans `sites/demos-clients/[slug-du-fastfood].html` (ou mets à jour `sites/fastfood-smash.html` si demandé).
2. **Identité Visuelle 100 % Humaine & Gourmande (Zéro look IA)** :
   - Pas de néons sci-fi, pas de fond cyber noir/bleu.
   - Utilise un style **Street-Food / Diner Artisanal chaleureux** (fond papier kraft crème `#FBF7F0`, textes noir fonte `#1A1615`, accents gourmands rouge paprika `#C92A2A` et jaune cheddar `#E69500`, ou adapté aux couleurs du restaurant).
   - Polices : `Fraunces` + `Barlow Condensed` + `DM Sans`.
3. **Fonctionnalités Clés à inclure obligatoirement** :
   - **En-tête & Infos Pratiques** : Horaires d'ouverture, adresse exacte avec lien Google Maps, badge *"Click & Collect en 12-15 min • 0 % de commission"*, mention Halal / Fait Maison / Pain Boulanger selon le restaurant.
   - **Carte filtrable par catégories** : Menus & Burgers / Tacos / Sides & Frites Maison / Boissons & Desserts.
   - **Configurateur de Menu Interactif (Modal)** :
     - Choix **Seul** ou **En Menu (+Frites Maison + Boisson)**.
     - Choix de la taille / viande (Simple, Double, Triple).
     - Choix des suppléments (Cheddar affiné, Bacon fumé, Oignons confits, Jalapeños, Œuf...).
     - Choix des sauces (2 sauces au choix).
     - Choix de la boisson.
   - **Panier Click & Collect dynamique** :
     - Choix du créneau de retrait (*Dès que possible ~15 min*, ou créneau horaire).
     - Récapitulatif clair et validation de commande (avec option d'envoi WhatsApp ou numéro de retrait).
   - **Simulateur d'Économies UberEats pour le Gérant** :
     - Permet de montrer en direct au patron combien il économise chaque mois en passant ses habitués sur son propre site Click & Collect (0 % de commission contre 30 % sur les plateformes).
4. **Conformité Légale Restauration & Sécurité** :
   - Encadré obligatoire **Origine des Viandes (Décret 2022)**.
   - Modale ou accordéon des **14 Allergènes majeurs (Décret 2015-447)**.
   - Mention d'absence de droit de rétractation sur les denrées périssables (Art. L.221-28 4° Code de la consommation).
   - Échappement XSS sur toutes les saisies et liens externes sécurisés.
