"use client";

import { useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { AnimatedBorder } from "@/components/ui/AnimatedBorder";
import { useBorderVariant } from "@/components/providers/BorderVariantProvider";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useSurgeIdentity } from "@/hooks/useSurgeIdentity";
import { ScrollableRegion } from "@/components/layout/ScrollableRegion";

// ─── Types ────────────────────────────────────────────────────────────────────

type DropStatus = "live" | "upcoming" | "ended";

interface Requirement {
  text: string;
  met: boolean; // for mock: assume user meets or doesn't
}

interface Drop {
  id: string;
  protocol: string;
  title: string;
  description: string;
  endsAt?: Date;
  startsAt?: Date;
  status: DropStatus;
  requirements: string[];
  yourStatus: Requirement[] | null; // null = not relevant for public view
  eligible: boolean;
  claimedCount?: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const now = Date.now();

const DROPS: Drop[] = [
  {
    id: "drop-1",
    protocol: "BASE",
    title: "Base Builder Rewards",
    description:
      "Earn rewards for building and deploying verified contracts on Base. Distributed weekly to eligible SURGE identity holders.",
    endsAt: new Date(now + 1000 * 60 * 60 * 24 * 12 + 1000 * 60 * 60 * 5),
    status: "live",
    requirements: [
      "Min. Contributor tier (1,500+ pts)",
      'Badge: "Base Builder" required',
      "3+ verified contracts on Base",
    ],
    yourStatus: [
      { text: "Tier: Veteran (meets requirement)", met: true },
      { text: 'Badge: "Base Builder" (owned)', met: true },
      { text: "Contracts: 7 on Base (meets requirement)", met: true },
    ],
    eligible: true,
  },
  {
    id: "drop-2",
    protocol: "VAULTEX",
    title: "Vaultex Early Adopter Round",
    description:
      "Whitelist allocation for early adopters of Vaultex Finance. Priority access for high-reputation SURGE identity holders.",
    endsAt: new Date(now + 1000 * 60 * 60 * 5 + 1000 * 60 * 22),
    status: "live",
    requirements: ["SURGE Score ≥ 800", "Min. 2 DeFi badges", "Account active for 60+ days"],
    yourStatus: [
      { text: "Score: 612 (below 800)", met: false },
      { text: "DeFi badges: 1 (need 2)", met: false },
      { text: "Account: 94 days active (meets requirement)", met: true },
    ],
    eligible: false,
  },
  {
    id: "drop-3",
    protocol: "CHAINARK",
    title: "Community Distribution Wave 2",
    description:
      "ChainArk DAO's second community distribution for governance participants. Requires active on-chain governance history.",
    endsAt: new Date(now + 1000 * 60 * 60 * 32),
    status: "live",
    requirements: [
      "SURGE Score ≥ 500",
      "Min. 1 governance badge",
      "Voted in 3+ governance proposals",
    ],
    yourStatus: [
      { text: "Score: 612 (meets requirement)", met: true },
      { text: "Governance badge: none (required)", met: false },
      { text: "Votes: 0 proposals (need 3)", met: false },
    ],
    eligible: false,
  },
  {
    id: "drop-4",
    protocol: "PRISMA",
    title: "Contributor Tier Whitelist",
    description:
      "Prisma Protocol's upcoming whitelist for Contributor-tier and above SURGE identity holders.",
    startsAt: new Date(now + 1000 * 60 * 60 * 84),
    status: "upcoming",
    requirements: ["Min. Contributor tier (1,500+ pts)", "Verified identity on OP Mainnet"],
    yourStatus: null,
    eligible: false,
  },
  {
    id: "drop-5",
    protocol: "ARCLIGHT",
    title: "Validator Rewards — Genesis Set",
    description:
      "Genesis validator reward set for the Arclight Network launch. Limited allocation for elite SURGE identities.",
    startsAt: new Date(now + 1000 * 60 * 60 * 168),
    status: "upcoming",
    requirements: [
      "Veteran tier or above (3,000+ pts)",
      "4+ linked wallets",
      'Badge: "Validator" required',
    ],
    yourStatus: null,
    eligible: false,
  },
  {
    id: "drop-6",
    protocol: "MERIDIAN",
    title: "Early Governance Snapshot I",
    description:
      "Meridian DAO's first governance snapshot distribution. Rewarded active participants in early governance.",
    endsAt: new Date(now - 1000 * 60 * 60 * 24),
    status: "ended",
    requirements: ["Active governance participation", "SURGE Score ≥ 300"],
    yourStatus: [
      { text: "Governance: participated", met: true },
      { text: "Score: 612 (meets requirement)", met: true },
    ],
    eligible: true,
    claimedCount: 1847,
  },
];

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(target?: Date) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("00:00:00");
        return;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      const pad = (n: number) => String(n).padStart(2, "0");
      if (h >= 24) {
        const d = Math.floor(h / 24);
        setRemaining(`${d}d ${pad(h % 24)}h ${pad(m)}m`);
      } else {
        setRemaining(`${pad(h)}:${pad(m)}:${pad(s)}`);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return remaining;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: DropStatus }) {
  if (status === "live") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--success)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 400,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--success)",
          }}
        >
          Live
        </span>
      </div>
    );
  }
  if (status === "upcoming") {
    return (
      <span
        style={{
          fontSize: "0.7rem",
          fontWeight: 400,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-faint)",
        }}
      >
        Upcoming
      </span>
    );
  }
  return (
    <span
      style={{
        fontSize: "0.7rem",
        fontWeight: 400,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--text-faint)",
      }}
    >
      Ended
    </span>
  );
}

