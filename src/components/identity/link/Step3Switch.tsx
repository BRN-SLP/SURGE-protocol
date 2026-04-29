"use client";

import { Check } from "lucide-react";

interface Step3SwitchProps {
  identityId: number;
  currentAddress: string;
  isLoading: boolean;
  onSign: () => void;
}

export function Step3Switch({ identityId, currentAddress, isLoading, onSign }: Step3SwitchProps) {
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
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--color-badge)",
            flexShrink: 0,
          }}
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

      {/* Sign & Link panel */}
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
          <Check size={14} color="var(--success)" strokeWidth={1.25} />
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
