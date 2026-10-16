// Effets visuels de la page d'accueil
// La devise « Comprendre. Pratiquer. Expérimenter. Maîtriser. » s'allume mot par mot
// à mesure que l'on fait défiler la page.
document.addEventListener('DOMContentLoaded', function () {
  var devise = document.querySelector('.devise');
  if (!devise) return;
  var mots = devise.querySelectorAll('span');

  // Si la personne a demandé moins d'animations : tout est allumé directement
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
