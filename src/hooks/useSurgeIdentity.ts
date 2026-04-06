"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import {
  SURGE_IDENTITY_ADDRESS,
  SURGE_SCORE_ADDRESS,
  surgeIdentityAbi,
  surgeScoreAbi,
} from "@/lib/contracts";

export function useSurgeIdentity() {
  const { address, isConnected } = useAccount();

  // Identity lookup always targets Base Sepolia — canonical chain for identity NFT.
  const { data: tokenId, refetch: refetchTokenId } = useReadContract({
    address: SURGE_IDENTITY_ADDRESS,
    abi: surgeIdentityAbi,
    functionName: "identityOf",
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
    query: { enabled: !!address },
  });

  const hasIdentity = tokenId !== undefined && tokenId > 0n;

  // Base Sepolia score — single-chain. Use useChainScores for cross-chain total.
  const { data: score } = useReadContract({
    address: SURGE_SCORE_ADDRESS,
    abi: surgeScoreAbi,
    functionName: "scoreOfAddress",
    args: address ? [address] : undefined,
    chainId: baseSepolia.id,
    query: { enabled: !!address && hasIdentity },
  });

  const { data: totalSupply } = useReadContract({
    address: SURGE_IDENTITY_ADDRESS,
    abi: surgeIdentityAbi,
    functionName: "totalSupply",
    chainId: baseSepolia.id,
    query: { enabled: true },
  });

  const { writeContract, data: mintTxHash, isPending: isMinting } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isMinted } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  const mint = () => {
    writeContract({
      address: SURGE_IDENTITY_ADDRESS,
      abi: surgeIdentityAbi,
      functionName: "mint",
    });
  };

  return {
    isConnected,
    address,
    tokenId,
    hasIdentity,
    score: score ?? 0n,
    totalSupply: totalSupply ?? 0n,
    mint,
    isMinting: isMinting || isConfirming,
    isMinted,
    refetchTokenId,
  };
}
