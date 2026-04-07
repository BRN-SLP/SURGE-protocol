export type Tier = "newcomer" | "explorer" | "contributor" | "veteran" | "legend";

export interface TierConfig {
  label: string;
  minScore: number;
  maxScore: number | null;
  color: string;
  glowColor: string;
  dots: number; // filled dots out of 5
}

export const TIERS: Record<Tier, TierConfig> = {
  newcomer: {
    label: "Newcomer",
    minScore: 0,
    maxScore: 499,
    color: "#777777",
    glowColor: "rgba(120, 120, 120, 0.2)",
    dots: 1,
  },
  explorer: {
    label: "Explorer",
    minScore: 500,
    maxScore: 1499,
    color: "#4d8eff",
    glowColor: "rgba(77, 142, 255, 0.25)",
    dots: 2,
  },
  contributor: {
    label: "Contributor",
    minScore: 1500,
    maxScore: 3999,
    color: "#a066dd",
    glowColor: "rgba(160, 102, 221, 0.25)",
    dots: 3,
  },
  veteran: {
    label: "Veteran",
    minScore: 4000,
    maxScore: 7999,
    color: "#22b5cc",
    glowColor: "rgba(34, 181, 204, 0.3)",
    dots: 4,
  },
  legend: {
    label: "Legend",
    minScore: 8000,
    maxScore: null,
    color: "#f0aa20",
    glowColor: "rgba(240, 170, 32, 0.35)",
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
  streakDays?: number;
  memberSince?: string; // e.g. "Jan 2024"
  defiPct?: number; // 0–100
  builderPct?: number;
  govPct?: number;
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

// ── Wallet Management ────────────────────────────────────────

export type WalletRole = "primary" | "security" | "regular";
export type WalletStatus = "active" | "frozen" | "compromised" | "pending";

export interface WalletInfo {
  address: string;
  role: WalletRole;
  status: WalletStatus;
  score: number;
  txCount: number;
  chains: string[]; // e.g. ["Ethereum", "Base", "OP"]
  linkedSince: string; // e.g. "Jan 2024"
  isCurrentWallet?: boolean;
}

// ── Badges ───────────────────────────────────────────────────

export type BadgeCategory = "official" | "partner" | "heritage" | "seasonal";
export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  earnedAt?: string; // ISO date string, undefined = not earned
  progress?: number; // 0–100, for in-progress badges
  maxProgress?: number;
  icon: string; // emoji or icon identifier
}

// ── Quests ───────────────────────────────────────────────────

export type QuestStatus = "active" | "completed" | "locked";

export interface QuestInfo {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: number; // score points
  status: QuestStatus;
  category: string;
}

// ── Activity Feed ────────────────────────────────────────────

export type ActivityType =
  | "score_change"
  | "badge_earned"
  | "wallet_linked"
  | "quest_completed"
  | "drop_claimed"
  | "governance"
  | "defi"
  | "builder";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  delta: number; // positive or negative score change
  description: string;
  chain: string;
  timestamp: string; // ISO date string
}

// ── Timeline ─────────────────────────────────────────────────

export type TimelineEventType =
  | "milestone"
  | "score_change"
  | "badge_earned"
  | "wallet_event"
  | "quest_completed";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  date: string; // ISO date string
  scoreDelta?: number;
  chain?: string;
}

// ── Score Simulator ──────────────────────────────────────────

export interface SimulatorAction {
  id: string;
  title: string;
  description: string;
  scoreDelta: number;
  category: string;
  enabled: boolean;
}

// ── Verification ─────────────────────────────────────────────

export type VerifyStatus = "found" | "not_found" | "invalid" | "loading" | "idle";

export interface VerifyResult {
  status: VerifyStatus;
  identity?: IdentityCardData & {
    address: string;
    walletCount: number;
    chainCount: number;
  };
}
