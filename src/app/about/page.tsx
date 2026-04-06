"use client";

import { useState, type ReactNode } from "react";
import {
  Link,
  TrendingUp,
  ShieldCheck,
  Snowflake,
  GitBranch,
  BookOpen,
  AtSign,
  MessageSquare,
  Radio,
  Code2,
  Shield,
  Clock,
  Trophy,
  AlertTriangle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ViewportContainer } from "@/components/layout/ViewportContainer";
import { CompactHeader } from "@/components/layout/CompactHeader";
import { TabBar } from "@/components/ui/TabBar";

// ─── Architecture diagram ─────────────────────────────────────────────────────

function ArchDiagram() {
  const cols = [
    { title: "Frontend", items: ["Next.js", "React", "wagmi / viem", "GSAP"] },
    { title: "Backend", items: ["Supabase", "The Graph", "Oracle Service", "Chainlink"] },
    {
      title: "Smart Contracts",
      items: ["SurgeIdentity", "SurgeScore", "SurgeAttestation", "SurgeBadge"],
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          overflow: "hidden",
          marginBottom: 1,
        }}
      >
        {cols.map((col, i) => (
          <div
            key={col.title}
            style={{
              padding: "16px 16px",
              background: "var(--surface)",
              borderLeft: i > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            <div
              style={{
                fontSize: "0.6rem",
                color: "var(--text-faint)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 10,
              }}
            >
              {col.title}
            </div>
            {col.items.map((item) => (
              <div
                key={item}
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  fontWeight: 300,
                  lineHeight: 1.9,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          textAlign: "center",
          padding: "6px 0",
          fontSize: "0.72rem",
          color: "var(--text-faint)",
        }}
      >
        <span>↕</span>
        <span>↕</span>
        <span>↕</span>
      </div>
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          background: "var(--surface)",
          padding: "12px 16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "0.6rem",
            color: "var(--text-faint)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 6,
          }}
        >
          Superchain L2s
        </div>
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            fontWeight: 300,
            letterSpacing: "0.04em",
          }}
        >
          Base · Optimism · Zora · Mode · Lisk · Ink · Soneium · Unichain · World Chain
        </div>
      </div>
    </div>
  );
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────

const PHASES = [
  {
    id: 0,
    name: "Pre-Launch",
    status: "completed" as const,
    items: ["Landing page", "Score Calculator", "Waitlist"],
  },
  {
    id: 1,
    name: "MVP",
    status: "current" as const,
    items: ["Identity creation", "Wallet linking", "Scoring", "Dashboard"],
  },
  {
    id: 2,
    name: "Security & Recovery",
    status: "future" as const,
    items: ["2-of-3 multi-sig", "Compromise flow", "Badges", "Mainnet"],
  },
  {
    id: 3,
    name: "Engagement & Growth",
    status: "future" as const,
    items: ["Quests", "Leaderboard", "Seasons", "Cross-chain"],
  },
  {
    id: 4,
    name: "Ecosystem",
    status: "future" as const,
    items: ["B2B API", "Partner drops", "Governance"],
  },
];

const DOT: Record<string, string> = {
  completed: "#22aa66",
  current: "var(--accent)",
  future: "var(--border)",
};

function RoadmapTimeline() {
  return (
    <div style={{ position: "relative", paddingTop: 32, paddingBottom: 8 }}>
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 0,
          right: 0,
          height: 1,
          background: "var(--border)",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        {PHASES.map((phase) => (
          <div
            key={phase.id}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: DOT[phase.status],
                border: phase.status === "future" ? "1.5px solid var(--text-faint)" : "none",
                zIndex: 1,
                marginBottom: 10,
                boxShadow: phase.status === "current" ? "0 0 6px var(--accent)70" : "none",
              }}
            />
            {phase.status === "current" && (
              <div
                style={{
                  fontSize: "0.55rem",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                NOW
              </div>
            )}
            <div
              style={{
                fontSize: "0.68rem",
                color: phase.status === "future" ? "var(--text-faint)" : "var(--text)",
                fontWeight: 400,
                textAlign: "center",
                marginBottom: 4,
              }}
            >
              {phase.name}
            </div>
            <div>
              {phase.items.map((item) => (
                <div
                  key={item}
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--text-faint)",
                    textAlign: "center",
                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── How It Works data ────────────────────────────────────────────────────────

const HOW_SECTIONS: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <Link size={16} strokeWidth={1.25} />,
    title: "One Identity, Many Wallets",
    body: "SURGE creates a soulbound identity (ERC-721) above individual wallets. Link any number of wallets to one Identity. Each wallet receives the same token — proving they belong to the same person.",
  },
  {
    icon: <TrendingUp size={16} strokeWidth={1.25} />,
    title: "Unified Reputation Score",
    body: "Your SURGE Score aggregates activity across all linked wallets: DeFi, governance, contracts, NFTs. Five tiers from Newcomer (0 pts) to Legend (8,000+ pts). Linking and cross-chain bonuses reward diversification.",
  },
  {
    icon: <ShieldCheck size={16} strokeWidth={1.25} />,
    title: "Lose a Wallet, Keep Everything",
    body: "If a wallet is compromised, mark it via 2-of-3 multi-sig from your Security Wallets. Frozen immediately, permanently blocked after 30 days. Your reputation history is preserved. Heritage Badges honor past work.",
  },
  {
    icon: <Snowflake size={16} strokeWidth={1.25} />,
    title: "Emergency Self-Freeze",
    body: "Any wallet can freeze itself with a single signature — instantly. Prevents an attacker who controls one Security Wallet from locking you out entirely. Only the signing wallet freezes; others stay active.",
  },
];

// ─── Community links ──────────────────────────────────────────────────────────

const COMMUNITY_LINKS: { icon: ReactNode; label: string; sub: string; href: string }[] = [
  {
    icon: <GitBranch size={15} strokeWidth={1.25} />,
    label: "GitHub",
    sub: "github.com/SURGE-protocol",
    href: "https://github.com/SURGE-protocol",
  },
  {
    icon: <BookOpen size={15} strokeWidth={1.25} />,
    label: "Documentation",
    sub: "docs.surge-protocol.xyz",
    href: "#",
  },
  {
    icon: <AtSign size={15} strokeWidth={1.25} />,
    label: "X / Twitter",
    sub: "x.com/SURGEprotocol",
    href: "https://x.com/SURGEprotocol",
  },
  {
    icon: <MessageSquare size={15} strokeWidth={1.25} />,
    label: "Discord",
    sub: "discord.gg/surge",
    href: "#",
  },
  {
    icon: <Radio size={15} strokeWidth={1.25} />,
    label: "Farcaster",
    sub: "warpcast.com/surge",
    href: "#",
  },
  {
    icon: <Code2 size={15} strokeWidth={1.25} />,
    label: "API",
    sub: "api.surge-protocol.xyz",
    href: "#",
  },
];

// ─── Security items ───────────────────────────────────────────────────────────

const SECURITY_ITEMS: { icon: ReactNode; text: string }[] = [
  {
    icon: <ShieldCheck size={14} strokeWidth={1.25} />,
    text: "Security is free, growth is paid. Freeze, mark compromised, recovery — signature only, no fee.",
  },
  {
    icon: <Shield size={14} strokeWidth={1.25} />,
    text: "2-of-3 multi-sig for critical actions. First 3 active wallets become Security Wallets automatically.",
  },
  {
    icon: <Snowflake size={14} strokeWidth={1.25} />,
    text: "Emergency Self-Freeze — only the signing wallet freezes, others remain active.",
  },
  {
    icon: <Clock size={14} strokeWidth={1.25} />,
    text: "30-day compromise review window. Deadlock Recovery via Guardian + time-lock.",
  },
  {
    icon: <Trophy size={14} strokeWidth={1.25} />,
    text: "Contracts audited with Slither + Foundry fuzz testing.",
  },
  {
    icon: <AlertTriangle size={14} strokeWidth={1.25} />,
    text: "Bug bounty via Immunefi. CSP, rate limiting, input validation throughout.",
  },
];

// ─── Tab content ──────────────────────────────────────────────────────────────

function ProtocolTab() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 40,
        height: "100%",
        alignContent: "start",
      }}
    >
      {/* Left: Mission */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 300,
              color: "var(--text)",
              letterSpacing: "0.01em",
              lineHeight: 1.15,
            }}
          >
            SURGE Protocol
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              fontWeight: 300,
              color: "var(--text-muted)",
              lineHeight: 1.75,
            }}
          >
            Your on-chain reputation belongs to you, not to your private key. SURGE creates a
            persistent identity layer above wallets — so losing a key never means losing who you
            are.
          </p>
        </div>
        <div style={{ width: 80, height: 1, background: "var(--border)" }} />
        <div>
          <div
            style={{
              fontSize: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--text-faint)",
              marginBottom: 12,
            }}
          >
            The Problem
          </div>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: "0.88rem",
              fontWeight: 300,
              color: "var(--text-muted)",
              lineHeight: 1.75,
            }}
          >
            Every crypto wallet is a single point of failure. One phishing link, one leaked seed
            phrase — and years of DeFi activity, governance votes, protocol trust scores, and
            airdrop eligibility are gone. Starting over from zero isn&apos;t an inconvenience —
            it&apos;s identity erasure.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.88rem",
              fontWeight: 300,
              color: "var(--text-muted)",
              lineHeight: 1.75,
            }}
          >
            ENS is tied to a single address. POAPs prove attendance, not continuity. Soulbound
            tokens are non-transferable by design. Social recovery wallets protect assets but not
            cross-chain reputation.
          </p>
        </div>
      </div>

      {/* Right: Pullquote + key numbers */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            padding: "24px 28px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderLeft: "2px solid var(--border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "1.15rem",
              fontWeight: 300,
              color: "var(--text)",
              lineHeight: 1.55,
              fontStyle: "italic",
            }}
          >
            &ldquo;A wallet compromise doesn&apos;t just steal assets. It erases years of on-chain
            reputation.&rdquo;
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          {[
            { label: "Networks", value: "9" },
            { label: "Tiers", value: "5" },
            { label: "Max Score", value: "8k+" },
            { label: "Status", value: "Testnet" },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                padding: "16px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <div
                style={{
                  fontSize: "0.58rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--text-faint)",
                  marginBottom: 6,
                }}
              >
                {label}
              </div>
              <div
                style={{ fontSize: "1.4rem", fontWeight: 300, color: "var(--text)", lineHeight: 1 }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorksTab() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        alignContent: "start",
      }}
    >
      {HOW_SECTIONS.map((s) => (
        <div
          key={s.title}
          style={{
            padding: "20px 22px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            gap: 16,
          }}
        >
          <div style={{ color: "var(--text-faint)", flexShrink: 0, paddingTop: 2 }}>{s.icon}</div>
          <div>
            <h3
              style={{
                margin: "0 0 8px",
                fontSize: "0.9rem",
                fontWeight: 400,
                color: "var(--text)",
                letterSpacing: "0.01em",
              }}
            >
              {s.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "0.82rem",
                fontWeight: 300,
                color: "var(--text-muted)",
                lineHeight: 1.7,
              }}
            >
              {s.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ArchitectureTab() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 32,
        alignContent: "start",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "0.6rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--text-faint)",
            marginBottom: 12,
          }}
        >
          Stack
        </div>
        <ArchDiagram />
        <p
          style={{
            margin: "12px 0 0",
            fontSize: "0.8rem",
            fontWeight: 300,
            color: "var(--text-faint)",
            lineHeight: 1.65,
          }}
        >
          Contracts deployed on 9 Superchain testnets at identical addresses. An off-chain Oracle
          indexes on-chain data via The Graph, calculates scores, and pushes updates to SurgeScore.
        </p>
      </div>

      <div>
        <div
          style={{
            fontSize: "0.6rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--text-faint)",
            marginBottom: 12,
          }}
        >
          Roadmap
        </div>
        <div
          style={{
            padding: "20px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <RoadmapTimeline />
        </div>
      </div>
    </div>
  );
}

function CommunityTab() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 32,
        alignContent: "start",
      }}
    >
      {/* Security */}
      <div>
        <div
          style={{
            fontSize: "0.6rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--text-faint)",
            marginBottom: 12,
          }}
        >
          Security
        </div>
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            overflow: "hidden",
          }}
        >
          {SECURITY_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 14,
                padding: "12px 16px",
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
                background: "var(--surface)",
              }}
            >
              <span
                style={{
                  color: "var(--text-faint)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "flex-start",
                  paddingTop: 1,
                }}
              >
                {item.icon}
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  fontWeight: 300,
                  color: "var(--text-muted)",
                  lineHeight: 1.55,
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
        <a
          href="#"
          style={{
            display: "inline-block",
            marginTop: 10,
            fontSize: "0.78rem",
            color: "var(--text-faint)",
            textDecoration: "none",
            letterSpacing: "0.03em",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-faint)";
          }}
        >
          Read the full security documentation →
        </a>
      </div>

      {/* Links */}
      <div>
        <div
          style={{
            fontSize: "0.6rem",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--text-faint)",
            marginBottom: 12,
          }}
        >
          Links
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          {COMMUNITY_LINKS.map((link) => {
            const isPlaceholder = link.href === "#";
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface)",
                  textDecoration: "none",
                  opacity: isPlaceholder ? 0.5 : 1,
                  cursor: isPlaceholder ? "default" : "pointer",
                  transition: "border-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isPlaceholder)
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--text-faint)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                }}
                onClick={(e) => isPlaceholder && e.preventDefault()}
              >
                <span
                  style={{
                    color: "var(--text-faint)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {link.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text)",
                      fontWeight: 400,
                      marginBottom: 1,
                    }}
                  >
                    {link.label}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-faint)", fontWeight: 300 }}>
                    {link.sub}
                    {isPlaceholder && " (soon)"}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TABS = [
  { id: "protocol", label: "Protocol" },
  { id: "how", label: "How It Works" },
  { id: "architecture", label: "Architecture" },
  { id: "community", label: "Community" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("protocol");

  return (
    <>
      <Navbar />
      <ViewportContainer style={{ display: "flex", flexDirection: "column" }}>
        <CompactHeader title="About" subtitle="SURGE Protocol — on-chain identity & reputation" />

        <div style={{ flexShrink: 0, padding: "0 var(--section-px)" }}>
          <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "24px var(--section-px)",
          }}
        >
          {activeTab === "protocol" && <ProtocolTab />}
          {activeTab === "how" && <HowItWorksTab />}
          {activeTab === "architecture" && <ArchitectureTab />}
          {activeTab === "community" && <CommunityTab />}
        </div>
      </ViewportContainer>
    </>
  );
}
