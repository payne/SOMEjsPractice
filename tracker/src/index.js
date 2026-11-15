// Anonymous usage tracker for SOMEjsPractice.
//
//   POST /event          the app uploads a batch of events
//   GET  /summary.json   totals, daily users, return visits, per-question counts
//   GET  /events.json    raw events, paged: ?after=<id>&limit=<n> (max 10000)
//   GET  /               a stats page that shows summary.json
//
// Nothing personal is stored: the user ID is a random UUID made by the browser,
// and the IP address is only used (in memory) for rate limiting.

import STATS_PAGE from './stats.html';

const EVENTS = new Set([
  'app_open', 'about_view', 'set_changed', 'set_added', 'question_view', 'run_code',
  'check_answer', 'hint_shown', 'solution_shown', 'self_mark', 'download_zip',
  'load_answer', 'reload_app', 'reset_data',
]);
const MAX_BODY = 64 * 1024;
const MAX_EVENTS = 100;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DAY_MS = 24 * 60 * 60 * 1000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = CORS;

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    try {
      if (url.pathname === '/event' && request.method === 'POST') return await addEvents(request, env, cors);
      if (request.method !== 'GET' && request.method !== 'HEAD') return text('Method not allowed', 405, cors);
      if (url.pathname === '/summary.json') return json(await summary(env), cors, 60);
      if (url.pathname === '/events.json') return json(await listEvents(env, url.searchParams), cors, 60);
      if (url.pathname === '/' || url.pathname === '/index.html') {
        return new Response(STATS_PAGE, {
          headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' },
        });
      }
      return text('Not found', 404, cors);
    } catch (err) {
      console.error(err);
      return text('Server error', 500, cors);
    }
  },
};

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
  'access-control-max-age': '86400',
};

function originAllowed(request, env) {
  const origin = request.headers.get('origin');
  if (!origin) return true; // sendBeacon from some browsers, or tools like curl
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return allowed.length === 0 || allowed.includes(origin);
}

function text(body, status, headers) {
  return new Response(body, { status, headers: { ...headers, 'content-type': 'text/plain; charset=utf-8' } });
}

function json(data, headers, maxAge = 0) {
  return new Response(JSON.stringify(data, null, 1), {
    headers: {
      ...headers,
      'content-type': 'application/json; charset=utf-8',
      'cache-control': maxAge ? `public, max-age=${maxAge}` : 'no-store',
    },
  });
}

function shortString(value, max = 100) {
  return typeof value === 'string' && value.length > 0 && value.length <= max ? value : null;
}

/** Keeps a small, flat JSON object of strings, numbers and booleans. */
function cleanData(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const out = {};
  for (const [k, v] of Object.entries(value).slice(0, 12)) {
    if (k.length > 40) continue;
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (typeof v === 'boolean') out[k] = v;
    else if (typeof v === 'string') out[k] = v.slice(0, 200);
  }
  return Object.keys(out).length ? JSON.stringify(out) : null;
}

/** Uses the browser's time if it is believable (events can be queued offline). */
function clientTime(value, now) {
  const t = typeof value === 'string' || typeof value === 'number' ? new Date(value).getTime() : NaN;
  if (!Number.isFinite(t) || t > now + 5 * 60 * 1000 || t < now - 60 * DAY_MS) return new Date(now).toISOString();
  return new Date(t).toISOString();
}

