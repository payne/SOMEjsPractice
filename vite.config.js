import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Builds dist/sw.js from sw-template.js, filling in every built file so the
// whole app (including every question set in public/) is cached for offline use.
function serviceWorkerPlugin() {
  return {
    name: 'generate-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      const publicDir = new URL('./public/', import.meta.url);
      const publicFiles = fs.readdirSync(publicDir, { recursive: true })
        .map((f) => f.split(path.sep).join('/'))
        .filter((f) => fs.statSync(new URL(f, publicDir)).isFile());
      const files = ['./', 'index.html', ...publicFiles, ...Object.keys(bundle)];
      const version = crypto.createHash('sha1').update(files.join('|') + Date.now()).digest('hex').slice(0, 10);
      const template = fs.readFileSync(new URL('./sw-template.js', import.meta.url), 'utf8');
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: template
          .replace('__PRECACHE_FILES__', JSON.stringify(files, null, 2))
          .replace('__CACHE_VERSION__', version),
      });
    },
  };
}

export default defineConfig({
  base: './', // relative paths so the app works from any folder (e.g. GitHub Pages)
  plugins: [react(), serviceWorkerPlugin()],
});
