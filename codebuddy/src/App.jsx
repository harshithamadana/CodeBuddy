import { useRef, useState } from "react";
import { useChat } from "./hooks/useChat";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { ChatWindow } from "./components/ChatWindow";
import { ModeToggle } from "./components/ModeToggle";
import { MemoryPanel } from "./components/MemoryPanel";

// Subtle mode-aware header tint
const HEADER_TINTS = {
  hint:    "rgba(124, 92, 252, 0.04)",
  explain: "rgba(78, 168, 222, 0.035)",
  debug:   "rgba(245, 158, 11, 0.04)",
};

// Brand dot reflects current mode
const DOT_CLASSES = {
  hint:    "",
  explain: " mode-dive",
  debug:   " mode-debug",
};

function PanelIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
}

function App() {
  const {
    messages,
    isLoading,
    selectedSubject,
    setSelectedSubject,
    mode,
    setMode,
    sessionEvents,
    sendMessage,
    sendWhyExplanation,
    retryLastMessage,
    resetConversation,
  } = useChat();

  const [isMemoryOpen, setIsMemoryOpen] = useState(true);
  const inputRef = useRef(null);

  useKeyboardShortcuts({
    inputRef,
    onSelectSubject: setSelectedSubject,
    onToggleMemory:  () => setIsMemoryOpen(prev => !prev),
  });

  const headerTint  = HEADER_TINTS[mode]  ?? HEADER_TINTS.hint;
  const dotClass    = DOT_CLASSES[mode]   ?? "";

  return (
    <div style={{
      display: "flex",
      height: "100%",
      background: "#060512",
      overflow: "hidden",
    }}>
      {/* ─── Chat column ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 56,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          flexShrink: 0,
          background: headerTint,
          transition: "background 0.4s",
        }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className={`brand-dot${isLoading ? " is-thinking" : ""}${dotClass}`} />
            <span style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "#F2EFFF",
            }}>
              CodeBuddy
            </span>
          </div>

          {/* Right cluster */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, paddingTop: 6 }}>
            <ModeToggle mode={mode} onToggle={setMode} />

            {/* Panel toggle */}
            <button
              onClick={() => setIsMemoryOpen(prev => !prev)}
              title="Toggle context panel (Ctrl+B)"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 30, height: 30, borderRadius: 7,
                color: isMemoryOpen ? "#9B7FFF" : "#4A4672",
                background: isMemoryOpen
                  ? "rgba(124, 92, 252, 0.12)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${isMemoryOpen
                  ? "rgba(124, 92, 252, 0.25)"
                  : "rgba(255,255,255,0.06)"}`,
                transition: "color 0.2s, background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => {
                if (!isMemoryOpen) {
                  e.currentTarget.style.color = "#9E9AC0";
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                }
              }}
              onMouseLeave={e => {
                if (!isMemoryOpen) {
                  e.currentTarget.style.color = "#4A4672";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }
              }}
            >
              <PanelIcon />
            </button>
          </div>
        </header>

        {/* Chat (subject bar + mode badge + messages + input) */}
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSend={sendMessage}
          onWhyExplanation={sendWhyExplanation}
          onReset={resetConversation}
          onRetry={retryLastMessage}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          mode={mode}
          inputRef={inputRef}
        />
      </div>

      {/* ─── Memory panel ─── */}
      <MemoryPanel
        isOpen={isMemoryOpen}
        onToggle={() => setIsMemoryOpen(prev => !prev)}
        subject={selectedSubject}
        mode={mode}
        messages={messages}
        sessionEvents={sessionEvents}
      />
    </div>
  );
}

export default App;
