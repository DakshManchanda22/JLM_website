# 02 · Component Map

Every visible piece of the site, where it lives in code, and — most importantly — **where its content comes from**. When something looks wrong or needs changing, start here.

`Last updated: 2026-07-30`
`Maintainer:` TODO(verify)

---

## How to read the "Content source" column

- **Sanity: `<type>` → `<field>`** — editable in Studio, Tier 1. Change it there, it's live within ~60s.
- **Hardcoded** — the value is written in the code. Changing it is Tier 3 (developer + deploy). This is the single most common source of "why can't I edit this?" confusion — the rows below say so explicitly.
- **GCS** — a video/file served from Google Cloud Storage (Tier 2 to replace; see [05-MEDIA.md](05-MEDIA.md)).
- **Fallback** — Sanity value is used if set, otherwise a hardcoded default renders. Both places are noted.

Image asset guidance (dimensions/format/weight) is summarised per component; full specs in [05-MEDIA.md](05-MEDIA.md#image-spec-sheet).

---

## Global chrome (every page)

| Component | Where | Code | Built with | Content source | Assets | Tier | How to change |
|---|---|---|---|---|---|---|---|
| SiteChrome | Wraps all pages (not `/studio`) | `src/components/SiteChrome.tsx` | React, client | Structural (the dark spacer + rounded white "card") | — | 3 | Layout wrapper; edit only with care |
| Navbar | Fixed top, all pages | `src/components/Navbar.tsx` | Framer Motion | Logo: **Fallback** — Sanity `siteSettings → logo`, else hardcoded Sanity CDN SVG URL. Menu labels/links: **Hardcoded** (`NAV_ITEMS`, `DROPDOWNS`) | Logo: SVG/PNG, light wordmark for dark bar | Logo=1; menu=3 | Swap logo in Studio → Footer & site settings → Brand. Menu structure is code |
| Footer | Bottom of every page | `src/components/Footer.tsx` | Framer Motion | **Fallback** — Sanity `siteSettings` (company links, address, socials, follow text, copyright, privacy PDF), else hardcoded defaults | — | 1 | Studio → Footer & site settings |
| SmoothScroll | Global (side effect) | `src/components/SmoothScroll.tsx` | Lenis + GSAP | n/a (behaviour) | — | 3 | Eased scroll; off on `/emoform` + `/studio` + reduced-motion |
| SiteSettingsProvider | Global context | `src/components/SiteSettingsProvider.tsx` | React context | Feeds Sanity `siteSettings` to Navbar/Footer | — | 3 | — |
| OrganizationSchema | `<head>`-level JSON-LD, all pages | `src/components/seo/OrganizationSchema.tsx` | JSON-LD | Mostly **Hardcoded** (name, founding 1920, logo `/logo.png`); `sameAs` from Sanity footer socials | `/public/logo.png` | 3 | See [08-INTEGRATIONS.md](08-INTEGRATIONS.md#structured-data) |
| BreadcrumbSchema | JSON-LD on all 15 content pages | `src/components/seo/BreadcrumbSchema.tsx` | JSON-LD | **Hardcoded** crumbs passed per page | — | 3 | — |
| JsonLd | Base helper used by the two schema components above (+ Article JSON-LD on blog posts) | `src/components/seo/JsonLd.tsx` | `<script type="application/ld+json">` | Serialises a passed object | — | 3 | Not used directly; wrap it in a schema component |

## Homepage (`/`)

Rendered by `src/app/page.tsx`. **There is no hero section** — the page opens directly into the brand cards (the first card is the LCP element). Content is almost entirely Sanity `homepage`.

| Component | Section | Code | Built with | Content source | Assets | Tier | How to change |
|---|---|---|---|---|---|---|---|
| BrandCards | Brand tiles (top) | `src/components/BrandCards.tsx` | Framer Motion, IntersectionObserver | Sanity `homepage → brands[]` (name, tagline, image, href). Heading: `homepage → brandsHeading` (fallback "Trusted in every Indian home."). Card `href` is normalised in `page.tsx` to canonical brand routes | Landscape photos, ~1600px wide, JPG/WebP | 1 | Studio → Homepage → Brand cards |
| StatsSection | Metric cards | `src/components/StatsSection.tsx` | Framer Motion count-up + GSAP reveal | Sanity `homepage → stats[]` (number, label, body, icon SVG, per-card colours). Heading: `statsHeading` | Icon: single-colour **SVG** (colour set by field, not file) | 1 | Studio → Homepage → Stats |
| VisionSection | "Our Vision" statement | `src/components/VisionSection.tsx` | kinetic-text-reveal (Framer) | Sanity `homepage → vision.label` + `vision.text` | — | 1 | Studio → Homepage → Our Vision |
| ValuesImage | Values graphic | `src/components/ValuesImage.tsx` | Framer Motion | Sanity `homepage → valuesImage` + toggle `showValuesImage` | One editorial image (values graphic) | 1 | Studio → Homepage → Values image |
| HomeFeatures | Feature rows (image + text) | `src/components/HomeFeatures.tsx` | Framer Motion deck + GSAP reveal | Sanity `homepage → features[]` (eyebrow, headline, body, CTA, image(s), interval, side) | 1+ photos per feature, ~1400px | 1 | Studio → Homepage → Feature sections |
| Footer | — | (global) | — | — | — | 1 | — |

## Blog (`/blog`, `/blog/[slug]`)

| Component | Where | Code | Built with | Content source | Assets | Tier | How to change |
|---|---|---|---|---|---|---|---|
| BlogIndex | `/blog` list | `src/components/blog/BlogIndex.tsx` | Framer Motion, GSAP | Sanity `post[]` (title, excerpt, cover, author, tags, date, `featured`) | Cover images ~1600px | 1 | Studio → Blog → Blog posts |
| PortableBody | Article body | `src/components/blog/PortableBody.tsx` | @portabletext/react | Sanity `post → body` (Portable Text) | Inline images per block | 1 | Write in the post's Body editor |
| InlineImage | Image inside an article | `src/components/blog/InlineImage.tsx` | next/image + GSAP fade-up | Sanity inline image block (alt, caption, fullBleed) | JPG/WebP; 16:10 or 21:9 (full-bleed) | 1 | Insert via "+" in the Body editor |
| PullQuote | Pull quote in an article / Our Story | `src/components/blog/PullQuote.tsx` | GSAP, Cormorant font | Sanity pull-quote block (quote, attribution) | — | 1 | Insert via "+" in the Body editor |
| AuthorCard | "Written by" footer | `src/components/blog/AuthorCard.tsx` | next/image, DM Sans | Sanity `author` (name, avatar, role, bio) | Avatar ~88px square | 1 | Studio → Blog → Authors |

## Leadership (`/leadership-team`, `/leadership-team/[slug]`)

| Component | Where | Code | Built with | Content source | Assets | Tier | How to change |
|---|---|---|---|---|---|---|---|
| LeadershipGrid | Team grid | `src/components/LeadershipGrid.tsx` | Framer Motion stagger | Sanity `leader[]` ordered by `leadershipTeam → members[]`. Heading "Leadership team" is **Hardcoded** | Portraits 3:4, object-top; beige placeholder if none | 1 (people) / 3 (heading) | Studio → Our People → Leadership Team |
| Leader profile | `/leadership-team/[slug]` | `src/app/leadership-team/[slug]/page.tsx` | React, Framer | Sanity `leader` (name, title, quote, bio[], linkedin, email, image) | Portrait | 1 | Studio → Our People → Leadership Team → open a person |

## Shared brand-page components

Used across Baby Dreams, Bigen, and Emoform.

| Component | Where | Code | Built with | Content source | Assets | Tier | How to change |
|---|---|---|---|---|---|---|---|
| FactorySection | "Our Factory" on each brand page | `src/components/FactorySection.tsx` | Framer Motion | Sanity brand doc factory fields (`factoryHeading`, `factoryImage`, `factoryDescription`, `certifications[]`) | Factory photo 4:3; cert logos ~small square | 1 | Studio → Our Brands → <brand> → Factory tab |
| SocialStamps | "Follow us" stamp cards | `src/components/SocialStamps.tsx` | Framer Motion | Sanity brand doc social fields (`instagramUrl`, per-platform card heading/subcopy/count/image). **Follower counts are typed in, not live** | Optional card image | 1 | Studio → Our Brands → <brand> → Social tab |
| InlineVideo | Sanity-driven video block (Our Story, Philanthropy) | `src/components/InlineVideo.tsx` | HTML `<video>` | Sanity `videoUrl`/`videoFile` + poster. Muted autoplay, `playsinline`, mute + fullscreen controls | MP4 (GCS) + poster image | 2 (video) / 1 (poster) | See [05-MEDIA.md](05-MEDIA.md) |

## Brand pages — per page

### Morisons Baby Dreams (`/morisons-baby-dreams`)
`MorisonsBabyDreamsClient.tsx` — type set in **Nunito** (local `next/font`), warm nursery palette (hardcoded in the file).

| Section | Content source | Notes |
|---|---|---|
| Hero banner carousel | Sanity `babyDreams → banners[]` (image, alt, href) + `bannerInterval` | Banners designed at 1464×600 |
| Video | **GCS, hardcoded fallback URL** `storage.googleapis.com/jlm_website_v2/MBD-Teaser…`; Sanity `babyDreams → videoUrl` overrides | Tier 2 to change; convert to `videos.jlmorison.com` |
| Our Products (pastel tiles) | Sanity `babyDreams → categories[]` (title, blurb, image, tint, href) | Tints: mint/blush/butter/lilac/sky |
| Our Factory | Sanity `babyDreams` factory fields (FactorySection) | — |
| Doctor blogs carousel | Sanity `babyDreams → blogsHeadline/Intro/carouselSpeed` + `post[]` | — |
| Follow us | Sanity `babyDreams` social fields (SocialStamps) | IG/FB/YouTube |

### Bigen (`/bigen`)
`BigenClient.tsx` — local **Google Sans** font; gold/black theme; many hardcoded defaults used until Sanity fields are filled.

| Section | Content source | Notes |
|---|---|---|
| Hero (logo, headline, "Japan's No.1", Jadeja photo) | Sanity `bigen` hero fields; some copy **Hardcoded** (e.g. "for men" is fixed in code, overriding a stale Sanity value) | — |
| Video | **GCS, hardcoded fallback URL** (Bigen Jadeja clip); Sanity `bigen → videoUrl` overrides | Tier 2 |
| 10-minute ritual | Sanity `bigen` ritual fields (headline parts, body, features, image) | Rich text |
| Natural shine | Sanity `bigen` shine fields | Rich text |
| Testimonials (Instagram reels) + Product range | Sanity `bigen → reels[]`, `products[]` | Reels are embedded IG URLs |
| Our Factory | Sanity `bigen` factory fields (FactorySection, dark `card` variant) | — |
| Follow us | Sanity `bigen` social fields (SocialStamps) | IG/FB |

### Emoform (`/emoform`)
`EmoformClient.tsx` + `EmoformFeatures.tsx`, `EmoformGumCare.tsx`, `EmoformScrollytelling.tsx`. Fonts: **Inter** + **Noto Sans Devanagari**. Uses **native scroll** (Lenis disabled).

| Section | Content source | Notes |
|---|---|---|
| Hero ("Swiss Formula" ribbon + toothpaste) | Sanity `emoform` hero fields | Width-driven layout |
| Features / gum-care / scrollytelling steps | Sanity `emoform → features[]`, `steps[]` | Sticky/observer scrollytelling |
| Our Factory | Sanity `emoform` factory fields | — |
| Follow us | Sanity `emoform` social fields | Counts are placeholders — TODO in code |

### Morisons house brand (`/morisons`)
`MorisonsClient.tsx` (52 lines) — a single full-bleed poster.

| Section | Content source | Notes |
|---|---|---|
| Poster | Sanity `morisons → poster` (+ alt, aspect) | SEO/OG also from `morisons` doc |

## Other pages

| Page | Client component | Key sections | Content source |
|---|---|---|---|
| Our Story `/our-story` | `OurStoryClient.tsx` (Cormorant + DM Sans) | Intro (InlineVideo), Journey stepper, Eras timeline, Pull quote, Values | Sanity `ourStory` |
| Life at JLM `/life-at-jlm` | `LifeAtJlmClient.tsx` | Intro curtain (6-photo reveal), Hero, Intro paragraph, Infinite photo carousels (CSS marquee), Employee testimonials | Sanity `lifeAtJlm` |
| Philanthropy `/philanthropy` | `PhilanthropyClient.tsx` (Anton + Caveat Brush + DM Sans) | Kaamyaab video (InlineVideo), Impact (5-year count-up), Programs, closing Hero | Sanity `philanthropy` |
| ESG `/esg` | `EsgClient.tsx` | Title/banner, Commitment + stat cards, Environment carousel, Social carousel, Governance dark table, Gallery lightbox | Sanity `esg` |
| Careers `/careers` | `CareersClient.tsx` | Hero, application form (→ `/api/careers`) | Sanity `careers`; recipients Sanity/env |
| Contact `/contact-us` | `ContactClient.tsx` | Contact details + offices, form (→ `/api/contact`), "work with us" rotating wheel | Sanity `contactUs`; recipients Sanity/env |
| Investor Relations `/investor-relations` | `InvestorRelationsClient.tsx` | Terms, CSR members, policies, AGM notices table, investor contacts, campaign docs, IEPF | Sanity `investorRelations` (document links) |

## UI primitive

| Component | Where used | Code | Built with | Notes |
|---|---|---|---|---|
| KineticTextReveal | VisionSection (homepage) | `src/components/ui/kinetic-text-reveal.tsx` | Framer Motion | Word/char reveal with blur + stagger; `prefers-reduced-motion` aware |

## Notes / gotchas

- **`document.getElementById('page-scroller')`** appears in `StatsSection`, `HomeFeatures`, `InlineImage`, `PullQuote` as a GSAP `scroller`. That element no longer exists (the page scrolls on `window`), so it resolves to `undefined` → GSAP uses the viewport, which is correct. It's a harmless legacy reference — see [10-OPERATIONS.md](10-OPERATIONS.md#known-issues--technical-debt).
- The homepage brand-card `href`s are re-mapped to canonical routes in `src/app/page.tsx` (`CANONICAL_HREF`), so a stale `/brands/…` value in Sanity still links correctly.
- **Maintenance rule:** when you add a component or change where its content comes from, add/update its row here. This is enforced by a note in `CLAUDE.md`.
