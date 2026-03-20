const MODE_CONFIG = {
  hint: {
    label: "Guide Mode",
    dotColor:  "#7C5CFC",
    textColor: "#9B7FFF",
    bg:        "rgba(124, 92, 252, 0.045)",
  },
  explain: {
    label: "Deep Dive Mode",
    dotColor:  "#4EA8DE",
    textColor: "#71BCEC",
    bg:        "rgba(78, 168, 222, 0.04)",
  },
  debug: {
    label: "Debug Mode",
    dotColor:  "#F59E0B",
    textColor: "#FBB947",
    bg:        "rgba(245, 158, 11, 0.04)",
  },
};

export function ModeBadge({ mode }) {
  const cfg = MODE_CONFIG[mode] || MODE_CONFIG.hint;

  return (
    <div
      className="mode-badge-row"
      style={{ background: cfg.bg }}
    >
      <span
        className="mode-badge-dot"
        style={{
          background: cfg.dotColor,
          boxShadow: `0 0 6px ${cfg.dotColor}80`,
        }}
      />
      <span
        className="mode-badge-text"
        style={{ color: cfg.textColor }}
      >
        {cfg.label}
      </span>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 10,
        color: "#4A4672",
        marginLeft: 4,
        letterSpacing: "0.04em",
      }}>
        · Active
      </span>
    </div>
  );
}
