"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ViewportContainer } from "@/components/layout/ViewportContainer";
import { CompactHeader } from "@/components/layout/CompactHeader";
import { ScrollableRegion } from "@/components/layout/ScrollableRegion";
import { IdentityCard } from "@/components/identity-card/IdentityCard";
import { GhostButton } from "@/components/ui/GhostButton";
import { TierDots } from "@/components/ui/TierDots";
import { Toast } from "@/components/ui/Toast";
import { Tooltip } from "@/components/ui/Tooltip";
import { getTierFromScore, TIERS } from "@/types";
import type { IdentityCardData } from "@/types";
import { graphClient } from "@/lib/graph";
import { BadgeIcon } from "@/components/ui/BadgeIcon";
import { Search, Check, Share2, Copy } from "lucide-react";

// ─── GraphQL queries ───────────────────────────────────────────────────────────

const BY_ID_QUERY = `
  query IdentityById($id: ID!) {
    identity(id: $id) {
      id
      owner
      score
      mintedAt
      badges {
        id
        badgeType { id name scoreThreshold }
        claimedAt
      }
    }
  }
`;

const BY_OWNER_QUERY = `
  query IdentityByOwner($owner: Bytes!) {
    identities(where: { owner: $owner }, first: 1) {
      id
      owner
      score
      mintedAt
      badges {
        id
        badgeType { id name scoreThreshold }
        claimedAt
      }
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface GraphBadgeClaim {
  id: string;
  badgeType: { id: string; name: string; scoreThreshold: string };
  claimedAt: string;
}

interface GraphIdentityResult {
  id: string;
  owner: string;
  score: string;
  mintedAt: string;
  badges: GraphBadgeClaim[];
}

type LookupResult = { found: true; identity: GraphIdentityResult } | { found: false };

const RARITY_COLORS: Record<string, string> = {
  common: "var(--text-faint)",
  rare: "#4d8eff",
  epic: "#9b59ff",
  legendary: "#f0aa20",
};

function thresholdToRarity(threshold: string): string {
  const t = Number(threshold);
  if (t >= 5000) return "legendary";
  if (t >= 2000) return "epic";
  if (t >= 500) return "rare";
  return "common";
}

function formatMemberSince(ts: string): string {
  const d = new Date(Number(ts) * 1000);
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

// ─── Graph lookup ─────────────────────────────────────────────────────────────

async function resolveIdentity(query: string): Promise<LookupResult> {
  const normalized = query.trim().replace(/^#/, "");

  // Numeric → by tokenId
  if (/^\d+$/.test(normalized)) {
    const data = await graphClient.request<{ identity: GraphIdentityResult | null }>(BY_ID_QUERY, {
      id: normalized,
    });
    if (data.identity) return { found: true, identity: data.identity };
    return { found: false };
  }

  // 0x address → by owner
  const data = await graphClient.request<{ identities: GraphIdentityResult[] }>(BY_OWNER_QUERY, {
    owner: normalized.toLowerCase(),
  });
  if (data.identities.length > 0) return { found: true, identity: data.identities[0] };
  return { found: false };
}

function isValidQuery(q: string): boolean {
  const t = q.trim().replace(/^#/, "");
  return /^0x[0-9a-fA-F]{40}$/.test(t) || /^\d+$/.test(t);
}

// ─── Search bar ───────────────────────────────────────────────────────────────

function SearchBar({
  defaultValue,
  onSearch,
}: {
  defaultValue: string;
  onSearch: (q: string) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function submit() {
    const q = value.trim();
    if (!q) return;
    if (!isValidQuery(q)) {
      setError(true);
      return;
    }
    setError(false);
    onSearch(q);
  }

  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <div
        style={{
          display: "flex",
          height: 56,
          border: `1px solid ${error ? "var(--accent)" : "var(--border)"}`,
          borderRadius: "var(--radius-sm)",
          background: "var(--surface)",
          overflow: "hidden",
          transition: "border-color 0.2s ease",
        }}
        onFocusCapture={() => {
          const el = inputRef.current?.closest("div");
          if (el) el.style.borderColor = error ? "var(--accent)" : "var(--accent)";
        }}
        onBlurCapture={() => {
          const el = inputRef.current?.closest("div");
          if (el) el.style.borderColor = error ? "var(--accent)" : "var(--border)";
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 18,
            color: "var(--text-faint)",
            flexShrink: 0,
          }}
        >
          <Search size={15} strokeWidth={1.25} />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Enter wallet address (0x...) or Identity ID (#12345)"
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            padding: "0 12px",
            fontSize: "0.9rem",
            color: "var(--text)",
            fontFamily: "var(--font-display)",
            fontWeight: 300,
          }}
        />
        <button
          onClick={submit}
          style={{
            padding: "0 24px",
            background: "var(--surface-2)",
            border: "none",
            borderLeft: "1px solid var(--border)",
            color: "var(--text)",
            fontSize: "0.82rem",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
            flexShrink: 0,
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--border)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-2)";
          }}
        >
          Verify
        </button>
      </div>
      {error && (
        <div
          style={{
            marginTop: 6,
            fontSize: "0.8rem",
            color: "var(--accent)",
            fontWeight: 300,
            letterSpacing: "0.02em",
          }}
        >
          Please enter a valid wallet address (0x…) or Identity ID
        </div>
      )}
    </div>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────

function IdentityFound({ identity }: { identity: GraphIdentityResult }) {
  const [toastVisible, setToastVisible] = useState(false);
  const score = Number(identity.score);
  const tier = getTierFromScore(score);
  const memberSince = formatMemberSince(identity.mintedAt);
  const shortOwner = `${identity.owner.slice(0, 6)}…${identity.owner.slice(-4)}`;

  const cardData: IdentityCardData = {
    id: Number(identity.id),
    tier,
    score,
    walletCount: 1,
    chainCount: 1,
    badgeCount: identity.badges.length,
    memberSince,
  };

  const detailRows = [
    { label: "Identity ID", value: `#${identity.id}` },
    {
      label: "Tier",
      value: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          {TIERS[tier].label} <TierDots tier={tier} />
        </span>
      ),
    },
    { label: "Score", value: `${score.toLocaleString()} pts` },
    { label: "Badges", value: `${identity.badges.length} earned` },
    {
      label: "Owner",
      value: <span style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>{shortOwner}</span>,
    },
    { label: "Member Since", value: memberSince },
  ];

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setToastVisible(true);
  }

  return (
    <>
      {/* Verification seal */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <Check size={16} color="#22aa66" strokeWidth={1.25} />
        <span
          style={{
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Verified SURGE Identity
        </span>
      </div>

      {/* Identity card — read-only */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <IdentityCard data={cardData} interactive={false} />
      </div>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        {/* Details section */}
        <div style={{ padding: "12px 18px", background: "var(--surface-2)" }}>
          <span
            style={{
              fontSize: "0.65rem",
              color: "var(--text-faint)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Details
          </span>
        </div>
        {detailRows.map((row, i) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "11px 18px",
              borderTop: i === 0 ? "none" : "1px solid var(--border)",
              gap: 16,
            }}
          >
            <span style={{ fontSize: "0.88rem", color: "var(--text-faint)", fontWeight: 300 }}>
              {row.label}
            </span>
            <span style={{ fontSize: "0.88rem", color: "var(--text)", fontWeight: 400 }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Public badges */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: "0.65rem",
            color: "var(--text-faint)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 12,
          }}
        >
          Public Badges
        </div>
        {identity.badges.length === 0 ? (
          <span style={{ fontSize: "0.82rem", color: "var(--text-faint)" }}>No public badges</span>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {identity.badges.map((badge) => {
              const rarity = thresholdToRarity(badge.badgeType.scoreThreshold);
              return (
                <Tooltip key={badge.id} content={`${badge.badgeType.name} · ${rarity}`}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${RARITY_COLORS[rarity]}40`,
                      borderRadius: "var(--radius-sm)",
                      background: `${RARITY_COLORS[rarity]}0a`,
                      cursor: "default",
                    }}
                  >
                    <BadgeIcon name="award" size={18} color={RARITY_COLORS[rarity]} />
                  </div>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <GhostButton onClick={copyLink} size="sm">
          <Share2
            size={12}
            strokeWidth={1.25}
            style={{ marginRight: 5, verticalAlign: "middle" }}
          />
          Share
        </GhostButton>
        <GhostButton onClick={copyLink} size="sm">
          <Copy size={12} strokeWidth={1.25} style={{ marginRight: 5, verticalAlign: "middle" }} />
          Copy Link
        </GhostButton>
      </div>

      <Toast
        message="Link copied to clipboard"
        type="success"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </>
  );
}

function IdentityNotFound() {
  return (
    <div style={{ textAlign: "center" }}>
      {/* Empty card outline */}
      <div
        style={{
          width: 280,
          height: 180,
          margin: "0 auto 28px",
          border: "1.5px dashed var(--border)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-faint)",
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        No Identity Found
      </div>

      <p
        style={{
          margin: "0 0 8px",
          fontSize: "1.1rem",
          color: "var(--text-muted)",
          fontWeight: 300,
          lineHeight: 1.6,
        }}
      >
        This wallet is not linked to a SURGE Identity.
      </p>

      <p
        style={{
          margin: "0 0 28px",
          fontSize: "0.9rem",
          color: "var(--text-faint)",
          fontWeight: 300,
          lineHeight: 1.6,
        }}
      >
        Is this your wallet? Create your SURGE Identity
        <br />
        and start building your on-chain reputation.
      </p>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <GhostButton href="/identity" size="sm">
          Create Your Identity →
        </GhostButton>
        <a
          href="/about"
          style={{
            fontSize: "0.78rem",
            color: "var(--text-faint)",
            textDecoration: "none",
            letterSpacing: "0.03em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-faint)";
          }}
        >
          Learn more about SURGE →
        </a>
      </div>
    </div>
  );
}

// ─── VerifyClient ─────────────────────────────────────────────────────────────

export function VerifyClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [result, setResult] = useState<LookupResult | null>(null);
  const [loading, setLoading] = useState(!!initialQuery && isValidQuery(initialQuery));

  useEffect(() => {
    if (!initialQuery) return;
    if (!isValidQuery(initialQuery)) return;
    resolveIdentity(initialQuery)
      .then(setResult)
      .catch(() => setResult({ found: false }))
      .finally(() => setLoading(false));
  }, [initialQuery]);

  function handleSearch(q: string) {
    router.push(`/verify/${encodeURIComponent(q)}`);
  }

  return (
    <>
      <Navbar />
      <ViewportContainer style={{ display: "flex", flexDirection: "column" }}>
        <CompactHeader
          title="Verify Identity"
          back={{ href: "/leaderboard", label: "Leaderboard" }}
        />
        <ScrollableRegion style={{ padding: "24px var(--section-px)" }}>
          <div
            style={{
              maxWidth: 560,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <SearchBar defaultValue={initialQuery} onSearch={handleSearch} />

            {loading && (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div
                  style={{
                    width: 280,
                    height: 180,
                    margin: "0 auto 16px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--surface)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
                      animation: "shimmer 1.5s infinite",
                    }}
                  />
                </div>
                <style>{`@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
                <span style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>
                  Looking up identity…
                </span>
              </div>
            )}

            {!loading &&
              result !== null &&
              (result.found ? <IdentityFound identity={result.identity} /> : <IdentityNotFound />)}

            {!loading && result === null && !initialQuery && (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--text-faint)",
                  fontSize: "0.85rem",
                  padding: "24px 0",
                }}
              >
                Enter a wallet address or Identity ID to verify
              </div>
            )}
          </div>
        </ScrollableRegion>
      </ViewportContainer>
    </>
  );
}
