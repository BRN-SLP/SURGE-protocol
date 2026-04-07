"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ViewportContainer } from "@/components/layout/ViewportContainer";
import { CompactHeader } from "@/components/layout/CompactHeader";
import { ScrollableRegion } from "@/components/layout/ScrollableRegion";
import { Modal } from "@/components/ui/Modal";
import { StatusDot } from "@/components/ui/StatusDot";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { GhostButton } from "@/components/ui/GhostButton";
import { useWalletManagement } from "@/hooks/useWalletManagement";
import { useSurgeIdentity } from "@/hooks/useSurgeIdentity";
import {
  ShieldCheck,
  AlertTriangle,
  Star,
  Snowflake,
  CircleDot,
  X,
  ChevronDown,
} from "lucide-react";
import type { WalletInfo } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  frozen: "Frozen",
  compromised: "Compromised",
  pending: "Pending",
};

// ─── Security Status Banner ───────────────────────────────────────────────────

function SecurityBanner({ activeCount }: { activeCount: number }) {
  const isSecure = activeCount >= 3;

  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${isSecure ? "#22aa6640" : "#f0aa2050"}`,
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
          <ShieldCheck size={16} color="#22aa66" strokeWidth={1.25} />
        ) : (
          <AlertTriangle size={16} color="#f0aa20" strokeWidth={1.25} />
        )}
        <div>
          <div
            style={{
              fontSize: "0.82rem",
              color: isSecure ? "#22aa66" : "#f0aa20",
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

// ─── Action Modals ────────────────────────────────────────────────────────────

type ModalType = "primary" | "freeze" | "compromised" | null;

interface ActionModalProps {
  type: ModalType;
  wallet: WalletInfo | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

function ActionModal({ type, wallet, onClose, onConfirm, isLoading }: ActionModalProps) {
  if (!type || !wallet) return null;

  const configs = {
    primary: {
      title: "Set as Primary Wallet",
      body: `This wallet will become your primary identity anchor. Your current primary wallet will be demoted to Regular.`,
      confirmLabel: "Set as Primary",
      confirmColor: "var(--accent)",
      warning: null,
    },
    freeze: {
      title: "Emergency Freeze",
      body: `This wallet will be frozen immediately. All activity from this wallet will be suspended until you unfreeze it.`,
      confirmLabel: "Freeze Wallet",
      confirmColor: "#4d8eff",
      warning: "This action takes effect immediately and will be recorded on-chain.",
    },
    compromised: {
      title: "Mark as Compromised",
      body: `This marks the wallet as compromised. It will be flagged in your identity record and excluded from score calculations.`,
      confirmLabel: "Mark Compromised",
      confirmColor: "#dc3333",
      warning: "This action cannot be undone. The wallet will be permanently flagged.",
    },
  };

  const cfg = configs[type];

  return (
    <Modal open={!!type} onClose={onClose} title={cfg.title} maxWidth={440}>
      {/* Wallet address */}
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
        {wallet.address}
      </div>

      <p
        style={{
          margin: "0 0 16px",
          fontSize: "0.82rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        {cfg.body}
      </p>

      {cfg.warning && (
        <div
          style={{
            padding: "10px 14px",
            border: "1px solid rgba(220,51,51,0.3)",
            borderRadius: "var(--radius-sm)",
            background: "rgba(220,51,51,0.04)",
            fontSize: "0.75rem",
            color: "var(--accent)",
            marginBottom: 20,
            lineHeight: 1.5,
          }}
        >
          {cfg.warning}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button
          onClick={onClose}
          disabled={isLoading}
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
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          style={{
            padding: "8px 18px",
            background: cfg.confirmColor,
            border: "none",
            borderRadius: "var(--radius-sm)",
            color: "#fff",
            fontSize: "0.8rem",
            cursor: isLoading ? "wait" : "pointer",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.04em",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Processing…" : cfg.confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

// ─── Wallet Card ──────────────────────────────────────────────────────────────

interface WalletCardProps {
  wallet: WalletInfo;
  onSetPrimary: () => void;
  onFreeze: () => void;
  onCompromised: () => void;
}

function WalletCard({ wallet, onSetPrimary, onFreeze, onCompromised }: WalletCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isFrozen = wallet.status === "frozen";
  const isCompromised = wallet.status === "compromised";
  const isPrimary = wallet.role === "primary";
  const isDisabled = isFrozen || isCompromised;

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        background: isCompromised
          ? "rgba(220,51,51,0.03)"
          : isFrozen
            ? "rgba(77,142,255,0.03)"
            : "transparent",
        overflow: "hidden",
        transition: "border-color 0.15s ease",
        opacity: isDisabled ? 0.75 : 1,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
      }}
    >
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: "100%",
          padding: "14px 18px",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
          textAlign: "left",
        }}
      >
        <StatusDot status={wallet.status} size={8} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "0.88rem",
                color: "var(--text)",
                fontFamily: "monospace",
                letterSpacing: "0.02em",
              }}
            >
              {truncateAddress(wallet.address)}
            </span>
            <RoleBadge role={wallet.role} />
            {wallet.isCurrentWallet && (
              <span
                style={{
                  fontSize: "0.62rem",
                  color: "var(--text-faint)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "1px 6px",
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-display)",
                }}
              >
                CONNECTED
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>
              {wallet.chains.join(" · ")}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>
              {wallet.txCount} txns
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>
              since {wallet.linkedSince}
            </span>
          </div>
        </div>

        <ChevronDown
          size={14}
          color="var(--text-faint)"
          strokeWidth={1.25}
          style={{
            transition: "transform 0.2s ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Expanded details */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Stats row */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-faint)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 3,
                }}
              >
                Score Contribution
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--text)", fontWeight: 400 }}>
                +{wallet.score}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-faint)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 3,
                }}
              >
                Status
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color:
                    wallet.status === "active"
                      ? "#22aa66"
                      : wallet.status === "frozen"
                        ? "#4d8eff"
                        : wallet.status === "compromised"
                          ? "#dc3333"
                          : "#f0aa20",
                }}
              >
                {STATUS_LABELS[wallet.status]}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-faint)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 3,
                }}
              >
                Full Address
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  fontFamily: "monospace",
                  letterSpacing: "0.02em",
                }}
              >
                {wallet.address}
              </div>
            </div>
          </div>

          {/* Actions */}
          {!isCompromised && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {!isPrimary && !isFrozen && (
                <button
                  onClick={onSetPrimary}
                  style={{
                    padding: "6px 14px",
                    fontSize: "0.75rem",
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.04em",
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "var(--border-hover)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                  }}
                >
                  <Star
                    size={11}
                    strokeWidth={1.25}
                    style={{ marginRight: 5, verticalAlign: "middle" }}
                  />
                  Set as Primary
                </button>
              )}

              {!isFrozen ? (
                <button
                  onClick={onFreeze}
                  style={{
                    padding: "6px 14px",
                    fontSize: "0.75rem",
                    background: "none",
                    border: "1px solid rgba(77,142,255,0.3)",
                    borderRadius: "var(--radius-sm)",
                    color: "#4d8eff",
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.04em",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#4d8eff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(77,142,255,0.3)";
                  }}
                >
                  <Snowflake
                    size={11}
                    strokeWidth={1.25}
                    style={{ marginRight: 5, verticalAlign: "middle" }}
                  />
                  Emergency Freeze
                </button>
              ) : (
                <button
                  onClick={() => onFreeze()}
                  style={{
                    padding: "6px 14px",
                    fontSize: "0.75rem",
                    background: "none",
                    border: "1px solid rgba(77,142,255,0.5)",
                    borderRadius: "var(--radius-sm)",
                    color: "#4d8eff",
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.04em",
                  }}
                >
                  <CircleDot
                    size={11}
                    strokeWidth={1.25}
                    style={{ marginRight: 5, verticalAlign: "middle" }}
                  />
                  Unfreeze Wallet
                </button>
              )}

              <button
                onClick={onCompromised}
                style={{
                  padding: "6px 14px",
                  fontSize: "0.75rem",
                  background: "none",
                  border: "1px solid rgba(220,51,51,0.3)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--accent)",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.04em",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(220,51,51,0.3)";
                }}
              >
                <X
                  size={11}
                  strokeWidth={1.25}
                  style={{ marginRight: 5, verticalAlign: "middle" }}
                />
                Mark as Compromised
              </button>
            </div>
          )}

          {isCompromised && (
            <div style={{ fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.02em" }}>
              This wallet has been flagged as compromised and is excluded from score calculations.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WalletManagePage() {
  const { tokenId } = useSurgeIdentity();
  const identityId = tokenId ?? 0n;
  const { wallets, activeCount, selfFreeze, setPrimary } = useWalletManagement(identityId);
  // compat shims for UI that uses old API names
  const updateWalletStatus = (addr: string, status: string) => {
    if (status === "frozen") selfFreeze();
  };
  const setAsPrimary = (addr: string) => setPrimary(addr as `0x${string}`);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [targetWallet, setTargetWallet] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function openModal(type: ModalType, wallet: WalletInfo) {
    setModalType(type);
    setTargetWallet(wallet);
  }

  function closeModal() {
    if (isLoading) return;
    setModalType(null);
    setTargetWallet(null);
  }

  function handleConfirm() {
    if (!modalType || !targetWallet) return;
    setIsLoading(true);

    if (modalType === "primary") {
      setAsPrimary(targetWallet.address);
    } else if (modalType === "freeze") {
      const newStatus = targetWallet.status === "frozen" ? "active" : "frozen";
      updateWalletStatus(targetWallet.address, newStatus);
    } else if (modalType === "compromised") {
      updateWalletStatus(targetWallet.address, "compromised");
    }

    setIsLoading(false);
    setModalType(null);
    setTargetWallet(null);
  }

  const pendingWallets = wallets.filter((w) => w.status === "pending");

  return (
    <>
      <Navbar />
      <ViewportContainer style={{ display: "flex", flexDirection: "column" }}>
        <CompactHeader
          title="Wallet Management"
          subtitle={`${wallets.length} wallet${wallets.length !== 1 ? "s" : ""} linked`}
          back={{ href: "/identity", label: "Dashboard" }}
          actions={
            <GhostButton href="/identity/link" size="sm">
              + Link Wallet
            </GhostButton>
          }
        />

        <ScrollableRegion
          style={{
            padding: "16px var(--section-px)",
            maxWidth: 800,
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {/* Security Banner */}
          <div style={{ marginBottom: 16 }}>
            <SecurityBanner activeCount={activeCount} />
          </div>

          {/* Pending actions */}
          {pendingWallets.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  padding: "12px 16px",
                  border: "1px solid rgba(240,170,32,0.3)",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(240,170,32,0.04)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#f0aa20",
                    marginBottom: 8,
                    letterSpacing: "0.04em",
                  }}
                >
                  PENDING ACTIONS
                </div>
                {pendingWallets.map((w) => (
                  <div
                    key={w.address}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: "0.78rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    <StatusDot status="pending" size={6} />
                    <span style={{ fontFamily: "monospace" }}>{truncateAddress(w.address)}</span>
                    <span>— awaiting confirmation</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wallet list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {wallets.map((wallet) => (
              <WalletCard
                key={wallet.address}
                wallet={wallet}
                onSetPrimary={() => openModal("primary", wallet)}
                onFreeze={() => openModal("freeze", wallet)}
                onCompromised={() => openModal("compromised", wallet)}
              />
            ))}
          </div>

          {/* Link another wallet CTA */}
          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <GhostButton href="/identity/link" size="sm">
              + Link Another Wallet
            </GhostButton>
          </div>
        </ScrollableRegion>
      </ViewportContainer>

      <ActionModal
        type={modalType}
        wallet={targetWallet}
        onClose={closeModal}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </>
  );
}
