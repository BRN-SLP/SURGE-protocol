"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { viewportOnce } from "@/lib/motion";

export function FinalCTA() {
  const reducedMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed.includes("@") || !trimmed.includes(".")) {
      setError("Enter a valid email address");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-label="Early access"
      style={{
        paddingLeft: "var(--section-px)",
        paddingRight: "var(--section-px)",
        paddingTop: "clamp(2.5rem, 5vw, 4rem)",
        paddingBottom: "clamp(2.5rem, 5vw, 4rem)",
      }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          className="flex flex-col gap-4"
          initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs font-light tracking-[0.2em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            Early Access
          </p>

          <h2
            className="font-display leading-tight font-normal"
            style={{ fontSize: "var(--text-2xl)", color: "var(--text)" }}
          >
            Be first when <span style={{ color: "var(--accent)" }}>SURGE goes live</span>
          </h2>

          <p
            className="mx-auto max-w-xl text-lg leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Early access members receive a founding-tier Identity Card with a permanently boosted
            score — locked at your join position, forever.
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              "Founding member badge",
              "Score boost multiplier",
              "DAO governance weight",
              "Exclusive Drops access",
            ].map((perk) => (
              <div
                key={perk}
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <Check size={13} color="var(--success)" strokeWidth={1.25} aria-hidden="true" />
                {perk}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-5"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center"
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--success)",
                  }}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="font-display text-lg font-light" style={{ color: "var(--text)" }}>
                  You&apos;re on the list
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
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
                <div className="relative flex flex-1 flex-col gap-1.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 text-sm"
                    style={{
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      color: "var(--text)",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
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
                        className="text-left text-xs"
                        style={{ color: "var(--accent)" }}
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
                  disabled={loading}
                  className="shrink-0 px-6 py-3 text-sm font-light disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    background: "var(--surface-2)",
                    color: "var(--text)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled)
                      e.currentTarget.style.borderColor = "var(--accent)";
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  {loading ? "Sending…" : "Get Early Access"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {!submitted && (
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>
              No spam. No noise. One email when we launch.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
