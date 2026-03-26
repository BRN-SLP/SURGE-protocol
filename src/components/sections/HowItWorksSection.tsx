"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const STEPS = [
  {
    step: "01",
    title: "Connect Your Wallets",
    description:
      "Add every wallet you own — MetaMask, hardware, multisig. SURGE links them into one sovereign identity without revealing cross-wallet connections on-chain.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-full w-full" aria-hidden="true">
        <rect x="4" y="14" width="40" height="26" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M4 22h40" stroke="currentColor" strokeWidth="2" />
        <circle cx="34" cy="32" r="3" fill="currentColor" />
        <path
          d="M12 8l6-4 6 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30 8l6-4 6 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    accent: "#6366f1",
  },
  {
    step: "02",
    title: "SURGE Scores Your Activity",
    description:
      "Every on-chain action — DeFi, governance votes, builder contributions — is weighted and combined into a single SURGE Score. Multi-wallet bonuses reward commitment.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-full w-full" aria-hidden="true">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
        <path
          d="M16 28l5-6 4 4 7-9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="36"
          cy="12"
          r="5"
          fill="currentColor"
          opacity="0.2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M34.5 12l1 1 2.5-2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    accent: "#8b5cf6",
  },
  {
    step: "03",
    title: "Own Your Identity Card",
    description:
      "Your SURGE Identity Card follows you everywhere — DeFi protocols, DAOs, NFT drops. Lose a key? Your score survives. Your reputation is finally unchained from any single wallet.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-full w-full" aria-hidden="true">
        <rect x="6" y="10" width="36" height="28" rx="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="22" r="5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M10 34c0-5 3.6-8 8-8s8 3 8 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M30 20h8M30 26h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 16h36" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
    accent: "#06b6d4",
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="how-it-works" ref={ref} className="relative overflow-hidden px-6 py-32">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6366f1] opacity-[0.04] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          className="mb-20 text-center"
          initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-[#6366f1] uppercase">
            How It Works
          </p>
          <h2 className="font-display text-4xl leading-tight font-bold text-[#f1f5f9] lg:text-5xl">
            Three steps to a{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">
              sovereign identity
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#94a3b8]">
            No new wallets. No new accounts. Just your existing on-chain history, finally unified.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Connector line — desktop only */}
          <div
            className="absolute top-[3.25rem] right-[calc(16.67%+2rem)] left-[calc(16.67%+2rem)] hidden h-px lg:block"
            aria-hidden="true"
          >
            <div className="h-px bg-gradient-to-r from-[#6366f1]/30 via-[#8b5cf6]/30 to-[#06b6d4]/30" />
            <div
              className="absolute inset-0 h-px bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] opacity-0"
              style={{
                opacity: inView ? 0.6 : 0,
                transition: "opacity 1s ease 0.6s",
              }}
            />
          </div>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              className="group relative flex flex-col gap-6 rounded-2xl border border-[#1c1c27] bg-[#13131a] p-8 transition-colors duration-300 hover:border-[#6366f1]/30"
              initial={reducedMotion ? {} : { opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Step number + icon row */}
              <div className="flex items-start justify-between">
                {/* Icon */}
                <div
                  className="h-14 w-14 rounded-xl p-3 transition-colors duration-300"
                  style={{
                    background: `${step.accent}14`,
                    color: step.accent,
                  }}
                >
                  {step.icon}
                </div>

                {/* Step number */}
                <span
                  className="font-display text-5xl leading-none font-bold opacity-20 transition-opacity duration-300 select-none group-hover:opacity-30"
                  style={{ color: step.accent }}
                >
                  {step.step}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-xl font-bold text-[#f1f5f9]">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[#94a3b8]">{step.description}</p>
              </div>

              {/* Bottom accent bar */}
              <div
                className="absolute right-8 bottom-0 left-8 h-px rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)`,
                }}
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA nudge */}
        <motion.div
          className="mt-14 text-center"
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <a
            href="#score-calculator"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6366f1] transition-colors duration-200 hover:text-[#8b5cf6]"
          >
            Try the score calculator
            <span aria-hidden="true">↓</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
