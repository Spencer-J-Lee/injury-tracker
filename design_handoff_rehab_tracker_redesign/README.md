# Handoff: Rehab Tracker — Visual Refresh

## Overview

Visual polish pass for the Injury Tracker app's four core screens: Dashboard, Injury Detail, Log Entry modal, and Settings. Dark, warm-neutral theme with a single blue accent, pill-shaped status/pain badges, and a Lora/Manrope type pairing.

## About the Design Files

`reference.html` in this folder is a **static HTML design reference** — a prototype showing the intended look, not production code to copy directly. The task is to **recreate this design in the existing React + Tailwind CSS codebase** (`injury-tracker/`), using its existing component structure, Tailwind v4 `@theme` tokens, and libraries (recharts, etc.) — not by pasting raw HTML/inline styles into components.

Open `reference.html` directly in a browser to view all four screens with real (non-templated) values.

## Fidelity

**High-fidelity.** Colors, spacing, typography, and component shapes below are final. Recreate pixel-close using Tailwind utilities and the app's existing design tokens.

## Good news: tokens already mostly match

`injury-tracker/src/index.css` already defines a `@theme` block (`--color-canvas`, `--color-surface`, `--color-accent`, `--color-pain-*`, `--font-heading: 'Lora', serif`, etc.) that matches this design's default palette almost exactly. **This is a refinement of the existing visual system, not a new one.** Where a value below differs from what's currently in `index.css`, update the token there rather than hardcoding it in a component.

## Design Tokens

Reference these Tailwind v4 theme vars (already in `src/index.css`) — add any missing ones:

- `--color-canvas: oklch(0.14 0.008 60)` — main content background (reference uses 0.14 for `<main>`, 0.16 for `<aside>` sidebar — consider adding `--color-canvas-sidebar: oklch(0.16 0.008 60)`)
- `--color-surface: oklch(0.19 0.01 60)` — cards
- `--color-surface-raised: oklch(0.2 0.011 60)` — modal body
- `--color-subtle: oklch(0.27 0.01 60)` — default border
- `--color-strong: oklch(0.32 0.012 60)` — button/input borders
- `--color-ink: oklch(0.96 0.004 60)`, `--color-ink-secondary: oklch(0.76 0.012 60)`, `--color-ink-muted: oklch(0.56–0.66 0.012 60)` (muted varies 0.56–0.66 across contexts — treat 0.6/0.66 as one "muted" step and 0.5/0.52 as a dimmer "faint" step)
- `--color-accent: oklch(0.58 0.1 250)`, `--color-accent-hover: oklch(0.5 0.1 250)`, `--color-accent-soft: oklch(0.26 0.05 250)`, `--color-accent-soft-text: oklch(0.8 0.08 250)`, `--color-accent-on: oklch(0.14 0.01 60)` (text color on top of solid accent buttons)
- Pain severity — already defined, confirm values: `--color-pain-green(-bg): oklch(0.72 0.13 150) / oklch(0.27 0.045 150)` (Mild), `--color-pain-amber(-bg): oklch(0.76 0.13 85) / oklch(0.27 0.045 85)` (Moderate), `--color-pain-red(-bg): oklch(0.72 0.15 25) / oklch(0.27 0.05 25)` (Severe)
- `--font-heading: 'Lora', serif` (already set) — body font is Manrope, already set as default `body` font-family
- Border radius scale used throughout: `10px` (small controls/inputs), `11–12px` (buttons/nav items), `14–16px` (cards), `18–20px` (modal/shell), `999px` (pills/badges/sliders)
- Card padding `18px`; page/shell padding `24px`; sidebar-to-main gap via `20px` vertical rhythm (`sectionGap`)

## Screens / Views

### 1. Dashboard (`DashboardPage.tsx` + `AppShell.tsx`)

**Layout:** Shell is a 2-column grid, `220px` sidebar + flexible main, wrapped in a rounded-20px bordered container with a large soft drop shadow (`0 24px 60px -20px rgba(0,0,0,.5)`). This shell wrapper likely belongs in `AppShell.tsx`.

**Sidebar** (`background: canvas-sidebar` oklch 0.16, `border-right: 1px solid subtle`, padding 24px, vertical stack gap 20px):

- Wordmark "Rehab Tracker" — Lora 600, 19px
- Primary button "Log Entry" — full-width, solid accent bg, `--color-accent-on` text, 700 weight, 14px, radius 12px, padding `11px 16px`
- Nav list, gap 4px: active item = `accent-soft` bg + `accent-soft-text` color, 600 weight, radius 10px, padding `9px 12px`; inactive = `ink-muted` (0.66) color, 500 weight, no background

**Main** (bg canvas 0.14, padding 24px):

