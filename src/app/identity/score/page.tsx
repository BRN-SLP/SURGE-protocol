"use client";

import { useState } from "react";
import { useSurgeIdentity } from "@/hooks/useSurgeIdentity";
import { useDashboardData } from "@/hooks/useDashboardData";
import { getTierFromScore, getNextTierInfo, TIERS } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { ViewportContainer } from "@/components/layout/ViewportContainer";
import { CompactHeader } from "@/components/layout/CompactHeader";
import { Toggle } from "@/components/ui/Toggle";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

// ─── Simulation actions ───────────────────────────────────────────────────────

interface SimAction {
  id: string;
  label: string;
  pts: number;
  category: string;
  comingSoon?: boolean;
}

// Live actions reflect real oracle scoring (Phase 1).
// oracle.active = 10 pts (any tx in cycle) + oracle.txcount up to 25 pts (20+ txs) = 35 max.
// Coming soon = Phase 2+, not yet implemented in the oracle.
const SIM_ACTIONS: SimAction[] = [
  { id: "wallet_link", label: "Link a wallet to your identity", pts: 20, category: "Identity" },
  {
    id: "active",
    label: "Stay active on-chain this cycle (20+ txs)",
    pts: 35,
    category: "Activity",
  },
  {
    id: "governance",
    label: "Vote in DAO governance",
    pts: 100,
    category: "Governance",
    comingSoon: true,
  },
  { id: "dex", label: "Execute DEX trades", pts: 25, category: "DeFi", comingSoon: true },
  { id: "nft", label: "Mint NFTs", pts: 50, category: "NFT", comingSoon: true },
  {
    id: "crosschain",
    label: "Be active on 5+ chains",
    pts: 200,
    category: "Explorer",
    comingSoon: true,
  },
  {
    id: "streak",
    label: "Maintain 7-day activity streak",
    pts: 0,
    category: "Activity",
    comingSoon: true,
  },
];

// ─── Score Breakdown ──────────────────────────────────────────────────────────

