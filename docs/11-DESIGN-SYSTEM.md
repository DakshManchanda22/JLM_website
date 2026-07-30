# 11 · Design System

Typography, colour, spacing, and the signature layout patterns — extracted from the actual code, not invented. Note: `tailwind.config.ts` has an **empty theme** (no custom tokens), so design values live inline in components. Treat this doc as the reference for keeping them consistent.

`Last updated: 2026-07-30`
`Maintainer:` TODO(verify)

---

## Typography

Fonts are loaded **per component** via `next/font` — there is no global font set in the layout, and `tailwind.config.ts` doesn't extend `fontFamily`. So the utility classes `font-serif`/`font-sans` resolve to **Tailwind's default stacks**, and specific fonts are applied via a `next/font` `className`.

| Font | Loaded via | Used on |
|---|---|---|
| Cormorant Garamond | `next/font/google` | Our Story, Life at JLM, Careers, Contact, Investor Relations, Blog (headings/pull quotes) |
| DM Sans | `next/font/google` | The most common body font: Our Story, Life at JLM, Careers, Contact, Investor Relations, Philanthropy, ESG, Blog |
| Inter | `next/font/google` | Emoform (all sub-components) |
| Noto Sans Devanagari | `next/font/google` | Emoform (Devanagari copy) |
| Nunito | `next/font/google` | Morisons Baby Dreams |
| Anton | `next/font/google` | Philanthropy + ESG (display) |
| Caveat Brush | `next/font/google` | Philanthropy (handwritten accent) |
| Google Sans | **local** (`src/app/fonts/GoogleSans-500.woff2`, `GoogleSans-700.woff2`) | Bigen |
| `font-serif` (Tailwind default serif) | Tailwind | **Homepage** headings (BrandCards, StatsSection, VisionSection, HomeFeatures), LeadershipGrid, Morisons |

> **Worth knowing:** Cormorant Garamond + DM Sans (the intended house pair in `CLAUDE.md`) is used across most content pages — but the **homepage** (and Leadership, Morisons) headings use the utility `font-serif`, which is the browser/Tailwind default serif stack, **not** Cormorant. So the homepage's editorial serif doesn't match the rest of the site. TODO(verify): decide whether to standardise the homepage serif to Cormorant.

### Type scale (as used)
Headings are fluid via `clamp()`. Common patterns:
- Section headline: `clamp(2rem, 4.5vw, 4.25rem)`, `font-light`, `leading-[1.05]`, `tracking-tight`.
- Feature/stat headline: `clamp(1.75rem–1.9rem, ~3.4vw, 3rem)`.
- Body: `text-sm`/`text-base`, `leading-relaxed`; blog body `18px`, `leading-[1.8]`.
- Eyebrow/label: `text-xs`, `uppercase`, `tracking-[0.2em–0.3em]`, colour `#555555`.
- Footer headings: `text-xs`, `font-bold`, `tracking-[0.2em]`, `uppercase`.

## Colour

### Core palette (from `CLAUDE.md`)
| Token | Hex | Use |
|---|---|---|
| Background | `#FFFFFF` | Page/card surface |
| Text primary | `#111111` | Headlines, body, nav bar, footer bg |
| Text secondary | `#555555` | Sub-copy, captions, eyebrows |
| Accent (beige) | `#E8E0D5` | Dividers, hover, soft highlights, placeholders |

There are **no Tailwind colour tokens** — these are written as literal hex (`text-[#111111]`, `bg-[#E8E0D5]`, inline `style`). Keep new work on-palette.

### Additional in-code colours (component-specific)
| Hex | Where |
|---|---|
| `#F6F3EE` | Stat card default background |
| `#E8E0D5` | Stat icon-box default background |
| `#F4F1E8` / `#1A1712` / `#6B6459` | SocialStamps paper / ink / muted |
| `#0c0703` | FactorySection dark "card" variant |
| `#0A66C2` | LinkedIn brand blue (footer) |
| `#7A6438`, `#B8956A` | Blog list markers / link underline |
| brand palettes | Baby Dreams (warm nursery neutrals + coral), Bigen (gold/black) — defined inline in each client file |

## Spacing & breakpoints

