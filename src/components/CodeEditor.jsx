import { useRef } from 'react';

// Plain textarea editor on purpose: no autocomplete or hints, like a closed-book exam.
// Tab indents, Enter keeps the current indentation, Ctrl/Cmd+Enter checks the answer.
function insert(el, text) {
  el.focus();
  // execCommand keeps the browser's undo history working.
  if (!document.execCommand?.('insertText', false, text)) {
    el.setRangeText(text, el.selectionStart, el.selectionEnd, 'end');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

export default function CodeEditor({ value, onChange, onSubmit, fontSize = 15, readOnly = false }) {
  const gutter = useRef(null);
  const lineCount = Math.max(value.split('\n').length, 8);

  const onKeyDown = (e) => {
    const el = e.target;
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit?.();
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      insert(el, '  ');
    } else if (e.key === 'Enter' && !e.shiftKey) {
      const before = el.value.slice(0, el.selectionStart);
      const lineStart = before.lastIndexOf('\n') + 1;
      const indent = before.slice(lineStart).match(/^\s*/)[0];
      const extra = /[{([]\s*$/.test(before) ? '  ' : '';
      e.preventDefault();
      insert(el, '\n' + indent + extra);
    }
  };

  return (
    <div className="editor" style={{ fontSize }}>
      <pre className="gutter" ref={gutter} aria-hidden="true">
        {Array.from({ length: lineCount }, (_, i) => i + 1).join('\n')}
      </pre>
      <textarea
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={readOnly ? undefined : onKeyDown}
        onScroll={(e) => { if (gutter.current) gutter.current.scrollTop = e.target.scrollTop; }}
        rows={lineCount}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        wrap="off"
        aria-label="Your JavaScript code"
      />
    </div>
  );
}
