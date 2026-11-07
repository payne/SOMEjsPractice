// Renders the small subset of Markdown used in question prompts:
// paragraphs, ``` code blocks, - and 1. lists, **bold** and `code`.
function inline(text, keyBase) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={key}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={key}>{part.slice(2, -2)}</strong>;
    return part;
  });
}

export default function Prompt({ text }) {
  const blocks = [];
  const lines = text.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const body = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) body.push(lines[i++]);
      i++;
      blocks.push(<pre key={blocks.length} className="codeblock"><code>{body.join('\n')}</code></pre>);
    } else if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s/, ''));
        i++;
      }
      const List = ordered ? 'ol' : 'ul';
      blocks.push(<List key={blocks.length}>{items.map((it, j) => <li key={j}>{inline(it, j)}</li>)}</List>);
    } else if (line.trim() === '') {
      i++;
    } else {
      const para = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('```') && !/^\s*([-*]|\d+\.)\s/.test(lines[i])) {
        para.push(lines[i++]);
      }
      blocks.push(<p key={blocks.length}>{inline(para.join(' '), blocks.length)}</p>);
    }
  }
  return <div className="prompt">{blocks}</div>;
}
