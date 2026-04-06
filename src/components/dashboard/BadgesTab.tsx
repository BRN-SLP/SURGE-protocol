"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { BadgeIcon } from "@/components/ui/BadgeIcon";
import type { Badge, BadgeCategory } from "@/types";
import type { OnChainBadgeType } from "@/hooks/useBadges";
import { Award } from "lucide-react";

interface BadgesTabProps {
  badges: Badge[];
  claimable?: OnChainBadgeType[];
  onClaim?: (badgeId: number) => void;
  isClaiming?: boolean;
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

function BadgeCard({ badge, onClick }: { badge: Badge; onClick: () => void }) {
  const earned = !!badge.earnedAt;
  const rarityColor = RARITY_COLORS[badge.rarity];
  const rarityBg = RARITY_BG[badge.rarity];

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: "20px 14px",
        border: `1px solid ${earned ? "var(--border)" : "rgba(255,255,255,0.04)"}`,
        borderRadius: "var(--radius-sm)",
        background: earned ? rarityBg : "transparent",
        cursor: "pointer",
        transition: "border-color 0.15s ease",
        opacity: earned ? 1 : 0.4,
        textAlign: "center",
        width: "100%",
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
      <BadgeIcon name={badge.icon} size={28} color={earned ? rarityColor : "var(--text-faint)"} />
      <div>
        <div
          style={{
            fontSize: "0.8rem",
            color: earned ? "var(--text)" : "var(--text-faint)",
            fontWeight: 400,
            marginBottom: 3,
            letterSpacing: "0.01em",
          }}
        >
          {badge.name}
        </div>
        <div
          style={{
            fontSize: "0.65rem",
            color: rarityColor,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {badge.rarity}
        </div>
      </div>
      {!earned && badge.progress !== undefined && badge.maxProgress !== undefined && (
        <div style={{ width: "100%", marginTop: 2 }}>
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
                background: "var(--text-faint)",
                borderRadius: 99,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <div style={{ fontSize: "0.6rem", color: "var(--text-faint)", marginTop: 3 }}>
            {badge.progress}/{badge.maxProgress}
          </div>
        </div>
      )}
    </button>
  );
}

function BadgeModal({ badge, onClose }: { badge: Badge; onClose: () => void }) {
  const earned = !!badge.earnedAt;
  const rarityColor = RARITY_COLORS[badge.rarity];

  return (
    <Modal open onClose={onClose} title="" maxWidth={400}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          paddingBottom: 8,
        }}
      >
        <BadgeIcon name={badge.icon} size={48} color={earned ? rarityColor : "var(--text-faint)"} />
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.1rem", color: "var(--text)", fontWeight: 300, marginBottom: 6 }}
          >
            {badge.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span
              style={{
                fontSize: "0.65rem",
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
                fontSize: "0.65rem",
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
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            textAlign: "center",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {badge.description}
        </p>
        {earned ? (
          <div style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
            Earned · {badge.earnedAt}
          </div>
        ) : badge.progress !== undefined && badge.maxProgress !== undefined ? (
          <div style={{ width: "100%", padding: "0 8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
                fontSize: "0.75rem",
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>Progress</span>
              <span style={{ color: "var(--text-faint)" }}>
                {badge.progress}/{badge.maxProgress}
              </span>
            </div>
            <div
              style={{
                height: 3,
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
          <div style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>Not yet earned</div>
        )}
      </div>
    </Modal>
  );
}

export function BadgesTab({ badges, claimable, onClaim, isClaiming }: BadgesTabProps) {
  const [filter, setFilter] = useState<BadgeCategory | "all">("all");
  const [selected, setSelected] = useState<Badge | null>(null);
  const [claimingId, setClaimingId] = useState<number | null>(null);

  const filtered = filter === "all" ? badges : badges.filter((b) => b.category === filter);
  const earnedCount = badges.filter((b) => b.earnedAt).length;

  function handleClaim(badgeId: number) {
    setClaimingId(badgeId);
    onClaim?.(badgeId);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Claimable badges */}
      {claimable && claimable.length > 0 && (
        <div
          style={{
            border: "1px solid rgba(220,51,51,0.25)",
            borderRadius: "var(--radius-sm)",
            padding: "12px 14px",
            background: "rgba(220,51,51,0.03)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--accent)",
            }}
          >
            Available to Claim
          </div>
          {claimable.map((b) => {
            const active = claimingId === b.id && isClaiming;
            return (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                  borderTop: "1px solid rgba(220,51,51,0.12)",
                }}
              >
                <Award
                  size={14}
                  color="var(--accent)"
                  strokeWidth={1.25}
                  style={{ flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.82rem", color: "var(--text)", fontWeight: 400 }}>
                    {b.name}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-faint)", marginTop: 1 }}>
                    Score threshold: {b.scoreThreshold.toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => handleClaim(b.id)}
                  disabled={active || isClaiming}
                  style={{
                    padding: "5px 14px",
                    fontSize: "0.72rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: active ? "rgba(220,51,51,0.15)" : "none",
                    border: "1px solid var(--accent)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--accent)",
                    cursor: active ? "wait" : "pointer",
                    fontFamily: "var(--font-display)",
                    opacity: isClaiming && !active ? 0.5 : 1,
                    flexShrink: 0,
                  }}
                >
                  {active ? "Claiming…" : "Claim"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--text-muted)",
          }}
        >
          {earnedCount} / {badges.length} Earned
        </span>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "3px 10px",
                fontSize: "0.7rem",
                background: filter === f.value ? "var(--surface-2)" : "none",
                border: `1px solid ${filter === f.value ? "var(--border-hover)" : "transparent"}`,
                borderRadius: "var(--radius-sm)",
                color: filter === f.value ? "var(--text)" : "var(--text-faint)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.04em",
                transition: "all 0.15s ease",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Badge grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
          gap: 8,
        }}
      >
        {filtered.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} onClick={() => setSelected(badge)} />
        ))}
      </div>

      {selected && <BadgeModal badge={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
