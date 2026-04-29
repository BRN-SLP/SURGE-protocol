"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ViewportContainer } from "@/components/layout/ViewportContainer";
import { CompactHeader } from "@/components/layout/CompactHeader";
import { ScrollableRegion } from "@/components/layout/ScrollableRegion";
import { GhostButton } from "@/components/ui/GhostButton";
import { StatusDot } from "@/components/ui/StatusDot";
import { SecurityBanner } from "@/components/identity/manage/SecurityBanner";
import { ActionModal, type ModalType } from "@/components/identity/manage/ActionModal";
import { SecurityActionModal } from "@/components/identity/manage/SecurityActionModal";
import { WalletCard, truncateAddress } from "@/components/identity/manage/WalletCard";
import { useWalletManagement } from "@/hooks/useWalletManagement";
import { useMultiSigAction } from "@/hooks/useMultiSigAction";
import { useCompromiseRequests } from "@/hooks/useCompromiseRequests";
import { useSurgeIdentity } from "@/hooks/useSurgeIdentity";
import type { WalletInfo } from "@/types";
import { useAccount } from "wagmi";
import { useToast } from "@/components/ui/ToastProvider";

export default function WalletManagePage() {
  const { address } = useAccount();
  const { tokenId } = useSurgeIdentity();
  const identityId = tokenId ?? 0n;
  const {
    wallets,
    activeCount,
    selfFreeze,
    setPrimary,
    isFreezing,
    isSettingPrimary,
    isFrozen,
    isPrimarySet,
    freezeError,
    setPrimaryError,
    refetch,
  } = useWalletManagement(identityId as bigint);
  const multiSig = useMultiSigAction(identityId);
  const { show: showToast } = useToast();

  const pendingWalletAddresses = wallets
    .filter((w) => w.status === "pending")
    .map((w) => w.address as `0x${string}`);

  const {
    requests: compromiseRequests,
    cancelCompromise,
    finalizeCompromise,
    refetchRequests,
    isCancelled,
    isFinalized,
    fetchRequestsError,
  } = useCompromiseRequests(identityId, pendingWalletAddresses);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [targetWallet, setTargetWallet] = useState<WalletInfo | null>(null);
  const isProcessing = isFreezing || isSettingPrimary;
  const wasProcessing = useRef(false);

  // Close modal once on-chain tx completes (isProcessing true → false)
  useEffect(() => {
    if (isProcessing) {
      wasProcessing.current = true;
    } else if (wasProcessing.current) {
      wasProcessing.current = false;
      setModalType(null);
      setTargetWallet(null);
    }
  }, [isProcessing]);

  // Refetch wallet list after multiSig tx confirms
  useEffect(() => {
    if (multiSig.isSuccess) {
      refetch();
      showToast(
        multiSig.action === "unfreeze"
          ? "Wallet unfrozen successfully"
          : "Wallet marked as compromised",
        "success",
      );
    }
  }, [multiSig.isSuccess, refetch, showToast, multiSig.action]);

  useEffect(() => {
    if (fetchRequestsError) showToast(fetchRequestsError, "error");
  }, [fetchRequestsError, showToast]);

  // Refetch after cancel/finalize
  useEffect(() => {
    if (isCancelled) {
      refetch();
      refetchRequests();
      showToast("Compromise request cancelled", "info");
    }
  }, [isCancelled, refetch, refetchRequests, showToast]);

  useEffect(() => {
    if (isFinalized) {
      refetch();
      refetchRequests();
      showToast("Wallet compromised — identity secured", "success");
    }
  }, [isFinalized, refetch, refetchRequests, showToast]);

  // Toast on freeze / setPrimary success or error
  useEffect(() => {
    if (isFrozen) showToast("Wallet frozen successfully", "success");
  }, [isFrozen, showToast]);

  useEffect(() => {
    if (freezeError) showToast(freezeError, "error");
  }, [freezeError, showToast]);

  useEffect(() => {
    if (isPrimarySet) showToast("Primary wallet updated", "success");
  }, [isPrimarySet, showToast]);

  useEffect(() => {
    if (setPrimaryError) showToast(setPrimaryError, "error");
  }, [setPrimaryError, showToast]);

  function openModal(type: ModalType, wallet: WalletInfo) {
    setModalType(type);
    setTargetWallet(wallet);
  }

  function closeModal() {
    if (isProcessing) return;
    setModalType(null);
    setTargetWallet(null);
  }

  function handleConfirm() {
    if (!modalType || !targetWallet) return;
    if (modalType === "primary") {
      setPrimary(targetWallet.address as `0x${string}`);
    } else if (modalType === "freeze") {
      selfFreeze();
    }
    // Modal stays open — useEffect closes it when isProcessing goes false
  }

  const pendingWallets = wallets.filter((w) => w.status === "pending");

  return (
    <>
      <Navbar />
      <ViewportContainer style={{ display: "flex", flexDirection: "column" }}>
        <CompactHeader
          title="Wallet Management"
          subtitle={`${wallets.length} wallet${wallets.length !== 1 ? "s" : ""} linked`}
          back={{ href: "/identity", label: "Dashboard" }}
          actions={
            <GhostButton href="/identity/link" size="sm">
              + Link Wallet
            </GhostButton>
          }
        />

        <ScrollableRegion
          style={{
            padding: "16px var(--section-px)",
            maxWidth: 800,
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {/* Security Banner */}
          <div style={{ marginBottom: 16 }}>
            <SecurityBanner activeCount={activeCount} />
          </div>

          {/* Pending actions */}
          {pendingWallets.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  padding: "12px 16px",
                  border: "1px solid rgba(240,170,32,0.3)",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(240,170,32,0.04)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#f0aa20",
                    marginBottom: 8,
                    letterSpacing: "0.04em",
                  }}
                >
                  PENDING ACTIONS
                </div>
                {pendingWallets.map((w) => (
                  <div
                    key={w.address}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: "0.78rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    <StatusDot status="pending" size={6} />
                    <span style={{ fontFamily: "monospace" }}>{truncateAddress(w.address)}</span>
                    <span>— awaiting confirmation</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wallet list */}
          {wallets.length === 0 ? (
            <div
              style={{
                padding: "40px 24px",
                textAlign: "center",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "0.85rem", marginBottom: 16 }}>No wallets found</div>
              <GhostButton href="/identity/link" size="sm">
                + Link Wallet
              </GhostButton>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {wallets.map((wallet) => (
                <WalletCard
                  key={wallet.address}
                  wallet={wallet}
                  compromiseRequest={compromiseRequests.find(
                    (r) => r.targetWallet.toLowerCase() === wallet.address.toLowerCase(),
                  )}
                  onSetPrimary={() => openModal("primary", wallet)}
                  onFreeze={() => openModal("freeze", wallet)}
                  onUnfreeze={() => multiSig.start("unfreeze", wallet.address as `0x${string}`)}
                  onMarkCompromised={() =>
                    multiSig.start("markCompromised", wallet.address as `0x${string}`)
                  }
                  onCancelCompromise={cancelCompromise}
                  onFinalizeCompromise={finalizeCompromise}
                />
              ))}
            </div>
          )}

          {/* Link another wallet CTA */}
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <GhostButton href="/identity/link" size="sm">
              + Link Another Wallet
            </GhostButton>
          </div>
        </ScrollableRegion>
      </ViewportContainer>

      <ActionModal
        type={modalType}
        wallet={targetWallet}
        onClose={closeModal}
        onConfirm={handleConfirm}
        isLoading={isProcessing}
      />

      <SecurityActionModal
        action={multiSig.action}
        targetWallet={multiSig.targetWallet}
        collectedSigs={multiSig.collectedSigs}
        quorum={multiSig.quorum}
        isLoading={multiSig.isLoading}
        isSubmitting={multiSig.isSubmitting}
        isSuccess={multiSig.isSuccess ?? false}
        isReadyToSubmit={multiSig.isReadyToSubmit}
        error={multiSig.error}
        txHash={multiSig.txHash}
        connectedAddress={address}
        onSign={multiSig.signAsCurrent}
        onSubmit={multiSig.submit}
        onClose={multiSig.reset}
      />
    </>
  );
}
