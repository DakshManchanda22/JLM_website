import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_FILE_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const FIELDS = [
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

type FieldKey = (typeof FIELDS)[number]

const LABELS: Record<FieldKey, string> = {
  function: 'Function',
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  subject: 'Subject',
  age: 'Age',
  location: 'Location',
  qualification: 'Qualification',
  qualificationType: 'Qualification type',
  university: 'University',
  employer: 'Current employer',
  experience: 'Years of experience',
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

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form submission.' }, { status: 400 })
  }

  const values: Partial<Record<FieldKey, string>> = {}
  for (const f of FIELDS) {
    const v = formData.get(f)
    if (typeof v === 'string') values[f] = v.trim()
  }

  // All form fields are required
  for (const f of FIELDS) {
    if (!values[f]) {
      return NextResponse.json({ error: `Missing required field: ${LABELS[f]}.` }, { status: 400 })
    }
  }

  // Resume
  const resume = formData.get('resume')
  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json({ error: 'Please attach your resume.' }, { status: 400 })
  }
  if (resume.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: 'Resume must be 5 MB or smaller.' }, { status: 400 })
  }
  if (!ALLOWED_FILE_TYPES.has(resume.type)) {
    return NextResponse.json(
      { error: 'Resume must be a PDF or Word document.' },
      { status: 400 },
    )
  }

  const buffer = Buffer.from(await resume.arrayBuffer())

  // HTML body
  const rows = FIELDS.filter((f) => values[f]).map(
    (f) => `
      <tr>
        <td style="padding:8px 14px;border-bottom:1px solid #eee;color:#555;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;width:160px;vertical-align:top;">${LABELS[f]}</td>
        <td style="padding:8px 14px;border-bottom:1px solid #eee;color:#111;font-size:15px;">${escapeHtml(values[f]!)}</td>
      </tr>`,
  ).join('')

  const html = `
  <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#f7f5f1;padding:32px;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;">
      <h2 style="margin:0 0 4px 0;font-weight:300;font-size:24px;color:#111;">New career application</h2>
      <p style="margin:0 0 24px 0;color:#777;font-size:13px;">JL Morison (India) Ltd. — submitted via jlmorison.com/careers</p>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
      <p style="margin:24px 0 0 0;color:#777;font-size:12px;">Resume attached: ${escapeHtml(resume.name)} (${(resume.size / 1024).toFixed(1)} KB)</p>
    </div>
  </div>`

  const hrEmail = process.env.HR_EMAIL || 'hr@jlmorison.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'careers@jlmorison.com'

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: `JL Morison Careers <${fromEmail}>`,
      to: [hrEmail],
      replyTo: values.email,
      subject: `New application — ${values.name} (${values.function})`,
      html,
      attachments: [
        {
          filename: resume.name,
          content: buffer,
        },
      ],
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send. Please try again.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Careers API error:', err)
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 })
  }
}
