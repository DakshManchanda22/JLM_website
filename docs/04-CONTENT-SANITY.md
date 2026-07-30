# 04 · Content & Sanity

Two halves: **Part A** is a non-technical guide for the marketing editor. **Part B** is the technical schema reference for developers.

`Last updated: 2026-07-30`
`Maintainer:` TODO(verify)

---

# Part A — Editor guide

You can change most of the website yourself, without a developer, using **Sanity Studio**. You don't touch any code — you fill in fields and click Publish.

## Logging in

1. Go to **https://jlmorison.com/studio** (or the testing site: **https://jlm-website-testing.vercel.app/studio**).
2. Sign in with the **JLM_license** company account. TODO(verify): confirm which login method (Google / email) editors use.

<!-- SCREENSHOT: Sanity Studio login screen at /studio -->

## Studio tour

The left sidebar mirrors the website's menu, so content sits where you'd expect:

- **Mains** — Homepage, Philanthropy, ESG, Careers, Contact Us, Investor Relations
- **Our People** — Our Story, Leadership Team, Life at JLM
- **Our Brands** — Morisons Baby Dreams, Bigen, Emoform, Morisons
- **Blog** — Blog posts, Authors, Tags
- **Footer & site settings** — logo, footer links, address, socials

<!-- SCREENSHOT: Studio sidebar showing Mains / Our People / Our Brands / Blog / Footer groups -->

Most items are **singletons** — one fixed page you open and edit (e.g. Homepage). Blog posts, Authors, and Tags are **lists** you add to.

## Draft vs Publish

- Editing creates a **draft** (your unsaved-to-the-public changes). The website keeps showing the last **published** version.
- Click **Publish** (bottom right) to make a draft live.
- **The website does not show drafts** — nothing you type is public until you Publish.

<!-- SCREENSHOT: A document with the Publish button highlighted, showing draft state -->

> ### ⏱️ How long until my change appears live?
> After you click **Publish**, the change appears on the website within **about one minute** (up to ~60 seconds). If you don't see it, wait a minute and refresh. You do **not** need a developer or a "deploy" for content changes.

## Recipes

### Recipe: Publish a blog post
1. Sidebar → **Blog → Blog posts** → **Create** (or open an existing one).
2. Fill **Title**, then click **Generate** on **Slug** (this becomes the URL).
3. Add an **Excerpt** (short summary), a **Cover image** (with **Alt text** — required), and write the **Body**.
4. In the Body, use the **+** button to add subheadings, lists, images, and pull quotes.
5. Set **Author** (pick from Authors) and optionally **Tags**, **Read time**, and **Feature on blog index**.
6. Set **Published at** (defaults to now).
7. Optionally fill the **SEO** tab.
8. Click **Publish**.

<!-- SCREENSHOT: Blog post editor showing Content / Meta / SEO tabs and the Body "+" insert menu -->

### Recipe: Swap a homepage image
1. Sidebar → **Mains → Homepage**.
2. Use the tabs (Brand cards, Stats, Our Vision, Values image, Feature sections) to find the image.
3. Click the image field → remove the old one → upload the new one. Set the focal point (hotspot) if offered.
4. **Publish.**

<!-- SCREENSHOT: Homepage document with the field-group tabs across the top -->

### Recipe: Edit brand copy (Baby Dreams / Emoform / Bigen)
1. Sidebar → **Our Brands → <brand>**.
2. Use the tabs (Banner carousel, Products, Video, Factory, Social, SEO, etc.) to find the section.
3. Edit text/images. **Publish.**