interface BreakdownRow {
  category: string;
  current: number;
  max: number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function tierProgress(score: number) {
  const tier = getTierFromScore(score);
  const config = TIERS[tier];
  const min = config.minScore;
  const max = config.maxScore ?? min + 4000;
  return Math.min(100, ((score - min) / (max - min)) * 100);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScoreSimulatorPage() {
  const { score, tokenId } = useSurgeIdentity();
  const currentScore = Number(score) || 0;
  const { domainBreakdown } = useDashboardData(tokenId);

  const breakdown: BreakdownRow[] = domainBreakdown.map(({ domain, pts }) => ({
    category: domain,
    current: pts,
    max: null,
  }));

  const [toggled, setToggled] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    const action = SIM_ACTIONS.find((a) => a.id === id);
    if (!action || action.comingSoon) return;
    setToggled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const addedPts = SIM_ACTIONS.filter((a) => !a.comingSoon && toggled.has(a.id)).reduce(
    (sum, a) => sum + a.pts,
    0,
  );
  const projectedScore = currentScore + addedPts;

  const currentTier = getTierFromScore(currentScore);
  const projectedTier = getTierFromScore(projectedScore);
  const tierUpgrade = projectedTier !== currentTier;

  const nextFromProjected = getNextTierInfo(projectedScore);
  const currentPct = tierProgress(currentScore);
  const projectedPct = tierProgress(projectedScore);

  return (
    <>
      <Navbar />
      <ViewportContainer style={{ display: "flex", flexDirection: "column" }}>
        <CompactHeader
          title="Score Simulator"
          subtitle="Explore how different actions affect your score"
          back={{ href: "/identity", label: "Dashboard" }}
        />

        {/* ── Score Strip ── */}
        <div
          style={{
            flexShrink: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {/* Current */}
          <div
            style={{
              padding: "16px var(--section-px)",
              borderRight: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--text-faint)",
              }}
            >
              Current Score
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: 300,
                  color: "var(--text-muted)",
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                }}
              >
                {fmt(currentScore)}
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-faint)" }}>
                {TIERS[currentTier].label}
              </span>
            </div>
            <div
              style={{
                height: 3,
                background: "var(--surface-2)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${currentPct}%`,
                  background: "var(--border)",
                  borderRadius: 2,
                }}
              />
            </div>
          </div>

          {/* Projected */}
          <div
            style={{
              padding: "16px var(--section-px)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--text-faint)",
                }}
              >
                Projected Score
              </span>
              {addedPts > 0 && (
                <span style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>
                  +{addedPts} pts
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <AnimatedNumber
                value={projectedScore}
                style={{
                  fontSize: "2rem",
                  fontWeight: 300,
                  color: addedPts > 0 ? "var(--text)" : "var(--text-muted)",
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  transition: "color 0.3s ease",
                }}
              />
              <span
                style={{
                  fontSize: "0.78rem",
                  color: tierUpgrade ? "var(--accent)" : "var(--text-faint)",
                  transition: "color 0.3s ease",
                }}
              >
                {tierUpgrade ? `↑ ${TIERS[projectedTier].label}` : TIERS[projectedTier].label}
              </span>
            </div>
            <div
              style={{
                position: "relative",
                height: 3,
                background: "var(--surface-2)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${projectedPct}%`,
                  background: "var(--text-muted)",
                  borderRadius: 2,
                  transition: "width 0.4s ease",
                }}
              />
              {addedPts > 0 && projectedTier === currentTier && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${currentPct}%`,
                    width: 1,
                    background: "var(--surface-2)",
                  }}
                />
              )}
            </div>
            {nextFromProjected && (
              <div style={{ fontSize: "0.68rem", color: "var(--text-faint)", fontWeight: 300 }}>
                {fmt(nextFromProjected.ptsNeeded)} pts to {TIERS[nextFromProjected.tier].label}
              </div>
            )}
          </div>
        </div>

        {/* ── Main: Actions + Breakdown ── */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 0,
          }}
        >
          {/* Left: action toggles */}
          <div
            style={{
              overflowY: "auto",
              borderRight: "1px solid var(--border)",
              padding: "0 var(--section-px)",
            }}
          >
            <div
              style={{
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--text-faint)",
                padding: "14px 0 10px",
              }}
            >
              If you…
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {SIM_ACTIONS.map((action, i) => {
                const isOn = toggled.has(action.id);
                const soon = !!action.comingSoon;
                return (
                  <div
                    key={action.id}
                    onClick={() => toggle(action.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "10px 0",
                      borderTop: i === 0 ? "none" : "1px solid var(--border)",
                      cursor: soon ? "default" : "pointer",
                      userSelect: "none",
                      opacity: soon ? 0.45 : 1,
                    }}
                  >
                    <Toggle on={isOn} onChange={() => toggle(action.id)} disabled={soon} />
                    <span
                      style={{
                        flex: 1,
                        fontSize: "0.85rem",
                        color: isOn ? "var(--text)" : "var(--text-muted)",
                        fontWeight: 300,
                        transition: "color 0.15s ease",
                      }}
                    >
                      {action.label}
                    </span>
                    {soon ? (
                      <span
                        style={{
                          fontSize: "0.58rem",
                          color: "var(--text-faint)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          border: "1px solid var(--border)",
                          padding: "1px 5px",
                        }}
                      >
                        Soon
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--text-faint)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {action.category}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "0.82rem",
                        color: soon
                          ? "var(--text-faint)"
                          : isOn
                            ? "var(--text)"
                            : "var(--text-faint)",
                        fontWeight: 300,
                        minWidth: 32,
                        textAlign: "right",
                        transition: "color 0.15s ease",
                      }}
                    >
                      {action.pts > 0 ? `+${action.pts}` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: score breakdown — always visible */}
          <div style={{ overflowY: "auto", padding: "0 20px" }}>
            <div
              style={{
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--text-faint)",
                padding: "14px 0 10px",
              }}
            >
              Score Breakdown
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {breakdown.map((row, i) => {
                const utilPct = row.max ? Math.round((row.current / row.max) * 100) : null;
                const isZero = row.current === 0;
                const isNearCap = utilPct !== null && utilPct >= 80;

                return (
                  <div
                    key={row.category}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 0",
                      borderTop: i === 0 ? "none" : "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        fontSize: "0.78rem",
                        color: isZero ? "var(--text-faint)" : "var(--text-muted)",
                        fontWeight: 300,
                      }}
                    >
                      {row.category}
                      {isZero && (
                        <span
                          style={{
                            fontSize: "0.58rem",
                            color: "var(--accent)",
                            marginLeft: 7,
                            letterSpacing: "0.06em",
                          }}
                        >
                          ·
                        </span>
                      )}
                    </span>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: isZero ? "var(--text-faint)" : "var(--text)",
                        fontWeight: 300,
                        minWidth: 32,
                        textAlign: "right",
                      }}
                    >
                      {row.current}
                    </span>
                    {utilPct !== null ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, width: 56 }}>
                        <div
                          style={{
                            flex: 1,
                            height: 2,
                            background: "var(--surface-2)",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${utilPct}%`,
                              background: isZero
                                ? "var(--border)"
                                : isNearCap
                                  ? "var(--text-muted)"
                                  : "var(--text-faint)",
                              borderRadius: 1,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "0.62rem",
                            color: "var(--text-faint)",
                            minWidth: 24,
                            textAlign: "right",
                          }}
                        >
                          {utilPct}%
                        </span>
                      </div>
                    ) : (
                      <span
                        style={{
                          fontSize: "0.62rem",
                          color: "var(--text-faint)",
                          width: 56,
                          textAlign: "right",
                        }}
                      >
                        —
                      </span>
                    )}
                  </div>
                );
              })}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 0",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    flex: 1,
                    fontSize: "0.72rem",
                    color: "var(--text-faint)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Total
                </span>
                <span style={{ fontSize: "0.88rem", color: "var(--text)", fontWeight: 300 }}>
                  {breakdown.reduce((s, r) => s + r.current, 0).toLocaleString()}
                </span>
                <span style={{ width: 56 }} />
              </div>
            </div>
          </div>
        </div>
      </ViewportContainer>
    </>
  );
}
