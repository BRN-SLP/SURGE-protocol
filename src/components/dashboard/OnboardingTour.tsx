"use client";

import { useEffect, useState, useCallback } from "react";

const TOUR_KEY = "surge_tour_seen_v1";

const STEPS = [
  {
    selector: '[data-tour="identity-card"]',
    text: "This is your SURGE Identity. It evolves as your reputation grows.",
    placement: "bottom" as const,
  },
  {
    selector: '[data-tab="pulse"]',
    text: "Score Pulse shows your real-time on-chain activity.",
    placement: "bottom" as const,
  },
  {
    selector: '[data-tour="quick-actions"]',
    text: "Link 2 more wallets to unlock security features.",
    placement: "top" as const,
  },
];

const TOOLTIP_WIDTH = 288;

interface TooltipState {
  top: number;
  left: number;
  arrowLeft: number;
  highlight: { top: number; left: number; width: number; height: number };
}

export function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState<TooltipState | null>(null);

  const computePos = useCallback((stepIndex: number): TooltipState | null => {
    const { selector, placement } = STEPS[stepIndex];
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    const GAP = 14;
    const PAD = 12;

    let top: number;
    if (placement === "bottom") {
      top = rect.bottom + GAP;
    } else {
      top = rect.top - GAP - 112; // approximate tooltip height
    }

    // Center tooltip on target, clamped to viewport
    let left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
    left = Math.max(PAD, Math.min(left, window.innerWidth - TOOLTIP_WIDTH - PAD));

    // Arrow position relative to tooltip left
    const arrowLeft = Math.max(16, Math.min(rect.left + rect.width / 2 - left, TOOLTIP_WIDTH - 16));

    return {
      top,
      left,
      arrowLeft,
      highlight: {
        top: rect.top - 4,
        left: rect.left - 4,
        width: rect.width + 8,
        height: rect.height + 8,
      },
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(TOUR_KEY);
    if (seen) return;
    const timer = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = requestAnimationFrame(() => setPos(computePos(step)));
    return () => cancelAnimationFrame(id);
  }, [visible, step, computePos]);

  useEffect(() => {
    if (!visible) return;
    const onResize = () => setPos(computePos(step));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [visible, step, computePos]);

  const finish = useCallback(() => {
    localStorage.setItem(TOUR_KEY, "1");
    setVisible(false);
  }, []);

  const handleNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }, [step, finish]);

  if (!visible || !pos) return null;

  const isLast = step === STEPS.length - 1;
  const isBottom = STEPS[step].placement === "bottom";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={finish}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 998,
        }}
      />

      {/* Highlight ring around target */}
      <div
        style={{
          position: "fixed",
          top: pos.highlight.top,
          left: pos.highlight.left,
          width: pos.highlight.width,
          height: pos.highlight.height,
          borderRadius: "var(--radius-sm)",
          border: "1px solid rgba(245,245,245,0.25)",
          boxShadow: "0 0 0 4px rgba(220,51,51,0.12)",
          zIndex: 999,
          pointerEvents: "none",
        }}
      />

      {/* Tooltip */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: pos.top,
          left: pos.left,
          width: TOOLTIP_WIDTH,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "16px 18px 14px",
          zIndex: 1000,
        }}
      >
        {/* Arrow pointing at target */}
        <div
          style={{
            position: "absolute",
            left: pos.arrowLeft - 6,
            ...(isBottom ? { top: -6 } : { bottom: -6 }),
            width: 10,
            height: 10,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRight: isBottom ? "none" : "1px solid var(--border)",
            borderBottom: isBottom ? "none" : "none",
            borderTop: isBottom ? "1px solid var(--border)" : "none",
            borderLeft: isBottom ? "1px solid var(--border)" : "none",
            transform: isBottom
              ? "rotate(-45deg) translateY(-1px)"
              : "rotate(135deg) translateY(1px)",
            pointerEvents: "none",
          }}
        />

        {/* Text */}
        <p
          style={{
            color: "var(--text)",
            fontSize: "0.875rem",
            lineHeight: 1.55,
            margin: "0 0 14px",
            fontWeight: 300,
            fontFamily: "var(--font-display)",
          }}
        >
          {STEPS[step].text}
        </p>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Progress dots */}
          <div style={{ display: "flex", gap: 5 }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: i === step ? "var(--text)" : "var(--border)",
                  transition: "background 0.2s",
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={finish}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "0.78rem",
                cursor: "pointer",
                padding: "4px 6px",
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                letterSpacing: "0.03em",
              }}
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--text)",
                fontSize: "0.78rem",
                cursor: "pointer",
                padding: "5px 14px",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                letterSpacing: "0.04em",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              {isLast ? "Got it" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
