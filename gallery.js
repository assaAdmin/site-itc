// Galerie photos/vidéos — lit data/gallery.json (modifiable via /admin) et l'affiche
document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('gallery-grid');
  var empty = document.getElementById('gallery-empty');
  if (!grid) return;

  fetch('data/gallery.json', { cache: 'no-store' })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var items = (data && data.items) ? data.items.slice() : [];
      // Plus récent en premier
      items.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });

      if (!items.length) {
        if (empty) empty.style.display = 'block';
        return;
      }

      items.forEach(function (item) {
        var card = document.createElement('div');
        card.className = 'card gallery-card reveal is-visible';

        var media = document.createElement('div');
        media.className = 'gallery-media';

        if (item.type === 'video' && item.video_url) {
          var embedUrl = toEmbedUrl(item.video_url);
          if (embedUrl) {
            var iframe = document.createElement('iframe');
            iframe.src = embedUrl;
            iframe.loading = 'lazy';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            media.appendChild(iframe);
          } else {
            var link = document.createElement('a');
            link.href = item.video_url;
            link.target = '_blank';
            link.rel = 'noopener';
            link.className = 'btn btn-outline';
            link.textContent = 'Voir la vidéo';
            media.appendChild(link);
          }
        } else if (item.file) {
          var img = document.createElement('img');
          img.src = item.file;
          img.alt = item.title || 'Photo IT Training Center';
          img.loading = 'lazy';
          media.appendChild(img);
        }

        card.appendChild(media);

        var h3 = document.createElement('h3');
        h3.textContent = item.title || '';
        card.appendChild(h3);

        if (item.description) {
          var p = document.createElement('p');
          p.textContent = item.description;
          card.appendChild(p);
        }

        grid.appendChild(card);
      });
    })
    .catch(function () {
      if (empty) {
        empty.style.display = 'block';
        empty.textContent = "La galerie n'a pas pu être chargée pour le moment.";
      }
    });

  function toEmbedUrl(url) {
    var yt = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([\w-]{6,})/);
    if (yt) return 'https://www.youtube.com/embed/' + yt[1];
    var fb = url.match(/facebook\.com|fb\.watch/);
    if (fb) return 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url);
    return null;
  }
});
