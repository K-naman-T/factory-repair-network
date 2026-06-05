---
name: FixForge Product Dashboard
style: industrial B2B, clean, warm grey canvas, steel blue accent, amber urgency
colors:
  primary: "#1e3a5f"
  primary-hover: "#264d7a"
  primary-light: "#e8eef5"
  accent: "#d4782a"
  accent-hover: "#e8943a"
  accent-light: "#fdf0e3"
  background: "#f4f2ee"
  surface: "#f8f7f5"
  surface-raised: "#ffffff"
  border: "#d4d0ca"
  border-strong: "#b0aba5"
  text-primary: "#1a1a1a"
  text-secondary: "#4a4540"
  text-muted: "#8a8580"
  success: "#2d7d46"
  success-light: "#e8f5ec"
  error: "#c62828"
  error-light: "#f9e8e8"
  warning: "#d4782a"
  warning-light: "#fdf0e3"
  info: "#1e3a5f"
  info-light: "#e8eef5"
typography:
  heading: "Plus Jakarta Sans, system-ui, sans-serif"
  body: "Plus Jakarta Sans, system-ui, sans-serif"
  mono: "JetBrains Mono, ui-monospace, monospace"
  scale:
    h1: "1.75rem / 600"
    h2: "1.375rem / 600"
    h3: "1.125rem / 600"
    h4: "1rem / 600"
    body: "0.9375rem / 400"
    small: "0.8125rem / 400"
    label: "0.875rem / 500"
    caption: "0.75rem / 400"
spacing:
  base: "4px"
  scale: "4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96"
radius:
  button: "8px"
  card: "12px"
  input: "8px"
  badge: "9999px"
  dialog: "16px"
  avatar: "50%"
shadows:
  sm: "0 1px 2px rgba(0,0,0,0.04)"
  card: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)"
  dropdown: "0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.03)"
  modal: "0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.03)"
---

# FixForge Product Dashboard

## Visual direction

A dashboard for an industrial repair marketplace. The palette is warm and grounded — not a cold white SaaS. Page background is `#f4f2ee` (warm workshop grey), cards are `#ffffff`. Steel blue `#1e3a5f` carries all primary actions (post job, save, create). Amber `#d4782a` is the urgency accent — used for dispatch, accept, and critical statuses. The feel is professional, trustworthy, and engineered — like a well-organized factory control room.

## Layout

- Sidebar: 224px, white, 1px right border `#d4d0ca`
- Main content: `#f4f2ee` background, 24px padding
- Content max-width: 1440px
- Cards on warm grey background — white cards float on `#f4f2ee`
- Top bar: 56px, white, bottom border `#d4d0ca`
- Kanban columns: `#f8f7f5` background — rows of white job cards inside

## Components

### Buttons

```
Primary:   bg-[#1e3a5f] text-white px-4 py-2 rounded-[8px] text-[0.875rem] font-medium
           hover:bg-[#264d7a] transition-colors
           icon: 16px, inline-flex, gap-2
Accent:    bg-[#d4782a] text-white px-4 py-2 rounded-[8px] text-[0.875rem] font-medium
           hover:bg-[#e8943a] transition-colors
           Use for: Dispatch, Accept, Urgent — time-sensitive actions
Secondary: bg-white border border-[#d4d0ca] text-[#1a1a1a] px-4 py-2 rounded-[8px] text-[0.875rem]
           hover:bg-[#f8f7f5]
Ghost:     text-[#4a4540] hover:text-[#1a1a1a] hover:bg-[#f8f7f5] px-3 py-2 rounded-[8px]
Danger:    bg-[#c62828] text-white px-4 py-2 rounded-[8px] text-[0.875rem] font-medium
           hover:bg-[#a02020]
```

- Standard height: 40px (py-2 + text-[0.875rem])
- Small: 32px, Large: 48px
- Disabled: opacity-40 cursor-not-allowed
- Primary = trust, Accent = urgency. Use the right one.

### Cards

```
Base:    bg-white border border-[#d4d0ca] rounded-[12px] p-6
Elevated: bg-white border border-[#d4d0ca] rounded-[12px] p-8
         shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]
Surface: bg-[#f8f7f5] rounded-[12px] p-6 (no border — sits on page bg)
Stat:    bg-white border border-[#d4d0ca] rounded-[12px] p-6
         Metric value in text-[1.75rem] font-semibold
         Label in text-[0.875rem] text-[#4a4540]
```

- Standard padding: 24px
- Card header with bottom border `#d4d0ca`: 20px padding
- Empty state inside card: centered, 120px, muted text

