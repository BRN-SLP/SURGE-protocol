"use client";

import { Link, Target, Hexagon, Share2 } from "lucide-react";
import type { ReactNode } from "react";

interface QuickActionsProps {
  activeQuestCount: number;
  eligibleDropCount: number;
  linkedWalletCount: number;
}

interface ActionRowProps {
  icon: ReactNode;
  label: string;
  badge?: number;
  sub?: string;
  href: string;
}

function ActionRow({ icon, label, badge, sub, href }: ActionRowProps) {
  return (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "7px 10px",
        borderRadius: "var(--radius-sm)",
        textDecoration: "none",
        color: "var(--text-muted)",
        transition: "background 0.12s ease, color 0.12s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--surface)";
        e.currentTarget.style.color = "var(--text)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--text-muted)";
      }}
    >
      <span
        style={{
          width: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "var(--text-faint)",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontSize: "0.8rem",
          fontWeight: 300,
          fontFamily: "var(--font-display)",
          letterSpacing: "0.02em",
          flex: 1,
        }}
      >
        {label}
      </span>
      {sub && <span style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>{sub}</span>}
      {badge !== undefined && badge > 0 && (
        <span
          style={{
            fontSize: "0.6rem",
            color: "var(--accent)",
            background: "rgba(220,51,51,0.08)",
            border: "1px solid rgba(220,51,51,0.18)",
            borderRadius: "var(--radius-sm)",
            padding: "1px 6px",
            letterSpacing: "0.04em",
          }}
        >
          {badge}
        </span>
      )}
    </a>
  );
}

export function QuickActions({
  activeQuestCount,
  eligibleDropCount,
  linkedWalletCount,
}: QuickActionsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <ActionRow
        icon={<Link size={13} strokeWidth={1.25} />}
        label="Link Wallet"
        sub={`${linkedWalletCount} linked`}
        href="/identity/link"
      />
      <ActionRow
        icon={<Target size={13} strokeWidth={1.25} />}
        label="Quests"
        badge={activeQuestCount}
        href="/identity?tab=quests"
      />
      <ActionRow
        icon={<Hexagon size={13} strokeWidth={1.25} />}
        label="Drops"
        badge={eligibleDropCount}
        href="/drops"
      />
      <ActionRow icon={<Share2 size={13} strokeWidth={1.25} />} label="Share Card" href="/verify" />
    </div>
  );
}
