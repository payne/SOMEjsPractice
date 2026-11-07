# JS & jQuery Practice Exam (PWA)

A React Progressive Web App for **closed-book** practice with questions based on
*Murach's JavaScript and jQuery* (4th Edition). Students write code from memory in a plain
editor (no autocomplete), and the app runs it in a sandboxed iframe against the question's
HTML/CSS and checks it automatically.

## Run it

```bash
npm install
npm run dev       # development server
npm run build     # production build in dist/ (includes the service worker)
npm run preview   # serve dist/ locally — use this to test offline/PWA behaviour
```

Live app: **https://payne.github.io/SOMEjsPractice/**

Every push to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy-pages.yml`.
The build uses relative paths, so `dist/` works from any folder. The repository address shown
on the About page is `GITHUB_URL` in `src/config.js`.

## Question sets

`public/question-sets.json` lists the built-in sets. Students pick a set from the question list or
the About page, and can add their own set by URL on the About page (the URL must allow CORS).

| Set | File | Covers |
|---|---|---|
| Core Practice | `questions.json` | Loops, functions, DOM scripting, events, jQuery (ch 3–10) |
| Chapter Tour | `questions-chapter-tour.json` | One question per chapter topic: ch 2, 5, 7, 12–18 |

To add a built-in set, drop a question JSON file in `public/` and add an entry to
`question-sets.json`: `{ "id": "…", "title": "…", "description": "…", "url": "file.json" }`.
Every file in `public/` is cached for offline use automatically.

## Offline and storage

- The service worker (`sw-template.js`, filled in at build time) caches every built file and
  every file in `public/`, so after one online visit the app works with no network.
- `localStorage` (keys prefixed `jsPractice.`) holds the list of sets, settings, and for each set
  (`<key>.<setId>`): the downloaded questions (`bank`), each answer's code, check results, attempt
  counts, hints shown, solution-viewed flags and self-ratings (`progress`), and the last screen (`ui`).
- **About → Reload app** removes the service worker and cached files and reloads (progress kept).
- **About → Reset all data** clears local storage completely.

## Question file format

```jsonc
{
  "title": "…", "book": "…", "version": 1,
  "chapters": { "3": "The essential JavaScript statements", … },
  "questions": [{
    "id": "q01-for-loop-sum",        // unique within the set; progress is saved under this id
    "title": "Sum with a for loop",
    "chapters": [3],                 // at least one chapter number
    "difficulty": "easy",            // easy | medium | hard
    "useJQuery": false,              // true loads jQuery 3 into the sandbox
    "storage": { "tasks": "[]" },    // optional: pre-loaded into the sandbox's localStorage
    "mockFetch": { "https://…/users/1": { "name": "…" } },  // optional: fake fetch() responses
    "prompt": "Markdown-ish text: paragraphs, - lists, 1. lists, **bold**, `code`, ``` blocks",
    "setup": { "html": "<h1 id=…>", "css": "h1 { … }" },   // optional page for the student's code
    "starterCode": "// …",
    "hints": ["…"],
    "solution": "…",
    "tests": [
      { "name": "total equals 55", "code": "return typeof total !== 'undefined' && total === 55;" }
    ]
  }]
}
```

With `mockFetch`, `fetch()` in the sandbox answers the listed URLs with that JSON and returns a
404 for anything else, so Ajax questions work without internet.

Each test's `code` is the body of an `async` function that runs inside the sandbox after the
student's code. It must `return true` to pass, and can use:

- the page's `document`, and any globals the student declared (`let`/`const`/functions)
- `logs` — array of strings written with `console.log`
- `code` — the student's source text (for checks like "uses a for loop")
- `wait(ms)` — `await wait(500)` to let timers or animations finish
- `$` / `jQuery` when `useJQuery` is true

`alert`, `confirm`, `prompt` and `localStorage` are replaced with safe stand-ins inside the sandbox.

## Regenerating icons

`npm run icons` re-renders the PNG icons from `public/icons/icon.svg` (needs `chromium`).
