"use client";

import { useState, type ReactNode } from "react";
import { Trophy, TrendingUp, Award, Wallet, CheckCircle2 } from "lucide-react";
import type { TimelineEvent, TimelineEventType } from "@/types";

interface TimelineTabV2Props {
  events: TimelineEvent[];
}

const EVENT_ICONS: Record<TimelineEventType, ReactNode> = {
  milestone: <Trophy size={13} strokeWidth={1.25} />,
  score_change: <TrendingUp size={13} strokeWidth={1.25} />,
  badge_earned: <Award size={13} strokeWidth={1.25} />,
  wallet_event: <Wallet size={13} strokeWidth={1.25} />,
  quest_completed: <CheckCircle2 size={13} strokeWidth={1.25} />,
};

const EVENT_COLORS: Record<TimelineEventType, string> = {
  milestone: "var(--accent)",
  score_change: "var(--text-muted)",
  badge_earned: "#f0aa20",
  wallet_event: "#4d8eff",
  quest_completed: "#22aa66",
};

type FilterOption = TimelineEventType | "all";

const FILTER_OPTIONS: { label: string; value: FilterOption }[] = [
  { label: "All", value: "all" },
  { label: "Mile", value: "milestone" },
  { label: "Score", value: "score_change" },
  { label: "Badge", value: "badge_earned" },
  { label: "Quest", value: "quest_completed" },
  { label: "Wallet", value: "wallet_event" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TimelineTabV2({ events }: TimelineTabV2Props) {
  const [filter, setFilter] = useState<FilterOption>("all");

  const filtered = (filter === "all" ? events : events.filter((e) => e.type === filter)).slice(
    0,
    8,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
      {/* Filter row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
          }}
        >
          Recent
        </span>
        <div style={{ display: "flex", gap: 3 }}>
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "2px 8px",
                fontSize: "0.72rem",
                background: filter === f.value ? "var(--surface-2)" : "none",
                border: `1px solid ${filter === f.value ? "var(--border-hover)" : "transparent"}`,
                borderRadius: "var(--radius-sm)",
                color: filter === f.value ? "var(--text)" : "var(--text-faint)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events */}
      <div style={{ display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-faint)",
              fontSize: "0.82rem",
              padding: "32px 0",
            }}
          >
            No events found
          </div>
        ) : (
          filtered.map((event, i) => {
            const dotColor = EVENT_COLORS[event.type];
            return (
              <div key={event.id} style={{ display: "flex", gap: 12, position: "relative" }}>
                {/* Spine */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    width: 16,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: dotColor,
                      marginTop: 9,
                      flexShrink: 0,
                    }}
                  />
                  {i < filtered.length - 1 && (
                    <div
                      style={{
                        width: 1,
                        flex: 1,
                        background: "var(--border)",
                        minHeight: 14,
                        marginTop: 3,
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        overflow: "hidden",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--text-faint)",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {EVENT_ICONS[event.type]}
                      </span>
                      <span
                        style={{
                          fontSize: "0.82rem",
                          color: "var(--text)",
                          fontWeight: event.type === "milestone" ? 400 : 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {event.title}
                      </span>
                    </span>
                    {event.scoreDelta !== undefined && event.scoreDelta !== 0 && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: event.scoreDelta > 0 ? "#22aa66" : "var(--accent)",
                          fontWeight: 500,
                          flexShrink: 0,
                        }}
                      >
                        {event.scoreDelta > 0 ? "+" : ""}
                        {event.scoreDelta}
                      </span>
                    )}
                    <span
                      style={{ fontSize: "0.65rem", color: "var(--text-faint)", flexShrink: 0 }}
                    >
                      {formatDate(event.date)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
