"use client";

import { useState } from "react";
import { useSignMessage, useAccount, useSwitchChain } from "wagmi";

const BASE_SEPOLIA_ID = 84532;

export type LinkStep = 1 | 2 | 3 | 4;

interface LinkWalletState {
  step: LinkStep;
  understood: boolean;
  currentSigned: boolean;
  newSigned: boolean;
  newAddress: string;
  currentSignature: string | null;
  newSignature: string | null;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: LinkWalletState = {
  step: 1,
  understood: false,
  currentSigned: false,
  newSigned: false,
  newAddress: "",
  currentSignature: null,
  newSignature: null,
  isLoading: false,
  error: null,
};

function buildLinkMessage(identityId: number, role: "current" | "new", nonce: number): string {
  return [
    "I authorize linking a new wallet to SURGE",
    `Identity #${String(identityId).padStart(5, "0")}.`,
    `Role: ${role === "current" ? "Authorizer" : "New Linked Wallet"}`,
    `Chain: Base Sepolia (84532)`,
    `Nonce: ${nonce}`,
  ].join("\n");
}

export function useLinkWallet(identityId?: number) {
  const [state, setState] = useState<LinkWalletState>(INITIAL_STATE);
  const [nonce] = useState(() => Math.floor(Date.now() / 1000));
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();

  const id = identityId ?? 0;

  const setUnderstood = (val: boolean) => setState((s) => ({ ...s, understood: val }));

  const proceedToSign = () => setState((s) => ({ ...s, step: 2, error: null }));

  const signFromCurrent = async () => {
    if (!address) {
      setState((s) => ({ ...s, error: "No wallet connected" }));
      return;
    }
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      if (chainId !== BASE_SEPOLIA_ID) {
        await switchChainAsync({ chainId: BASE_SEPOLIA_ID });
      }
      const message = buildLinkMessage(id, "current", nonce);
      const signature = await signMessageAsync({ message });
      setState((s) => ({
        ...s,
        isLoading: false,
        currentSigned: true,
        currentSignature: signature,
        step: 3,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Signing failed or rejected";
      setState((s) => ({ ...s, isLoading: false, error: msg }));
    }
  };

  const signFromNew = async () => {
    if (!address) {
      setState((s) => ({ ...s, error: "No wallet connected" }));
      return;
    }
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      if (chainId !== BASE_SEPOLIA_ID) {
        await switchChainAsync({ chainId: BASE_SEPOLIA_ID });
      }
      const message = buildLinkMessage(id, "new", nonce);
      const signature = await signMessageAsync({ message });

      // Persist to localStorage so useWalletManagement can read it
      if (typeof window !== "undefined") {
        const storageKey = `surge_linked_wallets_${id}`;
        const existing: string[] = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
        if (!existing.includes(address.toLowerCase())) {
          existing.push(address.toLowerCase());
          localStorage.setItem(storageKey, JSON.stringify(existing));
        }
      }

      setState((s) => ({
        ...s,
        isLoading: false,
        newSigned: true,
        newSignature: signature,
        newAddress: address,
        step: 4,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Signing failed or rejected";
      setState((s) => ({ ...s, isLoading: false, error: msg }));
    }
  };

  const reset = () => setState(INITIAL_STATE);

  return {
    ...state,
    nonce,
    setUnderstood,
    proceedToSign,
    signFromCurrent,
    signFromNew,
    reset,
  };
}
