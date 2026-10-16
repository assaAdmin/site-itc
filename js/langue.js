// =====================================================================
//  CHOIX DE LA LANGUE (FR / EN) — IT Training Center
//  Le site est écrit en français. Quand le visiteur choisit « EN »,
//  ce script remplace chaque texte français par sa traduction anglaise,
//  trouvée dans js/traduction-en.js (le « dictionnaire »).
//  Le site s'ouvre toujours en FRANÇAIS. Si le visiteur choisit EN, les autres
//  pages restent en anglais jusqu'à la fermeture du navigateur.
//
//  Si vous ajoutez ou changez un texte en français dans une page,
//  ajoutez aussi sa traduction dans js/traduction-en.js
//  (sinon ce texte restera en français sur la version anglaise).
// =====================================================================
(function () {
  var CLE = 'itc-langue';
  var DICO = window.TRADUCTION_EN || {};

  // Langue choisie : le FRANÇAIS par défaut.
  // L'anglais n'est utilisé que si le visiteur a cliqué sur « EN » pendant
  // sa visite (mémorisé jusqu'à la fermeture du navigateur), ou si l'adresse
  // contient ?lang=en. À chaque nouvelle visite, le site s'ouvre en français.
  try { localStorage.removeItem(CLE); } catch (e) {} // ancien réglage, supprimé
  function langueChoisie() {
    var m = location.search.match(/[?&]lang=(fr|en)/);
    if (m) { memoriser(m[1]); return m[1]; }
    try { return sessionStorage.getItem(CLE) || 'fr'; } catch (e) { return 'fr'; }
  }
  function memoriser(l) { try { sessionStorage.setItem(CLE, l); } catch (e) {} }

  // Texte « nettoyé » : espaces multiples réduits à un seul
  function net(t) { return String(t).replace(/\s+/g, ' ').trim(); }

  var IGNORER = { SCRIPT: 1, STYLE: 1, SVG: 1, CODE: 1, NOSCRIPT: 1, IFRAME: 1, VIDEO: 1 };
  var EN_LIGNE = { STRONG: 1, EM: 1, B: 1, I: 1, A: 1, SPAN: 1, BR: 1, SMALL: 1 };

  // Un élément « mixte » mélange du texte et des balises de mise en forme
  // (ex. « Et des <strong>logiciels</strong> … ») : on le traduit en bloc.
  function estMixte(el) {
    var texte = false, balise = false;
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && n.nodeValue.trim()) texte = true;
      else if (n.nodeType === 1) {
        if (EN_LIGNE[n.tagName]) balise = true; else return false;
      }
    }
    return texte && balise;
  }

  // Parcourt une partie de la page et appelle les fonctions pour chaque texte
  function parcourir(racine, surBloc, surTexte, surAttribut) {
    if (racine.nodeType === 3) { surTexte(racine); return; }
    if (racine.nodeType !== 1) return;
    var el = racine;
    if (IGNORER[el.tagName.toUpperCase()] || el.getAttribute('translate') === 'no' || el.classList.contains('terminal')) return;
    ['placeholder', 'alt', 'aria-label', 'title'].forEach(function (a) {
      if (el.hasAttribute(a)) surAttribut(el, a);
    });
    if (estMixte(el) && surBloc(el)) return; // traduit en bloc
    for (var n = el.firstChild; n; n = n.nextSibling) parcourir(n, surBloc, surTexte, surAttribut);
  }

  // --- Traduction d'une partie de la page ---
  function traduire(racine) {
    parcourir(racine,
      function (el) {
        var t = DICO[net(el.innerHTML)];
        if (t) { el.innerHTML = t; return true; }
        return false;
      },
      function (noeud) {
        var brut = noeud.nodeValue, cle = net(brut);
        if (!cle || !DICO[cle]) return;
        var avant = brut.match(/^\s*/)[0], apres = brut.match(/\s*$/)[0];
        noeud.nodeValue = avant + DICO[cle] + apres;
      },
      function (el, a) {
        var t = DICO[net(el.getAttribute(a))];
        if (t) el.setAttribute(a, t);
      });
  }

  // --- Mode « extraction » (utilisé seulement pour préparer le dictionnaire) ---
  window.ITC_EXTRAIRE = function () {
    var cles = [];
    function ajoute(k) { k = net(k); if (k && /[A-Za-zÀ-ÿ]/.test(k) && cles.indexOf(k) < 0) cles.push(k); }
    ajoute(document.title);
    var meta = document.querySelector('meta[name="description"]');
    if (meta) ajoute(meta.content);
    parcourir(document.body,
      function (el) { ajoute(el.innerHTML); return true; },
      function (n) { ajoute(n.nodeValue); },
      function (el, a) { ajoute(el.getAttribute(a)); });
    return cles;
  };

  // --- Bouton FR | EN dans l'en-tête ---
  function bouton(langue) {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var boite = document.createElement('div');
    boite.className = 'langue-choix';
    boite.setAttribute('translate', 'no');
    boite.setAttribute('role', 'group');
    boite.setAttribute('aria-label', langue === 'en' ? 'Language' : 'Langue');
    ['fr', 'en'].forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = l.toUpperCase();
      b.setAttribute('aria-pressed', l === langue ? 'true' : 'false');
      b.addEventListener('click', function () {
        if (l === langue) return;
        memoriser(l);
        // On recharge la page dans la nouvelle langue.
        // (Le « ?lang=… » oblige le navigateur à recharger : sur un site d'une
        //  seule page, changer seulement le « #partie » ne recharge rien.)
        location.replace(location.pathname + '?lang=' + l + location.hash);
      });
      boite.appendChild(b);
    });
    var menu = nav.querySelector('.nav-toggle');
    nav.insertBefore(boite, menu);
  }

  var langue = langueChoisie();
  document.documentElement.lang = langue;

  document.addEventListener('DOMContentLoaded', function () {
    bouton(langue);
    if (langue !== 'en' || window.ITC_MODE_EXTRACTION) return;

    // Titre de l'onglet et description pour Google
    if (DICO[net(document.title)]) document.title = DICO[net(document.title)];
    var meta = document.querySelector('meta[name="description"]');
    if (meta && DICO[net(meta.content)]) meta.content = DICO[net(meta.content)];

    traduire(document.body);

    // Les textes ajoutés plus tard (chiffres, galerie…) sont traduits aussi
    if ('MutationObserver' in window) {
      new MutationObserver(function (changements) {
        changements.forEach(function (c) {
          c.addedNodes.forEach(function (n) { traduire(n); });
        });
      }).observe(document.body, { childList: true, subtree: true });
    }
  });
})();
