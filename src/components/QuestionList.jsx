export function statusOf(entry) {
  if (entry?.status === 'passed') return { label: 'Passed', cls: 'passed' };
  if (entry?.attempts) return { label: 'Attempted', cls: 'attempted' };
  if (entry?.code !== undefined) return { label: 'Started', cls: 'started' };
  return { label: 'Not started', cls: 'new' };
}

export default function QuestionList({ bank, progress, chapter, setChapter, onOpen }) {
  const chapters = bank.chapters || {};
  const used = [...new Set(bank.questions.flatMap((q) => q.chapters || []))].sort((a, b) => a - b);
  const shown = bank.questions
    .map((q, i) => ({ q, n: i + 1 }))
    .filter(({ q }) => chapter === 'all' || (q.chapters || []).map(String).includes(String(chapter)));

  return (
    <section>
      <div className="list-head">
        <div>
          <h1>{bank.title || 'Practice questions'}</h1>
          {bank.book && <p className="muted">Based on {bank.book}. Closed book — no notes, no internet.</p>}
        </div>
        <label className="filter">
          Chapter
          <select value={chapter} onChange={(e) => setChapter(e.target.value)}>
            <option value="all">All chapters</option>
            {used.map((c) => (
              <option key={c} value={c}>Ch {c}{chapters[c] ? ` – ${chapters[c]}` : ''}</option>
            ))}
          </select>
        </label>
      </div>

      <ol className="cards">
        {shown.map(({ q, n }) => {
          const entry = progress[q.id];
          const st = statusOf(entry);
          return (
            <li key={q.id}>
              <button className="card" onClick={() => onOpen(q.id)}>
                <span className="num">{n}</span>
                <span className="card-body">
                  <span className="card-title">{q.title}</span>
                  <span className="chips">
                    {(q.chapters || []).map((c) => <span key={c} className="chip" title={chapters[c]}>Ch {c}</span>)}
                    {q.difficulty && <span className={`chip diff-${q.difficulty}`}>{q.difficulty}</span>}
                    {q.useJQuery && <span className="chip">jQuery</span>}
                    {entry?.confidence === 'review' && <span className="chip review">Review</span>}
                    {entry?.solutionViewed && <span className="chip muted-chip">Solution viewed</span>}
                  </span>
                </span>
                <span className={`status ${st.cls}`}>{st.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {shown.length === 0 && <p className="muted">No questions for this chapter.</p>}
    </section>
  );
}
