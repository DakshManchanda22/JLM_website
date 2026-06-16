'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Footer from '@/components/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
})

const BEIGE = '#E8E0D5'
const INK = '#111111'
const MUTED = '#555555'
const EASE = [0.16, 1, 0.3, 1] as const

const FUNCTION_OPTIONS = [
  'Sales',
  'Marketing',
  'HR',
  'Finance and Accounts',
  'IT',
  'Legal',
  'Supply Chain',
  'Manufacturing & Operations',
  'Others',
]
const LOCATION_OPTIONS = ['East', 'West', 'North', 'South', 'Central']
const QUALIFICATION_OPTIONS = [
  'Diploma',
  'Graduation (BA, B Com, BSc etc)',
  'Engineering (B. Tech, B.E)',
  'Post Graduation (MBA, PGDBM, MA, MCOM, MSc etc)',
  'PhD',
]
const QUALIFICATION_TYPE_OPTIONS = ['Full Time', 'Part Time', 'Executive Program']

type FormState = 'idle' | 'sending' | 'success' | 'error'

const REQUIRED_FIELDS = [
  'function',
  'name',
  'phone',
  'email',
  'subject',
  'age',
  'location',
  'qualification',
  'qualificationType',
  'university',
  'employer',
  'experience',
] as const

export default function CareersPage() {
  const [status, setStatus] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function clearError(field: string) {
    setErrors((prev) => {
      if (!prev.has(field)) return prev
      const next = new Set(prev)
      next.delete(field)
      return next
    })
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Validate required fields ourselves so we control the visual feedback
    const fd = new FormData(e.currentTarget)
    const missing = new Set<string>()
    for (const field of REQUIRED_FIELDS) {
      const v = fd.get(field)
      if (typeof v !== 'string' || v.trim() === '') missing.add(field)
    }
    const resume = fd.get('resume')
    if (!(resume instanceof File) || resume.size === 0) missing.add('resume')

    if (missing.size > 0) {
      setErrors(missing)
      setStatus('error')
      setErrorMsg('Please fill in the highlighted fields.')
      // Scroll the first missing field into view
      const first = formRef.current?.querySelector<HTMLElement>(
        `[data-field="${[...missing][0]}"]`,
      )
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setErrors(new Set())
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/careers', { method: 'POST', body: fd })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(json.error || `Submission failed (${res.status})`)
      }
      setStatus('success')
      formRef.current?.reset()
      setFileName('')
    } catch (err) {
      // Network/server error — keep user input intact
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className={`${cormorant.variable} ${dmSans.variable}`}>
      {/* ─── HERO ─── */}
      <section
        className="relative w-full"
        style={{ minHeight: '52vh', backgroundColor: BEIGE, padding: '14vh 6vw 8vh' }}
      >
        <div className="max-w-[820px] mx-auto text-center">
          <p
            className={`${dmSans.className} uppercase tracking-[0.22em]`}
            style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}
          >
            Careers
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className={`${cormorant.className} mt-6`}
            style={{
              fontSize: 'clamp(40px, 6vw, 84px)',
              lineHeight: 1.04,
              fontWeight: 300,
              color: INK,
            }}
          >
            Join{' '}
            <span className="italic" style={{ fontWeight: 400 }}>
              us
            </span>
          </motion.h1>
          <p
            className={`${cormorant.className} italic mt-4`}
            style={{ fontSize: 'clamp(18px, 2vw, 24px)', color: MUTED, fontWeight: 400 }}
          >
            Help us build the next hundred years of goodness for Indian families.
          </p>
          <p
            className={`${dmSans.className} mt-6 max-w-[58ch] mx-auto`}
            style={{ color: MUTED, fontSize: 15, lineHeight: 1.7 }}
          >
            Tell us a little about yourself and attach your CV. We read every application — even
            if there isn&rsquo;t an open role today, the right person stays on our radar.
          </p>
        </div>
      </section>

      {/* ─── FORM ─── */}
      <section
        className="relative w-full"
        style={{ backgroundColor: '#FFFFFF', padding: '8vh 6vw 14vh' }}
      >
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          className="max-w-[820px] mx-auto"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Field label="Function" required name="function" error={errors.has('function')}>
              <Select
                name="function"
                options={FUNCTION_OPTIONS}
                error={errors.has('function')}
                onChange={() => clearError('function')}
              />
            </Field>

            <Field label="Name" required name="name" error={errors.has('name')}>
              <Input
                name="name"
                type="text"
                placeholder="Full name"
                error={errors.has('name')}
                onInput={() => clearError('name')}
              />
            </Field>

            <Field label="Phone number" required name="phone" error={errors.has('phone')}>
              <Input
                name="phone"
                type="tel"
                placeholder="+91 ..."
                error={errors.has('phone')}
                onInput={() => clearError('phone')}
              />
            </Field>

            <Field label="Email" required name="email" error={errors.has('email')}>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                error={errors.has('email')}
                onInput={() => clearError('email')}
              />
            </Field>

            <Field label="Subject" required full name="subject" error={errors.has('subject')}>
              <Input
                name="subject"
                type="text"
                placeholder="What role are you applying for?"
                error={errors.has('subject')}
                onInput={() => clearError('subject')}
              />
            </Field>

            <Field label="Age" required name="age" error={errors.has('age')}>
              <Input
                name="age"
                type="number"
                min={16}
                max={99}
                placeholder="e.g. 27"
                error={errors.has('age')}
                onInput={() => clearError('age')}
              />
            </Field>

            <Field label="Location" required name="location" error={errors.has('location')}>
              <Select
                name="location"
                options={LOCATION_OPTIONS}
                error={errors.has('location')}
                onChange={() => clearError('location')}
              />
            </Field>

            <Field
              label="Qualification"
              required
              name="qualification"
              error={errors.has('qualification')}
            >
              <Select
                name="qualification"
                options={QUALIFICATION_OPTIONS}
                error={errors.has('qualification')}
                onChange={() => clearError('qualification')}
              />
            </Field>

            <Field
              label="Qualification type"
              required
              name="qualificationType"
              error={errors.has('qualificationType')}
            >
              <Select
                name="qualificationType"
                options={QUALIFICATION_TYPE_OPTIONS}
                error={errors.has('qualificationType')}
                onChange={() => clearError('qualificationType')}
              />
            </Field>

            <Field label="University" required full name="university" error={errors.has('university')}>
              <Input
                name="university"
                type="text"
                placeholder="Where did you study?"
                error={errors.has('university')}
                onInput={() => clearError('university')}
              />
            </Field>

            <Field label="Current employer" required name="employer" error={errors.has('employer')}>
              <Input
                name="employer"
                type="text"
                placeholder="Where you work now"
                error={errors.has('employer')}
                onInput={() => clearError('employer')}
              />
            </Field>

            <Field label="Years of experience" required name="experience" error={errors.has('experience')}>
              <Input
                name="experience"
                type="number"
                min={0}
                max={60}
                placeholder="e.g. 4"
                error={errors.has('experience')}
                onInput={() => clearError('experience')}
              />
            </Field>

            {/* Resume upload — spans both columns */}
            <Field
              label="Resume (PDF, DOC, DOCX — max 5 MB)"
              required
              full
              name="resume"
              error={errors.has('resume')}
            >
              <div className="flex items-center gap-4">
                <label
                  className={`${dmSans.className} cursor-pointer inline-block`}
                  style={{
                    border: `1px solid ${errors.has('resume') ? '#c93a3a' : INK}`,
                    color: errors.has('resume') ? '#c93a3a' : INK,
                    fontSize: 13,
                    padding: '12px 22px',
                    borderRadius: 999,
                    letterSpacing: '0.05em',
                    backgroundColor: errors.has('resume') ? 'rgba(201,58,58,0.05)' : '#FFFFFF',
                  }}
                >
                  Choose file
                  <input
                    ref={fileInputRef}
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      setFileName(f?.name || '')
                      if (f) clearError('resume')
                    }}
                    className="hidden"
                  />
                </label>
                <span
                  className={`${dmSans.className}`}
                  style={{ fontSize: 13, color: fileName ? INK : MUTED }}
                >
                  {fileName || 'No file chosen'}
                </span>
              </div>
            </Field>
          </div>

          {/* submit */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <button
              type="submit"
              disabled={status === 'sending'}
              className={`${dmSans.className}`}
              style={{
                border: `1px solid ${INK}`,
                backgroundColor: status === 'sending' ? MUTED : INK,
                color: '#FFFFFF',
                fontSize: 13,
                padding: '16px 44px',
                borderRadius: 999,
                letterSpacing: '0.06em',
                cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                opacity: status === 'sending' ? 0.7 : 1,
                transition: 'opacity 200ms',
              }}
            >
              {status === 'sending' ? 'Sending…' : 'Submit application'}
            </button>

            {status === 'success' && (
              <p
                className={`${cormorant.className} italic`}
                style={{ color: INK, fontSize: 18 }}
              >
                Thank you — we&rsquo;ve received your application. We&rsquo;ll be in touch.
              </p>
            )}
            {status === 'error' && (
              <p
                className={`${dmSans.className}`}
                style={{ color: '#9b1c1c', fontSize: 13 }}
              >
                {errorMsg || 'Something went wrong. Please try again.'}
              </p>
            )}
          </div>
        </form>
      </section>

      <Footer />
    </div>
  )
}

