import HeroSlideshow, { type Slide, type HeroVideo } from '@/components/HeroSlideshow'
import QuoteSection from '@/components/QuoteSection'
import BrandCards, { type Brand } from '@/components/BrandCards'
import StatsSection, { type Stat } from '@/components/StatsSection'
import HomeFeatures from '@/components/HomeFeatures'
import Footer from '@/components/Footer'
import { fetchHomepage } from '@/sanity/queries'
import { resolveImageUrl } from '@/sanity/resolveImage'

// Revalidate every 60s so Sanity edits surface without redeploys
export const revalidate = 60

export default async function Home() {
  const homepage = await fetchHomepage()

  /* Resolve Sanity image asset refs into URLs for the client components */
  const heroSlides: Slide[] | undefined = homepage?.heroSlides
    ?.map((s) => {
      const url = resolveImageUrl(s.image, 2000)
      if (!url) return null
      return { image: url, brand: s.brand, tagline: s.tagline }
    })
    .filter((x): x is Slide => x !== null)

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

  const brands: Brand[] | undefined = homepage?.brands
    ?.map((b) => {
      const url = resolveImageUrl(b.image, 1600)
      if (!url) return null
      return {
        name: b.name,
        shortName: b.shortName ?? b.name,
        tagline: b.tagline,
        href: b.href,
        image: url,
      }
    })
    .filter((x): x is Brand => x !== null)

  const stats: Stat[] | undefined = homepage?.stats?.map((s) => ({
    number: s.number,
    label: s.label,
    body: s.body,
  }))

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
      <StatsSection stats={stats} />
      <HomeFeatures />
      <div style={{ backgroundColor: '#FFFFFF' }}>
        <Footer />
      </div>
    </>
  )
}
