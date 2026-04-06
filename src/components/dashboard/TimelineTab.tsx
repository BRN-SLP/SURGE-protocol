"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Trophy, TrendingUp, Award, Wallet, CheckCircle2 } from "lucide-react";
import type { TimelineEvent, TimelineEventType } from "@/types";

interface TimelineTabProps {
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
  { label: "Milestones", value: "milestone" },
  { label: "Score", value: "score_change" },
  { label: "Badges", value: "badge_earned" },
  { label: "Quests", value: "quest_completed" },
  { label: "Wallets", value: "wallet_event" },
];

function getYear(dateStr: string) {
  return new Date(dateStr).getFullYear();
}

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TimelineEventRow({
  event,
  isFirst: _isFirst,
  showYearMarker,
}: {
  event: TimelineEvent;
  isFirst: boolean;
  showYearMarker: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const dotColor = EVENT_COLORS[event.type];

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {showYearMarker && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingLeft: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              color: "var(--text-faint)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              minWidth: 32,
              textAlign: "right",
            }}
          >
            {getYear(event.date)}
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
      )}
      <div
        ref={rowRef}
        style={{
          display: "flex",
          gap: 16,
          opacity: 0,
          transform: "translateY(12px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {/* Timeline spine */}
        <div
          style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: dotColor,
              marginTop: 6,
              flexShrink: 0,
              boxShadow: event.type === "milestone" ? `0 0 8px ${dotColor}60` : "none",
            }}
          />
          <div
            style={{
              width: 1,
              flex: 1,
              background: "var(--border)",
              marginTop: 4,
              minHeight: 20,
            }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, paddingBottom: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ display: "flex", alignItems: "center", color: dotColor }}>
                  {EVENT_ICONS[event.type]}
                </span>
                <span
                  style={{
                    fontSize: "0.88rem",
                    color: event.type === "milestone" ? "var(--text)" : "var(--text)",
                    fontWeight: event.type === "milestone" ? 400 : 300,
                    letterSpacing: "0.01em",
                  }}
                >
                  {event.title}
                </span>
                {event.scoreDelta !== undefined && event.scoreDelta !== 0 && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: event.scoreDelta > 0 ? "#22aa66" : "var(--accent)",
                      fontWeight: 500,
                    }}
                  >
                    {event.scoreDelta > 0 ? "+" : ""}
                    {event.scoreDelta}
                  </span>
                )}
              </div>
              {event.description && (
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    fontWeight: 300,
                    lineHeight: 1.5,
                  }}
                >
                  {event.description}
                </p>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 2,
                flexShrink: 0,
              }}
            >
              <span
                style={{ fontSize: "0.72rem", color: "var(--text-faint)", whiteSpace: "nowrap" }}
              >
                {formatEventDate(event.date)}
              </span>
              {event.chain && (
                <span style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>
                  {event.chain}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function TimelineTab({ events }: TimelineTabProps) {
  const [filter, setFilter] = useState<FilterOption>("all");

  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter);

  // Group by year for year markers
  const withYearMarkers = filtered.map((event, i) => ({
    event,
    showYearMarker: i === 0 || getYear(filtered[i - 1].date) !== getYear(event.date),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Filter row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
          }}
        >
          {filtered.length} Event{filtered.length !== 1 ? "s" : ""}
        </span>
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

      {/* Timeline */}
      <div style={{ paddingLeft: 8 }}>
        {withYearMarkers.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-faint)",
              fontSize: "0.85rem",
              padding: "32px 0",
            }}
          >
            No events found
          </div>
        ) : (
          withYearMarkers.map(({ event, showYearMarker }, i) => (
            <TimelineEventRow
              key={event.id}
              event={event}
              isFirst={i === 0}
              showYearMarker={showYearMarker}
            />
          ))
        )}
      </div>
    </div>
  );
}
