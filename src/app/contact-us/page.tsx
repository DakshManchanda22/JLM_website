'use client'

import { useState } from 'react'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Footer from '@/components/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const EASE = [0.16, 1, 0.3, 1] as const

const PORTRAITS = [
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1546961342-1d6c2c8b1e08?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1542178243-bc20204b769f?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=500&fit=crop&auto=format',
]

const offices = [
  {
    title: 'Registered Office: Kolkata',
    address:
      'Adventz Infinity @ 5, Plot No. 5,\nBlock - BN, North Wing, No. 1106,\n11th Floor, Sector - V, Salt Lake,\nKolkata - 700 091.',
    phone: '(033) 22480114',
    phoneHref: 'tel:+913322480114',
    email: 'info@jlmorison.com',
  },
  {
    title: 'Head Office: Mumbai',
    address:
      'Peninsula Business Park, Tower "A",\n8th Floor, Senapati Bapat Marg,\nLower Parel, Mumbai - 400 013.',
    phone: '(022) 61410300',
    phoneHref: 'tel:+912261410300',
    email: 'customercare@jlmorison.com',
  },
]

type FormState = {
  firstName: string
  lastName: string
  email: string
  message: string
  privacy: boolean
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

/* ────────────────────────────────────────────────────────────
 * Rotating portrait wheel — full-circle carousel that turns
 * continuously clockwise. Cards are placed via sin/cos around a
 * large centred circle; the section clips overflow so the wheel
 * bleeds off the sides.
 * ──────────────────────────────────────────────────────────── */
function PortraitWheel() {
  const wheelSize = 1300
  const radius = 540
  const total = PORTRAITS.length

  return (
    <section className="relative bg-[#FFF8EF] overflow-hidden h-[620px] md:h-[720px]">
      {/* Wheel box — top-aligned with section so the topmost card stays
          visible. Wheel center sits at (50%, wheelSize/2) which is well
          below the section's bottom, so we only see the TOP arc + sides. */}
      <motion.div
        className="absolute left-1/2"
        style={{
          width: wheelSize,
          height: wheelSize,
          marginLeft: -wheelSize / 2,
          top: 0,
        }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 70,
        }}
      >
        {PORTRAITS.map((src, i) => {
          const angleDeg = (i / total) * 360
          const angleRad = (angleDeg * Math.PI) / 180
          const cx = wheelSize / 2 + radius * Math.sin(angleRad)
          const cy = wheelSize / 2 - radius * Math.cos(angleRad)

          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: cx,
                top: cy,
                width: 150,
                height: 190,
                transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.7,
                  ease: EASE,
                  delay: 0.05 + (i % 14) * 0.04,
                }}
                className="relative w-full h-full"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="150px"
                  className="object-cover rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                />
              </motion.div>
            </div>
          )
        })}
      </motion.div>

      {/* Centre text + CTA — sits in front of the wheel, pushed
          down so it sits inside the lower curve of the arc. */}
      <div className="relative h-full flex flex-col items-center justify-end pb-16 md:pb-24 text-center px-6 z-10 pointer-events-none">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="text-4xl md:text-6xl font-serif font-light text-[#111111] leading-[1.1] mb-8 max-w-xl"
        >
          Want to work with us?
        </motion.h2>
        <motion.a
          href="/careers"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          className="pointer-events-auto inline-flex items-center gap-3 bg-[#111111] text-white text-sm font-medium px-7 py-4 rounded-full hover:bg-[#333333] transition-colors"
          style={{ fontFamily: 'var(--font-dm-sans)' }}
        >
          Join the team
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 8H14M14 8L9 3M14 8L9 13"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.a>
      </div>
    </section>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    privacy: false,
  })
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.message.trim()) e.message = 'Required'
    if (!form.privacy) e.privacy = 'Please agree to continue'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          message: form.message,
        }),
      })
      if (!res.ok) {
        setStatus('error')
        return
      }
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const inputBase =
    'w-full rounded-xl bg-[#F5F2EE] px-4 py-3 text-sm text-[#111111] placeholder:text-[#AAAAAA] outline-none focus:ring-2 focus:ring-[#111111]/20 transition-all'

  return (
    <div className={`${cormorant.variable} ${dmSans.variable} min-h-screen bg-[#EDEAE4]`}>
      {/* ── Main contact section ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — heading + contact details */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h1
              className="text-5xl md:text-6xl font-serif font-light text-[#111111] leading-tight mb-3"
            >
              Contact us
            </h1>
            <p
              className="text-sm text-[#555555] mb-12 leading-relaxed"
              style={{ fontFamily: 'var(--font-dm-sans)' }}
            >
              We&apos;d love to hear from you. Fill out the form and we&apos;ll get back to you shortly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              {offices.map((office, i) => (
                <motion.div
                  key={office.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.1 + i * 0.08 }}
                >
                  <p
                    className="text-base font-semibold text-[#111111] mb-2"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  >
                    {office.title}
                  </p>
                  <p
                    className="text-sm text-[#555555] leading-relaxed whitespace-pre-line mb-4"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  >
                    {office.address}
                  </p>
                  <a
                    href={office.phoneHref}
                    className="block text-sm font-medium text-[#111111] hover:text-[#555555] transition-colors mb-1"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  >
                    {office.phone}
                  </a>
                  <a
                    href={`mailto:${office.email}`}
                    className="block text-sm font-medium text-[#111111] hover:text-[#555555] transition-colors"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  >
                    {office.email}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — form card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
            className="bg-white rounded-2xl shadow-sm p-8 md:p-10"
          >
            {status === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                {/* Checkmark */}
                <div className="w-14 h-14 rounded-full bg-[#111111] flex items-center justify-center mb-6">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 11.5L9 16.5L18 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2
                  className="text-3xl font-serif font-light text-[#111111] mb-3"
                >
                  Message sent.
                </h2>
                <p
                  className="text-sm text-[#555555] leading-relaxed max-w-xs"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                  Thank you for reaching out. Someone from our team will be in touch with you soon.
                </p>
              </motion.div>
            ) : (
              <>
                <h2
                  className="text-2xl font-serif font-light text-[#111111] mb-6"
                >
                  Write us a message
                </h2>

                <form onSubmit={handleSubmit} noValidate className="space-y-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {/* First + Last name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#111111] mb-1.5">
                        First name <span className="text-[#B8956A]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Jane"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className={inputBase}
                      />
                      {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-[#111111] mb-1.5">
                        Last name <span className="text-[#B8956A]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Smith"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className={inputBase}
                      />
                      {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs text-[#111111] mb-1.5">
                      Email <span className="text-[#B8956A]">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="jane@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputBase}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs text-[#111111] mb-1.5">
                      Message <span className="text-[#B8956A]">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Leave us a message…"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputBase} resize-none`}
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  {/* Privacy checkbox */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <div className="relative mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          checked={form.privacy}
                          onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
                          className="peer sr-only"
                        />
                        <div className="w-4 h-4 rounded border border-[#CCCCCC] bg-[#F5F2EE] peer-checked:bg-[#111111] peer-checked:border-[#111111] transition-colors" />
                        {form.privacy && (
                          <svg
                            className="absolute inset-0 m-auto w-2.5 h-2.5 text-white pointer-events-none"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-[#555555] leading-relaxed">
                        I agree to the{' '}
                        <a href="https://storage.googleapis.com/jlm_website_v2/Privacy-Policy.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#111111]">
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>
                    {errors.privacy && <p className="text-xs text-red-500 mt-1 ml-7">{errors.privacy}</p>}
                  </div>

                  {status === 'error' && (
                    <p className="text-xs text-red-500">
                      Something went wrong. Please try again, or email us directly.
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full rounded-xl bg-[#111111] text-white text-sm py-3.5 font-medium hover:bg-[#333333] disabled:opacity-50 transition-colors mt-1"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Join the team rotating wheel ── */}
      <PortraitWheel />

      {/* Footer */}
      <div style={{ backgroundColor: '#FFF8EF' }}>
        <Footer />
      </div>
    </div>
  )
}
