"use client";

import { useState, useRef, type ReactNode } from "react";
import { Coins, Vote, Award, Link, CheckCircle2, Package, Code2, TrendingUp } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { ActivityEvent } from "@/types";
import type { ChainScore } from "@/hooks/useChainScores";

interface ScorePulseTabProps {
  activities: ActivityEvent[];
  scoreHistory: { date: string; score: number }[];
  domainBreakdown: { domain: string; pct: number; pts: number }[];
  currentScore: number;
  chainScores?: ChainScore[];
}

const PERIOD_FILTERS = ["7D", "30D", "90D", "ALL"];

const ACTIVITY_ICONS: Record<string, ReactNode> = {
  defi: <Coins size={13} strokeWidth={1.25} />,
  governance: <Vote size={13} strokeWidth={1.25} />,
  badge_earned: <Award size={13} strokeWidth={1.25} />,
  wallet_linked: <Link size={13} strokeWidth={1.25} />,
  quest_completed: <CheckCircle2 size={13} strokeWidth={1.25} />,
  drop_claimed: <Package size={13} strokeWidth={1.25} />,
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
  const H = 120;
  const PAD = { top: 10, right: 10, bottom: 20, left: 10 };

  if (filtered.length < 2) return null;

  const minScore = Math.min(...filtered.map((d) => d.score));
  const maxScore = Math.max(...filtered.map((d) => d.score));
  const range = maxScore - minScore || 1;

  const points = filtered.map((d, i) => ({
    x: PAD.left + (i / (filtered.length - 1)) * (W - PAD.left - PAD.right),
    y: PAD.top + (1 - (d.score - minScore) / range) * (H - PAD.top - PAD.bottom),
    score: d.score,
    date: d.date,
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
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path d={areaD} fill="url(#areaGrad)" />
        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Hit areas + dots */}
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
        {/* Crosshair */}
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
      {/* Tooltip */}
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
            padding: "5px 10px",
            fontSize: "0.75rem",
            color: "var(--text)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {hovered.score.toLocaleString()} pts · {hovered.date}
        </div>
      )}
    </div>
  );
}

export function ScorePulseTab({
  activities,
  scoreHistory,
  domainBreakdown,
  currentScore,
  chainScores,
}: ScorePulseTabProps) {
  const [period, setPeriod] = useState("ALL");
  const [showAll, setShowAll] = useState(false);

  const visibleActivities = showAll ? activities : activities.slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Activity Feed */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
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
            Recent Activity
          </span>
          {!showAll && activities.length > 5 && (
            <button
              onClick={() => setShowAll(true)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "0.75rem",
                cursor: "pointer",
                padding: 0,
              }}
            >
              View all →
            </button>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {visibleActivities.map((event) => {
            const delta = formatDelta(event.delta);
            return (
              <div
                key={event.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  transition: "background 0.12s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span
                  style={{
                    width: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-faint)",
                    flexShrink: 0,
                  }}
                >
                  {ACTIVITY_ICONS[event.type] ?? <span style={{ fontSize: "0.9rem" }}>·</span>}
                </span>
                <span
                  style={{ flex: 1, fontSize: "0.85rem", color: "var(--text)", fontWeight: 300 }}
                >
                  {event.description}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
                  {event.chain}
                </span>
                {delta && (
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: event.delta > 0 ? "var(--success)" : "var(--accent)",
                      fontWeight: 500,
                      minWidth: 36,
                      textAlign: "right",
                    }}
                  >
                    {delta}
                  </span>
                )}
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-faint)",
                    minWidth: 48,
                    textAlign: "right",
                  }}
                >
                  {formatDate(event.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score History Chart */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
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
            Score History
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {PERIOD_FILTERS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: "3px 10px",
                  fontSize: "0.7rem",
                  background: period === p ? "var(--surface-2)" : "none",
                  border: `1px solid ${period === p ? "var(--border-hover)" : "transparent"}`,
                  borderRadius: "var(--radius-sm)",
                  color: period === p ? "var(--text)" : "var(--text-faint)",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.04em",
                  transition: "all 0.15s ease",
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
            padding: "16px 12px 8px",
          }}
        >
          <ScoreChart data={scoreHistory} period={period} />
        </div>
      </div>

      {/* Chain Scores */}
      {chainScores && chainScores.length > 0 && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
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
              Chain Scores
            </span>
            <span
              style={{ fontSize: "0.7rem", color: "var(--text-faint)", letterSpacing: "0.04em" }}
            >
              {currentScore.toLocaleString()} pts total
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {chainScores.map((c) => {
              const pct = currentScore > 0 ? Math.round((c.score / currentScore) * 100) : 0;
              return (
                <div
                  key={c.chainKey}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "7px 0",
                    borderBottom: "1px solid var(--border)",
                    opacity: c.score === 0 ? 0.45 : 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-faint)",
                      minWidth: 60,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {c.shortName}
                    {!c.hasSubgraph && (
                      <span
                        style={{
                          fontSize: "0.58rem",
                          color: "var(--text-faint)",
                          marginLeft: 4,
                          letterSpacing: "0.06em",
                        }}
                      >
                        live
                      </span>
                    )}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: "var(--surface-2)",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    {c.score > 0 && (
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: "var(--text-faint)",
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: c.score > 0 ? "var(--text)" : "var(--text-faint)",
                      minWidth: 56,
                      textAlign: "right",
                      fontWeight: 300,
                    }}
                  >
                    {c.score > 0 ? `${c.score.toLocaleString()} pts` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Domain Breakdown */}
      <div>
        <span
          style={{
            display: "block",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
            marginBottom: 16,
          }}
        >
          Score Breakdown
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {domainBreakdown.map((d) => (
            <div key={d.domain}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  fontSize: "0.8rem",
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
      </div>
    </div>
  );
}
