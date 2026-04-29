"use client";

import { useState } from "react";
import { StatusDot } from "@/components/ui/StatusDot";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { Star, Snowflake, CircleDot, X, ChevronDown, Clock } from "lucide-react";
import type { WalletInfo } from "@/types";
import type { CompromiseRequestInfo } from "@/hooks/useCompromiseRequests";

export function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  frozen: "Frozen",
  compromised: "Compromised",
  pending: "Pending",
};

interface WalletCardProps {
  wallet: WalletInfo;
  compromiseRequest?: CompromiseRequestInfo;
  onSetPrimary: () => void;
  onFreeze: () => void;
  onUnfreeze: () => void;
  onMarkCompromised: () => void;
  onCancelCompromise?: (requestIndex: bigint) => void;
  onFinalizeCompromise?: (requestIndex: bigint) => void;
}

export function formatTimeRemaining(timelockEnd: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = timelockEnd - now;
  if (diff <= 0) return "Timelock expired";
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h remaining`;
  return `${hours}h remaining`;
}

export function WalletCard({
  wallet,
  compromiseRequest,
  onSetPrimary,
  onFreeze,
  onUnfreeze,
  onMarkCompromised,
  onCancelCompromise,
  onFinalizeCompromise,
}: WalletCardProps) {
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
      {/* Collapsed header */}
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
                      ? "var(--success)"
                      : wallet.status === "frozen"
                        ? "var(--color-link)"
                        : wallet.status === "compromised"
                          ? "var(--accent)"
                          : "var(--color-badge)",
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

              {/* Emergency Freeze — only for the currently connected wallet */}
              {wallet.isCurrentWallet && !isFrozen && (
                <button
                  onClick={onFreeze}
                  style={{
                    padding: "6px 14px",
                    fontSize: "0.75rem",
                    background: "none",
                    border: "1px solid rgba(77,142,255,0.3)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--color-link)",
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.04em",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-link)";
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
              )}

              {/* Unfreeze — multi-sig, any security wallet can initiate */}
              {isFrozen && (
                <button
                  onClick={onUnfreeze}
                  style={{
                    padding: "6px 14px",
                    fontSize: "0.75rem",
                    background: "none",
                    border: "1px solid rgba(77,142,255,0.5)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--color-link)",
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.04em",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-link)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(77,142,255,0.5)";
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

              {/* Mark as Compromised — multi-sig, not available for current wallet */}
              {!isFrozen && !wallet.isCurrentWallet && (
                <button
                  onClick={onMarkCompromised}
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
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(220,51,51,0.3)";
                  }}
                >
                  <X
                    size={11}
                    strokeWidth={1.25}
                    style={{ marginRight: 5, verticalAlign: "middle" }}
                  />
                  Mark as Compromised
                </button>
              )}
            </div>
          )}

          {/* PendingCompromise — show timelock status + cancel/finalize */}
          {wallet.status === "pending" && compromiseRequest && (
            <div
              style={{
                padding: "12px 14px",
                border: "1px solid rgba(240,170,32,0.3)",
                borderRadius: "var(--radius-sm)",
                background: "rgba(240,170,32,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={13} color="var(--color-badge)" strokeWidth={1.25} />
                <span style={{ fontSize: "0.78rem", color: "var(--color-badge)" }}>
                  Compromise review — {formatTimeRemaining(compromiseRequest.timelockEnd)}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {compromiseRequest.canCancel && onCancelCompromise && (
                  <button
                    onClick={() => onCancelCompromise(compromiseRequest.requestIndex)}
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
                    }}
                  >
                    Cancel Request
                  </button>
                )}
                {compromiseRequest.canFinalize && onFinalizeCompromise && (
                  <button
                    onClick={() => onFinalizeCompromise(compromiseRequest.requestIndex)}
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
                    }}
                  >
                    Finalize Compromise
                  </button>
                )}
              </div>
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
