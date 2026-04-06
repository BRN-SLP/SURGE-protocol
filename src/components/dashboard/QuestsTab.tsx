"use client";

import { useState, type ReactNode } from "react";
import { Coins, Vote, Users, Code2, Fingerprint, Layers, Lock, Check } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { QuestInfo, QuestStatus } from "@/types";

interface QuestsTabProps {
  quests: QuestInfo[];
}

type FilterOption = QuestStatus | "all";

const FILTER_OPTIONS: { label: string; value: FilterOption }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Locked", value: "locked" },
];

const CATEGORY_ICONS: Record<string, ReactNode> = {
  defi: <Coins size={13} strokeWidth={1.25} />,
  governance: <Vote size={13} strokeWidth={1.25} />,
  social: <Users size={13} strokeWidth={1.25} />,
  builder: <Code2 size={13} strokeWidth={1.25} />,
  identity: <Fingerprint size={13} strokeWidth={1.25} />,
  onchain: <Layers size={13} strokeWidth={1.25} />,
};

function QuestCard({ quest }: { quest: QuestInfo }) {
  const isCompleted = quest.status === "completed";
  const isLocked = quest.status === "locked";
  const progress = quest.maxProgress > 0 ? (quest.progress / quest.maxProgress) * 100 : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "16px 18px",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        background: isCompleted ? "rgba(34,170,102,0.03)" : "transparent",
        opacity: isLocked ? 0.5 : 1,
        transition: "border-color 0.15s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (!isLocked)
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
      }}
    >
      {/* Completed accent line */}
      {isCompleted && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 2,
            background: "#22aa66",
            borderRadius: "var(--radius-sm) 0 0 var(--radius-sm)",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ display: "flex", alignItems: "center", color: "var(--text-faint)" }}>
              {CATEGORY_ICONS[quest.category] ?? <span style={{ fontSize: "0.85rem" }}>·</span>}
            </span>
            <span
              style={{
                fontSize: "0.88rem",
                color: "var(--text)",
                fontWeight: isCompleted ? 400 : 300,
                letterSpacing: "0.01em",
              }}
            >
              {quest.title}
            </span>
            {isLocked && <Lock size={11} color="var(--text-faint)" strokeWidth={1.25} />}
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              fontWeight: 300,
              lineHeight: 1.5,
            }}
          >
            {quest.description}
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontSize: "0.88rem",
              color: isCompleted ? "#22aa66" : "var(--text)",
              fontWeight: 400,
            }}
          >
            +{quest.reward}
          </div>
          <div
            style={{
              fontSize: "0.65rem",
              color: "var(--text-faint)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            pts
          </div>
        </div>
      </div>

      {/* Progress bar (only active quests) */}
      {quest.status === "active" && quest.maxProgress > 0 && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>
              {quest.progress} / {quest.maxProgress}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>
              {Math.round(progress)}%
            </span>
          </div>
          <ProgressBar value={progress} height={3} />
        </div>
      )}

      {/* Completed badge */}
      {isCompleted && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Check size={12} color="#22aa66" strokeWidth={1.25} />
          <span
            style={{
              fontSize: "0.68rem",
              color: "#22aa66",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Completed
          </span>
        </div>
      )}
    </div>
  );
}

export function QuestsTab({ quests }: QuestsTabProps) {
  const [filter, setFilter] = useState<FilterOption>("active");

  const filtered = filter === "all" ? quests : quests.filter((q) => q.status === filter);
  const activeCount = quests.filter((q) => q.status === "active").length;
  const completedCount = quests.filter((q) => q.status === "completed").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            <span style={{ color: "var(--text)", fontWeight: 400 }}>{activeCount}</span> Active
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            <span style={{ color: "#22aa66", fontWeight: 400 }}>{completedCount}</span> Completed
          </span>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "3px 10px",
                fontSize: "0.7rem",
                background: filter === f.value ? "var(--surface-2)" : "none",
                border: `1px solid ${filter === f.value ? "var(--border-hover)" : "transparent"}`,
                borderRadius: "var(--radius-sm)",
                color: filter === f.value ? "var(--text)" : "var(--text-faint)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.04em",
                transition: "all 0.15s ease",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quest grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 8,
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "var(--text-faint)",
              fontSize: "0.85rem",
              padding: "32px 0",
            }}
          >
            No quests in this category
          </div>
        ) : (
          filtered.map((quest) => <QuestCard key={quest.id} quest={quest} />)
        )}
      </div>
    </div>
  );
}
