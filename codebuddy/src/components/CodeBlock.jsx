import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

// Custom theme matching Obsidian palette
const obsidianTheme = {
  'pre[class*="language-"]': {
    background: "#0D0B1F",
    margin: 0,
    padding: "14px 18px",
    fontSize: "13px",
    lineHeight: "1.65",
    fontFamily: '"JetBrains Mono", monospace',
    overflowX: "auto",
  },
  'code[class*="language-"]': {
    background: "none",
    fontFamily: '"JetBrains Mono", monospace',
  },
  keyword:     { color: "#A99BFA" },
  builtin:     { color: "#A99BFA" },
  "class-name":{ color: "#F0EDFF" },
  function:    { color: "#7DD3FC" },
  string:      { color: "#86EFAC" },
  "template-string": { color: "#86EFAC" },
  comment:     { color: "#5C578A", fontStyle: "italic" },
  number:      { color: "#F9BC5B" },
  boolean:     { color: "#F9BC5B" },
  operator:    { color: "#C4B5FD" },
  punctuation: { color: "#9893C4" },
  property:    { color: "#7DD3FC" },
  tag:         { color: "#A99BFA" },
  "attr-name": { color: "#86EFAC" },
  "attr-value":{ color: "#F9BC5B" },
  selector:    { color: "#A99BFA" },
};

export function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const displayLang = language && language !== "text" ? language : "code";

  return (
    <div className="code-block-shell">
      <div className="code-block-bar">
        <span className="code-lang-badge">{displayLang}</span>
        <button className={`copy-btn${copied ? " copied" : ""}`} onClick={handleCopy}>
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <div className="scroll-ob" style={{ overflowX: "auto" }}>
        <SyntaxHighlighter
          language={language || "text"}
          style={obsidianTheme}
          customStyle={{ margin: 0 }}
          codeTagProps={{ style: { fontFamily: '"JetBrains Mono", monospace' } }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
