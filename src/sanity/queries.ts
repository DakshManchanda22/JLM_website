/* eslint-disable @typescript-eslint/no-explicit-any */
import { groq } from 'next-sanity'

import { client } from './client'
import { imageWithLqip, resolveImage } from './resolveImage'

/* ── Social "stamp" cards (brand Follow us sections) ──────────────────── */
export type SocialCardContent = {
  followers?: string
  heading?: string
  subcopy?: string
  image?: string
  lqip?: string
}

/** GROQ fragment for one platform's card fields. */
const socialCardProjection = (p: string) =>
  `${p}Followers, ${p}CardHeading, ${p}CardSubcopy, ${p}CardImage{ ${imageWithLqip} }`

/** Map the raw fields for one platform into a SocialCardContent. */
function resolveSocialCard(raw: any, p: string): SocialCardContent {
  const img = resolveImage(raw[`${p}CardImage`], 900)
  return {
    followers: raw[`${p}Followers`],
    heading: raw[`${p}CardHeading`],
    subcopy: raw[`${p}CardSubcopy`],
    image: img?.url,
    lqip: img?.lqip,
  }
}

/* ── "Our Factory" section (shared across brand pages) ────────────────── */
export type FactoryCert = { name: string; logo?: string; logoLqip?: string }
export type FactoryContent = {
  heading?: string
  description?: string
  image?: string
  imageLqip?: string
  certifications?: FactoryCert[]
}

/** GROQ fragment for the shared factory fields (see schemas/factory.ts). */
export const factoryProjection = groq`
  factoryHeading,
  factoryDescription,
  factoryImage{ ${imageWithLqip} },
  certifications[]{ name, logo{ ${imageWithLqip} } },
`

/** Map the raw factory fields into a FactoryContent, or undefined if empty. */
function resolveFactory(raw: any): FactoryContent | undefined {
  if (!raw) return undefined
  const img = resolveImage(raw.factoryImage, 1800)
  const certifications = (raw.certifications || []).flatMap((c: any) => {
    if (!c?.name) return []
    const logo = resolveImage(c.logo, 400)
    return [{ name: c.name, logo: logo?.url, logoLqip: logo?.lqip }]
  })
  // Nothing to show unless there's at least an image, description or a badge.
  if (!img && !raw.factoryDescription && certifications.length === 0) return undefined
  return {
    heading: raw.factoryHeading,
    description: raw.factoryDescription,
    image: img?.url,
    imageLqip: img?.lqip,
    certifications,
  }
}

export type PostListItem = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  coverImage: {
    asset: { _ref: string }
    alt?: string
  }
  publishedAt: string
  readTime?: number
  featured?: boolean
  author: {
    name: string
    avatar?: { asset: { _ref: string }; alt?: string }
  }
  tags?: { title: string; slug: string }[]
}

export type Post = PostListItem & {
  body: any
  author: PostListItem['author'] & {
    bio?: string
    role?: string
    slug?: string
  }
  _updatedAt?: string
  seoTitle?: string
  seoDescription?: string
  ogImage?: { asset: { _ref: string } }
  ogImageAlt?: string
}

const postProjection = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage{ ${imageWithLqip} },
  publishedAt,
  readTime,
  featured,
  "author": author->{
    name,
    "slug": slug.current,
    avatar,
    bio,
    role,
  },
  "tags": tags[]->{ title, "slug": slug.current }
`

export const postListQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  ${postProjection}
}`

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  ${postProjection},
  _updatedAt,
  body,
  seoTitle,
  seoDescription,
  ogImage,
  ogImageAlt
}`

export const postSlugsQuery = groq`*[_type == "post" && defined(slug.current)][].slug.current`

/** Slug + last-modified for each post — used by the dynamic sitemap. */
export const postSitemapQuery = groq`*[_type == "post" && defined(slug.current)]{
  "slug": slug.current,
  _updatedAt
}`

export async function fetchPostsForSitemap(): Promise<
  { slug: string; _updatedAt: string }[]
> {
  if (!client) return []
  return client.fetch(postSitemapQuery)
}

export async function fetchPosts(): Promise<PostListItem[]> {
  if (!client) return []
  return client.fetch(postListQuery)
}

export async function fetchPost(slug: string): Promise<Post | null> {
  if (!client) return null
  return client.fetch(postBySlugQuery, { slug })
}

export async function fetchPostSlugs(): Promise<string[]> {
  if (!client) return []
  return client.fetch(postSlugsQuery)
}

/* ─────────────────────── Site settings (footer) ─────────────────────── */

export type FooterLinkData = { label: string; href: string; external?: boolean }

export type SiteSettings = {
  logoUrl?: string
  footerCompanyLinks?: FooterLinkData[]
  footerAddress?: string[]
  footerSocial?: {
    linkedin?: string
    instagram?: string
    facebook?: string
    youtube?: string
    twitter?: string
  }
  footerFollowText?: string
  footerCopyright?: string
  /** Uploaded PDF wins; otherwise the pasted URL. Drives the footer link. */
  privacyPolicyUrl?: string
}

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  "logoUrl": logo.asset->url,
  footerCompanyLinks[]{ label, href, external },
  footerAddress,
  footerSocial{ linkedin, instagram, facebook, youtube, twitter },
  footerFollowText,
  footerCopyright,
  "privacyPolicyUrl": coalesce(privacyPolicyFile.asset->url, privacyPolicyUrl),
}`

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  if (!client) return null
  return client.fetch(siteSettingsQuery)
}

