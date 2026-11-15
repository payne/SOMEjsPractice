# track-somejs

Cloudflare Worker + D1 database that stores anonymous usage events from the SOMEjsPractice app
and publishes them at **https://tracksomejs.appfarms.org**.

| URL | What |
|---|---|
| `/` | Stats page: unique users, daily active users, return visits, per-question counts |
| `/summary.json` | Everything on the stats page, as JSON (cached 60 s) |
| `/events.json?after=<id>&limit=<n>` | Raw events, oldest first, 5,000 per page (max 10,000). Use `next` from one page as `after` for the next; `next` is `null` on the last page. |
| `POST /event` | Upload from the app: `{ "uid": "<uuid>", "v": "1.3.0", "events": [{ "name", "t", "setId", "questionId", "data" }] }` |

Uploads are checked: the `uid` must be a UUID, event names must be on the list in `src/index.js`,
at most 100 events per upload, small flat `data` objects only, at most 30 uploads per minute per IP
address, and the page's `Origin` must be in `ALLOWED_ORIGINS` (`wrangler.jsonc`). IP addresses are
not stored; the country comes from Cloudflare.

## First deploy

```bash
cd tracker
npm install
npx wrangler login
npx wrangler d1 create track-somejs        # copy the database_id into wrangler.jsonc
npm run migrate:remote                     # creates the events table
npm run deploy                             # also creates the tracksomejs.appfarms.org custom domain
```

After that, `npm run deploy` publishes code changes. A new table change goes in a new file in
`migrations/`, applied with `npm run migrate:remote`.

## Run locally

```bash
npm run migrate:local
npm run dev                                 # http://localhost:8787
```

To point the app at it: `VITE_TRACK_URL=http://localhost:8787 npm run build && npm run preview`
in the repository root (port 4173 is an allowed origin).

## Download everything

```bash
after=0
while [ "$after" != "null" ]; do
  curl -s "https://tracksomejs.appfarms.org/events.json?after=$after&limit=10000" > "events-$after.json"
  after=$(jq -r .next "events-$after.json")
done
```
