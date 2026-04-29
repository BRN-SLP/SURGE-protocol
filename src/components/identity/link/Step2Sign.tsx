"use client";

interface Step2SignProps {
  identityId: number;
  currentAddress: string;
  isLoading: boolean;
  newAddress: string;
  onSetNewAddress: (addr: string) => void;
  onSign: () => void;
  error: string | null;
}

export function Step2Sign({
  identityId,
  currentAddress,
  isLoading,
  newAddress,
  onSetNewAddress,
  onSign,
  error,
}: Step2SignProps) {
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
          Identity #{String(identityId).padStart(5, "0")}.
          <br />
          Chain: Base Sepolia (84532)
          <br />
          <span style={{ color: "var(--text-faint)" }}>Nonce: [fetched at signing]</span>
        </div>
      </div>

      {/* New wallet address input */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--text-faint)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          New wallet address
        </span>
        <input
          type="text"
          placeholder="0x…"
          value={newAddress}
          onChange={(e) => onSetNewAddress(e.target.value)}
          style={{
            padding: "12px 16px",
            background: "var(--surface)",
            border: `1px solid ${error && !newAddress ? "var(--accent)" : "var(--border)"}`,
            borderRadius: "var(--radius-sm)",
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        {error && <p style={{ fontSize: "0.75rem", color: "var(--accent)", margin: 0 }}>{error}</p>}
      </div>

      <button
        onClick={onSign}
        disabled={isLoading || !newAddress}
        style={{
          padding: "12px 28px",
          background: isLoading || !newAddress ? "var(--surface-2)" : "var(--accent)",
          color: isLoading || !newAddress ? "var(--text-faint)" : "#fff",
          border: "none",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.8rem",
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: isLoading || !newAddress ? "not-allowed" : "pointer",
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
