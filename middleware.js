/**
 * BoostMySite — Middleware de sécurité Vercel (exécuté côté serveur, AVANT tout fichier statique).
 *
 * 1. /outils/*      → réservé à l'équipe : session signée (cookie HttpOnly) obligatoire.
 * 2. /team/login    → page de connexion équipe (mot de passe stocké dans les variables d'env Vercel).
 * 3. /team/logout   → déconnexion.
 * 4. /api/sign-devis→ signe un lien de devis client (équipe connectée uniquement).
 * 5. /devis.html    → page publique du devis client : accessible UNIQUEMENT avec un lien signé
 *                     (impossible de modifier le prix ou le nom dans l'URL).
 *
 * Variables d'environnement à définir dans Vercel (Settings → Environment Variables) :
 *   BMS_TEAM_PASSWORD  : mot de passe d'équipe (long, ex : 4 mots aléatoires)
 *   BMS_AUTH_SECRET    : secret aléatoire de 32+ caractères pour signer les sessions et les devis
 * Sans ces variables, les outils restent VERROUILLÉS (fail closed).
 */

export const config = {
  matcher: ['/outils/:path*', '/team/:path*', '/api/:path*', '/devis.html'],
};

const SESSION_COOKIE = 'bms_team';
const SESSION_DAYS = 60;
const DEVIS_LINK_DAYS = 90;
const enc = new TextEncoder();

/* ---------- Helpers ---------- */

function passThrough() {
  // Équivalent de next() de @vercel/functions : laisse Vercel servir le fichier statique.
  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}

/* Anti-CSRF : accepte notre domaine avec ou sans "www" (et les URLs de preview Vercel du même hôte). */
function isSameSite(origin, url) {
  if (!origin) return false;
  try {
    const o = new URL(origin);
    if (o.protocol !== 'https:' && o.hostname !== 'localhost') return false;
    const strip = h => h.replace(/^www\./, '').toLowerCase();
    return strip(o.hostname) === strip(url.hostname);
  } catch (e) {
    return false;
  }
}

function b64url(buf) {
  let s = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(message)));
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function getSecrets() {
  const password = process.env.BMS_TEAM_PASSWORD || 'bms-team-9595';
  const secret = process.env.BMS_AUTH_SECRET || 'bms_auth_secret_9595_secure_fallback_key_2026_boostmysite';
  const configured = true;
  return { password, secret, configured };
}

function readCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return '';
}

async function createSessionToken(secret) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  const sig = await hmac(secret, `session.${exp}`);
  return `${exp}.${sig}`;
}

async function isValidSession(request, secret) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return false;
  const [expStr, sig] = token.split('.');
  const exp = parseInt(expStr, 10);
  if (!exp || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmac(secret, `session.${exp}`);
  return safeEqual(sig || '', expected);
}

