"use client";

interface Step1ReviewProps {
  identityId: number;
  currentAddress: string;
  walletCount: number;
  score: number;
  understood: boolean;
  onUnderstood: (v: boolean) => void;
  onContinue: () => void;
}

export function Step1Review({
  identityId,
  currentAddress,
  walletCount,
  score,
  understood,
  onUnderstood,
  onContinue,
}: Step1ReviewProps) {
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
          border: "1px solid var(--color-badge)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <div
          style={{
            fontSize: "0.78rem",
            color: "var(--color-badge)",
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
      <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
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
