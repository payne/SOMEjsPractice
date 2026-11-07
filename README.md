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

The build uses relative paths, so `dist/` can be hosted from any folder (e.g. GitHub Pages).
Set your repository address in `src/config.js` (`GITHUB_URL`) — it is shown on the About page.

## Offline and storage

- The service worker (`sw-template.js`, filled in at build time) caches every built file and
  `questions.json`, so after one online visit the app works with no network.
- `localStorage` (keys prefixed `jsPractice.`) holds: the downloaded question bank, each
  answer's code, check results, attempt counts, hints shown, solution-viewed flags,
  self-ratings, settings and the last screen.
- **About → Reload app** removes the service worker and cached files and reloads (progress kept).
- **About → Reset all data** clears local storage completely.

## Question file format (`public/questions.json`)

The app downloads this file with an HTTP GET (URL can be changed on the About page).

```jsonc
{
  "title": "…", "book": "…", "version": 1,
  "chapters": { "3": "The essential JavaScript statements", … },
  "questions": [{
    "id": "q01-for-loop-sum",        // unique; progress is saved under this id
    "title": "Sum with a for loop",
    "chapters": [3],                 // at least one chapter number
    "difficulty": "easy",            // easy | medium | hard
    "useJQuery": false,              // true loads jQuery 3 into the sandbox
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
