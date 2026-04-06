"use client";

import { useState, useRef } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom";
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <div
        style={{
          position: "absolute",
          [position === "top" ? "bottom" : "top"]: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "6px 10px",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.15s ease",
          zIndex: 100,
        }}
      >
        {content}
      </div>
    </div>
  );
}
