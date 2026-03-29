"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { IdentityCard } from "@/components/identity-card/IdentityCard";
import { type IdentityCardData } from "@/types";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/motion";

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];

const DEMO_CARD: IdentityCardData = {
  id: 12345,
  tier: "veteran",
  score: 6847,
  walletCount: 5,
  chainCount: 7,
  badgeCount: 14,
  streakDays: 23,
  memberSince: "Jan 2024",
  defiPct: 78,
  builderPct: 55,
  govPct: 35,
};

const LIVE_STATS = [
  { value: "1,242,094", label: "IDs" },
  { value: "48.2M", label: "TX" },
  { value: "12,402", label: "NODES" },
];

export function HeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          className="flex flex-col items-center gap-12 py-20 lg:flex-row lg:gap-16 lg:pl-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Left — Copy */}
          <motion.div className="flex max-w-xl flex-col gap-7" variants={staggerContainer}>
            {/* Label */}
            <motion.p
              className="text-xs font-light tracking-[0.2em] uppercase"
              style={{ color: "var(--text-muted)" }}
              variants={fadeIn}
            >
              Identity Protocol · Optimism Superchain
            </motion.p>

            {/* Headline */}
            <motion.h1
              className="font-display text-[56px] leading-[1.08] font-light tracking-tighter"
              style={{ color: "var(--text)" }}
              variants={fadeUp}
            >
              Your Reputation.
              <br />
              Your Identity.
              <br />
              <span style={{ color: "var(--accent)" }}>Unchained.</span>
            </motion.h1>

            {/* Sub-copy */}
            <motion.p
              className="text-base leading-relaxed"
              style={{ color: "var(--text-muted)", maxWidth: "32rem" }}
              variants={fadeUp}
            >
              The sovereign data layer for decentralized credit, social governance, and
              permissionless trust. Engineered for the next evolution of on-chain survival.
            </motion.p>

            {/* CTAs */}
            <motion.div className="flex flex-wrap gap-4" variants={fadeUp}>
              <button
                className="px-8 py-4 text-sm font-bold tracking-widest uppercase transition-colors duration-0"
                style={{ background: "var(--text)", color: "var(--bg)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--text)";
                  e.currentTarget.style.color = "var(--bg)";
                }}
                aria-label="Initialize SURGE Protocol"
              >
                Initialize Protocol
              </button>

              <a
                href="#how-it-works"
                className="flex items-center gap-2 px-8 py-4 text-sm font-light tracking-widest uppercase transition-colors duration-0"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-muted)";
                }}
              >
                View Docs
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8 pt-6"
              style={{ borderTop: "1px solid var(--border)" }}
              variants={fadeIn}
            >
              {LIVE_STATS.map((stat) => (
                <div key={stat.label}>
                  <span
                    className="text-[11px] font-light tracking-widest uppercase"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {stat.value} {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Identity Card */}
          <motion.div
            className="relative flex flex-shrink-0 items-center justify-center"
            variants={
              reducedMotion
                ? {}
                : ({
                    hidden: { opacity: 0, x: 24 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: SPRING } },
                  } as Variants)
            }
          >
            {/* Soft glow behind card */}
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                background: "radial-gradient(ellipse at center, var(--accent) 0%, transparent 70%)",
                transform: "scale(1.4)",
              }}
              aria-hidden="true"
            />
            <IdentityCard data={DEMO_CARD} interactive size="lg" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