/* ─────────────────── form atoms ─────────────────── */

const ERROR_RED = '#c93a3a'
const ERROR_BG = 'rgba(201,58,58,0.05)'

function Field({
  label,
  children,
  required,
  full,
  name,
  error,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
  full?: boolean
  name?: string
  error?: boolean
}) {
  return (
    <div className={full ? 'md:col-span-2' : ''} data-field={name}>
      <label
        className={`${dmSans.className} block uppercase tracking-[0.18em]`}
        style={{
          fontSize: 11,
          color: error ? ERROR_RED : MUTED,
          fontWeight: 500,
          marginBottom: 8,
        }}
      >
        {label}
        {required && (
          <span style={{ color: error ? ERROR_RED : INK, marginLeft: 4 }}>*</span>
        )}
      </label>
      {children}
    </div>
  )
}

const fieldBase: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: `1px solid ${BEIGE}`,
  borderRadius: 8,
  backgroundColor: '#FFFFFF',
  color: INK,
  fontSize: 14,
  lineHeight: 1.4,
  outline: 'none',
  transition: 'border-color 200ms, background-color 200ms',
}

function Input({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const style: React.CSSProperties = {
    ...fieldBase,
    borderColor: error ? ERROR_RED : BEIGE,
    backgroundColor: error ? ERROR_BG : '#FFFFFF',
  }
  return (
    <input
      {...props}
      className={dmSans.className}
      style={style}
      onFocus={(e) => (e.currentTarget.style.borderColor = error ? ERROR_RED : INK)}
      onBlur={(e) => (e.currentTarget.style.borderColor = error ? ERROR_RED : BEIGE)}
    />
  )
}

function Select({
  name,
  options,
  error,
  onChange,
}: {
  name: string
  options: string[]
  error?: boolean
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}) {
  const style: React.CSSProperties = {
    ...fieldBase,
    appearance: 'none',
    backgroundImage: 'none',
    borderColor: error ? ERROR_RED : BEIGE,
    backgroundColor: error ? ERROR_BG : '#FFFFFF',
  }
  return (
    <select
      name={name}
      defaultValue=""
      onChange={onChange}
      className={dmSans.className}
      style={style}
      onFocus={(e) => (e.currentTarget.style.borderColor = error ? ERROR_RED : INK)}
      onBlur={(e) => (e.currentTarget.style.borderColor = error ? ERROR_RED : BEIGE)}
    >
      <option value="" disabled>
        Select…
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}
