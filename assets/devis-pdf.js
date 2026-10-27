/* BoostMySite — Générateur de devis PDF partagé (outil interne + page devis client).
 * Aucune donnée sensible ici : uniquement les formules publiques et la mise en page du PDF.
 * Nécessite jsPDF (window.jspdf) chargé avant ce fichier. */
(function () {
  'use strict';

  const OFFERS = {
    starter: {
      title: 'Forfait Site Vitrine (Livraison sous 72h)',
      price: 490,
      items: [
        'Site complet sur téléphone et ordinateur (présentation, carte/tarifs, horaires)',
        'Photos de vos produits et de votre établissement incluses',
        'Bouton d\'appel direct et liaison avec votre fiche Google Maps',
        'Mise en ligne et hébergement rapide inclus (0 abonnement obligatoire)'
      ]
    },
    pro: {
      title: 'Forfait Site Complet + Click & Collect Comptoir (Livraison 5-7 jours)',
      price: 990,
      items: [
        'Site complet sur mesure jusqu\'à 5 pages + référencement Google local',
        'Module Click & Collect : choix du menu, suppléments, sauces et heure de retrait',
        'Réception directe des commandes sur WhatsApp Caisse + paiement au comptoir',
        'Photos sur place, QR Codes comptoir/tables et fiche Google Maps inclus'
      ]
    },
    cb: {
      title: 'Forfait Click & Collect + Paiement CB en ligne (Livraison 7-10 jours)',
      price: 1490,
      items: [
        'Site complet sur mesure + commande en ligne sans aucune commission (0 %)',
        'Paiement direct par Carte Bancaire, Apple Pay et Google Pay sur votre compte',
        'Écran de réception des commandes en cuisine avec alerte sonore',
        'Photos sur place, QR Codes comptoir/tables et fiche Google Maps inclus'
      ]
    },
    custom: {
      title: 'Forfait Sur Mesure (Livraison 10-14 jours)',
      price: 2500,
      items: [
        'Création complète sur mesure selon votre cahier des charges',
        'Calculateur de devis automatique, paiement en ligne ou configurateur 3D',
        'Optimisation complète pour Google et accompagnement dédié'
      ]
    }
  };

  function cleanPdfText(str) {
    return String(str || '')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/[\u00A0\u202F]/g, " ");
  }

  function createQrDataUrl(text, size) {
    if (typeof document === 'undefined' || !window.QRCode) return null;
    try {
      const container = document.createElement('div');
      new window.QRCode(container, {
        text: text,
        width: size || 140,
        height: size || 140,
        colorDark: '#0F172A',
        colorLight: '#FFFFFF',
        correctLevel: window.QRCode.CorrectLevel.M
      });
      const canvas = container.querySelector('canvas');
      if (canvas && typeof canvas.toDataURL === 'function') {
        return canvas.toDataURL('image/png');
      }
      const img = container.querySelector('img');
      if (img && img.src && img.src.startsWith('data:')) {
        return img.src;
      }
    } catch (e) {}
    return null;
  }

  function getQuoteFilename(shopName) {
    const slug = (shopName || 'Client')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'Client';
    return `Devis-BoostMySite-${slug}.pdf`;
  }

  /**
   * data = { shop, address, phone, total, offerKey, refCode, dateStr, signatureDataUrl, quoteUrl, customItems, options }
   */
  function generate(data) {
    data = data || {};
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const shop = cleanPdfText(data.shop || 'Votre établissement');
    const addr = cleanPdfText(data.address || '');
    const phone = cleanPdfText(data.phone || '');
    const total = Math.max(0, Math.round(Number(data.total) || 0));
    const half = Math.round(total / 2);
    const rest = total - half;
    const o = OFFERS[data.offerKey] || OFFERS.pro;
    const dateStr = cleanPdfText(data.dateStr || new Date().toLocaleDateString('fr-FR'));
    const refCode = String(data.refCode || 'BMS');

    // Parse options & customItems
    let customItems = [];
    if (Array.isArray(data.customItems)) {
      customItems = data.customItems
        .filter(it => it && typeof it.title === 'string' && it.title.trim())
        .map(it => ({
          title: cleanPdfText(it.title),
          price: Math.max(0, Math.round(Number(it.price) || 0))
        }))
        .filter(it => it.price > 0);
    } else if (typeof data.options === 'string' && data.options.trim()) {
      try {
        const parsed = JSON.parse(data.options);
        if (Array.isArray(parsed)) {
          customItems = parsed
            .filter(it => it && typeof it.title === 'string' && it.title.trim())
            .map(it => ({
              title: cleanPdfText(it.title),
              price: Math.max(0, Math.round(Number(it.price) || 0))
            }))
            .filter(it => it.price > 0);
        }
      } catch (e) {}
    }

    const cfg = (window.BMSPayment && window.BMSPayment.getConfig)
      ? window.BMSPayment.getConfig()
      : {
          beneficiary: 'Brahim Bensaid',
          iban: 'FR76 2823 3000 0117 1939 3893 095',
          bic: 'REVOFRP2',
          bankName: 'Revolut Bank UAB (Paris)',
          phone: '06 98 72 72 47'
        };

    let payLink = data.quoteUrl;
    if (!payLink && typeof window !== 'undefined' && window.location) {
      const q = new URLSearchParams({
        ref: refCode,
        client: shop,
        pack: data.offerKey || 'pro',
        price: String(total)
      });
      if (customItems.length > 0) {
        q.set('options', JSON.stringify(customItems));
      }
      payLink = `${window.location.origin}/devis.html?${q.toString()}`;
    }
    if (!payLink) payLink = 'https://boost-my-site.com';

    let qrDataUrl = null;
    if (window.BMSPayment && typeof window.BMSPayment.buildEpcQrString === 'function') {
      const epcString = window.BMSPayment.buildEpcQrString(half, refCode, shop);
      qrDataUrl = createQrDataUrl(epcString, 140);
    } else {
      qrDataUrl = createQrDataUrl(payLink, 140);
    }

    // 1. EN-TÊTE BOOST MY SITE
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42);
    doc.text('BoostMySite', 16, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Creation de sites web & Click & Collect pour commercants', 16, 28);
    doc.text('Brahim Ben Said  |  06 98 72 72 47  |  https://boost-my-site.com', 16, 33.5);

    // Bloc Réf Devis à droite
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('DEVIS / BON DE COMMANDE', 194, 21, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(22, 163, 74);
    doc.text(`Ref : #${cleanPdfText(refCode)}`, 194, 27.5, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Date : ${dateStr}`, 194, 33, { align: 'right' });

    // Ligne séparatrice
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(16, 39, 194, 39);

    // 2. ENCADRÉ CLIENT
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(16, 44, 178, 27, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('ETABLISSEMENT / CLIENT', 22, 51);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(15, 23, 42);
    doc.text(shop, 22, 58);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const clientDetails = [addr, phone ? `Tel : ${phone}` : ''].filter(Boolean).join('   |   ') || 'Pontoise / Cergy-Pontoise (95)';
    doc.text(clientDetails, 22, 65);

    // 3. TABLEAU DE LA PRESTATION
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(16, 76, 178, 9, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('DETAIL DE LA PRESTATION CLE EN MAIN', 22, 82);
    doc.text('MONTANT', 188, 82, { align: 'right' });

    // Calcul dynamique de la hauteur pour que tout rentre sur 1 page A4
    const hasOptions = customItems.length > 0;
    const baseLineH = hasOptions ? 4.5 : 5.0;
    const baseGapH = hasOptions ? 2.2 : 3.0;

    let simY = 104;
    o.items.forEach(item => {
      const lines = doc.splitTextToSize(cleanPdfText(item), 156).length;
      simY += lines * baseLineH + baseGapH;
    });
    if (hasOptions) {
      simY += 4 + 5;
      customItems.forEach(ci => {
        const lines = doc.splitTextToSize(cleanPdfText(ci.title), 125).length;
        simY += Math.max(5, lines * 4.2 + 1.2);
      });
    }

    const s3Height = Math.max(66, Math.min(84, (simY - 85) + 3));

    // Cadre contenu prestation
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(16, 85, 178, s3Height, 'FD');

    // Titre de l'offre + Prix du pack de base
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(cleanPdfText(o.title), 22, 93.5);
    doc.setFontSize(12);
    if (hasOptions) {
      doc.text(`${o.price} EUR`, 188, 93.5, { align: 'right' });
    } else {
      doc.text(`${total} EUR`, 188, 93.5, { align: 'right' });
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(22, 97.5, 188, 97.5);

    // Liste des éléments inclus avec coches vertes
    let yPos = 104;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    doc.setTextColor(51, 65, 85);

    o.items.forEach(item => {
      doc.setDrawColor(22, 163, 74);
      doc.setLineWidth(0.65);
      doc.line(22.5, yPos - 1.5, 23.8, yPos - 0.2);
      doc.line(23.8, yPos - 0.2, 26.2, yPos - 3.2);

      const wrapped = doc.splitTextToSize(cleanPdfText(item), 156);
      doc.text(wrapped, 29, yPos);
      yPos += wrapped.length * baseLineH + baseGapH;
    });

    // Options et demandes spécifiques ajoutées
    if (hasOptions) {
      yPos += 1;
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.4);
      doc.line(22, yPos, 188, yPos);
      yPos += 4.5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(22, 163, 74);
      doc.text('+ OPTIONS & DEMANDES PARTICULIERES :', 22, yPos);
      yPos += 5.2;

      customItems.forEach(ci => {
        // Badge vert (+)
        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(187, 247, 208);
        doc.roundedRect(22, yPos - 3.2, 4, 4, 0.8, 0.8, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(21, 128, 61);
        doc.text('+', 24, yPos - 0.3, { align: 'center' });

        // Libellé de l'option
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        const wrapped = doc.splitTextToSize(cleanPdfText(ci.title), 125);
        doc.text(wrapped, 28, yPos);

        // Prix de l'option
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(22, 163, 74);
        doc.text(`+ ${ci.price} EUR`, 188, yPos, { align: 'right' });

        yPos += Math.max(5, wrapped.length * 4.2 + 1.2);
      });
    }

    // Positions relatives pour garantir un document 100 % 1 seule page A4
    const s4Top = Math.min(160, 85 + s3Height + 3.5);
    const s4Height = 26;

    const s5Top = s4Top + s4Height + 3.5;
    const s5Height = 44;

    const s6Top = s5Top + s5Height + 4;
    const s6Height = 28;

    // 4. RÉCAPITULATIF FINANCIER & MODALITÉS DE RÈGLEMENT
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.roundedRect(16, s4Top, 178, s4Height, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    if (hasOptions) {
      doc.text('PRIX TOTAL CLE EN MAIN (Pack + Options) :', 22, s4Top + 7.5);
    } else {
      doc.text('PRIX TOTAL CLE EN MAIN', 22, s4Top + 7.5);
    }
    doc.setFontSize(13.5);
    doc.text(`${total} EUR`, 188, s4Top + 7.5, { align: 'right' });

    doc.setDrawColor(226, 232, 240);
    doc.line(22, s4Top + 10.5, 188, s4Top + 10.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(22, 163, 74);
    doc.text('1. Acompte de 50 % au demarrage du projet :', 22, s4Top + 16.5);
    doc.text(`${half} EUR`, 188, s4Top + 16.5, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(71, 85, 105);
    doc.text('2. Solde de 50 % a la livraison (apres validation du site) :', 22, s4Top + 21.8);
    doc.text(`${rest} EUR`, 188, s4Top + 21.8, { align: 'right' });

    // 5. BLOC REGLEMENT SECURISE DE L'ACOMPTE 50 %
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(16, s5Top, 178, s5Height, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(21, 128, 61);
    doc.text('REGLEMENT DE L\'ACOMPTE (50 %) :', 22, s5Top + 7);
    doc.setFontSize(11.5);
    doc.text(`${half} EUR`, 140, s5Top + 7, { align: 'right' });

    doc.setDrawColor(220, 252, 231);
    doc.line(22, s5Top + 9.5, 140, s5Top + 9.5);

    // Option 1 : Virement SEPA
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(15, 23, 42);
    doc.text('Option 1 : Virement Instantane SEPA (pre-rempli par scan ou IBAN) :', 22, s5Top + 14.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.6);
    doc.setTextColor(71, 85, 105);
    doc.text('IBAN :', 24, s5Top + 19.5);

    doc.setFont('courier', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(15, 23, 42);
    doc.text(cfg.iban, 34, s5Top + 19.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.4);
    doc.setTextColor(71, 85, 105);
    doc.text(`BIC : ${cfg.bic}   |   Beneficiaire : ${cfg.beneficiary}`, 24, s5Top + 24.5);
    doc.text(`Motif a indiquer : DEVIS ${cleanPdfText(refCode)} ${shop.slice(0, 18)}`, 24, s5Top + 28.8);

    // Option 2 : CB / En ligne
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(15, 23, 42);
    doc.text('Option 2 : Paiement Carte Bancaire / Apple Pay en ligne :', 22, s5Top + 34.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.4);
    doc.setTextColor(22, 163, 74);
    doc.textWithLink('-> Cliquez ici pour regler l\'acompte en ligne en 1 clic', 24, s5Top + 39.5, { url: payLink });

    // QR Code encadré à droite
    if (qrDataUrl) {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(147, s5Top + 3.5, 41, 37, 2, 2, 'FD');
      try {
        doc.addImage(qrDataUrl, 'PNG', 154, s5Top + 5.5, 26, 26);
      } catch (e) {}
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(21, 128, 61);
      doc.text('SCAN APPLI BANCAIRE', 167.5, s5Top + 33.2, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(100, 116, 139);
      doc.text(`Virement ${half} EUR pre-rempli`, 167.5, s5Top + 36.5, { align: 'center' });
    }

    // 6. GARANTIES & CADRE SIGNATURE ("BON POUR ACCORD")
    // Gauche : Engagements
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('ENGAGEMENTS BOOST MY SITE :', 16, s6Top + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.6);
    doc.setTextColor(100, 116, 139);
    doc.text('- 100 % proprietaire de votre site web (aucun abonnement obligatoire)', 16, s6Top + 9.5);
    doc.text('- Livraison cle en main : design, redaction, photos et Google Maps', 16, s6Top + 14.5);
    doc.text('- Suivi et modifications incluses avec support direct 7j/7', 16, s6Top + 19.5);
    doc.text('- Option maintenance illimitee (facultative) : 39 EUR / mois', 16, s6Top + 24.5);

    // Droite : Cadre signature élégant et proportionné
    doc.setFillColor(252, 251, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(124, s6Top, 70, s6Height, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('BON POUR ACCORD & SIGNATURE :', 128, s6Top + 5.5);

    if (data.signatureDataUrl) {
      try {
        doc.addImage(data.signatureDataUrl, 'PNG', 126, s6Top + 7.5, 66, 19);
      } catch (e) {}
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('(Signature au doigt ou validation WhatsApp)', 128, s6Top + 17);
    }

    // 7. PIED DE PAGE
    doc.setDrawColor(226, 232, 240);
    doc.line(16, 274, 194, 274);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('BoostMySite - Brahim Ben Said - Tel : 06 98 72 72 47 - https://boost-my-site.com', 105, 280, { align: 'center' });

    return doc;
  }

  window.BMSDevis = Object.freeze({
    version: '20261027_06',
    OFFERS,
    cleanPdfText,
    getQuoteFilename,
    generate
  });
})();
