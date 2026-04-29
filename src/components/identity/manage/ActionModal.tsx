"use client";

import { Modal } from "@/components/ui/Modal";
import type { WalletInfo } from "@/types";

export type ModalType = "primary" | "freeze" | null;

interface ActionModalProps {
  type: ModalType;
  wallet: WalletInfo | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const CONFIGS: Record<
  NonNullable<ModalType>,
  {
    title: string;
    body: string;
    confirmLabel: string;
    confirmColor: string;
    warning: string | null;
  }
> = {
  primary: {
    title: "Set as Primary Wallet",
    body: "This wallet will become your primary identity anchor. Your current primary wallet will be demoted to Regular.",
    confirmLabel: "Set as Primary",
    confirmColor: "var(--accent)",
    warning: null,
  },
  freeze: {
    title: "Emergency Freeze",
    body: "This wallet will be frozen immediately. All activity from this wallet will be suspended until you unfreeze it.",
    confirmLabel: "Freeze Wallet",
    confirmColor: "var(--color-link)",
    warning: "This action takes effect immediately and will be recorded on-chain.",
  },
};

export function ActionModal({ type, wallet, onClose, onConfirm, isLoading }: ActionModalProps) {
  if (!type || !wallet) return null;

  const cfg = CONFIGS[type];

  return (
    <Modal open={!!type} onClose={onClose} title={cfg.title} maxWidth={440}>
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
