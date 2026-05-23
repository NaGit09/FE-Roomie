# Roomie Design System - MASTER

This is the global Source of Truth for the design rules and specifications of the Roomie platform. All pages and features should adhere to these core principles to maintain a premium, cohesive, and high-end aesthetic.

## 1. Product Type & Industry: Roommate Matching (Premium Luxury Real Estate)
- **Primary Vibe:** Liquid Glass
- **Style Keywords:** Flowing glass, morphing gradients, smooth transitions, fluid translucent layers, premium warm luxury cream tones.

## 2. Color Palette
Harmonious, warm, and sophisticated color palette designed for high contrast and luxury:

| Role | Color Name | Hex Code | Purpose |
|------|------------|----------|---------|
| Primary Background | Luxury Cream | `#FAFAF9` (Stone-50) | Core page backdrop offering comfortable readability. |
| Contrast Base | Premium Ink | `#1C1917` (Stone-900) | Secondary backdrops, high-contrast sections, primary headers. |
| Body Text | Deep Stone | `#0C0A09` (Stone-950) | Standard high-contrast copy, slate/stone-950 equivalents. |
| Muted Text | Medium Slate | `#44403C` (Stone-700) | Sub-titles, labels, descriptor copy. |
| Accent / CTA | Royal Gold | `#CA8A04` (Amber-600/Gold) | Critical highlights, secondary active selectors. |
| Success / Trust | Premium Emerald | `#10B981` (Emerald-500) | High-quality match indicators (90%+ compatibility), success ticks. |

## 3. Typography
- **Heading Font:** *Bodoni Moda* (Google Font) - Serif, high-end, sophisticated, editorial mood.
- **Body Font:** *Jost* (Google Font) - Sans-serif, geometric, premium minimalist structure.
- **Vibe:** Luxury minimalist, highly refined, clean spacing.

## 4. Key Visual & Motion Effects
- **Backdrop Blurs:** `backdrop-blur-md` and `backdrop-blur-xl` combined with transparent white borders (`border-white/40`) to create floating Liquid Glass panels.
- **Smooth Transitions:** Fixed transition speed of 150-300ms (`transition-all duration-300`) on all interactive buttons, scales, and inputs.
- **Interactive Cursor:** Active `cursor-pointer` on all selectable items, buttons, cascades, and slider components.
- **Borders:** Subtle visible borders using `border-border/50` or `border-white/40` to guarantee structure in both light and dark environments.

## 5. Pre-Delivery UX Guidelines
- **Anti-Emoji:** Emojis must NEVER be used as icons. Always use standard SVG icons (Lucide/Heroicons).
- **Scale Stability:** Hover animations must never trigger layout shifting.
- **Contrast Ratios:** Minimum contrast ratio of 4.5:1 on all text nodes to preserve accessibility.
