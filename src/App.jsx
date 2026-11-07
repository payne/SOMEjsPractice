import { useCallback, useEffect, useMemo } from 'react';
import { usePersistentState } from './storage.js';
import { useQuestionBank, useQuestionSets } from './useQuestionBank.js';
import QuestionList from './components/QuestionList.jsx';
import QuestionView from './components/QuestionView.jsx';
import About from './components/About.jsx';

const DEFAULT_SETTINGS = {
  setId: 'core',
  customSets: [],
  theme: 'auto',
  examMode: false,
  fontSize: 15,
};

export default function App() {
  const [storedSettings, setSettings] = usePersistentState('settings', DEFAULT_SETTINGS);
  const settings = { ...DEFAULT_SETTINGS, ...storedSettings };
  const setsState = useQuestionSets(settings.customSets);
  const currentSet = setsState.sets.find((s) => s.id === settings.setId) || setsState.sets[0];

  useEffect(() => {
    if (settings.theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const updateSettings = useCallback(
    (change) => setSettings((s) => ({ ...DEFAULT_SETTINGS, ...s, ...change })),
    [setSettings]
  );

  // Keyed by set id so each set loads its own bank, progress and position.
  return (
    <Workspace
      key={currentSet.id}
      set={currentSet}
      setsState={setsState}
      settings={settings}
      updateSettings={updateSettings}
    />
  );
}

function Workspace({ set, setsState, settings, updateSettings }) {
  const [ui, setUi] = usePersistentState(`ui.${set.id}`, { view: 'list', currentId: null, chapter: 'all' });
  const [progress, setProgress] = usePersistentState(`progress.${set.id}`, {});
  const bankState = useQuestionBank(set);
  const { bank } = bankState;

  const questions = useMemo(() => bank?.questions ?? [], [bank]);
  const index = questions.findIndex((q) => q.id === ui.currentId);
  const current = index >= 0 ? questions[index] : null;

  const go = (view, currentId = ui.currentId) => {
    setUi((u) => ({ ...u, view, currentId }));
    window.scrollTo(0, 0);
  };

  const updateProgress = useCallback((id, change) => {
    setProgress((p) => {
      const before = p[id] || {};
      const after = typeof change === 'function' ? change(before) : { ...before, ...change };
      return { ...p, [id]: after };
    });
  }, [setProgress]);

  const chooseSet = (setId) => updateSettings({ setId });
  const passed = questions.filter((q) => progress[q.id]?.status === 'passed').length;
  const view = ui.view === 'question' && !current ? 'list' : ui.view;

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
