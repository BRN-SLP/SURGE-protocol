"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Search } from "lucide-react";
import { graphClient } from "@/lib/graph";
import { getTierFromScore, TIERS, type Tier } from "@/types";
import { ScrollableRegion } from "@/components/layout/ScrollableRegion";

// ─── Types ────────────────────────────────────────────────────

interface LeaderEntry {
  rank: number;
  address: string;
  tokenId: number;
  score: number;
  tier: Tier;
  badgeCount: number;
}

// ─── GraphQL ──────────────────────────────────────────────────

const LEADERBOARD_QUERY = `
  query Leaderboard($first: Int!, $skip: Int!) {
    identities(orderBy: score, orderDirection: desc, first: $first, skip: $skip) {
      id
      owner
      score
      badges { id }
    }
    protocol(id: "global") {
      totalIdentities
    }
  }
`;

interface GraphLeaderEntry {
  id: string;
  owner: string;
  score: string;
  badges: { id: string }[];
}

interface GraphLeaderResult {
  identities: GraphLeaderEntry[];
  protocol: { totalIdentities: string } | null;
}

function fmt(n: number) {
  return n.toLocaleString();
}

function shorten(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

// ─── Sidebar cards ────────────────────────────────────────────

function YourRankCard({
  rank,
  total,
  score,
  tier,
}: {
  rank: number;
  total: number;
  score: number;
  tier: Tier;
}) {
  const pct = ((rank / Math.max(total, 1)) * 100).toFixed(1);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-faint)",
          marginBottom: 14,
        }}
      >
        Your Rank
      </div>
      <div
        style={{
          fontSize: "3rem",
          fontWeight: 300,
          color: "var(--text)",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        #{fmt(rank)}
      </div>
      <div style={{ fontSize: "0.8rem", color: "var(--text-faint)", marginBottom: 18 }}>
        out of {fmt(total)}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Score: {fmt(score)}</span>
        <span style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>·</span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{TIERS[tier].label}</span>
      </div>
      <div style={{ fontSize: "1rem", fontWeight: 400, color: "var(--text-muted)" }}>
        Top {pct}%
      </div>
    </div>
  );
}

function ConnectPromptCard() {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-faint)",
          marginBottom: 16,
        }}
      >
        Your Rank
      </div>
      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
        Connect wallet to see your rank
      </div>
    </div>
  );
}

function StatsCard({ total }: { total: number }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-faint)",
          marginBottom: 14,
        }}
      >
        Protocol Stats
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>Identities</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text)" }}>{fmt(total)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>Network</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text)" }}>Base Sepolia</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────

