"use client";

import { useState } from "react";
import {
  useAccount,
  useChainId,
  useSignTypedData,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { SURGE_IDENTITY_ADDRESSES, SECURITY_QUORUM, surgeIdentityAbi } from "@/lib/contracts";

export type MultiSigActionType = "unfreeze" | "markCompromised";

const UNFREEZE_TYPE = {
  Unfreeze: [
    { name: "identityId", type: "uint256" },
    { name: "targetWallet", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const;

const MARK_COMPROMISED_TYPE = {
  MarkCompromised: [
    { name: "identityId", type: "uint256" },
    { name: "targetWallet", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const;

export function isDeadlineExpired(
  deadline: bigint,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  return BigInt(nowSeconds) >= deadline;
}

export interface CollectedSig {
  signer: `0x${string}`;
  sig: `0x${string}`;
}

interface State {
  action: MultiSigActionType | null;
  targetWallet: `0x${string}` | null;
  collectedSigs: CollectedSig[];
  isLoading: boolean;
  error: string | null;
}

const INITIAL: State = {
  action: null,
  targetWallet: null,
  collectedSigs: [],
  isLoading: false,
  error: null,
};

export function useMultiSigAction(identityId?: bigint) {
  const [state, setState] = useState<State>(INITIAL);
  const [deadline, setDeadline] = useState<bigint>(() =>
    BigInt(Math.floor(Date.now() / 1000) + 3600),
  );

  const { address } = useAccount();
  const chainId = useChainId();
  const identityAddress = SURGE_IDENTITY_ADDRESSES[chainId];
  const publicClient = usePublicClient({ chainId });
  const { signTypedDataAsync } = useSignTypedData();

  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  function start(action: MultiSigActionType, targetWallet: `0x${string}`) {
    setDeadline(BigInt(Math.floor(Date.now() / 1000) + 3600));
    setState({ ...INITIAL, action, targetWallet });
  }

  function reset() {
    setState(INITIAL);
  }

  const signAsCurrent = async () => {
    if (
      !address ||
      !identityId ||
      !state.action ||
      !state.targetWallet ||
      !identityAddress ||
      !publicClient
    ) {
      setState((s) => ({ ...s, error: "Wallet not connected or action not started" }));
      return;
    }

    if (state.collectedSigs.some((c) => c.signer.toLowerCase() === address.toLowerCase())) {
      setState((s) => ({
        ...s,
        error: "This wallet has already signed — switch to another security wallet",
      }));
      return;
    }

    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const nonce = await publicClient.readContract({
        address: identityAddress,
        abi: surgeIdentityAbi,
        functionName: "nonces",
        args: [address],
      });

      const domain = {
        name: "SurgeIdentity",
        version: "1",
        chainId,
        verifyingContract: identityAddress,
      } as const;

      const message = {
        identityId,
        targetWallet: state.targetWallet,
        nonce,
        deadline,
      };

      const sig =
        state.action === "unfreeze"
          ? await signTypedDataAsync({
              domain,
              types: UNFREEZE_TYPE,
              primaryType: "Unfreeze",
              message,
            })
          : await signTypedDataAsync({
              domain,
              types: MARK_COMPROMISED_TYPE,
              primaryType: "MarkCompromised",
              message,
            });

      setState((s) => ({
        ...s,
        isLoading: false,
        error: null,
        collectedSigs: [...s.collectedSigs, { signer: address, sig }],
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : "Signing failed or rejected",
      }));
    }
  };

  const submit = () => {
    if (!identityAddress || !state.targetWallet || !state.action) return;
    if (state.collectedSigs.length < SECURITY_QUORUM) return;
    if (isDeadlineExpired(deadline)) {
      setState((s) => ({ ...s, error: "Signatures expired — please restart" }));
      return;
    }

    writeContract({
      address: identityAddress,
      abi: surgeIdentityAbi,
      functionName: state.action,
      args: [
        state.targetWallet,
        state.collectedSigs.map((c) => c.signer),
        state.collectedSigs.map((c) => c.sig),
        deadline,
      ],
    });
  };

  return {
    action: state.action,
    targetWallet: state.targetWallet,
    collectedSigs: state.collectedSigs,
    isLoading: state.isLoading,
    error: state.error ?? writeError?.message ?? receiptError?.message ?? null,
    start,
    reset,
    signAsCurrent,
    submit,
    isSubmitting: isWritePending || isConfirming,
    isSuccess,
    txHash,
    quorum: SECURITY_QUORUM,
    sigsCollected: state.collectedSigs.length,
    isReadyToSubmit: state.collectedSigs.length >= SECURITY_QUORUM,
  };
}
