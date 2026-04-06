"use client";

import { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import type { WalletInfo, WalletStatus } from "@/types";

// Wallet status overrides are stored in localStorage so freeze/compromised survives reload.
// Key: "surge_wallet_status_<address>" → WalletStatus

function readStatusOverride(address: string): WalletStatus | null {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(`surge_wallet_status_${address.toLowerCase()}`);
  if (val === "frozen" || val === "compromised") return val;
  return null;
}

function writeStatusOverride(address: string, status: WalletStatus) {
  if (typeof window === "undefined") return;
  if (status === "active") {
    localStorage.removeItem(`surge_wallet_status_${address.toLowerCase()}`);
  } else {
    localStorage.setItem(`surge_wallet_status_${address.toLowerCase()}`, status);
  }
}

function readLinkedAddresses(identityId: number): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(`surge_linked_wallets_${identityId}`);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function useWalletManagement(identityId?: number) {
  const { address: connectedAddress } = useAccount();
  const [statusOverrides, setStatusOverrides] = useState<Record<string, WalletStatus>>({});
  const [primaryAddress, setPrimaryAddress] = useState<string | null>(null);

  const wallets = useMemo<WalletInfo[]>(() => {
    if (!connectedAddress) return [];

    const id = identityId ?? 0;
    const connectedLower = connectedAddress.toLowerCase();
    const linkedAddresses = readLinkedAddresses(id).filter((a) => a !== connectedLower);

    const resolvedPrimary = primaryAddress ?? connectedLower;

    const primary: WalletInfo = {
      address: connectedAddress,
      role: resolvedPrimary === connectedLower ? "primary" : "regular",
      status: statusOverrides[connectedLower] ?? readStatusOverride(connectedAddress) ?? "active",
      score: 0,
      txCount: 0,
      chains: ["Base"],
      linkedSince: "—",
      isCurrentWallet: true,
    };

    const others: WalletInfo[] = linkedAddresses.map((addr) => ({
      address: addr,
      role: resolvedPrimary === addr.toLowerCase() ? "primary" : "regular",
      status: statusOverrides[addr.toLowerCase()] ?? readStatusOverride(addr) ?? "active",
      score: 0,
      txCount: 0,
      chains: ["Base"],
      linkedSince: "—",
    }));

    return [primary, ...others];
  }, [connectedAddress, identityId, statusOverrides, primaryAddress]);

  const updateWalletStatus = (address: string, status: WalletStatus) => {
    writeStatusOverride(address, status);
    setStatusOverrides((prev) => ({ ...prev, [address.toLowerCase()]: status }));
  };

  const setAsPrimary = (address: string) => {
    setPrimaryAddress(address.toLowerCase());
  };

  const activeCount = wallets.filter((w) => w.status === "active").length;
  const hasPendingActions = wallets.some((w) => w.status === "pending");

  return {
    wallets,
    updateWalletStatus,
    setAsPrimary,
    activeCount,
    hasPendingActions,
    multiSigEnabled: activeCount >= 2,
  };
}
