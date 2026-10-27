/* BoostMySite — Configuration des encaissements d'acompte (Virement instantané SEPA EPC & CB/Stripe)
 * Fichier partagé pour devis.html et devis-express.html
 * Modifiez votre IBAN et vos liens Stripe ci-dessous. */
(function () {
  'use strict';

  const DEFAULT_CONFIG = {
    beneficiary: 'Brahim Ben Said — BoostMySite',
    iban: 'FR76 1751 5900 0008 1234 5678 901', // Remplacez par votre IBAN pro (Revolut, BNP, BoursoBank, Qonto...)
    bic: 'REVOFRP2',                           // Remplacez par votre BIC
    phone: '06 98 72 72 47',
    stripeLinks: {
      starter: 'https://buy.stripe.com/test_starter_245', // Lien Stripe Acompte Starter (245 €)
      pro: 'https://buy.stripe.com/test_pro_495',         // Lien Stripe Acompte Pro (495 €)
      cb: 'https://buy.stripe.com/test_cb_745',           // Lien Stripe Acompte CB (745 €)
      custom: 'https://buy.stripe.com/test_custom'
    }
  };

  function getConfig() {
    try {
      const saved = localStorage.getItem('bms_payment_config');
      if (saved) return Object.assign({}, DEFAULT_CONFIG, JSON.parse(saved));
    } catch (e) {}
    return DEFAULT_CONFIG;
  }

  function saveConfig(cfg) {
    try {
      localStorage.setItem('bms_payment_config', JSON.stringify(cfg));
    } catch (e) {}
  }

  /**
   * Génère la chaîne standardisée européenne EPC-QR (SEPA Credit Transfer)
   * Reconnue nativement par 100% des applications bancaires en France
   */
  function buildEpcQrString(amountEur, refCode, clientName) {
    const cfg = getConfig();
    const cleanIban = cfg.iban.replace(/\s+/g, '').toUpperCase();
    const cleanBic = (cfg.bic || '').replace(/\s+/g, '').toUpperCase();
    const cleanAmount = (Number(amountEur) || 0).toFixed(2);
    const cleanRef = `DEVIS ${refCode || 'BMS'} ${(clientName || '').slice(0, 15)}`.slice(0, 35).trim();

    return [
      'BCD',
      '002',
      '1',
      'SCT',
      cleanBic,
      cfg.beneficiary.slice(0, 70),
      cleanIban,
      `EUR${cleanAmount}`,
      '',
      '',
      cleanRef
    ].join('\n');
  }

  window.BMSPayment = Object.freeze({
    getConfig,
    saveConfig,
    buildEpcQrString,
    DEFAULT_CONFIG
  });
})();
