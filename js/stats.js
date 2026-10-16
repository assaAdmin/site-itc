// Chiffres clés et parcours — lit data/stats.json et data/parcours.json
// (modifiables depuis /admin, rubriques « Chiffres clés » et « Notre parcours »).
// Un chiffre laissé vide dans l'admin n'est pas affiché.
document.addEventListener('DOMContentLoaded', function () {

  // ---------- 1) CHIFFRES CLÉS ----------
  var zone = document.getElementById('stats-grid');
  if (zone) {
    fetch('data/stats.json', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var items = (data.items || []).filter(function (it) { return String(it.valeur || '').trim() !== ''; });
        if (!items.length) return; // rien à montrer : la section reste cachée
        var section = document.getElementById('stats');
        var titre = document.getElementById('stats-titre');
        if (titre && data.titre) titre.textContent = data.titre;
        var maj = document.getElementById('stats-maj');
        if (maj && data.mise_a_jour) maj.textContent = 'Chiffres mis à jour le ' + dateFr(data.mise_a_jour);

        items.forEach(function (it) {
          var bloc = document.createElement('div');
          bloc.className = 'stat';
          var nombre = document.createElement('p');
          nombre.className = 'stat-nombre';
          nombre.dataset.cible = String(it.valeur).trim();
          nombre.dataset.suffixe = it.suffixe || '';
          nombre.textContent = String(it.valeur).trim() + (it.suffixe || '');
          var libelle = document.createElement('p');
          libelle.className = 'stat-libelle';
          libelle.textContent = it.libelle || '';
          bloc.appendChild(nombre);
          bloc.appendChild(libelle);
          zone.appendChild(bloc);
        });
        section.hidden = false;
        animerQuandVisible(zone);
      })
      .catch(function () { /* en cas d'erreur, la section reste simplement cachée */ });
  }

  // ---------- 2) NOTRE PARCOURS (frise des étapes) ----------
  var frise = document.getElementById('parcours-liste');
  if (frise) {
    fetch('data/parcours.json', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var items = (data.items || []).slice();
        if (!items.length) return;
        // Du plus ancien au plus récent
        items.sort(function (a, b) { return String(a.annee || '').localeCompare(String(b.annee || '')); });
        items.forEach(function (it) {
          var li = document.createElement('li');
          var an = document.createElement('span');
          an.className = 'parcours-annee';
          an.textContent = it.annee || '';
          var h = document.createElement('h3');
          h.textContent = it.titre || '';
          li.appendChild(an);
          li.appendChild(h);
          if (it.texte) {
            var p = document.createElement('p');
            p.textContent = it.texte;
            li.appendChild(p);
          }
          frise.appendChild(li);
        });
        document.getElementById('parcours').hidden = false;
      })
      .catch(function () {});
  }

  // Les nombres « montent » de 0 jusqu'à leur valeur quand on arrive sur la section
  function animerQuandVisible(conteneur) {
    var nombres = conteneur.querySelectorAll('.stat-nombre');
    function lancer() {
      nombres.forEach(function (el) {
        var cible = parseInt(el.dataset.cible.replace(/\s/g, ''), 10);
        if (isNaN(cible)) return; // valeur non numérique (ex. « 2019 ») : affichée telle quelle
        var debut = null, duree = 1200;
        function pas(t) {
          if (!debut) debut = t;
          var avance = Math.min((t - debut) / duree, 1);
          el.textContent = Math.round(cible * avance).toLocaleString('fr-FR') + el.dataset.suffixe;
          if (avance < 1) requestAnimationFrame(pas);
        }
        requestAnimationFrame(pas);
      });
    }
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entrees) {
      if (entrees[0].isIntersecting) { io.disconnect(); lancer(); }
    }, { threshold: 0.3 });
    io.observe(conteneur);
  }

  function dateFr(iso) {
    var mois = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    var m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? (parseInt(m[3], 10) + ' ' + mois[parseInt(m[2], 10) - 1] + ' ' + m[1]) : iso;
  }
});
