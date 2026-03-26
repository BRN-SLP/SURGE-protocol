"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { type IdentityCardData, TIERS, getNextTierInfo } from "@/types";

interface IdentityCardProps {
  data: IdentityCardData;
  interactive?: boolean; // enable 3D tilt
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "w-48 h-72 text-xs",
  md: "w-64 h-96 text-sm",
  lg: "w-80 h-[28rem] text-base",
};

export function IdentityCard({ data, interactive = true, size = "md" }: IdentityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const tier = TIERS[data.tier];
  const nextTier = getNextTierInfo(data.score);
  const nextTierConfig = nextTier ? TIERS[nextTier.tier] : null;
  const progressPct = nextTier
    ? ((data.score - tier.minScore) / ((nextTierConfig?.minScore ?? data.score) - tier.minScore)) *
      100
    : 100;

  const maxTilt = data.tier === "legend" ? 15 : data.tier === "veteran" ? 12 : 8;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientY - rect.top) / rect.height - 0.5) * -maxTilt * 2;
      const y = ((e.clientX - rect.left) / rect.width - 0.5) * maxTilt * 2;
      setTilt({ x, y });
    },
    [interactive, maxTilt],
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${SIZE_CLASSES[size]} cursor-default select-none`}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500"
        style={{
          background: tier.glowColor,
          opacity: isHovered ? 0.6 : 0,
        }}
      />

      {/* Card border — animated for veteran/legend */}
      <div
        className={`absolute inset-0 rounded-2xl p-[1px] ${
          data.tier === "legend" || data.tier === "veteran" ? "animate-gradient-border" : ""
        }`}
        style={{
          background:
            data.tier === "newcomer"
              ? "#2d2d3f"
              : `linear-gradient(135deg, ${tier.color}88, ${tier.color}44, ${tier.color}88)`,
        }}
      >
        {/* Card body */}
        <div className="relative flex h-full w-full flex-col gap-3 overflow-hidden rounded-2xl bg-[#13131a] p-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-xs tracking-widest text-[#94a3b8] uppercase">
                ◆ SURGE IDENTITY
              </p>
              <p className="mt-0.5 font-mono text-lg font-bold text-[#f1f5f9]">
                #{String(data.id).padStart(5, "0")}
              </p>
            </div>
            {/* Tier badge */}
            <div className="flex flex-col items-end gap-1" style={{ color: tier.color }}>
              <span className="font-display text-sm font-bold tracking-wide uppercase">
                {tier.label}
              </span>
              <TierDots filled={tier.dots} color={tier.color} />
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between">
              <span
                className="font-display text-2xl font-bold tabular-nums"
                style={{ color: tier.color }}
              >
                {data.score.toLocaleString()}
              </span>
              {nextTier && (
                <span className="text-xs text-[#94a3b8]">
                  → {nextTier.ptsNeeded.toLocaleString()} to {TIERS[nextTier.tier].label}
                </span>
              )}
            </div>
            {/* Progress bar */}
            <div className="h-1.5 overflow-hidden rounded-full bg-[#1c1c27]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${tier.color}, ${tier.color}99)` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPct, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#1c1c27]" />

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <StatItem label="Wallets" value={data.walletCount} />
            <StatItem label="Chains" value={data.chainCount} />
            <StatItem label="Badges" value={data.badgeCount} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <StatItem label="Streak" value={`${data.streakDays}d`} />
            <StatItem label="Since" value={data.memberSince} />
          </div>

          {/* Divider */}
          <div className="h-px bg-[#1c1c27]" />

          {/* Skill bars */}
          <div className="flex flex-col gap-1.5">
            <SkillBar label="DeFi" value={data.defiPct} color="#6366f1" />
            <SkillBar label="Builder" value={data.builderPct} color="#8b5cf6" />
            <SkillBar label="Gov" value={data.govPct} color="#06b6d4" />
          </div>

          {/* Holographic overlay for legend */}
          {data.tier === "legend" && (
            <div className="holographic-overlay pointer-events-none absolute inset-0 rounded-2xl opacity-20" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TierDots({ filled, color }: { filled: number; color: string }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-2 w-2 rounded-full transition-all duration-300"
          style={{
            background: i < filled ? color : "#2d2d3f",
            boxShadow: i < filled ? `0 0 6px ${color}88` : "none",
          }}
        />
      ))}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] tracking-wider text-[#94a3b8] uppercase">{label}</span>
      <span className="font-mono font-semibold text-[#f1f5f9] tabular-nums">{value}</span>
    </div>
  );
}

function SkillBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 shrink-0 text-[10px] text-[#94a3b8]">◇ {label}</span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#1c1c27]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      <span className="w-7 text-right font-mono text-[10px] text-[#94a3b8]">{value}%</span>
    </div>
  );
}
