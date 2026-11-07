// Builds a zip of one question as plain files (index.html, styles.css, main.js,
// README.md…) so it can be worked on in any editor, and reads answers back in.
import { strToU8, strFromU8, zipSync, unzipSync } from 'fflate';
import { jquerySource, prepareQuestion } from './harness.js';
import { cookieShim, networkShim } from './shims.js';

const JQUERY_FILE = 'jquery-3.7.1.min.js';
const JQUERY_UI_FILE = 'jquery-ui-1.14.2.min.js';
const JQUERY_UI_CSS = 'jquery-ui-1.14.2.min.css';
const usesJQuery = (q) => q.useJQuery || q.useJQueryUI;

/** "Core Practice" -> "Core-Practice"; keeps names safe on every OS. */
export function slug(text, max = 60) {
  return String(text)
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    .replace(/-+$/, '') || 'untitled';
}

export function folderNames(set, question, number) {
  return {
    setFolder: slug(set.title),
    questionFolder: `${String(number).padStart(2, '0')}-${slug(question.title, 50)}`,
  };
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function indexHtml(question) {
  const setup = question.setup || {};
  const scripts = [];
  if (question.useCookies) scripts.push('cookie-shim.js');
  if (question.storage) scripts.push('seed-storage.js');
  if (question.mockFetch) scripts.push('mock-fetch.js');
  if (usesJQuery(question)) scripts.push(JQUERY_FILE);
  if (question.useJQueryUI) scripts.push(JQUERY_UI_FILE);
  scripts.push('main.js');
  const body = setup.html
    ? setup.html.split('\n').map((l) => '  ' + l).join('\n')
    : '  <p>This question has no page. Open the browser console (F12) to see your output.</p>';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(question.title)}</title>
${question.useJQueryUI ? `  <link rel="stylesheet" href="${JQUERY_UI_CSS}">\n` : ''}  <link rel="stylesheet" href="styles.css">
</head>
<body>
${body}
${scripts.map((s) => `  <script src="${s}"></script>`).join('\n')}
</body>
</html>
`;
}

function seedStorageJs(storage) {
  return `// Puts the question's starting data into localStorage (only if it isn't there yet).
// To start over, run localStorage.clear() in the browser console and reload.
const seed = ${JSON.stringify(storage, null, 2)};
for (const key of Object.keys(seed)) {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, seed[key]);
  }
}
`;
}

function readme({ set, question, number, chapters, appUrl, includeHelp }) {
  const chapterLines = (question.chapters || [])
    .map((c) => `- Chapter ${c}${chapters[c] ? `: ${chapters[c]}` : ''}`).join('\n');
  const node = question.node;
  const files = node
    ? ['- `README.md` — this file', '- `main.js` — **your code goes here**']
    : [
      '- `README.md` — this file',
      '- `index.html` — the page (open it in a browser to run your code)',
      '- `styles.css` — the page\'s CSS',
      '- `main.js` — **your code goes here**',
    ];
  if (node) {
    Object.keys(node.files || {}).forEach((f) => files.push(`- \`${f}\` — a data file used by the question`));
    Object.keys(node.modules || {}).forEach((f) => files.push(`- \`${f}\` — a module used by the question`));
  }
  if (usesJQuery(question)) files.push(`- \`${JQUERY_FILE}\` — jQuery, included so this works without internet`);
  if (question.useJQueryUI) files.push(`- \`${JQUERY_UI_FILE}\`, \`${JQUERY_UI_CSS}\` — jQuery UI and its theme`);
  if (question.useCookies) files.push('- `cookie-shim.js` — lets cookies work when the page is opened from a file (delete its <script> line when using a web server)');
  if (question.storage) files.push('- `seed-storage.js` — puts the starting data into localStorage');
  if (question.mockFetch) files.push('- `mock-fetch.js` — sample data in place of the internet for `fetch()` and `XMLHttpRequest`');
  if (includeHelp && question.hints?.length) files.push('- `HINTS.md` — hints, if you get stuck');
  if (includeHelp && question.solution) files.push('- `SOLUTION.md` — a model solution (try first!)');
  const checks = (question.tests || []).map((t) => `- [ ] ${t.name}`).join('\n');

  return `# ${number}. ${question.title}

- Question set: ${set.title}
${question.difficulty ? `- Difficulty: ${question.difficulty}\n` : ''}${chapterLines}

## The question

${question.prompt}

## Files

${files.join('\n')}

## How to work on it

${node ? `1. Edit \`main.js\` in any editor (VS Code, Notepad, vi…).
2. In a terminal in this folder, run: \`node main.js${(node.argv || []).map((a) => ' ' + a).join('')}\`
3. Output and errors appear in the terminal. (The app checks Node questions with a
   small in-browser stand-in for Node.js.)` : `1. Edit \`main.js\` in any editor (VS Code, Notepad, vi…).
2. Open \`index.html\` in a browser, and reload it after each change.
3. Open the browser's developer tools (F12) and look at the **Console** for
   \`console.log()\` output and errors.`}

