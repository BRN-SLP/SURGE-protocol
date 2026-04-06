"use client";

import { useState, useMemo } from "react";
import type { SimulatorAction } from "@/types";
import { getTierFromScore, getNextTierInfo } from "@/types";

const SIMULATOR_ACTIONS: SimulatorAction[] = [
  {
    id: "s1",
    title: "Bridge to new chain",
    description: "Move assets to a chain you haven't used",
    scoreDelta: 45,
    category: "Explorer",
    enabled: false,
  },
  {
    id: "s2",
    title: "Vote on governance",
    description: "Cast a vote in DAO governance",
    scoreDelta: 30,
    category: "Governance",
    enabled: false,
  },
  {
    id: "s3",
    title: "Provide liquidity",
    description: "Add liquidity to a DEX pool",
    scoreDelta: 80,
    category: "DeFi",
    enabled: false,
  },
  {
    id: "s4",
    title: "Deploy a contract",
    description: "Deploy and verify a smart contract",
    scoreDelta: 120,
    category: "Builder",
    enabled: false,
  },
  {
    id: "s5",
    title: "Link another wallet",
    description: "Add a secondary wallet to your identity",
    scoreDelta: 50,
    category: "Identity",
    enabled: false,
  },
  {
    id: "s6",
    title: "Complete a quest",
    description: "Finish an active quest",
    scoreDelta: 100,
    category: "Quests",
    enabled: false,
  },
  {
    id: "s7",
    title: "Stake ETH",
    description: "Stake ETH via a liquid staking protocol",
    scoreDelta: 60,
    category: "DeFi",
    enabled: false,
  },
  {
    id: "s8",
    title: "ENS / Lens profile",
    description: "Link your ENS or Lens profile",
    scoreDelta: 40,
    category: "Social",
    enabled: false,
  },
];

export function useScoreSimulator(currentScore: number) {
  const [actions, setActions] = useState<SimulatorAction[]>(SIMULATOR_ACTIONS);

  const toggle = (id: string) => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  };

  const projectedScore = useMemo(
    () => currentScore + actions.filter((a) => a.enabled).reduce((sum, a) => sum + a.scoreDelta, 0),
    [actions, currentScore],
  );

  const projectedTier = getTierFromScore(projectedScore);
  const nextTierInfo = getNextTierInfo(projectedScore);
  const totalDelta = projectedScore - currentScore;

  const recommendations = useMemo(
    () =>
      [...actions]
        .filter((a) => !a.enabled)
        .sort((a, b) => b.scoreDelta - a.scoreDelta)
        .slice(0, 3),
    [actions],
  );

  return {
    actions,
    toggle,
    projectedScore,
    projectedTier,
    nextTierInfo,
    totalDelta,
    recommendations,
  };
}
