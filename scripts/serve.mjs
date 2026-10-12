#!/usr/bin/env node
// Tiny local preview server for dist/ with clean URLs (/about -> about.html), like Vercel/GitHub Pages.
//   node build.mjs && node scripts/serve.mjs   ->  http://localhost:8080
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 8080);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain' };

export function resolve(urlPath) {
  const p = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const safe = path.normalize(p).replace(/^(\.\.[/\\])+/, '');
  const candidates = [safe, safe + '.html', path.join(safe, 'index.html')];
  for (const c of candidates) {
    const f = path.join(dist, c);
    if (f.startsWith(dist) && fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  }
  return null;
}

if (import.meta.url === 'file://' + process.argv[1]) {
  http.createServer((req, res) => {
    const f = resolve(req.url === '/' ? '/index.html' : req.url);
    if (!f) { res.writeHead(404, { 'content-type': types['.html'] }); return fs.createReadStream(path.join(dist, '404.html')).pipe(res); }
    res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  }).listen(port, () => console.log('Preview: http://localhost:' + port));
}
