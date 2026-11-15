// Each screen has its own URL in the hash, so questions can be linked to:
//   #/about                     About page
//   #/<setId>                   question list of a set
//   #/<setId>/<questionId>      one question
// The hash works on GitHub Pages (no server routing needed) and offline.

function decode(part) {
  try { return decodeURIComponent(part); } catch { return part; }
}

/** Returns { view, setId?, questionId? }, or null for an empty hash. */
export function parseHash(hash) {
  const parts = (hash || '').replace(/^#\/?/, '').split('/').filter(Boolean).map(decode);
  if (parts.length === 0) return null;
  if (parts[0] === 'about') return { view: 'about' };
  if (parts.length === 1) return { view: 'list', setId: parts[0] };
  return { view: 'question', setId: parts[0], questionId: parts[1] };
}

export function buildHash(route) {
  if (route.view === 'about') return '#/about';
  const set = encodeURIComponent(route.setId);
  if (route.view === 'question') return `#/${set}/${encodeURIComponent(route.questionId)}`;
  return `#/${set}`;
}
