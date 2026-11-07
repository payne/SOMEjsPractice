// Renders public/icons/icon.svg to PNG icons with headless Chromium.
// Usage: npm run icons   (needs `chromium` on PATH)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dir = path.resolve('public/icons');
const svg = fs.readFileSync(path.join(dir, 'icon.svg'), 'utf8');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'icons-'));

function render(name, size, padded) {
  const pad = padded ? Math.round(size * 0.1) : 0;
  const html = `<html><body style="margin:0;background:#1f2a44">
    <div style="width:${size}px;height:${size}px;padding:${pad}px;box-sizing:border-box">
    ${svg.replace('<svg ', `<svg width="${size - pad * 2}" height="${size - pad * 2}" `)}</div></body></html>`;
  const file = path.join(tmp, `${name}.html`);
  fs.writeFileSync(file, html);
  execFileSync('chromium', ['--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    `--window-size=${size},${size}`, `--screenshot=${path.join(dir, name)}.png`, `file://${file}`],
    { stdio: 'ignore' });
}

render('icon-192', 192, false);
render('icon-512', 512, false);
render('maskable-512', 512, true);
console.log('Icons written to', dir);
