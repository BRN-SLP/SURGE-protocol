"use client";

interface ToggleProps {
  on: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export function Toggle({ on, onChange, disabled }: ToggleProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange();
      }}
      aria-checked={on}
      role="switch"
      disabled={disabled}
      style={{
        width: 36,
        height: 20,
        borderRadius: 99,
        background: on ? "var(--text-muted)" : "var(--border)",
        border: "none",
        cursor: disabled ? "default" : "pointer",
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
