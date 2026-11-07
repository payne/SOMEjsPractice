import { useState } from 'react';
import { APP_VERSION, GITHUB_URL } from '../config.js';
import { usageBytes, wipeAll } from '../storage.js';

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

export default function About({ bankState, settings, updateSettings, questionCount }) {
  const [url, setUrl] = useState(settings.questionsUrl);
  const { bank, fetchedAt, source, status, error, refresh } = bankState;
  const kb = (usageBytes() / 1024).toFixed(1);

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

      <h2>Question bank</h2>
      <dl className="facts">
        <dt>Title</dt><dd>{bank?.title ?? '—'}</dd>
        <dt>Questions</dt><dd>{questionCount}{bank?.version != null && ` (bank version ${bank.version})`}</dd>
        <dt>Downloaded from</dt><dd><code>{source ?? '—'}</code></dd>
        <dt>Last downloaded</dt><dd>{fetchedAt ? new Date(fetchedAt).toLocaleString() : '—'}</dd>
      </dl>
      <form className="row" onSubmit={(e) => { e.preventDefault(); updateSettings({ questionsUrl: url.trim() }); }}>
        <label className="grow">Questions JSON URL
          <input value={url} onChange={(e) => setUrl(e.target.value)} spellCheck={false} />
        </label>
        <button type="submit" disabled={url.trim() === settings.questionsUrl}>Use this URL</button>
        <button type="button" onClick={refresh} disabled={status === 'loading'}>
          {status === 'loading' ? 'Downloading…' : 'Download again'}
        </button>
      </form>
      {status === 'error' && <p className="bad">Download failed: {error}. Using the saved copy.</p>}

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
        Your code, check results, hints used, settings and a copy of the questions are saved in this
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
