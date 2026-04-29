"use client";

import { Check, ShieldCheck } from "lucide-react";

interface Step4ConfirmProps {
  identityId: number;
  walletCount: number;
  newAddress: string;
  submitLinkWallet: () => void;
  isSubmitting: boolean;
  isLinked: boolean;
  txHash: `0x${string}` | undefined;
  error: string | null;
  onDashboard: () => void;
  onLinkAnother: () => void;
}

export function Step4Confirm({
  identityId,
  walletCount,
  newAddress,
  submitLinkWallet,
  isSubmitting,
  isLinked,
  txHash,
  error,
  onDashboard,
  onLinkAnother,
}: Step4ConfirmProps) {
  const securityUnlocked = walletCount + 1 >= 3;

  const checklist = [
    { label: "Authorization signature collected", done: true },
    { label: "New wallet signature collected", done: true },
    { label: "On-chain transaction confirmed", done: isLinked },
  ];

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
      {/* Icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: isLinked ? "1px solid rgba(34,170,102,0.3)" : "1px solid var(--border)",
          background: isLinked ? "rgba(34,170,102,0.06)" : "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLinked ? (
          <Check size={28} color="var(--success)" strokeWidth={1.25} />
        ) : (
          <ShieldCheck size={28} color="var(--text-muted)" strokeWidth={1.25} />
        )}
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
          {isLinked ? "Wallet Linked Successfully" : "Ready to Submit"}
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 300, margin: 0 }}>
          {isLinked
            ? newAddress
              ? `${newAddress.slice(0, 6)}…${newAddress.slice(-4)} is now part of Identity #${String(identityId).padStart(5, "0")}`
              : `New wallet linked to Identity #${String(identityId).padStart(5, "0")}`
            : "Both wallets have signed. Submit the on-chain transaction to finalize the link."}
        </p>
      </div>

      {/* Checklist */}
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
        {checklist.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {item.done ? (
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
                fontSize: "0.85rem",
                color: item.done ? "var(--text-muted)" : "var(--text)",
                fontWeight: 300,
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* TX hash */}
      {txHash && (
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            fontWeight: 300,
            margin: 0,
            wordBreak: "break-all",
          }}
        >
          TX: {txHash}
        </p>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            width: "100%",
            padding: "8px 12px",
            fontSize: "0.8rem",
            color: "var(--accent)",
            border: "1px solid rgba(220,51,51,0.3)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          {error}
        </div>
      )}

      {!isLinked ? (
        <>
          <button
            onClick={submitLinkWallet}
            disabled={isSubmitting}
            style={{
              padding: "10px 24px",
              background: isSubmitting ? "var(--surface-2)" : "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8rem",
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Transaction"}
          </button>
          <p
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              fontWeight: 300,
              margin: 0,
              opacity: 0.6,
            }}
          >
            This will send a transaction. Gas fees apply.
          </p>
        </>
      ) : (
        <>
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
              <ShieldCheck size={18} color="var(--success)" strokeWidth={1.25} />
              <span style={{ fontSize: "0.85rem", color: "var(--success)", fontWeight: 400 }}>
                Security features unlocked! 2-of-3 multi-sig active.
              </span>
            </div>
          )}

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
        </>
      )}
    </div>
  );
}