/* ─────────────────────── Homepage singleton ─────────────────────── */

export type BrandCardData = {
  name: string
  shortName?: string
  tagline: string
  href: string
  image: any
}

export type StatData = {
  number: string
  label: string
  body: string
}

export type HomeFeatureData = {
  eyebrow?: string
  headline: string
  body?: string
  ctaLabel: string
  href: string
  image: any
  images?: any[]
  imageIntervalSeconds?: number
  imageRight?: boolean
}

export type Homepage = {
  vision?: {
    label?: string
    text?: string
    image?: any
  }
  quote?: {
    lines?: string[]
    attribution?: string
  }
  showValuesImage?: boolean
  valuesImage?: any
  brandsHeading?: string
  brands?: BrandCardData[]
  statsHeading?: string
  stats?: StatData[]
  features?: HomeFeatureData[]
}

export const homepageQuery = groq`*[_type == "homepage"][0]{
  vision{
    label,
    text,
    image{
      ${imageWithLqip},
      "aspect": asset->metadata.dimensions.aspectRatio,
    },
  },
  quote{
    lines,
    attribution,
  },
  showValuesImage,
  valuesImage{
    ${imageWithLqip},
    "aspect": asset->metadata.dimensions.aspectRatio,
  },
  brandsHeading,
  brands[]{
    name,
    shortName,
    tagline,
    href,
    image{ ${imageWithLqip} },
  },
  statsHeading,
  stats[]{
    number,
    label,
    body,
  },
  features[]{
    eyebrow,
    headline,
    body,
    ctaLabel,
    href,
    imageRight,
    imageIntervalSeconds,
    images[]{ ${imageWithLqip} },
    image{ ${imageWithLqip} },
  },
}`

export async function fetchHomepage(): Promise<Homepage | null> {
  if (!client) return null
  return client.fetch(homepageQuery)
}

/* ───────────────────────── Leadership ───────────────────────── */

export type Leader = {
  name: string
  slug: string
  title: string
  order: number
  image: any
  quote?: string
  linkedin?: string
  email?: string
  bio?: string[]
}

const leaderProjection = groq`
  name,
  "slug": slug.current,
  title,
  order,
  image{ ${imageWithLqip} },
  quote,
  linkedin,
  email,
  bio
`

export const leaderListQuery = groq`*[_type == "leader" && defined(slug.current)] | order(order asc) {
  ${leaderProjection}
}`

export const leaderBySlugQuery = groq`*[_type == "leader" && slug.current == $slug][0]{
  ${leaderProjection}
}`

export const leaderSlugsQuery = groq`*[_type == "leader" && defined(slug.current)][].slug.current`

/** Fetches both the drag-ordered list (from the Leadership order singleton) and
    the full leader list (fallback order by number), in one round-trip. */
export const leadersOrderedQuery = groq`{
  "ordered": *[_type == "leadershipTeam"][0].members[]->{ ${leaderProjection} },
  "all": *[_type == "leader" && defined(slug.current)] | order(order asc) { ${leaderProjection} },
}`

export async function fetchLeaders(): Promise<Leader[]> {
  if (!client) return []
  const { ordered, all }: { ordered?: (Leader | null)[]; all?: Leader[] } =
    await client.fetch(leadersOrderedQuery)

  const allLeaders = all ?? []
  const orderedLeaders = (ordered ?? []).filter(
    (l): l is Leader => Boolean(l && l.slug),
  )
  // No custom order set yet → keep the historical number ordering.
  if (orderedLeaders.length === 0) return allLeaders

  // Honour the drag order first, then append anyone not placed in the list so a
  // newly-added leader never silently disappears from the page.
  const placed = new Set(orderedLeaders.map((l) => l.slug))
  const rest = allLeaders.filter((l) => !placed.has(l.slug))
  return [...orderedLeaders, ...rest]
}

export async function fetchLeader(slug: string): Promise<Leader | null> {
  if (!client) return null
  return client.fetch(leaderBySlugQuery, { slug })
}

export async function fetchLeaderSlugs(): Promise<string[]> {
  if (!client) return []
  return client.fetch(leaderSlugsQuery)
}

/* ───────────────────────── Life at JL Morison ───────────────────────── */

export type LifeAtJlm = {
  showIntro?: boolean
  introImages?: any[]
  introFinalImage?: any
  heroImage?: any
  heroLine1?: string
  heroLine2?: string
  heroCaptionSmall?: string
  heroCaptionLarge?: string
  captionStrip?: { image: any; caption?: string; aspect?: number; lqip?: string }[]
  introStatement?: string
  arentHeadline?: string
  arentBody?: string
  testimonials?: { quote: string; name: string; role: string }[]
  carouselSpeed?: number
}

