import { useState } from 'react';
import { APP_VERSION, GITHUB_URL } from '../config.js';
import { forgetSet, usageBytes, wipeAll } from '../storage.js';
import { inspectSetUrl } from '../useQuestionBank.js';

async function reloadApp() {
  if (!navigator.onLine && !window.confirm(
    'You appear to be offline. Reloading clears the cached app files, so it may not load again until you are online. Continue?'
  )) return;
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    if (window.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } finally {
    window.location.reload();
  }
}

function resetData() {
  if (window.confirm('Delete ALL your saved answers, progress, settings and the downloaded questions? This cannot be undone.')) {
    wipeAll();
    window.location.reload();
  }
}

export default function About({ set, sets, chooseSet, bankState, settings, updateSettings, questionCount }) {
  const [url, setUrl] = useState('');
  const [adding, setAdding] = useState({ busy: false, error: null });
  const { bank, fetchedAt, source, status, error, refresh } = bankState;
  const kb = (usageBytes() / 1024).toFixed(1);

  const addSet = async (e) => {
    e.preventDefault();
    const target = url.trim();
    if (!target) return;
    setAdding({ busy: true, error: null });
    try {
      const data = await inspectSetUrl(target);
      if (sets.some((s) => s.url === target)) throw new Error('That set is already in the list');
      const id = 'custom-' + Date.now().toString(36);
      const added = {
        id,
        title: data.title || target,
        description: `${data.questions.length} questions added from a URL.`,
        url: target,
      };
      updateSettings({ customSets: [...settings.customSets, added], setId: id });
      setUrl('');
      setAdding({ busy: false, error: null });
    } catch (err) {
      setAdding({ busy: false, error: err.message });
    }
  };

  const removeSet = (s) => {
    if (!window.confirm(`Remove “${s.title}” and your progress in it?`)) return;
    forgetSet(s.id);
    updateSettings({
      customSets: settings.customSets.filter((c) => c.id !== s.id),
      setId: s.id === set.id ? sets[0].id : set.id,
    });
  };

  return (
    <section className="about">
      <h1>About</h1>
      <p>
        Closed-book practice for <em>Murach's JavaScript and jQuery</em>. Each question asks you to write
        code from memory — a loop, a function, a line that changes the page — and then checks it
        automatically in a sandbox. Works offline once loaded.
      </p>

      <dl className="facts">
        <dt>GitHub</dt>
        <dd><a href={GITHUB_URL} target="_blank" rel="noreferrer">{GITHUB_URL}</a></dd>
        <dt>App version</dt>
        <dd>{APP_VERSION}</dd>
      </dl>

      <h2>Question sets</h2>
      <p className="muted">Each set keeps its own answers and progress.</p>
      <ul className="set-list">
        {sets.map((s) => (
          <li key={s.id} className={s.id === set.id ? 'set-item current' : 'set-item'}>
            <div>
              <strong>{s.title}</strong>{s.id === set.id && <span className="muted"> — current</span>}
              {s.description && <p className="muted">{s.description}</p>}
              <p className="muted small"><code>{s.url}</code></p>
            </div>
            <div className="actions">
              {s.id !== set.id && <button onClick={() => chooseSet(s.id)}>Use this set</button>}
              {s.custom && <button onClick={() => removeSet(s)}>Remove</button>}
            </div>
          </li>
        ))}
      </ul>

      <h2>Current set: {set.title}</h2>
      <dl className="facts">
        <dt>Questions</dt><dd>{questionCount}{bank?.version != null && ` (version ${bank.version})`}</dd>
        <dt>Downloaded from</dt><dd><code>{source ?? set.url}</code></dd>
        <dt>Last downloaded</dt><dd>{fetchedAt ? new Date(fetchedAt).toLocaleString() : '—'}</dd>
      </dl>
      <div className="row" style={{ marginTop: '.75rem' }}>
        <button type="button" onClick={refresh} disabled={status === 'loading'}>
          {status === 'loading' ? 'Downloading…' : 'Download again'}
        </button>
      </div>
      {status === 'error' && (
        <p className="bad">Download failed: {error}.{bank ? ' Using the saved copy.' : ''}</p>
      )}

      <h2>Add a question set</h2>
      <form className="row" onSubmit={addSet}>
        <label className="grow">URL of a question set JSON file
          <input value={url} onChange={(e) => setUrl(e.target.value)} spellCheck={false}
            placeholder="https://example.com/my-questions.json" />
        </label>
        <button type="submit" disabled={adding.busy || !url.trim()}>
          {adding.busy ? 'Checking…' : 'Add set'}
        </button>
      </form>
      {adding.error && <p className="bad">Couldn't add that set: {adding.error}</p>}

      <h2>Settings</h2>
      <div className="settings">
        <label>Theme
          <select value={settings.theme} onChange={(e) => updateSettings({ theme: e.target.value })}>
            <option value="auto">Match system</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label>Editor font size
          <select value={settings.fontSize} onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}>
            {[13, 14, 15, 16, 18, 20, 22].map((n) => <option key={n} value={n}>{n}px</option>)}
          </select>
        </label>
        <label className="check">
          <input type="checkbox" checked={settings.examMode}
            onChange={(e) => updateSettings({ examMode: e.target.checked })} />
          Exam mode (hide hints and solutions)
        </label>
      </div>

      <h2>Storage</h2>
      <p>
        Your code, check results, hints used, settings and a copy of each question set are saved in this
        browser's local storage (about {kb} KB). Nothing is sent anywhere.
      </p>
      <div className="danger-zone">
        <div>
          <button onClick={reloadApp}>Reload app</button>
          <p className="muted">Clears the cached app files and downloads the latest version. Your progress is kept.</p>
        </div>
        <div>
          <button className="danger" onClick={resetData}>Reset all data</button>
          <p className="muted">Permanently deletes everything this app saved in local storage.</p>
        </div>
      </div>

      <p className="muted small">
        Independent study aid. Not affiliated with or endorsed by Mike Murach &amp; Associates.
      </p>
    </section>
  );
}
