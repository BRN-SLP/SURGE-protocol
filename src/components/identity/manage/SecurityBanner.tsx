"use client";

import { ShieldCheck, AlertTriangle } from "lucide-react";
import { GhostButton } from "@/components/ui/GhostButton";

interface SecurityBannerProps {
  activeCount: number;
}

export function SecurityBanner({ activeCount }: SecurityBannerProps) {
  const isSecure = activeCount >= 3;

  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: "var(--radius-sm)",
        border: isSecure
          ? "1px solid color-mix(in srgb, var(--success) 25%, transparent)"
          : "1px solid color-mix(in srgb, var(--color-badge) 31%, transparent)",
        background: isSecure ? "rgba(34,170,102,0.04)" : "rgba(240,170,32,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {isSecure ? (
          <ShieldCheck size={16} color="var(--success)" strokeWidth={1.25} />
        ) : (
          <AlertTriangle size={16} color="var(--color-badge)" strokeWidth={1.25} />
        )}
        <div>
          <div
            style={{
              fontSize: "0.82rem",
              color: isSecure ? "var(--success)" : "var(--color-badge)",
              fontWeight: 400,
              letterSpacing: "0.02em",
            }}
          >
            {isSecure ? "Multi-Wallet Security Active" : "Security Recommendation"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
            {isSecure
              ? `${activeCount} wallets linked — distributed trust enabled`
              : `Link ${3 - activeCount} more wallet${3 - activeCount > 1 ? "s" : ""} to activate multi-wallet security`}
          </div>
        </div>
      </div>
      {!isSecure && (
        <GhostButton href="/identity/link" size="sm">
          + Link Wallet
        </GhostButton>
      )}
    </div>
  );
}
