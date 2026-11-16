// Builds public/codingbat.json: JavaScript versions of the CodingBat Java problems
// (https://codingbat.com/java, by Nick Parlante). Problem text and examples come from
// problems.json (made by fetch.mjs); model answers come from solutions.mjs.
//
//   npm run codingbat        # check every solution against CodingBat's examples, then build
//
// Afterwards run `npm run verify -- codingbat.json` to check the set in a real browser.
import fs from 'node:fs';
import path from 'node:path';
import solutions from './solutions.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const out = path.join(here, '..', '..', 'public', 'codingbat.json');
const { problems, author, source } = JSON.parse(fs.readFileSync(path.join(here, 'problems.json'), 'utf8'));

const SECTIONS = {
  'Warmup-1': { difficulty: 'easy', about: 'Simple warmup problems to get started' },
  'Warmup-2': { difficulty: 'medium', about: 'Medium warmup string/array loops' },
  'String-1': { difficulty: 'easy', about: 'Basic string problems -- no loops' },
  'Array-1': { difficulty: 'easy', about: 'Basic array problems -- no loops' },
  'Logic-1': { difficulty: 'easy', about: 'Basic boolean logic puzzles -- if else && || !' },
  'Logic-2': { difficulty: 'medium', about: 'Medium boolean logic puzzles -- if else && || !' },
  'String-2': { difficulty: 'medium', about: 'Medium string problems -- 1 loop' },
  'String-3': { difficulty: 'hard', about: 'Harder string problems -- 2 loops' },
  'Array-2': { difficulty: 'medium', about: 'Medium array problems -- 1 loop' },
  'Array-3': { difficulty: 'hard', about: 'Harder array problems -- 2 loops, more complex logic' },
  'AP-1': { difficulty: 'medium', about: 'AP CS medium problems' },
  'Recursion-1': { difficulty: 'medium', about: 'Basic recursion problems' },
  'Recursion-2': { difficulty: 'hard', about: 'Harder recursion problems' },
  'Map-1': { difficulty: 'easy', about: 'Basic map get/put, no loops' },
  'Map-2': { difficulty: 'medium', about: 'Maps with bulk data and loops' },
  'Functional-1': { difficulty: 'easy', about: 'Functional mapping operations on lists with lambdas' },
  'Functional-2': { difficulty: 'medium', about: 'Functional filtering and mapping operations on lists with lambdas' },
};
const sectionNames = Object.keys(SECTIONS);

const HINTS = {
  'Warmup-1': ['Work out each true/false condition on its own, then combine them with &&, || and !.',
    'Useful string tools: str.length, str.charAt(i), str.substring(start, end), str.startsWith(s).'],
  'Warmup-2': ['A for loop over a string: for (let i = 0; i < str.length; i++) { … str.charAt(i) … }',
    'When you look at str.substring(i, i + 2), stop the loop at str.length - 1 so the piece is never cut short.'],
  'String-1': ['str.substring(start, end) includes start but not end; str.substring(start) goes to the end.',
    'Watch out for short strings: check str.length before you take pieces of it.'],
  'Array-1': ['nums[0] is the first element and nums[nums.length - 1] is the last.',
    'Make a new array with a literal, like [a, b], or start with [] and push() values onto it.'],
  'Logic-1': ['Handle the special case first with an if that returns, then deal with the normal case.',
    'The % operator gives the remainder: n % 10 is the last digit and n % 2 === 0 means n is even.'],
  'Logic-2': ['Write out a few cases by hand before coding, including the edge cases in the examples.',
    'A small helper function can stop you repeating the same test three times.'],
  'String-2': ['Loop over the string and look at str.substring(i, i + n) at each position.',
    'Build the result in a variable that starts as "" and add to it with +=.'],
  'String-3': ['Keep track of where you are with an index variable, and move it forward by more than 1 when you skip a match.',
    'A regular expression like /[a-z]/i.test(ch) checks whether a character is a letter.'],
  'Array-2': ['Loop over the array with for (let i = 0; i < nums.length; i++) and use counters or flags.',
    'When you look at nums[i + 1], stop the loop at nums.length - 1.'],
  'Array-3': ['Nested loops are fine here — efficiency is not the point.',
    'Draw the array on paper and trace your loops for one of the examples.'],
  'AP-1': ['Most of these need one loop and a counter, a sum, or an index into a second array.',
    'Strings can be compared with < and >, which order them alphabetically (by character code).'],
  'Recursion-1': ['Start with the base case: the smallest input, whose answer you know without recursion.',
    'Then solve a smaller problem with a recursive call (str.substring(1), n - 1, index + 1) and add this step\'s part.'],
  'Recursion-2': ['At each index, try both choices: use nums[start] (subtract it from target) or skip it.',
    'The base case is start >= nums.length: you succeeded if target is 0.'],
  'Map-1': ['Check for a key with "a" in map, read it with map.a or map["a"], set it with map.b = …, remove it with delete map.c.'],
  'Map-2': ['Start with an empty object, const map = {}; then loop over the strings and set map[s] = ….',
    'Check whether you have seen a key before with key in map.'],
  'Functional-1': ['array.map((x) => …) makes a new array by applying the arrow function to each element.'],
  'Functional-2': ['array.filter((x) => …) keeps the elements for which the arrow function returns true.',
    'You can chain them: nums.map(…).filter(…).'],
};

