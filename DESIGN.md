# SURGE Protocol — Design System

## Color Tokens (globals.css — do not change)

```css
--bg: #0e0e0e --surface: #141414 --surface-2: #353534 --text: #f5f5f5 --text-muted: #aaaaaa
  --text-faint: #555555 (dark) / #aaaaaa (light) --border: #2a2a2a --accent: #dc3333
  --accent-hover: (slightly lighter red) --color-score: #22b5cc (teal, for score display)
  --color-badge: #f0aa20 (amber, for badge/warning states) --section-px: clamp(1.5rem, 5vw, 5rem);
```

## Typography

- Font family: Roboto Condensed (`--font-roboto-condensed`)
- Base weight: 300 (light) throughout
- Bold only for specific emphasis (CTA button text)
- Tracking: varies — tight for headlines, widened for labels/eyebrows

## Spacing

- Section padding: `var(--section-px)` horizontal, `clamp()` vertical
- Block gap: `var(--block-gap)` between major layout blocks
- Card radius: `var(--radius-sm): 10px` standard

## Component Patterns

- **Eyebrow labels**: `text-[0.7rem] tracking-[0.22em] uppercase` in `var(--text-muted)`
- **Section headings**: `text-[32-40px] font-light tracking-tight`
- **Interactive borders**: `border: 1px solid var(--border)` base, transitions to `var(--accent)` on focus/hover
- **Accent usage**: Hover highlights, focus indicators, one accent word per headline
- **Animations**: GSAP for scroll effects and entrance sequences; Framer Motion for state transitions

## Elevation

- Level 0: `var(--bg)` — page background
- Level 1: `var(--surface)` — card surfaces, sidebars
- Level 2: `var(--surface-2)` — hover states, interactive elements
- Borders separate surfaces instead of shadows

## Motion

- Entrance: fade-up (opacity + y translate), power2.out, 0.5-0.9s
- Scroll: GSAP ScrollTrigger, scrub 0.8 for pinned sequences
- Stagger: 0.06-0.16s between sibling elements
- All auto-playing GSAP animations gated behind `prefers-reduced-motion` check
