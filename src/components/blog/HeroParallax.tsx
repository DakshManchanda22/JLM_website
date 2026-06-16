'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  src: string
  alt: string
}

/**
 * Cinematic full-bleed hero image. As the user scrolls past, the image
 * shrinks inward and gains a corner radius — echoing the homepage hero.
 */
export default function HeroParallax({ src, alt }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner) return
    const scroller = document.getElementById('page-scroller')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { scale: 1.06, borderRadius: '0px' },
        {
          scale: 0.94,
          borderRadius: '28px',
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            scroller: scroller ?? undefined,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, wrap)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden"
      style={{ height: '78vh', minHeight: 500 }}
    >
      <div
        ref={innerRef}
        className="absolute inset-0 overflow-hidden"
        style={{ willChange: 'transform, border-radius' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </div>
  )
}
