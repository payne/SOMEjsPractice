// Builds the HTML document that runs inside the sandboxed <iframe>.
// It renders the question's setup HTML/CSS, runs the student's code, then
// (in "check" mode) runs each test and posts the results to the parent page.
import jquerySource from 'jquery/dist/jquery.min.js?raw';

// Makes text safe to place inside an inline <script>.
const scriptSafe = (s) => s.replace(/<\/(script)/gi, '<\\/$1');
const jsonSafe = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const BOOTSTRAP = `
(function () {
  const post = (msg) => parent.postMessage(Object.assign({ __jsPractice: true }, msg), '*');
  const fmt = (a) => {
    if (typeof a === 'string') return a;
    if (a instanceof Element) return '<' + a.tagName.toLowerCase() + (a.id ? '#' + a.id : '') + '>';
    try { return JSON.stringify(a); } catch (e) { return String(a); }
  };
  const logs = [];
  ['log', 'info', 'warn', 'error'].forEach((level) => {
    const original = console[level];
    console[level] = (...args) => {
      const text = args.map(fmt).join(' ');
      logs.push(text);
      post({ type: 'console', level, text });
      original.apply(console, args);
    };
  });
  window.alert = (m) => console.log('[alert] ' + m);
  window.confirm = (m) => { console.log('[confirm] ' + m); return true; };
  window.prompt = (m) => { console.log('[prompt] ' + m); return ''; };
  window.addEventListener('error', (e) => {
    const message = (e.message || 'Error').replace("Failed to execute 'appendChild' on 'Node': ", '');
    post({ type: 'console', level: 'error', text: message + (e.lineno ? ' (line ' + e.lineno + ')' : '') });
  });

  // The sandbox has no real storage, so give the code an in-memory stand-in.
  const makeStorage = () => {
    const data = {};
    return {
      getItem: (k) => (Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null),
      setItem: (k, v) => { data[k] = String(v); },
      removeItem: (k) => { delete data[k]; },
      clear: () => { Object.keys(data).forEach((k) => delete data[k]); },
      key: (i) => Object.keys(data)[i] ?? null,
      get length() { return Object.keys(data).length; },
    };
  };
  try {
    Object.defineProperty(window, 'localStorage', { value: makeStorage(), configurable: true });
    Object.defineProperty(window, 'sessionStorage', { value: makeStorage(), configurable: true });
  } catch (e) { /* ignore */ }

  window.__harness = { post, logs };
})();
`;

// Browsers pause animation frames in offscreen iframes, which would stall
// jQuery effects while tests wait on them. Use timers instead when checking.
const CHECK_MODE = `
window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
window.cancelAnimationFrame = (id) => clearTimeout(id);
`;

const RUNNER = `
(async function () {
  const { post, logs } = window.__harness;
  const job = JSON.parse(document.getElementById('__job').textContent);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // Run the student's code as a normal classic script so top-level
  // let/const/function declarations become globals the tests can see.
  if (job.code.trim()) {
    const s = document.createElement('script');
    s.textContent = job.code;
    document.body.appendChild(s);
  }
  // Fire DOMContentLoaded-style code paths: the student's script is added
  // while the document is still parsing, so DOMContentLoaded and $(ready) fire normally.
  if (document.readyState === 'loading') {
    await new Promise((r) => document.addEventListener('DOMContentLoaded', r));
  }
  await wait(30);

  if (job.mode !== 'check') { post({ type: 'done' }); return; }

  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const results = [];
  for (const test of job.tests) {
    try {
      const fn = new AsyncFunction('logs', 'code', 'wait', test.code);
      const pass = await fn(logs, job.code, wait);
      results.push({ name: test.name, pass: pass === true });
    } catch (e) {
      results.push({ name: test.name, pass: false, error: e.message });
    }
  }
  post({ type: 'results', results });
})();
`;

// Optional per-question extras that run before the student's code:
//  - question.storage:   { key: "string value" } pre-loaded into localStorage
//  - question.mockFetch: { url: jsonValue }      served by a fake fetch(), since
//    exams run without internet. Unknown URLs get a 404 response.
function extrasScript(question) {
  const parts = [];
  if (question.storage) {
    parts.push(`(() => { const seed = ${jsonSafe(question.storage)};
      Object.keys(seed).forEach((k) => localStorage.setItem(k, seed[k])); })();`);
  }
  if (question.mockFetch) {
    parts.push(`(() => { const routes = ${jsonSafe(question.mockFetch)};
      window.fetch = (input) => {
        const url = String(input && input.url ? input.url : input);
        const found = Object.prototype.hasOwnProperty.call(routes, url);
        const body = JSON.stringify(found ? routes[url] : {});
        return new Promise((resolve) => setTimeout(() => resolve(new Response(body, {
          status: found ? 200 : 404,
          headers: { 'Content-Type': 'application/json' },
        })), 20));
      };
      window.XMLHttpRequest = undefined; })();`);
  }
  return parts.length ? `<script>${parts.join('\n')}</script>` : '';
}

/**
 * @param {object} question  question from the bank
 * @param {string} code      the student's code
 * @param {'preview'|'run'|'check'} mode
 */
export function buildDocument(question, code, mode) {
  const setup = question.setup || {};
  const job = { mode, code: mode === 'preview' ? '' : code, tests: question.tests || [] };
  return `<!doctype html>
<html><head><meta charset="utf-8">
<style>body{font-family:system-ui,sans-serif;margin:0;padding:.5em;color:#222;background:#fff}${setup.css || ''}</style>
</head><body>
${setup.html || ''}
<script>${BOOTSTRAP}</script>
${mode === 'check' ? `<script>${CHECK_MODE}</script>` : ''}
${extrasScript(question)}
${question.useJQuery ? `<script>${scriptSafe(jquerySource)}</script>` : ''}
<script type="application/json" id="__job">${jsonSafe(job)}</script>
<script>${RUNNER}</script>
</body></html>`;
}
