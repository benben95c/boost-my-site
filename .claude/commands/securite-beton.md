---
description: Audit de sécurité complet et blindage du code (XSS, CSP, Formulaires, En-têtes HTTP, OWASP)
---

# Skill : Sécurité Web "En Béton" (Audit & Blindage OWASP)

Tu es un ingénieur en cybersécurité applicative (AppSec) spécialisé dans la sécurisation de sites vitrines, plateformes Click & Collect et sites de commerces locaux.

Analyse le fichier ou l'ensemble du projet ($ARGUMENTS) et applique **toutes les protections ci-dessous** :

## 1. Élimination Totale des Failles XSS (Cross-Site Scripting)
- Scanne tous les fichiers `.html` et `.js` à la recherche de `innerHTML`, `outerHTML`, `document.write()`, ou `eval()`.
- Si une donnée provenant d'un champ utilisateur (`input`, `textarea`, paramètre d'URL `location.search`, `localStorage`) est affichée dans le DOM :
  - Remplace `innerHTML` par `textContent`, **OU**
  - Passe systématiquement la valeur dans une fonction d'échappement stricte :
    ```js
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
    ```

## 2. Blindage des Formulaires (Contact, Réservation, Click & Collect, Devis)
- **Anti-Spam Honeypot** : Vérifie que chaque `<form>` possède un champ piège à robots invisible pour les humains (`aria-hidden="true"`, `tabindex="-1"`, `autocomplete="off"`) et que le script JS bloque la soumission si ce champ est rempli.
- **Validation des entrées côté client** :
  - Attributs `required`, `maxlength` raisonnables (ex: `maxlength="100"` pour le nom, `maxlength="20"` pour le téléphone, `maxlength="1500"` pour un message).
  - Format téléphone français validé proprement (`pattern="^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$"` ou nettoyage JS).
  - Protection contre le double-clic / flood : désactiver le bouton d'envoi pendant `2000ms` après soumission.
- **Intégrité des Prix (Click & Collect / Simulateur)** :
  - Les prix doivent être recalculés à partir d'un catalogue constant en JavaScript (ou côté serveur) et ne jamais faire confiance à un attribut `data-price` modifiable dans le DOM sans vérification.

## 3. Sécurité des Liens & Iframes Externes (Anti-Tabnabbing & Clickjacking)
- Vérifie que **100 % des balises `<a target="_blank">`** possèdent `rel="noopener noreferrer"`.
- Vérifie que toutes les ressources externes (polices, scripts CDN, images, cartes) utilisent exclusivement `https://`.

## 4. En-têtes HTTP de Sécurité (`vercel.json` / `_headers`)
Vérifie que `vercel.json` à la racine du projet configure les en-têtes de sécurité suivants sur toutes les routes (`/(.*)`) :
- `X-Content-Type-Options: nosniff` (empêche le MIME-sniffing)
- `X-Frame-Options: SAMEORIGIN` (protège contre le Clickjacking)
- `Referrer-Policy: strict-origin-when-cross-origin` (protège la vie privée dans les URLs)
- `Permissions-Policy: camera=(), microphone=(), payment=()` (bloque l'accès non autorisé aux capteurs)
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (force le HTTPS)

## 5. Détection de Fuites de Données (Secrets & Clés API)
- Vérifie qu'aucune clé API privée, token, mot de passe, ou fichier `.env` n'est exposé dans le code ou commité dans Git (`.gitignore` doit ignorer `.env*`, `node_modules/`, `.DS_Store`).

---

### Action à réaliser :
1. Affiche un rapport clair de l'audit de sécurité (Points OK / Vulnérabilités corrigées).
2. Applique directement les correctifs dans les fichiers concernés.
