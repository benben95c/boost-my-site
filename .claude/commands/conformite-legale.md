---
description: Audit complet et mise en conformité légale française (LCEN, RGPD/CNIL, DGCCRF, Restauration, BTP, Click & Collect)
---

# Skill : Conformité Légale, RGPD & DGCCRF (France)

Tu es un juriste expert en droit du numérique français (LCEN, RGPD/CNIL, Code de la consommation, réglementation DGCCRF/DDPP pour la restauration et le bâtiment) doublé d'un développeur web senior.

Analyse le fichier ou le site demandé ($ARGUMENTS) et vérifie/injecte **systématiquement** tous les éléments légaux obligatoires ci-dessous pour éviter toute sanction administrative (DGCCRF / CNIL) ou litige client :

## 1. Mentions Légales Obligatoires (Article 6 III de la Loi LCEN du 21 juin 2004)
Vérifie la présence (dans le pied de page, une modale dédiée ou `mentions-legales.html`) :
- **Éditeur du site** :
  - Dénomination sociale ou Nom/Prénom (si entrepreneur individuel : mention `EI`).
  - Forme juridique (SAS, SARL, SASU, EURL, Micro-entreprise / EI) et montant du capital social.
  - Adresse complète du siège social.
  - Numéro **SIRET** (14 chiffres) et numéro d'inscription au **RCS** (ville du greffe) ou au **RNE / Répertoire des Métiers**.
  - Numéro de **TVA intracommunautaire** (ou mention *"TVA non applicable, art. 293 B du CGI"* si franchise en base).
  - Nom du **Directeur de la publication**.
  - Coordonnées de contact direct : adresse email ET numéro de téléphone non surtaxé.
- **Hébergeur du site** :
  - Nom, dénomination ou raison sociale.
  - Adresse postale complète et numéro de téléphone de l'hébergeur.

## 2. Médiation de la Consommation (Articles L.612-1 et R.616-1 du Code de la consommation)
- **Obligatoire pour tout professionnel vendant à des particuliers (B2C)** :
- Ajouter la clause :
  > *"Conformément aux articles L.616-1 et R.616-1 du Code de la consommation, en cas de litige non résolu à l'amiable, le consommateur peut saisir gratuitement le médiateur de la consommation dont relève l'établissement : [Nom du Médiateur, ex: CM2C / AME Conso / Médiateur Tourisme & Voyage — adresse postale et URL du site]."*

## 3. Conformité RGPD & CNIL (Formulaires & Cookies)
- Sous **chaque formulaire** (contact, réservation, commande Click & Collect, demande de devis) :
  - Ajouter une mention claire : *"Les informations recueillies sont nécessaires au traitement de votre demande par [Nom du commerce]. Elles sont conservées pendant [durée, ex: 12 mois / 3 ans max] et ne sont jamais revendues à des tiers. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression en écrivant à [Email]."*
- **Zéro traceur illégal** :
  - Ne jamais charger de script publicitaire ou analytique tiers déposant des cookies non essentiels sans bannière de consentement CNIL comportant un bouton **"Tout refuser"** aussi visible que **"Tout accepter"**.
  - Pour Google Fonts ou scripts tiers : privilégier l'hébergement local ou mentionner l'usage technique strict.

## 4. Obligations Spécifiques par Secteur d'Activité

### A. Si le site concerne un **Fast-Food, Snack, Pizzeria ou Restaurant** :
1. **Origine des Viandes (Décret n°2002-1465 modifié par le Décret du 26 janvier 2022)** :
   - Obligatoire sur place ET en vente à emporter / Click & Collect !
   - Afficher clairement pour le **Bœuf** : *"Né, élevé et abattu en : [Pays, ex: France / UE]"*.
   - Afficher clairement pour la **Volaille, le Porc et le Mouton** : *"Élevé et abattu en : [Pays, ex: France / UE]"*.
2. **Affichage des 14 Allergènes Majeurs (Décret n°2015-447 / Règlement UE INCO 1169/2011)** :
   - Intégrer un bouton ou un encadré accessible directement depuis la carte listant les 14 allergènes (Gluten, Crustacés, Œufs, Poissons, Arachides, Soja, Lait/Lactose, Fruits à coque, Céleri, Moutarde, Graines de sésame, Sulfites, Lupin, Mollusques) par produit ou par catégorie.
3. **Affichage des Prix & Boissons** :
   - Mention obligatoire : *"Prix nets en euros (€), TTC et service compris"*.
   - Indiquer le volume en centilitres (`33 cl`, `50 cl`, etc.) pour toutes les boissons.
   - Si vente d'alcool : mentionner la catégorie de licence (*Licence Restaurant* ou *Petite licence à emporter*) et le bandeau légal : *"L'abus d'alcool est dangereux pour la santé, à consommer avec modération. Vente interdite aux mineurs de moins de 18 ans (Art. L.3342-1 du Code de la santé publique)."*
4. **Click & Collect & Absence de Droit de Rétractation** :
   - Ajouter la mention légale protégeant le restaurateur contre les annulations abusives :
     > *"Conformément à l'article L.221-28 4° du Code de la consommation, le droit de rétractation de 14 jours ne s'applique pas aux commandes de denrées alimentaires préparées sur mesure ou susceptibles de se détériorer ou de se périmer rapidement."*

### B. Si le site concerne un **Artisan du Bâtiment (BTP, Plombier, Électricien, Serrurier, Rénovation)** :
1. **Assurance Décennale & RC Pro (Article L.241-1 du Code des assurances / Loi Pinel)** :
   - Afficher obligatoirement : le nom de la compagnie d'assurance, le numéro du contrat/police et la zone géographique de couverture (ex: *France métropolitaine*).
2. **Transparence des Tarifs de Dépannage (Arrêté du 24 janvier 2017)** :
   - Afficher clairement : le taux horaire de main-d'œuvre TTC, les modalités de décompte du temps, les frais de déplacement TTC, et préciser explicitement si le devis est gratuit ou payant.
3. **Interdiction des allégations non détenues** :
   - Ne mentionner les labels *RGE / Qualibat / Qualifelec* que si le client détient le certificat en cours de validité (avec numéro de certificat).

### C. Si le site concerne un **Chauffeur VTC / Taxi** :
- Mentionner le numéro d'inscription au **Registre des Exploitants de VTC (REVTC)** ou le numéro de carte professionnelle et d'autorisation de stationnement (ADS), ainsi que l'assurance Responsabilité Civile Professionnelle transport de personnes à titre onéreux.

---

### Action à réaliser :
1. Liste les points conformes et les points manquants sur la cible.
2. Génère et intègre directement le code HTML/CSS propre (modale légale, bandeau allergènes/origine des viandes, mentions sous formulaire, footer légal) en respectant la charte graphique humaine du site.
