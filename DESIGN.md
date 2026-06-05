# FixForge Design System

## Brand Identity

FixForge is an industrial repair marketplace. The design language reflects:
- **Strength** — steel, concrete, heavy machinery
- **Urgency** — amber warning lights, high-visibility safety equipment  
- **Trust** — established industrial brands, no-nonsense reliability
- **Precision** — engineering-grade accuracy in every detail

## Design Variance Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| DESIGN_VARIANCE | 6 | Asymmetric layouts, split-screen heroes, offset grids |
| MOTION_INTENSITY | 5 | Spring physics, scroll-triggered reveals, perpetual micro-interactions |
| VISUAL_DENSITY | 5 | Generous whitespace, data breathes, cards used for hierarchy |

## Color Palette

### Light Mode
```
--background: #f4f2ee       (warm industrial grey)
--foreground: #1a1a1a       (off-black, not pure #000)
--card: #ffffff              (pure white for cards)
--card-foreground: #1a1a1a
--primary: #1e3a5f          (deep steel blue)
--primary-foreground: #ffffff
--secondary: #d4782a        (amber/orange - warning light accent)
--secondary-foreground: #ffffff
--accent: #e8e4de           (warm stone grey)
--accent-foreground: #1a1a1a
--destructive: #c62828      (safety red)
--muted: #e8e4de
--muted-foreground: #6b6560
--border: #d4d0ca           (warm grey border)
--ring: #d4782a             (amber focus ring)
--radius: 0.625rem          (10px - industrial, not overly rounded)
```

### Dark Mode
```
--background: #141210       (deep warm black)
--foreground: #e8e4de       (warm off-white)
--card: #1e1c1a
--primary: #3a6b9f          (lighter steel blue)
--secondary: #e8943a        (brighter amber)
--accent: #2a2825
--muted: #2a2825
--muted-foreground: #9e9790
--border: #3a3835
```

## Typography

### Font Stack
- **Headings:** Geist (already loaded via next.js)
- **Body:** Geist
- **Monospace:** Geist Mono (for any code/technical data)

### Type Scale
```
h1: text-5xl md:text-7xl tracking-tighter leading-none font-bold
h2: text-3xl md:text-5xl tracking-tight leading-tight font-bold  
h3: text-2xl md:text-3xl tracking-tight leading-snug font-semibold
h4: text-xl md:text-2xl tracking-tight font-semibold
body: text-base leading-relaxed
small: text-sm leading-relaxed text-muted-foreground
label: text-sm font-medium uppercase tracking-wider
```

### Eyebrow Tags
All major sections get an eyebrow badge:
```
rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em]
```

## Spacing & Layout

### Section Rhythm
- Section padding: `py-20 md:py-32`
- Container max-width: `max-w-7xl mx-auto`
- Content max-width: `max-w-4xl mx-auto`
- Card padding: `p-6 md:p-8`
- Grid gaps: `gap-6 md:gap-8`

### Layout Patterns
1. **Split Hero:** Left-aligned text (50%), right-aligned image/visual (50%) with gradient overlay
2. **Bento Grid:** Asymmetric card sizes using CSS grid (`col-span-2`, `row-span-2`)
3. **Edge-to-Edge:** Full-width sections with constrained content inside
4. **Kanban Board:** Horizontal scroll with sticky columns

## Components

### Cards
```
------ Outer Shell ------
<div className="relative overflow-hidden rounded-xl border bg-card shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
  ------ Inner Highlight ------
  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
  ------ Content ------
  <div className="p-6 md:p-8">
    ...
  </div>
</div>
```

### Buttons
```
Primary:   bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]
Secondary: bg-secondary text-secondary-foreground hover:bg-secondary/90 active:scale-[0.98]
Outline:   border-2 border-primary/30 text-foreground hover:bg-primary/5 active:scale-[0.98]
Ghost:     hover:bg-accent active:scale-[0.98]
Destructive: bg-destructive text-destructive-foreground hover:bg-destructive/90
```

### Badges
```
Status badges:
  open:        bg-blue-500/10 text-blue-600 border-blue-200
  assigned:    bg-amber-500/10 text-amber-600 border-amber-200
  in_progress: bg-orange-500/10 text-orange-600 border-orange-200
  resolved:    bg-emerald-500/10 text-emerald-600 border-emerald-200

Specialty badges:
  pill: rounded-full px-3 py-0.5 text-xs font-medium
```

### Dialog/Modal
```
Content:    rounded-xl max-w-lg
Overlay:    bg-black/40 backdrop-blur-sm
Padding:    p-6
Footer:     border-t bg-muted/30 p-4 flex justify-end gap-3
```

### Forms
```
Label:      text-sm font-medium mb-1.5 block
Input:      rounded-lg border bg-background px-3 py-2 text-sm
           focus:ring-2 focus:ring-ring focus:border-ring
Error:      text-xs text-destructive mt-1
Helper:     text-xs text-muted-foreground mt-1
```

## Navigation

### Sidebar (Desktop)
- Width: `w-56`
- Background: `bg-card` with right border
- Active item: `bg-primary/10 text-primary`
- Hover: `hover:bg-muted hover:text-foreground`

### Top Bar
- Height: `h-14`
- Background: `bg-card` with bottom border

### Mobile Nav
- Sheet from left (admin/dashboard) or right (landing)
- Trigger: hamburger icon (3 lines → X on open)
- Backdrop: `bg-black/40 backdrop-blur-sm`

## Motion Guidelines

### Spring Physics
```css
/* Premium transitions */
transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);

/* Hover zoom on cards */
transform: scale(1.02);
transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);

/* Active press on buttons */
active:scale-[0.98]
transition: transform 0.1s ease-out;
```

### Entry Animations
- Cards fade up from `translate-y-8 opacity-0` to `translate-y-0 opacity-100`
- Stagger delay: 100ms between items
- Duration: 600ms with custom easing

### Perpetual Micro-Interactions
- Status dots: gentle pulse animation
- Number tickers: count up on viewport entry
- Marquee: infinite horizontal scroll for features
- Shimmer: subtle light sweep on primary CTAs

## Responsive Breakpoints
```
sm:  640px   (mobile landscape)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px  (wide desktop)
2xl: 1536px  (ultrawide)
```

## Dark Mode Toggle
- Sun icon in light mode, Moon icon in dark mode
- Smooth transition via `next-themes`
- Icons animate with rotation: `rotate-0 scale-100 dark:-rotate-90 dark:scale-0`
