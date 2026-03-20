const MODES = [
  {
    id: "hint",
    label: "Guide",
    subtitle: "I'll figure it out",
    activeClass: "active",
    activeColor: "#C4B0FF",
  },
  {
    id: "explain",
    label: "Deep Dive",
    subtitle: "Teach me everything",
    activeClass: "active-dive",
    activeColor: "#9DD8F5",
  },
  {
    id: "debug",
    label: "Debug",
    subtitle: "Fix my code",
    activeClass: "active-debug",
    activeColor: "#FECB6E",
  },
];

export function ModeToggle({ mode, onToggle }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
      {MODES.map(({ id, label, subtitle, activeClass, activeColor }) => {
        const isActive = mode === id;
        return (
          <div key={id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <button
              className={`mode-btn${isActive ? ` ${activeClass}` : ""}`}
              onClick={() => onToggle(id)}
            >
              {label}
            </button>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 9,
              letterSpacing: "0.02em",
              color: isActive ? activeColor : "#4A4672",
              transition: "color 0.2s",
              whiteSpace: "nowrap",
            }}>
              {subtitle}
            </span>
          </div>
        );
      })}
    </div>
  );
}