async function addEvents(request, env, cors) {
  if (!originAllowed(request, env)) return text('Origin not allowed', 403, cors);

  if (env.LIMITER) {
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const { success } = await env.LIMITER.limit({ key: ip });
    if (!success) return text('Too many requests', 429, cors);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) return text('Too large', 413, cors);
  let body;
  try { body = JSON.parse(raw); } catch { return text('Bad JSON', 400, cors); }

  const uid = typeof body?.uid === 'string' && UUID.test(body.uid) ? body.uid.toLowerCase() : null;
  if (!uid || !Array.isArray(body.events)) return text('Bad request', 400, cors);

  const now = Date.now();
  const receivedAt = new Date(now).toISOString();
  const version = shortString(body.v, 20);
  const country = shortString(request.cf?.country, 2);
  const insert = env.DB.prepare(
    `INSERT INTO events (received_at, client_at, uid, event, set_id, question_id, data, app_version, country)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const rows = body.events
    .slice(0, MAX_EVENTS)
    .filter((e) => e && EVENTS.has(e.name))
    .map((e) => insert.bind(
      receivedAt, clientTime(e.t, now), uid, e.name,
      shortString(e.setId), shortString(e.questionId), cleanData(e.data), version, country,
    ));

  if (rows.length) await env.DB.batch(rows);
  return json({ ok: true, stored: rows.length }, cors);
}

async function listEvents(env, params) {
  const after = Math.max(0, parseInt(params.get('after') || '0', 10) || 0);
  const limit = Math.min(10000, Math.max(1, parseInt(params.get('limit') || '5000', 10) || 5000));
  const { results } = await env.DB.prepare(
    `SELECT id, received_at, client_at, uid, event, set_id, question_id, data, app_version, country
     FROM events WHERE id > ? ORDER BY id LIMIT ?`
  ).bind(after, limit).all();
  const events = results.map((r) => ({ ...r, data: r.data ? JSON.parse(r.data) : null }));
  return {
    generatedAt: new Date().toISOString(),
    count: events.length,
    next: events.length === limit ? events[events.length - 1].id : null,
    events,
  };
}

async function summary(env) {
  const now = Date.now();
  const iso = (msAgo) => new Date(now - msAgo).toISOString();
  const day = 'substr(client_at, 1, 10)';
  const q = (sql, ...args) => env.DB.prepare(sql).bind(...args);

  const [totals, active, daily, firstDays, dayCounts, byEvent, questions, sets, versions, countries, installs] =
    await env.DB.batch([
      q(`SELECT COUNT(*) AS events, COUNT(DISTINCT uid) AS users,
                MIN(client_at) AS firstEvent, MAX(client_at) AS lastEvent FROM events`),
      q(`SELECT COUNT(DISTINCT CASE WHEN client_at >= ? THEN uid END) AS day1,
                COUNT(DISTINCT CASE WHEN client_at >= ? THEN uid END) AS day7,
                COUNT(DISTINCT CASE WHEN client_at >= ? THEN uid END) AS day30
         FROM events WHERE client_at >= ?`, iso(DAY_MS), iso(7 * DAY_MS), iso(30 * DAY_MS), iso(30 * DAY_MS)),
      q(`SELECT ${day} AS day, COUNT(DISTINCT uid) AS users, COUNT(*) AS events
         FROM events WHERE client_at >= ? GROUP BY day ORDER BY day`, iso(90 * DAY_MS)),
      q(`SELECT firstDay AS day, COUNT(*) AS newUsers
         FROM (SELECT uid, MIN(${day}) AS firstDay FROM events GROUP BY uid) GROUP BY firstDay`),
      q(`SELECT days, COUNT(*) AS users
         FROM (SELECT uid, COUNT(DISTINCT ${day}) AS days FROM events GROUP BY uid) GROUP BY days ORDER BY days`),
      q(`SELECT event, COUNT(*) AS count, COUNT(DISTINCT uid) AS users
         FROM events GROUP BY event ORDER BY count DESC`),
      q(`SELECT set_id AS setId, question_id AS questionId,
                MAX(json_extract(data, '$.title')) AS title,
                SUM(event = 'question_view') AS views,
                COUNT(DISTINCT CASE WHEN event = 'question_view' THEN uid END) AS users,
                SUM(event = 'check_answer') AS checks,
                SUM(event = 'check_answer' AND json_extract(data, '$.pass') = 1) AS passedChecks,
                COUNT(DISTINCT CASE WHEN event = 'check_answer' AND json_extract(data, '$.pass') = 1 THEN uid END) AS usersPassed,
                SUM(event = 'hint_shown') AS hints,
                SUM(event = 'solution_shown') AS solutions,
                SUM(event = 'download_zip') AS downloads,
                SUM(event = 'load_answer') AS answersLoaded
         FROM events WHERE question_id IS NOT NULL
         GROUP BY set_id, question_id ORDER BY views DESC, checks DESC`),
      q(`SELECT set_id AS setId, MAX(json_extract(data, '$.setTitle')) AS title,
                COUNT(DISTINCT uid) AS users, SUM(event = 'question_view') AS views,
                SUM(event = 'download_zip') AS downloads
         FROM events WHERE set_id IS NOT NULL GROUP BY set_id ORDER BY users DESC`),
      q(`SELECT app_version AS version, COUNT(DISTINCT uid) AS users
         FROM events GROUP BY app_version ORDER BY users DESC`),
      q(`SELECT country, COUNT(DISTINCT uid) AS users
         FROM events GROUP BY country ORDER BY users DESC`),
      q(`SELECT COUNT(DISTINCT uid) AS users FROM events
         WHERE event = 'app_open' AND json_extract(data, '$.installed') = 1`),
    ]);

  // Daily series for the last 90 days, with zero-filled gaps and new users per day.
  const newByDay = new Map(firstDays.results.map((r) => [r.day, r.newUsers]));
  const activeByDay = new Map(daily.results.map((r) => [r.day, r]));
  const days = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now - i * DAY_MS).toISOString().slice(0, 10);
    const row = activeByDay.get(d);
    days.push({ day: d, users: row?.users ?? 0, newUsers: newByDay.get(d) ?? 0, events: row?.events ?? 0 });
  }

  const daysActive = dayCounts.results.map((r) => ({ daysActive: r.days, users: r.users }));
  const returning = daysActive.filter((r) => r.daysActive >= 2).reduce((n, r) => n + r.users, 0);
  const t = totals.results[0];

  return {
    generatedAt: new Date(now).toISOString(),
    notes: 'A "user" is one browser (a random ID kept in localStorage). Days are UTC.',
    totals: {
      users: t.users,
      events: t.events,
      firstEvent: t.firstEvent,
      lastEvent: t.lastEvent,
      returningUsers: returning,
      installedAppUsers: installs.results[0].users,
    },
    activeUsers: active.results[0],
    daysActive,
    daily: days,
    events: byEvent.results,
    questionSets: sets.results,
    questions: questions.results,
    appVersions: versions.results,
    countries: countries.results,
  };
}