export const lifeAtJlmQuery = groq`*[_type == "lifeAtJlm"][0]{
  showIntro,
  introImages[]{ ${imageWithLqip} },
  introFinalImage{ ${imageWithLqip} },
  heroImage{ ${imageWithLqip} },
  heroLine1,
  heroLine2,
  heroCaptionSmall,
  heroCaptionLarge,
  captionStrip[]{ image{ ${imageWithLqip} }, caption, "aspect": image.asset->metadata.dimensions.aspectRatio },
  introStatement,
  arentHeadline, arentBody,
  testimonials[]{ quote, name, role },
  carouselSpeed,
}`

export async function fetchLifeAtJlm(): Promise<LifeAtJlm | null> {
  if (!client) return null
  return client.fetch(lifeAtJlmQuery)
}

/* ───────────────────────── Our Story ───────────────────────── */

export type OurStoryJourneyStage = {
  period?: string
  name: string
  note?: string
}

export type OurStoryEra = {
  number: string
  dateRange: string
  title: string
  body: string
  image?: any
}

export type OurStoryPillar = {
  name: string
  description?: string
}

export type OurStory = {
  // Hero
  eyebrow?: string
  headlineTop?: string
  headlineBottom?: string
  heroTagline?: string
  establishedMark?: string
  introVideo?: { videoUrl?: string; poster?: any }
  // Journey
  journeyEyebrow?: string
  journeyHeadline?: string
  journeyStages?: OurStoryJourneyStage[]
  // Eras
  erasEyebrow?: string
  erasHeadline?: string
  eras?: OurStoryEra[]
  // Pillars
  pillars?: OurStoryPillar[]
  // Closing
  closingLine?: string
  closingSubline?: string
  signatureName?: string
  signatureNote?: string
}

export const ourStoryQuery = groq`*[_type == "ourStory"][0]{
  eyebrow,
  headlineTop,
  headlineBottom,
  heroTagline,
  establishedMark,
  introVideo{
    "videoUrl": coalesce(videoFile.asset->url, videoUrl),
    poster{ ${imageWithLqip} },
  },
  journeyEyebrow,
  journeyHeadline,
  journeyStages[]{ period, name, note },
  erasEyebrow,
  erasHeadline,
  eras[]{
    number,
    dateRange,
    title,
    body,
    image{ ${imageWithLqip} },
  },
  pillars[]{ name, description },
  closingLine,
  closingSubline,
  signatureName,
  signatureNote,
}`

export async function fetchOurStory(): Promise<OurStory | null> {
  if (!client) return null
  return client.fetch(ourStoryQuery)
}

/* ─────────────────────────── Bigen ─────────────────────────── */

export type BigenReel = {
  url: string
  name?: string
}

export type BigenFeature = { label?: string; icon?: 'sparkle' | 'drop' }

export type BigenProduct = {
  name?: string
  desc?: string
  image?: string
  lqip?: string
  href?: string
}

export type Bigen = {
  // hero
  heroLogo?: string
  heroHeadline1?: string
  heroHeadline2?: string
  heroHeadline3?: string
  heroEyebrow?: string
  heroCtaLabel?: string
  heroCtaHref?: string
  heroImage?: string
  heroImageLqip?: string
  // video
  videoHeadline?: any[]
  videoUrl?: string
  videoThumbnail?: string
  videoThumbnailLqip?: string
  // ritual
  ritualHeadlinePlain?: string
  ritualHeadlineItalic1?: string
  ritualHeadlineItalic2?: string
  ritualBody?: any[]
  ritualFeatures?: BigenFeature[]
  ritualImage?: string
  ritualImageLqip?: string
  // shine
  shineBannerTop?: string
  shineBannerBottom?: string
  shineHeadline?: any[]
  shineBody?: any[]
  shinePillLabel?: string
  shineImage?: string
  shineImageLqip?: string
  // testimonials
  testimonialsHeadline?: any[]
  reels?: BigenReel[]
  // range
  rangeEyebrow?: string
  rangeHeadline?: any[]
  products?: BigenProduct[]
  factory?: FactoryContent
  // social
  instagramUrl?: string
  facebookUrl?: string
  instagramCard?: SocialCardContent
  facebookCard?: SocialCardContent
}

export const bigenQuery = groq`*[_type == "bigen"][0]{
  "heroLogo": heroLogo.asset->url,
  heroHeadline1, heroHeadline2, heroHeadline3, heroEyebrow,
  heroCtaLabel, heroCtaHref,
  heroImage{ ${imageWithLqip} },
  videoHeadline, videoUrl,
  videoThumbnail{ ${imageWithLqip} },
  ritualHeadlinePlain, ritualHeadlineItalic1, ritualHeadlineItalic2, ritualBody,
  ritualFeatures[]{ label, icon },
  ritualImage{ ${imageWithLqip} },
  shineBannerTop, shineBannerBottom, shineHeadline, shineBody,
  shinePillLabel,
  shineImage{ ${imageWithLqip} },
  testimonialsHeadline,
  reels[]{ url, name },
  rangeEyebrow, rangeHeadline,
  products[]{ name, desc, href, image{ ${imageWithLqip} } },
  ${factoryProjection}
  instagramUrl,
  facebookUrl,
  ${socialCardProjection('instagram')},
  ${socialCardProjection('facebook')},
}`

