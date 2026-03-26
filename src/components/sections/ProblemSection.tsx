"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const PROBLEMS = [
  { icon: "🎣", title: "Phished", subtitle: "Lost Private Key = Lost Identity" },
  { icon: "🔓", title: "Leaked Seed", subtitle: "One exposure = Years of work gone" },
  { icon: "🦹", title: "Malicious App", subtitle: "One bad signature = Zero reputation" },
];

export function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-sm font-semibold tracking-widest text-[#94a3b8] uppercase">
            The Problem
          </p>
          <h2 className="font-display text-4xl font-bold text-[#f1f5f9]">
            Your reputation is one mistake away from{" "}
            <span className="text-[#ef4444]">disappearing</span>
          </h2>
        </motion.div>

        <div className="mb-16 flex flex-col items-center justify-center gap-4 md:flex-row">
          {PROBLEMS.map((problem, i) => (
            <motion.div
              key={problem.title}
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="relative flex w-52 flex-col items-center gap-3 rounded-2xl border border-[#ef4444]/20 bg-[#13131a] p-8 text-center">
                <span className="text-4xl">{problem.icon}</span>
                <span className="font-display font-bold text-[#ef4444]">{problem.title}</span>
                <span className="text-sm text-[#94a3b8]">{problem.subtitle}</span>
              </div>
              {i < PROBLEMS.length - 1 && (
                <div className="hidden rotate-0 text-2xl text-[#ef4444]/50 md:block">→</div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.blockquote
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <p className="text-xl leading-relaxed text-[#94a3b8] italic">
            &ldquo;2 years of DeFi. 47 governance votes. 300+ transactions.{" "}
            <span className="font-semibold text-[#ef4444] not-italic">
              Gone in one phishing link.
            </span>
            &rdquo;
          </p>
        </motion.blockquote>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <a
            href="#score-calculator"
            className="inline-flex items-center gap-2 rounded-xl border border-[#6366f1]/30 px-6 py-3 font-semibold text-[#6366f1] transition-all duration-200 hover:border-[#6366f1] hover:bg-[#6366f1]/10"
          >
            Protect Your Identity →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
