"use client";

import { Check, Loader } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import type { MultiSigActionType, CollectedSig } from "@/hooks/useMultiSigAction";

interface SecurityActionModalProps {
  action: MultiSigActionType | null;
  targetWallet: `0x${string}` | null;
  collectedSigs: CollectedSig[];
  quorum: number;
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  isReadyToSubmit: boolean;
  error: string | null;
  txHash: `0x${string}` | undefined;
  connectedAddress: `0x${string}` | undefined;
  onSign: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

const LABELS: Record<
  MultiSigActionType,
  { title: string; verb: string; color: string; warning: string }
> = {
  unfreeze: {
    title: "Unfreeze Wallet",
    verb: "Unfreeze",
    color: "var(--color-link)",
    warning: "Requires 2 signatures from active security wallets.",
  },
  markCompromised: {
    title: "Mark as Compromised",
    verb: "Mark Compromised",
    color: "var(--accent)",
    warning:
      "This starts a 30-day review. After the timelock, the wallet will be permanently flagged.",
  },
};

export function SecurityActionModal({
  action,
  targetWallet,
  collectedSigs,
  quorum,
  isLoading,
  isSubmitting,
  isSuccess,
  isReadyToSubmit,
  error,
  txHash,
  connectedAddress,
  onSign,
  onSubmit,
  onClose,
}: SecurityActionModalProps) {
  if (!action || !targetWallet) return null;

  const cfg = LABELS[action];
  const alreadySigned = connectedAddress
    ? collectedSigs.some((c) => c.signer.toLowerCase() === connectedAddress.toLowerCase())
    : false;

  return (
    <Modal open={!!action} onClose={onClose} title={cfg.title} maxWidth={460}>
      {/* Target wallet */}
      <div
        style={{
          padding: "10px 14px",
          background: "var(--surface-2)",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          fontFamily: "monospace",
          marginBottom: 16,
          letterSpacing: "0.03em",
        }}
      >
        {targetWallet}
      </div>

      {/* Warning */}
      <div
        style={{
          padding: "10px 14px",
          border: `1px solid ${action === "markCompromised" ? "rgba(220,51,51,0.3)" : "rgba(77,142,255,0.3)"}`,
          borderRadius: "var(--radius-sm)",
          background:
            action === "markCompromised" ? "rgba(220,51,51,0.04)" : "rgba(77,142,255,0.04)",
          fontSize: "0.75rem",
          color: cfg.color,
          marginBottom: 20,
          lineHeight: 1.5,
        }}
      >
        {cfg.warning}
      </div>

      {/* Signature progress */}
      <div
        style={{
          marginBottom: 20,
          padding: "14px 16px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <div
          style={{
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-faint)",
            marginBottom: 10,
          }}
        >
          Signatures collected — {collectedSigs.length}/{quorum}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Array.from({ length: quorum }).map((_, i) => {
            const sig = collectedSigs[i];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {sig ? (
                  <Check
                    size={12}
                    color="var(--success)"
                    strokeWidth={1.25}
                    style={{ flexShrink: 0 }}
                  />
                ) : (
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      border: "1px solid var(--border)",
                      flexShrink: 0,
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: sig ? "var(--text-muted)" : "var(--text-faint)",
                    fontFamily: sig ? "monospace" : undefined,
                  }}
                >
                  {sig
                    ? `${sig.signer.slice(0, 6)}…${sig.signer.slice(-4)}`
                    : `Security wallet ${i + 1}`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Connected wallet hint */}
        {!isReadyToSubmit && connectedAddress && (
          <div style={{ marginTop: 12, fontSize: "0.72rem", color: "var(--text-faint)" }}>
            {alreadySigned
              ? "Switch to another security wallet to provide the second signature."
              : `Connected: ${connectedAddress.slice(0, 6)}…${connectedAddress.slice(-4)}`}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: "8px 12px",
            fontSize: "0.78rem",
            color: "var(--accent)",
            border: "1px solid rgba(220,51,51,0.3)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          {error}
        </div>
      )}

      {/* TX hash */}
      {txHash && (
        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            marginBottom: 16,
            wordBreak: "break-all",
          }}
        >
          TX: {txHash}
        </p>
      )}

      {/* Success state */}
      {isSuccess ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Check size={16} color="var(--success)" strokeWidth={1.25} />
          <span style={{ fontSize: "0.85rem", color: "var(--success)" }}>
            {action === "unfreeze"
              ? "Wallet unfrozen successfully"
              : "Wallet marked as compromised"}
          </span>
        </div>
      ) : null}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button
          onClick={onClose}
          disabled={isLoading || isSubmitting}
          style={{
            padding: "8px 18px",
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
            cursor: "pointer",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.04em",
          }}
        >
          {isSuccess ? "Close" : "Cancel"}
        </button>

        {!isSuccess && (
          <>
            {!isReadyToSubmit ? (
              <button
                onClick={onSign}
                disabled={isLoading || alreadySigned}
                style={{
                  padding: "8px 18px",
                  background: isLoading || alreadySigned ? "var(--surface-2)" : cfg.color,
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  color: isLoading || alreadySigned ? "var(--text-faint)" : "#fff",
                  fontSize: "0.8rem",
                  cursor: isLoading || alreadySigned ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.04em",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  opacity: isLoading || alreadySigned ? 0.7 : 1,
                }}
              >
                {isLoading && (
                  <Loader
                    size={12}
                    strokeWidth={1.5}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                )}
                {isLoading
                  ? "Waiting…"
                  : alreadySigned
                    ? "Switch wallet to sign"
                    : "Sign with connected wallet"}
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                style={{
                  padding: "8px 18px",
                  background: isSubmitting ? "var(--surface-2)" : cfg.color,
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  color: isSubmitting ? "var(--text-faint)" : "#fff",
                  fontSize: "0.8rem",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.04em",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? "Submitting…" : `Submit — ${cfg.verb}`}
              </button>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