export async function fetchBigen(): Promise<Bigen | null> {
  if (!client) return null
  const raw: any = await client.fetch(bigenQuery)
  if (!raw) return null

  // Route Sanity images through urlFor (auto-format, width cap, quality) and
  // surface their LQIP blur placeholders. Local/default paths are untouched.
  const hero = resolveImage(raw.heroImage, 1600)
  const ritual = resolveImage(raw.ritualImage, 1400)
  const shine = resolveImage(raw.shineImage, 1400)
  const videoThumb = resolveImage(raw.videoThumbnail, 1600)

  return {
    ...raw,
    heroImage: hero?.url,
    heroImageLqip: hero?.lqip,
    videoThumbnail: videoThumb?.url,
    videoThumbnailLqip: videoThumb?.lqip,
    ritualImage: ritual?.url,
    ritualImageLqip: ritual?.lqip,
    shineImage: shine?.url,
    shineImageLqip: shine?.lqip,
    products: (raw.products || []).map((p: any) => {
      const r = resolveImage(p.image, 800)
      return { ...p, image: r?.url, lqip: r?.lqip }
    }),
    factory: resolveFactory(raw),
    instagramCard: resolveSocialCard(raw, 'instagram'),
    facebookCard: resolveSocialCard(raw, 'facebook'),
  }
}

/* ─────────────────────────── Emoform ─────────────────────────── */

export type EmoformStepView = {
  tag?: string
  title?: string
  sub?: string
  image?: string
  imageLqip?: string
  points?: string[]
}

export type EmoformView = {
  heroLine1?: string
  heroLine2?: string
  heroFlag?: string
  heroImage?: string
  heroImageLqip?: string
  featuresTitleTop?: string
  featuresTitleBottom?: string
  features?: string[]
  featuresImage?: string
  featuresImageLqip?: string
  steps?: EmoformStepView[]
  factory?: FactoryContent
  ctaTitle?: string
  ctaSubtext?: string
  ctaButtonLabel?: string
  ctaButtonHref?: string
  instagramUrl?: string
  facebookUrl?: string
  instagramCard?: SocialCardContent
  facebookCard?: SocialCardContent
}

export const emoformQuery = groq`*[_type == "emoform"][0]{
  heroLine1, heroLine2, heroFlag,
  heroImage{ ${imageWithLqip} },
  featuresTitleTop, featuresTitleBottom, features,
  featuresImage{ ${imageWithLqip} },
  steps[]{ tag, title, sub, image{ ${imageWithLqip} }, points },
  ${factoryProjection}
  ctaTitle, ctaSubtext, ctaButtonLabel, ctaButtonHref,
  instagramUrl, facebookUrl,
  ${socialCardProjection('instagram')},
  ${socialCardProjection('facebook')},
}`

export async function fetchEmoform(): Promise<EmoformView | null> {
  if (!client) return null
  const raw: any = await client.fetch(emoformQuery)
  if (!raw) return null

  const hero = resolveImage(raw.heroImage, 1600)
  const feat = resolveImage(raw.featuresImage, 1200)

  return {
    heroLine1: raw.heroLine1,
    heroLine2: raw.heroLine2,
    heroFlag: raw.heroFlag,
    heroImage: hero?.url,
    heroImageLqip: hero?.lqip,
    featuresTitleTop: raw.featuresTitleTop,
    featuresTitleBottom: raw.featuresTitleBottom,
    features: raw.features,
    featuresImage: feat?.url,
    featuresImageLqip: feat?.lqip,
    steps: (raw.steps || []).map((st: any) => {
      const im = resolveImage(st.image, 1400)
      return {
        tag: st.tag,
        title: st.title,
        sub: st.sub,
        image: im?.url,
        imageLqip: im?.lqip,
        points: st.points,
      }
    }),
    factory: resolveFactory(raw),
    ctaTitle: raw.ctaTitle,
    ctaSubtext: raw.ctaSubtext,
    ctaButtonLabel: raw.ctaButtonLabel,
    ctaButtonHref: raw.ctaButtonHref,
    instagramUrl: raw.instagramUrl,
    facebookUrl: raw.facebookUrl,
    instagramCard: resolveSocialCard(raw, 'instagram'),
    facebookCard: resolveSocialCard(raw, 'facebook'),
  }
}

/* ─────────────────── Morisons Baby Dreams ─────────────────── */

export type BabyBanner = { image?: string; lqip?: string; alt?: string; href?: string }

export type BabyTint = 'mint' | 'blush' | 'butter' | 'lilac' | 'sky'

export type BabyCategory = {
  title?: string
  blurb?: string
  image?: string
  lqip?: string
  tint?: BabyTint
  href?: string
}

export type BabyDreams = {
  bannerInterval?: number
  banners?: BabyBanner[]
  productsHeadline?: string
  productsIntro?: string
  categories?: BabyCategory[]
  videoHeadline?: string
  videoUrl?: string
  videoPoster?: string
  rangeHeadline?: string
  rangeIntro?: string
  factory?: FactoryContent
  blogsHeadline?: string
  blogsIntro?: string
  blogsCarouselSpeed?: number
  instagramUrl?: string
  facebookUrl?: string
  youtubeUrl?: string
  instagramCard?: SocialCardContent
  facebookCard?: SocialCardContent
  youtubeCard?: SocialCardContent
}

