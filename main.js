// Menu mobile
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // Révélation douce au scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Formulaire de contact : ouvre la messagerie de l'utilisateur (site statique, sans serveur)
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = encodeURIComponent(form.name.value || '');
      var email = encodeURIComponent(form.email.value || '');
      var subject = encodeURIComponent(form.subject.value || 'Demande d\'information');
      var message = form.message.value || '';
      var body = encodeURIComponent('Nom : ' + decodeURIComponent(name) + '\nEmail : ' + decodeURIComponent(email) + '\n\n' + message);
      window.location.href = 'mailto:etsassa.itc@gmail.com?subject=' + subject + '&body=' + body;
    });
  }
});
