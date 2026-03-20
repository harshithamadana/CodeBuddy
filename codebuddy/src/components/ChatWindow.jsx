import { useState, useRef, useEffect, useCallback } from "react";
import { MessageBubble } from "./MessageBubble";
import { SubjectSelector } from "./SubjectSelector";
import { ModeBadge } from "./ModeBadge";

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

const SUBJECT_SUGGESTIONS = {
  python:       ["Why do we even need functions?", "What's the difference between a list and a tuple?", "How does a for loop actually work?"],
  javascript:   ["What is the DOM and why does it matter?", "Why does `this` behave so weirdly?", "What's a callback function?"],
  "html-css":   ["How do I center something vertically?", "What does `display: flex` actually do?", "Why isn't my CSS rule applying?"],
  "cs-concepts":["What actually is recursion — like really?", "Stack vs queue: what's the difference?", "Why do we care about Big O notation?"],
  debugging:    ["My code crashes but I have no idea why", "How do I read a stack trace?", "Why is my variable showing as undefined?"],
};

export function ChatWindow({
  messages,
  isLoading,
  onSend,
  onWhyExplanation,
  onReset,
  onRetry,
  selectedSubject,
  onSelectSubject,
  mode,
  inputRef: externalRef,
}) {
  const [input, setInput] = useState("");
  const internalRef       = useRef(null);
  const inputRef          = externalRef || internalRef;
  const messagesEndRef    = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const looksLikeCode =
    input.includes("```") ||
    input.includes("def ") ||
    input.includes("function ") ||
    input.includes("class ") ||
    /[{};=<>]/.test(input);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput("");
  }, [input, isLoading, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = selectedSubject
    ? (SUBJECT_SUGGESTIONS[selectedSubject.id] ?? [])
    : [];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>

      {/* Subject bar */}
      <div style={{
        padding: "10px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        <SubjectSelector selected={selectedSubject} onSelect={onSelectSubject} />
      </div>

      {/* Mode badge */}
      <ModeBadge mode={mode} />

      {/* Messages */}
      <div
        className="scroll-neb"
        style={{
          flex: 1, overflowY: "auto",
          padding: "24px 24px 12px",
          display: "flex", flexDirection: "column", gap: 10,
        }}
      >
        {/* Welcome / empty state */}
        {messages.length === 0 && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            justifyContent: "center", paddingTop: 24,
          }}>
            <div className="bubble-ai" style={{
              maxWidth: 460,
              animation: "none",
            }}>
              <p style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 16, fontWeight: 600,
                color: "#F2EFFF", margin: "0 0 8px",
              }}>
                Ready when you are.
              </p>
              <p style={{
                fontSize: 13.5, color: "#9E9AC0",
                margin: "0 0 20px", lineHeight: 1.65,
              }}>
                Ask me anything — I&rsquo;ll guide you to the answer, not just hand it over.
              </p>

              {suggestions.length > 0 && (
                <div>
                  <p style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 9, fontWeight: 600,
                    letterSpacing: "0.09em", textTransform: "uppercase",
                    color: "#4A4672", margin: "0 0 10px",
                  }}>
                    You could start with…
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        className="suggestion-pill"
                        onClick={() => {
                          setInput(s);
                          setTimeout(() => inputRef.current?.focus(), 0);
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onRetry={msg.isError && onRetry ? onRetry : undefined}
          />
        ))}

        {isLoading && (
          <div style={{ display: "flex" }}>
            <div className="bubble-ai" style={{ padding: "10px 0 10px 18px" }}>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{ padding: "10px 24px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>

        {/* "Explain this →" contextual button */}
        {looksLikeCode && input.trim() && (
          <button
            onClick={() => { onWhyExplanation(input); setInput(""); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              marginBottom: 8,
              fontFamily: "'Sora', sans-serif",
              fontSize: 9, fontWeight: 600,
              letterSpacing: "0.07em", textTransform: "uppercase",
              padding: "4px 12px", borderRadius: 99,
              border: "1px solid rgba(124, 92, 252, 0.35)",
              background: "rgba(124, 92, 252, 0.08)",
              color: "#9B7FFF",
              transition: "background 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(124, 92, 252, 0.18)";
              e.currentTarget.style.boxShadow = "0 0 12px rgba(124, 92, 252, 0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(124, 92, 252, 0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Explain this →
          </button>
        )}

        {/* Input shell */}
        <div className="input-shell" style={{ display: "flex", alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            className="chat-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question or paste code…"
            rows={2}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            aria-label="Send"
          >
            <SendIcon />
          </button>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", justifyContent: "flex-end",
          marginTop: 8,
        }}>
          <button
            onClick={onReset}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11, color: "#4A4672",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#9E9AC0"}
            onMouseLeave={e => e.currentTarget.style.color = "#4A4672"}
          >
            Start fresh
          </button>
        </div>
      </div>
    </div>
  );
}
