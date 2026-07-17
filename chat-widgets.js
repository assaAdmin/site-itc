// Bouton WhatsApp flottant + chat en direct (Tawk.to)
document.addEventListener('DOMContentLoaded', function () {

  // ---- 1) Bouton WhatsApp flottant ----
  var phone = '243994201684'; // +243 994 201 684, format international sans "+"
  var message = encodeURIComponent("Bonjour, je souhaite des informations sur vos formations.");
  var wa = document.createElement('a');
  wa.href = 'https://wa.me/' + phone + '?text=' + message;
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.className = 'whatsapp-float';
  wa.setAttribute('aria-label', 'Discuter sur WhatsApp');
  wa.innerHTML = '<svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden="true">' +
    '<path d="M16.02 3C9.4 3 4 8.38 4 15c0 2.34.65 4.53 1.78 6.4L4 29l7.8-1.74A11.9 11.9 0 0 0 16.02 27C22.65 27 28 21.62 28 15S22.65 3 16.02 3Zm0 21.7c-1.98 0-3.83-.55-5.4-1.5l-.39-.23-4.63 1.03 1.02-4.5-.25-.4A9.6 9.6 0 0 1 6.3 15c0-5.35 4.36-9.7 9.72-9.7 5.36 0 9.72 4.35 9.72 9.7 0 5.35-4.36 9.7-9.72 9.7Zm5.32-7.27c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.15-.2.29-.75.94-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.44-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.58-.9-2.16-.24-.57-.48-.5-.66-.5-.17 0-.37-.02-.56-.02-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.2 3.02.15.2 2.06 3.14 5 4.4.7.3 1.24.48 1.67.62.7.22 1.33.19 1.83.11.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.2-.55-.34Z"/>' +
    '</svg>';
  document.body.appendChild(wa);

  // ---- 2) Chat en direct (Tawk.to) ----
  // À faire une seule fois : créez un compte gratuit sur tawk.to, puis remplacez
  // PROPERTY_ID et WIDGET_ID ci-dessous par les identifiants fournis dans votre
  // tableau de bord Tawk.to (Administration > Channels > Chat Widget).
  var TAWK_PROPERTY_ID = '6a59d825ce67b81d468d306e';
  var TAWK_WIDGET_ID = '1jtnf8lf0';

  if (TAWK_PROPERTY_ID !== 'PROPERTY_ID' && TAWK_WIDGET_ID !== 'WIDGET_ID') {
    var Tawk_API = window.Tawk_API || {};
    window.Tawk_API = Tawk_API;
    window.Tawk_LoadStart = new Date();
    var s1 = document.createElement('script');
    var s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/' + TAWK_PROPERTY_ID + '/' + TAWK_WIDGET_ID;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
  }
});
