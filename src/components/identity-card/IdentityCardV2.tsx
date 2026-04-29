"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { type IdentityCardData, TIERS, getNextTierInfo } from "@/types";

interface Props {
  data: IdentityCardData;
  interactive?: boolean;
}

// Tier → texture config (aligned with heritage badge visual system)
const TIER_TEXTURE: Record<string, { src: string; bgSize: string; scrim: string }> = {
  newcomer: { src: "/textures/5.jpeg", bgSize: "cover", scrim: "rgba(0,0,0,0.52)" },
  explorer: { src: "/textures/2.jpeg", bgSize: "cover", scrim: "rgba(0,0,0,0.44)" },
  contributor: { src: "/textures/4.jpeg", bgSize: "200%", scrim: "rgba(0,0,0,0.38)" },
  veteran: { src: "/textures/15.jpeg", bgSize: "cover", scrim: "rgba(0,0,0,0.30)" },
  legend: { src: "/textures/12-1.jpg", bgSize: "cover", scrim: "rgba(0,0,0,0.22)" },
};

const FONT_ORB = "var(--font-orbitron), 'Orbitron', monospace";
const FONT_MONO = "var(--font-share-tech-mono), 'Share Tech Mono', monospace";

function TextureLayers({
  tex,
  tierGlowColor,
}: {
  tex: { src: string; bgSize: string; scrim: string };
  tierGlowColor: string;
}) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('${tex.src}')`,
          backgroundSize: tex.bgSize,
          backgroundPosition: "center",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: tex.scrim }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          background: `radial-gradient(ellipse at 50% 0%, ${tierGlowColor} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function Corner({ pos, tierColor }: { pos: "tl" | "tr" | "bl" | "br"; tierColor: string }) {
  const isTop = pos[0] === "t";
  const isLeft = pos[1] === "l";
  return (
    <span
      style={{
        position: "absolute",
        width: 9,
        height: 9,
        [isTop ? "top" : "bottom"]: -1,
        [isLeft ? "left" : "right"]: -1,
        borderTop: isTop ? `1px solid ${tierColor}99` : undefined,
        borderBottom: !isTop ? `1px solid ${tierColor}99` : undefined,
        borderLeft: isLeft ? `1px solid ${tierColor}99` : undefined,
        borderRight: !isLeft ? `1px solid ${tierColor}99` : undefined,
        borderRadius:
          pos === "tl"
            ? "2px 0 0 0"
            : pos === "tr"
              ? "0 2px 0 0"
              : pos === "bl"
                ? "0 0 0 2px"
                : "0 0 2px 0",
      }}
    />
  );
}

function TierLine({ tierColor }: { tierColor: string }) {
  return (
    <div
      style={{
        height: 1,
        background: `linear-gradient(90deg, transparent, ${tierColor}55 20%, ${tierColor}99 50%, ${tierColor}55 80%, transparent)`,
        margin: "0 0 7px",
      }}
    />
  );
}

export function IdentityCardV2({ data, interactive = true }: Props) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  const tier = TIERS[data.tier];
  const tex = TIER_TEXTURE[data.tier] ?? TIER_TEXTURE.newcomer;
  const nextTierInfo = getNextTierInfo(data.score);

  // Progress to next tier (0–100)
  const tierProgress = (() => {
    if (!nextTierInfo) return 100;
    const currentMin = tier.minScore;
    const nextMin = tier.maxScore !== null ? tier.maxScore + 1 : tier.minScore;
    const range = nextMin - currentMin;
    if (range <= 0) return 100;
    return Math.min(100, Math.round(((data.score - currentMin) / range) * 100));
  })();

  // Tier dots (◆◆◆◆○)
  const tierOrder = ["newcomer", "explorer", "contributor", "veteran", "legend"];
  const tierIdx = tierOrder.indexOf(data.tier);
  const dots = tierOrder.map((_, i) => i <= tierIdx);

  // GSAP mouse tilt (only when not flipped)
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (flipped) return;
      const scene = sceneRef.current;
      const wrap = wrapperRef.current;
      if (!scene || !wrap) return;
      const r = scene.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      wrap.style.transform = `perspective(1000px) rotateY(${dx * 12}deg) rotateX(${-dy * 8}deg) translateZ(10px)`;
    },
    [flipped],
  );

  const onMouseLeave = useCallback(() => {
    const wrap = wrapperRef.current;
    if (!wrap || flipped) return;
    gsap.to(wrap, {
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      duration: 0.7,
      ease: "elastic.out(1,0.4)",
      clearProps: "transform",
    });
  }, [flipped]);

  useEffect(() => {
    if (!interactive) return;
    const scene = sceneRef.current;
    if (!scene) return;
    scene.addEventListener("mousemove", onMouseMove);
    scene.addEventListener("mouseleave", onMouseLeave);
    return () => {
      scene.removeEventListener("mousemove", onMouseMove);
      scene.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [interactive, onMouseMove, onMouseLeave]);

  const handleFlip = () => {
    if (!interactive) return;
    const wrap = wrapperRef.current;
    if (wrap) wrap.style.transform = "";
    setFlipped((f) => !f);
  };

  return (
    <div
      ref={sceneRef}
      onClick={handleFlip}
      style={{
        width: 224,
        height: 352,
        perspective: 1000,
        cursor: interactive ? "pointer" : "default",
        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.9))",
      }}
    >
      <div
        ref={wrapperRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 1s cubic-bezier(.4,0,.2,1)",
          transform: flipped ? "rotateY(180deg)" : undefined,
        }}
      >
        {/* ═══ FRONT ═══ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: `0 0 0 1px rgba(255,255,255,0.11), 0 10px 36px rgba(0,0,0,0.75)`,
            }}
          >
            <TextureLayers tex={tex} tierGlowColor={tier.glowColor} />

            {/* Front content */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "20px 16px 14px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 12,
                  width: "100%",
                }}
              >
                <img
                  src="/surge-icon-light.svg"
                  alt=""
                  style={{ width: 52, height: 52, objectFit: "contain", opacity: 0.45 }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: tier.color,
                      boxShadow: `0 0 6px ${tier.color}88`,
                      flexShrink: 0,
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONT_ORB,
                      fontSize: 7,
                      fontWeight: 300,
                      letterSpacing: "0.32em",
                      color: "#bbb",
                      textTransform: "uppercase",
                    }}
                  >
                    Surge Identity
                  </span>
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: tier.color,
                      boxShadow: `0 0 6px ${tier.color}88`,
                      flexShrink: 0,
                      display: "inline-block",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: FONT_ORB,
                    fontWeight: 400,
                    fontSize: 13,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: tier.color,
                    textShadow: `0 0 12px ${tier.color}55`,
                    textAlign: "center",
                  }}
                >
                  {tier.label}
                </div>
              </div>

              {/* ID Zone — score + progress + stats */}
              <div
                style={{
                  width: "100%",
                  flex: 1,
                  borderRadius: 7,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0,
                  marginBottom: 12,
                  position: "relative",
                  padding: "10px 10px 10px",
                }}
              >
                <Corner pos="tl" tierColor={tier.color} />
                <Corner pos="tr" tierColor={tier.color} />
                <Corner pos="bl" tierColor={tier.color} />
                <Corner pos="br" tierColor={tier.color} />

                {/* Score */}
                <div style={{ textAlign: "center", marginBottom: 8, width: "100%" }}>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 5,
                      letterSpacing: "0.2em",
                      color: "rgba(180,180,180,0.6)",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Reputation Score
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_ORB,
                      fontSize: 56,
                      fontWeight: 400,
                      color: "#e0e0e0",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {data.score.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 5,
                      letterSpacing: "0.2em",
                      color: "rgba(180,180,180,0.45)",
                      marginTop: 2,
                    }}
                  >
                    PTS
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: "100%", marginBottom: 8 }}>
                  <div
                    style={{
                      height: 2,
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 1,
                      overflow: "hidden",
                      marginBottom: 4,
                    }}
                  >
                    <motion.div
                      style={{
                        height: "100%",
                        background: `linear-gradient(90deg, ${tier.color}66, ${tier.color})`,
                        borderRadius: 1,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${tierProgress}%` }}
                      transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 5,
                      letterSpacing: "0.1em",
                      color: "rgba(180,180,180,0.5)",
                      textAlign: "center",
                    }}
                  >
                    {nextTierInfo ? (
                      <>
                        <span style={{ color: "#aaa" }}>
                          {nextTierInfo.ptsNeeded.toLocaleString()} pts
                        </span>
                        {" to "}
                        <span style={{ color: TIERS[nextTierInfo.tier].color }}>
                          {TIERS[nextTierInfo.tier].label}
                        </span>
                      </>
                    ) : (
                      <span style={{ color: tier.color }}>Max Tier Reached</span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div
                  style={{
                    width: "60%",
                    height: 1,
                    background: `${tier.color}33`,
                    margin: "2px 0 8px",
                  }}
                />

                {/* Stats row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%",
                    marginBottom: 8,
                  }}
                >
                  {[
                    { label: "Wallets", value: data.walletCount },
                    { label: "Chains", value: data.chainCount },
                    { label: "Badges", value: data.badgeCount },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 5,
                          letterSpacing: "0.2em",
                          color: "rgba(180,180,180,0.6)",
                          textTransform: "uppercase",
                          marginBottom: 3,
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontFamily: FONT_ORB,
                          fontSize: 28,
                          fontWeight: 400,
                          color: "#e0e0e0",
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div
                  style={{
                    width: "60%",
                    height: 1,
                    background: `${tier.color}33`,
                    margin: "2px 0 8px",
                  }}
                />

                {/* Skill bars */}
                {(data.defiPct !== undefined || data.builderPct !== undefined) && (
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 5 }}>
                    {[
                      { label: "DeFi", pct: data.defiPct ?? 0, color: "#22b5cc" },
                      { label: "Builder", pct: data.builderPct ?? 0, color: "#a066dd" },
                      { label: "Gov", pct: data.govPct ?? 0, color: "#f0aa20" },
                    ].map(({ label, pct, color }) => (
                      <div key={label}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 2,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: FONT_MONO,
                              fontSize: 5,
                              color: "rgba(180,180,180,0.55)",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                            }}
                          >
                            ◇ {label}
                          </span>
                          <span
                            style={{
                              fontFamily: FONT_MONO,
                              fontSize: 5,
                              color: "rgba(180,180,180,0.55)",
                            }}
                          >
                            {pct}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: 2,
                            background: "rgba(255,255,255,0.06)",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <motion.div
                            style={{
                              height: "100%",
                              background: `linear-gradient(90deg, ${color}55, ${color})`,
                              borderRadius: 1,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ width: "100%", opacity: 0.8 }}>
                <TierLine tierColor={tier.color} />
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 5,
                      letterSpacing: "0.14em",
                      color: "#999",
                      textTransform: "uppercase",
                    }}
                  >
                    {data.streakDays
                      ? `streak · ${data.streakDays}d`
                      : `since · ${data.memberSince ?? "2024"}`}
                  </span>
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: tier.color,
                      boxShadow: `0 0 5px ${tier.color}cc`,
                      display: "inline-block",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ BACK ═══ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: `0 0 0 1px rgba(255,255,255,0.11), 0 10px 36px rgba(0,0,0,0.75)`,
            }}
          >
            <TextureLayers tex={tex} tierGlowColor={tier.glowColor} />

            {/* Watermark */}
            <img
              src="/surge-icon-light.svg"
              alt=""
              style={{
                position: "absolute",
                top: "27%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: 110,
                height: 110,
                objectFit: "contain",
                opacity: 0.2,
                zIndex: 1,
              }}
            />

            {/* Wear band */}
            <div
              style={{
                position: "absolute",
                top: 52,
                left: 0,
                right: 0,
                height: 2,
                background:
                  "linear-gradient(90deg,transparent,rgba(160,150,130,0.06) 30%,rgba(180,170,150,0.1) 50%,rgba(160,150,130,0.06) 70%,transparent)",
                zIndex: 2,
              }}
            />

            {/* Back data */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "0 16px 13px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                zIndex: 3,
                opacity: 0.8,
              }}
            >
              <TierLine tierColor={tier.color} />
              {[
                { key: "ID", val: `#${String(data.id).padStart(5, "0")}`, valColor: tier.color },
                {
                  key: "TIER",
                  val: `${tier.label.toUpperCase()} ${dots.map((f) => (f ? "◆" : "○")).join("")}`,
                  valColor: tier.color,
                },
                { key: "SCORE", val: `${data.score.toLocaleString()} pts`, valColor: undefined },
                {
                  key: "CHAIN",
                  val: `${data.walletCount}W · ${data.chainCount}C · ${data.badgeCount}B`,
                  valColor: undefined,
                },
                ...(data.streakDays
                  ? [{ key: "STREAK", val: `${data.streakDays} days`, valColor: undefined }]
                  : []),
                { key: "SINCE", val: data.memberSince ?? "Jan 2024", valColor: undefined },
                ...(data.defiPct !== undefined
                  ? [
                      {
                        key: "DeFi/BLD/GOV",
                        val: `${data.defiPct}% · ${data.builderPct ?? 0}% · ${data.govPct ?? 0}%`,
                        valColor: undefined,
                      },
                    ]
                  : []),
                {
                  key: "VERIFY",
                  val: `surge.xyz/v/${String(data.id).padStart(5, "0")}`,
                  valColor: undefined,
                  blink: true,
                },
                { key: "STAT", val: "SOULBOUND · VERIFIED", valColor: "#ccc" },
              ].map(({ key, val, valColor, blink }) => (
                <div key={key} style={{ display: "flex", gap: 5, alignItems: "baseline" }}>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 4.5,
                      letterSpacing: "0.14em",
                      color: "#aaa",
                      textTransform: "uppercase",
                      flexShrink: 0,
                      minWidth: 44,
                    }}
                  >
                    {key}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 5,
                      letterSpacing: "0.05em",
                      color: valColor ?? "#ccc",
                      wordBreak: "break-all",
                    }}
                  >
                    {val}
                    {blink && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 5,
                          height: 8,
                          background: "rgba(140,20,20,0.7)",
                          animation: "blink 1.1s step-end infinite",
                          verticalAlign: "middle",
                          marginLeft: 2,
                        }}
                      />
                    )}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 5,
                  fontFamily: FONT_MONO,
                  fontSize: 5,
                  letterSpacing: "0.2em",
                  color: "#888",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                SURGE_PROTOCOL · IDENTITY_ANCHOR_v1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