export const babyDreamsQuery = groq`*[_type == "babyDreams"][0]{
  bannerInterval,
  banners[]{ image{ ${imageWithLqip} }, alt, href },
  productsHeadline, productsIntro,
  categories[]{ title, blurb, image{ ${imageWithLqip} }, tint, href },
  videoHeadline, videoUrl,
  videoPoster{ ${imageWithLqip} },
  rangeHeadline, rangeIntro,
  ${factoryProjection}
  blogsHeadline, blogsIntro, blogsCarouselSpeed,
  instagramUrl, facebookUrl, youtubeUrl,
  ${socialCardProjection('instagram')},
  ${socialCardProjection('facebook')},
  ${socialCardProjection('youtube')},
}`

export async function fetchBabyDreams(): Promise<BabyDreams | null> {
  if (!client) return null
  const raw: any = await client.fetch(babyDreamsQuery)
  if (!raw) return null

  const poster = resolveImage(raw.videoPoster, 1600)

  return {
    bannerInterval: raw.bannerInterval,
    banners: (raw.banners || []).map((b: any) => {
      const r = resolveImage(b.image, 2400)
      return { image: r?.url, lqip: r?.lqip, alt: b.alt, href: b.href }
    }),
    productsHeadline: raw.productsHeadline,
    productsIntro: raw.productsIntro,
    categories: (raw.categories || []).map((c: any) => {
      const r = resolveImage(c.image, 1000)
      return {
        title: c.title,
        blurb: c.blurb,
        image: r?.url,
        lqip: r?.lqip,
        tint: c.tint,
        href: c.href,
      }
    }),
    videoHeadline: raw.videoHeadline,
    videoUrl: raw.videoUrl,
    videoPoster: poster?.url,
    rangeHeadline: raw.rangeHeadline,
    rangeIntro: raw.rangeIntro,
    factory: resolveFactory(raw),
    blogsHeadline: raw.blogsHeadline,
    blogsIntro: raw.blogsIntro,
    blogsCarouselSpeed: raw.blogsCarouselSpeed,
    instagramUrl: raw.instagramUrl,
    facebookUrl: raw.facebookUrl,
    youtubeUrl: raw.youtubeUrl,
    instagramCard: resolveSocialCard(raw, 'instagram'),
    facebookCard: resolveSocialCard(raw, 'facebook'),
    youtubeCard: resolveSocialCard(raw, 'youtube'),
  }
}

/* ─────────────────────────── Philanthropy ─────────────────────────── */

export type PhilanthropyStage = {
  title?: string
  lead?: string
  body?: string
  /** Candidate images — the client picks one at random per visit. */
  images?: { url: string; lqip?: string }[]
}

export type PhilanthropyView = {
  heroLine1?: string
  heroLine2?: string
  heroImage?: string
  heroImageLqip?: string
  videoUrl?: string
  videoPoster?: string
  videoPosterLqip?: string
  differenceHeadingLine1?: string
  differenceHeadingLine2?: string
  differenceBody?: string
  differenceCtaLabel?: string
  differenceCtaHref?: string
  differenceImage?: string
  differenceImageLqip?: string
  programsHeading?: string
  programsIntro?: string
  stages?: PhilanthropyStage[]
  impactLogo?: string
  impactLogoLqip?: string
  impactHeading?: string
  impactIntro?: string
  impactStats?: { value?: string; label?: string }[]
}

export const philanthropyQuery = groq`*[_type == "philanthropy"][0]{
  heroLine1, heroLine2,
  heroImage{ ${imageWithLqip} },
  "videoUrl": coalesce(videoFile.asset->url, videoUrl),
  videoPoster{ ${imageWithLqip} },
  differenceHeadingLine1, differenceHeadingLine2, differenceBody,
  differenceCtaLabel, differenceCtaHref,
  differenceImage{ ${imageWithLqip} },
  programsHeading, programsIntro,
  stages[]{
    title, lead, body,
    images[]{ ${imageWithLqip} },
  },
  impactLogo{ ${imageWithLqip} },
  impactHeading, impactIntro,
  impactStats[]{ value, label },
}`

export async function fetchPhilanthropy(): Promise<PhilanthropyView | null> {
  if (!client) return null
  const raw: any = await client.fetch(philanthropyQuery)
  if (!raw) return null

  const hero = resolveImage(raw.heroImage, 2000)
  const diff = resolveImage(raw.differenceImage, 1400)

  return {
    heroLine1: raw.heroLine1,
    heroLine2: raw.heroLine2,
    heroImage: hero?.url,
    heroImageLqip: hero?.lqip,
    videoUrl: raw.videoUrl,
    videoPoster: resolveImage(raw.videoPoster, 2000)?.url,
    videoPosterLqip: resolveImage(raw.videoPoster, 2000)?.lqip,
    differenceHeadingLine1: raw.differenceHeadingLine1,
    differenceHeadingLine2: raw.differenceHeadingLine2,
    differenceBody: raw.differenceBody,
    differenceCtaLabel: raw.differenceCtaLabel,
    differenceCtaHref: raw.differenceCtaHref,
    differenceImage: diff?.url,
    differenceImageLqip: diff?.lqip,
    programsHeading: raw.programsHeading,
    programsIntro: raw.programsIntro,
    stages: (raw.stages || []).map((s: any) => ({
      title: s.title,
      lead: s.lead,
      body: s.body,
      images: (s.images || [])
        .map((im: any) => {
          const r = resolveImage(im, 1200)
          return r ? { url: r.url, lqip: r.lqip } : null
        })
        .filter(Boolean),
    })),
    impactLogo: resolveImage(raw.impactLogo, 1200)?.url,
    impactLogoLqip: resolveImage(raw.impactLogo, 1200)?.lqip,
    impactHeading: raw.impactHeading,
    impactIntro: raw.impactIntro,
    impactStats: (raw.impactStats || [])
      .map((s: any) => ({ value: s.value, label: s.label }))
      .filter((s: any) => s.value && s.label),
  }
}

