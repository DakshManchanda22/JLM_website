# JL Morison Website Revamp — Claude Code Reference

This file contains all technical decisions, architecture choices, and requirements for the JL Morison website revamp. Read this before writing any code.

---

## Project Overview

**Client:** J.L. Morison (India) Ltd. — FMCG company with three brands: Morisons Baby Dreams (baby care), Emoform (dental), Bigen (hair care).

**Goal:** Full redesign of jlmorison.com. Same sitemap, new design, fast performance, easy content management.

**Builder:** Daksh (non-technical, vibe coder) using Claude Code.

**Constraints:** Low traffic, no ecommerce, no payments, no CRM, no international audiences, light marketing updates.

---

## Colour Palette

The site uses a tight, editorial 4-colour system. Use these everywhere — do not introduce off-palette colours without checking first.

| Token | Hex | Use |
|---|---|---|
| Background | `#FFFFFF` | Page background, card surfaces |
| Text primary | `#111111` | Headlines, body copy, primary nav links |
| Text secondary | `#555555` | Sub-copy, captions, helper text, inactive states |
| Accent | `#E8E0D5` | Subtle warm beige — section dividers, hover backgrounds, soft highlights |

---

## Final Architecture

```
GoDaddy Domain → Vercel → Next.js 14 → Sanity CMS → Google Cloud Storage (videos only)
```

---

## Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Domain | GoDaddy | Existing — update DNS to point to Vercel only |
| Hosting + CDN + Edge | Vercel | ~₹1,700/month Pro. Start on free tier |
| Framework | Next.js 14 (App Router) | Use App Router, not Pages Router |
| Styling | Tailwind CSS | Only Tailwind — no other CSS frameworks |
| Scroll animations | GSAP + ScrollTrigger | For hero, scroll reveals, counters, horizontal scroll |
| UI animations | Framer Motion | For page transitions, hovers, modals |
| CMS / Admin panel | Sanity | Free tier (20GB). All content managed here |
| Video storage | Google Cloud Storage | Only if not using YouTube/Vimeo embeds |
| Analytics | Google Analytics 4 | Free |
| Uptime monitoring | UptimeRobot | Free — 5-min checks, email alerts |
| Code repository | GitHub (JLM Organisation) | All code under JL Morison's GitHub org |

---

## What NOT to Use

Do not introduce or suggest these — they were explicitly removed:

- ❌ AWS (any service) — use GCP instead, JLM already has account
- ❌ Cloudinary — Sanity's 20GB free tier handles images
- ❌ Algolia or any search tool — site is too small to need it
- ❌ Any paid security tool — risk surface is too low
- ❌ Any CDN beyond Vercel's built-in edge network
- ❌ WordPress or any other CMS
- ❌ Any CSS framework other than Tailwind

---

## Environments

Three environments via Vercel + GitHub branches:

- **Production** — `main` branch → jlmorison.com
- **Staging** — `staging` branch → staging.jlmorison.vercel.app
- **Preview** — every pull request gets a unique preview URL automatically

---

## Sanity CMS Setup Rules

Sanity is the admin panel. Marketing uses it to swap content without touching code.

### Content types to define in Sanity schema:
- Homepage (hero image, headline, subheadline, CTA)
- Brand pages (Morisons Baby Dreams, Emoform, Bigen) — name, description, images, product list
- Blog posts — title, slug, cover image, body (portable text), SEO fields, publish date
- Campaign / generic pages — headline, body, images, CTA (template marketing can reuse)
- Navigation — links, labels (so menu can be updated without code)
- Global settings — company name, social links, contact email, footer content

### Every page/post in Sanity must include SEO fields:
- `seoTitle` — meta title shown on Google
- `seoDescription` — meta description shown on Google
- `ogImage` — image shown when shared on WhatsApp/LinkedIn

### Sanity connection pattern:
Use `next-sanity` and `@sanity/image-url`. Fetch content server-side using `sanity.fetch()` in Server Components. Never fetch Sanity data client-side.

---

## SEO Setup

- Use Next.js built-in `generateMetadata()` for per-page SEO — pull values from Sanity fields
- Auto-generate sitemap using `next-sitemap` package — runs on build
- Set `robots.txt` in `/public/robots.txt` or via next-sitemap config
- Canonical URLs handled automatically by Next.js App Router
- OG images pulled from Sanity `ogImage` field per page