> Videos are **not** uploaded here — you paste a video **link**. To add/replace the actual video file, follow the Tier-2 runbook in [05-MEDIA.md](05-MEDIA.md#tier-2-runbook-upload-a-video), then paste the resulting `videos.jlmorison.com/...` link into the video field.

### Recipe: Update a CSR / ESG / Philanthropy tile
1. Sidebar → **Mains → ESG** (or **Philanthropy**).
2. Find the stat cards / stages / gallery section and edit the text, numbers, or images.
3. **Publish.**

### Recipe: Edit the footer
1. Sidebar → **Footer & site settings**.
2. Edit **Company links**, **address** (one line per row), **social links** (blank = hidden), **follow text**, **copyright**, or upload the **Privacy Policy PDF**.
3. **Publish.**

### Recipe: Reorder the leadership team
1. Sidebar → **Our People → Leadership Team**.
2. **Drag** the cards up/down to set the order shown on the website.
3. Click a person to edit their photo, title, quote, and bio. Use **Add item** to add a new leader.
4. Removing a card here only takes them **off the page** — it does not delete the person.
5. **Publish.**

<!-- SCREENSHOT: Leadership Team singleton with draggable member cards -->

## SEO fields

Most pages have an **SEO** tab with:
- **SEO title** — the blue link on Google (aim 50–60 characters).
- **SEO description** — the grey text under it (aim 140–160 characters).
- **Share image (OG image)** — shown when the page is shared on WhatsApp/LinkedIn (1200×630px).
- **Share image — alt text.**

Leave any of these blank and the page falls back to a sensible default (its own title/excerpt/cover). Fill them to control exactly what Google and social previews show.

<!-- SCREENSHOT: The SEO tab of a document showing title / description / OG image fields -->

## Image rules for editors

- Upload the **largest good-quality** version you have — the website resizes automatically.
- Prefer **JPG/PNG** for photos; **SVG** for logos/icons.
- Always fill **Alt text** where asked (accessibility + SEO).
- Use the **hotspot** (focal point) tool so cropping keeps the important part in frame.
- Full size/weight guidance: [05-MEDIA.md](05-MEDIA.md#image-spec-sheet).

## What editors must never touch

- The **Vision / Studio** tool in the Studio sidebar (a developer query playground).
- Any field labelled **legacy** or **unused** (e.g. Homepage → the hidden legacy image, the Quote section — no longer shown on the site).
- Document **IDs** and **slugs** of existing live pages (changing a slug changes the URL and can break links — see below).

## Three things to check before messaging a developer

1. **Did you Publish?** A draft is invisible to the public.
2. **Did you wait ~1 minute** and hard-refresh (Cmd/Ctrl+Shift+R)?
3. **Are you editing the right document?** (e.g. the homepage image lives under Homepage, not the brand page.)

---

# Part B — Technical reference

## Project & datasets

- **Project ID:** `vfv5lxgr` · **Dataset:** `production` · **API version:** `2024-10-01`
- Client: anonymous, read-only, `perspective: 'published'`, `useCdn: false` (`src/sanity/client.ts`, `src/sanity/env.ts`).
- Studio: embedded at `/studio` via `next-sanity`'s `<NextStudio>`; sidebar structure + singleton pinning in `sanity.config.ts`.

## Schema registry (`src/sanity/schemas/index.ts`)

**Document types (19):** `post`, `author`, `tag`, `blockContent` (object), `homepage`, `leader`, `leadershipTeam`, `lifeAtJlm`, `ourStory`, `babyDreams`, `bigen`, `emoform`, `morisons`, `philanthropy`, `esg`, `careers`, `contactUs`, `investorRelations`, `siteSettings`.

**Shared field helpers (not registered as types):** `seoFields.ts`, `socialCard.ts`, `factory.ts` — spread into other schemas.

**Singletons** are enforced only by the Studio structure (`documentId` pinning in `sanity.config.ts`), not by `__experimental_actions`. Collections: `post`, `author`, `tag`, and `leader` (edited through the `leadershipTeam` order document).

## Schema-by-schema

Field lists below reflect what the site consumes (from `src/sanity/queries.ts`) plus the schema definitions. For exact validation/descriptions, read the schema file.

### post (`schemas/post.ts`)
`title`, `slug`, `excerpt` (≤280), `coverImage{alt required}`, `body` (blockContent), `author→`, `tags[]→tag`, `publishedAt`, `readTime?`, `featured`, + `seoFields('seo')`. Groups: Content / Meta / SEO. Ordered newest-first.

### author (`schemas/author.ts`)
`name`, `slug`, `avatar{alt}`, `bio`, `role`.

### tag (`schemas/tag.ts`)
`title`, `slug`, `description?`.

### blockContent (`schemas/blockContent.ts`)
Portable Text array: styles normal/h2/h3/blockquote; bullet + number lists; strong/em marks; `link` annotation; custom blocks **`inlineImage`** (`alt` required, `caption?`, `fullBleed`) and **`pullQuote`** (`quote` required, `attribution?`).

### homepage (`schemas/homepage.ts`) — singleton
Groups: Brand cards / Stats / Our Vision / Values image / Feature sections / Quote / SEO.
- `vision{label, text}`
- `brandsHeading`, `brands[]{name, shortName, tagline, href, image}` (1–6)
- `statsHeading`, `stats[]{number, label, body, icon(SVG), cardColor, showIconBox, iconBgColor, iconColor, iconSize}` (1–20)
- `showValuesImage` (default true), `valuesImage`
- `features[]{eyebrow, headline, body, ctaLabel, href, images[], imageIntervalSeconds, image(fallback), imageRight}` (≤6)
- `quote{lines[], attribution}` — **legacy, no longer rendered**
- `image` — **hidden legacy field**
- `seoFields('seo')`

### leader (`schemas/leader.ts`)
`name`, `slug`, `title`, `order` (fallback sort), `image{alt}?`, `quote?`, `linkedin?`, `email?`, `bio[]` (paragraphs).

### leadershipTeam (`schemas/leadershipTeam.ts`) — singleton
`members[]→leader` (drag order) + `seoFields()`. The site shows `members[]` order, then appends any unplaced leader by `order` (see `fetchLeaders()` in `queries.ts`).

### siteSettings (`schemas/siteSettings.ts`) — singleton
Groups Brand / Footer. `logo`; `footerCompanyLinks[]{label, href, external}`; `footerAddress[]`; `footerSocial{linkedin, instagram, facebook, youtube, twitter}`; `footerFollowText`; `privacyPolicyFile` (PDF upload) or `privacyPolicyUrl`; `footerCopyright`.

### Brand pages (singletons): babyDreams, bigen, emoform, morisons
Full field lists in each schema file; the exact projections the site reads are in `queries.ts` (`babyDreamsQuery`, `bigenQuery`, `emoformQuery`, `morisonsQuery`). Common pieces:
- **Factory** fields via `factoryFields(group)` → `factoryHeading/Image/Description`, `certifications[]{name, logo?}`.
- **Social** fields via `socialCardFields(platform)` → per-platform `Followers`, `CardHeading`, `CardSubcopy`, `CardImage` + `<platform>Url`.
- Videos: brand docs expose a `videoUrl` string (paste a `videos.jlmorison.com` link).

### Page singletons: ourStory, lifeAtJlm, philanthropy, esg, careers, contactUs, investorRelations
Field models are enumerated by the matching `*Query` and TypeScript type in `queries.ts` (e.g. `ourStoryQuery`/`OurStory`, `esgQuery`/`EsgView`). `careers` and `contactUs` include `recipientEmails[]` (drives who receives form submissions, overriding env fallbacks). `investorRelations` is mostly arrays of document links (`{label, file→url | url}`).

## GROQ patterns

- All queries + `fetch*()` helpers live in **`src/sanity/queries.ts`**. Each `fetch*()` returns `[]`/`null` when the client is unconfigured, so pages degrade to fallbacks.
- Images: fetched with the `imageWithLqip` fragment (`..., "lqip": asset->metadata.lqip`, `src/sanity/resolveImage.ts`), then resolved via `resolveImage()` → optimised `cdn.sanity.io` URL + blur placeholder. `urlFor()` (`src/sanity/image.ts`) applies `.auto('format').fit('max').quality(75)`.
- SEO: `seoProjection` + `fetchPageSeo(type)` + `buildMetadata()` in `src/sanity/seo.ts`.
- Files (PDFs): projected as `"fileUrl": file.asset->url` and coalesced with a pasted `url`.

## Portable Text serializers

`src/components/blog/PortableBody.tsx` maps blocks → React: `normal/h2/h3/blockquote`, bullet/number lists, `strong/em/link` marks, and custom types `inlineImage` (→ `InlineImage`, supports `fullBleed`) and `pullQuote` (→ `PullQuote`). Fonts: Cormorant Garamond (headings) + DM Sans (body).

## How to add a field (end to end)

1. Add the field to the schema in `src/sanity/schemas/<type>.ts` (with `title`, `description`, validation, and a `group` if the schema uses tabs).
2. Add it to the type's GROQ projection and TypeScript type in `src/sanity/queries.ts`; resolve images via `resolveImage`/`imageWithLqip`.
3. Consume it in the page/component; pass through `page.tsx` props to the client component.
4. Update [02-COMPONENT-MAP.md](02-COMPONENT-MAP.md).
5. `npm run build` to confirm types, then publish content in Studio.

## Revalidation wiring

Pages use `export const revalidate = 60`, so published edits appear within ~60s. There is **no** Sanity → Vercel webhook for on-demand revalidation today. TODO(verify): add one if editors need instant updates (Sanity → API → Webhooks pointing at a Next revalidation route).
