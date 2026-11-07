import { useEffect, useMemo, useRef } from 'react';
import { buildDocument } from '../harness.js';

// Runs the question page + student code inside a sandboxed iframe.
// A new `run` object (with a new nonce) reloads the frame.
export default function Sandbox({ question, run, onMessage }) {
  const frame = useRef(null);
  const handler = useRef(onMessage);
  handler.current = onMessage;

  const srcDoc = useMemo(() => buildDocument(question, run.code, run.mode), [question, run]);

  useEffect(() => {
    const listen = (e) => {
      if (!frame.current || e.source !== frame.current.contentWindow) return;
      if (e.data && e.data.__jsPractice) handler.current(e.data, run);
    };
    window.addEventListener('message', listen);
    return () => window.removeEventListener('message', listen);
  }, [run]);

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
