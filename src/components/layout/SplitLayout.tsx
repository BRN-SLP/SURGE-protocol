import type { ReactNode, CSSProperties } from "react";

interface SplitLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  /** Sidebar width. Default: "340px" */
  sidebarWidth?: string;
  gap?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Two-column layout: fixed-width sidebar + flexible main area.
 * Both columns fill available height, main overflows independently.
 * Use inside ViewportContainer.
 */
export function SplitLayout({
  sidebar,
  main,
  sidebarWidth = "340px",
  gap = "var(--block-gap)",
  className = "",
  style,
}: SplitLayoutProps) {
  return (
    <div
      className={className}
      style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: `${sidebarWidth} 1fr`,
        gap,
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>{sidebar}</div>
      <div style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>{main}</div>
    </div>
  );
}
