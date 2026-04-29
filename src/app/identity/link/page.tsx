"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ViewportContainer } from "@/components/layout/ViewportContainer";
import { CompactHeader } from "@/components/layout/CompactHeader";
import { ScrollableRegion } from "@/components/layout/ScrollableRegion";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Step1Review } from "@/components/identity/link/Step1Review";
import { Step2Sign } from "@/components/identity/link/Step2Sign";
import { Step3Switch } from "@/components/identity/link/Step3Switch";
import { Step4Confirm } from "@/components/identity/link/Step4Confirm";
import { useLinkWallet } from "@/hooks/useLinkWallet";
import { useSurgeIdentity } from "@/hooks/useSurgeIdentity";
import { useWalletManagement } from "@/hooks/useWalletManagement";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

const STEPS = ["Review", "Sign (Wallet A)", "Switch & Sign (Wallet B)", "Confirm"];

export default function LinkWalletPage() {
  const { tokenId, score, address } = useSurgeIdentity();
  const liveIdentityId = tokenId ?? 0n;

  // Freeze the identity ID for the duration of the flow so that switching
  // to Wallet B (no identity) doesn't reset it to 0.
  const identityId = (() => {
    if (typeof window === "undefined") return liveIdentityId;
    if (liveIdentityId > 0n) {
      sessionStorage.setItem("surge_link_identity_id", String(liveIdentityId));
      return liveIdentityId;
    }
    const stored = sessionStorage.getItem("surge_link_identity_id");
    return stored ? BigInt(stored) : 0n;
  })();

  const { wallets, refetch: refetchWallets } = useWalletManagement(identityId);
  const {
    step,
    understood,
    isLoading,
    error,
    newAddress,
    setNewAddress,
    setUnderstood,
    proceedToSign,
    signFromCurrent,
    signFromNew,
    submitLinkWallet,
    isSubmitting,
    isLinked,
    txHash,
    linkError,
    deadline,
    reset,
  } = useLinkWallet(identityId, address ?? undefined);

  const [secsLeft, setSecsLeft] = useState<number | null>(null);
  useEffect(() => {
    if (step < 2) {
      setSecsLeft(null);
      return;
    }
    const update = () => setSecsLeft(Math.max(0, Number(deadline) - Math.floor(Date.now() / 1000)));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [step, deadline]);

  const currentAddress = address ?? "";
  const currentScore = Number(score);
  const { show: showToast } = useToast();

  // Refetch wallet list after linkWallet tx confirms
  useEffect(() => {
    if (isLinked) {
      refetchWallets();
      showToast("Wallet linked successfully", "success");
    }
  }, [isLinked, refetchWallets, showToast]);

  return (
    <>
      <Navbar />
      <ViewportContainer style={{ display: "flex", flexDirection: "column" }}>
        <CompactHeader
          title="Link Wallet"
          subtitle={`Step ${step} of ${STEPS.length} — ${STEPS[step - 1]}`}
          back={{ href: "/identity/manage", label: "Wallet Management" }}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            padding: "24px var(--section-px)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 560,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              overflow: "hidden",
            }}
          >
            <StepIndicator steps={STEPS} currentStep={step} />

            {secsLeft !== null && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.72rem",
                  color: secsLeft < 300 ? "var(--accent)" : "var(--text-faint)",
                  letterSpacing: "0.04em",
                }}
              >
                <span style={{ fontVariantNumeric: "tabular-nums" }}>
                  {secsLeft === 0
                    ? "Signatures expired"
                    : `Expires in ${String(Math.floor(secsLeft / 3600)).padStart(2, "0")}:${String(Math.floor((secsLeft % 3600) / 60)).padStart(2, "0")}:${String(secsLeft % 60).padStart(2, "0")}`}
                </span>
              </div>
            )}

            <ScrollableRegion>
              {step === 1 && (
                <Step1Review
                  identityId={Number(identityId)}
                  currentAddress={currentAddress}
                  walletCount={wallets.length}
                  score={currentScore}
                  understood={understood}
                  onUnderstood={setUnderstood}
                  onContinue={proceedToSign}
                />
              )}
              {step === 2 && (
                <Step2Sign
                  identityId={Number(identityId)}
                  currentAddress={currentAddress}
                  isLoading={isLoading}
                  newAddress={newAddress}
                  onSetNewAddress={setNewAddress}
                  onSign={signFromCurrent}
                  error={error}
                />
              )}
              {step === 3 && (
                <Step3Switch
                  identityId={Number(identityId)}
                  currentAddress={currentAddress}
                  isLoading={isLoading}
                  onSign={signFromNew}
                />
              )}
              {step === 4 && (
                <Step4Confirm
                  identityId={Number(identityId)}
                  walletCount={wallets.length}
                  newAddress={newAddress}
                  submitLinkWallet={submitLinkWallet}
                  isSubmitting={isSubmitting}
                  isLinked={isLinked}
                  txHash={txHash}
                  error={linkError}
                  onDashboard={() => {
                    window.location.href = "/identity";
                  }}
                  onLinkAnother={reset}
                />
              )}
              {linkError && step !== 4 && (
                <div
                  style={{
                    marginTop: 12,
                    fontSize: "0.8rem",
                    color: "var(--accent)",
                    padding: "8px 12px",
                    border: "1px solid rgba(220,51,51,0.3)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {linkError}
                </div>
              )}
            </ScrollableRegion>
          </div>
        </div>
      </ViewportContainer>
    </>
  );
}
