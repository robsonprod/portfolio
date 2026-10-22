// Roda antes do Angular (script síncrono no <head>) para aplicar o tema sem "flash".
// Arquivo externo de propósito: a CSP (script-src 'self') bloqueia scripts inline.
(function () {
  var root = document.documentElement;
  var theme;
  try {
    theme = localStorage.getItem('theme');
  } catch (e) {}
  if (theme !== 'dark' && theme !== 'light') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', theme);
  root.classList.add('js'); // habilita animações de entrada só quando há JS
})();