### Forms and inputs

```
Input: bg-white border border-[#d4d0ca] rounded-[8px] px-3 py-2 text-[0.9375rem] text-[#1a1a1a]
       placeholder:text-[#8a8580]
       focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 outline-none transition
Select: Same as input, using native dropdown or shadcn Select
Label: text-[0.875rem] font-medium text-[#1a1a1a] mb-1.5 block
Help:  text-[0.8125rem] text-[#4a4540] mt-1
Error: text-[0.8125rem] text-[#c62828] mt-1
       + border-[#c62828] on the input
```

- Label always above input — never placeholder-only
- Required marker: red asterisk after label

### Tables

```
Wrapper:    bg-white border border-[#d4d0ca] rounded-[12px] overflow-hidden
Header row: bg-[#f8f7f5] border-b border-[#d4d0ca]
Header cell: text-[0.8125rem] font-medium text-[#8a8580] px-4 py-3 uppercase tracking-wider
Body row:   border-b border-[#d4d0ca] last:border-0 hover:bg-[#f8f7f5] transition-colors
Body cell:  text-[0.9375rem] text-[#1a1a1a] px-4 py-3
```

- Numeric columns: right-align
- Empty state: center, 120px height, "No jobs yet. Post your first repair job."

### Status badges

All use `rounded-[9999px] px-2.5 py-0.5 text-[0.75rem] font-medium`:

```
Open:        bg-[#e8eef5] text-[#1e3a5f]
Assigned:    bg-[#fdf0e3] text-[#d4782a]
In Progress: bg-[#fdf0e3] text-[#d4782a]  (darker shade for distinction)
Resolved:    bg-[#e8f5ec] text-[#2d7d46]
```

### Navigation sidebar

```
Section label: text-[0.75rem] font-semibold uppercase tracking-wider text-[#8a8580] px-3 py-2 mt-4
Nav item:     text-[0.8125rem] text-[#4a4540] flex items-center gap-3 px-3 py-2 rounded-[8px]
              hover:bg-[#f8f7f5] hover:text-[#1a1a1a] transition-colors
Nav active:   bg-[#e8eef5] text-[#1e3a5f] font-medium
```

### Kanban board

```
Column:      bg-[#f8f7f5] rounded-[12px] p-4 min-w-[280px]
Header:      flex items-center gap-2 mb-3 text-[0.8125rem] font-semibold
             Color dot: 10px circle
              Open=#1e3a5f / Assigned=#d4782a / In Progress=#d4782a / Resolved=#2d7d46
Card:        bg-white border border-[#d4d0ca] rounded-[8px] p-4 mb-3
```

### Dialogs

```
Wrapper:    bg-white rounded-[16px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08)]
            max-w-lg w-full p-8
Overlay:    bg-black/40 backdrop-blur-[4px]
Title:      text-[1.125rem] font-semibold text-[#1a1a1a] mb-2
Body:       text-[0.9375rem] text-[#4a4540] mb-6
Footer:     flex justify-end gap-3 pt-6 border-t border-[#d4d0ca]
```

## Spacing rules

- 8px between label and input
- 16px between form fields
- 24px between cards in a grid
- 24px between page sections
- 32px between major page sections
- 24px padding in main content area

## Do

- Use `#f4f2ee` page background with white cards — this is the signature
- Use steel blue `#1e3a5f` for trust actions (Create, Save, Post)
- Use amber `#d4782a` for urgency actions (Dispatch, Accept, Urgent)
- Keep status badges pill-shaped with light backgrounds
- Use `transition-colors` on all interactive elements
- Use the mono font for phone numbers, job IDs, timestamps

## Don't

- Don't use cold white `#ffffff` as page background — that's the card surface
- Don't mix steel blue and amber as equal CTAs on the same card
- Don't use gradient backgrounds on buttons or cards
- Don't make text smaller than 0.8125rem (13px)
- Don't use heavy shadows — card surface and borders carry depth
- Don't pill-round buttons — 8px radius for all buttons

## Agent instructions

This is the product dashboard DESIGN.md. Use it when generating dashboard pages (factory dashboard, technician dashboard, admin panel).

1. Always start with `#f4f2ee` page background + white cards — this is the foundational pattern
2. Steel blue for standard actions, amber for urgency actions — never the reverse
3. Status badges always use pill shape with light background + matching text color
4. Labels visible above inputs — no placeholder-only forms
5. Apply `transition-colors` to all clickable elements
6. Empty states follow icon + title + body + CTA pattern
7. Tables use uppercase tracking-wider headers in muted text
