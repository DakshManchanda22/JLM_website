# 07 · Pages

Every page, its file, and a copy-pasteable recipe for adding a new brand page.

`Last updated: 2026-07-30`
`Maintainer:` TODO(verify)

---

## Site structure (navigation map)

The full site as a visitor navigates it. Indentation = nav hierarchy; dropdowns come from the top navbar (`src/components/Navbar.tsx`), `[slug]` routes are generated one-per-document from Sanity.

```
jlmorison.com/
│
├─ /                                Home
│
├─ Our Brands            ▸ navbar dropdown
│   ├─ /morisons-baby-dreams        Morisons Baby Dreams
│   ├─ /bigen                       Bigen
│   ├─ /emoform                     Emoform
│   └─ /morisons                    Morisons (house brand)
│
├─ Our People           ▸ navbar dropdown
│   ├─ /our-story                   Our Story
│   ├─ /leadership-team             Leadership Team (grid)
│   │    └─ /leadership-team/[slug]  → one profile per leader
│   └─ /life-at-jlm                 Life at JLM
│
├─ /esg                             ESG                 ▸ navbar link
├─ /philanthropy                    Philanthropy        ▸ navbar link
├─ /investor-relations              Investor Relations  ▸ navbar link
├─ /contact-us                      Contact Us          ▸ navbar pill (+ footer)
│
├─ /careers                         Careers             ▸ footer link (+ /join-us redirect)
│
├─ /blog                            Blog index          ▸ linked from brand pages/footer (not in top nav)
│   └─ /blog/[slug]                  → one article per post
│
└─ /studio                          Sanity Studio (CMS; noindex, disallowed in robots)
```

**Footer links** (`src/components/Footer.tsx`): About → `/our-story`, Careers → `/careers`, Contact Us → `/contact-us`, Privacy Policy → PDF (GCS). Social icons pull from Sanity site settings.

**Two kinds of "sitemap":**
- This tree = the human navigation structure.
- `GET /sitemap.xml` (`src/app/sitemap.ts`) = the machine sitemap for search engines: 14 fixed routes + every blog post + every leader profile, regenerated hourly. `GET /robots.txt` disallows `/studio` and `/api`.

