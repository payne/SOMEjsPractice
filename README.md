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

## Links to questions

Every screen has its own URL (in the hash, so it works on GitHub Pages and offline):

- `#/core` — the question list of a set (the set's `id` from `question-sets.json`)
- `#/core/q03-function-initials` — one question (the question's `id`)
- `#/about` — the About page

For example https://payne.github.io/SOMEjsPractice/#/core/q03-function-initials. Back and Forward
work, and opening the app with no hash goes back to the last screen used. A link to a question or
set that doesn't exist shows a question list instead. Sets added by URL on the About page only
exist in that browser, so their links only work there.

The editor turns off autocomplete, autocorrect, spell check and browser writing suggestions, and
the whole app turns off font ligatures so code shows exactly the characters typed.

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

## Working on a question outside the app

Each question has **Download as files (.zip)**. The zip unpacks to
`SOMEjsPractice/<Question-Set>/<NN-Question-Title>/` and contains:

| File | What it is |
|---|---|
| `README.md` | The question, its chapters, how to work on it, and the list of checks |
| `index.html` | The question's page; open it in a browser to run the code |
| `styles.css` | The page's CSS |
| `main.js` | The student's current code (or the starter code), to edit in any editor |
| `jquery-3.7.1.min.js` | Only for jQuery questions, so they work without internet |
| `seed-storage.js` / `mock-fetch.js` | Only for questions that use web storage or `fetch()` |
| `HINTS.md`, `SOLUTION.md` | Left out when exam mode is on |

**Load answer from file…** loads a `main.js`, or a zip of a question folder (for example, one
emailed by someone else), back into the editor so it can be checked.

## Offline and storage

- The service worker (`sw-template.js`, filled in at build time) caches every built file and
  every file in `public/`, so after one online visit the app works with no network.
- `localStorage` (keys prefixed `jsPractice.`) holds the list of sets, settings, and for each set
  (`<key>.<setId>`): the downloaded questions (`bank`), each answer's code, check results, attempt
  counts, hints shown, solution-viewed flags and self-ratings (`progress`), and the last screen (`ui`).
- **About → Reload app** removes the service worker and cached files and reloads (progress kept).
- **About → Reset all data** clears local storage completely.

## Usage tracking

The app sends anonymous usage counts to a Cloudflare Worker at
**https://tracksomejs.appfarms.org** (code in `tracker/`, see `tracker/README.md`). No logins.

- Each browser gets a random ID (`jsPractice.uid` in local storage). A "user" is one browser, so
  one person on two devices counts twice, and **Reset all data** makes a new ID.
- Events: `app_open`, `about_view`, `set_changed`, `set_added`, `question_view`, `run_code`,
  `check_answer` (pass, checks passed, attempt), `hint_shown`, `solution_shown`, `self_mark`,
  `download_zip`, `load_answer`, `reload_app`, `reset_data`. Code the student typed is never sent.
- Events wait in `jsPractice.analyticsQueue` and are uploaded in batches, so offline use is
  counted when the browser is next online. Tracking only runs in production builds.
- `TRACK_URL` in `src/config.js` sets the address (empty string turns tracking off).
  `VITE_TRACK_URL=http://localhost:8787 npm run build` points a build at a local tracker.
- Stats page: https://tracksomejs.appfarms.org/ — data as JSON at `/summary.json` and `/events.json`. Question and set names on the stats page link to their pages in the app.

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
