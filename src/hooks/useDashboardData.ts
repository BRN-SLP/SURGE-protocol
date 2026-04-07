"use client";

import { useState, useEffect } from "react";
import { getGraphClient } from "@/lib/graph";
import { SUBGRAPH_CHAINS } from "@/lib/chains";
import type { ActivityEvent, Badge, QuestInfo, QuestStatus, TimelineEvent } from "@/types";

// ── GraphQL query ─────────────────────────────────────────────

const IDENTITY_QUERY = `
  query IdentityData($id: ID!) {
    identity(id: $id) {
      id
      score
      mintedAt
      activities(orderBy: timestamp, orderDirection: desc, first: 50) {
        id
        type
        amount
        reason
        issuer
        timestamp
        blockNumber
        txHash
      }
      badges {
        id
        badgeType { id name scoreThreshold }
        claimedAt
        claimTx
      }
      scoreSnapshots(orderBy: timestamp, orderDirection: asc, first: 200) {
        id
        score
        delta
        reason
        timestamp
      }
    }
  }
`;

// ── Type helpers ──────────────────────────────────────────────

function tsToDateStr(ts: string): string {
  return new Date(Number(ts) * 1000).toISOString();
}

function tsToDate(ts: string): string {
  return new Date(Number(ts) * 1000).toISOString().split("T")[0];
}

function reasonToDescription(reason: string, type: string): string {
  if (reason && reason.length > 0) return reason;
  return type === "score_added" ? "Score added" : "Score slashed";
}

function thresholdToRarity(threshold: string): Badge["rarity"] {
  const t = Number(threshold);
  if (t >= 5000) return "legendary";
  if (t >= 2000) return "epic";
  if (t >= 500) return "rare";
  return "common";
}

// ── Quest computation ─────────────────────────────────────────

function questStatus(progress: number, max: number): QuestStatus {
  if (progress >= max) return "completed";
  if (progress > 0) return "active";
  return "locked";
}

function computeQuests(activities: GraphActivity[], walletCount: number): QuestInfo[] {
  const count = (test: (r: string) => boolean) =>
    activities.filter((a) => test(a.reason.toLowerCase())).length;

  const defi = count((r) => r.includes("defi") || r.includes("swap") || r.includes("liquidity"));
  const gov = count((r) => r.includes("gov") || r.includes("vote"));
  const explorer = count((r) => r.includes("chain") || r.includes("bridge") || r.includes("cross"));
  const builder = count(
    (r) => r.includes("deploy") || r.includes("build") || r.includes("contract"),
  );

  return [
    {
      id: "q1",
      title: "DeFi Pioneer",
      description: "Perform 10 DeFi transactions on Base",
      progress: Math.min(defi, 10),
      maxProgress: 10,
      reward: 500,
      status: questStatus(defi, 10),
      category: "defi",
    },
    {
      id: "q2",
      title: "Governance Voice",
      description: "Cast 5 governance votes",
      progress: Math.min(gov, 5),
      maxProgress: 5,
      reward: 300,
      status: questStatus(gov, 5),
      category: "governance",
    },
    {
      id: "q3",
      title: "Chain Explorer",
      description: "Bridge to 3 different chains",
      progress: Math.min(explorer, 3),
      maxProgress: 3,
      reward: 300,
      status: questStatus(explorer, 3),
      category: "onchain",
    },
    {
      id: "q4",
      title: "Multi-Wallet",
      description: "Link 3 wallets to your identity",
      progress: Math.min(walletCount, 3),
      maxProgress: 3,
      reward: 200,
      status: questStatus(walletCount, 3),
      category: "identity",
    },
    {
      id: "q5",
      title: "Builder Initiate",
      description: "Deploy a smart contract",
      progress: Math.min(builder, 1),
      maxProgress: 1,
      reward: 750,
      status: questStatus(builder, 1),
      category: "builder",
    },
  ];
}

// ── Hook ──────────────────────────────────────────────────────

