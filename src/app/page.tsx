import BrandCards, { type Brand } from '@/components/BrandCards'
import StatsSection, { type Stat } from '@/components/StatsSection'
import HomeFeatures, { type HomeFeature } from '@/components/HomeFeatures'
import VisionSection from '@/components/VisionSection'
import ValuesImage from '@/components/ValuesImage'
import Footer from '@/components/Footer'
import { fetchHomepage } from '@/sanity/queries'
import { resolveImage } from '@/sanity/resolveImage'

// Revalidate every 60s so Sanity edits surface without redeploys
export const revalidate = 60

export default async function Home() {
  const homepage = await fetchHomepage()

  // Canonical routes for the known brands. Sanity content historically seeded
  // some hrefs with a `/brands/…` prefix that doesn't exist as a route, so we
  // normalise by brand name here to guarantee the cards link to the real page.
  const CANONICAL_HREF: Record<string, string> = {
    'Morisons Baby Dreams': '/morisons-baby-dreams',
    Emoform: '/emoform',
    Bigen: '/bigen',
    Morisons: '/morisons',
  }

  const sanityBrands: Brand[] =
    homepage?.brands?.flatMap((b) => {
      const r = resolveImage(b.image, 1600)
      return r
        ? [
            {
              name: b.name,
              shortName: b.shortName ?? b.name,
              tagline: b.tagline,
              href: CANONICAL_HREF[b.name.trim()] ?? b.href,
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
      {/* 1 · Brand tiles */}
      <BrandCards brands={brands} heading={homepage?.brandsHeading} />
      {/* 2 · Data points */}
      <StatsSection stats={stats} heading={homepage?.statsHeading} />
      {/* 3 · Vision */}
      <VisionSection label={homepage?.vision?.label} text={homepage?.vision?.text} />
      {/* 4 · Core values */}
      {valuesResolved && (
        <ValuesImage
          image={valuesResolved.url}
          lqip={valuesResolved.lqip}
          aspect={valuesAspect}
        />
      )}
      {/* 5 · Life at JLM · 6 · Mission & impact (ordered in Sanity → Features) */}
      <HomeFeatures features={features} />
      <div style={{ backgroundColor: '#FFFFFF' }}>
        <Footer />
      </div>
    </>
  )
}