## What the checker looks for

${checks || '- (no automatic checks)'}

To have these checked automatically, open the question in the app and use
**Load answer from file** to load your \`main.js\` (or a zip of this folder).

## Sharing your answer

Zip this folder and email it. The other person can unzip it and open \`index.html\`,
or load the zip into the app with **Load answer from file**.
${appUrl ? `\nApp: ${appUrl}\n` : ''}`;
}

/** Returns a promise of { fileName, blob } for one question. */
export async function buildQuestionZip({ set, question, number, code, chapters = {}, includeHelp = true, appUrl = '' }) {
  const { setFolder, questionFolder } = folderNames(set, question, number);
  const root = `SOMEjsPractice/${setFolder}/${questionFolder}/`;
  const { jqueryUi } = await prepareQuestion(question);
  const files = {
    'README.md': readme({ set, question, number, chapters, appUrl, includeHelp }),
  };
  if (question.node) {
    Object.assign(files, question.node.files || {}, question.node.modules || {});
  } else {
    files['index.html'] = indexHtml(question);
    files['styles.css'] = question.setup?.css ? question.setup.css + '\n' : '/* No CSS for this question. */\n';
  }
  files['main.js'] = code.endsWith('\n') || code === '' ? code : code + '\n';
  if (usesJQuery(question)) files[JQUERY_FILE] = jquerySource;
  if (question.useJQueryUI) {
    files[JQUERY_UI_FILE] = jqueryUi.js;
    files[JQUERY_UI_CSS] = jqueryUi.css;
  }
  if (question.useCookies) files['cookie-shim.js'] = cookieShim();
  if (question.storage) files['seed-storage.js'] = seedStorageJs(question.storage);
  if (question.mockFetch) {
    files['mock-fetch.js'] = networkShim(question.mockFetch)
      + '// Delete the <script src="mock-fetch.js"> line in index.html to use the real network.\n';
  }
  if (includeHelp && question.hints?.length) {
    files['HINTS.md'] = `# Hints — ${question.title}\n\n` +
      question.hints.map((h, i) => `${i + 1}. ${h}`).join('\n') + '\n';
  }
  if (includeHelp && question.solution) {
    files['SOLUTION.md'] = `# Model solution — ${question.title}\n\nTry the question first!\n\n` +
      '```js\n' + question.solution + '\n```\n';
  }

  const entries = {};
  for (const [name, text] of Object.entries(files)) entries[root + name] = strToU8(text);
  const zipped = zipSync(entries, { level: 6, mtime: new Date() });
  return {
    fileName: `SOMEjsPractice-${setFolder}-${questionFolder}.zip`,
    blob: new Blob([zipped], { type: 'application/zip' }),
  };
}

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Reads an answer from a .js file or a .zip (finds main.js inside).
 * Returns the code as a string; throws a readable Error otherwise.
 */
export async function readAnswerFile(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b; // "PK"
  if (!isZip) {
    if (file.size > 200 * 1024) throw new Error('that file is too large to be an answer');
    return strFromU8(bytes);
  }
  let entries;
  try {
    entries = unzipSync(bytes, { filter: (f) => /(^|\/)main\.js$/i.test(f.name) && !f.name.startsWith('__MACOSX/') });
  } catch {
    throw new Error('that zip file could not be read');
  }
  const names = Object.keys(entries);
  if (names.length === 0) throw new Error('no main.js was found in that zip');
  if (names.length > 1) throw new Error(`that zip has ${names.length} main.js files; zip one question folder`);
  return strFromU8(entries[names[0]]);
}
