"use client";

import { useState, type ReactNode } from "react";
import { Coins, Vote, Users, Code2, Fingerprint, Layers, Check } from "lucide-react";
import type { QuestInfo, QuestStatus } from "@/types";

interface QuestsTabV2Props {
  quests: QuestInfo[];
}

type FilterOption = QuestStatus | "all";

const FILTER_OPTIONS: { label: string; value: FilterOption }[] = [
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Locked", value: "locked" },
  { label: "All", value: "all" },
];

const CATEGORY_ICONS: Record<string, ReactNode> = {
  defi: <Coins size={12} strokeWidth={1.25} />,
  governance: <Vote size={12} strokeWidth={1.25} />,
  social: <Users size={12} strokeWidth={1.25} />,
  builder: <Code2 size={12} strokeWidth={1.25} />,
  identity: <Fingerprint size={12} strokeWidth={1.25} />,
  onchain: <Layers size={12} strokeWidth={1.25} />,
};

export function QuestsTabV2({ quests }: QuestsTabV2Props) {
  const [filter, setFilter] = useState<FilterOption>("active");

  const filtered = filter === "all" ? quests : quests.filter((q) => q.status === filter);
  const activeCount = quests.filter((q) => q.status === "active").length;
  const completedCount = quests.filter((q) => q.status === "completed").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            <span style={{ color: "var(--text)" }}>{activeCount}</span> active
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
            <span style={{ color: "#22aa66" }}>{completedCount}</span> done
          </span>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "2px 8px",
                fontSize: "0.63rem",
                background: filter === f.value ? "var(--surface-2)" : "none",
                border: `1px solid ${filter === f.value ? "var(--border-hover)" : "transparent"}`,
                borderRadius: "var(--radius-sm)",
                color: filter === f.value ? "var(--text)" : "var(--text-faint)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.04em",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quest list */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 6,
          alignContent: "start",
          overflowY: "auto",
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "var(--text-faint)",
              fontSize: "0.82rem",
              padding: "32px 0",
            }}
          >
            No quests
          </div>
        ) : (
          filtered.map((quest) => {
            const isCompleted = quest.status === "completed";
            const isLocked = quest.status === "locked";
            const progress = quest.maxProgress > 0 ? (quest.progress / quest.maxProgress) * 100 : 0;

            return (
              <div
                key={quest.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  padding: "10px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  borderLeft: isCompleted ? "2px solid #22aa66" : "1px solid var(--border)",
                  background: isCompleted ? "rgba(34,170,102,0.02)" : "transparent",
                  opacity: isLocked ? 0.45 : 1,
                  transition: "border-color 0.12s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!isLocked) e.currentTarget.style.borderColor = "var(--border-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isCompleted ? "#22aa66" : "var(--border)";
                }}
              >
                {/* Title row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "var(--text-faint)",
                        flexShrink: 0,
                      }}
                    >
                      {CATEGORY_ICONS[quest.category] ?? (
                        <span style={{ fontSize: "0.78rem" }}>·</span>
                      )}
                    </span>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text)",
                        fontWeight: isCompleted ? 400 : 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {quest.title}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: isCompleted ? "#22aa66" : "var(--text)",
                      fontWeight: 400,
                      flexShrink: 0,
                    }}
                  >
                    +{quest.reward}
                  </span>
                </div>

                {/* Progress (active only) */}
                {quest.status === "active" && quest.maxProgress > 0 && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                        fontSize: "0.65rem",
                        color: "var(--text-faint)",
                      }}
                    >
                      <span>
                        {quest.progress} / {quest.maxProgress}
                      </span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div
                      style={{
                        height: 2,
                        background: "var(--surface-2)",
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${progress}%`,
                          background: "var(--text-muted)",
                          borderRadius: 99,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Completed indicator */}
                {isCompleted && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: "0.65rem",
                      color: "#22aa66",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    <Check size={11} color="#22aa66" strokeWidth={1.5} />
                    Done
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
