// CloudFront Function (viewer-request). Roda na borda em < 1 ms.
// /             -> /index.html  (já coberto pelo default_root_object)
// /projetos     -> /projetos/index.html
// /projetos/    -> /projetos/index.html
// /main-AB12.js -> sem alteração (tem extensão)
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (!uri.split('/').pop().includes('.')) {
    request.uri = uri + '/index.html';
  }
  return request;
}
