"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { IdentityCard } from "@/components/identity-card/IdentityCard";
import { type IdentityCardData, getTierFromScore } from "@/types";
import { gsap, registerGsap } from "@/lib/gsap";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSurgeIdentity } from "@/hooks/useSurgeIdentity";

const SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];

const DEMO_CARD: IdentityCardData = {
  id: 12345,
  tier: "veteran",
  score: 6847,
  walletCount: 5,
  chainCount: 7,
  badgeCount: 14,
  streakDays: 23,
  memberSince: "Jan 2024",
  defiPct: 78,
  builderPct: 55,
  govPct: 35,
};

const LIVE_STATS = [
  { raw: 1242094, format: (n: number) => n.toLocaleString("en-US"), label: "IDs" },
  { raw: 48.2, format: (n: number) => `${n.toFixed(1)}M`, label: "TX" },
  { raw: 12402, format: (n: number) => n.toLocaleString("en-US"), label: "NODES" },
];

const HEADLINE = [
  { words: ["Your", "Reputation."], accent: false },
  { words: ["Your", "Identity."], accent: false },
  { words: ["Unchained."], accent: true },
];

function getXY(e: MouseEvent, btn: HTMLElement) {
  const r = btn.getBoundingClientRect();
  const x = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
  const y = Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100));
  return { x, y };
}

