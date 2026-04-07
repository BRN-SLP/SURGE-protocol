"use client";

import { useState } from "react";
import {
  useAccount,
  useChainId,
  useSignTypedData,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { SURGE_IDENTITY_ADDRESSES, surgeIdentityAbi } from "@/lib/contracts";

export type LinkStep = 1 | 2 | 3 | 4;

interface LinkWalletState {
  step: LinkStep;
  newAddress: string;
  currentSignature: `0x${string}` | null;
  newSignature: `0x${string}` | null;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: LinkWalletState = {
  step: 1,
  newAddress: "",
  currentSignature: null,
  newSignature: null,
  isLoading: false,
  error: null,
};

const LINK_WALLET_TYPE = {
  LinkWallet: [
    { name: "identityId", type: "uint256" },
    { name: "currentWallet", type: "address" },
    { name: "newWallet", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const;

const JOIN_IDENTITY_TYPE = {
  JoinIdentity: [
    { name: "identityId", type: "uint256" },
    { name: "currentWallet", type: "address" },
    { name: "newWallet", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const;

export function useLinkWallet(identityId?: bigint, currentWallet?: `0x${string}`) {
  const [state, setState] = useState<LinkWalletState>(INITIAL_STATE);
  const [deadline] = useState<bigint>(() => BigInt(Math.floor(Date.now() / 1000) + 3600)); // 1h

  const { address } = useAccount();
  const chainId = useChainId();
  const identityAddress = SURGE_IDENTITY_ADDRESSES[chainId];

  const { data: currentNonce } = useReadContract({
    address: identityAddress,
    abi: surgeIdentityAbi,
    functionName: "nonces",
    args: currentWallet ? [currentWallet] : undefined,
    chainId,
    query: { enabled: !!currentWallet && !!identityAddress },
  });

  const { data: newNonce } = useReadContract({
    address: identityAddress,
    abi: surgeIdentityAbi,
    functionName: "nonces",
    args: state.newAddress ? [state.newAddress as `0x${string}`] : undefined,
    chainId,
    query: { enabled: !!state.newAddress && !!identityAddress },
  });

  const domainBase = {
    name: "SurgeIdentity",
    version: "1",
    chainId,
    verifyingContract: identityAddress,
  } as const;

  const { signTypedDataAsync } = useSignTypedData();

  const {
    writeContract,
    data: txHash,
    isPending: isSubmitting,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isLinked,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const setNewAddress = (addr: string) =>
    setState((s) => ({ ...s, newAddress: addr, error: null }));

  // Step 2: Current wallet signs LinkWallet typed data
  const signFromCurrent = async () => {
    if (!address || !identityId || !currentWallet || currentNonce === undefined) {
      setState((s) => ({
        ...s,
        error: "Missing data — ensure wallet is connected and identity loaded",
      }));
      return;
    }
    if (!state.newAddress) {
      setState((s) => ({ ...s, error: "Enter the new wallet address first" }));
      return;
    }
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const sig = await signTypedDataAsync({
        domain: domainBase,
        types: LINK_WALLET_TYPE,
        primaryType: "LinkWallet",
        message: {
          identityId,
          currentWallet,
          newWallet: state.newAddress as `0x${string}`,
          nonce: currentNonce,
          deadline,
        },
      });
      setState((s) => ({ ...s, isLoading: false, currentSignature: sig, step: 3 }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Signing failed or rejected";
      setState((s) => ({ ...s, isLoading: false, error: msg }));
    }
  };

  // Step 3: New wallet signs JoinIdentity typed data
  const signFromNew = async () => {
    if (!address || !identityId || !currentWallet || newNonce === undefined) {
      setState((s) => ({ ...s, error: "Switch to the new wallet and ensure it is connected" }));
      return;
    }
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const sig = await signTypedDataAsync({
        domain: domainBase,
        types: JOIN_IDENTITY_TYPE,
        primaryType: "JoinIdentity",
        message: {
          identityId,
          currentWallet,
          newWallet: address,
          nonce: newNonce,
          deadline,
        },
      });
      setState((s) => ({
        ...s,
        isLoading: false,
        newSignature: sig,
        newAddress: address,
        step: 4,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Signing failed or rejected";
      setState((s) => ({ ...s, isLoading: false, error: msg }));
    }
  };

  // Step 4: Submit on-chain
  const submitLinkWallet = () => {
    if (!identityAddress || !state.currentSignature || !state.newSignature || !state.newAddress)
      return;
    writeContract({
      address: identityAddress,
      abi: surgeIdentityAbi,
      functionName: "linkWallet",
      args: [
        state.newAddress as `0x${string}`,
        deadline,
        state.currentSignature,
        state.newSignature,
      ],
    });
  };

  const reset = () => setState(INITIAL_STATE);

  // Step 1 → 2: user reviewed and understood
  const [understood, setUnderstood] = useState(false);
  const proceedToSign = () => {
    if (understood) setState((s) => ({ ...s, step: 2, error: null }));
  };

  const linkError = state.error ?? writeError?.message ?? receiptError?.message ?? null;

  return {
    ...state,
    understood,
    setUnderstood,
    proceedToSign,
    deadline,
    setNewAddress,
    signFromCurrent,
    signFromNew,
    submitLinkWallet,
    isSubmitting: isSubmitting || isConfirming,
    isLinked,
    linkError,
    txHash,
    reset,
  };
}
