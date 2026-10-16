// =====================================================================
//  PORTAIL DE L'ADMINISTRATION — IT Training Center
//  Ce petit programme tourne CHEZ NETLIFY (pas dans le navigateur).
//  Avant d'ouvrir /admin, il demande un « code d'accès ».
//  - Bon code  → un « badge » est enregistré dans le navigateur pour 12 heures,
//                puis la page de connexion GitHub s'affiche normalement.
//  - Mauvais code → l'accès est refusé.
//
//  Le code n'est écrit NULLE PART dans le site : il est rangé dans Netlify,
//  dans Project configuration → Environment variables → ADMIN_CODE.
//  Pour changer le code : modifier ADMIN_CODE dans Netlify, puis redéployer.
//  Pour sortir : aller sur  /admin/sortie
// =====================================================================

const NOM_BADGE = "itc_admin";
const DUREE_HEURES = 12;

export default async (requete, contexte) => {
  const url = new URL(requete.url);
  const code = (globalThis.Netlify && Netlify.env.get("ADMIN_CODE")) || "";

  // Sécurité : si le code n'a pas été configuré dans Netlify, on ferme tout.
  if (code.length < 8) {
    return page("Le portail n'est pas encore configuré. Ajoutez la variable ADMIN_CODE (8 caractères minimum) dans Netlify, puis redéployez le site.", 503);
  }

  // Sortie : on efface le badge
  if (url.pathname === "/admin/sortie") {
    return new Response(null, {
      status: 303,
      headers: { Location: "/", "Set-Cookie": `${NOM_BADGE}=; Path=/admin; Max-Age=0; HttpOnly; Secure; SameSite=Lax` },
    });
  }

  // Le visiteur envoie le code
  if (requete.method === "POST") {
    const donnees = await requete.formData().catch(() => null);
    const saisi = donnees ? String(donnees.get("code") || "") : "";
    if (await egal(saisi, code)) {
      const fin = Date.now() + DUREE_HEURES * 3600 * 1000;
      const badge = `${fin}.${await signature(String(fin), code)}`;
      return new Response(null, {
        status: 303,
        headers: {
          Location: "/admin/",
          "Set-Cookie": `${NOM_BADGE}=${badge}; Path=/admin; Max-Age=${DUREE_HEURES * 3600}; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }
    // mauvais code : petite attente pour décourager les essais en série
    await new Promise((r) => setTimeout(r, 1500));
    return page("Code incorrect. Réessayez.", 401);
  }

  // Le visiteur a déjà un badge valide → on laisse passer vers l'admin
  if (await badgeValide(requete.headers.get("cookie") || "", code)) {
    const reponse = await contexte.next();
    reponse.headers.set("Cache-Control", "no-store");
    return reponse;
  }

  // Sinon : on affiche le portail (formulaire du code d'accès)
  return page("", 200);
};

// Le portail protège toutes les adresses qui commencent par /admin
export const config = { path: ["/admin", "/admin/*"] };

// ---------- outils ----------

async function cle(code) {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(code), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

async function signature(texte, code) {
  const sig = await crypto.subtle.sign("HMAC", await cle(code), new TextEncoder().encode("itc-admin:" + texte));
  return [...new Uint8Array(sig)].map((o) => o.toString(16).padStart(2, "0")).join("");
}

// Comparaison sans laisser deviner le code (on compare des empreintes)
async function egal(a, b) {
  const [x, y] = await Promise.all([signature("c:" + a, b), signature("c:" + b, b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0 && x.length === y.length;
}

async function badgeValide(cookies, code) {
  const m = cookies.match(new RegExp("(?:^|;\\s*)" + NOM_BADGE + "=(\\d+)\\.([0-9a-f]{64})"));
  if (!m) return false;
  const fin = Number(m[1]);
  if (!(fin > Date.now())) return false;
  return (await signature(m[1], code)) === m[2];
}

function page(message, statut) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Espace administrateur — IT Training Center</title>
<style>
  :root { --nuit:#0c1b2e; --or:#d4a843; --orange:#e07b1c; }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:grid; place-items:center; padding:16px;
         font-family: "Segoe UI", system-ui, sans-serif; color:#fff;
         background: radial-gradient(600px 300px at 85% 0%, rgba(212,168,67,.14), transparent 70%), var(--nuit); }
  .boite { width:100%; max-width:380px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.12);
           border-radius:16px; padding:30px 26px; }
  .cadenas { width:44px; height:44px; border-radius:12px; display:grid; place-items:center;
             background:rgba(212,168,67,.14); color:var(--or); border:1px solid rgba(212,168,67,.35); margin-bottom:16px; }
  h1 { font-size:1.35rem; margin:0 0 6px; font-weight:600; }
  p { color:#a9bccd; margin:0 0 20px; font-size:.95rem; line-height:1.5; }
  label { display:block; font-size:.85rem; margin-bottom:6px; color:#dbe4ec; }
  input { width:100%; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,.2);
          background:#07111d; color:#fff; font-size:1rem; }
  input:focus { outline:2px solid var(--or); border-color:var(--or); }
  button { margin-top:16px; width:100%; padding:12px; border:0; border-radius:999px; background:var(--orange);
           color:#fff; font-weight:600; font-size:1rem; cursor:pointer; }
  button:hover { background:#c96a11; }
  .erreur { background:rgba(224,90,79,.15); border:1px solid rgba(224,90,79,.5); color:#ffc9c3;
            padding:10px 12px; border-radius:10px; font-size:.9rem; margin-bottom:16px; }
  a { color:#a9bccd; font-size:.85rem; display:inline-block; margin-top:18px; }
</style>
</head>
<body>
  <form class="boite" method="POST" action="/admin/">
    <div class="cadenas"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></div>
    <h1>Espace administrateur</h1>
    <p>Accès réservé à l'équipe d'IT Training Center. Entrez le code d'accès pour continuer.</p>
    ${message ? `<div class="erreur" role="alert">${message}</div>` : ""}
    <label for="code">Code d'accès</label>
    <input id="code" name="code" type="password" autocomplete="current-password" required autofocus>
    <button type="submit">Entrer</button>
    <a href="/">← Retour au site</a>
  </form>
</body>
</html>`;
  return new Response(html, {
    status: statut,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
