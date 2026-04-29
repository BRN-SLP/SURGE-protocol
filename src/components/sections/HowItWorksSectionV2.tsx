"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

const STEPS = [
  {
    number: "01",
    title: "Mint Anchor",
    description:
      "Create your soulbound identity root. Non-transferable and permanent — your on-chain container that outlives any wallet.",
    highlight: false,
  },
  {
    number: "02",
    title: "Link Wallets",
    description:
      "Connect your hot wallets. They inherit your reputation but not your risk. One identity, multiple keys.",
    highlight: false,
  },
  {
    number: "03",
    title: "Build Reputation",
    description:
      "Your score grows as you use linked wallets across the Superchain. All activity aggregates to your Anchor.",
    highlight: false,
  },
  {
    number: "04",
    title: "Compromise",
    description:
      "A phishing link drains your active wallet. For any other protocol, this means Game Over for your history.",
    highlight: true,
  },
  {
    number: "05",
    title: "Mark Wallet",
    description:
      "Use any linked wallet to flag the compromised address. The Anchor isolates the threat immediately.",
    highlight: false,
  },
  {
    number: "06",
    title: "Preserve History",
    description:
      "Your Identity Anchor is untouched. The compromised wallet is gone — the reputation it earned stays with you.",
    highlight: false,
  },
  {
    number: "07",
    title: "Claim Heritage",
    description:
      "Mint a Heritage Badge verifying your past achievements from the lost wallet. Proof you were the owner.",
    highlight: false,
  },
  {
    number: "08",
    title: "Continue",
    description:
      "Link a fresh wallet as your new primary. Your score remains intact. You didn't start over. You SURGED.",
    highlight: false,
  },
];

export function HowItWorksSectionV2() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();

    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector(".hiw2-header");
      const rows = sectionRef.current?.querySelectorAll<HTMLElement>(".hiw2-row");

      if (header) {
        gsap.from(header, {
          opacity: 0,
          y: 20,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: { trigger: header, start: "top 85%" },
        });
      }

      rows?.forEach((row, i) => {
        gsap.from(row, {
          opacity: 0,
          x: i % 2 === 0 ? -24 : 24,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 82%" },
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        paddingTop: "clamp(2.5rem, 5vw, 4rem)",
        paddingBottom: "clamp(2.5rem, 5vw, 4rem)",
        paddingLeft: "var(--section-px)",
        paddingRight: "var(--section-px)",
      }}
    >
      {/* Header */}
      <div className="hiw2-header mb-12 text-center">
        <p
          className="mb-3 text-[0.7rem] tracking-[0.22em] uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          The Mechanism
        </p>
        <h2
          className="font-normal tracking-tight"
          style={{ color: "var(--text)", fontSize: "var(--text-2xl)" }}
        >
          How <span style={{ color: "var(--accent)" }}>SURGE</span> Works
        </h2>
        <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
          Eight steps from compromise to recovery — your history survives all of them.
        </p>
      </div>

      {/* Steps */}
      <div className="mx-auto max-w-4xl">
        {STEPS.map((step, i) => (
          <div
            key={step.number}
            className="hiw2-row relative flex gap-8 py-8"
            style={{
              borderTop: i === 0 ? "1px solid var(--border)" : undefined,
              borderBottom: "1px solid var(--border)",
              background: step.highlight
                ? "linear-gradient(to right, rgba(220,51,51,0.04), transparent)"
                : undefined,
            }}
          >
            {/* Left — number */}
            <div className="flex shrink-0 flex-col items-center" style={{ width: 80 }}>
              <span
                style={{
                  fontSize: "clamp(48px, 7vw, 72px)",
                  fontWeight: 300,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: step.highlight ? "rgba(220,51,51,0.35)" : "rgba(245,245,245,0.07)",
                  userSelect: "none",
                }}
              >
                {step.number}
              </span>
              {/* Connector dot */}
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    width: 1,
                    flexGrow: 1,
                    marginTop: 10,
                    background: step.highlight ? "rgba(220,51,51,0.25)" : "var(--border)",
                  }}
                />
              )}
            </div>

            {/* Right — content */}
            <div className="flex flex-col justify-center" style={{ paddingTop: 4 }}>
              {/* Step indicator */}
              <div
                style={{
                  fontSize: 9,
                  color: step.highlight ? "var(--accent)" : "var(--text-muted)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Step {step.number}
                {step.highlight && " — Critical Event"}
              </div>

              <h3
                style={{
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  fontWeight: 300,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: step.highlight ? "var(--accent)" : "var(--text)",
                  marginBottom: 10,
                }}
              >
                {step.title}
              </h3>

              <p
                style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)", maxWidth: 520 }}
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
