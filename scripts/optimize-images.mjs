#!/usr/bin/env node
/**
 * Optimise photos for the web.
 *   photos/<name>.jpg  ->  src/assets/img/<name>-{480,800,1200,1800}.webp  (+ <name>-1200.jpg for social previews)
 * and records each photo's size in src/assets/img/images.json (used by build.mjs).
 *
 * Only needed when you ADD or CHANGE a photo. Requires the "sharp" package:
 *   npm install --no-save sharp && node scripts/optimize-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'photos');
const outDir = path.join(root, 'src/assets/img');
const WIDTHS = [480, 800, 1200, 1800];

let sharp;
try { sharp = (await import('sharp')).default; } catch {
  console.error('sharp is not installed. Run: npm install --no-save sharp');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
const manifestPath = path.join(outDir, 'images.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
const files = fs.readdirSync(srcDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

for (const file of files) {
  const name = file.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  const input = path.join(srcDir, file);
  const meta = await sharp(input).rotate().metadata();
  const ratio = meta.height / meta.width;
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (!widths.length) widths.push(meta.width);
  for (const w of widths) {
    await sharp(input).rotate().resize({ width: w }).webp({ quality: w > 1000 ? 70 : 74, effort: 5 }).toFile(path.join(outDir, name + '-' + w + '.webp'));
  }
  const ogW = Math.min(1200, meta.width);
  await sharp(input).rotate().resize({ width: ogW }).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(outDir, name + '-' + ogW + '.jpg'));
  manifest[name] = { width: meta.width, height: Math.round(meta.width * ratio), widths, jpg: ogW };
  console.log('✓', name, widths.join(','));
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('Wrote', path.relative(root, manifestPath));
