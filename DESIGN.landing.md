---
name: FixForge Landing Page
style: industrial, bold, split-screen hero, photography-driven, amber accent, warm grey
colors:
  primary: "#1e3a5f"
  primary-hover: "#264d7a"
  primary-light: "#e8eef5"
  accent: "#d4782a"
  accent-hover: "#e8943a"
  accent-light: "#fdf0e3"
  background: "#f4f2ee"
  surface: "#ffffff"
  surface-muted: "#f8f7f5"
  surface-dark: "#141210"
  border: "#d4d0ca"
  text-primary: "#1a1a1a"
  text-secondary: "#4a4540"
  text-muted: "#8a8580"
  text-on-dark: "#e8e4de"
  text-muted-on-dark: "#9e9790"
  success: "#2d7d46"
  error: "#c62828"
  badge-severity: "#c62828"
typography:
  heading: "Plus Jakarta Sans, system-ui, sans-serif"
  body: "Plus Jakarta Sans, system-ui, sans-serif"
  mono: "JetBrains Mono, ui-monospace, monospace"
  scale:
    hero: "4rem / 700"        # 64px
    hero-mobile: "2.25rem / 700"
    section: "3rem / 700"     # 48px
    subsection: "2rem / 600"  # 32px
    card-title: "1.375rem / 600"
    body-lg: "1.125rem / 400"
    body: "0.9375rem / 400"
    small: "0.875rem / 400"
    eyebrow: "0.6875rem / 500"  # 11px, uppercase, 0.66em tracking
    button: "0.875rem / 500"
    button-lg: "1rem / 500"
spacing:
  base: "4px"
  scale: "4, 8, 12, 16, 24, 32, 40, 48, 64, 96, 120"
radius:
  button: "9999px"
  card: "12px"
  image: "16px"
  badge: "9999px"
shadows:
  sm: "0 1px 2px rgba(0,0,0,0.04)"
  card: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)"
  image: "0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)"
---

# FixForge Landing Page

## Visual direction

A B2B marketplace landing page for Indian factory owners and industrial technicians. The design is bold, trustworthy, and unpretentious — no startup clichés, no purple gradients, no "AI magic" language. Split-screen hero with photography on the right, text on the left. The palette is warm industrial: `#f4f2ee` background, `#1e3a5f` steel blue for trust, `#d4782a` amber for action. Photography is warm and industrial — factory floors, technicians at work, steel and concrete. The brand feels like it belongs in Jharkhand's industrial belt, not Silicon Valley.

## Layout pattern

- Split-screen hero: text left (50%), image right (50%) with gradient overlay
- Full-bleed sections with constrained content at 1280px max-width
- Section padding: 120px top/bottom (hero), 96px (features), 64px (stats)
- Bento grid for "How It Works" — 3 cards with images in background
- Marquee for feature cards — horizontal auto-scroll
- Floating stat card on hero image: amber badge with "78.5" severity score
- Dark footer section: `#141210` background with warm white text

## Sections

### Navbar
```
Fixed top, backdrop-blur, bg-[#f4f2ee]/80
Left: Wrench icon + "FixForge" in text-[1.25rem] font-bold text-[#1e3a5f]
Center: nav links — Features, How It Works, Stats — text-[0.875rem] text-[#4a4540]
Right: ThemeToggle + Login (ghost) + Get Started (bg-[#d4782a] text-white rounded-[8px] px-4 py-2 text-[0.8125rem])
Mobile: Sheet overlay with hamburger trigger
```

### Hero section
```
Split-screen layout
Left (50%): 
  - Eyebrow badge: rounded-full border border-[#d4782a]/30 bg-[#d4782a]/5 text-[0.6875rem] uppercase tracking-[0.15em] text-[#d4782a] px-4 py-1.5
  - Headline: "From Breakdown" + line break + "to Fix in Hours" in amber text[#d4782a]
             text-[4rem] font-bold tracking-[-2.56px] leading-[1.0]
  - Subhead: text-[1.125rem] text-[#4a4540] max-w-lg leading-[1.6]
  - CTAs: 
     - Pill button (bg-[#d4782a] text-white rounded-full px-8 py-3 text-[1rem] font-medium flex gap-2)
     - Outline pill button (border-2 border-[#b0aba5] text-[#1a1a1a] rounded-full px-8 py-3)
  - Trust badge: 4 stacked avatar circles + "200+ Technicians" text

Right (50%):
  - Image in aspect-[4/5] rounded-[16px] overflow-hidden border
  - Gradient overlay from bottom
  - Floating stat card: absolute bottom-4, backdrop-blur-xl, amber circle with "78.5"
```

### Problem section
```
Dark background section #141210 or similar
Headline: "The Problem" + eyebrow
Stat: "78.5 Severity Score" in large text
Pain points: 3 cards with icons — multi-day halts, no marketplace, small manufacturers suffer
```

