/* eslint-disable @typescript-eslint/no-explicit-any */
import { groq } from 'next-sanity'

import { client } from './client'
import { imageWithLqip, resolveImage } from './resolveImage'

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
  seoTitle?: string
  seoDescription?: string
  ogImage?: { asset: { _ref: string } }
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
  body,
  seoTitle,
  seoDescription,
  ogImage
}`

export const postSlugsQuery = groq`*[_type == "post" && defined(slug.current)][].slug.current`

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

/* ─────────────────────── Homepage singleton ─────────────────────── */

export type HeroSlide = {
  image: any
  brand: string
  tagline: string
}

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
  imageRight?: boolean
}

export type HeroVideo = {
  videoUrl?: string
  poster?: any
  brand?: string
  tagline?: string
}

export type Homepage = {
  heroUseCarousel?: boolean
  heroVideo?: HeroVideo
  heroSlides?: HeroSlide[]
  heroSlideInterval?: number
  quote?: {
    lines?: string[]
    attribution?: string
  }
  brands?: BrandCardData[]
  statsHeading?: string
  statsNote?: string
  stats?: StatData[]
  features?: HomeFeatureData[]
}

export const homepageQuery = groq`*[_type == "homepage"][0]{
  heroUseCarousel,
  heroSlideInterval,
  heroVideo{
    "videoUrl": coalesce(videoFile.asset->url, videoUrl),
    poster,
    brand,
    tagline,
  },
  heroSlides[]{
    image{ ${imageWithLqip} },
    brand,
    tagline,
  },
  quote{
    lines,
    attribution,
  },
  brands[]{
    name,
    shortName,
    tagline,
    href,
    image{ ${imageWithLqip} },
  },
  statsHeading,
  statsNote,
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

export async function fetchLeaders(): Promise<Leader[]> {
  if (!client) return []
  return client.fetch(leaderListQuery)
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
  introImages?: any[]
  introFinalImage?: any
  heroImage?: any
  heroLine1?: string
  heroLine2?: string
  heroCaptionSmall?: string
  heroCaptionLarge?: string
  anchors?: { num: string; label: string; targetId: string; image: any }[]
  captionStrip?: { image: any; caption: string }[]
  peopleLabel?: string
  peopleHeadline?: string
  peopleTagline?: string
  peopleBody?: string
  arentEyebrow?: string
  arentHeadline?: string
  arentBody?: string
  arentList?: { word: string; caption: string; icon: string }[]
  areList?: { word: string; caption: string; icon: string }[]
  valuesLabel?: string
  valuesHeadline?: string
  valuesTagline?: string
  values?: { icon: string; title: string; body: string; image: any }[]
  workplaceLabel?: string
  workplaceHeadline?: string
  workplaceTagline?: string
  workplaceBody?: string
  workplaceImages?: { image: any; caption: string }[]
  togetherLabel?: string
  togetherHeadline?: string
  togetherTagline?: string
  togetherBody?: string
  togetherBrands?: { name: string; tag: string }[]
  togetherClosingMark?: string
  togetherClosingLine?: string
  togetherCtaLabel?: string
  togetherCtaHref?: string
}

export const lifeAtJlmQuery = groq`*[_type == "lifeAtJlm"][0]{
  introImages,
  introFinalImage,
  heroImage{ ${imageWithLqip} },
  heroLine1,
  heroLine2,
  heroCaptionSmall,
  heroCaptionLarge,
  anchors[]{ num, label, targetId, image },
  captionStrip[]{ image, caption },
  peopleLabel, peopleHeadline, peopleTagline, peopleBody,
  arentEyebrow, arentHeadline, arentBody,
  arentList[]{ word, caption, icon },
  areList[]{ word, caption, icon },
  valuesLabel, valuesHeadline, valuesTagline,
  values[]{ icon, title, body, image },
  workplaceLabel, workplaceHeadline, workplaceTagline, workplaceBody,
  workplaceImages[]{ image, caption },
  togetherLabel, togetherHeadline, togetherTagline, togetherBody,
  togetherBrands[]{ name, tag },
  togetherClosingMark, togetherClosingLine, togetherCtaLabel, togetherCtaHref,
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
  // Journey
  journeyEyebrow?: string
  journeyHeadline?: string
  journeyStages?: OurStoryJourneyStage[]
  // Eras
  erasEyebrow?: string
  erasHeadline?: string
  eras?: OurStoryEra[]
  // Pillars
  pillarsEyebrow?: string
  pillarsHeadline?: string
  pillars?: OurStoryPillar[]
  // Closing
  closingLine?: string
  closingSubline?: string
}

export const ourStoryQuery = groq`*[_type == "ourStory"][0]{
  eyebrow,
  headlineTop,
  headlineBottom,
  heroTagline,
  establishedMark,
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
  pillarsEyebrow,
  pillarsHeadline,
  pillars[]{ name, description },
  closingLine,
  closingSubline,
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
  // social
  instagramUrl?: string
  facebookUrl?: string
}

export const bigenQuery = groq`*[_type == "bigen"][0]{
  "heroLogo": heroLogo.asset->url,
  heroHeadline1, heroHeadline2, heroHeadline3, heroEyebrow,
  heroCtaLabel, heroCtaHref,
  heroImage{ ${imageWithLqip} },
  videoHeadline, videoUrl,
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
  instagramUrl,
  facebookUrl,
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

  return {
    ...raw,
    heroImage: hero?.url,
    heroImageLqip: hero?.lqip,
    ritualImage: ritual?.url,
    ritualImageLqip: ritual?.lqip,
    shineImage: shine?.url,
    shineImageLqip: shine?.lqip,
    products: (raw.products || []).map((p: any) => {
      const r = resolveImage(p.image, 800)
      return { ...p, image: r?.url, lqip: r?.lqip }
    }),
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
  ctaTitle?: string
  ctaSubtext?: string
  ctaButtonLabel?: string
  ctaButtonHref?: string
}

export const emoformQuery = groq`*[_type == "emoform"][0]{
  heroLine1, heroLine2, heroFlag,
  heroImage{ ${imageWithLqip} },
  featuresTitleTop, featuresTitleBottom, features,
  featuresImage{ ${imageWithLqip} },
  steps[]{ tag, title, sub, image{ ${imageWithLqip} }, points },
  ctaTitle, ctaSubtext, ctaButtonLabel, ctaButtonHref,
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
    ctaTitle: raw.ctaTitle,
    ctaSubtext: raw.ctaSubtext,
    ctaButtonLabel: raw.ctaButtonLabel,
    ctaButtonHref: raw.ctaButtonHref,
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
  blogsHeadline?: string
  blogsIntro?: string
  instagramUrl?: string
  facebookUrl?: string
  youtubeUrl?: string
}

export const babyDreamsQuery = groq`*[_type == "babyDreams"][0]{
  bannerInterval,
  banners[]{ image{ ${imageWithLqip} }, alt, href },
  productsHeadline, productsIntro,
  categories[]{ title, blurb, image{ ${imageWithLqip} }, tint, href },
  videoHeadline, videoUrl,
  videoPoster{ ${imageWithLqip} },
  rangeHeadline, rangeIntro,
  blogsHeadline, blogsIntro,
  instagramUrl, facebookUrl, youtubeUrl,
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
    blogsHeadline: raw.blogsHeadline,
    blogsIntro: raw.blogsIntro,
    instagramUrl: raw.instagramUrl,
    facebookUrl: raw.facebookUrl,
    youtubeUrl: raw.youtubeUrl,
  }
}
