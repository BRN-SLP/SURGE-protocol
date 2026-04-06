"use client";

import { useState, useRef, type ReactNode } from "react";
import { Coins, Vote, Award, Link, CheckCircle2, Hexagon, Code2, TrendingUp } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { ActivityEvent } from "@/types";

interface ScorePulseTabV2Props {
  activities: ActivityEvent[];
  scoreHistory: { date: string; score: number }[];
  domainBreakdown: { domain: string; pct: number; pts: number }[];
  currentScore: number;
}

const PERIOD_FILTERS = ["7D", "30D", "90D", "ALL"];

const ACTIVITY_ICONS: Record<string, ReactNode> = {
  defi: <Coins size={13} strokeWidth={1.25} />,
  governance: <Vote size={13} strokeWidth={1.25} />,
  badge_earned: <Award size={13} strokeWidth={1.25} />,
  wallet_linked: <Link size={13} strokeWidth={1.25} />,
  quest_completed: <CheckCircle2 size={13} strokeWidth={1.25} />,
  drop_claimed: <Hexagon size={13} strokeWidth={1.25} />,
  builder: <Code2 size={13} strokeWidth={1.25} />,
  score_change: <TrendingUp size={13} strokeWidth={1.25} />,
};

function formatDelta(delta: number) {
  if (delta === 0) return null;
  return delta > 0 ? `+${delta}` : `${delta}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ScoreChart({ data, period }: { data: { date: string; score: number }[]; period: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<{
    x: number;
    y: number;
    score: number;
    date: string;
  } | null>(null);

  const filtered =
    period === "ALL" ? data : data.slice(-({ "7D": 3, "30D": 5, "90D": 7 }[period] ?? data.length));
  const W = 600;
  const H = 100;
  const PAD = { top: 8, right: 10, bottom: 18, left: 10 };

  if (filtered.length < 2) {
    return (
      <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "0.78rem", color: "var(--text-faint)" }}>No history yet</span>
      </div>
    );
  }

  const minScore = Math.min(...filtered.map((d) => d.score));
  const maxScore = Math.max(...filtered.map((d) => d.score));
  const range = maxScore - minScore || 1;

  const points = filtered.map((d, i) => ({
    x: PAD.left + (i / (filtered.length - 1)) * (W - PAD.left - PAD.right),
    y: PAD.top + (1 - (d.score - minScore) / range) * (H - PAD.top - PAD.bottom),
    score: d.score,
    date: formatDate(d.date),
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaD =
    pathD +
    ` L ${points[points.length - 1].x.toFixed(1)} ${H - PAD.bottom} L ${PAD.left} ${H - PAD.bottom} Z`;

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="areaGradV2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.10" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGradV2)" />
        <path
          d={pathD}
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={3}
              fill="var(--surface)"
              stroke="var(--text-muted)"
              strokeWidth="1.5"
            />
            <rect
              x={p.x - 20}
              y={0}
              width={40}
              height={H}
              fill="transparent"
              onMouseEnter={() => setHovered(p)}
            />
          </g>
        ))}
        {hovered && (
          <line
            x1={hovered.x}
            y1={PAD.top}
            x2={hovered.x}
            y2={H - PAD.bottom}
            stroke="var(--border-hover)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}
      </svg>
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${(hovered.x / W) * 100}%`,
            transform: "translateX(-50%)",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "4px 8px",
            fontSize: "0.72rem",
            color: "var(--text)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {hovered.score.toLocaleString()} · {hovered.date}
        </div>
      )}
    </div>
  );
}

export function ScorePulseTabV2({
  activities,
  scoreHistory,
  domainBreakdown,
  currentScore: _currentScore,
}: ScorePulseTabV2Props) {
  const [period, setPeriod] = useState("ALL");
  const visibleActivities = activities.slice(0, 6);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        height: "100%",
      }}
    >
      {/* Left: chart + breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Chart */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
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
              Score History
            </span>
            <div style={{ display: "flex", gap: 3 }}>
              {PERIOD_FILTERS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    padding: "2px 8px",
                    fontSize: "0.65rem",
                    background: period === p ? "var(--surface-2)" : "none",
                    border: `1px solid ${period === p ? "var(--border-hover)" : "transparent"}`,
                    borderRadius: "var(--radius-sm)",
                    color: period === p ? "var(--text)" : "var(--text-faint)",
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 10px 6px",
            }}
          >
            <ScoreChart data={scoreHistory} period={period} />
          </div>
        </div>

        {/* Breakdown */}
        <div>
          <span
            style={{
              display: "block",
              fontSize: "0.68rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--text-muted)",
              marginBottom: 10,
            }}
          >
            Score Breakdown
          </span>
          {domainBreakdown.length === 0 ? (
            <span style={{ fontSize: "0.78rem", color: "var(--text-faint)" }}>
              No activity data yet
            </span>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {domainBreakdown.map((d) => (
                <div key={d.domain}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                      fontSize: "0.78rem",
                    }}
                  >
                    <span style={{ color: "var(--text)", fontWeight: 300 }}>{d.domain}</span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {d.pts} pts · {d.pct}%
                    </span>
                  </div>
                  <ProgressBar value={d.pct} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: activity feed */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            marginBottom: 10,
            flexShrink: 0,
          }}
        >
          Recent Activity
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {visibleActivities.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-faint)",
                fontSize: "0.82rem",
                padding: "32px 0",
              }}
            >
              No activity yet
            </div>
          ) : (
            visibleActivities.map((event) => {
              const delta = formatDelta(event.delta);
              return (
                <div
                  key={event.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: "var(--radius-sm)",
                    transition: "background 0.12s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-faint)",
                      width: 14,
                      flexShrink: 0,
                    }}
                  >
                    {ACTIVITY_ICONS[event.type] ?? <span style={{ fontSize: "0.85rem" }}>·</span>}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: "0.82rem",
                      color: "var(--text)",
                      fontWeight: 300,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {event.description}
                  </span>
                  {delta && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: event.delta > 0 ? "var(--success)" : "var(--accent)",
                        fontWeight: 500,
                        flexShrink: 0,
                      }}
                    >
                      {delta}
                    </span>
                  )}
                  <span style={{ fontSize: "0.68rem", color: "var(--text-faint)", flexShrink: 0 }}>
                    {formatDate(event.timestamp)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