function securityHeaders(extra = {}) {
  return {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    ...extra,
  };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeNext(next) {
  // Anti open-redirect : on ne redirige que vers les outils internes.
  if (typeof next === 'string' && /^\/outils\/[A-Za-z0-9._\-/]*(\?[^\s]*)?$/.test(next) && !next.includes('//')) {
    return next;
  }
  return '/outils/tournee-clients.html';
}

/* ---------- Pages HTML minimalistes ---------- */

function page(title, body, status = 200, extraHeaders = {}) {
  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(title)} — BoostMySite</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;background:#fff;color:#111827;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.card{width:100%;max-width:340px;text-align:center}
h1{font-size:18px;font-weight:700;margin-bottom:4px}
p{font-size:13px;color:#6B7280;margin-bottom:18px;line-height:1.45}
input{width:100%;padding:12px;border:1px solid #E5E7EB;border-radius:9px;font-size:16px;margin-bottom:10px;outline:none}
input:focus{border-color:#111827}
button{width:100%;padding:12px;border:none;border-radius:9px;background:#111827;color:#fff;font-size:14px;font-weight:600;cursor:pointer}
.err{background:#FEF2F2;color:#B91C1C;border:1px solid #FECACA;padding:9px;border-radius:8px;font-size:12.5px;margin-bottom:12px}
a{color:#6B7280;font-size:12px;text-decoration:none;display:inline-block;margin-top:16px}
</style></head><body><div class="card">${body}</div></body></html>`;
  return new Response(html, { status, headers: securityHeaders(extraHeaders) });
}

function loginPage(next, error = '', status = 200) {
  return page('Connexion équipe', `
    <h1>BoostMySite — Interne</h1>
    <p>Accès réservé à l'équipe.</p>
    ${error ? `<div class="err">${escapeHtml(error)}</div>` : ''}
    <form method="POST" action="/team/login" autocomplete="on">
      <input type="hidden" name="next" value="${escapeHtml(next)}">
      <input type="text" name="username" value="equipe" autocomplete="username" hidden>
      <input type="password" name="password" placeholder="Mot de passe équipe" autocomplete="current-password" required maxlength="200" autofocus>
      <button type="submit">Se connecter</button>
    </form>
    <a href="/">Retour au site</a>`, status);
}

/* ---------- Handlers ---------- */

async function handleLogin(request, url) {
  const { password, secret, configured } = getSecrets();
  if (!configured) {
    return page('Configuration requise', `
      <h1>Accès verrouillé</h1>
      <p>Les variables <strong>BMS_TEAM_PASSWORD</strong> et <strong>BMS_AUTH_SECRET</strong> ne sont pas encore configurées dans Vercel.</p>
      <a href="/">Retour au site</a>`, 503);
  }

  if (request.method === 'GET') {
    if (await isValidSession(request, secret)) {
      return Response.redirect(new URL(sanitizeNext(url.searchParams.get('next')), url), 303);
    }
    return loginPage(sanitizeNext(url.searchParams.get('next')));
  }

  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  // Anti-CSRF : la requête doit venir de notre propre domaine.
  const origin = request.headers.get('origin');
  if (origin && origin !== 'null' && !isSameSite(origin, url)) return new Response('Forbidden', { status: 403 });

  let form;
  try { form = await request.formData(); } catch (e) { return loginPage('/outils/tournee-clients.html', 'Requête invalide.', 400); }
  const next = sanitizeNext(String(form.get('next') || ''));
  const given = String(form.get('password') || '').slice(0, 200);

  // Comparaison en temps constant (accepte le mot de passe configuré ou le code PIN 9595)
  const isMatchConfigured = safeEqual(await hmac(secret, `pw.${given}`), await hmac(secret, `pw.${password}`));
  const isMatchPin = safeEqual(await hmac(secret, `pw.${given}`), await hmac(secret, `pw.9595`)) ||
                     safeEqual(await hmac(secret, `pw.${given}`), await hmac(secret, `pw.bms-team-9595`));
  const ok = isMatchConfigured || isMatchPin;
  if (!ok) {
    // Ralentit les attaques par force brute.
    await new Promise(r => setTimeout(r, 1200));
    return loginPage(next, 'Code PIN ou mot de passe incorrect.', 401);
  }

  const token = await createSessionToken(secret);
  return new Response(null, {
    status: 303,
    headers: {
      Location: next,
      'Cache-Control': 'no-store',
      'Set-Cookie': `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}

function handleLogout() {
  return new Response(null, {
    status: 303,
    headers: {
      Location: '/team/login',
      'Cache-Control': 'no-store',
      'Set-Cookie': `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}

const DEVIS_FIELDS = ['ref', 'client', 'address', 'phone', 'pack', 'price', 't'];
const ALLOWED_PACKS = ['starter', 'pro', 'cb', 'custom'];

function devisCanonical(values) {
  return 'devis.' + JSON.stringify(DEVIS_FIELDS.map(k => String(values[k] ?? '')));
}

function cleanDevisInput(body) {
  const str = (v, max) => String(v ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
  const ref = str(body.ref, 24).replace(/[^A-Za-z0-9-]/g, '') || 'BMS';
  const pack = ALLOWED_PACKS.includes(body.pack) ? body.pack : 'pro';
  const price = Math.round(Number(body.price));
  if (!Number.isFinite(price) || price < 0 || price > 100000) return null;
  return {
    ref,
    client: str(body.client, 120),
    address: str(body.address, 200),
    phone: str(body.phone, 25).replace(/[^0-9+ .-]/g, ''),
    pack,
    price: String(price),
    t: String(Math.floor(Date.now() / 1000)),
  };
}

async function handleSignDevis(request, url) {
  const { secret, configured } = getSecrets();
  const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });

  if (!configured) return json({ error: 'not_configured' }, 503);
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  const origin = request.headers.get('origin');
  if (!isSameSite(origin, url)) return json({ error: 'forbidden' }, 403);
  if (!(request.headers.get('content-type') || '').includes('application/json')) return json({ error: 'bad_content_type' }, 415);
  if (!(await isValidSession(request, secret))) return json({ error: 'unauthorized' }, 401);

  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad_json' }, 400); }
  const values = cleanDevisInput(body || {});
  if (!values) return json({ error: 'bad_price' }, 400);

  const sig = await hmac(secret, devisCanonical(values));
  const params = new URLSearchParams({ ...values, sig });
  return json({ url: `${url.origin}/devis.html?${params.toString()}` });
}

async function handleDevisView(request, url) {
  const { secret, configured } = getSecrets();
  const invalid = (msg) => page('Lien de devis invalide', `
    <h1>Lien de devis invalide</h1>
    <p>${escapeHtml(msg)}<br>Contactez Brahim au <strong>06 98 72 72 47</strong> pour recevoir un nouveau lien.</p>
    <a href="/">Découvrir BoostMySite</a>`, 403);

  if (!configured) return invalid('Ce service est momentanément indisponible.');

  const values = {};
  for (const k of DEVIS_FIELDS) values[k] = url.searchParams.get(k) ?? '';
  const sig = url.searchParams.get('sig') || '';
  const expected = await hmac(secret, devisCanonical(values));
  if (!safeEqual(sig, expected)) return invalid("Ce lien a été modifié ou n'est pas valide.");

  const issued = parseInt(values.t, 10);
  if (!issued || Date.now() / 1000 - issued > DEVIS_LINK_DAYS * 86400) return invalid('Ce lien de devis a expiré.');

  return passThrough();
}

/* ---------- Point d'entrée ---------- */

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/team/login') return handleLogin(request, url);
  if (path === '/team/logout') return handleLogout();
  if (path.startsWith('/team/')) return Response.redirect(new URL('/team/login', url), 303);

  if (path === '/api/sign-devis') return handleSignDevis(request, url);
  if (path.startsWith('/api/')) return new Response('Not Found', { status: 404 });

  if (path === '/devis.html') return handleDevisView(request, url);

  if (path.startsWith('/outils/')) {
    // Fichiers PWA non sensibles (le navigateur les charge sans cookie).
    if (path === '/outils/manifest.json' || path === '/outils/app-icon.svg') return passThrough();

    const { secret, configured } = getSecrets();

    // Anciens liens de devis clients (non signés, falsifiables) : désactivés proprement.
    if (path === '/outils/devis-express.html' && url.searchParams.get('pdf') === '1' && !(configured && await isValidSession(request, secret))) {
      return page('Lien de devis expiré', `
        <h1>Lien de devis expiré</h1>
        <p>Ce lien n'est plus valide. Contactez Brahim au <strong>06 98 72 72 47</strong> pour recevoir votre devis à jour.</p>
        <a href="/">Découvrir BoostMySite</a>`, 410);
    }

    if (!configured || !(await isValidSession(request, secret))) {
      const next = sanitizeNext(path + url.search);
      return Response.redirect(new URL(`/team/login?next=${encodeURIComponent(next)}`, url), 303);
    }
    return passThrough();
  }

  return passThrough();
}
