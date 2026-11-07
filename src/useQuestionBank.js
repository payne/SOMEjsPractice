import { useCallback, useEffect, useState } from 'react';
import { usePersistentState } from './storage.js';
import { QUESTION_SETS_URL } from './config.js';

export function validateBank(data) {
  if (!data || !Array.isArray(data.questions)) throw new Error('JSON has no "questions" array');
  data.questions.forEach((q, i) => {
    if (!q.id || !q.title || !q.prompt) throw new Error(`Question ${i + 1} needs id, title and prompt`);
  });
  return data;
}

async function getJson(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  try {
    return await res.json();
  } catch {
    throw new Error('the file is not valid JSON');
  }
}

// Used if the list of sets has never been downloaded.
const FALLBACK_SETS = [{ id: 'core', title: 'Core Practice', url: 'questions.json' }];

/**
 * Downloads the list of question sets (question-sets.json), keeps the last good
 * copy in localStorage, and adds any sets the user added by URL.
 */
export function useQuestionSets(customSets = []) {
  const [cached, setCached] = usePersistentState('sets', null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const data = await getJson(QUESTION_SETS_URL);
      if (!Array.isArray(data.sets)) throw new Error('JSON has no "sets" array');
      setCached(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [setCached]);

  useEffect(() => { refresh(); }, [refresh]);

  const builtIn = cached?.sets?.length ? cached.sets : FALLBACK_SETS;
  return { sets: [...builtIn, ...customSets.map((s) => ({ ...s, custom: true }))], error, refresh };
}

/**
 * Downloads one question set and keeps the last good copy in localStorage,
 * so the app keeps working offline or if the download fails.
 */
export function useQuestionBank(set) {
  const [cached, setCached] = usePersistentState(`bank.${set.id}`, null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = validateBank(await getJson(set.url));
      setCached({ data, fetchedAt: new Date().toISOString(), source: set.url });
      setStatus('ok');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  }, [set.url, setCached]);

  useEffect(() => { refresh(); }, [refresh]);

  return {
    bank: cached?.data ?? null,
    fetchedAt: cached?.fetchedAt ?? null,
    source: cached?.source ?? null,
    status,
    error,
    refresh,
  };
}

/** Downloads and checks a question set at `url` before the user adds it. */
export async function inspectSetUrl(url) {
  return validateBank(await getJson(url));
}
