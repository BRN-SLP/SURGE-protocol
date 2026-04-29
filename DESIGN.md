# SURGE Protocol — Design System

## Color Tokens (globals.css — do not change)

### Dark mode (default)

```css
--bg: #0e0e0e /* page background */ --surface: #141414 /* card surfaces */ --surface-2: #353534
  /* hover states, interactive elements */ --text: #f5f5f5 --text-muted: #aaaaaa
  --text-faint: #555555 --border: #2a2a2a --border-hover: #3a3a3a --accent: #dc3333
  /* destructive / rare surprise moment */ --accent-hover: #c42020 --success: #22aa66
  --color-score: #22b5cc /* teal — score display */ --color-badge: #f0aa20
  /* amber — badge / warning states */ --color-link: #4d8eff /* blue — links, info actions */;
```

### Light mode

```css
--bg: #f5f5f5 --surface: #ffffff --surface-2: #ebebeb --text: #0e0e0e --text-muted: #666666
  --text-faint: #aaaaaa --border: #d4d4d4 --border-hover: #bbbbbb --accent: #dc3333
  --accent-hover: #c42020 --success: #18884d --color-score: #1d9db3 --color-badge: #d4941a
  --color-link: #3a78f0;
```

## Typography

- Font token: `--font-display` (resolves to Roboto Condensed)
- Base weight: 300 (light) throughout
- Bold only for specific emphasis (CTA button text)
- Tracking: tight for headlines, widened (`0.1–0.22em`) for labels and eyebrows
- Monospace: `--font-mono` (ui-monospace / Courier New) for addresses, hashes

## Spacing & Radius

```css
--section-px: clamp(1.5rem, 5vw, 5rem) /* horizontal section padding */
  --section-py: clamp(4rem, 8vw, 8rem) /* vertical section padding */
  --block-gap: clamp(1rem, 2.5vw, 2rem) /* gap between major layout blocks */ --radius-sm: 8px
  /* standard — all cards and containers */ --radius-md: 12px /* modals, larger panels */
  --radius-lg: 16px /* IdentityCard outer shell (conic-gradient border effect) */;
```

Exceptions to radius-sm: IdentityCard inner shell uses 15px to inset the 1px conic border; pill progress bars use 99px (capsule).

## Elevation

- Level 0: `var(--bg)` — page background
- Level 1: `var(--surface)` — card surfaces, panels
- Level 2: `var(--surface-2)` — hover states, interactive elements, input backgrounds
- Borders separate surfaces instead of shadows

## Component Patterns

### Eyebrow labels

```css
font-size: 0.7rem;
text-transform: uppercase;
letter-spacing: 0.22em;
color: var(--text-muted);
```

### Section headings

```css
font-size: clamp(32px, 5vw, 40px);
font-weight: 300;
letter-spacing: -0.02em;
```

### Interactive borders

Base: `1px solid var(--border)`. Transitions to `var(--accent)` on focus/hover. Never thicker than 1px as a decorative side stripe.

### Accent usage

At most one accent element per section. Accent red is a functional signal only: destructive action coloring, hover highlight, focus ring. Never used as fill or background.

### Modals

- Max width: 460px
- Surface: `var(--surface)`, border: `1px solid var(--border)`, radius: `var(--radius-md)`
- Destructive actions: border `rgba(220,51,51,0.3)`, background `rgba(220,51,51,0.04)`
- Info actions: border `rgba(77,142,255,0.3)`, background `rgba(77,142,255,0.04)`

### IdentityCard (tier system)

4 tiers, each with `color` and `glowColor`. The card is the hero artifact — always animated (spinning conic-gradient border + depth-tilt). The outer shell is 340px wide, outer radius 16px / inner radius 15px to accommodate the 1px animated border.

### WalletCard (identity management)

Surface: `var(--surface)`, border: `1px solid var(--border)`, radius: `var(--radius-sm)`. Status indicators use `--success`, `--accent`, `--color-badge` for active / compromised / frozen states respectively.

## Motion

- Entrance: fade-up (opacity + translateY), power2.out, 0.5–0.9s
- Scroll: GSAP ScrollTrigger, scrub 0.8 for pinned sequences
- Stagger: 0.06–0.16s between sibling elements
- All auto-playing animations gated behind `prefers-reduced-motion` check
- State transitions (React): Framer Motion
- No bounce, no elastic easing
