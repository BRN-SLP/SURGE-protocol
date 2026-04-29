# SURGE Protocol — Product Context

## Product Purpose

SURGE Protocol is an identity-first reputation layer for the Optimism Superchain. It lets users build a sovereign, soulbound on-chain identity (the "Anchor") that aggregates reputation across multiple wallets. When a wallet is compromised or abandoned, the identity — and its earned reputation — survives.

## Register

**brand** — this is a marketing/landing site. Design IS the product.

## Users

Primary: Web3 power users — DeFi traders, protocol veterans, governance participants — who have meaningful on-chain history and fear losing it to a compromised key. They've seen "start over" happen to others and want a better primitive.

Secondary: Builders on the Superchain who want to gate features by reputation without building their own identity stack.

## Brand Voice

Terse. Technical. Confident without overreach. Language of infrastructure, not hype. "Protocol" not "platform." "Sovereign" not "decentralized." Short sentences. Fewer adjectives.

Anti-voice: cheerful SaaS copy, Web3 buzzword salad, vague empowerment language ("own your future").

## Tone

Dark. Precise. Slightly ominous in a good way — the gravity of something that matters. Not edgy or tryhard.

## Anti-References

- Brightly colored Web3 hype sites (neon green on black)
- Generic SaaS landing pages with hero metrics
- Glassmorphism / blur-heavy UIs
- Rainbow gradients on text

## Design Principles (locked)

- Background: `#0e0e0e`, surfaces: `#141414`, `#2a2a2a`
- Accent: `#dc3333` — rare, used as surprise moment (thin line, hover)
- Font: Roboto Condensed, `font-weight: 300` everywhere
- Radius: `var(--radius-sm)` for all cards/containers — never hardcoded px (exceptions: IdentityCard conic-gradient border, pill progress bars)
- No glassmorphism, no gradient fills, no decorative noise
- Animations: GSAP, purposeful, subtle

## Strategic Principles

- Keyboard users matter — this is a protocol for power users who nav by keyboard
- Reduced motion must be respected — GSAP gates required on all auto-playing animations
- Dark mode is the primary experience; light mode exists but is secondary
