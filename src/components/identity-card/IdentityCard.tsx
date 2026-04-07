"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { Hexagon } from "lucide-react";
import { type IdentityCardData, TIERS } from "@/types";

interface IdentityCardProps {
  data: IdentityCardData;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
}

function shortHash(id: number): string {
  const n = ((id * 0x7e57c0de) >>> 0).toString(16).toUpperCase().padStart(8, "0");
  return `0x${n.slice(0, 2)}…${n.slice(-4)}`;
}

export function IdentityCard({ data, interactive = true }: IdentityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const tier = TIERS[data.tier];

  useEffect(() => {
    if (!interactive) return;
    const card = cardRef.current;
    if (!card) return;

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -20;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 20;
      gsap.to(card, {
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 800,
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

  const hasMetrics =
    data.defiPct !== undefined || data.builderPct !== undefined || data.govPct !== undefined;
  const metrics = hasMetrics
    ? [
        { label: "Sybil Resistance", value: data.defiPct ?? 0 },
        { label: "Network Trust", value: data.builderPct ?? 0 },
        { label: "Activity Depth", value: data.govPct ?? 0 },
      ]
    : [];

  return (
    <div
      ref={cardRef}
      className="relative cursor-default select-none"
      style={{ width: 280, transformStyle: "preserve-3d" }}
    >
      {/* Spinning border wrapper */}
      <div className="relative overflow-hidden" style={{ borderRadius: 16, padding: 1 }}>
        {/* Spinning conic gradient border */}
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

        {/* Card body */}
        <div
          className="relative"
          style={{
            borderRadius: 15,
            background: "#141414",
            padding: 20,
            zIndex: 1,
          }}
        >
          {/* Subtle radial glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 70% 20%, rgba(202,84,84,0.06) 0%, transparent 60%)",
              borderRadius: 15,
            }}
            aria-hidden="true"
          />

          {/* Header */}
          <div className="relative mb-5 flex items-start justify-between">
            <div>
              <div
                style={{
                  fontSize: 9,
                  color: "#575757",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}
              >
                Protocol Anchor
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#f5f5f5",
                  letterSpacing: "0.04em",
                  fontWeight: 300,
                }}
              >
                SURGE IDENTITY #{String(data.id).padStart(5, "0")}
              </div>
            </div>
            {/* Tier badge — sharp corners, red outline */}
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#ca5454",
                border: "1px solid #ca5454",
                padding: "4px 10px",
              }}
            >
              {tier.label}
            </div>
          </div>

          {/* Score section */}
          <div
            className="relative"
            style={{
              textAlign: "center",
              padding: "14px 0",
              borderTop: "1px solid #2a2a2a",
              borderBottom: "1px solid #2a2a2a",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "#575757",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Reputation Score
            </div>
            <div
              style={{
                fontSize: 46,
                fontWeight: 300,
                color: "#f5f5f5",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {data.score.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#575757",
                letterSpacing: "0.18em",
                marginTop: 6,
              }}
            >
              PTS
            </div>
          </div>

          {/* Metrics */}
          {hasMetrics && (
            <div
              className="relative"
              style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}
            >
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: "#aaaaaa",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {metric.label}
                    </span>
                    <span style={{ fontSize: 10, color: "#f5f5f5" }}>{metric.value}%</span>
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: "#2a2a2a",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      style={{
                        height: "100%",
                        background: "linear-gradient(90deg, #ca5454, #e07070)",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{
                        duration: 1.2,
                        ease: [0.4, 0, 0.2, 1],
                        delay: 0.3,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div
            className="relative"
            style={{
              paddingTop: 16,
              borderTop: "1px solid #2a2a2a",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 9,
                  color: "#444",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                Verification Hash
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: "#aaaaaa",
                  marginTop: 3,
                }}
              >
                {shortHash(data.id)}
              </div>
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#575757",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              <Hexagon
                size={9}
                strokeWidth={1.25}
                style={{ marginRight: 4, verticalAlign: "middle", display: "inline" }}
              />
              Superchain
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
