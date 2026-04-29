"use client";

import { useEffect, useRef } from "react";
import { Fingerprint, BarChart3, Award } from "lucide-react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

type LucideIcon = typeof Fingerprint;

const PILLARS: {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
  color: string;
  bullets: string[];
}[] = [
  {
    Icon: Fingerprint,
    title: "Identity Anchor",
    subtitle: "Your permanent on-chain root",
    color: "var(--accent)",
    bullets: [
      "Soulbound ERC-1155 token — cannot be transferred",
      "Outlives any individual wallet",
      "Multi-wallet container: link hot keys without risk",
    ],
  },
  {
    Icon: BarChart3,
    title: "Reputation Score",
    subtitle: "Aggregated across your entire history",
    color: "var(--color-score)",
    bullets: [
      "Cross-chain scoring via oracle network",
      "All linked wallets contribute to one total",
      "Sybil-resistant: behaviour-based, not balance-based",
    ],
  },
  {
    Icon: Award,
    title: "Achievement Badges",
    subtitle: "Proof of your on-chain history",
    color: "var(--color-badge)",
    bullets: [
      "ERC-1155 soulbound badges — score-gated claiming",
      "Heritage Badges: recover proof from a lost wallet",
      "Partner integrations: earn badges across protocols",
    ],
  },
];

export function ProtocolArchSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();

    const ctx = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(".arch-heading");
      const cards = sectionRef.current?.querySelectorAll(".arch-card");

      if (heading) {
        gsap.from(heading, {
          opacity: 0,
          y: 20,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: { trigger: heading, start: "top 85%" },
        });
      }

      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.15,
            scrollTrigger: { trigger: cards[0], start: "top 80%" },
          },
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        paddingLeft: "var(--section-px)",
        paddingRight: "var(--section-px)",
        paddingTop: "clamp(2.5rem, 5vw, 4rem)",
        paddingBottom: "clamp(2.5rem, 5vw, 4rem)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="arch-heading mb-10 text-center">
          <p
            className="mb-3 text-[0.7rem] tracking-[0.22em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Architecture
          </p>
          <h2 className="text-[40px] font-light tracking-tight" style={{ color: "var(--text)" }}>
            Three Layers. <span style={{ color: "var(--accent)" }}>One Protocol.</span>
          </h2>
          <p
            className="mt-3 text-sm"
            style={{ color: "var(--text-muted)", maxWidth: "36rem", margin: "0.75rem auto 0" }}
          >
            SURGE is not a single contract — it is a composable reputation stack designed to survive
            anything the adversarial web3 environment can throw at it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-[var(--block-gap)] md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="arch-card relative p-7"
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                borderTopColor: `${pillar.color}66`,
              }}
            >
              {/* Top accent line */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: -1,
                  left: "10%",
                  right: "10%",
                  height: 1,
                  background: `linear-gradient(to right, transparent, ${pillar.color}, transparent)`,
                  borderRadius: 1,
                }}
              />

              {/* Icon */}
              <pillar.Icon
                size={32}
                strokeWidth={1.25}
                className="mb-5 block"
                style={{ color: pillar.color }}
                aria-hidden="true"
              />

              {/* Title */}
              <h3
                className="mb-1 text-[17px] font-light tracking-wide uppercase"
                style={{ color: "var(--text)" }}
              >
                {pillar.title}
              </h3>

              {/* Subtitle */}
              <p
                className="mb-5 text-[12px] tracking-widest uppercase"
                style={{ color: pillar.color }}
              >
                {pillar.subtitle}
              </p>

              {/* Bullets */}
              <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {pillar.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex gap-3 text-[13px] leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span style={{ color: pillar.color, flexShrink: 0, marginTop: 1 }}>—</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
