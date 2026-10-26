---
description: Crée un site complet sur mesure pour un nouveau client (Artisan, Commerce local, Restaurant, VTC)
---

# Skill : Création de Site Client Sur Mesure (Artisan & Commerce Local)

Tu dois concevoir un site web complet, rapide, humain et 100 % conforme pour le client suivant : **$ARGUMENTS**.

## 1. Analyse du Métier & Choix de la Direction Artistique
Adapte immédiatement la palette, la typographie et le ton au secteur réel du client (voir `CLAUDE.md`) :
- **Restauration / Fast-Food / Boulangerie / Boucherie** : Chaleureux, terroir ou street-food artisanal, axé sur l'appétit, la carte et le Click & Collect.
- **Artisan BTP (Plombier, Électricien, Rénovation, Salle de bain, Menuisier, Serrurier)** : Minéral, architectural, rassurant, axé sur les chantiers Avant/Après, la garantie décennale, l'appel d'urgence et le calculateur de devis.
- **Beauté / Coiffeur / Barber / Bien-être** : Éditorial, lumineux, teintes sable/argile/noir doux, axé sur les réalisations et la prise de rendez-vous.
- **Transport / Chauffeur VTC / Taxi** : Élégant, ponctuel, axé sur le simulateur de tarif de course et la réservation directe WhatsApp/téléphone.

## 2. Structure de Haute Conversion (Mobile-First)
1. **Barre d'action rapide mobile** : Numéro de téléphone cliquable (`tel:`) ou commande directe visible sans scroller.
2. **Hero humain et localisé** : Titre clair mentionnant le **Métier + la Ville/Quartier**, les vraies preuves de confiance (années d'expérience, avis Google, fait maison / décennale) et 2 boutons d'action clairs.
3. **Module interactif utile au client final** :
   - Restaurant/Fast-Food : Carte interactive + Configurateur de menu + Click & Collect.
   - Artisan : Comparateur Avant/Après + Estimateur de budget + Grille tarifaire transparente.
   - Service/VTC : Calculateur de trajet ou prise de rendez-vous rapide.
4. **Preuve sociale & Ancrage local** : Avis clients réalistes, photos du savoir-faire, carte/adresse et horaires précis.

## 3. Sécurité & Légalité Intégrées d'Office
- Injecte les données structurées Schema.org (`JSON-LD`) exactes pour Google Maps (`FastFoodRestaurant`, `Restaurant`, `Plumber`, `Electrician`, `HairSalon`, etc.).
- Intègre toutes les obligations légales du secteur (LCEN, RGPD, Médiateur de la consommation, Décennale BTP ou Allergènes/Origine des viandes en restauration).
- Sécurise tous les formulaires (Honeypot, validation, protection XSS).
