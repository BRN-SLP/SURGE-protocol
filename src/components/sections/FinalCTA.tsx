"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { viewportOnce } from "@/lib/motion";

export function FinalCTA() {
  const reducedMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed.includes("@") || !trimmed.includes(".")) {
      setError("Enter a valid email address");
      return;
    }
    setError(null);
    // TODO: wire to actual waitlist endpoint (Phase 0.4)
    setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden px-6 py-32">
      {/* Bespoke background glow — mirrors hero but inverted */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] opacity-[0.07] blur-[120px]" />
        {/* Geometric accent top-right */}
        <svg
          className="absolute top-0 right-0 h-64 w-64 opacity-[0.04]"
          viewBox="0 0 256 256"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="192" cy="64" r="120" stroke="#6366f1" strokeWidth="1" />
          <circle cx="192" cy="64" r="80" stroke="#8b5cf6" strokeWidth="1" />
          <circle cx="192" cy="64" r="40" stroke="#06b6d4" strokeWidth="1" />
        </svg>
        {/* Geometric accent bottom-left */}
        <svg
          className="absolute bottom-0 left-0 h-48 w-48 opacity-[0.04]"
          viewBox="0 0 192 192"
          fill="none"
          aria-hidden="true"
        >
          <polygon points="96,8 184,184 8,184" stroke="#6366f1" strokeWidth="1" />
          <polygon points="96,40 160,168 32,168" stroke="#8b5cf6" strokeWidth="1" />
        </svg>
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          className="flex flex-col gap-8"
          initial={reducedMotion ? {} : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <p className="flex items-center justify-center gap-2 text-sm font-semibold tracking-[0.2em] text-[#6366f1] uppercase">
            <span aria-hidden="true">◆</span>
            Early Access
          </p>

          {/* Headline */}
          <h2 className="font-display text-4xl leading-tight font-bold text-[#f1f5f9] lg:text-5xl">
            Be first when{" "}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">
              SURGE goes live
            </span>
          </h2>

          {/* Sub-copy */}
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-[#94a3b8]">
            Early access members receive a founding-tier Identity Card with a permanently boosted
            score — locked at your join position, forever.
          </p>

          {/* Perks row */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              "Founding member badge",
              "Score boost multiplier",
              "DAO governance weight",
              "Exclusive Drops access",
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                <span className="text-xs text-[#10b981]" aria-hidden="true">
                  ✓
                </span>
                {perk}
              </div>
            ))}
          </div>

          {/* Email form / success */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#10b981]/30 bg-[#10b981]/20">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-[#10b981]"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="font-display text-xl font-bold text-[#f1f5f9]">
                  You&apos;re on the list
                </p>
                <p className="text-sm text-[#94a3b8]">
                  We&apos;ll notify you the moment early access opens.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row"
                noValidate
              >
                <div className="flex flex-1 flex-col gap-1.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-[#1c1c27] bg-[#13131a] px-4 py-3.5 text-sm text-[#f1f5f9] placeholder-[#64748b] transition-colors duration-200 focus:outline-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#6366f1]"
                    aria-label="Email address for early access"
                    aria-describedby={error ? "cta-error" : undefined}
                    aria-invalid={!!error}
                    autoComplete="email"
                  />
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        id="cta-error"
                        role="alert"
                        className="text-left text-xs text-[#ef4444]"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  className="group relative shrink-0 overflow-hidden rounded-xl px-6 py-3.5 text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />
                  <span className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#06b6d4] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative">Get Early Access</span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Fine print */}
          {!submitted && (
            <p className="text-xs text-[#64748b]">No spam. No noise. One email when we launch.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