---

## Animation Guidelines

### GSAP (for big, scroll-driven effects):
- Hero section — image/video scale or fade on load
- Brand cards — animate in one by one on scroll (ScrollTrigger)
- Number counters — count up when scrolled into view
- Horizontal scroll sections — sideways scroll on vertical scroll
- Always wrap GSAP in `useEffect` with proper cleanup (`ctx.revert()`)
- Use `ScrollTrigger.refresh()` after any layout changes

### Framer Motion (for UI-level interactions):
- Page transitions — wrap layout in `<AnimatePresence>`
- Button hover/tap states
- Modal open/close
- Navigation menu open/close on mobile

---

## Image Optimisation

- Always use Next.js `<Image>` component — never a raw `<img>` tag
- Images served from Sanity use `@sanity/image-url` builder with `.auto('format').fit('max')`
- Next.js handles WebP/AVIF conversion, resizing, and lazy loading automatically
- Add `sizes` prop to every `<Image>` for responsive behaviour

---

## Performance Rules

The site must load fast — target Lighthouse score 95+.

- Use Server Components by default — only add `'use client'` when absolutely needed (interactivity, hooks, browser APIs)
- No large client-side JavaScript bundles
- Lazy load GSAP and Framer Motion — don't import at top level unless needed on first paint
- Use `next/dynamic` with `{ ssr: false }` for animation-heavy components
- All fonts via `next/font` — no Google Fonts CDN links
- No unused CSS — Tailwind purges automatically in production

---

## Redirects

- Migration redirects (old URL → new URL) go in `next.config.js` under `redirects`
- Post-launch redirects can be added via Vercel dashboard — no code needed
- Since sitemap stays the same, migration redirect work will be minimal

---

## Forms and Leads

- Contact form uses **Resend** (free tier) or **Formspree** (free tier)
- Submissions go to a designated JLM email (e.g. marketing@jlmorison.com)
- Optionally: webhook to Google Sheet for a leads tracker
- No CRM integration needed

---

## Video Handling

Two options — confirm with client which to use:

**Option A (recommended if brand is okay with it):** Embed YouTube (unlisted) or Vimeo videos. Zero storage cost, fastest load, no self-hosting.

**Option B (full brand control):** Upload videos to Google Cloud Storage bucket. Marketing uploads directly to GCS, copies URL, pastes into Sanity video field. Website plays from GCS URL. Cost: ~₹200–500/month.

If using GCS: configure CORS on the bucket and set objects to public read.

---

## Backup Strategy

- **Content:** Sanity cloud — automatic. Export full dataset via `sanity dataset export` anytime.
- **Code:** GitHub repo — every commit is a recoverable version.
- **Media:** GCS built-in versioning — enable on bucket creation.

---

## Security

No paid security tools needed. Built-in protections are sufficient:

- Vercel: auto HTTPS/SSL, DDoS protection included
- Next.js: no database exposed to internet
- Sanity: frontend API is read-only; write access only via authenticated Sanity dashboard
- Never commit `.env.local` or any API keys to GitHub
- All secrets go in Vercel environment variables (Settings → Environment Variables)

---

## Environment Variables

Store all secrets in Vercel environment variables. Local development uses `.env.local` (gitignored).

