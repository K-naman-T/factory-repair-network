---
version: alpha
name: FixForge-design-system
description: An industrial repair marketplace connecting factory owners with qualified technicians across Jharkhand's manufacturing belt. The system blends a warm, industrial-neutral palette (steel blue, amber warning-light accent, warm grey canvas) with strict B2B SaaS hierarchy. Typography runs on Geist (geometric sans) with aggressive negative tracking on display and a monospaced face for technical labels. Cards sit on a warm-grey canvas with steel-blue elevation and amber accent — evoking the visual language of a factory control room rather than a consumer marketplace.

colors:
  primary: "#1e3a5f"
  on-primary: "#ffffff"
  primary-hover: "#264d7a"
  primary-soft: "#e8eef5"
  accent: "#d4782a"
  on-accent: "#ffffff"
  accent-soft: "#fdf0e3"
  accent-hover: "#e8943a"
  ink: "#1a1a1a"
  body: "#4a4540"
  mute: "#8a8580"
  hairline: "#d4d0ca"
  hairline-strong: "#b0aba5"
  canvas: "#f4f2ee"
  canvas-soft: "#faf9f7"
  surface-1: "#ffffff"
  surface-2: "#f8f7f5"
  surface-3: "#f0eeeb"
  canvas-dark: "#141210"
  surface-dark-1: "#1e1c1a"
  surface-dark-2: "#2a2825"
  hairline-dark: "#3a3835"
  ink-dark: "#e8e4de"
  body-dark: "#9e9790"
  mute-dark: "#6b6560"
  accent-on-dark: "#e8943a"
  primary-on-dark: "#3a6b9f"
  success: "#2d7d46"
  success-soft: "#e8f5ec"
  warning: "#d4782a"
  warning-soft: "#fdf0e3"
  error: "#c62828"
  error-soft: "#f9e8e8"
  info: "#1e3a5f"
  info-soft: "#e8eef5"
  selection-bg: "#1e3a5f"
  selection-fg: "#ffffff"

typography:
  display-xl:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -2.56px
  display-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -1.92px
  display-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -1.08px
  display-sm:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.84px
  headline:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.44px
  body-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.09px
  body-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  button:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  button-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  caption:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0
  eyebrow:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.66px
  mono:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, monospace
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  pill: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 40px
  3xl: 48px
  4xl: 64px
  5xl: 96px
  section: 120px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    hover: "{colors.primary-hover}"
  button-primary-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    hover: "{colors.accent-hover}"
  button-primary-lg:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    borderColor: "{colors.hairline}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  button-pill:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 10px 24px
  button-pill-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.pill}"
    padding: 12px 28px
  button-pill-outline:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 10px 24px
    borderColor: "{colors.hairline-strong}"
  nav-link:
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xs} {spacing.sm}"
    rounded: "{rounded.md}"
  nav-cta:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "6px 14px"
  card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    borderColor: "{colors.hairline}"
  card-elevated:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    borderColor: "{colors.hairline}"
    shadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)"
  card-soft:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  stat-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    borderColor: "{colors.hairline}"
  kanban-column:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  form-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: 40px
  form-select:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: 40px
  badge-status:
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  badge-open:
    backgroundColor: "{colors.info-soft}"
    textColor: "{colors.info}"
  badge-assigned:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
  badge-in-progress:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
  badge-resolved:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
  sidebar:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    width: 224px
    borderColor: "{colors.hairline}"
  sidebar-active:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  top-bar:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    height: 56px
    borderColor: "{colors.hairline}"
  dialog:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  dialog-overlay:
    backgroundColor: "rgba(0,0,0,0.4)"
    backdropBlur: "4px"
  table-header:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.mute}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xs} {spacing.md}"
  table-cell:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: "{spacing.sm} {spacing.md}"
    borderColor: "{colors.hairline}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.section} 0"
  feature-band:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "{spacing.5xl} 0"
  band-muted:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    padding: "{spacing.5xl} 0"
  footer:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.body-dark}"
    typography: "{typography.body-sm}"
    padding: "{spacing.4xl} 0"

