// Downloads the CodingBat Java problem list and each problem's description, Java
// signature and examples, and writes them to scripts/codingbat/problems.json.
// The problems are by Nick Parlante, https://codingbat.com/java — see README.md.
//
//   node scripts/codingbat/fetch.mjs [cacheDir]
//
// Pages are saved in cacheDir (default: a temp folder) and reused on later runs, and
// requests are spaced out so the site isn't hammered. Only run this to pick up changes
// on CodingBat; build.mjs works from problems.json.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const cache = process.argv[2] || path.join(os.tmpdir(), 'codingbat-cache');
fs.mkdirSync(path.join(cache, 'probs'), { recursive: true });
fs.mkdirSync(path.join(cache, 'sections'), { recursive: true });

// Sections in the order the CodingBat Java page lists them.
export const SECTIONS = [
  'Warmup-1', 'Warmup-2', 'String-1', 'Array-1', 'Logic-1', 'Logic-2', 'String-2', 'String-3',
  'Array-2', 'Array-3', 'AP-1', 'Recursion-1', 'Recursion-2', 'Map-1', 'Map-2',
  'Functional-1', 'Functional-2',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function page(url, file) {
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return fs.readFileSync(file, 'utf8');
  await sleep(700);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const text = await res.text();
  fs.writeFileSync(file, text);
  return text;
}

const entities = (s) => s
  .replace(/&rarr;/g, '→').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

const problems = [];
for (const section of SECTIONS) {
  const html = await page(`https://codingbat.com/java/${section}`, path.join(cache, 'sections', `${section}.html`));
  for (const [, id, name] of html.matchAll(/href='\/prob\/(p\d+)'>([^<]+)/g)) {
    const prob = await page(`https://codingbat.com/prob/${id}`, path.join(cache, 'probs', `${id}.html`));
    const m = prob.match(/<p class=max2>([\s\S]*?)<\/div>([\s\S]*?)<p><button/);
    if (!m) throw new Error(`${section} ${name}: couldn't find the description`);
    const description = entities(m[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    const examples = m[2].split('<br>').map((s) => entities(s).trim()).filter((s) => s.includes('→'));
    const signature = entities(prob.match(/<div id='ace_div'>([^\n]*)/)[1]).replace(/\s*\{\s*$/, '').trim();
    const cases = examples.map((ex) => {
      const arrow = ex.lastIndexOf('→');
      const args = ex.slice(ex.indexOf('(') + 1, ex.lastIndexOf(')', arrow));
      // CodingBat prints Java values in a JSON-compatible way: "str", 1, true, [1, 2], {"a": "b"}.
      return { args: JSON.parse(`[${args}]`), expected: JSON.parse(ex.slice(arrow + 1).trim()) };
    });
    problems.push({ section, id, name, url: `https://codingbat.com/prob/${id}`, signature, description, examples, cases });
  }
  console.log(`${section}: ${problems.filter((p) => p.section === section).length} problems`);
}

fs.writeFileSync(path.join(here, 'problems.json'), JSON.stringify({
  source: 'https://codingbat.com/java',
  author: 'Nick Parlante',
  fetched: new Date().toISOString().slice(0, 10),
  problems,
}, null, 1) + '\n');
console.log(`${problems.length} problems written to scripts/codingbat/problems.json`);
