export type BorderVariant =
  | "cw-tl"
  | "cw-tr"
  | "cw-br"
  | "cw-bl"
  | "ccw-tl"
  | "ccw-br"
  | "from-top-center"
  | "split-h"
  | "split-v"
  | "opposite-arcs"
  | "from-corners"
  | "from-midpoints";

export const ALL_VARIANTS: BorderVariant[] = [
  "cw-tl",
  "cw-tr",
  "cw-br",
  "cw-bl",
  "ccw-tl",
  "ccw-br",
  "from-top-center",
  "split-h",
  "split-v",
  "opposite-arcs",
  "from-corners",
  "from-midpoints",
];

// Returns SVG path strings for given dimensions and corner radius
export function getVariantPaths(w: number, h: number, r: number, variant: BorderVariant): string[] {
  const R = Math.min(r, w / 2, h / 2);

  switch (variant) {
    // ─── Single-path (full perimeter) ───────────────────────────────────────

    // Clockwise from top-left corner
    case "cw-tl":
      return [
        `M ${R},0 L ${w - R},0 Q ${w},0 ${w},${R} L ${w},${h - R} Q ${w},${h} ${w - R},${h} L ${R},${h} Q 0,${h} 0,${h - R} L 0,${R} Q 0,0 ${R},0 Z`,
      ];

    // Clockwise from top-right corner
    case "cw-tr":
      return [
        `M ${w},${R} L ${w},${h - R} Q ${w},${h} ${w - R},${h} L ${R},${h} Q 0,${h} 0,${h - R} L 0,${R} Q 0,0 ${R},0 L ${w - R},0 Q ${w},0 ${w},${R} Z`,
      ];

    // Clockwise from bottom-right corner
    case "cw-br":
      return [
        `M ${w - R},${h} L ${R},${h} Q 0,${h} 0,${h - R} L 0,${R} Q 0,0 ${R},0 L ${w - R},0 Q ${w},0 ${w},${R} L ${w},${h - R} Q ${w},${h} ${w - R},${h} Z`,
      ];

    // Clockwise from bottom-left corner
    case "cw-bl":
      return [
        `M 0,${h - R} L 0,${R} Q 0,0 ${R},0 L ${w - R},0 Q ${w},0 ${w},${R} L ${w},${h - R} Q ${w},${h} ${w - R},${h} L ${R},${h} Q 0,${h} 0,${h - R} Z`,
      ];

    // Counter-clockwise from top-left corner
    case "ccw-tl":
      return [
        `M 0,${R} L 0,${h - R} Q 0,${h} ${R},${h} L ${w - R},${h} Q ${w},${h} ${w},${h - R} L ${w},${R} Q ${w},0 ${w - R},0 L ${R},0 Q 0,0 0,${R} Z`,
      ];

    // Counter-clockwise from bottom-right corner
    case "ccw-br":
      return [
        `M ${w},${h - R} L ${w},${R} Q ${w},0 ${w - R},0 L ${R},0 Q 0,0 0,${R} L 0,${h - R} Q 0,${h} ${R},${h} L ${w - R},${h} Q ${w},${h} ${w},${h - R} Z`,
      ];

    // From top-center, goes right first then CW
    case "from-top-center":
      return [
        `M ${w / 2},0 L ${w - R},0 Q ${w},0 ${w},${R} L ${w},${h - R} Q ${w},${h} ${w - R},${h} L ${R},${h} Q 0,${h} 0,${h - R} L 0,${R} Q 0,0 ${R},0 L ${w / 2},0 Z`,
      ];

    // ─── Two-path variants ───────────────────────────────────────────────────

    // Top half + bottom half simultaneously, meet at left-mid and right-mid
    case "split-h":
      return [
        // CW from top-center → right-mid
        `M ${w / 2},0 L ${w - R},0 Q ${w},0 ${w},${R} L ${w},${h / 2}`,
        // CCW from top-center → left-mid
        `M ${w / 2},0 L ${R},0 Q 0,0 0,${R} L 0,${h / 2}`,
      ];

    // Left + right halves simultaneously, meet at top-center and bottom-center
    case "split-v":
      return [
        // From left-mid → down-left → bottom-center
        `M 0,${h / 2} L 0,${h - R} Q 0,${h} ${R},${h} L ${w / 2},${h}`,
        // From right-mid → down-right → bottom-center
        `M ${w},${h / 2} L ${w},${h - R} Q ${w},${h} ${w - R},${h} L ${w / 2},${h}`,
      ];

    // Two half-perimeters, TL-side and BR-side simultaneously
    case "opposite-arcs":
      return [
        // Top + right sides (TL→TR→BR)
        `M ${R},0 L ${w - R},0 Q ${w},0 ${w},${R} L ${w},${h - R} Q ${w},${h} ${w - R},${h}`,
        // Bottom + left sides (BR→BL→TL)
        `M ${w - R},${h} L ${R},${h} Q 0,${h} 0,${h - R} L 0,${R} Q 0,0 ${R},0`,
      ];

    // ─── Four-path variants ──────────────────────────────────────────────────

    // From each corner outward to midpoints (pinwheel)
    case "from-corners":
      return [
        // TL corner → right to top-center
        `M 0,${R} Q 0,0 ${R},0 L ${w / 2},0`,
        // TR corner → down to right-mid
        `M ${w - R},0 Q ${w},0 ${w},${R} L ${w},${h / 2}`,
        // BR corner → left to bottom-center
        `M ${w},${h - R} Q ${w},${h} ${w - R},${h} L ${w / 2},${h}`,
        // BL corner → up to left-mid
        `M ${R},${h} Q 0,${h} 0,${h - R} L 0,${h / 2}`,
      ];

    // From midpoints converging to corners
    case "from-midpoints":
      return [
        // top-mid → right → TR corner
        `M ${w / 2},0 L ${w - R},0 Q ${w},0 ${w},${R}`,
        // right-mid → down → BR corner
        `M ${w},${h / 2} L ${w},${h - R} Q ${w},${h} ${w - R},${h}`,
        // bottom-mid → left → BL corner
        `M ${w / 2},${h} L ${R},${h} Q 0,${h} 0,${h - R}`,
        // left-mid → up → TL corner
        `M 0,${h / 2} L 0,${R} Q 0,0 ${R},0`,
      ];

    default:
      return [
        `M ${R},0 L ${w - R},0 Q ${w},0 ${w},${R} L ${w},${h - R} Q ${w},${h} ${w - R},${h} L ${R},${h} Q 0,${h} 0,${h - R} L 0,${R} Q 0,0 ${R},0 Z`,
      ];
  }
}

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Assigns variants to N blocks with no adjacent duplicates
export function assignVariants(count: number): BorderVariant[] {
  const pool = shuffle([...ALL_VARIANTS]);
  const result: BorderVariant[] = [];

  for (let i = 0; i < count; i++) {
    const prev = result[i - 1];
    const idx = pool.findIndex((v) => v !== prev);
    if (idx === -1) {
      pool.push(...shuffle([...ALL_VARIANTS]));
      result.push(pool.find((v) => v !== prev) ?? pool[0]);
    } else {
      result.push(pool.splice(idx, 1)[0]);
    }
    if (pool.length < 3) pool.push(...shuffle([...ALL_VARIANTS]));
  }

  return result;
}
