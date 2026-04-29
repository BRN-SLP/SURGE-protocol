"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

const PROBLEMS = [
  {
    id: "problem-1" as const,
    icon: "key",
    title: "Phished Key",
    description:
      "Traditional EOA wallets rely on a single point of failure. One phishing link, one compromised device — and your entire on-chain history is gone forever.",
  },
  {
    id: "problem-2" as const,
    icon: "password",
    title: "Leaked Seed",
    description:
      "Storing 12 words on paper or in digital notes creates irrevocable exposure. Once your seed phrase is discovered, your root of trust is permanently severed.",
  },
  {
    id: "problem-3" as const,
    icon: "terminal",
    title: "Malicious App",
    description:
      "Blind-signing transactions on unverified dApps grants unlimited permissions. Shadow-execution drains wallets silently, bypassing every standard UI safeguard.",
  },
];

function ProblemCard({ problem, index }: { problem: (typeof PROBLEMS)[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onEnter = () => {
      if (iconRef.current) iconRef.current.style.color = "var(--accent)";
      gsap.to(card, {
        y: -4,
        boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      if (iconRef.current) iconRef.current.style.color = "var(--text-muted)";
      gsap.to(card, {
        y: 0,
        boxShadow: "0 0px 0px rgba(0,0,0,0)",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(card);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      role="article"
      aria-label={problem.title}
      className="card-item relative p-6"
      data-index={index}
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <span
        ref={iconRef}
        className="material-symbols-outlined mb-4 block transition-colors duration-150"
        style={{ fontSize: "36px", color: "var(--text-muted)" }}
        aria-hidden="true"
      >
        {problem.icon}
      </span>
      <h3
        className="mb-3 text-[16px] font-light tracking-wide uppercase"
        style={{ color: "var(--text)" }}
      >
        {problem.title}
      </h3>
      <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {problem.description}
      </p>
    </div>
  );
}

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();

    const ctx = gsap.context(() => {
      const heading = sectionRef.current?.querySelector(".section-heading");
      const cards = sectionRef.current?.querySelectorAll(".card-item");

      if (heading) {
        gsap.from(heading, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
          },
        });
      }

      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, scale: 1.08, filter: "blur(8px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.12,
            clearProps: "filter,scale",
            scrollTrigger: { trigger: cards[0], start: "top 80%" },
          },
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
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
        <div className="section-heading mb-10 text-center">
          <p
            className="mb-3 text-[0.7rem] tracking-[0.22em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            The Problem
          </p>
          <h2 className="text-[40px] font-light tracking-tight" style={{ color: "var(--text)" }}>
            One Compromise. <span style={{ color: "var(--accent)" }}>Everything</span> Gone.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-[var(--block-gap)] md:grid-cols-3">
          {PROBLEMS.map((problem, i) => (
            <ProblemCard key={problem.id} problem={problem} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
