"use client";

import { useMemo, useEffect } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { SURGE_IDENTITY_ADDRESSES, surgeIdentityAbi } from "@/lib/contracts";
import type { WalletInfo, WalletStatus } from "@/types";

// WalletStatus enum values from contract: 0=Active 1=Frozen 2=PendingCompromise 3=Compromised
const STATUS_MAP: Record<number, WalletStatus> = {
  0: "active",
  1: "frozen",
  2: "pending",
  3: "compromised",
};

export function useWalletManagement(identityId?: bigint) {
  const { address: connectedAddress } = useAccount();
  const chainId = useChainId();
  const identityAddress = SURGE_IDENTITY_ADDRESSES[chainId];

  const enabled = !!identityId && identityId > 0n && !!identityAddress;

  // Read all linked wallets from contract
  const { data: linkedWallets, refetch: refetchLinked } = useReadContract({
    address: identityAddress,
    abi: surgeIdentityAbi,
    functionName: "getLinkedWallets",
    args: identityId ? [identityId] : undefined,
    chainId,
    query: { enabled },
  });

  const { data: primaryWallet } = useReadContract({
    address: identityAddress,
    abi: surgeIdentityAbi,
    functionName: "primaryWallet",
    args: identityId ? [identityId] : undefined,
    chainId,
    query: { enabled },
  });

  // Batch-read walletStatus for each linked wallet
  const statusContracts = useMemo(() => {
    if (!linkedWallets || !identityAddress) return [];
    return linkedWallets.map((wallet) => ({
      address: identityAddress,
      abi: surgeIdentityAbi,
      functionName: "walletStatus" as const,
      args: [wallet] as const,
      chainId,
    }));
  }, [linkedWallets, identityAddress, chainId]);

  const { data: statusResults } = useReadContracts({
    contracts: statusContracts,
    query: { enabled: statusContracts.length > 0 },
  });

  // Batch-read isSecurityWallet for each linked wallet
  const securityContracts = useMemo(() => {
    if (!linkedWallets || !identityId || !identityAddress) return [];
    return linkedWallets.map((wallet) => ({
      address: identityAddress,
      abi: surgeIdentityAbi,
      functionName: "isSecurityWallet" as const,
      args: [identityId, wallet] as const,
      chainId,
    }));
  }, [linkedWallets, identityId, identityAddress, chainId]);

  const { data: securityResults } = useReadContracts({
    contracts: securityContracts,
    query: { enabled: securityContracts.length > 0 },
  });

  const wallets = useMemo<WalletInfo[]>(() => {
    if (!linkedWallets) return [];
    return linkedWallets.map((walletAddr, i) => {
      const statusRaw = statusResults?.[i]?.result;
      const status = STATUS_MAP[Number(statusRaw) ?? 0] ?? "active";
      const isSecurity = securityResults?.[i]?.result ?? false;
      const isPrimary = primaryWallet?.toLowerCase() === walletAddr.toLowerCase();

      return {
        address: walletAddr,
        role: isPrimary ? "primary" : "regular",
        status,
        isSecurityWallet: isSecurity as boolean,
        score: 0,
        txCount: 0,
        chains: ["—"],
        linkedSince: "—",
        isCurrentWallet: walletAddr.toLowerCase() === connectedAddress?.toLowerCase(),
      };
    });
  }, [linkedWallets, statusResults, securityResults, primaryWallet, connectedAddress]);

  // ── selfFreeze ─────────────────────────────────────────────────────────────

  const {
    writeContract: writeFreeze,
    data: freezeTxHash,
    isPending: isFreezing,
    error: freezeWriteError,
  } = useWriteContract();

  const { isLoading: isFreezeConfirming, isSuccess: isFrozen } = useWaitForTransactionReceipt({
    hash: freezeTxHash,
  });

  const selfFreeze = () => {
    if (!identityAddress) return;
    writeFreeze({
      address: identityAddress,
      abi: surgeIdentityAbi,
      functionName: "selfFreeze",
    });
  };

  // ── setPrimary ─────────────────────────────────────────────────────────────

  const {
    writeContract: writePrimary,
    data: primaryTxHash,
    isPending: isSettingPrimary,
    error: setPrimaryWriteError,
  } = useWriteContract();

  const { isSuccess: isPrimarySet } = useWaitForTransactionReceipt({
    hash: primaryTxHash,
  });

  const setPrimary = (newPrimary: `0x${string}`) => {
    if (!identityAddress) return;
    writePrimary({
      address: identityAddress,
      abi: surgeIdentityAbi,
      functionName: "setPrimary",
      args: [newPrimary],
    });
  };

  // Refetch wallet list after either tx confirms
  useEffect(() => {
    if (isFrozen || isPrimarySet) {
      refetchLinked();
    }
  }, [isFrozen, isPrimarySet, refetchLinked]);

  const activeCount = wallets.filter((w) => w.status === "active").length;
  const hasPendingActions = wallets.some((w) => w.status === "pending");

  return {
    wallets,
    primaryWallet,
    activeCount,
    hasPendingActions,
    multiSigEnabled: activeCount >= 2,
    selfFreeze,
    isFreezing: isFreezing || isFreezeConfirming,
    isFrozen,
    freezeError: freezeWriteError?.message ?? null,
    setPrimary,
    isSettingPrimary,
    isPrimarySet,
    setPrimaryError: setPrimaryWriteError?.message ?? null,
    refetch: refetchLinked,
  };
}
