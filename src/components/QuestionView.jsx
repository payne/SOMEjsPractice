import { useEffect, useRef, useState } from 'react';
import Prompt from './Prompt.jsx';
import CodeEditor from './CodeEditor.jsx';
import Sandbox from './Sandbox.jsx';
import { buildQuestionZip, downloadBlob, readAnswerFile } from '../offlinePackage.js';

const CHECK_TIMEOUT_MS = 15000;

export default function QuestionView({
  question, set, number, total, chapters, entry, update, settings, onPrev, onNext, onBack,
}) {
  const starter = question.starterCode ?? '';
  const code = entry.code ?? starter;
  const [run, setRun] = useState({ mode: 'preview', code: '', nonce: 0 });
  const [consoleLines, setConsoleLines] = useState([]);
  const [results, setResults] = useState(entry.lastResults ?? null);
  const [timedOut, setTimedOut] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const start = (mode) => {
    clearTimeout(timer.current);
    setConsoleLines([]);
    setTimedOut(false);
    if (mode === 'check') {
      setResults(null);
      setChecking(true);
      timer.current = setTimeout(() => { setChecking(false); setTimedOut(true); }, CHECK_TIMEOUT_MS);
    }
    setRun((r) => ({ mode, code, nonce: r.nonce + 1 }));
  };

  const onMessage = (msg, fromRun) => {
    if (msg.type === 'console') {
      setConsoleLines((lines) => [...lines, { level: msg.level, text: msg.text }]);
    } else if (msg.type === 'results') {
      clearTimeout(timer.current);
      setChecking(false);
      setResults(msg.results);
      const allPassed = msg.results.length > 0 && msg.results.every((r) => r.pass);
      update((prev) => ({
        ...prev,
        code: fromRun.code,
        attempts: (prev.attempts || 0) + 1,
        status: allPassed ? 'passed' : 'failed',
        everPassed: prev.everPassed || allPassed,
        lastChecked: new Date().toISOString(),
        lastResults: msg.results,
      }));
    }
  };

  const fileInput = useRef(null);
  const [fileNotice, setFileNotice] = useState(null);

  const downloadFiles = () => {
    const { fileName, blob } = buildQuestionZip({
      set, question, number, code, chapters,
      includeHelp: !settings.examMode,
      appUrl: window.location.origin + window.location.pathname,
    });
    downloadBlob(blob, fileName);
    setFileNotice({ ok: true, text: `Downloaded ${fileName}. Unzip it and open index.html.` });
  };

  const loadAnswer = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const loaded = await readAnswerFile(file);
      const hasOwnCode = code.trim() !== '' && code !== starter && code !== loaded;
      if (hasOwnCode && !window.confirm(`Replace the code in the editor with the code from ${file.name}?`)) return;
      update({ code: loaded });
      setFileNotice({ ok: true, text: `Loaded your answer from ${file.name}. Press Check answer to test it.` });
    } catch (err) {
      setFileNotice({ ok: false, text: `Couldn't load ${file.name}: ${err.message}.` });
    }
  };

  const resetCode = () => {
    if (window.confirm('Replace your code with the original starter code?')) {
      update({ code: starter });
    }
  };

  const hintsShown = entry.hintsShown || 0;
  const hints = question.hints || [];
  const passCount = results ? results.filter((r) => r.pass).length : 0;

  return (
    <article className="question">
      <div className="qnav">
        <button onClick={onBack}>← All questions</button>
        <span className="muted">Question {number} of {total}</span>
        <span className="spacer" />
        <button onClick={onPrev} disabled={!onPrev}>‹ Prev</button>
        <button onClick={onNext} disabled={!onNext}>Next ›</button>
      </div>

      <h1>{question.title}</h1>
      <div className="chips">
        {(question.chapters || []).map((c) => (
          <span key={c} className="chip">Ch {c}{chapters[c] ? ` · ${chapters[c]}` : ''}</span>
        ))}
        {question.difficulty && <span className={`chip diff-${question.difficulty}`}>{question.difficulty}</span>}
        {question.useJQuery && <span className="chip">jQuery 3 loaded</span>}
      </div>

      <div className="qgrid">
        <div className="col">
          <Prompt text={question.prompt} />

          {question.setup?.html && (
            <details open className="setup">
              <summary>Page HTML</summary>
              <pre className="codeblock"><code>{question.setup.html}</code></pre>
            </details>
          )}
          {question.setup?.css && (
            <details className="setup">
              <summary>Page CSS</summary>
              <pre className="codeblock"><code>{question.setup.css}</code></pre>
            </details>
          )}

          {!settings.examMode && (
            <section className="help">
              {hints.slice(0, hintsShown).map((h, i) => (
                <p key={i} className="hint"><strong>Hint {i + 1}:</strong> {h}</p>
              ))}
              <div className="row">
                {hintsShown < hints.length && (
                  <button onClick={() => update({ hintsShown: hintsShown + 1 })}>
                    Show hint ({hintsShown + 1} of {hints.length})
                  </button>
                )}
                {question.solution && !showSolution && (
                  <button onClick={() => {
                    if (entry.solutionViewed || window.confirm('Show the model solution? Try the question first!')) {
                      setShowSolution(true);
                      update({ solutionViewed: true });
                    }
                  }}>Show solution</button>
                )}
                {showSolution && <button onClick={() => setShowSolution(false)}>Hide solution</button>}
              </div>
              {showSolution && (
                <pre className="codeblock solution"><code>{question.solution}</code></pre>
              )}
            </section>
          )}

          <section className="selfmark">
            <span className="muted">How did it go?</span>
            <button className={entry.confidence === 'know' ? 'on' : ''}
              onClick={() => update({ confidence: entry.confidence === 'know' ? null : 'know' })}>I've got this</button>
            <button className={entry.confidence === 'review' ? 'on review' : ''}
              onClick={() => update({ confidence: entry.confidence === 'review' ? null : 'review' })}>Needs review</button>
          </section>
        </div>

        <div className="col">
          <div className="toolbar">
            <strong>Your code</strong>
            <span className="spacer" />
            <button onClick={() => start('run')}>Run</button>
            <button className="primary" onClick={() => start('check')} disabled={checking}
              title="Ctrl+Enter">{checking ? 'Checking…' : 'Check answer'}</button>
            <button onClick={resetCode} title="Restore the starter code">Reset</button>
          </div>
          <CodeEditor
            value={code}
            onChange={(value) => update({ code: value })}
            onSubmit={() => start('check')}
            fontSize={settings.fontSize}
          />

          <div className="offline-row">
            <button onClick={downloadFiles}
              title="A zip with index.html, styles.css and main.js to edit in VS Code, Notepad or vi">
              Download as files (.zip)
            </button>
            <button onClick={() => fileInput.current?.click()}
              title="Load main.js, or a zip of a downloaded question folder, into the editor">
              Load answer from file…
            </button>
            <input ref={fileInput} type="file" hidden accept=".js,.zip,text/javascript,application/zip"
              onChange={loadAnswer} aria-label="Answer file" />
            {fileNotice && <span className={fileNotice.ok ? 'muted small' : 'bad small'}>{fileNotice.text}</span>}
          </div>

          <div className={question.setup ? 'panel' : 'panel hidden-frame'}>
            <div className="panel-title">Page</div>
            <Sandbox question={question} run={run} onMessage={onMessage} />
          </div>

          <div className="panel">
            <div className="panel-title">Console</div>
            <pre className="console">
              {consoleLines.length === 0
                ? <span className="muted">{run.mode === 'preview' ? 'Run your code to see console output.' : '(no output)'}</span>
                : consoleLines.map((l, i) => <div key={i} className={`log-${l.level}`}>{l.text}</div>)}
            </pre>
          </div>

          {(results || timedOut) && (
            <div className="panel">
              <div className="panel-title">
                Checks {results && <span className={passCount === results.length ? 'ok' : 'bad'}>
                  {passCount} of {results.length} passed</span>}
              </div>
              {timedOut && (
                <p className="bad">No result after {CHECK_TIMEOUT_MS / 1000} seconds. Look for an infinite loop
                  or an error that stops your code.</p>
              )}
              {results && (
                <ul className="results">
                  {results.map((r, i) => (
                    <li key={i} className={r.pass ? 'ok' : 'bad'}>
                      <span aria-hidden="true">{r.pass ? '✓' : '✗'}</span> {r.name}
                      {r.error && <span className="muted"> — {r.error}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
