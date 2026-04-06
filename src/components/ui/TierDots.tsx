import { TIERS } from "@/types";
import type { Tier } from "@/types";

interface TierDotsProps {
  tier: Tier;
  size?: number;
}

export function TierDots({ tier, size = 9 }: TierDotsProps) {
  const config = TIERS[tier];
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: size,
            height: size,
            borderRadius: "50%",
            background: i < config.dots ? config.color : "var(--surface-2)",
          }}
        />
      ))}
    </span>
  );
}
