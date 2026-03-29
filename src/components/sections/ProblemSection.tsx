"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function PhishedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
      <path d="M12 3v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 12c0 1.1-.9 2-2 2v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M10 19h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 3h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M15 3c0 1.66-1.34 3-3 3S9 4.66 9 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LeakedSeedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 11V7a4 4 0 0 1 8 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      <path d="M12 17.5v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MaliciousAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
      <path
        d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

const PROBLEMS = [
  {
    Icon: PhishedIcon,
    title: "Phished Key",
    description:
      "Systemic vulnerability in legacy asymmetric encryption allows for single-point authentication failure via sophisticated social engineering vectors.",
  },
  {
    Icon: LeakedSeedIcon,
    title: "Leaked Seed",
    description:
      "Irrevocable asset exposure resulting from physical or digital discovery of mnemonic phrases. Once compromised, the root of trust is permanently severed.",
  },
  {
    Icon: MaliciousAppIcon,
    title: "Malicious App",
    description:
      "Shadow-execution of smart contract permissions that bypass standard user UI, leading to automated and unauthorized wallet draining sequences.",
  },
];

export function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="px-6 py-28" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[40px] font-light tracking-tight" style={{ color: "var(--text)" }}>
            The Problem No One Solved
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PROBLEMS.map((problem, i) => (
            <motion.div
              key={problem.title}
              className="group p-10"
              style={{ border: "1px solid var(--border)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-hover)";
                const icon = e.currentTarget.querySelector(".card-icon") as HTMLElement;
                if (icon) icon.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                const icon = e.currentTarget.querySelector(".card-icon") as HTMLElement;
                if (icon) icon.style.color = "var(--text-muted)";
              }}
            >
              <div
                className="card-icon mb-8 h-12 w-12 transition-colors duration-150"
                style={{ color: "var(--text-muted)" }}
              >
                <problem.Icon />
              </div>
              <h3
                className="mb-4 text-[20px] font-light tracking-wide uppercase"
                style={{ color: "var(--text)" }}
              >
                {problem.title}
              </h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
