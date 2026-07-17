import HeroSlideshow, { type Slide, type HeroVideo } from '@/components/HeroSlideshow'
import BrandCards, { type Brand } from '@/components/BrandCards'
import StatsSection, { type Stat } from '@/components/StatsSection'
import HomeFeatures, { type HomeFeature } from '@/components/HomeFeatures'
import VisionSection from '@/components/VisionSection'
import ValuesImage from '@/components/ValuesImage'
import Footer from '@/components/Footer'
import { fetchHomepage } from '@/sanity/queries'
import { resolveImage, resolveImageUrl } from '@/sanity/resolveImage'

// Revalidate every 60s so Sanity edits surface without redeploys
export const revalidate = 60

export default async function Home() {
  const homepage = await fetchHomepage()

  /* Resolve Sanity image asset refs into URLs for the client components */
  const heroSlides: Slide[] | undefined = homepage?.heroSlides?.flatMap((s) => {
    const r = resolveImage(s.image, 2000)
    return r ? [{ image: r.url, lqip: r.lqip, brand: s.brand, tagline: s.tagline }] : []
  })

  /* The Sanity switch decides the hero: OFF = video, ON = photo carousel.
     The video only plays when the carousel is OFF and a link/file is set. */
  const useCarousel = homepage?.heroUseCarousel ?? false
  const hv = homepage?.heroVideo
  const heroVideo: HeroVideo | undefined =
    !useCarousel && hv?.videoUrl
      ? {
          videoUrl: hv.videoUrl,
          poster: resolveImageUrl(hv.poster, 2000),
          brand: hv.brand,
          tagline: hv.tagline,
        }
      : undefined

  const sanityBrands: Brand[] =
    homepage?.brands?.flatMap((b) => {
      const r = resolveImage(b.image, 1600)
      return r
        ? [
            {
              name: b.name,
              shortName: b.shortName ?? b.name,
              tagline: b.tagline,
              href: b.href,
              image: r.url,
              lqip: r.lqip,
            },
          ]
        : []
    }) ?? []

  // Brand cards are managed entirely in Sanity (including the Morisons house
  // card). We only enforce a stable display order so the row reads the same
  // regardless of how the cards are ordered in the Studio.
  const BRAND_ORDER = ['Morisons Baby Dreams', 'Bigen', 'Emoform', 'Morisons']
  const rank = (name: string) => {
    const i = BRAND_ORDER.indexOf(name.trim())
    return i === -1 ? BRAND_ORDER.length : i
  }
  const brands: Brand[] = [...sanityBrands].sort((a, b) => rank(a.name) - rank(b.name))

  /* Values graphic below the quote — only when toggled on and an image is set.
     Default ON when the flag is unset so it shows until marketing hides it. */
  const showValues = homepage?.showValuesImage ?? true
  const valuesResolved = showValues ? resolveImage(homepage?.valuesImage, 1600) : undefined
  const valuesAspect =
    typeof homepage?.valuesImage?.aspect === 'number'
      ? homepage.valuesImage.aspect
      : undefined

  const stats: Stat[] | undefined = homepage?.stats?.map((s) => ({
    number: s.number,
    label: s.label,
    body: s.body,
  }))

  const features: HomeFeature[] | undefined = homepage?.features?.flatMap((f) => {
    // Prefer the rotating `images` array; fall back to the legacy single image.
    const source =
      f.images && f.images.length > 0 ? f.images : f.image ? [f.image] : []
    const images = source.flatMap((im) => {
      const r = resolveImage(im, 1400)
      return r ? [{ url: r.url, lqip: r.lqip }] : []
    })
    if (images.length === 0) return []
    return [
      {
        eyebrow: f.eyebrow,
        headline: f.headline,
        body: f.body,
        ctaLabel: f.ctaLabel,
        href: f.href,
        images,
        intervalMs:
          f.imageIntervalSeconds && f.imageIntervalSeconds > 0
            ? f.imageIntervalSeconds * 1000
            : undefined,
        imageRight: f.imageRight,
      },
    ]
  })

  return (
    <>
      <HeroSlideshow
        slides={heroSlides}
        video={heroVideo}
        intervalMs={(homepage?.heroSlideInterval ?? 5) * 1000}
      />
      <VisionSection label={homepage?.vision?.label} text={homepage?.vision?.text} />
      {valuesResolved && (
        <ValuesImage
          image={valuesResolved.url}
          lqip={valuesResolved.lqip}
          aspect={valuesAspect}
        />
      )}
      <BrandCards brands={brands} />
      <StatsSection
        stats={stats}
        heading={homepage?.statsHeading}
        note={homepage?.statsNote}
        speed={homepage?.carouselSpeed}
      />
      <HomeFeatures features={features} />
      <div style={{ backgroundColor: '#FFFFFF' }}>
        <Footer />
      </div>
    </>
  )
}
