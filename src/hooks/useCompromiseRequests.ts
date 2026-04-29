"use client";

import { useState, useEffect, useCallback } from "react";
import { useChainId, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { SURGE_IDENTITY_ADDRESSES, surgeIdentityAbi } from "@/lib/contracts";
import { CHAIN_CONFIGS } from "@/lib/chains";

const COMPROMISE_REQUESTED_EVENT = parseAbiItem(
  "event CompromiseRequested(uint256 indexed identityId, address indexed targetWallet, uint256 requestIndex, uint48 requestedAt)",
);

export const TIMELOCK_SECONDS = 30 * 24 * 60 * 60; // 30 days

export function computeCompromiseFlags(
  requestedAt: number,
  now: number,
): { timelockEnd: number; canCancel: boolean; canFinalize: boolean } {
  const timelockEnd = requestedAt + TIMELOCK_SECONDS;
  return { timelockEnd, canCancel: now < timelockEnd, canFinalize: now >= timelockEnd };
}

export interface CompromiseRequestInfo {
  targetWallet: `0x${string}`;
  requestIndex: bigint;
  requestedAt: number; // unix timestamp
  timelockEnd: number; // unix timestamp
  canCancel: boolean; // within 30-day window
  canFinalize: boolean; // after 30-day window
}

export function useCompromiseRequests(
  identityId: bigint | undefined,
  pendingWallets: `0x${string}`[],
) {
  const chainId = useChainId();
  const identityAddress = SURGE_IDENTITY_ADDRESSES[chainId];
  const publicClient = usePublicClient({ chainId });
  const deployBlock = CHAIN_CONFIGS.find((c) => c.chainId === chainId)?.deployBlock ?? 0n;

  const [requests, setRequests] = useState<CompromiseRequestInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!identityId || !identityAddress || !publicClient || pendingWallets.length === 0) {
      setRequests([]);
      return;
    }

    setIsLoading(true);
    setFetchError(null);
    const now = Math.floor(Date.now() / 1000);
    const result: CompromiseRequestInfo[] = [];

    let anyError = false;
    for (const wallet of pendingWallets) {
      try {
        const logs = await publicClient.getLogs({
          address: identityAddress,
          event: COMPROMISE_REQUESTED_EVENT,
          args: { identityId, targetWallet: wallet },
          fromBlock: deployBlock,
        });

        if (logs.length === 0) continue;

        // Most recent log is the active request
        const latest = logs[logs.length - 1];
        const requestIndex = latest.args.requestIndex!;
        const requestedAt = Number(latest.args.requestedAt!);
        const flags = computeCompromiseFlags(requestedAt, now);

        result.push({
          targetWallet: wallet,
          requestIndex,
          requestedAt,
          ...flags,
        });
      } catch {
        anyError = true;
      }
    }
    setRequests(result);
    if (anyError) {
      setFetchError("Failed to load some compromise requests");
    }
    setIsLoading(false);
  }, [identityId, identityAddress, publicClient, pendingWallets.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // ── cancelCompromise ───────────────────────────────────────────────────────

  const {
    writeContract: writeCancel,
    data: cancelTxHash,
    isPending: isCancelPending,
    error: cancelWriteError,
  } = useWriteContract();

  const {
    isLoading: isCancelConfirming,
    isSuccess: isCancelled,
    error: cancelReceiptError,
  } = useWaitForTransactionReceipt({ hash: cancelTxHash });

  function cancelCompromise(requestIndex: bigint) {
    if (!identityAddress || !identityId) return;
    writeCancel({
      address: identityAddress,
      abi: surgeIdentityAbi,
      functionName: "cancelCompromise",
      args: [identityId, requestIndex],
    });
  }

  // ── finalizeCompromise ─────────────────────────────────────────────────────

  const {
    writeContract: writeFinalize,
    data: finalizeTxHash,
    isPending: isFinalizePending,
    error: finalizeWriteError,
  } = useWriteContract();

  const {
    isLoading: isFinalizeConfirming,
    isSuccess: isFinalized,
    error: finalizeReceiptError,
  } = useWaitForTransactionReceipt({ hash: finalizeTxHash });

  function finalizeCompromise(requestIndex: bigint) {
    if (!identityAddress || !identityId) return;
    writeFinalize({
      address: identityAddress,
      abi: surgeIdentityAbi,
      functionName: "finalizeCompromise",
      args: [identityId, requestIndex],
    });
  }

  return {
    requests,
    isLoadingRequests: isLoading,
    fetchRequestsError: fetchError,
    refetchRequests: fetchRequests,
    cancelCompromise,
    isCancelling: isCancelPending || isCancelConfirming,
    isCancelled,
    cancelError: cancelWriteError?.message ?? cancelReceiptError?.message ?? null,
    finalizeCompromise,
    isFinalizing: isFinalizePending || isFinalizeConfirming,
    isFinalized,
    finalizeError: finalizeWriteError?.message ?? finalizeReceiptError?.message ?? null,
  };
}
