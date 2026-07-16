'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Cormorant_Garamond } from 'next/font/google'

gsap.registerPlugin(ScrollTrigger)

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['italic', 'normal'],
})

type Props = {
  quote: string
  attribution?: string
}

export default function PullQuote({ quote, attribution }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const scroller = document.getElementById('page-scroller')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node.querySelectorAll('[data-pq-line]'),
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.08,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: node,
            scroller: scroller ?? undefined,
            start: 'top 80%',
          },
        },
      )
    }, node)

    return () => ctx.revert()
  }, [])

  return (
    <aside
      ref={ref}
      className="my-16 md:my-24 md:-mx-12 lg:-mx-24 relative"
    >
      <div className="border-l-2 border-[#111111] pl-6 md:pl-10">
        <p
          data-pq-line
          className={`${cormorant.className} italic text-[#111111] leading-[1.15]`}
          style={{ fontSize: 'clamp(1.75rem, 3.4vw, 2.75rem)', fontWeight: 400 }}
        >
          “{quote}”
        </p>
        {attribution && (
          <p
            data-pq-line
            className="mt-5 text-[12px] tracking-[0.22em] uppercase text-[#555555]"
          >
            — {attribution}
          </p>
        )}
      </div>
    </aside>
  )
}