/* ─────────────────────────── ESG ─────────────────────────── */

export type PhilanthropyStatCard = {
  title?: string
  value?: string
  body?: string
  tag?: string
  icon?: string
  image?: string
  lqip?: string
}

export type EsgView = {
  purposeEyebrow?: string
  purposeHeading?: string
  useBannerImage?: boolean
  bannerImage?: string
  bannerImageLqip?: string
  bannerImageAspect?: number
  purposeBackgroundWord?: string
  purposeImages?: { url: string; lqip?: string }[]
  beliefEyebrow?: string
  beliefText?: string
  statCards?: PhilanthropyStatCard[]
  esgWord?: string
  esgIntro?: string
  esgGallery?: { url: string; lqip?: string; w: number; h: number }[]
  socialWord?: string
  socialGallery?: { url: string; lqip?: string; w: number; h: number }[]
  carouselSpeed?: number
  policiesHeading?: string
  policiesIntro?: string
  policiesImage?: string
  policiesImageLqip?: string
  policyDocuments?: { title?: string; url?: string }[]
}

export const esgQuery = groq`*[_type == "esg"][0]{
  purposeEyebrow, purposeHeading, useBannerImage,
  bannerImage{
    ${imageWithLqip},
    "dw": asset->metadata.dimensions.width,
    "dh": asset->metadata.dimensions.height,
  },
  purposeBackgroundWord,
  purposeImages[]{ ${imageWithLqip} },
  beliefEyebrow, beliefText,
  statCards[]{ title, value, body, tag, icon, image{ ${imageWithLqip} } },
  esgWord, esgIntro,
  esgGallery[]{
    ${imageWithLqip},
    "dw": asset->metadata.dimensions.width,
    "dh": asset->metadata.dimensions.height,
  },
  socialWord,
  socialGallery[]{
    ${imageWithLqip},
    "dw": asset->metadata.dimensions.width,
    "dh": asset->metadata.dimensions.height,
  },
  carouselSpeed,
  policiesHeading, policiesIntro,
  policiesImage{ ${imageWithLqip} },
  policyDocuments[]{ title, "fileUrl": file.asset->url, url },
}`

export async function fetchEsg(): Promise<EsgView | null> {
  if (!client) return null
  const raw: any = await client.fetch(esgQuery)
  if (!raw) return null

  const banner = resolveImage(raw.bannerImage, 2400)
  return {
    purposeEyebrow: raw.purposeEyebrow,
    purposeHeading: raw.purposeHeading,
    useBannerImage: raw.useBannerImage,
    bannerImage: banner?.url,
    bannerImageLqip: banner?.lqip,
    bannerImageAspect:
      raw.bannerImage?.dw && raw.bannerImage?.dh
        ? raw.bannerImage.dw / raw.bannerImage.dh
        : undefined,
    purposeBackgroundWord: raw.purposeBackgroundWord,
    purposeImages: (raw.purposeImages || [])
      .map((im: any) => {
        const r = resolveImage(im, 1400)
        return r ? { url: r.url, lqip: r.lqip } : null
      })
      .filter(Boolean),
    beliefEyebrow: raw.beliefEyebrow,
    beliefText: raw.beliefText,
    statCards: (raw.statCards || []).map((s: any) => {
      const im = resolveImage(s.image, 1000)
      return {
        title: s.title,
        value: s.value,
        body: s.body,
        tag: s.tag,
        icon: s.icon,
        image: im?.url,
        lqip: im?.lqip,
      }
    }),
    esgWord: raw.esgWord,
    esgIntro: raw.esgIntro,
    esgGallery: (raw.esgGallery || [])
      .map((im: any) => {
        const r = resolveImage(im, 1200)
        if (!r) return null
        return { url: r.url, lqip: r.lqip, w: im.dw || 1000, h: im.dh || 1000 }
      })
      .filter(Boolean),
    socialWord: raw.socialWord,
    carouselSpeed: raw.carouselSpeed,
    socialGallery: (raw.socialGallery || [])
      .map((im: any) => {
        const r = resolveImage(im, 1400)
        if (!r) return null
        return { url: r.url, lqip: r.lqip, w: im.dw || 1000, h: im.dh || 1000 }
      })
      .filter(Boolean),
    policiesHeading: raw.policiesHeading,
    policiesIntro: raw.policiesIntro,
    policiesImage: resolveImage(raw.policiesImage, 1400)?.url,
    policiesImageLqip: resolveImage(raw.policiesImage, 1400)?.lqip,
    policyDocuments: (raw.policyDocuments || [])
      // An uploaded PDF file wins; otherwise fall back to a pasted URL.
      .map((d: any) => ({ title: d.title, url: d.fileUrl || d.url }))
      .filter((d: any) => d.title && d.url),
  }
}

