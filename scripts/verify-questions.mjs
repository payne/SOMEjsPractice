// Checks question sets: every model solution must pass all of its checks, and
// the starter code must fail at least one. Runs in headless Chromium.
//
//   npm run verify                       # every set in public/question-sets.json
//   npm run verify -- sets/ch03.json     # only these files (relative to public/)
//
// Needs `chromium` (or set CHROME=/path/to/chrome).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pub = path.join(root, 'public');
const args = process.argv.slice(2);
const files = args.length
  ? args
  : JSON.parse(fs.readFileSync(path.join(pub, 'question-sets.json'), 'utf8')).sets.map((s) => s.url);

// Load the real harness through Vite so ?raw / ?inline imports work.
const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' });
const { buildDocument, prepareQuestion } = await vite.ssrLoadModule('/src/harness.js');

const jobs = [];
const problems = [];
for (const file of files) {
  const bank = JSON.parse(fs.readFileSync(path.join(pub, file), 'utf8'));
  const ids = new Set();
  bank.questions.forEach((q, i) => {
    const where = `${file} #${i + 1} ${q.id}`;
    if (ids.has(q.id)) problems.push(`${where}: duplicate id`);
    ids.add(q.id);
    for (const field of ['title', 'prompt', 'solution']) if (!q[field]) problems.push(`${where}: missing ${field}`);
    if (!q.chapters?.length) problems.push(`${where}: no chapters`);
    if (!q.tests?.length) problems.push(`${where}: no tests`);
  });
  for (const q of bank.questions) {
    await prepareQuestion(q);
    jobs.push({ id: `${file} ${q.id}`, kind: 'solution', doc: buildDocument(q, q.solution, 'check') });
    jobs.push({ id: `${file} ${q.id}`, kind: 'starter', doc: buildDocument(q, q.starterCode || '', 'check') });
  }
}
await vite.close();

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-'));
fs.writeFileSync(path.join(tmp, 'jobs.json'), JSON.stringify(jobs));
fs.writeFileSync(path.join(tmp, 'index.html'), `<!doctype html><body><script>
window.results = []; window.done = false;
fetch('jobs.json').then(r => r.json()).then(async (jobs) => {
  for (const job of jobs) {
    const result = await new Promise((resolve) => {
      const frame = document.createElement('iframe');
      frame.setAttribute('sandbox', 'allow-scripts');
      frame.width = 800; frame.height = 500;
      const errors = [];
      const timer = setTimeout(() => finish(null), 20000);
      function finish(results) {
        clearTimeout(timer); removeEventListener('message', onMessage); frame.remove();
        resolve({ id: job.id, kind: job.kind, results, errors });
      }
      function onMessage(e) {
        if (e.source !== frame.contentWindow) return;
        if (e.data.type === 'console' && e.data.level === 'error') errors.push(e.data.text);
        if (e.data.type === 'results') finish(e.data.results);
      }
      addEventListener('message', onMessage);
      frame.srcdoc = job.doc;
      document.body.prepend(frame);
    });
    window.results.push(result);
  }
  window.done = true;
});
</script></body>`);

// Serve the runner page over HTTP (file:// can't fetch jobs.json).
const http = await import('node:http');
const server = http.createServer((req, res) => {
  const f = path.join(tmp, req.url === '/' ? 'index.html' : req.url.slice(1));
  fs.readFile(f, (err, data) => { res.writeHead(err ? 404 : 200); res.end(data); });
}).listen(0);
const port = server.address().port;

const debugPort = 9800 + Math.floor(Math.random() * 100);
const chrome = spawn(process.env.CHROME || 'chromium', ['--headless', '--no-sandbox', '--disable-gpu',
  `--remote-debugging-port=${debugPort}`, `--user-data-dir=${path.join(tmp, 'profile')}`, '--window-size=1000,800',
  `http://127.0.0.1:${port}/`], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 100 && !ws; i++) {
  try {
    const page = (await (await fetch(`http://127.0.0.1:${debugPort}/json`)).json()).find((t) => t.type === 'page');
    if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
  } catch { /* not up yet */ }
  await sleep(200);
}
if (ws.readyState !== 1) await new Promise((r) => ws.addEventListener('open', r));
let nextId = 0;
const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); pending.get(d.id)?.(d); pending.delete(d.id); });
const evaluate = (expression) => new Promise((resolve) => {
  const id = ++nextId;
  pending.set(id, (d) => resolve(d.result?.result?.value));
  ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, returnByValue: true } }));
});

let shown = 0;
let failed = 0;
for (;;) {
  await sleep(1000);
  const state = await evaluate('({ done: window.done, results: window.results })');
  if (!state) continue;
  for (const r of state.results.slice(shown)) {
    const passes = r.results ? r.results.filter((t) => t.pass).length : 0;
    const total = r.results ? r.results.length : 0;
    let bad = false;
    if (!r.results) bad = 'no results (timed out)';
    else if (r.kind === 'solution' && passes !== total) bad = `${passes}/${total} checks passed`;
    else if (r.kind === 'starter' && passes === total) bad = 'starter code passes every check';
    if (bad) {
      failed++;
      console.log(`FAIL ${r.id} [${r.kind}]: ${bad}`);
      (r.results || []).filter((t) => r.kind === 'solution' && !t.pass)
        .forEach((t) => console.log(`       ✗ ${t.name}${t.error ? ` (${t.error})` : ''}`));
      r.errors.forEach((e) => console.log(`       error: ${e}`));
    }
  }
  shown = state.results.length;
  if (state.done) break;
}
ws.close();
chrome.kill();
server.close();
problems.forEach((p) => console.log(`PROBLEM ${p}`));
const count = jobs.length / 2;
console.log(`\n${count} questions in ${files.length} file(s): ${failed + problems.length === 0 ? 'all OK' : `${failed} failing run(s), ${problems.length} problem(s)`}`);
process.exit(failed + problems.length ? 1 : 0);
