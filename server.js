// Serveur statique des landings Vivactis Lab.
// Zero dependance : uniquement les modules natifs de Node.
// Sert dist/ (produit par npm run build). Le port vient de la variable PORT.

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
};

function send(res, code, type, body) {
  res.writeHead(code, { 'Content-Type': type });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return send(res, 400, 'text/plain; charset=utf-8', 'Requete invalide');
  }

  const target = path.join(ROOT, pathname);

  // Garde-fou : on ne sert jamais un fichier hors de dist/.
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) {
    return send(res, 403, 'text/plain; charset=utf-8', 'Acces refuse');
  }

  fs.stat(target, (err, stat) => {
    if (!err && stat.isDirectory()) {
      // Sans slash final, les chemins relatifs des pages casseraient.
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { Location: pathname + '/' });
        return res.end();
      }
      return serveFile(path.join(target, 'index.html'), res);
    }
    serveFile(target, res);
  });
});

function serveFile(file, res) {
  fs.readFile(file, (err, buf) => {
    if (err) {
      return send(res, 404, 'text/html; charset=utf-8', '<!doctype html><meta charset="utf-8"><title>Page introuvable</title><p>Page introuvable.');
    }
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'public, max-age=300' });
    res.end(buf);
  });
}

server.listen(PORT, () => {
  console.log(`Landings Vivactis servies sur le port ${PORT}`);
});