// Java wording in CodingBat's descriptions → JavaScript wording.
const REWRITES = [
  [/ in the JavaBat text area/g, ''],
  [/a new List \(e\.g\. an ArrayList\)/g, 'a new array'],
  [/ See wordsWithout\(\) below which is more difficult because it uses arrays\./g, ''],
  [/and \/ to discard the rightmost digit/g, 'and Math.floor(n / 10) to discard the rightmost digit'],
  [/Note: by default, a new int array contains all 0's\./g, 'Note: new Array(n).fill(0) makes an array of n zeros.'],
  [/Use int division to produce the final average\./g, 'Use int division to produce the final average (Math.trunc() in JavaScript).'],
  [/The syntax to make a new (int|string) array is: new \w+\[desired_length\]/g, 'You can start with an empty array, [], and push() each value onto it.'],
  [/Note: String\.valueOf\(xxx\) will make the String form of most types\./g, 'Note: String(xxx) will make the string form of most types.'],
  [/In Java, String\.valueOf\(xxx\) will make the String form of an int or other type\./g, 'In JavaScript, String(xxx) will make the string form of a number or other type.'],
  [/String\.valueOf\(n\)/g, 'String(n)'],
  [/a new String\[\] array/g, 'a new array of strings'],
  [/Note that it is valid in java to create an array of length 0\./g, 'Note that it is fine to return an array of length 0.'],
  [/str\.contains\(x\)/g, 'str.includes(x)'],
  [/division, e\.g\. n\/10, gives/g, 'division, e.g. Math.floor(n / 10), gives'],
  [/a separate helper "public int fixTeen\(int n\) \{"that takes/g, 'a separate helper function fixTeen(n) that takes'],
  [/a separate helper "public int round10\(int num\) \{"/g, 'a separate helper function round10(num)'],
  [/helper method int average\(int\[\] scores, int start, int end\) \{ which/g, 'helper function average(scores, start, end) which'],
  [/isEndy\(int n\) method/g, 'isEndy(n) function'],
  [/a Map<[^>]+>/g, 'an object'],
  [/while divide \(\/\) by 10 removes the rightmost digit \(126 \/ 10 is 12\)/g,
    'while dividing by 10 and rounding down removes the rightmost digit (Math.floor(126 / 10) is 12)'],
  [/\.length\(\)/g, '.length'],
  [/use \.equals\(\) to compare 2 strings/g, 'use === to compare 2 strings'],
  [/Character\.isLetter\(char\) tests if a char is (an alphabetic letter|a letter)/g, '/[a-zA-Z]/.test(ch) tests if a char ch is $1'],
  [/Character\.isDigit\(char\) tests if a char is/g, "ch >= '0' && ch <= '9' tests if a char ch is"],
  [/Integer\.parseInt\(string\)/g, 'parseInt(string)'],
  [/ ?\(See also: [^)]*\)\.?/g, ''],
  [/ ?(--|) ?[Ss]ee( also:)? Introduction to (Mod|MakeBricks)\.?/g, ''],
  [/\bmethods?\b/g, (m) => (m === 'method' ? 'function' : 'functions')],
  [/str\.includes\(x\) function/g, 'str.includes(x) method'],
  [/compute averages with doubles, but here we use ints/g, 'compute averages with fractions, but here we use whole numbers (ints)'],
  // Java array literals {1, 2, 3} → [1, 2, 3]
  [/\{((?:\s*(?:-?\d+|"[^"]*")\s*,?)+)\}/g, '[$1]'],
  [/\bString\b(?![(.])/g, 'string'],
];

const jsParams = (signature) => {
  const inside = signature.slice(signature.indexOf('(') + 1, signature.lastIndexOf(')'));
  return inside.split(/,(?![^<]*>)/).map((p) => p.trim().split(/\s+/).pop()).filter(Boolean);
};

const notesFor = (p, solution) => {
  const notes = [];
  const sig = p.signature;
  if (/\blists?\b/i.test(rewrite(p.description))) notes.push('Lists are JavaScript arrays.');
  if (p.section === 'Map-1') {
    notes.push('The map is a plain JavaScript object, like `{"a": "candy"}`. Read a value with `map.a` or `map["a"]`, check for a key with `"a" in map`, and remove a key with `delete map.c`. Change the object and return it.');
  } else if (/Map</.test(sig)) {
    notes.push('Return a plain JavaScript object such as `{"a": 1}`: start with `{}` and set keys with `result[key] = value`.');
  }
  if (/Math\.(floor|trunc)\(/.test(solution) && !/Math\.(floor|trunc)/.test(rewrite(p.description))) {
    notes.push('JavaScript\'s `/` keeps the fraction (`7 / 2` is `3.5`), unlike Java\'s int division. Use `Math.floor()` or `Math.trunc()` when you need a whole number.');
  }
  if (noLoops(p)) notes.push('Solve it recursively: no `for` or `while` loops.');
  if (p.section === 'Functional-1') notes.push('Use the array\'s `map()` method with an arrow function, like `nums.map((n) => n + 1)`.');
  if (p.section === 'Functional-2') notes.push('Use the array\'s `filter()` method (and `map()` where needed) with arrow functions.');
  return notes;
};

const noLoops = (p) => p.section.startsWith('Recursion') && p.name !== 'groupSumClump';
const rewrite = (text) => REWRITES.reduce((t, [re, to]) => t.replace(re, to), text);
const lit = (v) => JSON.stringify(v);
const call = (name, args) => `${name}(${args.map(lit).join(', ')})`;
// Values as CodingBat shows them: [1, 2, 3] and {"a": "x", "b": "y"}.
const fmt = (v) => (Array.isArray(v) ? `[${v.map(fmt).join(', ')}]`
  : v && typeof v === 'object' ? `{${Object.entries(v).map(([k, x]) => `${lit(k)}: ${fmt(x)}`).join(', ')}}`
    : lit(v));
const shown = (name, c) => `${name}(${c.args.map(fmt).join(', ')}) → ${fmt(c.expected)}`;

// Problems whose answer isn't unique: CodingBat's description says other orders are fine.
const CUSTOM = {
  zeroFront: (name, c) => orderCheck(name, c, 'x === 0', 'the zeros come first'),
  evenOdd: (name, c) => orderCheck(name, c, 'x % 2 === 0', 'the even numbers come first'),
  fix34: (name, c) => fixCheck(name, c, 3, 4),
  fix45: (name, c) => fixCheck(name, c, 4, 5),
};
const sameItems = `const sorted = (a) => [...a].sort((x, y) => x - y).join();
if (!Array.isArray(r) || r.length !== input.length || sorted(r) !== sorted(input)) throw new Error('got ' + JSON.stringify(r));`;
function orderCheck(name, c, test, what) {
  return {
    name: `${shown(name, c)} (or another order where ${what})`,
    code: `const input = ${lit(c.args[0])};
const r = ${call(name, c.args)};
${sameItems}
const first = r.filter((x) => ${test}).length;
if (!r.every((x, i) => (i < first) === (${test}))) throw new Error('got ' + JSON.stringify(r));
return true;`,
  };
}
function fixCheck(name, c, a, b) {
  return {
    name: `${shown(name, c)} (or another answer with every ${a} kept in place and followed by a ${b})`,
    code: `const input = ${lit(c.args[0])};
const r = ${call(name, c.args)};
${sameItems}
const ok = input.every((x, i) => (x === ${a}) === (r[i] === ${a}) && (x !== ${a} || r[i + 1] === ${b}));
if (!ok) throw new Error('got ' + JSON.stringify(r));
return true;`,
  };
}

// Check every model solution against CodingBat's examples before writing anything.
const findSolution = (p) => (solutions[p.section] || []).find((e) => (Array.isArray(e) ? e[0] : e).name === p.name);
const sourceOf = (entry) => (Array.isArray(entry) ? entry : [entry]).map(String).join('\n\n');
const deepEqual = (a, b) => JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));
const sortKeys = (v) => (v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])]))
  : Array.isArray(v) ? v.map(sortKeys) : v);
