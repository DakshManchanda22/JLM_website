'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Inter } from 'next/font/google'
import type { EmoformView } from '@/sanity/queries'

gsap.registerPlugin(ScrollTrigger)

const inter = Inter({ subsets: ['latin'], weight: ['600', '700', '800', '900'] })
const EASE = [0.16, 1, 0.3, 1] as const
const NAVY = '#13306e'

/* Shared tooth silhouette for the feature icons. */
const TOOTH =
  'M12 3.6c-1.1-.9-2.3-1.4-3.5-1.4C6.5 2.2 5 3.8 5 6c0 1.3.2 2.6.7 3.8l1.3 4.6c.3 1.1.6 2.6 1.5 2.6.9 0 1.1-1.3 1.3-2.4l.4-2.3c.1-.7.5-1.1.9-1.1s.8.4.9 1.1l.4 2.3c.2 1.1.4 2.4 1.3 2.4.9 0 1.2-1.5 1.5-2.6l1.3-4.6c.5-1.2.7-2.5.7-3.8 0-2.2-1.5-3.8-3.5-3.8-1.2 0-2.4.5-3.5 1.4z'

/* Underline that draws left-to-right when scrolled into view. */
function Underlined({
  children,
  color,
  reduce,
}: {
  children: React.ReactNode
  color: string
  reduce: boolean | null
}) {
  return (
    <span className="relative inline-block">
      {children}
      <motion.span
        aria-hidden
        className="absolute -bottom-1 left-0 right-0 block h-[3px] rounded-full md:h-1"
        style={{ backgroundColor: color, transformOrigin: 'left' }}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
      />
    </span>
  )
}

