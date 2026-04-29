"use client";

import { useMemo } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { SURGE_BADGE_ADDRESSES, surgeBadgeAbi } from "@/lib/contracts";

export interface OnChainBadgeType {
  id: number;
  name: string;
  scoreThreshold: number;
  canClaim: boolean;
}

export function useBadges() {
  const { address } = useAccount();
  const chainId = useChainId();
  const badgeAddress = (SURGE_BADGE_ADDRESSES[chainId] ??
    SURGE_BADGE_ADDRESSES[84532]) as `0x${string}`;

  // Total number of badge types on the connected chain
  const { data: badgeCount } = useReadContract({
    address: badgeAddress,
    abi: surgeBadgeAbi,
    functionName: "badgeCount",
  });

  const count = Number(badgeCount ?? 0n);

  // Batch-read all badge type definitions (id 1..count)
  const typeContracts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        address: badgeAddress as `0x${string}`,
        abi: surgeBadgeAbi,
        functionName: "badgeTypes" as const,
        args: [BigInt(i + 1)] as const,
      })),
    [count, badgeAddress],
  );

  const { data: typesRaw } = useReadContracts({
    contracts: typeContracts,
    query: { enabled: count > 0 },
  });

  // Batch-read canClaim for each badge type
  const canClaimContracts = useMemo(
    () =>
      address
        ? Array.from({ length: count }, (_, i) => ({
            address: badgeAddress as `0x${string}`,
            abi: surgeBadgeAbi,
            functionName: "canClaim" as const,
            args: [address, BigInt(i + 1)] as const,
          }))
        : [],
    [count, address, badgeAddress],
  );

  const { data: canClaimRaw, refetch: refetchCanClaim } = useReadContracts({
    contracts: canClaimContracts,
    query: { enabled: count > 0 && !!address },
  });

  // Build typed list
  const badgeTypes = useMemo<OnChainBadgeType[]>(() => {
    if (!typesRaw) return [];
    return typesRaw
      .map((result, i) => {
        if (result.status !== "success") return null;
        const [name, scoreThreshold, exists] = result.result as [string, bigint, boolean];
        if (!exists) return null;
        const eligible =
          canClaimRaw?.[i]?.status === "success" && (canClaimRaw[i].result as boolean) === true;
        return {
          id: i + 1,
          name,
          scoreThreshold: Number(scoreThreshold),
          canClaim: eligible,
        };
      })
      .filter((b): b is OnChainBadgeType => b !== null);
  }, [typesRaw, canClaimRaw]);

  const claimable = useMemo(() => badgeTypes.filter((b) => b.canClaim), [badgeTypes]);

  // Write: claim(badgeId)
  const { writeContract, data: claimTxHash, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isClaimed } = useWaitForTransactionReceipt({
    hash: claimTxHash,
  });

  function claim(badgeId: number) {
    writeContract({
      address: badgeAddress,
      abi: surgeBadgeAbi,
      functionName: "claim",
      args: [BigInt(badgeId)],
    });
  }

  return {
    badgeTypes,
    claimable,
    claim,
    isClaiming: isWritePending || isConfirming,
    isClaimed,
    refetchCanClaim,
  };
}