**Old URLs** from the previous site 301-redirect into this structure (e.g. `/about-us` → `/our-story`, `/mbd` → `/morisons-baby-dreams`) — full map in [08-INTEGRATIONS.md](08-INTEGRATIONS.md#redirects).

---

## Page inventory

| Page | Route | File(s) | Content type | Status |
|---|---|---|---|---|
| Home | `/` | `app/page.tsx` | `homepage` | Live |
| Morisons Baby Dreams | `/morisons-baby-dreams` | `app/morisons-baby-dreams/{page,MorisonsBabyDreamsClient}.tsx` | `babyDreams` | Live |
| Bigen | `/bigen` | `app/bigen/{page,BigenClient}.tsx` | `bigen` | Live |
| Emoform | `/emoform` | `app/emoform/{page,EmoformClient,EmoformFeatures,EmoformGumCare,EmoformScrollytelling}.tsx` | `emoform` | Live |
| Morisons (house) | `/morisons` | `app/morisons/{page,MorisonsClient}.tsx` | `morisons` | Live (poster only) |
| Our Story | `/our-story` | `app/our-story/{page,OurStoryClient}.tsx` | `ourStory` | Live |
| Leadership Team | `/leadership-team` | `app/leadership-team/page.tsx` + `components/LeadershipGrid` | `leader` / `leadershipTeam` | Live |
| Leader profile | `/leadership-team/[slug]` | `app/leadership-team/[slug]/page.tsx` | `leader` | Live |
| Life at JLM | `/life-at-jlm` | `app/life-at-jlm/{page,LifeAtJlmClient}.tsx` | `lifeAtJlm` | Live |
| Philanthropy | `/philanthropy` | `app/philanthropy/{page,PhilanthropyClient}.tsx` | `philanthropy` | Live |
| ESG | `/esg` | `app/esg/{page,EsgClient}.tsx` | `esg` | Live |
| Careers | `/careers` | `app/careers/{page,CareersClient}.tsx` | `careers` | Live (form) |
| Contact Us | `/contact-us` | `app/contact-us/{page,ContactClient}.tsx` | `contactUs` | Live (form) |
| Investor Relations | `/investor-relations` | `app/investor-relations/{page,InvestorRelationsClient}.tsx` | `investorRelations` | Live |
| Blog index | `/blog` | `app/blog/page.tsx` + `components/blog/BlogIndex` | `post` | Live |
| Blog post | `/blog/[slug]` | `app/blog/[slug]/page.tsx` | `post` | Live |
| Studio | `/studio` | `app/studio/[[...tool]]/*` | — | Live (embedded CMS) |

Per-page section breakdowns are in [02-COMPONENT-MAP.md](02-COMPONENT-MAP.md#brand-pages--per-page).

## Per-page reference (one row = every file for that page)

For each page: the code files (server route → client/render components), the Sanity **schema file** and **GROQ fetch function** (in `src/sanity/queries.ts`), the **animation** approach, and the **fonts**. All routes live under `src/app/`. For deeper detail follow the cross-doc pointers under the table.

| Page · Route | Code (server → client) | Sanity (schema · fetch) | Animation | Fonts |
|---|---|---|---|---|
| **Home** · `/` | `page.tsx` → `BrandCards`, `StatsSection`, `VisionSection`, `ValuesImage`, `HomeFeatures` | `homepage.ts` · `fetchHomepage` | GSAP + Framer + kinetic reveal | `font-serif` (default) |
| **Morisons Baby Dreams** · `/morisons-baby-dreams` | `page.tsx` → `MorisonsBabyDreamsClient` (+ `FactorySection`, `SocialStamps`) | `babyDreams.ts` · `fetchBabyDreams` | GSAP + Framer | Nunito |
| **Bigen** · `/bigen` | `page.tsx` → `BigenClient` (+ `FactorySection`, `SocialStamps`) | `bigen.ts` · `fetchBigen` | Framer | Google Sans (local) |
| **Emoform** · `/emoform` | `page.tsx` → `EmoformClient`, `EmoformFeatures`, `EmoformGumCare`, `EmoformScrollytelling` | `emoform.ts` · `fetchEmoform` | Framer + native scrollytelling (Lenis off) | Inter, Noto Sans Devanagari |
| **Morisons** · `/morisons` | `page.tsx` → `MorisonsClient` | `morisons.ts` · `fetchMorisons` | Framer (minimal) | default |
| **Our Story** · `/our-story` | `page.tsx` → `OurStoryClient` (+ `InlineVideo`, `PullQuote`) | `ourStory.ts` · `fetchOurStory` | Framer + GSAP | Cormorant, DM Sans |
| **Leadership Team** · `/leadership-team` | `page.tsx` → `LeadershipGrid` | `leader.ts`, `leadershipTeam.ts` · `fetchLeaders` | Framer stagger | default |
| **Leader profile** · `/leadership-team/[slug]` | `[slug]/page.tsx` (inline) | `leader.ts` · `fetchLeader` | Framer | default |
| **Life at JLM** · `/life-at-jlm` | `page.tsx` → `LifeAtJlmClient` | `lifeAtJlm.ts` · `fetchLifeAtJlm` | Framer + CSS marquee | Cormorant, DM Sans |
| **Philanthropy** · `/philanthropy` | `page.tsx` → `PhilanthropyClient` (+ `InlineVideo`) | `philanthropy.ts` · `fetchPhilanthropy` | Framer + count-up | Anton, Caveat Brush, DM Sans |
| **ESG** · `/esg` | `page.tsx` → `EsgClient` | `esg.ts` · `fetchEsg` | Framer (carousels, lightbox) | Anton, DM Sans |
| **Careers** · `/careers` | `page.tsx` → `CareersClient` (→ `/api/careers`) | `careers.ts` · `fetchCareers` | Framer | Cormorant, DM Sans |
| **Contact Us** · `/contact-us` | `page.tsx` → `ContactClient` (→ `/api/contact`) | `contactUs.ts` · `fetchContactUs` | Framer (photo wheel) | Cormorant, DM Sans |
| **Investor Relations** · `/investor-relations` | `page.tsx` → `InvestorRelationsClient` | `investorRelations.ts` · `fetchInvestorRelations` | Framer | Cormorant, DM Sans |
| **Blog index** · `/blog` | `page.tsx` → `BlogIndex` | `post.ts`, `author.ts`, `tag.ts` · `fetchPosts` | Framer | Cormorant, DM Sans |
| **Blog post** · `/blog/[slug]` | `[slug]/page.tsx` → `PortableBody`, `AuthorCard`, `InlineImage`, `PullQuote` | `post.ts`, `blockContent.ts` · `fetchPost` | GSAP + Framer | Cormorant, DM Sans |
| **Global chrome** · all pages | `layout.tsx` → `Navbar`, `Footer`, `SiteChrome`, `SmoothScroll` | `siteSettings.ts` · `fetchSiteSettings` | Framer + Lenis | — |

**Follow the pointers for depth:**
- **What's on the page (sections) + is a value Sanity or hardcoded** → [02-COMPONENT-MAP.md](02-COMPONENT-MAP.md)
- **Every field in a schema + how an editor changes it** → [04-CONTENT-SANITY.md](04-CONTENT-SANITY.md#schema-by-schema)
- **How each animation works (snippets, cleanup rules)** → [06-ANIMATION.md](06-ANIMATION.md)
- **Fonts, colours, spacing, signature patterns** → [11-DESIGN-SYSTEM.md](11-DESIGN-SYSTEM.md)
- **The GROQ query behind each fetch fn** → `src/sanity/queries.ts` (search the fetch-fn name)

## Anatomy of a brand page

Each brand page (`babyDreams`, `bigen`, `emoform`) shares this skeleton:

- **`page.tsx`** (Server Component): `export const revalidate = 60`; `generateMetadata()` via `fetchPageSeo(<type>)` + `buildMetadata()`; fetches its brand doc with `fetch<Brand>()`; renders `<BreadcrumbSchema>` + the client component with data as props.
- **`<Brand>Client.tsx`** (`'use client'`): the whole visual page — hero, feature sections, and the two shared blocks: **`FactorySection`** ("Our Factory") and **`SocialStamps`** ("Follow us"). Fonts and palette are chosen per brand inside the client file.
- **Shared vs bespoke:** FactorySection + SocialStamps + (often) InlineVideo are shared components; the hero and mid-page storytelling sections are bespoke to each brand and hardcoded in structure (content still comes from Sanity fields).

## Recipe: add a new brand page

Goal: a developer who has never seen this repo can add a fully working, Sanity-editable brand page in an afternoon. Example new brand: **"NewBrand"** at `/newbrand`.

### 1. Schema
Create `src/sanity/schemas/newBrand.ts` (copy `emoform.ts` as the closest template — it's the smallest full brand). Give it `name: 'newBrand'`, `title: 'NewBrand'`, `type: 'document'`, field-group tabs, your hero/feature fields, and spread the shared helpers:
```ts
import { factoryFields } from './factory'
import { socialCardFields } from './socialCard'
import { seoFields } from './seoFields'
// ...fields: [ ...heroFields, ...factoryFields('factory'), ...socialCardFields('instagram','Instagram'), ...seoFields('seo') ]
```
Register it in `src/sanity/schemas/index.ts` (add `import newBrand` and put it in the `schemaTypes` array).

### 2. Studio sidebar
In `sanity.config.ts`, under **Our Brands**, add a `S.listItem()` pinned to a singleton id (copy the Emoform entry):
```ts
S.listItem().title('NewBrand').id('newBrand')
  .child(S.editor().id('newBrand').schemaType('newBrand').documentId('newBrand')),
```

### 3. Query + fetch
In `src/sanity/queries.ts`, add a `NewBrand` type, a `newBrandQuery` GROQ (use `imageWithLqip`, `factoryProjection`, `socialCardProjection('instagram')`), and a `fetchNewBrand()` that resolves images via `resolveImage()` (copy `fetchEmoform`).

### 4. Route
Create `src/app/newbrand/page.tsx`:
```tsx
import type { Metadata } from 'next'
import { fetchNewBrand } from '@/sanity/queries'
import { buildMetadata, fetchPageSeo } from '@/sanity/seo'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import NewBrandClient from './NewBrandClient'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    seo: await fetchPageSeo('newBrand'),
    title: 'NewBrand | JL Morison',
    description: '…',
    path: '/newbrand',
  })
}

export default async function Page() {
  const data = await fetchNewBrand()
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'NewBrand', url: '/newbrand' }]} />
      <NewBrandClient data={data} />
    </>
  )
}
```
Create `src/app/newbrand/NewBrandClient.tsx` (`'use client'`): build the hero + sections, and render `<FactorySection factory={data?.factory} />`, `<SocialStamps … />`, and `<Footer />` at the end (copy the structure from `EmoformClient`).

### 5. Navigation
In `src/components/Navbar.tsx`, add `'NewBrand'` to the `DROPDOWNS['Our Brands']` array so it appears in the menu. If it should be a homepage brand card, add it in Studio (Homepage → Brand cards) and add its canonical href to `CANONICAL_HREF` in `src/app/page.tsx`.

### 6. Sitemap + redirects
Add `{ path: '/newbrand', priority: 0.9, changeFrequency: 'weekly' }` to `STATIC_ROUTES` in `src/app/sitemap.ts`. If the brand replaces an old-site URL, add a 301 in `vercel.json`.

### 7. Media & content
Upload images in Studio; add any video via the [Tier-2 video runbook](05-MEDIA.md#tier-2-runbook-upload-a-video).

### 8. Finish
- Add the page + its components to [02-COMPONENT-MAP.md](02-COMPONENT-MAP.md) and this inventory.
- `npm run build` (types + lint), check the preview deploy, then merge.
