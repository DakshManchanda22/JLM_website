import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { fetchContactRecipients } from '@/sanity/queries'

export const runtime = 'nodejs'

const FIELDS = ['firstName', 'lastName', 'email', 'message'] as const

type FieldKey = (typeof FIELDS)[number]

const LABELS: Record<FieldKey, string> = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  message: 'Message',
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Email service is not configured. Set RESEND_API_KEY in env.' },
      { status: 500 },
    )
  }

  let body: Partial<Record<FieldKey, unknown>>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid form submission.' }, { status: 400 })
  }

  const values: Partial<Record<FieldKey, string>> = {}
  for (const f of FIELDS) {
    const v = body[f]
    if (typeof v === 'string') values[f] = v.trim()
  }

  // All fields required
  for (const f of FIELDS) {
    if (!values[f]) {
      return NextResponse.json({ error: `Missing required field: ${LABELS[f]}.` }, { status: 400 })
    }
  }

  if (!/\S+@\S+\.\S+/.test(values.email!)) {
    return NextResponse.json({ error: 'Please provide a valid email.' }, { status: 400 })
  }

  const rows = FIELDS.map(
    (f) => `
      <tr>
        <td style="padding:8px 14px;border-bottom:1px solid #eee;color:#555;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;width:140px;vertical-align:top;">${LABELS[f]}</td>
        <td style="padding:8px 14px;border-bottom:1px solid #eee;color:#111;font-size:15px;white-space:pre-wrap;">${escapeHtml(values[f]!)}</td>
      </tr>`,
  ).join('')

  const html = `
  <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#f7f5f1;padding:32px;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;">
      <h2 style="margin:0 0 4px 0;font-weight:300;font-size:24px;color:#111;">New contact enquiry</h2>
      <p style="margin:0 0 24px 0;color:#777;font-size:13px;">JL Morison (India) Ltd. — submitted via jlmorison.com/contact-us</p>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
    </div>
  </div>`

  // Recipients are managed in Sanity (Contact Us → "Send enquiries to"). Fall
  // back to the CONTACT_TO_EMAILS env var, then the support inboxes, so the form
  // still works if the CMS field is empty or unreachable.
  const sanityRecipients = await fetchContactRecipients().catch(() => [])
  const toEmails = (
    sanityRecipients.length > 0
      ? sanityRecipients
      : (process.env.CONTACT_TO_EMAILS || 'customercare@jlmorison.com,info@jlmorison.com')
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean)
  )

  // Sender must be on a domain verified inside Resend.
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'website@jlmorison.com'

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: `JL Morison Website <${fromEmail}>`,
      to: toEmails,
      replyTo: values.email,
      subject: `New enquiry — ${values.firstName} ${values.lastName}`,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send. Please try again.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 })
  }
}