---

## Overview

FixForge is an industrial B2B marketplace — a two-sided platform connecting factory owners with qualified repair technicians. The design language bridges two worlds: the trust and warmth needed for Indian factory owners (the "relationship" side) with the precision and efficiency expected by technicians and operators (the "dashboard" side).

The canvas sits on a warm industrial grey (`{colors.canvas}` #f4f2ee) rather than a cold white or pure black — evoking the concrete floors and steel surfaces of a factory floor. The primary palette is a deep steel blue (`{colors.primary}` #1e3a5f) that conveys institutional trust (like a well-worn engineering uniform). The accent is an amber-orange (`{colors.accent}` #d4782a) inspired by warning lights, safety equipment, and the glow of a furnace — it's the color of "pay attention" in industrial contexts.

Typography is Geist (a geometric sans) for everything narrative — display, body, button, label. Geist Mono carries technical labels: IDs, status codes, technician names. Display sizes track aggressively negative (`-2.56px` at 64px), giving the headlines weight without shouting.

The card system uses a structured surface ladder — `{colors.surface-1}` (white) for cards, `{colors.surface-2}` (warm off-white) for page sections and kanban columns, `{colors.surface-3}` (deeper warm) for hover states. Depth is carried by surface color and hairline borders, not heavy shadows — the system feels more like a well-organized workshop than a material-design dashboard.

**Key Characteristics:**
- **Warm industrial canvas** (`{colors.canvas}` #f4f2ee) — not cold white, not trendy dark. Concrete-grey familiarity.
- **Steel blue primary** (`{colors.primary}` #1e3a5f) — institutional trust. Paired with **amber accent** (`{colors.accent}` #d4782a) — urgency and visibility.
- **Status badges with semantic colors** — open (blue), assigned (amber), in-progress (orange), resolved (green). Each maps to a real-world factory floor state.
- **Two CTA modes** — steel blue for primary actions (Post a Job, Save), amber accent for urgency CTAs (Dispatch Now, Accept Job).
- **Negative tracking on display** (`-2.56px` at 64px) — engineering precision in typography.
- **Surface ladder** (1→2→3) replaces heavy shadow hierarchy. Cards sit on the page, not float above it.
- **Mobile-first responsive** — all dashboard layouts collapse to single-column below 768px.

## Colors

### Brand & Accent
- **Steel Blue** (`{colors.primary}` — `#1e3a5f`): The primary CTA color. Conveys institutional trust — like a Tata Steel uniform or a well-maintained machine. Used for "Post a Repair Job", "Save", "Create", and all primary navigation indicators.
- **Steel Blue Hover** (`{colors.primary-hover}` — `#264d7a`): Lifted blue for hovered states. Maintains trustworthiness at the hover moment.
- **Steel Blue Soft** (`{colors.primary-soft}` — `#e8eef5`): Background tint for active sidebar items, informational banners, and "info" status backgrounds.
- **Amber** (`{colors.accent}` — `#d4782a`): The "action" accent — inspired by factory warning lights. Used for "Dispatch Now", "Accept Job", "Urgent" badges, and the landing-page hero CTA. Amber signals "something needs your attention now."
- **Amber Hover** (`{colors.accent-hover}` — `#e8943a`): Brighter amber for hovered urgency CTAs.
- **Amber Soft** (`{colors.accent-soft}` — `#fdf0e3`): Background tint for amber badges and in-progress states.

### Surface (Light)
- **Canvas** (`{colors.canvas}` — `#f4f2ee`): The default page background — a warm industrial grey that reads as familiar and grounded. Not cold white, not trendy dark.
- **Canvas Soft** (`{colors.canvas-soft}` — `#faf9f7`): A whisper-lighter variant for muted bands and secondary content areas.
- **Surface 1** (`{colors.surface-1}` — `#ffffff`): Pure white — cards, dialogs, sidebar panels. The "elevated" surface.
- **Surface 2** (`{colors.surface-2}` — `#f8f7f5`): Off-white for kanban columns, section backgrounds, table headers.
- **Surface 3** (`{colors.surface-3}` — `#f0eeeb`): Deeper tint for hover states and nested surfaces.
- **Hairline** (`{colors.hairline}` — `#d4d0ca`): 1px borders — card outlines, table rows, dividers.
- **Hairline Strong** (`{colors.hairline-strong}` — `#b0aba5`): Stronger border for emphasis (pricing cards, featured CTAs).

### Surface (Dark)
- **Canvas Dark** (`{colors.canvas-dark}` — `#141210`): The dark-mode background — a warm deep charcoal (not pure black).
- **Surface Dark 1** (`{colors.surface-dark-1}` — `#1e1c1a`): Cards and panels in dark mode.
- **Surface Dark 2** (`{colors.surface-dark-2}` — `#2a2825`): Lifted surfaces in dark mode.
- **Hairline Dark** (`{colors.hairline-dark}` — `#3a3835`): Borders in dark mode.
- **Accent on Dark** (`{colors.accent-on-dark}` — `#e8943a`): Brighter amber for dark-mode CTAs.
- **Primary on Dark** (`{colors.primary-on-dark}` — `#3a6b9f`): Lighter steel blue for dark-mode CTAs.

### Text (Light)
- **Ink** (`{colors.ink}` — `#1a1a1a`): Headlines and primary body — off-black, not pure `#000`.
- **Body** (`{colors.body}` — `#4a4540`): Secondary text — card descriptions, metadata.
- **Mute** (`{colors.mute}` — `#8a8580`): Low-priority text — placeholder, captions.

### Text (Dark)
- **Ink Dark** (`{colors.ink-dark}` — `#e8e4de`): Primary text on dark canvas — warm off-white.
- **Body Dark** (`{colors.body-dark}` — `#9e9790`): Secondary text on dark canvas.
- **Mute Dark** (`{colors.mute-dark}` — `#6b6560`): Low-priority text on dark canvas.

### Semantic
- **Success Green** (`{colors.success}` — `#2d7d46`): Resolved status, successful actions.
- **Success Soft** (`{colors.success-soft}` — `#e8f5ec`): Background tint for success badges.
- **Warning** (`{colors.warning}` — `#d4782a`): "Assigned" status, medium urgency.
- **Warning Soft** (`{colors.warning-soft}` — `#fdf0e3`): Background for warning badges.
- **Error** (`{colors.error}` — `#c62828`): Destructive actions, urgent status.
- **Error Soft** (`{colors.error-soft}` — `#f9e8e8`): Background for error badges.
- **Info** (`{colors.info}` — `#1e3a5f`): "Open" status, informational cues.
- **Info Soft** (`{colors.info-soft}` — `#e8eef5`): Background for info badges.

## Typography

### Font Family

Two Geist variants carry the system:

1. **Geist** (geometric sans) — every display, body, button, link, and label. Weights 400 / 500 / 600 / 700. Display sizes use aggressive negative letter-spacing; body holds at neutral or slightly-negative tracking.
2. **Geist Mono** — IDs, status codes, phone numbers, timestamps, and any technical label. Weight 400 at 13px. Tracking neutral.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 700 | 1.0 | -2.56px | Hero headline |
| `{typography.display-lg}` | 48px | 700 | 1.05 | -1.92px | Section opener headline |
| `{typography.display-md}` | 36px | 600 | 1.1 | -1.08px | Feature section headline |
| `{typography.display-sm}` | 28px | 600 | 1.15 | -0.84px | Dashboard section heading |
| `{typography.headline}` | 22px | 600 | 1.2 | -0.44px | Card title, dialog title |
| `{typography.body-lg}` | 18px | 400 | 1.6 | -0.09px | Hero subhead, lead |
| `{typography.body-md}` | 15px | 400 | 1.5 | 0 | Default body, table cells |
| `{typography.body-sm}` | 13px | 400 | 1.4 | 0 | Metadata, nav links |
| `{typography.button}` | 14px | 500 | 1.2 | 0 | All button labels |
| `{typography.button-lg}` | 16px | 500 | 1.2 | 0 | Larger CTAs |
| `{typography.caption}` | 12px | 400 | 1.3 | 0 | Status labels, timestamps |
| `{typography.eyebrow}` | 11px | 500 | 1.2 | 0.66px | Section eyebrows |
| `{typography.mono}` | 13px | 400 | 1.5 | 0 | Phone numbers, IDs, codes |

### Principles
- **Negative tracking on display** — the wider the size, the tighter the tracking. This gives headlines an engineered precision.
- **Sentence-case headlines** — no all-caps outside of badges and labels.
- **Mono for technical labels only** — phone numbers, job IDs, technician codes, timestamps.
- **Weight 700 is the ceiling** — reserved for hero and section openers. Dashboard headers sit at 600.

## Layout

### Spacing System
- **Base unit**: 4px. Every captured value is a multiple of 4.
- **Tokens**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 40px · `{spacing.3xl}` 48px · `{spacing.4xl}` 64px · `{spacing.5xl}` 96px · `{spacing.section}` 120px.
- **Section padding**: marketing bands use `{spacing.5xl}` to `{spacing.section}`. Dashboard sections use `{spacing.lg}` to `{spacing.xl}` between components.
- **Card interior**: `{spacing.lg}` 24px for standard cards, `{spacing.xl}` 32px for elevated/feature cards.
- **Grid gaps**: `{spacing.lg}` 24px between cards, `{spacing.md}` 16px for dense data grids.

### Grid & Container
- **Max width**: 1280px for marketing pages (landing), 1440px for dashboard pages. Content centers with gutters of `{spacing.lg}` 24px.
- **Dashboard layout**: fixed sidebar (224px) + flexible content area. Sidebar hidden on mobile.
- **Column patterns**:
  - Feature grid: 3-up at desktop, 1-up at mobile.
  - Stat cards: 4-up at desktop, 2-up at tablet, 1-up at mobile.
  - Kanban: 4-column horizontal scroll.
  - Table: full-width with horizontal scroll on mobile.

### Whitespace Philosophy
The warm grey canvas IS the whitespace — sections don't need heavy shadows to separate because the canvas color shifts slightly. Marketing sections use generous `{spacing.5xl}` padding. Dashboard sections are tighter (`{spacing.lg}` between components) to keep data density high.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No shadow, no border | Page canvas, full-bleed sections |
| 1 — Hairline | 1px `{colors.hairline}` border, no shadow | Standard cards, form inputs |
| 2 — Soft Elevate | 1px `{colors.hairline}` border, `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)` | Elevated cards, dialogs, dropdowns |
| 3 — Surface Lift | `{colors.surface-2}` background on `{colors.canvas}` | Kanban columns, table headers, muted sections |
| 4 — Focus | 2px `{colors.accent}` ring | Focused inputs, active elements |

The system uses surface color + hairline borders for depth, not heavy shadows. Cards never float aggressively — they sit on the page like physical index cards on a workshop bench.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed sections, footer |
| `{rounded.xs}` | 4px | Inputs, small chips |
| `{rounded.sm}` | 6px | Buttons, badges, toggles |
| `{rounded.md}` | 8px | Default card radius |
| `{rounded.lg}` | 12px | Feature cards, dialogs, elevated cards |
| `{rounded.xl}` | 16px | Larger modal dialogs |
| `{rounded.xxl}` | 24px | Hero panels, CTA banners |
| `{rounded.pill}` | 9999px | Status badges, pricing toggles |

### Photography Geometry
- **Industrial photography**: full-bleed or contained in `{rounded.lg}` 12px panels with a stacked shadow. Photographs are desaturated slightly to blend with the warm canvas.
- **Hero image**: split-screen or floating `{rounded.xl}` card with gradient overlay.
- **Avatar circles**: `{rounded.pill}` at 32–40px for user thumbnails.
- **Technician photos**: `{rounded.full}` inside cards.

## Components

### Buttons

**`button-primary`** — Steel blue default CTA. Trustworthy, primary action.
- Background `{colors.primary}`, text `{colors.on-primary}`, label `{typography.button}`, padding 8px 16px, shape `{rounded.md}` 8px. Hover shifts to `{colors.primary-hover}`.

**`button-primary-accent`** — Amber urgency CTA. For dispatch, accept, and time-sensitive actions.
- Background `{colors.accent}`, text `{colors.on-accent}`, same spec as `button-primary`. Hover shifts to `{colors.accent-hover}`.

**`button-primary-lg`** — Larger steel blue CTA for dashboard hero actions ("Post New Job").
- Same spec as `button-primary` but `{typography.button-lg}` 16px, padding 12px 24px.

**`button-secondary`** — Outline button for secondary actions.
- Background `{colors.surface-1}`, text `{colors.ink}`, 1px `{colors.hairline}` border. Same shape + padding.

**`button-ghost`** — Minimal ghost button.
- Transparent background, text `{colors.body}`, same shape + padding.

**`button-pill`** — Pill-shaped primary button for marketing CTAs.
- Background `{colors.primary}`, text `{colors.on-primary}`, `{typography.button}`, `{rounded.pill}`, padding 10px 24px.

**`button-pill-accent`** — Pill-shaped amber CTA for marketing hero.
- Background `{colors.accent}`, text `{colors.on-accent}`, `{typography.button-lg}`, `{rounded.pill}`, padding 12px 28px.

**`button-pill-outline`** — Ghost pill for secondary marketing CTAs.
- Transparent, text `{colors.ink}`, 1px `{colors.hairline-strong}` border, `{rounded.pill}`, padding 10px 24px.

### Cards & Containers

**`card`** — Standard card for dashboards and feature grids.
- Background `{colors.surface-1}`, 1px `{colors.hairline}` border, `{rounded.lg}` 12px, padding `{spacing.lg}` 24px.

**`card-elevated`** — Elevated feature card for landing page.
- Same as `card` but padding `{spacing.xl}` 32px, shadow `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)`.

**`card-soft`** — Muted card on tinted surfaces.
- Background `{colors.surface-2}`, no border, `{rounded.lg}`.

**`stat-card`** — Dashboard metric card.
- Background `{colors.surface-1}`, 1px `{colors.hairline}` border, `{rounded.lg}`, padding `{spacing.lg}`. Metric value in `{typography.headline}`.

**`kanban-column`** — Kanban board column.
- Background `{colors.surface-2}`, `{rounded.lg}`, padding `{spacing.md}`. Jobs inside use `card` spec.

### Status Badges

**`badge-status`** — All status badges share this spec: `{typography.caption}`, `{rounded.pill}`, padding 2px 10px.
- **`badge-open`**: background `{colors.info-soft}`, text `{colors.info}`
- **`badge-assigned`**: background `{colors.warning-soft}`, text `{colors.warning}`
- **`badge-in-progress`**: background `{colors.accent-soft}`, text `{colors.accent}`
- **`badge-resolved`**: background `{colors.success-soft}`, text `{colors.success}`

### Forms & Inputs

**`form-input`** — Standard text input.
- Background `{colors.surface-1}`, text `{colors.ink}`, 1px `{colors.hairline}` border, `{typography.body-md}`, rounded `{rounded.md}`, padding 8px 12px, height 40px.

**`form-select`** — Dropdown select, same spec as input.

### Navigation

**`sidebar`** — Fixed dashboard sidebar.
- Background `{colors.surface-1}`, right border `{colors.hairline}`, width 224px, text `{typography.body-sm}`. Active item uses `sidebar-active` spec: background `{colors.primary-soft}`, text `{colors.primary}`.

**`top-bar`** — Dashboard top bar.
- Background `{colors.surface-1}`, bottom border `{colors.hairline}`, height 56px.

**`nav-link`** — Landing page nav link.
- Text `{colors.body}`, `{typography.body-sm}`, padding `{spacing.xs} {spacing.sm}`, `{rounded.md}`. Hover shifts to `{colors.primary}` text.

**`nav-cta`** — Nav "Get Started" button.
- Background `{colors.accent}`, text `{colors.on-accent}`, `{typography.body-sm}`, `{rounded.md}`, padding 6px 14px.

### Dialogs

**`dialog`** — Modal dialog.
- Background `{colors.surface-1}`, `{rounded.xl}` 16px, padding `{spacing.xl}` 32px. Overlay uses `dialog-overlay`: `rgba(0,0,0,0.4)` with `backdropBlur: 4px`.

### Tables

**`table-header`** — Table header cell.
- Background `{colors.surface-2}`, text `{colors.mute}`, `{typography.body-sm}`, padding `{spacing.xs} {spacing.md}`.

**`table-cell`** — Table body cell.
- Background `{colors.surface-1}`, text `{colors.body}`, `{typography.body-sm}`, padding `{spacing.sm} {spacing.md}`, bottom border `{colors.hairline}`.

### Marketing Sections

**`hero-band`** — Landing page hero.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.section}` top/bottom. Content is split-screen (text left, image right).

**`feature-band`** — Feature section.
- Background `{colors.surface-2}`, padding `{spacing.5xl}` top/bottom.

**`band-muted`** — Muted content section.
- Background `{colors.canvas-soft}`, padding `{spacing.5xl}`.

**`footer`** — Site footer.
- Background `{colors.canvas-dark}`, text `{colors.body-dark}`, padding `{spacing.4xl}`.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop | ≥ 1024px | Full sidebar + content layout |
| Tablet | 768–1023px | Sidebar collapses to icons; card grid 3→2 |
| Mobile | < 768px | Single column, hamburger nav, stacked stats |

### Touch Targets
- All buttons meet ≥ 40px tap height.
- Form inputs hold ≥ 44px tap target.
- Status badges inflate to ≥ 32px touchable area on mobile.

### Collapsing Strategy
- **Sidebar nav**: fixed 224px at desktop → icon-only at tablet → Sheet overlay on mobile.
- **Card grids**: 3-up → 2-up → 1-up.
- **Kanban**: 4-column → horizontal scroll with sticky first column.
- **Tables**: horizontal scroll with sticky first column.
- **Display type**: `{typography.display-xl}` 64px scales to 36px on mobile.

## Do's and Don'ts

### Do
- Use `{colors.primary}` steel blue for trust-based actions (post, save, create).
- Use `{colors.accent}` amber for urgency-based actions (dispatch, accept, urgent).
- Keep the warm industrial canvas (`{colors.canvas}` #f4f2ee) as the default page background — it's the system's anchor.
- Reserve `{colors.surface-1}` white for cards and white-on-white for elevated surfaces.
- Use the four status badge colors (blue → amber → orange → green) consistently for job lifecycle states.
- Apply negative tracking on display sizes — it's part of the brand's engineered voice.
- Place photography inside `{rounded.lg}` panels with a split-screen or floating-card hero pattern.

### Don't
- Don't introduce a third accent color — steel blue + amber is the full palette.
- Don't use cold white (`#ffffff`) as the page background — that's what `{colors.surface-1}` is for.
- Don't render headlines in all-caps — sentence-case with negative tracking is the voice.
- Don't use heavy drop shadows on cards — surface ladder + hairline borders carry hierarchy.
- Don't pill-round dashboard CTAs — 8px `{rounded.md}` is the dashboard radius; pills are for marketing and status badges.
- Don't use the mono face for body copy — reserve it for technical labels.
- Don't combine the amber accent and the steel blue primary as equal-weight CTAs on the same card — pick one hierarchy.
- Don't add atmospheric gradients or spotlight effects — the design is grounded in industrial honesty.
