import { useCallback, useEffect, useState } from 'react';
import { usePersistentState } from './storage.js';

function validate(data) {
  if (!data || !Array.isArray(data.questions)) throw new Error('JSON has no "questions" array');
  data.questions.forEach((q, i) => {
    if (!q.id || !q.title || !q.prompt) throw new Error(`Question ${i + 1} needs id, title and prompt`);
  });
  return data;
}

/**
 * Downloads the question bank and keeps the last good copy in localStorage,
 * so the app keeps working offline or if the download fails.
 */
export function useQuestionBank(url) {
  const [cached, setCached] = usePersistentState('bank', null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const data = validate(await res.json());
      setCached({ data, fetchedAt: new Date().toISOString(), source: url });
      setStatus('ok');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  }, [url]);

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
