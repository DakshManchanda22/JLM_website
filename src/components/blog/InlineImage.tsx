'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  src: string
  alt: string
  caption?: string
  fullBleed?: boolean
}

/**
 * An image that quietly fades + lifts as it enters the viewport.
 * Used inside the blog body — full-bleed variants break the reading column.
 */
export default function InlineImage({ src, alt, caption, fullBleed }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const scroller = document.getElementById('page-scroller')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: node,
            scroller: scroller ?? undefined,
            start: 'top 88%',
          },
        },
      )
    }, node)

    return () => ctx.revert()
  }, [])

  return (
    <figure
      ref={ref}
      className={
        fullBleed
          ? 'my-16 md:my-24 -mx-6 md:-mx-0 md:w-screen md:max-w-none md:relative md:left-1/2 md:-translate-x-1/2'
          : 'my-12 md:my-16'
      }
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-[#F4EFE7]"
        style={{ aspectRatio: fullBleed ? '21 / 9' : '16 / 10' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={fullBleed ? '100vw' : '(max-width: 768px) 100vw, 720px'}
          className="object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-[12px] tracking-[0.18em] uppercase text-[#888888]">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