/* ─────────────────────────── Morisons (house brand) ─────────────────────────── */

export type MorisonsView = {
  poster?: string
  posterLqip?: string
  posterAlt?: string
  /** width / height of the poster, so it can be shown at its true aspect ratio. */
  posterAspect?: number
  seoTitle?: string
  seoDescription?: string
  ogImage?: string
}

export const morisonsQuery = groq`*[_type == "morisons"][0]{
  poster{ ${imageWithLqip}, "dimensions": asset->metadata.dimensions },
  posterAlt,
  seoTitle, seoDescription,
  ogImage{ ${imageWithLqip} },
}`

export async function fetchMorisons(): Promise<MorisonsView | null> {
  if (!client) return null
  const raw: any = await client.fetch(morisonsQuery)
  if (!raw) return null

  const p = resolveImage(raw.poster, 2400)
  const og = resolveImage(raw.ogImage, 1200)
  const dims = raw.poster?.dimensions
  return {
    poster: p?.url,
    posterLqip: p?.lqip,
    posterAlt: raw.posterAlt,
    posterAspect:
      dims?.width && dims?.height ? dims.width / dims.height : undefined,
    seoTitle: raw.seoTitle,
    seoDescription: raw.seoDescription,
    ogImage: og?.url,
  }
}

/* ─────────────────────────── Careers ─────────────────────────── */

export type CareersView = {
  eyebrow?: string
  headline?: string
  headlineItalic?: string
  tagline?: string
  body?: string
  heroImage?: string
  heroImageLqip?: string
  submitLabel?: string
  successMessage?: string
  recipientEmails?: string[]
}

export const careersQuery = groq`*[_type == "careers"][0]{
  eyebrow, headline, headlineItalic, tagline, body,
  heroImage{ ${imageWithLqip} },
  submitLabel, successMessage,
  recipientEmails,
}`

export async function fetchCareers(): Promise<CareersView | null> {
  if (!client) return null
  const raw: any = await client.fetch(careersQuery)
  if (!raw) return null
  const hero = resolveImage(raw.heroImage, 2000)
  return {
    eyebrow: raw.eyebrow,
    headline: raw.headline,
    headlineItalic: raw.headlineItalic,
    tagline: raw.tagline,
    body: raw.body,
    heroImage: hero?.url,
    heroImageLqip: hero?.lqip,
    submitLabel: raw.submitLabel,
    successMessage: raw.successMessage,
    recipientEmails: (raw.recipientEmails || []).filter(Boolean),
  }
}

/** Recipient email(s) for job applications — used by the /api/careers route. */
export async function fetchCareersRecipients(): Promise<string[]> {
  if (!client) return []
  const emails: string[] | null = await client.fetch(
    groq`*[_type == "careers"][0].recipientEmails`,
  )
  return (emails || []).map((e) => e.trim()).filter(Boolean)
}

/* ─────────────────────────── Contact Us ─────────────────────────── */

export type ContactOffice = {
  title?: string
  address?: string
  phone?: string
  phoneHref?: string
  email?: string
}

export type ContactUsView = {
  heading?: string
  subcopy?: string
  offices?: ContactOffice[]
  formHeading?: string
  formSuccessHeading?: string
  formSuccessBody?: string
  privacyPolicyUrl?: string
  wheelHeading?: string
  wheelCtaLabel?: string
  wheelCtaHref?: string
  portraits?: { url: string; lqip?: string }[]
  recipientEmails?: string[]
}

export const contactUsQuery = groq`*[_type == "contactUs"][0]{
  heading, subcopy,
  offices[]{ title, address, phone, phoneHref, email },
  formHeading, formSuccessHeading, formSuccessBody, privacyPolicyUrl,
  wheelHeading, wheelCtaLabel, wheelCtaHref,
  portraits[]{ ${imageWithLqip} },
  recipientEmails,
}`

export async function fetchContactUs(): Promise<ContactUsView | null> {
  if (!client) return null
  const raw: any = await client.fetch(contactUsQuery)
  if (!raw) return null
  return {
    heading: raw.heading,
    subcopy: raw.subcopy,
    offices: (raw.offices || []).map((o: any) => ({
      title: o.title,
      address: o.address,
      phone: o.phone,
      phoneHref: o.phoneHref,
      email: o.email,
    })),
    formHeading: raw.formHeading,
    formSuccessHeading: raw.formSuccessHeading,
    formSuccessBody: raw.formSuccessBody,
    privacyPolicyUrl: raw.privacyPolicyUrl,
    wheelHeading: raw.wheelHeading,
    wheelCtaLabel: raw.wheelCtaLabel,
    wheelCtaHref: raw.wheelCtaHref,
    portraits: (raw.portraits || [])
      .map((im: any) => {
        const r = resolveImage(im, 600)
        return r ? { url: r.url, lqip: r.lqip } : null
      })
      .filter(Boolean),
    recipientEmails: (raw.recipientEmails || []).filter(Boolean),
  }
}

