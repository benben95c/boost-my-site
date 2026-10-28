/* BoostMySite — Configuration des encaissements d'acompte (Virement instantané SEPA EPC Revolut)
 * Fichier partagé pour devis.html, devis-express.html et devis-pdf.js
 * Virement bancaire instantané SEPA 100 % direct vers compte Revolut. */
(function () {
  'use strict';

  const DEFAULT_CONFIG = {
    beneficiary: 'Brahim Bensaid',
    iban: 'FR76 2823 3000 0117 1939 3893 095',
    bic: 'REVOFRP2',
    bankName: 'Revolut Bank UAB (Paris)',
    phone: '06 98 72 72 47'
  };

  function getConfig() {
    try {
      const saved = localStorage.getItem('bms_payment_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.iban && parsed.iban.includes('1751')) {
          localStorage.removeItem('bms_payment_config');
        } else {
          return Object.assign({}, DEFAULT_CONFIG, parsed);
        }
      }
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
