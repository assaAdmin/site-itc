// =====================================================================
//  NOS RÉALISATIONS — agrandir les captures d'écran
//  - Toucher une miniature : elle devient la grande image ET s'ouvre en grand.
//  - Dans la fenêtre : flèches ‹ › (ou clavier ← →), glisser du doigt sur téléphone,
//    Échap ou ✕ pour fermer.
//  La légende affichée est le texte « alt » de chaque image (traduit en anglais
//  automatiquement par js/langue.js quand le site est en EN).
// =====================================================================
document.addEventListener('DOMContentLoaded', function () {
  var fenetre = document.getElementById('visionneuse-real');
  if (!fenetre) return;
  var image = fenetre.querySelector('img');
  var legende = fenetre.querySelector('.vr-legende');
  var numero = fenetre.querySelector('.vr-numero');
  var photos = [];      // les photos de la galerie ouverte : [{ grand, texte }]
  var position = 0;
  var avant = null;     // pour remettre le focus au bon endroit en fermant

  function afficher(i) {
    position = (i + photos.length) % photos.length;
    image.src = photos[position].grand;
    image.alt = photos[position].texte;
    legende.textContent = photos[position].texte;
    numero.textContent = (position + 1) + ' / ' + photos.length;
  }
  function ouvrir(galerie, i) {
    photos = Array.prototype.map.call(galerie.querySelectorAll('.realisation-miniatures button'), function (b) {
      return { grand: b.getAttribute('data-grand'), texte: b.querySelector('img').alt };
    });
    avant = document.activeElement;
    afficher(i);
    fenetre.hidden = false;
    fenetre.querySelector('.vr-fermer').focus();
  }
  function fermer() { fenetre.hidden = true; image.removeAttribute('src'); if (avant) avant.focus(); }

  document.querySelectorAll('[data-galerie]').forEach(function (galerie) {
    var principale = galerie.querySelector('.realisation-principale');
    var grande = principale.querySelector('img');
    var miniatures = galerie.querySelectorAll('.realisation-miniatures button');
    if (miniatures[0]) miniatures[0].classList.add('actif');
    miniatures.forEach(function (b) {
      b.addEventListener('click', function () {
        var i = Number(b.getAttribute('data-index'));
        // la miniature devient la grande image de la carte
        miniatures.forEach(function (x) { x.classList.remove('actif'); });
        b.classList.add('actif');
        grande.src = b.getAttribute('data-grand');
        grande.alt = b.querySelector('img').alt;
        principale.setAttribute('data-index', i);
        ouvrir(galerie, i);
      });
    });
    principale.addEventListener('click', function () { ouvrir(galerie, Number(principale.getAttribute('data-index')) || 0); });
  });

  fenetre.querySelector('.vr-fermer').addEventListener('click', fermer);
  fenetre.querySelector('.vr-prec').addEventListener('click', function () { afficher(position - 1); });
  fenetre.querySelector('.vr-suiv').addEventListener('click', function () { afficher(position + 1); });
  // toucher le fond sombre (pas la photo) : on ferme
  fenetre.addEventListener('click', function (e) { if (e.target === fenetre) fermer(); });
  document.addEventListener('keydown', function (e) {
    if (fenetre.hidden) return;
    if (e.key === 'Escape') fermer();
    if (e.key === 'ArrowLeft') afficher(position - 1);
    if (e.key === 'ArrowRight') afficher(position + 1);
  });
  // téléphone : glisser à gauche ou à droite
  var departX = null;
  fenetre.addEventListener('touchstart', function (e) { departX = e.touches[0].clientX; }, { passive: true });
  fenetre.addEventListener('touchend', function (e) {
    if (departX === null) return;
    var ecart = e.changedTouches[0].clientX - departX;
    if (Math.abs(ecart) > 50) afficher(position + (ecart < 0 ? 1 : -1));
    departX = null;
  });
});