const PAGE_SIZE = 50;

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { address: connectedAddress } = useAccount();
  const router = useRouter();

  useEffect(() => {
    graphClient
      .request<GraphLeaderResult>(LEADERBOARD_QUERY, { first: 1000, skip: 0 })
      .then(({ identities, protocol }) => {
        const built: LeaderEntry[] = identities.map((e, i) => ({
          rank: i + 1,
          address: e.owner,
          tokenId: Number(e.id),
          score: Number(e.score),
          tier: getTierFromScore(Number(e.score)),
          badgeCount: e.badges.length,
        }));
        setEntries(built);
        setTotal(protocol ? Number(protocol.totalIdentities) : built.length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const myEntry = connectedAddress
    ? entries.find((e) => e.address.toLowerCase() === connectedAddress.toLowerCase())
    : null;

  const filtered = entries.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return e.address.toLowerCase().includes(q) || String(e.tokenId).includes(q);
  });

  const paged = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paged.length < filtered.length;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .lb-layout { flex-direction: column !important; }
          .lb-sidebar { width: 100% !important; flex-direction: row !important; flex-wrap: wrap; }
          .lb-sidebar > * { flex: 1; min-width: 200px; }
          .lb-col-badges { display: none !important; }
          .lb-row, .lb-header-row {
            grid-template-columns: 2.5rem 1fr 7rem 6rem !important;
          }
        }
      `}</style>

      <div
        className="lb-layout"
        style={{
          flex: 1,
          display: "flex",
          gap: 24,
          overflow: "hidden",
          padding: "16px var(--section-px)",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Sidebar */}
        <div
          className="lb-sidebar"
          style={{
            width: 260,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflowY: "auto",
          }}
        >
          {myEntry ? (
            <YourRankCard
              rank={myEntry.rank}
              total={total}
              score={myEntry.score}
              tier={myEntry.tier}
            />
          ) : (
            <ConnectPromptCard />
          )}
          <StatsCard total={total} />
        </div>

        {/* Main */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Filter bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 12,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-faint)",
              }}
            >
              All-time · Base Sepolia
            </span>

            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-faint)",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Search size={13} strokeWidth={1.25} />
              </span>
              <input
                type="text"
                placeholder="Search address or ID"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{
                  paddingLeft: 28,
                  paddingRight: 12,
                  paddingTop: 5,
                  paddingBottom: 5,
                  fontSize: "0.78rem",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text)",
                  outline: "none",
                  width: 200,
                  fontFamily: "inherit",
                  fontWeight: 300,
                }}
              />
            </div>
          </div>

          {/* Table header */}
          <div
            className="lb-header-row"
            style={{
              display: "grid",
              gridTemplateColumns: "3rem 1fr 8rem 6rem 4rem",
              gap: 8,
              padding: "8px 12px 8px 16px",
              borderBottom: "1px solid var(--border)",
              fontSize: "0.62rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-faint)",
              fontWeight: 300,
              flexShrink: 0,
            }}
          >
            <span>Rank</span>
            <span>Identity</span>
            <span>Tier</span>
            <span style={{ textAlign: "right" }}>Score</span>
            <span className="lb-col-badges" style={{ textAlign: "right" }}>
              Badges
            </span>
          </div>

          {/* Rows */}
          <ScrollableRegion>
            {loading && (
              <div
                style={{
                  padding: "64px 0",
                  textAlign: "center",
                  color: "var(--text-faint)",
                  fontSize: "0.85rem",
                }}
              >
                Loading…
              </div>
            )}

            {!loading && entries.length === 0 && (
              <div
                style={{
                  padding: "64px 0",
                  textAlign: "center",
                  color: "var(--text-faint)",
                  fontSize: "0.85rem",
                }}
              >
                No identities found on-chain yet
              </div>
            )}

            {paged.map((entry) => {
              const isMe =
                connectedAddress && entry.address.toLowerCase() === connectedAddress.toLowerCase();
              const tier = TIERS[entry.tier];
              const isTop3 = entry.rank <= 3;

              return (
                <div
                  key={entry.tokenId}
                  className="lb-row"
                  onClick={() => router.push(`/verify/${entry.tokenId}`)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "3rem 1fr 8rem 6rem 4rem",
                    gap: 8,
                    padding: "13px 12px 13px 16px",
                    borderBottom: "1px solid var(--border)",
                    background: isMe ? "rgba(220,51,51,0.07)" : "transparent",
                    cursor: "pointer",
                    alignItems: "center",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isMe)
                      (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = isMe
                      ? "rgba(220,51,51,0.07)"
                      : "transparent";
                  }}
                >
                  <span
                    style={{
                      fontSize: isTop3 ? "1rem" : "0.88rem",
                      fontWeight: isTop3 ? 400 : 300,
                      color: "var(--text)",
                    }}
                  >
                    #{entry.rank}
                  </span>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-muted)",
                          fontWeight: 300,
                        }}
                      >
                        Identity{" "}
                        <span
                          style={{
                            fontFamily: "monospace",
                            color: isMe ? "var(--accent)" : "var(--text)",
                          }}
                        >
                          #{entry.tokenId}
                        </span>
                      </span>
                      {isMe && (
                        <span
                          style={{
                            fontSize: "0.58rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "var(--accent)",
                            border: "1px solid var(--accent)",
                            padding: "1px 5px",
                            borderRadius: "var(--radius-sm)",
                          }}
                        >
                          You
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-faint)",
                        fontFamily: "monospace",
                      }}
                    >
                      {shorten(entry.address)}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: tier.color,
                      border: `1px solid ${tier.color}40`,
                      padding: "3px 8px",
                      borderRadius: "var(--radius-sm)",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                    }}
                  >
                    {tier.label}
                  </span>

                  <span
                    style={{
                      textAlign: "right",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      color: "var(--text)",
                      fontFamily: "monospace",
                    }}
                  >
                    {fmt(entry.score)}
                  </span>

                  <span
                    className="lb-col-badges"
                    style={{
                      textAlign: "right",
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    {entry.badgeCount}
                  </span>
                </div>
              );
            })}

            {hasMore && (
              <div style={{ paddingTop: 32, textAlign: "center" }}>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  style={{
                    padding: "10px 32px",
                    fontSize: "0.72rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    background: "transparent",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 300,
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.color = "var(--text)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                >
                  Show more ({filtered.length - paged.length} remaining)
                </button>
              </div>
            )}

            {!loading && filtered.length === 0 && entries.length > 0 && (
              <div
                style={{
                  padding: "80px 0",
                  textAlign: "center",
                  color: "var(--text-faint)",
                  fontSize: "0.85rem",
                }}
              >
                No identities match your search
              </div>
            )}
          </ScrollableRegion>
        </div>
      </div>
    </>
  );
}
