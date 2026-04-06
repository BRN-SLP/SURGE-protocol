"use client";

import { Link } from "lucide-react";
import { StatusDot } from "@/components/ui/StatusDot";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { CopyButton } from "@/components/ui/CopyButton";
import type { WalletInfo } from "@/types";

interface WalletsTabV2Props {
  wallets: WalletInfo[];
}

function truncate(addr: string) {
  return `${addr.slice(0, 8)}…${addr.slice(-5)}`;
}

export function WalletsTabV2({ wallets }: WalletsTabV2Props) {
  const activeCount = wallets.filter((w) => w.status === "active").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
          }}
        >
          {wallets.length} Wallet{wallets.length !== 1 ? "s" : ""} · {activeCount} Active
        </span>
        <a
          href="/identity/link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 10px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-muted)",
            fontSize: "0.7rem",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.04em",
            textDecoration: "none",
            transition: "border-color 0.15s ease, color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <Link size={11} strokeWidth={1.25} />
          Link
        </a>
      </div>

      {/* Wallet rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1, overflowY: "auto" }}>
        {wallets.map((wallet) => (
          <div
            key={wallet.address}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto auto",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              transition: "border-color 0.12s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <StatusDot status={wallet.status} />

            {/* Address + meta */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: "var(--text)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {truncate(wallet.address)}
                </span>
                {wallet.isCurrentWallet && (
                  <span
                    style={{
                      fontSize: "0.6rem",
                      color: "var(--text-faint)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    You
                  </span>
                )}
                <CopyButton text={wallet.address} label="Copy" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <RoleBadge role={wallet.role} />
                <span style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>
                  {wallet.chains.join(" · ")}
                </span>
              </div>
            </div>

            {/* Score + txns */}
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text)", fontWeight: 300 }}>
                  {wallet.score.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    color: "var(--text-faint)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Score
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text)", fontWeight: 300 }}>
                  {wallet.txCount.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    color: "var(--text-faint)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Txns
                </div>
              </div>
            </div>

            {/* Manage */}
            <a
              href="/identity/manage"
              style={{
                fontSize: "0.72rem",
                color: "var(--text-faint)",
                textDecoration: "none",
                padding: "2px 6px",
                borderRadius: "var(--radius-sm)",
                transition: "color 0.12s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}
            >
              →
            </a>
          </div>
        ))}

        {wallets.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-faint)",
              fontSize: "0.82rem",
              padding: "32px 0",
            }}
          >
            No wallets linked
          </div>
        )}
      </div>
    </div>
  );
}
