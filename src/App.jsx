import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { load, usePersistentState } from './storage.js';
import { useQuestionBank, useQuestionSets } from './useQuestionBank.js';
import QuestionList from './components/QuestionList.jsx';
import QuestionView from './components/QuestionView.jsx';
import About from './components/About.jsx';
import { track } from './analytics.js';
import { buildHash, parseHash } from './route.js';

const DEFAULT_SETTINGS = {
  setId: 'core',
  customSets: [],
  theme: 'auto',
  examMode: false,
  fontSize: 15,
};

/** Where to go when the URL has no hash: the last screen used in the current set. */
function resumeRoute(setId) {
  const ui = load(`ui.${setId}`, null);
  if (ui?.view === 'about') return { view: 'about' };
  if (ui?.view === 'question' && ui.currentId) return { view: 'question', setId, questionId: ui.currentId };
  return { view: 'list', setId };
}

export default function App() {
  const [storedSettings, setSettings] = usePersistentState('settings', DEFAULT_SETTINGS);
  const settings = { ...DEFAULT_SETTINGS, ...storedSettings };
  const setsState = useQuestionSets(settings.customSets);

  // The URL hash decides which screen is shown (see route.js).
  const [route, setRoute] = useState(() => parseHash(window.location.hash) ?? resumeRoute(settings.setId));
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const navigate = useCallback((next, { replace = false } = {}) => {
    const hash = buildHash(next);
    if (hash !== window.location.hash) {
      window.history[replace ? 'replaceState' : 'pushState'](null, '', hash);
    }
    setRoute(next);
  }, []);

  useEffect(() => {
    if (!window.location.hash) navigate(route, { replace: true });
    const onHashChange = () => setRoute(parseHash(window.location.hash) ?? resumeRoute(settingsRef.current.setId));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const wantedSetId = route.setId ?? settings.setId;
  const routeSet = setsState.sets.find((s) => s.id === wantedSetId);
  const currentSet = routeSet || setsState.sets.find((s) => s.id === settings.setId) || setsState.sets[0];
  const waitingForSets = !routeSet && !setsState.loaded;

  useEffect(() => {
    if (settings.theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const updateSettings = useCallback(
    (change) => setSettings((s) => ({ ...DEFAULT_SETTINGS, ...s, ...change })),
    [setSettings]
  );

  // Remember the set in the URL, or fix a URL that names a set that doesn't exist.
  useEffect(() => {
    if (waitingForSets) return;
    if (route.setId && route.setId !== currentSet.id) navigate({ view: 'list', setId: currentSet.id }, { replace: true });
    if (currentSet.id !== settings.setId) updateSettings({ setId: currentSet.id });
  }, [waitingForSets, route.setId, currentSet.id, settings.setId, navigate, updateSettings]);

  if (waitingForSets) return <p className="notice">Loading question sets…</p>;

  // Keyed by set id so each set loads its own bank, progress and position.
  return (
    <Workspace
      key={currentSet.id}
      set={currentSet}
      setsState={setsState}
      settings={settings}
      updateSettings={updateSettings}
      route={route}
      navigate={navigate}
    />
  );
}

function Workspace({ set, setsState, settings, updateSettings, route, navigate }) {
  const [ui, setUi] = usePersistentState(`ui.${set.id}`, { view: 'list', currentId: null, chapter: 'all' });
  const [progress, setProgress] = usePersistentState(`progress.${set.id}`, {});
  const bankState = useQuestionBank(set);
  const { bank } = bankState;

  const questions = useMemo(() => bank?.questions ?? [], [bank]);
  const currentId = route.view === 'question' ? route.questionId : null;
  const index = currentId ? questions.findIndex((q) => q.id === currentId) : -1;
  const current = index >= 0 ? questions[index] : null;

  // Remember the last screen, so opening the app without a URL hash resumes there.
  useEffect(() => {
    setUi((u) => ({ ...u, view: route.view, currentId: route.questionId ?? u.currentId }));
  }, [route.view, route.questionId, setUi]);

  const go = (view, questionId) => {
    if (view === 'about' && route.view !== 'about') track('about_view');
    if (view === 'about') navigate({ view: 'about' });
    else if (view === 'question') navigate({ view: 'question', setId: set.id, questionId });
    else navigate({ view: 'list', setId: set.id });
    window.scrollTo(0, 0);
  };

  const updateProgress = useCallback((id, change) => {
    setProgress((p) => {
      const before = p[id] || {};
      const after = typeof change === 'function' ? change(before) : { ...before, ...change };
      return { ...p, [id]: after };
    });
  }, [setProgress]);

  const chooseSet = (setId) => {
    track('set_changed', { setId, data: { from: set.id } });
    updateSettings({ setId });
    // On the About page stay there; otherwise go to where you left off in that set.
    if (route.view !== 'about') {
      const next = resumeRoute(setId);
      navigate(next.view === 'about' ? { view: 'list', setId } : next);
    }
  };
  const passed = questions.filter((q) => progress[q.id]?.status === 'passed').length;
  const view = route.view === 'question' && !current ? 'list' : route.view;

  // A link to a question that isn't in this set (any more) shows the list instead.
  useEffect(() => {
    if (route.view === 'question' && bank && !current) navigate({ view: 'list', setId: set.id }, { replace: true });
  }, [route.view, bank, current, set.id, navigate]);

  useEffect(() => {
    document.title = view === 'question' && current ? `${current.title} · JS Practice Exam` : 'JS Practice Exam';
  }, [view, current]);

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => go('list')} aria-label="Question list">
          <img src="./icons/icon.svg" alt="" width="28" height="28" />
          <span>JS Practice Exam</span>
        </button>
        <nav className="menu">
          <button className={view !== 'about' ? 'active' : ''} onClick={() => go('list')}>Questions</button>
          <button className={view === 'about' ? 'active' : ''} onClick={() => go('about')}>About</button>
        </nav>
        {questions.length > 0 && (
          <div className="score" title={`Questions passed in ${set.title}`}>{passed}/{questions.length}</div>
        )}
      </header>

      <main className="content">
        {!bank && bankState.status === 'loading' && <p className="notice">Loading questions…</p>}
        {!bank && bankState.status === 'error' && view !== 'about' && (
          <div className="notice error">
            <p>Couldn't load the question set “{set.title}” from <code>{set.url}</code>: {bankState.error}</p>
            <div className="row">
              <button onClick={bankState.refresh}>Try again</button>
              {setsState.sets.filter((s) => s.id !== set.id).map((s) => (
                <button key={s.id} onClick={() => chooseSet(s.id)}>Switch to {s.title}</button>
              ))}
            </div>
          </div>
        )}

        {view === 'about' && (
          <About
            set={set}
            sets={setsState.sets}
            chooseSet={chooseSet}
            bankState={bankState}
            settings={settings}
            updateSettings={updateSettings}
            questionCount={questions.length}
          />
        )}

        {view === 'list' && bank && (
          <QuestionList
            bank={bank}
            set={set}
            sets={setsState.sets}
            chooseSet={chooseSet}
            progress={progress}
            chapter={ui.chapter}
            setChapter={(chapter) => setUi((u) => ({ ...u, chapter }))}
            onOpen={(id) => go('question', id)}
          />
        )}

        {view === 'question' && current && (
          <QuestionView
            key={current.id}
            question={current}
            set={set}
            number={index + 1}
            total={questions.length}
            chapters={bank.chapters || {}}
            entry={progress[current.id] || {}}
            update={(change) => updateProgress(current.id, change)}
            settings={settings}
            onPrev={index > 0 ? () => go('question', questions[index - 1].id) : null}
            onNext={index < questions.length - 1 ? () => go('question', questions[index + 1].id) : null}
            onBack={() => go('list')}
          />
        )}
      </main>
    </div>
  );
}
