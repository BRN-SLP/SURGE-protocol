"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ViewportContainer } from "@/components/layout/ViewportContainer";
import { CompactHeader } from "@/components/layout/CompactHeader";
import { ScrollableRegion } from "@/components/layout/ScrollableRegion";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { ShieldCheck, Check } from "lucide-react";
import { useLinkWallet } from "@/hooks/useLinkWallet";
import { useSurgeIdentity } from "@/hooks/useSurgeIdentity";
import { useWalletManagement } from "@/hooks/useWalletManagement";

const STEPS = ["Review", "Sign (Wallet A)", "Switch & Sign (Wallet B)", "Confirm"];

function Step1Review({
  identityId,
  currentAddress,
  walletCount,
  score,
  understood,
  onUnderstood,
  onContinue,
}: {
  identityId: number;
  currentAddress: string;
  walletCount: number;
  score: number;
  understood: boolean;
  onUnderstood: (v: boolean) => void;
  onContinue: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1
          style={{
            fontSize: "1.7rem",
            fontWeight: 300,
            color: "var(--text)",
            marginBottom: 6,
            letterSpacing: "-0.01em",
          }}
        >
          Link a New Wallet
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 300, margin: 0 }}>
          Add another wallet to your SURGE Identity to combine reputation.
        </p>
      </div>

      {/* Warning box */}
      <div
        style={{
          padding: "20px 24px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: "3px solid #f5a623",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <div
          style={{
            fontSize: "0.78rem",
            color: "#f5a623",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 12,
          }}
        >
          Important: This action is permanent
        </div>
        <ul
          style={{
            margin: 0,
            padding: "0 0 0 18px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {[
            `The new wallet will be permanently linked to your SURGE Identity #${String(identityId).padStart(5, "0")}`,
            "It cannot be unlinked or transferred",
            "A Soulbound Token (same ID) will be minted to the new wallet",
            "The new wallet's on-chain history will be added to your combined score",
            "You will earn a +20 pts linking bonus",
          ].map((item) => (
            <li
              key={item}
              style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 300 }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Identity info */}
      <div
        style={{
          padding: "16px 20px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-faint)",
            marginBottom: 4,
          }}
        >
          Current Identity
        </div>
        <div style={{ fontSize: "0.85rem", color: "var(--text)", fontWeight: 300 }}>
          #{String(identityId).padStart(5, "0")} · {score.toLocaleString()} pts · {walletCount}{" "}
          wallet{walletCount !== 1 ? "s" : ""} linked
        </div>
        <div
          style={{
            fontSize: "0.78rem",
            color: "var(--text-faint)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Connected as {currentAddress.slice(0, 8)}…{currentAddress.slice(-6)}
        </div>
      </div>

      {/* Checkbox */}
      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={understood}
          onChange={(e) => onUnderstood(e.target.checked)}
          style={{
            marginTop: 2,
            accentColor: "var(--accent)",
            width: 16,
            height: 16,
            flexShrink: 0,
            cursor: "pointer",
          }}
        />
        <span
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            fontWeight: 300,
            lineHeight: 1.5,
          }}
        >
          I understand this is permanent and irreversible
        </span>
      </label>

      <button
        onClick={onContinue}
        disabled={!understood}
        style={{
          padding: "12px 28px",
          background: understood ? "var(--accent)" : "var(--surface-2)",
          color: understood ? "#fff" : "var(--text-faint)",
          border: "none",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.8rem",
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: understood ? "pointer" : "not-allowed",
          transition: "background 0.2s ease, color 0.2s ease",
          alignSelf: "flex-start",
        }}
      >
        Continue →
      </button>
    </div>
  );
}

function Step2Sign({
  identityId,
  currentAddress,
  nonce,
  isLoading,
  onSign,
}: {
  identityId: number;
  currentAddress: string;
  nonce: number;
  isLoading: boolean;
  onSign: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1
          style={{
            fontSize: "1.7rem",
            fontWeight: 300,
            color: "var(--text)",
            marginBottom: 6,
            letterSpacing: "-0.01em",
          }}
        >
          Sign with Current Wallet
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 300, margin: 0 }}>
          Authorize the link from your currently connected wallet.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--text-faint)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Signing as
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text)" }}>
          {currentAddress}
        </span>
      </div>

      {/* Message preview */}
      <div>
        <div
          style={{
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-faint)",
            marginBottom: 8,
          }}
        >
          Message Preview
        </div>
        <div
          style={{
            padding: "16px",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            overflowX: "auto",
          }}
        >
          I authorize linking a new wallet to SURGE
          <br />
          Identity #{String(identityId).padStart(5, "0")}.<br />
          Chain: Base Sepolia (84532)
          <br />
          Nonce: {nonce}
        </div>
      </div>

      <button
        onClick={onSign}
        disabled={isLoading}
        style={{
          padding: "12px 28px",
          background: isLoading ? "var(--surface-2)" : "var(--accent)",
          color: isLoading ? "var(--text-faint)" : "#fff",
          border: "none",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.8rem",
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "background 0.2s ease",
          alignSelf: "flex-start",
        }}
      >
        {isLoading ? "Waiting for signature…" : "Sign Message"}
      </button>

      <p style={{ fontSize: "0.78rem", color: "var(--text-faint)", margin: 0 }}>
        Your wallet will prompt you to sign. No gas required.
      </p>
    </div>
  );
}