/** Recipient email(s) for contact enquiries — used by the /api/contact route. */
export async function fetchContactRecipients(): Promise<string[]> {
  if (!client) return []
  const emails: string[] | null = await client.fetch(
    groq`*[_type == "contactUs"][0].recipientEmails`,
  )
  return (emails || []).map((e) => e.trim()).filter(Boolean)
}

/* ── Investor Relations ──────────────────────────────────────────────── */
export type IRDoc = { label?: string; href?: string }
export type IRColumn = { heading?: string; links: IRDoc[] }
export type IRContact = { heading?: string; body?: string }
export type IRProcedureItem = { text?: string; url?: string }

export type InvestorRelations = {
  termsHeading?: string
  termsDocs?: IRDoc[]
  csrHeading?: string
  csrMembers?: { name?: string; designation?: string }[]
  policiesHeading?: string
  policiesDocs?: IRDoc[]
  noticeHeading?: string
  noticeHeadings?: string[]
  noticeRows?: { cells: IRDoc[] }[]
  investorsHeading?: string
  investorsIntro?: string
  investorsContacts?: IRContact[]
  investorsDocs?: IRDoc[]
  campaignHeading?: string
  campaignDocs?: IRDoc[]
  multipleMailingHeading?: string
  multipleMailingBody?: string
  iepfHeading?: string
  iepfContactHeading?: string
  iepfContact?: string
  iepfSharesHeading?: string
  iepfSharesColumns?: IRColumn[]
  iepfDividendHeading?: string
  iepfDividendColumns?: IRColumn[]
  iepfProcedureHeading?: string
  iepfProcedureItems?: IRProcedureItem[]
}

const irDocFrag = `{ label, "fileUrl": file.asset->url, url }`
const irColFrag = `{ heading, links[]${irDocFrag} }`

export const investorRelationsQuery = groq`*[_type == "investorRelations"][0]{
  termsHeading, termsDocs[]${irDocFrag},
  csrHeading, csrMembers[]{ name, designation },
  policiesHeading, policiesDocs[]${irDocFrag},
  noticeHeading, noticeHeadings,
  noticeRows[]{ cells[]${irDocFrag} },
  investorsHeading, investorsIntro,
  investorsContacts[]{ heading, body },
  investorsDocs[]${irDocFrag},
  campaignHeading, campaignDocs[]${irDocFrag},
  multipleMailingHeading, multipleMailingBody,
  iepfHeading, iepfContactHeading, iepfContact,
  iepfSharesHeading, iepfSharesColumns[]${irColFrag},
  iepfDividendHeading, iepfDividendColumns[]${irColFrag},
  iepfProcedureHeading, iepfProcedureItems[]{ text, url },
}`

const resolveDocs = (arr: any): IRDoc[] | undefined =>
  Array.isArray(arr)
    ? arr.map((d: any) => ({ label: d?.label, href: d?.fileUrl || d?.url || undefined }))
    : undefined

const resolveCols = (arr: any): IRColumn[] | undefined =>
  Array.isArray(arr)
    ? arr.map((c: any) => ({ heading: c?.heading, links: resolveDocs(c?.links) || [] }))
    : undefined

export async function fetchInvestorRelations(): Promise<InvestorRelations | null> {
  if (!client) return null
  const raw: any = await client.fetch(investorRelationsQuery)
  if (!raw) return null
  return {
    termsHeading: raw.termsHeading,
    termsDocs: resolveDocs(raw.termsDocs),
    csrHeading: raw.csrHeading,
    csrMembers: raw.csrMembers,
    policiesHeading: raw.policiesHeading,
    policiesDocs: resolveDocs(raw.policiesDocs),
    noticeHeading: raw.noticeHeading,
    noticeHeadings: raw.noticeHeadings,
    noticeRows: Array.isArray(raw.noticeRows)
      ? raw.noticeRows.map((r: any) => ({ cells: resolveDocs(r?.cells) || [] }))
      : undefined,
    investorsHeading: raw.investorsHeading,
    investorsIntro: raw.investorsIntro,
    investorsContacts: raw.investorsContacts,
    investorsDocs: resolveDocs(raw.investorsDocs),
    campaignHeading: raw.campaignHeading,
    campaignDocs: resolveDocs(raw.campaignDocs),
    multipleMailingHeading: raw.multipleMailingHeading,
    multipleMailingBody: raw.multipleMailingBody,
    iepfHeading: raw.iepfHeading,
    iepfContactHeading: raw.iepfContactHeading,
    iepfContact: raw.iepfContact,
    iepfSharesHeading: raw.iepfSharesHeading,
    iepfSharesColumns: resolveCols(raw.iepfSharesColumns),
    iepfDividendHeading: raw.iepfDividendHeading,
    iepfDividendColumns: resolveCols(raw.iepfDividendColumns),
    iepfProcedureHeading: raw.iepfProcedureHeading,
    iepfProcedureItems: raw.iepfProcedureItems,
  }
}