- **Breakpoints:** Tailwind defaults — `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- **Section padding:** typically `px-6 md:px-12`, vertical `py-16 md:py-24`.
- **Max width:** content wraps in `max-w-6xl` / `max-w-7xl` centred.
- **Nav height:** CSS var `--nav-h` = `56px` mobile, `68px` at `md` (set in `globals.css`, consumed by navbar + the body spacer so they always align). `scroll-padding-top` offsets anchor jumps below the fixed nav.
- **Full-height:** use `100dvh`/`100svh` (dynamic viewport units), never `100vh`, so sections don't jump when mobile toolbars show/hide.
- **Safe areas:** `env(safe-area-inset-*)` used for fixed controls (e.g. InlineVideo fullscreen button) on notched phones.

## Signature patterns (reusable primitives)

### 1. Fixed dark navbar
`Navbar` is `position: fixed`, `bg-[#111111]`, `z-50`, full-width. The layout's `theme-color` is also `#111111` so the mobile browser chrome blends into the bar.

### 2. The curved white "card" body
The whole page content sits in a rounded white card that reveals a dark background at its top corners. Implemented in `SiteChrome`:
```tsx
<div style={{ paddingTop: 'var(--nav-h)', backgroundColor: '#111111' }}>
  <main style={{
    minHeight: 'calc(100dvh - var(--nav-h))',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
    overflow: 'clip',            // clips to rounded corners WITHOUT becoming a scroll container
  }}>
```
`overflow: clip` (not `hidden`/`auto`) is deliberate — it keeps the **window** as the scroller so `position: sticky` and GSAP pins still resolve against the viewport (native mobile toolbar collapse preserved).

### 3. Scalloped section edge
`StatsSection` draws white semicircle "bumps" (an inline SVG `background-image`, repeat-x) at the seam with the dark brand section above, for a soft curvy intersection.

### 4. Rounded dark footer
`Footer` is `bg-[#111111]` with `borderTopRadius: 40px`, animating up into view. The section above it is usually made dark so the rounded corners blend.

### 5. Perforated "stamp" cards
`SocialStamps` renders postage-stamp cards with a perforated edge drawn as radial-gradient dots in the surrounding colour (`notchColor`) so the notches read as real cut-outs across all browsers (no mask compositing).

### 6. House motion curve
Easing `[0.16, 1, 0.3, 1]` (a shared `EASE` const) is reused across Framer transitions for a consistent feel. See [06-ANIMATION.md](06-ANIMATION.md).

### 7. Count-up numbers
`StatsSection`/Philanthropy animate numbers from 0 on scroll-in, preserving prefixes/suffixes and using Indian digit grouping (`toLocaleString('en-IN')`).

> The **inset-border hero** described in `CLAUDE.md` is **not** present in the current homepage (there is no hero section). If a hero is added later, follow that spec then.

## Component catalogue (with variants)

| Primitive | Variants / props |
|---|---|
| FactorySection | `variant: 'plain' \| 'card'` (dark panel), `imageSide: 'left' \| 'right'`, `background` |
| SocialStamps | `perforated` on/off, `paper`/`ink`/`muted`/`notchColor`, `fontClassName` |
| InlineVideo | `rounded` on/off, empty-state placeholder, `fallbackAspect` |
| BrandCards | desktop hover-expand vs touch viewport-"light-up" mode |
| HomeFeatures | `imageRight` toggle, single image vs cross-fading deck |
| StatsSection stat | per-card `cardColor`, `iconBgColor`, `iconColor`, `iconSize`, `showIconBox` |

## Accessibility baseline

Present in the code (maintain these):
- **Alt text** required on key images (blog cover/inline, cert badges use the cert name); leaders without a photo get a neutral placeholder, never a stock face.
- **Reduced motion** respected in `StatsSection`, `HomeFeatures`, Lenis (disabled), and the CSS marquee.
- **ARIA**: nav toggle has `aria-label`/`aria-expanded`; video controls have `aria-label`s; decorative SVGs are `aria-hidden`.
- **Focus/keyboard**: links use real `<Link>`/`<a>`; the mobile menu locks body scroll while open. TODO(verify): audit visible focus states and colour contrast for the `#555555`-on-white secondary text at small sizes.
- **Native scroll** preserved so browser find/anchors/scroll-restoration work.