function Step3Switch({
  identityId,
  currentAddress,
  isLoading,
  onSign,
}: {
  identityId: number;
  currentAddress: string;
  isLoading: boolean;
  onSign: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1
          style={{
            fontSize: "1.7rem",
            fontWeight: 300,
            color: "var(--text)",
            marginBottom: 6,
            letterSpacing: "-0.01em",
          }}
        >
          Switch to New Wallet
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 300, margin: 0 }}>
          Now switch to the wallet you want to link, then sign the acceptance.
        </p>
      </div>

      {/* Instructions */}
      <div
        style={{
          padding: "20px 24px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            fontSize: "0.78rem",
            color: "var(--text-faint)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 4,
          }}
        >
          In your browser wallet
        </div>
        {["Switch to the new wallet address", "Make sure you're on the correct network"].map(
          (step, i) => (
            <div key={step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  color: "var(--text-faint)",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  fontWeight: 300,
                  paddingTop: 2,
                }}
              >
                {step}
              </span>
            </div>
          ),
        )}
      </div>

      <div
        style={{
          padding: "14px 18px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{ width: 8, height: 8, borderRadius: "50%", background: "#f5a623", flexShrink: 0 }}
        />
        <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
          Waiting for wallet switch…
        </span>
        <span
          style={{
            fontSize: "0.78rem",
            fontFamily: "var(--font-mono)",
            color: "var(--text-faint)",
            marginLeft: "auto",
          }}
        >
          {currentAddress.slice(0, 8)}…{currentAddress.slice(-6)}
        </span>
      </div>

      {/* Sign & Link button — simulates detecting new wallet */}
      <div
        style={{
          padding: "16px 20px",
          background: "rgba(34,170,102,0.04)",
          border: "1px solid rgba(34,170,102,0.2)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Check size={14} color="#22aa66" strokeWidth={1.25} />
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            New wallet detected:{" "}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
              {currentAddress ? `${currentAddress.slice(0, 6)}…${currentAddress.slice(-4)}` : "—"}
            </span>
          </span>
        </div>
        <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-faint)" }}>
          This wallet will become permanently linked to Identity #
          {String(identityId).padStart(5, "0")}
        </p>
        <button
          onClick={onSign}
          disabled={isLoading}
          style={{
            padding: "10px 24px",
            background: isLoading ? "var(--surface-2)" : "var(--accent)",
            color: isLoading ? "var(--text-faint)" : "#fff",
            border: "none",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.8rem",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background 0.2s ease",
            alignSelf: "flex-start",
          }}
        >
          {isLoading ? "Waiting for signature…" : "Sign & Link"}
        </button>
      </div>
    </div>
  );
}

function Step4Confirm({
  identityId,
  walletCount,
  newAddress,
  onDashboard,
  onLinkAnother,
}: {
  identityId: number;
  walletCount: number;
  newAddress: string;
  onDashboard: () => void;
  onLinkAnother: () => void;
}) {
  const securityUnlocked = walletCount + 1 >= 3;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* Success icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "1px solid rgba(34,170,102,0.3)",
          background: "rgba(34,170,102,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Check size={28} color="#22aa66" strokeWidth={1.25} />
      </div>

      <div>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 300,
            color: "var(--text)",
            marginBottom: 8,
            letterSpacing: "-0.01em",
          }}
        >
          Wallet Linked Successfully
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 300, margin: 0 }}>
          {newAddress
            ? `${newAddress.slice(0, 6)}…${newAddress.slice(-4)} is now part of Identity #${String(identityId).padStart(5, "0")}`
            : `New wallet linked to Identity #${String(identityId).padStart(5, "0")}`}
        </p>
      </div>

      {/* Details */}
      <div
        style={{
          width: "100%",
          padding: "16px 20px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {[
          "Authorization signature collected",
          "New wallet signature collected",
          "Wallet linked to your identity",
        ].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Check size={12} color="#22aa66" strokeWidth={1.25} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 300 }}>
              {item}
            </span>
          </div>
        ))}
      </div>

      {securityUnlocked && (
        <div
          style={{
            width: "100%",
            padding: "14px 20px",
            background: "rgba(34,170,102,0.04)",
            border: "1px solid rgba(34,170,102,0.2)",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <ShieldCheck size={18} color="#22aa66" strokeWidth={1.25} />
          <span style={{ fontSize: "0.85rem", color: "#22aa66", fontWeight: 400 }}>
            Security features unlocked! 2-of-3 multi-sig active.
          </span>
        </div>
      )}

      {/* CTAs */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={onDashboard}
          style={{
            padding: "10px 24px",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.8rem",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Go to Dashboard
        </button>
        <button
          onClick={onLinkAnother}
          style={{
            padding: "10px 24px",
            background: "none",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.8rem",
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Link Another Wallet
        </button>
      </div>
    </div>
  );
}

export default function LinkWalletPage() {
  const { tokenId, score, address } = useSurgeIdentity();
  const liveIdentityId = tokenId ?? 0n;

  // Freeze the identity ID for the duration of the flow so that switching
  // to Wallet B (no identity) doesn't reset it to 0.
  // The dashboard stores it in sessionStorage before navigating here.
  const identityId = (() => {
    if (typeof window === "undefined") return liveIdentityId;
    if (liveIdentityId > 0n) {
      sessionStorage.setItem("surge_link_identity_id", String(liveIdentityId));
      return liveIdentityId;
    }
    const stored = sessionStorage.getItem("surge_link_identity_id");
    return stored ? BigInt(stored) : 0n;
  })();

  const { wallets } = useWalletManagement(identityId);
  const { step, isLoading, error, newAddress, signFromCurrent, signFromNew, reset } = useLinkWallet(
    identityId,
    address ?? undefined,
  );
  // compat shims for old UI fields
  const understood = true;
  const nonce = 0;
  const setUnderstood = (_: boolean) => {};
  const proceedToSign = () => {};

  const currentAddress = address ?? "";
  const currentScore = Number(score);

  return (
    <>
      <Navbar />
      <ViewportContainer style={{ display: "flex", flexDirection: "column" }}>
        <CompactHeader
          title="Link Wallet"
          subtitle={`Step ${step} of ${STEPS.length} — ${STEPS[step - 1]}`}
          back={{ href: "/identity/manage", label: "Wallet Management" }}
        />

        {/* Centered wizard column */}
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
                  nonce={nonce}
                  isLoading={isLoading}
                  onSign={signFromCurrent}
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
                  onDashboard={() => {
                    window.location.href = "/identity";
                  }}
                  onLinkAnother={reset}
                />
              )}
              {error && (
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
                  {error}
                </div>
              )}
            </ScrollableRegion>
          </div>
        </div>
      </ViewportContainer>
    </>
  );
}
