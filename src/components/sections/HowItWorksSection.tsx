"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

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
      "Your score grows as you use your linked wallets across the Superchain. All activity aggregates to your Anchor.",
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

const NAVBAR_H = 64;
const STACK_SCALE_STEP = 0.04;
const STACK_Y_STEP = 18;

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector<HTMLElement>(".hiw-header");
      const stackEl = stackRef.current;
      if (!stackEl) return;

      const cards = Array.from(stackEl.querySelectorAll<HTMLElement>(".stack-card"));
      const inners = Array.from(stackEl.querySelectorAll<HTMLElement>(".card-inner"));
      const numCards = cards.length;
      if (numCards < 2) return;

      // Init: all cards below except first
      gsap.set(cards.slice(1), { y: "100%" });

      const scrollDistance = (numCards - 1) * (window.innerHeight - NAVBAR_H);
      const step = 1 / (numCards - 1);
      let currentIdx = 0;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stackEl,
          start: `top top+=${NAVBAR_H}`,
          end: `+=${scrollDistance}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          snap: {
            snapTo: step,
            duration: { min: 0.25, max: 0.5 },
            ease: "power1.inOut",
            delay: 0.05,
          },
          onUpdate(self) {
            const newIdx = Math.min(numCards - 1, Math.round(self.progress / step));
            if (newIdx !== currentIdx) {
              // Reset tilt on previous card
              const prevInner = inners[currentIdx];
              if (prevInner) {
                gsap.to(prevInner, { rotateX: 0, rotateY: 0, duration: 0.4, ease: "power2.out" });
              }
              currentIdx = newIdx;
              // Trigger glitch on new card's number
              const numEl = cards[currentIdx]?.querySelector<HTMLElement>(".hiw-num");
              if (numEl) {
                numEl.classList.remove("hiw-glitch");
                void numEl.offsetWidth; // force reflow
                numEl.classList.add("hiw-glitch");
              }
            }
          },
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;
        const pos = (i - 1) * step;

        // Slide current card up from bottom
        tl.to(card, { y: "0%", duration: step, ease: "none" }, pos);

        // Push previous cards up and scale them down
        for (let j = 0; j < i; j++) {
          const depth = i - j;
          tl.to(
            cards[j],
            {
              scale: 1 - depth * STACK_SCALE_STEP,
              y: -(depth * STACK_Y_STEP),
              duration: step,
              ease: "none",
            },
            pos,
          );
        }
      });

      // Mouse 3D tilt on active card inner
      const onMouseMove = (e: MouseEvent) => {
        const inner = inners[currentIdx];
        if (!inner) return;
        const rect = stackEl.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(inner, {
          rotateX: -y * 8,
          rotateY: x * 12,
          transformPerspective: 900,
          duration: 0.6,
          ease: "power2.out",
        });
      };

      const onMouseLeave = () => {
        const inner = inners[currentIdx];
        if (!inner) return;
        gsap.to(inner, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power2.out" });
      };

      stackEl.addEventListener("mousemove", onMouseMove);
      stackEl.addEventListener("mouseleave", onMouseLeave);

      // Header entrance
      if (header) {
        gsap.from(header, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: header, start: "top 85%" },
        });
      }

      return () => {
        stackEl.removeEventListener("mousemove", onMouseMove);
        stackEl.removeEventListener("mouseleave", onMouseLeave);
      };
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        paddingTop: "clamp(2.5rem, 5vw, 4rem)",
      }}
    >
      {/* Header */}
      <div
        className="hiw-header mb-8 text-center"
        style={{ paddingLeft: "var(--section-px)", paddingRight: "var(--section-px)" }}
      >
        <p
          className="mb-3 text-[0.7rem] tracking-[0.22em] uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          The Mechanism
        </p>
        <h2 className="text-[40px] font-light tracking-tight" style={{ color: "var(--text)" }}>
          How <span style={{ color: "var(--accent)" }}>SURGE</span> Works
        </h2>
      </div>

      {/* Stacked cards — pinned by GSAP */}
      <div
        ref={stackRef}
        style={{
          height: `calc(100dvh - ${NAVBAR_H}px)`,
          position: "relative",
        }}
      >
        {/* Inner clip wrapper */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="stack-card"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: i,
                background: step.highlight
                  ? "linear-gradient(rgba(220,51,51,0.06), rgba(220,51,51,0.06)), var(--bg)"
                  : "var(--bg)",
                border: `1px solid ${step.highlight ? "rgba(220,51,51,0.4)" : "var(--border)"}`,
                transformOrigin: "top center",
              }}
            >
              {/* Inner — receives mouse tilt */}
              <div
                className="card-inner"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  padding: "clamp(2rem, 6vw, 5rem)",
                  textAlign: "center",
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
              >
                {/* Decorative step number */}
                <div
                  className="hiw-num"
                  aria-hidden="true"
                  style={{
                    fontSize: "clamp(80px, 15vw, 140px)",
                    fontWeight: 300,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    color: step.highlight ? "rgba(220,51,51,0.12)" : "rgba(245,245,245,0.05)",
                    userSelect: "none",
                    marginBottom: "1rem",
                  }}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: "clamp(24px, 4vw, 36px)",
                    fontWeight: 300,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: step.highlight ? "var(--accent)" : "var(--text)",
                    marginBottom: "1.25rem",
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "var(--text-muted)",
                    maxWidth: 500,
                  }}
                >
                  {step.description}
                </p>

                {/* Progress indicator */}
                <div
                  style={{
                    marginTop: "2.5rem",
                    display: "flex",
                    gap: 6,
                  }}
                  aria-label={`Step ${i + 1} of ${STEPS.length}`}
                >
                  {STEPS.map((_, di) => (
                    <div
                      key={di}
                      style={{
                        width: di === i ? 20 : 6,
                        height: 2,
                        background:
                          di === i
                            ? step.highlight
                              ? "var(--accent)"
                              : "var(--text)"
                            : "var(--border)",
                        transition: "width 0.3s",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