Required variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
RESEND_API_KEY=  (or FORMSPREE_ENDPOINT)
GCS_BUCKET_NAME=  (only if using video storage)
```

---

## Account Ownership Rules

**Every tool account must be under JL Morison company credentials — not any developer's personal account.**

| Tool | Account requirement |
|---|---|
| Vercel | JLM company email, GST number in billing |
| Sanity | JLM company email, GST billing |
| GCP | Existing JLM GCP account, GST updated in billing |
| GitHub | JL Morison GitHub Organisation |
| GoDaddy | Already owned, GST on account |

---

## Multilingual (Future)

Not needed now. When the time comes:
- Add `i18n` config to `next.config.js`
- Add language-specific fields to Sanity schemas
- URLs become `/en/about`, `/hi/about` automatically
- No rebuild needed — extension only, if structured correctly from day one

---

## AI Chatbot (Future)

Not needed now. When the time comes:
- Add chat widget as a Next.js component (Crisp, Tidio, or Claude API-powered)
- Feed Sanity content as context for accurate product answers
- No architectural change needed — pure addition

---

## Documentation to Produce at End of Build

1. `README.md` in repo — how to run locally, project structure
2. `SANITY_GUIDE.md` — non-technical guide for marketing: how to add blog posts, change banners, update SEO
3. `DEPLOYMENT.md` — how to push changes from GitHub to Vercel
4. `.env.example` — template showing all required environment variables (no actual values)

---

## Things Set Up Once, Never Touched Again

- `next.config.js` — redirects (migration, one time)
- Sanity schema — content structure for all page types
- `next-sitemap` config — auto-generates sitemap on every build
- Vercel deployment pipeline — push to GitHub = live in 30 seconds
- GCS bucket + CORS — if using video storage
- GA4 + UptimeRobot — configured once, runs forever

---

## What Marketing Can Do Without a Developer (After Launch)

- Create new pages using pre-built Sanity templates
- Write, edit, publish blog posts
- Swap homepage hero images and text
- Update brand pages (copy, images, descriptions)
- Update SEO metadata per page (title, description, OG image)
- Add redirects via Vercel dashboard
- Monitor traffic in GA4
- Receive form leads via email or Google Sheet

**What still needs a developer:** new page layout templates, new features, code-level changes.

---

## Homepage — Design & Animation Spec

### Fonts
- Headings: `Cormorant Garamond` (elegant, editorial serif) — via `next/font`
- Body + Nav: `DM Sans` (clean, modern sans-serif) — via `next/font`
- No Google Fonts CDN links — always `next/font/google`

### Navbar
- Transparent on hero, switches to frosted white (`bg-white/85 backdrop-blur`) on scroll via GSAP ScrollTrigger
- Logo "JL MORISON" centred — DM Sans, bold, letter-spaced
- Left of logo: "Our People", "Our Brands"
- Right of logo: "Philanthropy", "Investor Relations", "Join Us"
- All nav links: DM Sans, small, lightweight

**Dropdowns (Instrument.com style):**
- "Our People" → pills appear below nav: "Our Story" | "Leadership Team" | "Life at JLM"
- "Our Brands" → pills appear below nav: "Morisons Baby Dreams" | "Emoform" | "Bigen"
- Pills: `rounded-full`, `border border-gray-300`, `bg-white`, `text-xs`
- Framer Motion stagger: fade + slide down on open
- Click outside to close

**Mobile:**
- Hamburger left, logo centred
- Full screen overlay, Framer Motion slide from top

### Hero Section
- Full viewport `100vh`, full bleed background image
- `bg-black/30` overlay
- Inset border: `absolute inset-4`, `border border-white/20 rounded-sm` (subtle Lightship-style inner frame)
- Headline split bottom-left and bottom-right:
  - Left bottom: "Building Goodness."
  - Right bottom: "Since 1920."
  - Both: Cormorant Garamond, ~96px, white, `font-light`, absolute positioned
- Scroll indicator: bottom-centre, small down arrow + "Scroll" in white DM Sans tiny

**Hero Scroll Animation (GSAP ScrollTrigger, `scrub: true`):**
- As user scrolls, the hero image shrinks inward:
  - `scale: 1 → 0.85`
  - `borderRadius: 0px → 24px`
  - margin grows so it looks like it pulls away from all edges
- Feels like Lightship — full bleed contracts into a floating card

### Section 2 — Brand Statement
- Clean white background, revealed as hero shrinks
- Large centred editorial text: "Three brands. One purpose. Building goodness for every Indian family."
- Cormorant Garamond, ~64px, `#111111`
- GSAP ScrollTrigger: fade up on enter

### Section 3 — Asymmetric Image Grid
Offset editorial layout, inspired by Lightship image grid:
- 5 Unsplash placeholder images, no captions, no text
- Layout (not a regular grid — use absolute/relative offsets):
  - Top left: wide landscape (largest, ~col-span-2 feel)
  - Centre: tall portrait, starts ~80px lower than top-left
  - Top right: smaller square
  - Bottom right: wide landscape
  - Bottom left: medium image
- All images: `rounded-2xl`, `object-cover`
- GSAP ScrollTrigger: each image fades + slides up staggered on scroll