- **Backup banner** (`BackupBanner.tsx`) — amber-tinted bar: bg `oklch(0.24 0.035 85)`, border `oklch(0.32 0.05 85)`, text `oklch(0.85 0.09 85)`, radius 12px, padding `10px 14px`, 13px. Contains message + underlined "Export now" inline link + dismiss "✕" at 0.7 opacity, space-between layout.
- Header row: `<h1>` "Your injuries" (Lora 600, 24px) + "New Injury" button (solid accent, radius 11px, padding `9px 15px`, 700/13px), space-between.
- Injury cards grid: 2 columns, gap 16px (already `lg:grid-cols-2 gap-5` in `InjuryCard.tsx` — tighten gap to match, 16–20px is fine either way).

**Injury card** (`InjuryCard.tsx`): bg surface, border subtle, radius 16px, padding 18px, column gap 14px.

- Row 1: title (16px/600) + status pill, space-between, align-start.
- Status pill: 11px/700, padding `3px 10px`, radius 999px. "Active" → pain-amber bg/text; "Monitoring" → accent-soft bg/text. (Confirm full status→color mapping with product; reference only shows these two.)
- Row 2: "Last pain **4/10** · 2h ago" in ink-muted 13px (the pain number is ink 0.9/600 weight) on the left; "+ Log" secondary button on the right (bg `oklch(0.24 0.012 60)`, border `oklch(0.32 0.012 60)`, radius 9px, padding `6px 12px`, 12px/600).

### 2. Injury Detail (`InjuryDetailPage.tsx`)

Same shell/sidebar as Dashboard (sidebar nav highlight moves to none active on this page in the reference — confirm whether Detail should highlight "Dashboard" as parent).

**Header block:** `<h1>` injury name (Lora 600, 24px) + status pill (top-aligned, `margin-top:4px` to optically align with baseline), space-between. Description paragraph below: `ink-secondary`, 14px, `max-width: 56ch`. Action row: "Log Entry for Injury" (primary) + "Edit" (secondary button style, same as "+ Log" above but radius 11px/padding `9px 15px`).

**Body grid:** `2fr 1fr` columns, gap 20px.

**Left column (`PainTrendChart.tsx` + `LogTimeline.tsx`), stacked with gap 20px:**

- _Pain trend card_: surface/border/radius16/padding18. Header row: "Pain over time" (14px/600, ink 0.85) + segmented range toggle (7d active = accent-soft pill; 30d/90d/All = plain `ink-muted 0.6` text, 12px/600, padding `5px 10px`, radius 999px, no bg when inactive).
  - Legend row below header: two dot+label pairs, 8px dots, 12px text ink-muted(0.66) — "Pain intensity" (accent-colored dot) and "Frequency" (pain-amber dot).
  - Chart: dual-line chart, accent line = pain intensity, pain-amber line = frequency, 3px stroke, rounded caps/joins, 5 faint horizontal gridlines (`oklch(0.25 0.01 60)`, 1px). Currently `recharts` — this styling (colors, gridline weight/color, no axis labels/ticks visible, 180px height) should map onto the existing `PainTrendChart` recharts config, not a new inline SVG.
- _History card_ (`LogTimeline.tsx`): "History" header 14px/600 ink-0.85. Each entry: bordered box (`1px solid oklch(0.26 0.01 60)`, radius 12px, padding `12px 14px`), gap 10px between entries.
  - Entry header row: timestamp (13px, ink-muted 0.6) left; right side stacks severity pill ("Moderate · 4/10" style — severity word + "·" + score, pain-color bg/text, 11px/600, padding `3px 9px`, radius 999px) and optionally a frequency pill (pain-green bg/text, "30% freq").
  - Optional remedy-tag row below (accent-soft pills, 11px/600) and a note line (13px, `oklch(0.78 0.01 60)`).
  - A entry can be collapsed to just the header row when it has no remedies/note (see 2nd history item in reference).

**Right column — Remedies card** (`RemedyList.tsx`), `align-self: start` so it doesn't stretch: surface/border/radius16/padding18. "Remedies" header 14px/600. Each remedy row: bordered box (`oklch(0.26 0.01 60)`, radius 10px, padding `9px 12px`), space-between — name 13px left, usage count "×N" 12px ink-muted(0.6) right, gap 8px between rows. Footer: full-width dashed-border "+ Add remedy" button (transparent bg, `accent-soft-text` color, dashed `oklch(0.34 0.012 60)` border, radius 10px, padding 9px, 13px/600).

### 3. Log Entry Modal (`LogModalContext` / modal component)

Overlay backdrop not shown explicitly in reference (implement as a standard dim/blur backdrop consistent with rest of app — dark surface, e.g. `oklch(0.11 0.006 60 / 0.7)`). Modal panel: max-width 480px, bg `surface-raised` (oklch 0.2), border `oklch(0.28 0.01 60)`, radius 18px, padding 22px, large soft shadow `0 30px 70px -20px rgba(0,0,0,.6)`.

