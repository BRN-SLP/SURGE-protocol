"use client";

import { StatusDot } from "@/components/ui/StatusDot";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { CopyButton } from "@/components/ui/CopyButton";
import { Link } from "lucide-react";
import type { WalletInfo } from "@/types";

interface WalletsTabProps {
  wallets: WalletInfo[];
}

function truncateAddress(addr: string) {
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

export function WalletsTab({ wallets }: WalletsTabProps) {
  const activeCount = wallets.filter((w) => w.status === "active").length;
  const hasMultiSig = activeCount >= 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span
            style={{
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--text-muted)",
            }}
          >
            {wallets.length} Wallet{wallets.length !== 1 ? "s" : ""} Linked
          </span>
          {hasMultiSig && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginLeft: 16,
                padding: "2px 10px",
                border: "1px solid rgba(34,170,102,0.3)",
                borderRadius: "var(--radius-sm)",
                background: "rgba(34,170,102,0.06)",
                fontSize: "0.68rem",
                color: "var(--success)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--success)",
                  display: "inline-block",
                }}
              />
              Multi-Sig Active
            </div>
          )}
        </div>
        <a
          href="/identity/link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-muted)",
            fontSize: "0.78rem",
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
          <Link size={12} strokeWidth={1.25} style={{ marginRight: 5, verticalAlign: "middle" }} />
          Link New Wallet
        </a>
      </div>

      {/* Wallet list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {wallets.map((wallet) => (
          <div
            key={wallet.address}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              background: wallet.isCurrentWallet ? "rgba(255,255,255,0.01)" : "transparent",
              transition: "border-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <StatusDot status={wallet.status} />

            {/* Address */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    color: "var(--text)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {truncateAddress(wallet.address)}
                </span>
                {wallet.isCurrentWallet && (
                  <span
                    style={{
                      fontSize: "0.65rem",
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <RoleBadge role={wallet.role} />
                <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>
                  {wallet.chains.join(" · ")}
                </span>
              </div>
            </div>

            {/* Manage link */}
            <a
              href="/identity/manage"
              style={{
                fontSize: "0.75rem",
                color: "var(--text-faint)",
                textDecoration: "none",
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                transition: "color 0.12s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}
            >
              Manage →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
