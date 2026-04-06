import type { ReactNode, CSSProperties } from "react";

interface ScrollableRegionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * An overflow-y: auto container that fills available flex space.
 * Use inside ViewportContainer / SplitLayout for lists, tables, etc.
 */
export function ScrollableRegion({ children, className = "", style }: ScrollableRegionProps) {
  return (
    <div
      className={className}
      style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
