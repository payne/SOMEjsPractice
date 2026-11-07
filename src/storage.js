// Everything the app remembers lives in localStorage under this prefix.
import { useEffect, useState } from 'react';

const PREFIX = 'jsPractice.';

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
    return false;
  }
}

/** Removes every key this origin has stored (local and session storage). */
export function wipeAll() {
  try { localStorage.clear(); } catch { /* ignore */ }
  try { sessionStorage.clear(); } catch { /* ignore */ }
}

/** Approximate bytes used in localStorage (strings are UTF-16). */
export function usageBytes() {
  let total = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      total += (k.length + (localStorage.getItem(k) || '').length) * 2;
    }
  } catch { /* ignore */ }
  return total;
}

/** useState that is loaded from and saved to localStorage. */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => load(key, initial));
  useEffect(() => { save(key, value); }, [key, value]);
  return [value, setValue];
}
