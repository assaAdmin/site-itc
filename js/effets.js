// Effets visuels de la page d'accueil (site sur une seule page)

// ---------- 0) Toujours commencer en haut de la page ----------
// Le navigateur ne doit pas « se souvenir » de l'endroit où l'on était
// (sinon, en rechargeant, on arrive au milieu du site, sur Services par exemple).
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

document.addEventListener('DOMContentLoaded', function () {

  // Partie demandée dans l'adresse (ex. un ancien lien …/formations → #formations) :
  // on y va une fois, puis on retire le « #… » de l'adresse pour qu'un
  // rechargement ramène bien en haut, sur l'accueil.
  var demande = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  if (demande && location.hash !== '#accueil') {
    // on attend que la page soit complète (images, chiffres) pour viser juste
    var viser = function () { demande.scrollIntoView(); };
    window.addEventListener('load', function () { viser(); setTimeout(viser, 700); });
  } else {
    window.scrollTo(0, 0);
  }
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);

  // Clic sur un lien du menu (#formations, #services…) : défilement doux
  // jusqu'à la partie, sans ajouter « #… » dans l'adresse.
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var cible = id === 'accueil' ? null : document.getElementById(id);
      if (id !== 'accueil' && !cible) return;
      e.preventDefault();
      if (cible) cible.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ---------- 1) Le menu suit la partie affichée à l'écran ----------
  // Quand on fait défiler la page, le lien du menu correspondant (Formations,
  // Services…) est souligné automatiquement.
  var liens = document.querySelectorAll('.nav-links a[href^="#"]');
  var parties = [];
  liens.forEach(function (a) {
    var cible = document.getElementById(a.getAttribute('href').slice(1));
    if (cible) parties.push({ lien: a, cible: cible });
  });
  function partieActive() {
    var repere = window.innerHeight * 0.35; // un tiers de l'écran, sous l'en-tête
    var active = parties[0];
    parties.forEach(function (p) {
      if (p.cible.getBoundingClientRect().top - repere <= 0) active = p;
    });
    // tout en bas de la page : dernière partie (Contact)
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = parties[parties.length - 1];
    parties.forEach(function (p) {
      if (p === active) p.lien.setAttribute('aria-current', 'page');
      else p.lien.removeAttribute('aria-current');
    });
  }
  if (parties.length) {
    window.addEventListener('scroll', partieActive, { passive: true });
    window.addEventListener('resize', partieActive);
    partieActive();
  }

  // ---------- 2) La devise s'allume mot par mot ----------
  var devise = document.querySelector('.devise');
  if (!devise) return;
  var mots = devise.querySelectorAll('span');
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    mots.forEach(function (m) { m.classList.add('allume'); });
    return;
  }
  function miseAJour() {
    var zone = devise.getBoundingClientRect();
    var hauteur = window.innerHeight;
    // 0 quand la devise entre par le bas de l'écran, 1 quand elle arrive au tiers haut
    var avance = (hauteur - zone.top) / (hauteur * 0.6);
    var nb = Math.floor(Math.max(0, Math.min(1, avance)) * mots.length + 0.0001);
    mots.forEach(function (m, i) { m.classList.toggle('allume', i < nb); });
  }
  window.addEventListener('scroll', miseAJour, { passive: true });
  window.addEventListener('resize', miseAJour);
  miseAJour();
});
