import Image from 'next/image'

/* The Morisons house page is intentionally a single full-screen poster.
   The poster (and its SEO) is managed in Sanity — this URL is only the
   fallback used before/if Sanity is filled in. */
const DEFAULT_POSTER =
  'https://cdn.sanity.io/images/vfv5lxgr/production/de03e11f40386a7916c3252827544f3b13009864-1672x941.png'

export default function MorisonsClient({
  poster,
  posterLqip,
  posterAlt,
}: {
  poster?: string
  posterLqip?: string
  posterAlt?: string
}) {
  const src = poster || DEFAULT_POSTER
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        // Sit just below the fixed navbar and fill the rest of the viewport, so
        // the poster's top isn't hidden behind the nav and the whole thing fits
        // on one screen (no scroll). object-cover fills edge-to-edge — no side gaps.
        height: 'calc(100svh - var(--nav-h))',
        marginTop: 'var(--nav-h)',
        backgroundColor: '#EAF2F8',
      }}
    >
      <Image
        src={src}
        alt={posterAlt || 'Morisons — Sensitive Care for your teeth'}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        {...(posterLqip ? { placeholder: 'blur' as const, blurDataURL: posterLqip } : {})}
      />
    </section>
  )
}
