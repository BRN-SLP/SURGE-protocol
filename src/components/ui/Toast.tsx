"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const TYPE_COLOR: Record<ToastType, string> = {
  success: "var(--success)",
  error: "var(--accent)",
  info: "var(--text-muted)",
};

export function Toast({ message, type = "info", visible, onHide, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onHide, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onHide]);

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 2000,
        transform: visible ? "translateY(0)" : "translateY(-12px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease, transform 0.2s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: `3px solid ${TYPE_COLOR[type]}`,
          borderRadius: "var(--radius-sm)",
          padding: "12px 16px",
          fontSize: "0.85rem",
          color: "var(--text)",
          maxWidth: 320,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        {message}
      </div>
    </div>
  );
}
