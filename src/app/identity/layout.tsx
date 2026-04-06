"use client";

import { useSurgeIdentity } from "@/hooks/useSurgeIdentity";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { SkeletonShimmer } from "@/components/ui/SkeletonShimmer";
import { Hexagon } from "lucide-react";

function GateScreen({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        paddingTop: 64,
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Hexagon size={24} color="var(--accent)" strokeWidth={1.25} />
      </div>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: "1.3rem",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            color: "var(--text)",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            fontWeight: 300,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      </div>
      {action}
    </div>
  );
}

function _LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        paddingTop: 64,
      }}
    >
      <div style={{ width: 340, display: "flex", flexDirection: "column", gap: 12 }}>
        <SkeletonShimmer height={320} borderRadius="var(--radius-sm)" />
        <SkeletonShimmer height={44} />
        <SkeletonShimmer height={200} />
      </div>
    </div>
  );
}

export default function IdentityLayout({ children }: { children: React.ReactNode }) {
  const { isConnected, hasIdentity, mint, isMinting, isMinted } = useSurgeIdentity();
  const { openConnectModal } = useConnectModal();

  // Still hydrating — don't flash gate
  if (typeof window === "undefined") return null;

  if (!isConnected) {
    return (
      <GateScreen
        title="Connect Your Wallet"
        subtitle="Connect your wallet to access your SURGE Identity Dashboard and reputation profile."
        action={
          <button
            onClick={() => openConnectModal?.()}
            style={{
              padding: "10px 28px",
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
            Connect Wallet
          </button>
        }
      />
    );
  }

  if (!hasIdentity && !isMinted) {
    return (
      <GateScreen
        title="No Identity Found"
        subtitle="You don't have a SURGE Identity yet. Mint your soulbound identity NFT to start building your on-chain reputation."
        action={
          <button
            onClick={mint}
            disabled={isMinting}
            style={{
              padding: "10px 28px",
              background: isMinting ? "var(--surface-2)" : "var(--accent)",
              color: isMinting ? "var(--text-muted)" : "#fff",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8rem",
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: isMinting ? "not-allowed" : "pointer",
              transition: "background 0.2s ease",
            }}
          >
            {isMinting ? "Minting…" : "Initialize Identity"}
          </button>
        }
      />
    );
  }

  return <>{children}</>;
}
