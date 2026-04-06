"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { BadgeIcon } from "@/components/ui/BadgeIcon";
import type { Badge, BadgeCategory } from "@/types";

interface BadgesTabV2Props {
  badges: Badge[];
}

const CATEGORY_FILTERS: { label: string; value: BadgeCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Official", value: "official" },
  { label: "Partner", value: "partner" },
  { label: "Heritage", value: "heritage" },
  { label: "Seasonal", value: "seasonal" },
];

const RARITY_COLORS: Record<string, string> = {
  common: "var(--text-faint)",
  rare: "#4d8eff",
  epic: "#9b59ff",
  legendary: "#f0aa20",
};

const RARITY_BG: Record<string, string> = {
  common: "rgba(255,255,255,0.03)",
  rare: "rgba(77,142,255,0.06)",
  epic: "rgba(155,89,255,0.06)",
  legendary: "rgba(240,170,32,0.06)",
};

function BadgeCell({ badge, onClick }: { badge: Badge; onClick: () => void }) {
  const earned = !!badge.earnedAt;
  const rarityColor = RARITY_COLORS[badge.rarity];

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "12px 8px",
        border: `1px solid ${earned ? "var(--border)" : "rgba(255,255,255,0.04)"}`,
        borderRadius: "var(--radius-sm)",
        background: earned ? RARITY_BG[badge.rarity] : "transparent",
        cursor: "pointer",
        opacity: earned ? 1 : 0.38,
        textAlign: "center",
        width: "100%",
        transition: "border-color 0.12s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = earned
          ? "var(--border-hover)"
          : "rgba(255,255,255,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = earned ? "var(--border)" : "rgba(255,255,255,0.04)";
      }}
    >
      <BadgeIcon name={badge.icon} size={22} color={earned ? rarityColor : "var(--text-faint)"} />
      <span
        style={{
          fontSize: "0.65rem",
          color: earned ? "var(--text)" : "var(--text-faint)",
          fontWeight: 300,
          lineHeight: 1.2,
          maxWidth: 64,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {badge.name}
      </span>
      <span
        style={{ width: 4, height: 4, borderRadius: "50%", background: rarityColor, flexShrink: 0 }}
      />
    </button>
  );
}

function BadgeModal({ badge, onClose }: { badge: Badge; onClose: () => void }) {
  const earned = !!badge.earnedAt;
  const rarityColor = RARITY_COLORS[badge.rarity];

  return (
    <Modal open onClose={onClose} title="" maxWidth={360}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          paddingBottom: 6,
        }}
      >
        <BadgeIcon name={badge.icon} size={44} color={earned ? rarityColor : "var(--text-faint)"} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1rem", color: "var(--text)", fontWeight: 300, marginBottom: 6 }}>
            {badge.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span
              style={{
                fontSize: "0.62rem",
                color: rarityColor,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                border: `1px solid ${rarityColor}40`,
                padding: "2px 8px",
                borderRadius: "var(--radius-sm)",
              }}
            >
              {badge.rarity}
            </span>
            <span
              style={{
                fontSize: "0.62rem",
                color: "var(--text-faint)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {badge.category}
            </span>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            textAlign: "center",
            lineHeight: 1.55,
          }}
        >
          {badge.description}
        </p>
        {earned ? (
          <div style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>
            Earned · {badge.earnedAt}
          </div>
        ) : badge.progress !== undefined && badge.maxProgress !== undefined ? (
          <div style={{ width: "100%", padding: "0 8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
                fontSize: "0.72rem",
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>Progress</span>
              <span style={{ color: "var(--text-faint)" }}>
                {badge.progress}/{badge.maxProgress}
              </span>
            </div>
            <div
              style={{
                height: 2,
                background: "var(--surface-2)",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(badge.progress / badge.maxProgress) * 100}%`,
                  background: rarityColor,
                  borderRadius: 99,
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>Not yet earned</div>
        )}
      </div>
    </Modal>
  );
}

export function BadgesTabV2({ badges }: BadgesTabV2Props) {
  const [filter, setFilter] = useState<BadgeCategory | "all">("all");
  const [selected, setSelected] = useState<Badge | null>(null);

  const filtered = filter === "all" ? badges : badges.filter((b) => b.category === filter);
  const earnedCount = badges.filter((b) => b.earnedAt).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      {/* Filter row */}
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
          {earnedCount} / {badges.length}
        </span>
        <div style={{ display: "flex", gap: 3 }}>
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "2px 8px",
                fontSize: "0.63rem",
                background: filter === f.value ? "var(--surface-2)" : "none",
                border: `1px solid ${filter === f.value ? "var(--border-hover)" : "transparent"}`,
                borderRadius: "var(--radius-sm)",
                color: filter === f.value ? "var(--text)" : "var(--text-faint)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.04em",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))",
          gap: 6,
          overflowY: "auto",
        }}
      >
        {filtered.map((badge) => (
          <BadgeCell key={badge.id} badge={badge} onClick={() => setSelected(badge)} />
        ))}
      </div>

      {selected && <BadgeModal badge={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
