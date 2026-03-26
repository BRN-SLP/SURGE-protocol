export type Tier = "newcomer" | "explorer" | "contributor" | "veteran" | "legend";

export interface TierConfig {
  label: string;
  minScore: number;
  maxScore: number | null;
  color: string;
  gradient: string;
  glowColor: string;
  dots: number; // filled dots out of 5
}

export const TIERS: Record<Tier, TierConfig> = {
  newcomer: {
    label: "Newcomer",
    minScore: 0,
    maxScore: 499,
    color: "#64748b",
    gradient: "from-slate-600 to-slate-500",
    glowColor: "rgba(100, 116, 139, 0.3)",
    dots: 1,
  },
  explorer: {
    label: "Explorer",
    minScore: 500,
    maxScore: 1499,
    color: "#6366f1",
    gradient: "from-indigo-600 to-indigo-500",
    glowColor: "rgba(99, 102, 241, 0.3)",
    dots: 2,
  },
  contributor: {
    label: "Contributor",
    minScore: 1500,
    maxScore: 3999,
    color: "#8b5cf6",
    gradient: "from-violet-600 to-indigo-500",
    glowColor: "rgba(139, 92, 246, 0.35)",
    dots: 3,
  },
  veteran: {
    label: "Veteran",
    minScore: 4000,
    maxScore: 7999,
    color: "#06b6d4",
    gradient: "from-cyan-500 via-violet-500 to-indigo-500",
    glowColor: "rgba(6, 182, 212, 0.4)",
    dots: 4,
  },
  legend: {
    label: "Legend",
    minScore: 8000,
    maxScore: null,
    color: "#f59e0b",
    gradient: "from-amber-400 via-violet-500 to-indigo-500",
    glowColor: "rgba(245, 158, 11, 0.5)",
    dots: 5,
  },
};

export function getTierFromScore(score: number): Tier {
  if (score >= 8000) return "legend";
  if (score >= 4000) return "veteran";
  if (score >= 1500) return "contributor";
  if (score >= 500) return "explorer";
  return "newcomer";
}

export function getNextTierInfo(score: number): { tier: Tier; ptsNeeded: number } | null {
  if (score >= 8000) return null;
  if (score >= 4000) return { tier: "legend", ptsNeeded: 8000 - score };
  if (score >= 1500) return { tier: "veteran", ptsNeeded: 4000 - score };
  if (score >= 500) return { tier: "contributor", ptsNeeded: 1500 - score };
  return { tier: "explorer", ptsNeeded: 500 - score };
}

export interface IdentityCardData {
  id: number;
  tier: Tier;
  score: number;
  walletCount: number;
  chainCount: number;
  badgeCount: number;
  streakDays: number;
  memberSince: string; // e.g. "Jan 2024"
  defiPct: number; // 0–100
  builderPct: number;
  govPct: number;
}

export interface WalletScore {
  address: string;
  score: number;
  tier: Tier;
  txCount: number;
  chainCount: number;
  defiScore: number;
  governanceScore: number;
  builderScore: number;
}

export interface CombinedScore {
  wallets: WalletScore[];
  individualTotal: number;
  linkingBonus: number;
  crossChainBonus: number;
  combinedScore: number;
  tier: Tier;
  nextTier: { tier: Tier; ptsNeeded: number } | null;
}