// ─── Drop card ────────────────────────────────────────────────────────────────

function DropCard({
  drop,
  isConnected,
  hasIdentity,
}: {
  drop: Drop;
  isConnected: boolean;
  hasIdentity: boolean;
}) {
  const variant = useBorderVariant(drop.id);
  const endsIn = useCountdown(drop.endsAt);
  const startsIn = useCountdown(drop.startsAt);

  const isEnded = drop.status === "ended";

  return (
    <div
      className="drop-card"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        background: "var(--surface)",
        padding: 28,
        opacity: isEnded ? 0.6 : 1,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        {/* Protocol initials */}
        <div
          style={{
            width: 32,
            height: 32,
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
            flexShrink: 0,
          }}
        >
          {drop.protocol.slice(0, 2)}
        </div>

        <StatusBadge status={drop.status} />
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "1.15rem",
          fontWeight: 400,
          color: "var(--text)",
          marginBottom: 8,
          lineHeight: 1.3,
        }}
      >
        {drop.title}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "0.9rem",
          fontWeight: 300,
          color: "var(--text-muted)",
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        {drop.description}
      </p>

      {/* Divider */}
      <div style={{ borderTop: "1px solid var(--border)", marginBottom: 18 }} />

      {/* Requirements */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: "0.7rem",
            fontWeight: 400,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-faint)",
            marginBottom: 8,
          }}
        >
          Requirements
        </div>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {drop.requirements.map((req, i) => (
            <li
              key={i}
              style={{
                fontSize: "0.85rem",
                fontWeight: 300,
                color: "var(--text-muted)",
                display: "flex",
                gap: 8,
              }}
            >
              <span style={{ color: "var(--text-faint)", flexShrink: 0 }}>•</span>
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Your Status — only if connected + hasIdentity and data available */}
      {isConnected && hasIdentity && drop.yourStatus && (
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 400,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-faint)",
              marginBottom: 8,
            }}
          >
            Your Status
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {drop.yourStatus.map((item, i) => (
              <div
                key={i}
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 300,
                  color: "var(--text-muted)",
                  display: "flex",
                  gap: 8,
                }}
              >
                {item.met ? (
                  <Check
                    size={12}
                    color="var(--success)"
                    strokeWidth={1.25}
                    style={{ flexShrink: 0 }}
                  />
                ) : (
                  <X size={12} color="var(--accent)" strokeWidth={1.25} style={{ flexShrink: 0 }} />
                )}
                {item.text}
              </div>
            ))}
            <div
              style={{
                marginTop: 6,
                fontSize: "0.75rem",
                fontWeight: 400,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: drop.eligible ? "var(--success)" : "var(--text-muted)",
              }}
            >
              {drop.eligible ? "Eligible" : "Not Eligible"}
            </div>
          </div>
        </div>
      )}

      {/* Connect prompt in card */}
      {!isConnected && !isEnded && (
        <div
          style={{
            fontSize: "0.8rem",
            fontWeight: 300,
            color: "var(--text-faint)",
            marginBottom: 16,
            fontStyle: "italic",
          }}
        >
          Connect your wallet to check eligibility
        </div>
      )}

      {/* Timer */}
      <div style={{ flex: 1 }} />
      {drop.status === "live" && endsIn && (
        <div style={{ marginBottom: 16 }}>
          <span
            style={{ fontSize: "0.72rem", color: "var(--text-faint)", letterSpacing: "0.06em" }}
          >
            Ends in:{" "}
          </span>
          <span style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "var(--text-faint)" }}>
            {endsIn}
          </span>
        </div>
      )}
      {drop.status === "upcoming" && startsIn && (
        <div style={{ marginBottom: 16 }}>
          <span
            style={{ fontSize: "0.72rem", color: "var(--text-faint)", letterSpacing: "0.06em" }}
          >
            Starts in:{" "}
          </span>
          <span style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "var(--text-faint)" }}>
            {startsIn}
          </span>
        </div>
      )}
      {isEnded && drop.claimedCount && (
        <div
          style={{
            marginBottom: 16,
            fontSize: "0.8rem",
            color: "var(--text-faint)",
            fontWeight: 300,
          }}
        >
          {drop.claimedCount.toLocaleString()} identities claimed
        </div>
      )}

      {/* CTA button */}
      {!isEnded && (
        <>
          {!isConnected ? (
            <button
              style={{
                width: "100%",
                padding: "11px 0",
                fontSize: "0.72rem",
                fontWeight: 300,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
              }}
            >
              Connect Wallet to Check Eligibility
            </button>
          ) : drop.status === "upcoming" ? (
            <button
              style={{
                width: "100%",
                padding: "11px 0",
                fontSize: "0.72rem",
                fontWeight: 300,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              Set Reminder
            </button>
          ) : drop.eligible ? (
            <button
              style={{
                width: "100%",
                padding: "11px 0",
                fontSize: "0.72rem",
                fontWeight: 300,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "1px solid var(--accent)",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                color: "var(--text)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(220,51,51,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Claim on {drop.protocol} →
            </button>
          ) : (
            <button
              style={{
                width: "100%",
                padding: "11px 0",
                fontSize: "0.72rem",
                fontWeight: 300,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              Check Eligibility
            </button>
          )}
        </>
      )}

      <AnimatedBorder variant={variant} radius={10} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DropsHub() {
  const [activeTab, setActiveTab] = useState<DropStatus>("live");
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isConnected, hasIdentity } = useSurgeIdentity();

  const filtered = DROPS.filter((d) => d.status === activeTab);
  const liveCount = DROPS.filter((d) => d.status === "live").length;
  const eligibleCount =
    isConnected && hasIdentity ? DROPS.filter((d) => d.status === "live" && d.eligible).length : 0;

  const TABS: { label: string; value: DropStatus }[] = [
    { label: "Live", value: "live" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Ended", value: "ended" },
  ];

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector(".drops-header");
      if (header) {
        gsap.from(header, {
          opacity: 0,
          y: 16,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }, sectionRef);
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".drop-card");
      if (cards?.length) {
        gsap.from(cards, {
          opacity: 0,
          y: 20,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.08,
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [activeTab]);

  return (
    <div
      ref={sectionRef}
      style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      <style>{`
        .drops-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .drops-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Eligible banner */}
      {eligibleCount > 0 && (
        <div
          style={{
            padding: "8px var(--section-px)",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--success)",
              fontWeight: 300,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Check size={12} strokeWidth={1.25} />
            You&apos;re eligible for {eligibleCount} {eligibleCount === 1 ? "drop" : "drops"}
          </span>
        </div>
      )}

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
          padding: "0 var(--section-px)",
        }}
      >
        {TABS.map((tab) => {
          const count = DROPS.filter((d) => d.status === tab.value).length;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                position: "relative",
                padding: "10px 20px",
                fontSize: "0.82rem",
                fontWeight: isActive ? 400 : 300,
                letterSpacing: "0.04em",
                color: isActive ? "var(--text)" : "var(--text-muted)",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? "1px solid var(--accent)" : "1px solid transparent",
                marginBottom: -1,
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: "0.68rem",
                  color: isActive && tab.value === "live" ? "var(--accent)" : "#444444",
                }}
              >
                {tab.value === "live" ? liveCount : count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scrollable cards */}
      <ScrollableRegion style={{ padding: "20px var(--section-px)" }}>
        {filtered.length > 0 ? (
          <div className="drops-grid">
            {filtered.map((drop) => (
              <DropCard
                key={drop.id}
                drop={drop}
                isConnected={isConnected}
                hasIdentity={hasIdentity}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "64px 0",
              textAlign: "center",
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#444444",
            }}
          >
            No drops in this category
          </div>
        )}
      </ScrollableRegion>
    </div>
  );
}
