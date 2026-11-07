import { useEffect, useMemo, useRef, useState } from 'react';
import { buildDocument, needsPreparing, prepareQuestion } from '../harness.js';

// Runs the question page + student code inside a sandboxed iframe.
// A new `run` object (with a new nonce) reloads the frame.
export default function Sandbox({ question, run, onMessage }) {
  const frame = useRef(null);
  const handler = useRef(onMessage);
  handler.current = onMessage;

  const [ready, setReady] = useState(() => !needsPreparing(question));
  useEffect(() => {
    if (ready) return;
    let live = true;
    prepareQuestion(question).then(() => { if (live) setReady(true); });
    return () => { live = false; };
  }, [question, ready]);

  const srcDoc = useMemo(() => (ready ? buildDocument(question, run.code, run.mode) : ''), [question, run, ready]);

  useEffect(() => {
    const listen = (e) => {
      if (!frame.current || e.source !== frame.current.contentWindow) return;
      if (e.data && e.data.__jsPractice) handler.current(e.data, run);
    };
    window.addEventListener('message', listen);
    return () => window.removeEventListener('message', listen);
  }, [run]);

  if (!ready) return <p className="muted" style={{ padding: '.5em .8em' }}>Loading jQuery UI…</p>;
  return (
    <iframe
      key={run.nonce}
      ref={frame}
      className="sandbox"
      title="Result"
      sandbox="allow-scripts"
      srcDoc={srcDoc}
    />
  );
}
