import type { ReactNode, CSSProperties } from "react";

interface ViewportContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Extra padding on top of pt-16 (navbar). Default: false */
  noPad?: boolean;
}

/**
 * Full-viewport page wrapper: height = 100dvh - navbar, no overflow.
 * Used for viewport-first pages that must not have page-level scroll.
 */
export function ViewportContainer({ children, className = "", style }: ViewportContainerProps) {
  return (
    <div
      className={className}
      style={{
        height: "var(--viewport-content)",
        marginTop: "var(--navbar-h)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
