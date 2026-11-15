// Anonymous usage counts. Each browser gets a random ID; events (which
// question was opened, checked or downloaded) are queued in localStorage and
// sent in small batches to TRACK_URL, so nothing is lost while offline.
// Never send anything the student typed.
import { APP_VERSION, TRACK_URL } from './config.js';
import { load, save } from './storage.js';

const QUEUE_KEY = 'analyticsQueue';
const MAX_QUEUE = 500;
const BATCH = 50;
const DELAY_MS = 3000;
const enabled = Boolean(TRACK_URL) && import.meta.env.PROD;

let timer = null;
let sending = false;

function uid() {
  let id = load('uid', null);
  if (!id) {
    id = crypto.randomUUID?.() ?? fallbackUuid();
    save('uid', id);
  }
  return id;
}

function fallbackUuid() {
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/**
 * Records one event, e.g. track('download_zip', { setId, questionId, data: { title } }).
 * Safe to call anywhere: it never throws.
 */
export function track(name, { setId, questionId, data } = {}) {
  try {
    if (!enabled) {
      if (import.meta.env.DEV) console.debug('[analytics]', name, { setId, questionId, data });
      return;
    }
    const queue = load(QUEUE_KEY, []);
    queue.push({ name, t: new Date().toISOString(), setId, questionId, data });
    save(QUEUE_KEY, queue.slice(-MAX_QUEUE));
    clearTimeout(timer);
    timer = setTimeout(flush, DELAY_MS);
  } catch { /* analytics must never break the app */ }
}

/** Shorthand for events about one question. */
export function trackQuestion(name, set, question, data = {}) {
  track(name, {
    setId: set.id,
    questionId: question.id,
    data: { title: question.title, setTitle: set.title, ...data },
  });
}

/** Sends queued events. With beacon=true, uses sendBeacon (for when the page is closing). */
export async function flush(beacon = false) {
  clearTimeout(timer);
  if (!enabled || sending || !navigator.onLine) return;
  const queue = load(QUEUE_KEY, []);
  if (!queue.length) return;
  const batch = queue.slice(0, BATCH);
  // text/plain avoids a CORS preflight request.
  const body = JSON.stringify({ uid: uid(), v: APP_VERSION, events: batch });

  if (beacon && navigator.sendBeacon) {
    if (navigator.sendBeacon(`${TRACK_URL}/event`, new Blob([body], { type: 'text/plain' }))) {
      removeSent(batch.length);
    }
    return;
  }

  sending = true;
  try {
    const res = await fetch(`${TRACK_URL}/event`, {
      method: 'POST', body, keepalive: true, headers: { 'content-type': 'text/plain' },
    });
    // 4xx other than rate limiting means the batch will never be accepted, so drop it.
    if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429)) removeSent(batch.length);
  } catch { /* offline or blocked: try again later */ } finally {
    sending = false;
  }
  if (load(QUEUE_KEY, []).length) timer = setTimeout(flush, DELAY_MS * 10);
}

function removeSent(count) {
  save(QUEUE_KEY, load(QUEUE_KEY, []).slice(count));
}

/** Call once at start-up. */
export function startAnalytics() {
  if (!enabled) return;
  window.addEventListener('online', () => flush());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true);
  });
  const installed = window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone === true;
  track('app_open', { data: { installed: Boolean(installed) } });
}