### How it works
```
Bento grid — 3 columns
Each card: background image at 20% opacity + gradient overlay
Steps: Report, Match, Fix
Cards have colored gradients: violet → blue → emerald
```

### Features marquee
```
Auto-scrolling horizontal card strip
Cards: "5 Specialties", "Real-time Tracking", "Smart Matching", "Verified Technicians", "Instant Response", "5 Cities"
Each card: bg-white rounded-[12px] p-6 border border-[#d4d0ca]
Marquee uses MagicUI marquee component
```

### Stats section
```
4 stat cards row
Numbers use animated counter (MagicUI NumberTicker)
Stats: "500+" Factories, "200+" Technicians, "24hr" Response, "4.8★" Rating
```

### Testimonials
```
3 quote cards: bg-white rounded-[12px] p-8 border
Quote in text-[1.125rem] italic-like weight
Author: name + role below
```

### CTA section
```
Gradient or amber-tinted background
"Ready to eliminate production halts?" headline
"Get Started Free" pill button
```

### Footer
```
bg-[#141210] text-[#9e9790]
4-column nav: Product, Features, Company, Connect
Copyright row: "India's industrial repair network"
```

## Components

### Buttons

```
Primary pill:   bg-[#d4782a] text-white rounded-full px-8 py-3 text-[1rem] font-medium
                hover:bg-[#e8943a] transition-all active:scale-[0.98]
Secondary pill: bg-white text-[#1a1a1a] border-2 border-[#b0aba5] rounded-full px-8 py-3
                hover:border-[#4a4540] transition-all
                (Used in hero as "I'm a Technician")
Outline btn:    bg-white border border-[#d4d0ca] text-[#1a1a1a] rounded-[8px] px-4 py-2
                hover:bg-[#f8f7f5] transition-colors
                (Used inside dashboard CTAs on landing page)
```

### Cards

```
Feature card: bg-white border border-[#d4d0ca] rounded-[12px] p-8
              shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]
Testimonial:  bg-white border border-[#d4d0ca] rounded-[12px] p-8
Marquee card: bg-white border border-[#d4d0ca] rounded-[12px] p-6
              min-w-[260px]
```

### Images

```
Hero image:   aspect-[4/5] rounded-[16px], gradient overlay from bottom, floating stat card
Tech images:  Used as background in bento cards at 20% opacity + gradient overlay
Profile pics: rounded-full, 40px, border-2 border-white (stacked negative margin)
```

### Badges

```
Eyebrow:      rounded-full border px-4 py-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.15em]
Severity:     bg-[#d4782a] text-white h-12 w-12 rounded-full flex items-center justify-center
              text-[1.25rem] font-bold
Status dot:   h-2 w-2 rounded-full bg-green-500 animate-pulse
```

## Motion guidelines

- Entry animations: BlurFade — translate-y-8 opacity-0 to translate-y-0 opacity-100 over 600ms
- Stagger delays: 100ms between adjacent elements
- CTAs: active:scale-[0.98] on click — physical press feedback
- Marquee: continuous horizontal scroll using MagicUI marquee
- Number ticker: count up on viewport entry using MagicUI number-ticker
- Shimmer: subtle light sweep on primary CTAs using MagicUI shimmer-button

## Spacing rules

- Section padding: 120px (hero), 96px (feature bands), 64px (stats)
- Between cards in grid: 24px
- Card interior padding: 32px (feature), 24px (marquee), 32px (testimonial)
- Between headline and body: 24px
- Between body and CTA: 32px

## Do

- Use split-screen hero with image right — not centered
- Use amber `#d4782a` as the primary CTA on the landing page — amber signals action
- Use real industrial photography — not abstract illustrations
- Keep photography warm-toned to match the palette
- Use pill-shaped buttons for marketing CTAs, 8px radius for dashboard CTAs
- Use BlurFade entry animations for all sections
- End every major section with a CTA

## Don't

- Don't use centered hero — split-screen is the brand's landing signature
- Don't use purple or blue gradient CTAs — amber is the action color
- Don't use generic stock photos of smiling office workers — use real industrial imagery
- Don't put more than 2 CTAs in a single section
- Don't use heavy drop shadows on photography
- Don't use startup cliché language ("elevate", "seamless", "next-gen")
- Don't make the hero text smaller than 4rem on desktop

## Agent instructions

This is the landing/marketing page DESIGN.md. Use it ONLY for landing page sections (hero, features, how it works, stats, testimonials, CTA, footer).

1. Split-screen hero is non-negotiable — text left, image right
2. Amber `#d4782a` carries all CTAs on the landing page — not steel blue
3. Use real industrial photography from public/images/ directory
4. All entry animations use BlurFade with staggered delays
5. Buttons are pill-shaped (rounded-full) on landing, 8px radius in product
6. Section padding is generous: 96–120px between sections
7. Eyebrow badges use uppercase + tracking at 0.6875rem
