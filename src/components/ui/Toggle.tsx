"use client";

interface ToggleProps {
  on: boolean;
  onChange: () => void;
}

export function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      aria-checked={on}
      role="switch"
      style={{
        width: 36,
        height: 20,
        borderRadius: 99,
        background: on ? "var(--text-muted)" : "var(--border)",
        border: "none",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.2s ease",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 19 : 3,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: on ? "var(--text)" : "var(--text-faint)",
          transition: "left 0.2s ease, background 0.2s ease",
        }}
      />
    </button>
  );
}