- Header row: "Log entry" title (Lora 600, 18px) + "✕" close (ink-muted 0.6, 16px), space-between, margin-bottom 16px.
- "Injuries" multi-select chips (label 12px/600 ink-muted 0.6 above): selected chip = accent-soft bg/text + `1px solid accent` border; unselected = transparent bg, `ink-secondary` text, `1px solid oklch(0.3 0.012 60)` border. 12px/600 text, padding `5px 12px`, radius 999px, gap 8px, wraps.
- Per-injury detail block (repeats per selected injury): bordered box (`oklch(0.28 0.01 60)`, radius 14px, padding 14px), gap 14px between fields.
  - Injury name label, 14px/600.
  - **Slider rows** (Pain intensity, Frequency): label row (13px ink-muted 0.66 left, value ink-0.9/600 right) above a 6px-tall pill track (`oklch(0.28 0.012 60)` bg) with a filled portion (accent for pain, pain-amber for frequency) and a 16px circular thumb (3px border in the track's bg color, so it looks "cut out").
  - Remedy tag row at bottom of the block: same chip style as injury chips but smaller (12px, padding `4px 10px`).
- "When" field: read-only-looking input box — bg `oklch(0.17 0.009 60)`, border `oklch(0.3 0.012 60)`, radius 10px, padding `9px 12px`, 13px, ink-0.85 text (formatted like "Jul 9, 2026 · 8:12 AM").
- "Notes" field: same box style, placeholder text in ink-muted(0.5), `min-height: 52px` (multiline textarea).
- Footer actions, right-aligned, gap 8px: "Cancel" (transparent, `ink-secondary(0.75)`, no border, 13px/600) + "Save" (solid accent, radius 10px, padding `9px 18px`, 700/13px).

### 4. Settings (`SettingsPage.tsx`)

Same shell; sidebar "Settings" nav item is the active one.

- `<h1>` "Settings" (Lora 600, 24px), then two stacked cards, gap 20px.
- **Backup card**: surface/border/radius16/padding18, column gap 12px. Title "Backup" 15px/600, body copy 13px ink-muted(0.66), timestamp line 12px ink-muted(0.52, dimmer). Button row gap 10px: "Export data" (solid accent) + "Import data" (secondary bg `oklch(0.24 0.012 60)` / border `oklch(0.32 0.012 60)`, `white-space:nowrap`), both radius 10px, padding `9px 15px`, 13px.
- **Danger zone card**: same surface but border is red-tinted `oklch(0.35 0.05 25)` instead of neutral. Title "Danger zone" in pain-red text (0.72 0.15 25), 15px/600. Body 13px ink-muted(0.66). "Delete all data" button: solid pain-red-ish bg `oklch(0.3 0.08 25)`, text `oklch(0.94 0.02 25)`, radius 10px, padding `9px 15px`, 700/13px, `align-self: flex-start` (button doesn't stretch full width).

## Interactions & Behavior

- Backup banner dismiss (✕) should hide the banner (persist dismissal per existing app convention, e.g. localStorage — check current `BackupBanner.tsx` for existing dismiss logic before adding new state).
- Chart range toggle (7d/30d/90d/All) switches the active pill style and presumably filters `PainTrendChart` data — wire to existing data-fetch logic if range filtering doesn't exist yet; otherwise just match the pill styling to current active/inactive state.
- Log modal sliders are interactive drag controls (existing slider component, if any, should adopt this track/thumb styling — don't rebuild from scratch if one exists).
- Multi-select injury chips in the modal toggle selection state (add/remove that injury's detail block).
- No new page transitions/animations specified — keep existing ones.

## Assets

No images. One inline SVG line chart in the reference file is a static mockup only — the real chart is `recharts` (`PainTrendChart.tsx`); use the reference purely for color/stroke/gridline styling, not as markup to copy.

## Files

- `reference.html` — static rendered reference, all four screens, real (non-templated) colors/spacing. Open directly in a browser.
- Original editable design source (for the designer, not needed for implementation): `Rehab Tracker Redesign.dc.html` in the design project.

## Codebase Notes (for Claude Code)

Target repo: `injury-tracker/` — React 19 + Tailwind v4 (`@theme` tokens in `src/index.css`) + `react-router-dom` + `recharts` + `dexie` (local-only IndexedDB storage, hence the backup banner/export flow). Relevant existing files to edit rather than replace:

- `src/index.css` — theme tokens (mostly already correct; add missing ones called out above)
- `src/components/layout/AppShell.tsx`, `BackupBanner.tsx`
- `src/pages/DashboardPage.tsx`, `InjuryDetailPage.tsx`, `InjuryFormPage.tsx` (likely home of the log modal), `SettingsPage.tsx`
- `src/components/injuries/InjuryCard.tsx`, `InjuryStatusBadge.tsx`
- `src/components/charts/PainTrendChart.tsx`
- `src/components/logs/LogTimeline.tsx`
- `src/components/remedies/RemedyList.tsx`
- `src/components/ui/Button.tsx` (add/confirm `primary`/`secondary` variants match the styles above)
