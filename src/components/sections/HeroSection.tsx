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
  { label: "Identities", value: "12,847" },
  { label: "Wallets", value: "45,291" },
  { label: "Chains", value: "8" },
  { label: "Protected Value", value: "$2.1B" },
];

export function HeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* Bespoke background — custom radial gradients, not stock (Pillar 2) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/3 left-1/6 h-[500px] w-[500px] rounded-full bg-[#6366f1] opacity-[0.07] blur-[120px]" />
        <div className="absolute right-1/6 bottom-1/4 h-96 w-96 rounded-full bg-[#8b5cf6] opacity-[0.05] blur-[100px]" />
        {/* Grid lines — bespoke geometric texture */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.025]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#6366f1" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          className="flex flex-col items-center gap-16 py-20 lg:flex-row"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Left — Identity Card demo (Pillar 2: bespoke visual asset) */}
          <motion.div
            className="order-2 flex-shrink-0 lg:order-1"
            variants={
              reducedMotion
                ? {}
                : ({
                    hidden: { opacity: 0, x: -32 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: SPRING } },
                  } as Variants)
            }
          >
            <IdentityCard data={DEMO_CARD} interactive size="lg" />
          </motion.div>

          {/* Right — Copy (Pillar 1: answers What / Who / Why Trust before scroll) */}
          <motion.div
            className="order-1 flex max-w-xl flex-col gap-7 lg:order-2"
            variants={staggerContainer}
          >
            {/* Trust badge — Pillar 1: "who is it for?" */}
            <motion.p
              className="flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-[#6366f1] uppercase"
              variants={fadeIn}
            >
              <span aria-hidden="true">◆</span>
              Identity Protocol · Optimism Superchain
            </motion.p>

            {/* Headline — Pillar 1: clear value prop, confident copy, no hedging */}
            <motion.h1
              className="font-display text-5xl leading-[1.08] font-bold text-[#f1f5f9] lg:text-6xl"
              variants={fadeUp}
            >
              Your Reputation.
              <br />
              Your Identity.
              <br />
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">
                Unchained.
              </span>
            </motion.h1>

            {/* Sub-copy — answers the three trust questions */}
            <motion.p className="text-lg leading-relaxed text-[#94a3b8]" variants={fadeUp}>
              One identity across every wallet. Lose a key — keep everything.
              <br />
              Built for serious on-chain participants on Optimism Superchain.
            </motion.p>

            {/* CTAs — Pillar 5: primary action + secondary for non-ready users */}
            <motion.div className="flex flex-col gap-4 sm:flex-row" variants={fadeUp}>
              {/* Primary CTA — specific, action-oriented copy (Pillar 5) */}
              <button
                className="group relative overflow-hidden rounded-2xl px-8 py-4 text-base font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]"
                aria-label="Create your SURGE identity"
              >
                <span
                  className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-opacity duration-300"
                  aria-hidden="true"
                />
                <span
                  className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#06b6d4] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <span className="relative flex items-center gap-2.5">
                  <span aria-hidden="true">◆</span>
                  Create Your Identity
                </span>
              </button>

              {/* Secondary CTA — for users still exploring (Pillar 5) */}
              <a
                href="#how-it-works"
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#1c1c27] px-8 py-4 text-base font-semibold text-[#94a3b8] transition-all duration-200 hover:border-[#6366f1]/50 hover:text-[#f1f5f9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
              >
                See How It Works
                <span aria-hidden="true">↓</span>
              </a>
            </motion.div>

            {/* Social proof — live stats ticker (Pillar 1: "why trust us") */}
            <motion.div
              className="flex flex-wrap gap-8 border-t border-[#1c1c27] pt-5"
              variants={fadeIn}
            >
              {LIVE_STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="font-display text-xl font-bold text-[#f1f5f9] tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-xs tracking-wide text-[#94a3b8]">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
