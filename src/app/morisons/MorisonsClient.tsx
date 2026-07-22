import Image from 'next/image'

/* The Morisons house page is intentionally a single full-width poster.
   The poster (and its SEO) is managed in Sanity — this URL is only the
   fallback used before/if Sanity is filled in. */
const DEFAULT_POSTER =
  'https://cdn.sanity.io/images/vfv5lxgr/production/de03e11f40386a7916c3252827544f3b13009864-1672x941.png'
/* Aspect ratio of the fallback poster (used until Sanity supplies real dimensions). */
const DEFAULT_ASPECT = 1672 / 941

export default function MorisonsClient({
  poster,
  posterLqip,
  posterAlt,
  posterAspect,
}: {
  poster?: string
  posterLqip?: string
  posterAlt?: string
  posterAspect?: number
}) {
  const src = poster || DEFAULT_POSTER
  const aspect = posterAspect && posterAspect > 0 ? posterAspect : DEFAULT_ASPECT

  return (
    // Sits directly at the top of the page (the body already offsets content
    // below the fixed navbar), so there is no gap above the poster. The frame
    // takes the poster's own aspect ratio, but is capped to the visible viewport
    // height (screen minus navbar) so the whole poster fits in a single view and
    // ends right at the bottom of the screen — no cropping, no scroll needed.
    <section className="relative w-full" style={{ backgroundColor: '#EAF2F8' }}>
      <div
        className="relative mx-auto w-full"
        style={{
          aspectRatio: `${aspect}`,
          maxHeight: 'calc(100dvh - var(--nav-h))',
          maxWidth: 'calc((100dvh - var(--nav-h)) * ' + aspect + ')',
        }}
      >
        <Image
          src={src}
          alt={posterAlt || 'Morisons — Sensitive Care for your teeth'}
          fill
          priority
          sizes="100vw"
          className="object-contain"
          {...(posterLqip ? { placeholder: 'blur' as const, blurDataURL: posterLqip } : {})}
        />
      </div>
    </section>
  )
}