const errors = [];
for (const p of problems) {
  const entry = findSolution(p);
  if (!entry) { errors.push(`${p.section} ${p.name}: no solution in solutions.mjs`); continue; }
  const fn = new Function(`${sourceOf(entry)}\nreturn ${p.name};`)();
  for (const c of p.cases) {
    const got = fn(...structuredClone(c.args));
    if (!deepEqual(got, c.expected)) errors.push(`${p.section} ${p.name}: ${shown(p.name, c)} but got ${lit(got)}`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const questions = problems.map((p) => {
  const solution = sourceOf(findSolution(p));
  const params = jsParams(p.signature);
  const notes = notesFor(p, solution);
  const helpers = (Array.isArray(findSolution(p)) ? findSolution(p).slice(1) : []).map((f) => f.name);
  const prompt = [
    rewrite(p.description),
    '```\n' + p.cases.map((c) => shown(p.name, c)).join('\n') + '\n```',
    `Write the function \`${p.name}(${params.join(', ')})\`${helpers.length ? ` and the helper ${helpers.map((h) => `\`${h}()\``).join(', ')}` : ''}.`,
    notes.length ? notes.map((n) => `- ${n}`).join('\n') : null,
  ].filter(Boolean).join('\n\n');

  const tests = p.cases.map((c) => (CUSTOM[p.name]
    ? CUSTOM[p.name](p.name, c)
    : { name: shown(p.name, c), code: `return expectEqual(${call(p.name, c.args)}, ${lit(c.expected)});` }));
  if (noLoops(p)) {
    tests.push({
      name: 'Uses recursion, not for or while loops',
      code: "const src = code.replace(/\\/\\*[\\s\\S]*?\\*\\/|\\/\\/.*$/gm, '');\nreturn !/\\b(for|while)\\b|\\.forEach\\s*\\(/.test(src);",
    });
  }
  if (p.section === 'Functional-1') tests.push({ name: 'Uses map()', code: 'return /\\.map\\s*\\(/.test(code);' });
  if (p.section === 'Functional-2') tests.push({ name: 'Uses filter()', code: 'return /\\.filter\\s*\\(/.test(code);' });

  return {
    id: `${p.section.toLowerCase()}-${p.name}`,
    title: p.name,
    chapters: [sectionNames.indexOf(p.section) + 1],
    difficulty: SECTIONS[p.section].difficulty,
    source: { title: `CodingBat Java › ${p.section} › ${p.name}`, url: p.url, author },
    prompt,
    starterCode: `function ${p.name}(${params.join(', ')}) {\n  \n}\n`,
    hints: HINTS[p.section],
    solution,
    tests,
  };
});

const bank = {
  title: 'CodingBat in JavaScript',
  book: 'the CodingBat Java problems by Nick Parlante',
  credit: {
    text: 'All credit for these problems goes to CodingBat:',
    url: source,
  },
  chapterLabel: 'Section',
  version: 1,
  updated: new Date().toISOString().slice(0, 10),
  chapters: Object.fromEntries(sectionNames.map((s, i) => [String(i + 1), s])),
  questions,
};
fs.writeFileSync(out, JSON.stringify(bank, null, 2) + '\n');
const cases = problems.reduce((n, p) => n + p.cases.length, 0);
console.log(`All ${problems.length} solutions pass CodingBat's ${cases} examples. Wrote ${path.relative(process.cwd(), out)}.`);
