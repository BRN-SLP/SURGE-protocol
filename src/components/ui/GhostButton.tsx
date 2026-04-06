import type { CSSProperties } from "react";

interface GhostButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  size?: "sm" | "md";
  style?: CSSProperties;
  disabled?: boolean;
}

export function GhostButton({
  children,
  onClick,
  href,
  size = "md",
  style,
  disabled,
}: GhostButtonProps) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "none",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: disabled ? "var(--text-faint)" : "var(--text-muted)",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "var(--font-display)",
    fontWeight: 300,
    fontSize: size === "sm" ? "0.78rem" : "0.85rem",
    letterSpacing: "0.04em",
    padding: size === "sm" ? "6px 12px" : "8px 16px",
    textDecoration: "none",
    transition: "border-color 0.15s ease, color 0.15s ease",
    ...style,
  };

  if (href) {
    return (
      <a href={href} style={base}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} style={base}>
      {children}
    </button>
  );
}
