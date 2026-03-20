const MODE_LABELS = {
  hint:    { label: "Guide",     color: "#7C5CFC" },
  explain: { label: "Deep Dive", color: "#4EA8DE" },
  debug:   { label: "Debug",     color: "#F59E0B" },
};

const EVENT_CONFIG = {
  subject:  { color: "#7C5CFC", symbol: "◆" },
  mode:     { color: "#4EA8DE", symbol: "⚡" },
  question: { color: "#4A4672", symbol: "·" },
};

const SHORTCUTS = [
  { keys: "Ctrl+K",   label: "Focus input" },
  { keys: "Ctrl+B",   label: "Toggle panel" },
  { keys: "Ctrl+1–5", label: "Switch topic" },
  { keys: "↵ Enter",  label: "Send" },
  { keys: "⇧ Enter",  label: "New line" },
];

function formatTime(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function IconChevronLeft() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function Divider() {
  return (
    <div style={{
      height: 1,
      background: "rgba(255,255,255,0.05)",
      margin: "16px 0",
    }} />
  );
}

function Section({ label, children }) {
  return (
    <div>
      <div className="memory-section-label">{label}</div>
      {children}
    </div>
  );
}

export function MemoryPanel({ isOpen, onToggle, subject, mode, messages, sessionEvents }) {
  const modeInfo   = MODE_LABELS[mode] || MODE_LABELS.hint;
  const turnCount  = messages.filter(m => m.sender === "user").length;
  // Last 6 events, newest first
  const recentEvents = [...sessionEvents].reverse().slice(0, 6);

  return (
    <div className={`memory-panel ${isOpen ? "panel-open" : "panel-closed"}`}>

      {/* Header row with toggle */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: isOpen ? "space-between" : "center",
        padding: "14px 12px 10px",
        flexShrink: 0,
      }}>
        {isOpen && (
          <span style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#4A4672",
          }}>
            Context
          </span>
        )}
        <button className="panel-toggle-btn" onClick={onToggle}
          title={isOpen ? "Collapse" : "Expand context panel (Ctrl+B)"}>
          {isOpen ? <IconChevronLeft /> : <IconChevronRight />}
        </button>
      </div>

      {/* ── Collapsed view ── */}
      {!isOpen && (
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 14,
          padding: "8px 0", flex: 1,
        }}>
          {/* Subject initial */}
          <div title={subject?.label} style={{
            width: 28, height: 28, borderRadius: 8,
            background: "rgba(124, 92, 252, 0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 700,
            color: "#9B7FFF",
          }}>
            {subject?.label?.slice(0, 1) ?? "?"}
          </div>
          {/* Mode dot */}
          <div
            title={`Mode: ${modeInfo.label}`}
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: modeInfo.color,
              boxShadow: `0 0 6px ${modeInfo.color}90`,
            }}
          />
          {/* Turn count */}
          {turnCount > 0 && (
            <span title={`${turnCount} turns`} style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 9, fontWeight: 600,
              color: "#4A4672",
              letterSpacing: "0.04em",
            }}>
              {turnCount}
            </span>
          )}
        </div>
      )}

      {/* ── Expanded view ── */}
      {isOpen && (
        <div className="scroll-neb" style={{
          flex: 1, overflowY: "auto",
          padding: "0 16px 20px",
        }}>

          {/* Topic */}
          <Section label="Topic">
            <div style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "rgba(124, 92, 252, 0.08)",
              border: "1px solid rgba(124, 92, 252, 0.18)",
            }}>
              <span style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 12, fontWeight: 500,
                color: "#9B7FFF",
              }}>
                {subject?.label ?? "None selected"}
              </span>
            </div>
          </Section>

          <Divider />

          {/* Mode + Turns row */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Section label="Mode">
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: modeInfo.color,
                    boxShadow: `0 0 5px ${modeInfo.color}80`,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 12, fontWeight: 500,
                    color: "#F2EFFF",
                  }}>
                    {modeInfo.label}
                  </span>
                </div>
              </Section>
            </div>
            <div>
              <Section label="Turns">
                <span style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 22, fontWeight: 700,
                  color: "#F2EFFF",
                  lineHeight: 1,
                }}>
                  {turnCount}
                </span>
              </Section>
            </div>
          </div>

          <Divider />

          {/* Session Timeline */}
          <Section label="Timeline">
            {recentEvents.length === 0 ? (
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11, color: "#4A4672",
                fontStyle: "italic",
              }}>
                Your session activity will appear here.
              </span>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {recentEvents.map((ev) => {
                  const cfg = EVENT_CONFIG[ev.type] || EVENT_CONFIG.question;
                  return (
                    <div key={ev.id} className="timeline-event">
                      <span
                        className="timeline-dot"
                        style={{ background: cfg.color }}
                      />
                      <span className="timeline-text">{ev.label}</span>
                      <span className="timeline-time">{formatTime(ev.time)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          <Divider />

          {/* Keyboard Shortcuts */}
          <Section label="Shortcuts">
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {SHORTCUTS.map(({ keys, label }) => (
                <div key={keys} style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", gap: 8,
                }}>
                  <code style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9.5,
                    color: "#9B7FFF",
                    background: "rgba(124, 92, 252, 0.10)",
                    padding: "2px 7px",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                    border: "1px solid rgba(124, 92, 252, 0.18)",
                  }}>
                    {keys}
                  </code>
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10, color: "#4A4672",
                    textAlign: "right",
                  }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