/* A small line-drawn face for the abrasivity scale ends. */
function Face({ mood, bg }: { mood: 'happy' | 'sad'; bg: string }) {
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-full"
      style={{ backgroundColor: bg }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20">
        <circle cx="9" cy="9.8" r="1.1" fill="#fff" />
        <circle cx="15" cy="9.8" r="1.1" fill="#fff" />
        <path
          d={mood === 'happy' ? 'M8.8 13.6Q12 16.2 15.2 13.6' : 'M8.8 15.2Q12 12.6 15.2 15.2'}
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

/* RDA abrasivity gauge: gradient bar, marker pin at 25 / 250, faces + caption. */
function RdaGauge({ reduce }: { reduce: boolean | null }) {
  const pct = (25 / 250) * 100
  return (
    <div className="mt-8 max-w-[460px]">
      <div className="rounded-[26px] bg-[#eef2fb] p-5 md:p-6">
        {/* marker pin */}
        <div className="relative mb-1 h-[62px]">
          <motion.div
            className="absolute bottom-0 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${pct}%` }}
            initial={reduce ? false : { opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
          >
            <div className="rounded-2xl bg-[#2b3550] px-3 py-1.5 text-center leading-none text-white shadow-md">
              <div className="text-[9px] font-semibold tracking-wide text-white/75">
                RDA
              </div>
              <div className="mt-1 text-xl font-extrabold">25</div>
            </div>
            <div
              className="h-0 w-0 border-x-[7px] border-t-[9px] border-x-transparent"
              style={{ borderTopColor: '#2b3550' }}
            />
          </motion.div>
        </div>

        {/* gradient bar */}
        <div
          className="relative flex h-11 items-center justify-between overflow-hidden rounded-full px-1"
          style={{
            background:
              'linear-gradient(90deg,#33a852 0%,#9cc63b 28%,#f3c218 55%,#ef8f2e 78%,#e0492f 100%)',
          }}
        >
          <Face mood="happy" bg="#2e9e4f" />
          <Face mood="sad" bg="#d8432b" />
        </div>

        {/* scale */}
        <div className="mt-3 flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-[#3a4663]">low abrasion</div>
            <div className="text-lg font-extrabold" style={{ color: NAVY }}>
              0
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-[#3a4663]">high abrasion</div>
            <div className="text-lg font-extrabold" style={{ color: NAVY }}>
              250
            </div>
          </div>
        </div>
      </div>

      <p
        className="mt-4 font-extrabold"
        style={{ color: NAVY, fontSize: 'clamp(1.05rem, 1.6vw, 1.3rem)' }}
      >
        RDA = Relative Dentin Abrasivity
      </p>
    </div>
  )
}

const FEATURES: { label: string; icon: React.ReactNode }[] = [
  {
    label: 'Sugar-Free',
    icon: (
      <>
        <rect x="10.4" y="4.6" width="5.2" height="5.2" rx="1" />
        <rect x="6.6" y="11.4" width="5.2" height="5.2" rx="1" />
        <rect x="13.4" y="11.4" width="5.2" height="5.2" rx="1" />
        <line x1="4.6" y1="19.4" x2="19.4" y2="4.6" />
      </>
    ),
  },
  {
    label: 'Fluoride-Free',
    icon: (
      <>
        <path d={TOOTH} />
        <line x1="4.6" y1="19.4" x2="19.4" y2="4.6" />
      </>
    ),
  },
  {
    label: 'Swiss formula',
    icon: (
      <>
        <path d={TOOTH} />
        <path
          d="M17.6 3.6l.45 1.4 1.4.45-1.4.45-.45 1.4-.45-1.4-1.4-.45 1.4-.45z"
          strokeWidth={1.3}
        />
        <circle cx="6.6" cy="5" r="0.5" />
      </>
    ),
  },
]

type Step = {
  tag: string
  color: string
  image?: string
  imageLqip?: string
  title: string
  underline?: string
  sub?: string
  bullets?: { label: string; icon: React.ReactNode }[]
  rda?: boolean
  features?: boolean
}

/* The left visual for a step: a photo when provided, otherwise a colour
   placeholder carrying the step label. */
function PanelInner({ s }: { s: Step }) {
  if (s.image) {
    return (
      <Image
        src={s.image}
        alt={s.tag}
        fill
        sizes="(max-width: 1024px) 100vw, 45vw"
        className="object-cover"
        {...(s.imageLqip
          ? { placeholder: 'blur' as const, blurDataURL: s.imageLqip }
          : {})}
      />
    )
  }
  return (
    <div
      className="flex h-full w-full items-center justify-center px-8 text-center"
      style={{ backgroundColor: s.color }}
    >
      <span
        className="font-black text-white/95"
        style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
      >
        {s.tag}
      </span>
    </div>
  )
}

const STEPS: Step[] = [
  {
    tag: 'Sensitivity & Gums',
    color: '#E2604A',
    image: '/gum.png',
    title: 'Daily relief from sensitivity & gum problems, with a triple-salt formula',
    underline: 'triple-salt formula',
    sub: 'Containing sodium chloride, potassium nitrate & calcium carbonate.',
    bullets: [
      {
        label: 'Reduces Redness',
        icon: <path d="M6.4 17c1.8 1.1 3.4 1.1 5.2 0" strokeWidth={1.5} />,
      },
      {
        label: 'Relieves Swelling',
        icon: (
          <>
            <path d="M4.7 7q1-.9 2 0" strokeWidth={1.4} />
            <path d="M19.3 7q-1-.9-2 0" strokeWidth={1.4} />
          </>
        ),
      },
      {
        label: 'Prevents Bleeding',
        icon: (
          <path
            d="M18 12.5c1.1 1.3 1.7 2.3 1.7 3.1a1.7 1.7 0 0 1-3.4 0c0-.8.6-1.8 1.7-3.1z"
            strokeWidth={1.4}
          />
        ),
      },
    ],
  },
  {
    tag: 'Enamel Protection',
    color: '#2FA36B',
    image: '/brushing-teeth.webp',
    title: 'Specialized low-abrasive formula to protect enamel',
    rda: true,
  },
  {
    tag: 'Tooth & Gum Care',
    color: '#2F6FE0',
    image: '/dentist.png',
    title: 'Doctor-developed toothpaste for tooth & gum care',
    features: true,
  },
]

export default function EmoformScrollytelling({ cms }: { cms?: EmoformView }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)

  /* Merge Sanity step text/images over the in-code defaults (icons, colours,
     RDA gauge and layout stay fixed per position). */
  const steps = STEPS.map((s, i) => {
    const c = cms?.steps?.[i]
    return {
      ...s,
      tag: c?.tag ?? s.tag,
      title: c?.title ?? s.title,
      sub: c?.sub ?? s.sub,
      image: c?.image ?? s.image,
      imageLqip: c?.imageLqip,
      bullets: s.bullets?.map((b, j) => ({
        ...b,
        label: c?.points?.[j] ?? b.label,
      })),
    }
  })

  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  /* Active-step detection (BigenClient pattern): observe each right step
     against the #page-scroller centre line. */
  useEffect(() => {
    const root = document.getElementById('page-scroller')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            if (!Number.isNaN(idx)) setActive(idx)
          }
        })
      },
      { root, rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  /* Pin the left card for the whole section (desktop). It only releases when the
     section bottom reaches the viewport bottom, i.e. once the last step has
     scrolled up, after which the whole page moves together. */
  useEffect(() => {
    if (reduce) return
    const scroller = document.getElementById('page-scroller')
    const mq = window.matchMedia('(min-width: 1024px)')
    if (!mq.matches || !sectionRef.current || !leftRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        scroller: scroller ?? undefined,
        start: 'top top',
        end: 'bottom bottom',
        pin: leftRef.current,
        pinSpacing: false,
        invalidateOnRefresh: true,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduce])

  const renderTitle = (s: Step) => {
    if (s.underline && s.title.includes(s.underline)) {
      const idx = s.title.indexOf(s.underline)
      return (
        <>
          {s.title.slice(0, idx)}
          <Underlined color={s.color} reduce={reduce}>
            {s.underline}
          </Underlined>
          {s.title.slice(idx + s.underline.length)}
        </>
      )
    }
    return s.title
  }

  return (
    <section ref={sectionRef} className={`${inter.className} bg-white`}>
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
          {/* ── LEFT: pinned frame, panel slides to the active step (desktop) ── */}
          <div ref={leftRef} className="hidden h-screen items-center lg:flex">
            <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl">
              <motion.div
                className="absolute inset-0"
                animate={{ y: `-${active * 100}%` }}
                transition={
                  reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }
                }
              >
                {steps.map((s, i) => (
                  <div key={i} className="relative h-full w-full overflow-hidden">
                    <PanelInner s={s} />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ── RIGHT: scrolling steps ── */}
          <div>
            {steps.map((s, i) => (
              <div
                key={i}
                className="flex min-h-[85vh] flex-col justify-center py-14 lg:justify-start lg:pt-[15vh]"
              >
                {/* Mobile panel sits above its text (no pinning on small screens) */}
                <div className="relative mb-7 aspect-[4/3] overflow-hidden rounded-2xl lg:hidden">
                  <PanelInner s={s} />
                </div>

                {/* The content block is the observer target — its top is the
                    heading, so the left image only swaps once the heading itself
                    reaches the viewport (card) centre. */}
                <motion.div
                  data-index={i}
                  ref={(el) => {
                    stepRefs.current[i] = el
                  }}
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <h3
                    className="font-extrabold leading-[1.12] tracking-[-0.02em]"
                    style={{
                      color: NAVY,
                      fontSize: 'clamp(1.75rem, 3.4vw, 2.85rem)',
                    }}
                  >
                    {renderTitle(s)}
                  </h3>

                  {s.sub && (
                    <p
                      className="mt-5 max-w-[46ch] leading-relaxed text-[#3a4663]"
                      style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.25rem)' }}
                    >
                      {s.sub}
                    </p>
                  )}

                  {s.bullets && (
                    <div className="mt-7 flex flex-col items-start gap-3">
                      {s.bullets.map((b) => (
                        <div
                          key={b.label}
                          className="flex w-fit items-center gap-4 rounded-2xl py-2.5 pl-2.5 pr-6"
                          style={{ backgroundColor: NAVY }}
                        >
                          <span
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white"
                            style={{ color: NAVY }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.6}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <path d={TOOTH} />
                              {b.icon}
                            </svg>
                          </span>
                          <span
                            className="font-extrabold text-white"
                            style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.35rem)' }}
                          >
                            {b.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {s.rda && <RdaGauge reduce={reduce} />}

                  {s.features && (
                    <div className="mt-8 flex flex-wrap gap-8 sm:gap-10">
                      {FEATURES.map((f, fi) => (
                        <div
                          key={fi}
                          className="flex flex-col items-center gap-3 text-center"
                        >
                          <span
                            className="flex h-16 w-16 items-center justify-center rounded-full border md:h-[72px] md:w-[72px]"
                            style={{
                              borderColor: 'rgba(19,48,110,0.28)',
                              color: NAVY,
                            }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.6}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-8 w-8"
                            >
                              {f.icon}
                            </svg>
                          </span>
                          <span
                            className="font-bold"
                            style={{ color: NAVY, fontSize: '0.95rem' }}
                          >
                            {cms?.steps?.[i]?.points?.[fi] ?? f.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
