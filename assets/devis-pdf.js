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

  function getQuoteFilename(shopName) {
    const slug = (shopName || 'Client')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'Client';
    return `Devis-BoostMySite-${slug}.pdf`;
  }

  /**
   * data = { shop, address, phone, total, offerKey, refCode, dateStr, signatureDataUrl }
   */
  function generate(data) {
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
    doc.roundedRect(16, 45, 178, 28, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('ETABLISSEMENT / CLIENT', 22, 52);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(shop, 22, 59.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    const clientDetails = [addr, phone ? `Tel : ${phone}` : ''].filter(Boolean).join('   |   ') || 'Pontoise / Cergy-Pontoise (95)';
    doc.text(clientDetails, 22, 66.5);

    // 3. TABLEAU DE LA PRESTATION
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(16, 81, 178, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text('DETAIL DE LA PRESTATION CLE EN MAIN', 22, 87.3);
    doc.text('MONTANT', 188, 87.3, { align: 'right' });

    // Cadre contenu prestation
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(16, 91, 178, 66, 'FD');

    // Titre de l'offre + Prix
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(15, 23, 42);
    doc.text(cleanPdfText(o.title), 22, 100);
    doc.setFontSize(13);
    doc.text(`${total} EUR`, 188, 100, { align: 'right' });

    doc.setDrawColor(241, 245, 249);
    doc.line(22, 104, 188, 104);

    // Liste des éléments inclus avec coches vertes vectorielles
    let yPos = 112;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);

    o.items.forEach(item => {
      // Coche verte vectorielle
      doc.setDrawColor(22, 163, 74);
      doc.setLineWidth(0.7);
      doc.line(22.5, yPos - 1.5, 23.8, yPos - 0.2);
      doc.line(23.8, yPos - 0.2, 26.2, yPos - 3.2);

      const wrapped = doc.splitTextToSize(cleanPdfText(item), 156);
      doc.text(wrapped, 29, yPos);
      yPos += wrapped.length * 5.5 + 3.5;
    });

    // 4. RÉCAPITULATIF FINANCIER & MODALITÉS DE RÈGLEMENT
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.roundedRect(16, 164, 178, 36, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(15, 23, 42);
    doc.text('PRIX TOTAL CLE EN MAIN', 22, 174);
    doc.setFontSize(15);
    doc.text(`${total} EUR`, 188, 174, { align: 'right' });

    doc.setDrawColor(226, 232, 240);
    doc.line(22, 178, 188, 178);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(22, 163, 74);
    doc.text('1. Acompte de 50 % au demarrage du projet :', 22, 186);
    doc.text(`${half} EUR`, 188, 186, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text('2. Solde de 50 % a la livraison (apres validation du site) :', 22, 193.5);
    doc.text(`${rest} EUR`, 188, 193.5, { align: 'right' });

    // 5. GARANTIES & CADRE SIGNATURE ("BON POUR ACCORD")
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('ENGAGEMENTS BOOST MY SITE :', 16, 212);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('- Aucun abonnement obligatoire : vous etes 100 % proprietaire de votre site.', 16, 218.5);
    doc.text('- Livraison cle en main : nous nous occupons des textes, photos et mise en ligne.', 16, 224);
    doc.text('- Option maintenance & modifications illimitees (facultatif) : 39 EUR / mois.', 16, 229.5);

    // Cadre signature à droite
    doc.setFillColor(252, 251, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(114, 206, 80, 44, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('BON POUR ACCORD & SIGNATURE :', 119, 213);

    if (data.signatureDataUrl) {
      try {
        doc.addImage(data.signatureDataUrl, 'PNG', 118, 216, 72, 28);
      } catch (e) {}
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('(Signature client ou validation WhatsApp)', 119, 230);
    }

    // Pied de page
    doc.setDrawColor(226, 232, 240);
    doc.line(16, 274, 194, 274);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text('BoostMySite - Brahim Ben Said - Tel : 06 98 72 72 47 - https://boost-my-site.com', 105, 281, { align: 'center' });


    return doc;
  }

  window.BMSDevis = Object.freeze({ OFFERS, cleanPdfText, getQuoteFilename, generate });
})();
