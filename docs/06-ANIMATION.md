# 06 · Animation

The two animation libraries, when to use each, and the patterns already in the codebase.

`Last updated: 2026-07-30`
`Maintainer:` TODO(verify)

---

## GSAP vs Framer Motion — the rule

Use **GSAP + ScrollTrigger** for scroll-*driven* effects that track scroll position: reveals timed to scroll, number count-ups, pinned/scrubbed sequences. Use **Framer Motion** for React UI motion: element enter/exit (`whileInView`), hovers, taps, menu open/close, carousels, and staggered lists. When both could work, prefer Framer Motion for anything tied to a component's mount/state, and GSAP only when you need ScrollTrigger's scroll math.

## Where plugins are registered

`ScrollTrigger` is registered with `gsap.registerPlugin(ScrollTrigger)` at the top of each module that uses it (`StatsSection`, `HomeFeatures`, `blog/InlineImage`, `blog/PullQuote`, `MorisonsBabyDreamsClient`) and once inside `SmoothScroll`'s effect. Registering more than once is safe.

## Smooth scroll (Lenis) — the backbone

`src/components/SmoothScroll.tsx` runs globally from the root layout:
- Creates a Lenis instance (eased wheel scroll), drives it from GSAP's ticker, and calls `ScrollTrigger.update` on scroll, so **one rAF loop** powers both smoothed scroll and every ScrollTrigger.
- The **window still scrolls natively** — Lenis only eases the wheel — so mobile browser toolbars collapse, and Cmd/Ctrl+F, anchors, and scroll restoration all behave.
- **Opts out** (plain native scroll) on `/studio`, on `/emoform` (its scrollytelling needs native timing), and for users with `prefers-reduced-motion`.

## Core patterns (real snippets)

### 1. GSAP scroll reveal with cleanup (`StatsSection`, `HomeFeatures`)
```tsx
useEffect(() => {
  const root = sectionRef.current
  if (!root) return
  const scroller = document.getElementById('page-scroller') // legacy; resolves to undefined → viewport
  const ctx = gsap.context(() => {
    gsap.from('[data-stat-reveal]', {
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: root, scroller: scroller ?? undefined, start: 'top 78%' },
    })
  }, root)
  return () => ctx.revert()   // ← reverts tweens AND kills the ScrollTriggers
}, [])
```

### 2. Framer count-up gated on in-view (`StatsSection` → `CountUp`)
Numbers animate from 0 once the grid enters view (`useInView(..., { once: true })`), preserving prefixes/suffixes (₹, +, %, Cr) and formatting with Indian digit grouping (`toLocaleString('en-IN')`). Under reduced-motion it renders the final value immediately.

### 3. Framer `whileInView` enter (Footer, FactorySection, ValuesImage, SocialStamps)
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
/>
```
The easing `[0.16, 1, 0.3, 1]` (an `EASE` const) is the house curve, reused everywhere.

### 4. IntersectionObserver, not scroll libs, for cheap triggers (`BrandCards`, `VisionSection`)
`BrandCards` uses an `IntersectionObserver` (rootMargin centred band) to "light up" the card at screen-centre on touch devices; `VisionSection` uses one to fire the kinetic text reveal once. Prefer this for simple "is it on screen" logic.

### 5. Kinetic text reveal (`ui/kinetic-text-reveal`, used by `VisionSection`)
A Framer Motion primitive that splits text by words/characters and reveals them with a staggered rise + blur; exposes a `play()` via ref so a parent observer can trigger it. Reduced-motion aware.

### 6. CSS marquee (Life at JLM carousels)
Infinite horizontal scroll is done in pure CSS (`@keyframes marquee-left/right` in `globals.css`), pausing on hover and disabled under reduced-motion — cheaper than a JS loop for a continuous strip.

## Cleanup rules (why they matter)

- **Always** wrap GSAP in `gsap.context(scopeEl)` and `return () => ctx.revert()`. App Router does client-side navigation without a full page reload, so a component that doesn't revert leaves **orphaned ScrollTriggers** that fire on the next page and corrupt scroll math.
- Framer `whileInView`/`useInView` clean themselves up; no manual teardown needed.
- IntersectionObservers: `observer.disconnect()` in the effect's cleanup (as `BrandCards`/`VisionSection` do).

## `ScrollTrigger.refresh()` after layout changes

ScrollTrigger caches element positions. After anything that changes layout height **post-mount** — fonts swapping in, images loading, expanding sections — call `ScrollTrigger.refresh()` so triggers recompute. Today the app leans on native scroll + `once`-style reveals, so explicit refreshes are rare; add one if you introduce pinned/scrubbed sections whose height depends on late-loading media.

## Reduced motion

Respect `prefers-reduced-motion` for any non-essential motion:
- Framer: `useReducedMotion()` (used in `StatsSection`, `HomeFeatures`) to skip/So-shorten animations.
- Lenis: disabled entirely for these users (native scroll).
- CSS: the marquee is `animation: none` under the reduced-motion media query.

## Performance rules

- Animation code lives in `'use client'` components only; the server shell stays light.
- Prefer transform/opacity animations (GPU-friendly); avoid animating layout properties.
- Don't make below-the-fold media `priority` — it steals bandwidth from the LCP (the first brand card). Feature images are explicitly `loading="lazy"`.
- Keep GSAP scoped with `gsap.context` so tweens are cheap to create and destroy on navigation.

## Known quirks

- **`document.getElementById('page-scroller')`** is referenced as a GSAP `scroller` in several components but that element no longer exists — it resolves to `undefined`, so GSAP correctly falls back to the viewport. Harmless, but confusing; noted in [10-OPERATIONS.md](10-OPERATIONS.md#known-issues--technical-debt).
- **Emoform** must stay on native scroll (Lenis is disabled there); its scrollytelling boundaries flicker under Lenis inertia. If you touch that page, verify scroll behaviour on real iOS Safari.
