import HeroSlideshow, { type Slide, type HeroVideo } from '@/components/HeroSlideshow'
import VisionSection from '@/components/VisionSection'
import BrandCards, { type Brand } from '@/components/BrandCards'
import StatsSection, { type Stat } from '@/components/StatsSection'
import HomeFeatures, { type HomeFeature } from '@/components/HomeFeatures'
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

  // House brand card — appended in code (add it in Sanity later to make it
  // fully editable). Skipped if a "Morisons" house card already exists.
  const morisonsCard: Brand = {
    name: 'Morisons',
    shortName: 'Morisons',
    tagline: 'The house of goodness — a century of trust, in every Indian home.',
    href: '/morisons',
    image:
      'https://images.unsplash.com/photo-1521790797524-b2497295b8a0?w=1600&q=80&auto=format&fit=crop',
  }
  const combinedBrands: Brand[] = sanityBrands.some((b) => b.name.trim() === 'Morisons')
    ? sanityBrands
    : [...sanityBrands, morisonsCard]

  // Fixed display order for the "Trusted in every Indian home" cards.
  const BRAND_ORDER = ['Morisons Baby Dreams', 'Bigen', 'Emoform', 'Morisons']
  const rank = (name: string) => {
    const i = BRAND_ORDER.indexOf(name.trim())
    return i === -1 ? BRAND_ORDER.length : i
  }
  const brands: Brand[] = [...combinedBrands].sort((a, b) => rank(a.name) - rank(b.name))

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
      />
      <HomeFeatures features={features} />
      <div style={{ backgroundColor: '#FFFFFF' }}>
        <Footer />
      </div>
    </>
  )
}
