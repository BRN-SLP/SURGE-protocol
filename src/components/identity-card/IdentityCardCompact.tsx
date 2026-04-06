"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { type IdentityCardData, TIERS } from "@/types";

interface IdentityCardCompactProps {
  data: IdentityCardData;
  interactive?: boolean;
}

export function IdentityCardCompact({ data, interactive = true }: IdentityCardCompactProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tier = TIERS[data.tier];

  useEffect(() => {
    if (!interactive) return;
    const card = cardRef.current;
    if (!card) return;

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -16;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 16;
      gsap.to(card, {
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 700,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(card);
    };
  }, [interactive]);

  return (
    <div
      ref={cardRef}
      className="relative cursor-default select-none"
      style={{ width: 228, transformStyle: "preserve-3d" }}
    >
      <div className="relative overflow-hidden" style={{ borderRadius: 14, padding: 1 }}>
        {/* Spinning border */}
        <motion.div
          className="pointer-events-none absolute"
          style={{
            inset: "-80%",
            width: "260%",
            height: "260%",
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 260deg, #ca5454 300deg, #f5f5f5 340deg, transparent 360deg)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />

        <div
          className="relative"
          style={{ borderRadius: 13, background: "#141414", padding: "14px 16px", zIndex: 1 }}
        >
          {/* Glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 70% 20%, rgba(202,84,84,0.05) 0%, transparent 60%)",
              borderRadius: 13,
            }}
            aria-hidden="true"
          />

          {/* Header */}
          <div
            className="relative"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 8,
                  color: "#575757",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Protocol Anchor
              </div>
              <div
                style={{ fontSize: 11, color: "#f5f5f5", letterSpacing: "0.04em", fontWeight: 300 }}
              >
                SURGE #{String(data.id).padStart(5, "0")}
              </div>
            </div>
            <div
              style={{
                fontSize: 8,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#ca5454",
                border: "1px solid #ca5454",
                padding: "3px 8px",
              }}
            >
              {tier.label}
            </div>
          </div>

          {/* Score */}
          <div
            className="relative"
            style={{
              textAlign: "center",
              padding: "10px 0",
              borderTop: "1px solid #2a2a2a",
              borderBottom: "1px solid #2a2a2a",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: "#575757",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Reputation Score
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 300,
                color: "#f5f5f5",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {data.score.toLocaleString()}
            </div>
          </div>

          {/* Metrics — single line */}
          <div
            className="relative"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            {[
              { label: "Sybil", value: data.defiPct },
              { label: "Trust", value: data.builderPct },
              { label: "Depth", value: data.govPct },
            ].map((m) => (
              <div key={m.label} style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 11, color: "#f5f5f5", fontWeight: 300 }}>{m.value}%</div>
                <div
                  style={{
                    fontSize: 8,
                    color: "#575757",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginTop: 2,
                  }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