export function useDashboardData(tokenId?: bigint, walletCount = 1) {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [quests, setQuests] = useState<QuestInfo[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [scoreHistory, setScoreHistory] = useState<{ date: string; score: number }[]>([]);
  const [domainBreakdown, setDomainBreakdown] = useState<
    { domain: string; pct: number; pts: number }[]
  >([]);
  const [mintedAt, setMintedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokenId || tokenId === 0n) return;

    setLoading(true);
    const id = tokenId.toString();

    // Query all subgraph chains in parallel; a single chain failure doesn't break the dashboard.
    Promise.allSettled(
      SUBGRAPH_CHAINS.map((chain) =>
        getGraphClient(chain)
          .request<{ identity: GraphIdentity | null }>(IDENTITY_QUERY, { id })
          .then((data) => ({ chain, identity: data.identity })),
      ),
    )
      .then((results) => {
        const allActivities: ActivityEvent[] = [];
        const allBadgeIds = new Set<string>();
        const allBadges: Badge[] = [];
        const allTimeline: TimelineEvent[] = [];
        const allActivitiesRaw: GraphActivity[] = [];
        const domainPts: Record<string, number> = {
          DeFi: 0,
          Builder: 0,
          Governance: 0,
          Explorer: 0,
          Other: 0,
        };

        // Base Sepolia score history used for the chart (canonical chain)
        let baseScoreHistory: { date: string; score: number }[] = [];
        let firstMintedAt: string | null = null;

        for (const result of results) {
          if (result.status === "rejected") continue;
          const { chain, identity } = result.value;
          if (!identity) continue;

          const chainLabel = chain.shortName;

          // MintedAt — use first chain that has it
          if (!firstMintedAt) {
            firstMintedAt = tsToDateStr(identity.mintedAt);
          }

          // Score history — use Base Sepolia only for the chart
          if (chain.key === "base-sepolia") {
            const history = identity.scoreSnapshots.map((s) => ({
              date: tsToDateStr(s.timestamp),
              score: Number(s.score),
            }));
            baseScoreHistory = [{ date: tsToDateStr(identity.mintedAt), score: 0 }, ...history];
          }

          // Activities
          for (const a of identity.activities) {
            allActivities.push({
              id: `${chain.key}-${a.id}`,
              type: "score_change",
              delta: a.type === "score_added" ? Number(a.amount) : -Number(a.amount),
              description: reasonToDescription(a.reason, a.type),
              chain: chainLabel,
              timestamp: tsToDateStr(a.timestamp),
            });
            allActivitiesRaw.push(a);

            // Domain breakdown
            if (a.type === "score_added") {
              const pts = Number(a.amount);
              const r = a.reason.toLowerCase();
              if (r.includes("defi") || r.includes("liquidity") || r.includes("swap"))
                domainPts.DeFi += pts;
              else if (r.includes("deploy") || r.includes("build") || r.includes("contract"))
                domainPts.Builder += pts;
              else if (r.includes("gov") || r.includes("vote")) domainPts.Governance += pts;
              else if (r.includes("chain") || r.includes("bridge") || r.includes("cross"))
                domainPts.Explorer += pts;
              else domainPts.Other += pts;
            }
          }

          // Badges — dedup by badgeType id across chains
          for (const b of identity.badges) {
            const dedupeKey = b.badgeType.id;
            if (allBadgeIds.has(dedupeKey)) continue;
            allBadgeIds.add(dedupeKey);
            allBadges.push({
              id: `${chain.key}-${b.id}`,
              name: b.badgeType.name,
              description: `Score threshold: ${b.badgeType.scoreThreshold}`,
              category: "official",
              rarity: thresholdToRarity(b.badgeType.scoreThreshold),
              earnedAt: tsToDate(b.claimedAt),
              icon: "award",
            });
          }

          // Timeline events
          for (const a of identity.activities) {
            allTimeline.push({
              id: `${chain.key}-act-${a.id}`,
              type: "score_change" as const,
              title: a.type === "score_added" ? `+${a.amount} points` : `-${a.amount} points`,
              description: reasonToDescription(a.reason, a.type),
              date: tsToDate(a.timestamp),
              scoreDelta: a.type === "score_added" ? Number(a.amount) : -Number(a.amount),
              chain: chainLabel,
            });
          }

          for (const b of identity.badges) {
            allTimeline.push({
              id: `${chain.key}-badge-${b.id}`,
              type: "badge_earned" as const,
              title: `Badge: ${b.badgeType.name}`,
              description: `Claimed on ${chainLabel}`,
              date: tsToDate(b.claimedAt),
              chain: chainLabel,
            });
          }

          // Mint event — only from first chain
          if (chain.key === "base-sepolia") {
            allTimeline.push({
              id: `mint-${identity.id}`,
              type: "milestone" as const,
              title: "Identity Created",
              description: `SURGE Identity #${identity.id} minted`,
              date: tsToDate(identity.mintedAt),
            });
          }
        }

        // Sort activities and timeline by timestamp desc
        allActivities.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        allTimeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const total = Object.values(domainPts).reduce((s, v) => s + v, 0) || 1;
        const breakdown = Object.entries(domainPts)
          .filter(([, pts]) => pts > 0)
          .map(([domain, pts]) => ({ domain, pts, pct: Math.round((pts / total) * 100) }));

        setActivities(allActivities);
        setBadges(allBadges);
        setTimeline(allTimeline);
        setScoreHistory(baseScoreHistory);
        setDomainBreakdown(breakdown);
        setMintedAt(firstMintedAt);
        setQuests(computeQuests(allActivitiesRaw, walletCount));
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [tokenId, walletCount]);

  return {
    activities,
    badges,
    quests,
    timeline,
    scoreHistory,
    domainBreakdown,
    mintedAt,
    loading,
    error,
  };
}

// ── Internal graph types ──────────────────────────────────────

interface GraphActivity {
  id: string;
  type: string;
  amount: string;
  reason: string;
  issuer: string;
  timestamp: string;
  blockNumber: string;
  txHash: string;
}

interface GraphBadgeClaim {
  id: string;
  badgeType: { id: string; name: string; scoreThreshold: string };
  claimedAt: string;
  claimTx: string;
}

interface GraphSnapshot {
  id: string;
  score: string;
  delta: string;
  reason: string;
  timestamp: string;
}

interface GraphIdentity {
  id: string;
  score: string;
  mintedAt: string;
  activities: GraphActivity[];
  badges: GraphBadgeClaim[];
  scoreSnapshots: GraphSnapshot[];
}
