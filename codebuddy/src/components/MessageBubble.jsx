import { useState } from "react";
import { CodeBlock } from "./CodeBlock";

const COLLAPSE_THRESHOLD = 400; // chars before showing expand toggle

// Parse text into text/code parts
function parseContent(text) {
  const parts = [];
  const fenceRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = fenceRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    parts.push({
      type: "code",
      language: match[1] || "text",
      content: match[2].trimEnd(),
    });
    lastIndex = fenceRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: "text", content: text }];
}

// Render inline code and simple bold
function renderInlineText(text) {
  const segments = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0;
  let m;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) {
      segments.push(<span key={last}>{text.slice(last, m.index)}</span>);
    }
    if (m[0].startsWith("`")) {
      segments.push(
        <code key={m.index} style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12.5px",
          background: "rgba(139, 124, 248, 0.12)",
          border: "1px solid rgba(139, 124, 248, 0.18)",
          borderRadius: 4,
          padding: "1px 5px",
          color: "#A99BFA",
        }}>
          {m[0].slice(1, -1)}
        </code>
      );
    } else {
      segments.push(<strong key={m.index}>{m[0].slice(2, -2)}</strong>);
    }
    last = m.index + m[0].length;
  }

  if (last < text.length) {
    segments.push(<span key={last}>{text.slice(last)}</span>);
  }

  return segments.length > 0 ? segments : text;
}

function TextPart({ content }) {
  const lines = content.split("\n");
  return (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {lines.map((line, i) => (
        <span key={i}>
          {renderInlineText(line)}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </div>
  );
}

export function MessageBubble({ message, onRetry }) {
  const isUser = message.sender === "user";
  const parts = parseContent(message.text);

  // Calculate text-only char count for collapse decision
  const textCharCount = parts
    .filter(p => p.type === "text")
    .reduce((sum, p) => sum + p.content.length, 0);

  const isLong = !isUser && textCharCount > COLLAPSE_THRESHOLD;
  const [expanded, setExpanded] = useState(false);

  if (isUser) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div className="bubble-user">{message.text}</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div className={`bubble-ai${message.isError ? " is-error" : ""}`}>
        <div style={{
          overflow: "hidden",
          maxHeight: isLong && !expanded ? "220px" : "none",
          position: "relative",
        }}>
          {parts.map((part, i) =>
            part.type === "code" ? (
              <CodeBlock key={i} language={part.language} code={part.content} />
            ) : (
              <TextPart key={i} content={part.content} />
            )
          )}

          {/* Fade gradient when collapsed */}
          {isLong && !expanded && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: 60,
              background: "linear-gradient(to bottom, transparent, #060512)",
              pointerEvents: "none",
            }} />
          )}
        </div>

        {/* Expand / collapse toggle */}
        {isLong && (
          <button
            onClick={() => setExpanded(prev => !prev)}
            style={{
              marginTop: 8,
              fontFamily: "'Sora', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: "#9B7FFF",
              background: "none",
              padding: 0,
              letterSpacing: "0.02em",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#BDB4FF"}
            onMouseLeave={e => e.currentTarget.style.color = "#9B7FFF"}
          >
            {expanded ? "Show less ↑" : "Show more ↓"}
          </button>
        )}

        {/* Retry button for error messages */}
        {message.isError && onRetry && (
          <button
            onClick={onRetry}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: 10,
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: "#F87171",
              background: "rgba(248, 113, 113, 0.08)",
              border: "1px solid rgba(248, 113, 113, 0.2)",
              padding: "4px 10px",
              borderRadius: 6,
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(248, 113, 113, 0.15)";
              e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(248, 113, 113, 0.08)";
              e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.2)";
            }}
          >
            ↻ Retry
          </button>
        )}
      </div>
    </div>
  );
}
