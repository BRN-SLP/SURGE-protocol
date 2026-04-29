"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

const CHAINS = [
  { name: "OP Mainnet" },
  { name: "Base" },
  { name: "Zora" },
  { name: "Mode" },
  { name: "Mint" },
  { name: "Fraxtal" },
  { name: "Lisk" },
  { name: "Worldchain" },
  { name: "Redstone" },
  { name: "Cyber" },
  { name: "Ancient8" },
  { name: "Metal L2" },
  { name: "Orderly" },
  { name: "DeBank" },
  { name: "BOB" },
  { name: "Soneium" },
  { name: "Unichain" },
  { name: "Ink" },
];

// Duplicate for seamless loop
const MARQUEE_ITEMS = [...CHAINS, ...CHAINS];

export function EcosystemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    registerGsap();

    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector(".eco-header");

      if (header && !prefersReduced) {
        gsap.from(header, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: header, start: "top 85%" },
        });
      }
    }, sectionRef);

    // Marquee: GSAP infinite scroll
    const track = trackRef.current;
    if (track && !prefersReduced) {
      const totalWidth = track.scrollWidth / 2; // half because items are doubled
      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        duration: 28,
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      });
    }

    return () => {
      ctx.revert();
      const track = trackRef.current;
      if (track) gsap.killTweensOf(track);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Ecosystem"
      style={{
        paddingTop: "clamp(2rem, 4vw, 3rem)",
        paddingBottom: "clamp(2rem, 4vw, 3rem)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        className="eco-header mb-6 text-center"
        style={{
          paddingLeft: "var(--section-px)",
          paddingRight: "var(--section-px)",
        }}
      >
        <p
          className="mb-3 text-[0.7rem] tracking-[0.22em] uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          Ecosystem
        </p>
        <h2
          className="mb-3 font-normal tracking-tight"
          style={{ color: "var(--text)", fontSize: "var(--text-xl)" }}
        >
          Built for the <span style={{ color: "var(--accent)" }}>Superchain</span>
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Your SURGE identity works natively across{" "}
          <span style={{ color: "var(--text)" }}>{CHAINS.length} chains</span> and counting
        </p>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
          style={{
            background: "linear-gradient(to right, var(--surface) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
          style={{
            background: "linear-gradient(to left, var(--surface) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div className="overflow-hidden">
          <div ref={trackRef} className="flex gap-3 py-2" style={{ width: "max-content" }}>
            {MARQUEE_ITEMS.map((chain, i) => (
              <div
                key={i}
                aria-hidden={i >= CHAINS.length ? "true" : undefined}
                className="shrink-0 px-5 py-2.5 text-xs font-light tracking-widest uppercase"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {chain.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
