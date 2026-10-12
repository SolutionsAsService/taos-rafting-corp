#!/usr/bin/env node
// Checks every internal link, image and asset reference in dist/ resolves to a file.
//   node build.mjs && node scripts/check-links.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolve } from './serve.mjs';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(dist);

let bad = 0, checked = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const refs = [...html.matchAll(/\s(?:href|src|data-full)="([^"]+)"/g)].map((m) => m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) m[1].split(',').forEach((s) => refs.push(s.trim().split(/\s+/)[0]));
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
    checked++;
    if (ref.startsWith('#')) { if (ref.length > 1 && !ids.has(ref.slice(1))) { bad++; console.log('✗', path.relative(dist, file), '->', ref, '(missing id)'); } continue; }
    const target = ref.startsWith('/') ? ref : '/' + path.relative(dist, path.join(path.dirname(file), ref));
    if (!resolve(target === '/' ? '/index.html' : target)) { bad++; console.log('✗', path.relative(dist, file), '->', ref); }
  }
}
console.log(checked + ' internal references checked across ' + files.length + ' pages; ' + bad + ' broken.');
process.exit(bad ? 1 : 0);
