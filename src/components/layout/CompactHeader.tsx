import type { ReactNode } from "react";

interface CompactHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  back?: { href: string; label?: string };
}

/**
 * Slim page header (title + optional back link + action slot).
 * Does not grow — sits above scrollable content inside ViewportContainer.
 */
export function CompactHeader({ title, subtitle, actions, back }: CompactHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px var(--section-px)",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {back && (
          <a
            href={back.href}
            style={{
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ← {back.label ?? "Back"}
          </a>
        )}
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.1rem",
              fontWeight: 300,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--text)",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                margin: 0,
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{actions}</div>}
    </div>
  );
}
