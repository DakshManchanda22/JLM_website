import HeroSlideshow, { type Slide, type HeroVideo } from '@/components/HeroSlideshow'
import QuoteSection from '@/components/QuoteSection'
import BrandCards, { type Brand } from '@/components/BrandCards'
import StatsSection, { type Stat } from '@/components/StatsSection'
import HomeFeatures, { type HomeFeature } from '@/components/HomeFeatures'
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

  const brands: Brand[] | undefined = homepage?.brands?.flatMap((b) => {
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
  })

  const stats: Stat[] | undefined = homepage?.stats?.map((s) => ({
    number: s.number,
    label: s.label,
    body: s.body,
  }))

  const features: HomeFeature[] | undefined = homepage?.features?.flatMap((f) => {
    const r = resolveImage(f.image, 1400)
    return r
      ? [
          {
            eyebrow: f.eyebrow,
            headline: f.headline,
            body: f.body,
            ctaLabel: f.ctaLabel,
            href: f.href,
            image: r.url,
            lqip: r.lqip,
            imageRight: f.imageRight,
          },
        ]
      : []
  })

  return (
    <>
      <HeroSlideshow
        slides={heroSlides}
        video={heroVideo}
        intervalMs={(homepage?.heroSlideInterval ?? 5) * 1000}
      />
      <QuoteSection
        lines={homepage?.quote?.lines}
        attribution={homepage?.quote?.attribution}
      />
      <BrandCards brands={brands} />
      <StatsSection
        stats={stats}
        heading={homepage?.statsHeading}
        note={homepage?.statsNote}
      />
      <HomeFeatures features={features} />
      <div style={{ backgroundColor: '#FFFFFF' }}>
        <Footer />
      </div>
    </>
  )
}
