"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";

const STEPS = [
  {
    step: "01",
    title: "Connect Your Wallets",
    description:
      "Add every wallet you own — MetaMask, hardware, multisig. SURGE links them into one sovereign identity without revealing cross-wallet connections on-chain.",
  },
  {
    step: "02",
    title: "SURGE Scores Your Activity",
    description:
      "Every on-chain action — DeFi, governance votes, builder contributions — is weighted and combined into a single SURGE Score. Multi-wallet bonuses reward commitment.",
  },
  {
    step: "03",
    title: "Own Your Identity Card",
    description:
      "Your SURGE Identity Card follows you everywhere — DeFi protocols, DAOs, NFT drops. Lose a key? Your score survives. Your reputation is finally unchained from any single wallet.",
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="px-6 py-28"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header with horizontal line */}
        <motion.div
          className="mb-12 flex items-center gap-8"
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p
            className="shrink-0 text-[0.75rem] tracking-[0.2em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            How It Works
          </p>
          <div
            className="h-px flex-grow"
            style={{ background: "var(--border)" }}
            aria-hidden="true"
          />
        </motion.div>

        {/* Steps — flat, no cards */}
        <div className="relative flex flex-col gap-12 md:flex-row md:gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              className="flex-1"
              initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="mb-4 text-[0.85rem] font-light tracking-tighter"
                style={{ color: "var(--accent)" }}
              >
                {step.step}
              </div>
              <h3
                className="mb-2 text-[18px] font-light tracking-wide uppercase"
                style={{ color: "var(--text)" }}
              >
                {step.title}
              </h3>
              <p
                className="pr-4 text-[13px] leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom nudge */}
        <motion.div
          className="mt-16 text-center"
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a
            href="#score-calculator"
            className="inline-flex items-center gap-2 text-sm font-light transition-colors duration-150"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            Try the score calculator ↓
          </a>
        </motion.div>
      </div>
    </section>
  );
}
