"use client";

import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { CHAIN_CONFIGS, type ChainKey } from "@/lib/chains";
import { SURGE_SCORE_ADDRESS, surgeScoreAbi } from "@/lib/contracts";

export interface ChainScore {
  chainKey: ChainKey;
  chainName: string;
  shortName: string;
  chainId: number;
  score: number;
  hasSubgraph: boolean;
  status: "success" | "failure" | "pending";
}

export function useChainScores(address: `0x${string}` | undefined): {
  chainScores: ChainScore[];
  totalScore: number;
  isLoading: boolean;
} {
  const contracts = useMemo(
    () =>
      CHAIN_CONFIGS.map((chain) => ({
        address: SURGE_SCORE_ADDRESS as `0x${string}`,
        abi: surgeScoreAbi,
        functionName: "scoreOfAddress" as const,
        args: address ? ([address] as const) : ([] as unknown as readonly [`0x${string}`]),
        chainId: chain.chainId,
      })),
    [address],
  );

  const { data, isLoading } = useReadContracts({
    contracts,
    query: { enabled: !!address },
  });

  const chainScores = useMemo<ChainScore[]>(() => {
    return CHAIN_CONFIGS.map((chain, i) => {
      const result = data?.[i];
      return {
        chainKey: chain.key,
        chainName: chain.name,
        shortName: chain.shortName,
        chainId: chain.chainId,
        score: result?.status === "success" ? Number(result.result as bigint) : 0,
        hasSubgraph: chain.subgraphUrl !== null,
        status: result?.status ?? "pending",
      };
    });
  }, [data]);

  const totalScore = useMemo(() => chainScores.reduce((sum, c) => sum + c.score, 0), [chainScores]);

  return { chainScores, totalScore, isLoading };
}
