"use client";

import { useRef, useEffect, useState } from "react";

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLButtonElement>(`[data-tab="${activeTab}"]`);
    if (!activeEl) return;
    setIndicatorStyle({
      left: activeEl.offsetLeft,
      width: activeEl.offsetWidth,
    });
  }, [activeTab, tabs]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "flex",
        gap: 0,
        borderBottom: "1px solid var(--border)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            data-tab={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: "10px 20px",
              fontSize: "0.85rem",
              fontFamily: "var(--font-display)",
              fontWeight: isActive ? 500 : 300,
              color: isActive ? "var(--text)" : "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "color 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: "0.7rem",
                  color: isActive ? "var(--accent)" : "var(--text-faint)",
                  fontWeight: 400,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}

      {/* Animated accent underline */}
      <span
        style={{
          position: "absolute",
          bottom: -1,
          height: 2,
          background: "var(--accent)",
          transition: "left 0.2s ease, width 0.2s ease",
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />
    </div>
  );
}