function exitOffset(v: number) {
  return v > 90 ? v + 20 : v < 10 ? v - 20 : v;
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subcopyRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statValRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const flairBtnRef = useRef<HTMLButtonElement>(null);
  const flairElRef = useRef<HTMLSpanElement>(null);

  const { openConnectModal } = useConnectModal();
  const { isConnected, hasIdentity, tokenId, score, isMinting, isMinted, mint, refetchTokenId } =
    useSurgeIdentity();

  const scoreNum = Number(score);
  const liveCard: IdentityCardData | null =
    isConnected && hasIdentity && tokenId
      ? {
          id: Number(tokenId),
          tier: getTierFromScore(scoreNum),
          score: scoreNum,
          walletCount: 1,
          chainCount: 1,
          badgeCount: 0,
          streakDays: 0,
          memberSince: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          defiPct: 0,
          builderPct: 0,
          govPct: 0,
        }
      : null;

  useEffect(() => {
    if (isMinted) refetchTokenId();
  }, [isMinted, refetchTokenId]);

  const handleInitialize = () => {
    if (!isConnected) {
      openConnectModal?.();
    } else if (!hasIdentity) {
      mint();
    } else {
      document.getElementById("score-calculator")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const ctaLabel = isMinting
    ? "Minting..."
    : isConnected && hasIdentity
      ? "View Identity ↓"
      : "Initialize Protocol";

  const handleFlairEnter = useCallback((e: MouseEvent) => {
    const btn = flairBtnRef.current;
    const flair = flairElRef.current;
    if (!btn || !flair) return;
    const { x, y } = getXY(e, btn);
    gsap.set(flair, { left: x + "%", top: y + "%" });
    gsap.to(flair, { scale: 1, duration: 0.4, ease: "power2.out" });
  }, []);

  const handleFlairMove = useCallback((e: MouseEvent) => {
    const btn = flairBtnRef.current;
    const flair = flairElRef.current;
    if (!btn || !flair) return;
    const { x, y } = getXY(e, btn);
    gsap.to(flair, { left: x + "%", top: y + "%", duration: 0.4, ease: "power2.out" });
  }, []);

  const handleFlairLeave = useCallback((e: MouseEvent) => {
    const btn = flairBtnRef.current;
    const flair = flairElRef.current;
    if (!btn || !flair) return;
    const { x, y } = getXY(e, btn);
    gsap.to(flair, {
      left: exitOffset(x) + "%",
      top: exitOffset(y) + "%",
      scale: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    registerGsap();

    const btn = flairBtnRef.current;
    const flair = flairElRef.current;

    if (flair) {
      gsap.set(flair, { xPercent: -50, yPercent: -50, scale: 0 });
    }

    if (btn) {
      btn.addEventListener("mouseenter", handleFlairEnter);
      btn.addEventListener("mousemove", handleFlairMove);
      btn.addEventListener("mouseleave", handleFlairLeave);
    }

    if (prefersReduced) {
      // Show final stat values immediately without animating
      LIVE_STATS.forEach(({ raw, format }, i) => {
        const el = statValRefs.current[i];
        if (el) el.textContent = format(raw);
      });
      return () => {
        if (btn) {
          btn.removeEventListener("mouseenter", handleFlairEnter);
          btn.removeEventListener("mousemove", handleFlairMove);
          btn.removeEventListener("mouseleave", handleFlairLeave);
        }
      };
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(labelRef.current, { opacity: 0, y: 12, duration: 0.5 })
        .fromTo(
          headlineRef.current?.querySelectorAll(".t1-word") ?? [],
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, stagger: 0.16 },
          "-=0.25",
        )
        .set(headlineRef.current?.querySelector(".tw-cursor") ?? {}, { opacity: 1 }, "+=0.05")
        .fromTo(
          headlineRef.current?.querySelectorAll(".tw-char") ?? [],
          { opacity: 0 },
          { opacity: 1, duration: 0.01, stagger: 0.06 },
          "<",
        )
        .from(subcopyRef.current, { opacity: 0, y: 16, duration: 0.55 }, "-=0.35")
        .from(ctasRef.current, { opacity: 0, y: 12, duration: 0.45 }, "-=0.3")
        .from(statsRef.current, { opacity: 0, duration: 0.4 }, "-=0.2");

      LIVE_STATS.forEach(({ raw, format }, i) => {
        const el = statValRefs.current[i];
        if (!el) return;
        const obj = { value: 0 };
        tl.to(
          obj,
          {
            value: raw,
            duration: 1.4,
            ease: "power2.out",
            onUpdate() {
              el.textContent = format(Math.round(obj.value * 10) / 10);
            },
          },
          "-=0.2",
        );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      if (btn) {
        btn.removeEventListener("mouseenter", handleFlairEnter);
        btn.removeEventListener("mousemove", handleFlairMove);
        btn.removeEventListener("mouseleave", handleFlairLeave);
      }
    };
  }, [handleFlairEnter, handleFlairMove, handleFlairLeave]);

  return (
    <section
      ref={sectionRef}
      aria-label="Hero"
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: "calc(100dvh - 64px)" }}
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />

      <div
        className="w-full"
        style={{ paddingLeft: "var(--section-px)", paddingRight: "var(--section-px)" }}
      >
        <div className="grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-2 lg:gap-14">
          {/* Left — Copy */}
          <div className="flex flex-col gap-5 md:pl-12 lg:pl-20">
            {/* Label with T6 glitch on SURGE */}
            <p
              ref={labelRef}
              className="text-xs font-light tracking-[0.2em] uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              SURGE — Identity Protocol · Optimism Superchain
            </p>

            {/* Headline with T1 word stagger */}
            <h1
              ref={headlineRef}
              className="font-display leading-[1.08] font-light tracking-tighter"
              style={{ fontSize: "clamp(2rem, 6vw, 3.25rem)" }}
            >
              {HEADLINE.map((line, li) => (
                <span key={li} style={{ display: "block" }}>
                  {line.accent ? (
                    <>
                      {line.words
                        .join(" ")
                        .split("")
                        .map((char, ci) => (
                          <span
                            key={ci}
                            className="tw-char"
                            style={{
                              display: "inline-block",
                              color: "var(--accent)",
                            }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </span>
                        ))}
                      <span
                        className="tw-cursor"
                        style={{
                          display: "inline-block",
                          color: "var(--accent)",
                          opacity: 0,
                          marginLeft: "3px",
                          fontWeight: 100,
                        }}
                      >
                        |
                      </span>
                    </>
                  ) : (
                    line.words.map((word, wi) => (
                      <span
                        key={wi}
                        style={{
                          overflow: "hidden",
                          display: "inline-block",
                          marginRight: wi < line.words.length - 1 ? "0.3em" : 0,
                        }}
                      >
                        <span
                          className="t1-word"
                          style={{
                            display: "inline-block",
                            color: "var(--text)",
                          }}
                        >
                          {word}
                        </span>
                      </span>
                    ))
                  )}
                </span>
              ))}
            </h1>

            <p
              ref={subcopyRef}
              className="text-base leading-relaxed"
              style={{ color: "var(--text-muted)", maxWidth: "32rem" }}
            >
              The sovereign data layer for decentralized credit, social governance, and
              permissionless trust. Engineered for the next evolution of on-chain survival.
            </p>

            {/* CTAs */}
            <div ref={ctasRef} className="flex flex-wrap gap-4">
              {/* FL1 red flair button */}
              <button
                ref={flairBtnRef}
                onClick={handleInitialize}
                disabled={isMinting}
                className="relative overflow-hidden px-8 py-4 text-sm font-bold tracking-widest uppercase"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  borderRadius: "var(--radius-sm)",
                  background: "transparent",
                  opacity: isMinting ? 0.6 : 1,
                  cursor: isMinting ? "not-allowed" : "pointer",
                }}
                aria-label="Initialize SURGE Protocol"
              >
                <span
                  ref={flairElRef}
                  className="flair-el"
                  style={{ background: "var(--accent)" }}
                />
                <span style={{ position: "relative", zIndex: 1 }}>{ctaLabel}</span>
              </button>

              {/* View Docs */}
              <a
                href="#how-it-works"
                className="flex items-center gap-2 px-8 py-4 text-sm font-light tracking-widest uppercase"
                style={{
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text)";
                  e.currentTarget.style.borderColor = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                View Docs
              </a>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="flex gap-8 pt-5"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {LIVE_STATS.map((stat, i) => (
                <div key={stat.label} aria-live="polite" aria-atomic="true">
                  <span
                    ref={(el) => {
                      statValRefs.current[i] = el;
                    }}
                    className="text-[11px] font-light tracking-widest uppercase"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {stat.format(0)}
                  </span>
                  <span
                    className="ml-1 text-[11px] font-light tracking-widest uppercase"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Identity Card */}
          <motion.div
            className="relative flex items-center justify-center"
            variants={
              {
                hidden: { opacity: 0, x: 24 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: SPRING } },
              } as Variants
            }
            initial="hidden"
            animate="visible"
          >
            {/* Soft glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at center, var(--accent) 0%, transparent 100%)",
              }}
              aria-hidden="true"
            />
            <div className="animate-bob">
              <IdentityCard data={liveCard ?? DEMO_CARD} interactive={false} size="lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
