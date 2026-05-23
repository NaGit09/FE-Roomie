# Roomie Design System - Matching Page Override

This document outlines page-specific deviations and exact component specs for the Roommate Matching (`/matching`) module, supplementing `design-system/MASTER.md`.

## 1. Bento Grid Specification (Active Preferences Card)
The active preference bento card utilizes a responsive grid layout:
- **Mobile (default):** 2-column grid (`grid-cols-2`)
- **Desktop (md+):** 4-column grid (`grid-cols-4`)
- **Aesthetic details:** Semi-translucent panels (`bg-background/60 backdrop-blur-sm border-border/50`) to construct individual spec boxes with subtle HSL accents.

## 2. Match Indicator Specifications
High-quality compatibility indexes (90%+) utilize:
- **SVG Stroke Dash:** A circular SVG path mapping stroke-dash arrays (`${percentage}, 100`) dynamically.
- **Colors:** Glowing green shadow bounds (`drop-shadow-[0_0_4px_rgba(16,185,129,0.2)]`) and custom emerald tags (`text-emerald-500 bg-emerald-50`) to maximize trust aesthetics.

## 3. Form Input Binding (RangeBudget)
- **Controlled Elements:** Minimum and maximum budgets are completely bound to the Zustand store state (`value={budget_min || ""}`).
- **Cascading Selectors:** Disabled state on district picker triggers opacity filters (`disabled:opacity-50 disabled:cursor-not-allowed`) until province code is populated.
