"use client";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import {
  SURGE_IDENTITY_ADDRESSES,
  SURGE_SCORE_ADDRESSES,
  surgeIdentityAbi,
  surgeScoreAbi,
} from "@/lib/contracts";

export function useSurgeIdentity() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const identityAddress = SURGE_IDENTITY_ADDRESSES[chainId];
  const scoreAddress = SURGE_SCORE_ADDRESSES[chainId];

  const { data: identityId, refetch: refetchIdentityId } = useReadContract({
    address: identityAddress,
    abi: surgeIdentityAbi,
    functionName: "identityOf",
    args: address ? [address] : undefined,
    chainId,
    query: { enabled: !!address && !!identityAddress },
  });

  const hasIdentity = identityId !== undefined && identityId > 0n;

  const { data: score } = useReadContract({
    address: scoreAddress,
    abi: surgeScoreAbi,
    functionName: "scoreOfAddress",
    args: address ? [address] : undefined,
    chainId,
    query: { enabled: !!address && hasIdentity && !!scoreAddress },
  });

  const { data: totalIdentities } = useReadContract({
    address: identityAddress,
    abi: surgeIdentityAbi,
    functionName: "totalIdentities",
    chainId,
    query: { enabled: !!identityAddress },
  });

  const { data: primaryWallet } = useReadContract({
    address: identityAddress,
    abi: surgeIdentityAbi,
    functionName: "primaryWallet",
    args: identityId ? [identityId] : undefined,
    chainId,
    query: { enabled: hasIdentity && !!identityAddress },
  });

  const { data: walletStatus } = useReadContract({
    address: identityAddress,
    abi: surgeIdentityAbi,
    functionName: "walletStatus",
    args: address ? [address] : undefined,
    chainId,
    query: { enabled: !!address && hasIdentity && !!identityAddress },
  });

  const {
    writeContract,
    data: mintTxHash,
    isPending: isMinting,
    error: mintWriteError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isMinted,
    error: mintReceiptError,
  } = useWaitForTransactionReceipt({ hash: mintTxHash });

  const mintError = mintWriteError?.message ?? mintReceiptError?.message ?? null;

  const mint = () => {
    if (!identityAddress) return;
    writeContract({
      address: identityAddress,
      abi: surgeIdentityAbi,
      functionName: "mint",
    });
  };

  return {
    isConnected,
    address,
    chainId,
    identityId,
    // backwards-compat alias
    tokenId: identityId,
    hasIdentity,
    score: score ?? 0n,
    totalIdentities: totalIdentities ?? 0n,
    // backwards-compat alias
    totalSupply: totalIdentities ?? 0n,
    primaryWallet,
    walletStatus,
    mint,
    isMinting: isMinting || isConfirming,
    isMinted,
    mintError,
    refetchTokenId: refetchIdentityId,
    refetchIdentityId,
  };
}
