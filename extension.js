(() => {
 let href = (window.location.href || '').toLowerCase();
 if (
  href.indexOf('google.com/forms') > -1 ||
  href.indexOf('forms.office.com/pages') > -1 ||
  href.indexOf('responsepage') > -1 ||
  href.indexOf('#dev') > -1
 ) {
  var script = document.createElement("script");
  script.src = href.indexOf('#dev') > -1 ? 'http://127.0.0.1/dist/forms.js' : 'https://forms-extension.tk/dist/forms.js';
  document.head.appendChild(script);
 } else alert('Chyba klikasz ten przycisk będąc na złej stronie :P');
})();
