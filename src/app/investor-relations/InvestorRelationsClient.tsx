'use client'

import { useState } from 'react'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { AnimatePresence, motion } from 'framer-motion'
import Footer from '@/components/Footer'
import type {
  InvestorRelations,
  IRColumn,
  IRContact,
  IRDoc,
  IRProcedureItem,
} from '@/sanity/queries'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
})

const INK = '#111111'
const SUB = '#555555'
const BEIGE = '#E8E0D5'
const FAINT = '#F7F4EF'
const LINK = '#1D4E89'
const EASE = [0.22, 1, 0.36, 1] as const

/* ───────────────────────── Defaults (from the client's brief) ─────────────────────────
   Every field below is overridden by Sanity when marketing fills it in; these keep the
   page fully populated out of the box. PDF links have no href yet — marketing attaches
   each PDF (upload or URL) in Sanity. */
const doc = (label: string): IRDoc => ({ label })

/* Notice of General Meetings — a true row×column grid. Columns are the financial
   years; each inner array is one document-type row with a cell per column (blank
   where that year has no such document). All editable in Sanity. */
const NOTICE_HEADINGS = [
  'FY 2025-26',
  'FY 2024-25 (Under Process)',
  'FY 2023-24',
  'FY 2022-23',
  'FY 2021-22',
  'FY 2020-21',
  'Archives',
]
const NP = 'Newspaper Publication of Notice of AGM and Book Closure and E-voting Intimation'
const NOTICE_MATRIX: string[][] = [
  ['', 'Notice for Annual General Meeting for F.Y. 2024-25', 'Notice for Annual General Meeting for F.Y. 2023-24', 'Notice for Annual General Meeting for F.Y. 2022-23', 'Notice for Annual General Meeting for F.Y. 2021-22', 'Notice for Annual General Meeting for the F.Y. 2020-21', 'Notice for Annual General Meeting for the F.Y. 2019-20'],
  ['', `${NP} 2024-25`, `${NP} 2023-24`, `${NP} 2022-23`, `${NP} 2021-22`, `${NP} 2020-21`, `${NP} 2019-20`],
  ['', 'Scrutinizer Report 2024-25', 'Scrutinizer Report 2023-24', 'Scrutinizer Report 2022-23', 'Scrutinizer Report 2021-22', 'Scrutinizer Report 2020-21', 'Scrutinizer Report 2019-20'],
  ['', 'Attendance Slip 2024-25', 'Attendance Slip 2023-24', 'Attendance Slip 2022-23', 'Attendance Slip 2021-22', 'Attendance Slip 2020-21', 'Attendance Slip 2019-20'],
  ['', 'Proxy Form 2024-25', 'Proxy Form 2023-24', 'Proxy Form 2022-23', 'Proxy Form 2021-22', 'Proxy Form 2020-21', 'Proxy Form 2019-20'],
  ['', 'Annual Return 2024-25', 'Annual Return 2023-24', 'Annual Return 2022-23', 'Annual Return 2021-22', 'Annual Return 2020-21', 'Notice for Annual General Meeting for the F.Y. 2018-19'],
  ['', 'AGM Voting Results 2024-25', 'AGM Voting Results 2023-24', 'AGM Voting Results 2022-23', '', '', `${NP} 2018-19.`],
  ['Postal Ballot Notice dated 21st March, 2025, 19th September, 2025', '', 'Postal Ballot Notice dated 25th September, 2023', 'Postal Ballot Notice dated 22nd February, 2023', '', '', 'Notice for Annual General Meeting for the F.Y. 2017-18'],
  ['', '', 'Postal Ballot Form dated 25th September, 2023', '', '', '', `${NP} 2017-18.`],
  ['Newspaper Publication dated 7th May, 2025, 18th October, 2025 for Postal Ballot Notice', '', 'Newspaper Publication dated 8th November, 2023 for Postal Ballot Notice', 'Newspaper Publication dated 1st March, 2023 for Postal Ballot Notice', '', '', 'Notice for Annual General Meeting for the F.Y. 2016-17'],
  ['Scrutinizer Report on Postal Ballot 06th June, 2025, 18th November, 2025', '', 'Scrutinizer Report on Postal Ballot', 'Scrutinizer Report on Postal Ballot', '', '', `${NP} 2016-17.`],
  ['', '', '', 'Newspaper Publication dated 1st April, 2023 for Postal Ballot Notice', '', '', ''],
  ['Voting Results of Postal Ballot 06th June, 2025, 18th November, 2025', '', 'Voting Results of Postal Ballot', 'Voting Results of Postal Ballot', '', '', ''],
]

const D = {
  termsHeading: 'TERMS OF APPOINTMENT OF INDEPENDENT DIRECTORS',
  termsDocs: [doc('Terms of Appointment of Independent Directors')],

  csrHeading: 'CORPORATE SOCIAL RESPONSIBILITY COMMITTEE',
  csrMembers: [
    { name: 'Mr. Sohan Sarda', designation: 'Chairman' },
    { name: 'Mrs. Annapurna Dubey', designation: 'Member' },
    { name: 'Mr. Chandra Kumar Murarka', designation: 'Member' },
  ],

  policiesHeading: 'POLICIES',
  policiesDocs: [
    doc('Corporate Social Responsibility Policy'),
    doc('CSR Annual Action Plan – 2022-23'),
    doc('CSR Annual Action Plan – 2023-24'),
    doc('CSR Annual Action Plan – 2024-25'),
    doc('Remuneration Policy'),
  ],

  noticeHeading: 'Notice of General Meetings/Postal Ballot',
  noticeHeadings: NOTICE_HEADINGS,
  noticeRows: NOTICE_MATRIX.map((cells) => ({ cells: cells.map((label) => ({ label })) })),

  investorsHeading: 'INVESTORS INFORMATION',
  investorsIntro:
    'For any assistance regarding dematerialization of shares, share transfers, transmissions, change of address, non – receipt of dividend or any other grievances, please write to:',
  investorsContacts: [
    {
      body: [
        'Sohan Sarda',
        'Executive Director',
        'J.L. Morison (India) Limited',
        'Peninsula Business Park,',
        "Tower ‘A’, 8th Floor,",
        'Senapati Bapat Marg,',
        'Lower Parel,',
        'Mumbai – 400 013',
        'email: investors@jlmorison.com',
        'Phone No : 022 – 2497 5031, 6141 0300',
      ].join('\n'),
    },
    {
      heading: 'Registrar & Transfer Agents :',
      body: [
        'C B Management Services (P) Limited',
        'Rasoi Court 5th Floor',
        '20, Sir R N Mukherjee Road,',
        'Kolkata – 700001.',
        'Tel No: 033 6906 6200',
        'Email: rta@cbmsl.com',
      ].join('\n'),
    },
    {
      heading: 'REGISTERED OFFICE :',
      body: [
        'Adventz Infinity @ 5, Plot No. 5,',
        'Block – BN, North Wing, No. 1106,',
        '11th Floor, Sector – V, Salt Lake',
        'Kolkata – 700 091.',
        'Phone No : 033 22480114.',
      ].join('\n'),
    },
  ] as IRContact[],
  investorsDocs: [
    doc('Details for Registration process and form for E-communication'),
    doc('Nomination Form'),
    doc('Format for reporting loss of share certificate'),
    doc('ECS (Electronic Clearing System) Mandate'),
    doc('Form SH-14'),
  ],
  campaignHeading: '100 DAYS CAMPAIGN-SAKSHAM NIVESHAK',
  campaignDocs: [
    doc('Letter by IEPF authority'),
    doc('News paper publication SAKSHAM NIVESHAK 100 Days Campaign'),
  ],
  multipleMailingHeading: 'Multiple Mailing',
  multipleMailingBody:
    'Multiple mailings would occur if the shares of the Company are held in multiple folio having identical / same address. Shareholders having identical / same address may opt for receiving single copy of Annual Report for multiple folio. The Shareholders are requested to send their written request to the RTA – C B Management Services (P) Limited indicating their Folio nos. / Client ID / DP ID.',

  iepfHeading: 'IEPF',
  iepfContactHeading: 'Nodal Officer for IEPF Authority',
  iepfContact: [
    'Sohan Sarda',
    'Executive Director',
    'J.L. Morison (India) Limited.',
    "Peninsula Business Park, Tower ‘A’,",
    '8th Floor,',
    'Senapati Bapat Marg,',
    'Lower Parel,',
    'Mumbai – 400 013',
    'email: investors@jlmorison.com',
    'Phone no: 022 61410300',
  ].join('\n'),
  iepfSharesHeading: 'Shares transferred to IEPF Authority',
  iepfSharesColumns: [
    ['2017-18', 'Details of shares transferred to IEPF in FY 2025-26'],
    ['2016-17', 'Details of shares transferred to IEPF in FY 2024-25'],
    ['2015-16', 'Details of shares transferred to IEPF in FY 2023-24'],
    ['2014-15', 'Details of shares transferred to IEPF in FY 2022-23'],
    ['2013-14', 'Details of shares transferred to IEPF in FY 2021-22'],
    ['2012-13', 'Details of shares transferred to IEPF in FY 2020-21'],
    ['2011-12', 'Details of shares transferred to IEPF in FY 2019-20'],
  ].map(([heading, detail]) => ({
    heading,
    links: [doc('Notice in Newspaper for transfer of Shares to IEPF'), doc(detail)],
  })) as IRColumn[],
  iepfDividendHeading:
    'Details of unclaimed/unpaid Dividend to be transferred to IEPF Authority',
  iepfDividendColumns: [
    { heading: '31st March, 2024', years: ['2021-22', '2020-21', '2019-20', '2018-19', '2017-18', '2016-17', '2015-16'] },
    { heading: '31st March, 2023', years: ['2021-22', '2020-21', '2019-20', '2018-19', '2017-18', '2016-17', '2015-16'] },
    { heading: '31st March, 2022', years: ['2020-21', '2019-20', '2018-19', '2017-18', '2016-17', '2015-16', '2014-15'] },
    { heading: '31st March, 2021', years: ['2019-20', '2018-19', '2017-18', '2016-17', '2015-16', '2014-15', '2013-14'] },
    { heading: '31st March, 2020', years: ['2018-19', '2017-18', '2016-17', '2015-16', '2014-15', '2013-14', '2012-13'] },
    { heading: '31st March, 2019', years: ['2017-18', '2016-17', '2015-16', '2014-15', '2013-14', '2012-13', '2011-12'] },
    { heading: '3rd August, 2018', years: ['2016-17', '2015-16', '2014-15', '2013-14', '2012-13', '2011-12', '2010-11'] },
  ].map((c) => ({ heading: c.heading, links: c.years.map(doc) })) as IRColumn[],
  iepfProcedureHeading: 'Procedure for claiming the refund of shares and dividend from IEPF',
  iepfProcedureItems: [
    {
      text: 'Any person whose shares, unclaimed dividend, etc., has been transferred to the Fund, may claim their refunds to the IEPF Authority by submitting an online application in Form IEPF-5 available on the website of Investor Education and Protection Fund at',
      url: 'http://www.iepf.gov.in/IEPF/refund.html',
    },
    {
      text: 'Search for Investor wise unclaimed and unpaid details on following link and click on SEARCH UNCLAIMED /UNPAID AMOUNT',
      url: 'http://www.iepf.gov.in/IEPFWebProject/SearchInvestorAction.do?method=gotoSearchInvestor',
    },
    {
      text: 'List of unpaid/unclaimed dividend pursuant to Section 124(2) of the Companies Act, 2013',
      url: 'https://jlmorison.com/wp-content/uploads/2022/02/List-of-Unpaid-and-Unclaimed-Dividend-Sec-124-2.pdf',
    },
  ] as IRProcedureItem[],
}

type SectionKey = 'terms' | 'csr' | 'policies' | 'notice' | 'investors' | 'iepf'

const NAV: { key: SectionKey; label: string; short: string }[] = [
  { key: 'terms', label: 'TERMS OF APPOINTMENT OF INDEPENDENT DIRECTORS', short: 'Independent Directors' },
  { key: 'csr', label: 'CORPORATE SOCIAL RESPONSIBILITY COMMITTEE', short: 'CSR Committee' },
  { key: 'policies', label: 'POLICIES', short: 'Policies' },
  { key: 'notice', label: 'NOTICE OF GENERAL MEETINGS/POSTAL BALLOT', short: 'Notices / Postal Ballot' },
  { key: 'investors', label: 'INVESTORS INFORMATION', short: 'Investor Info' },
  { key: 'iepf', label: 'IEPF', short: 'IEPF' },
]

/* Prefer a non-empty CMS value, else fall back to the baked default. */
function useMerged(cms: InvestorRelations) {
  const pickArr = <T,>(a: T[] | undefined, b: T[]): T[] => (a && a.length ? a : b)
  const pick = <T,>(a: T | undefined, b: T): T =>
    a === undefined || a === null || a === '' ? b : a
  return {
    termsHeading: pick(cms.termsHeading, D.termsHeading),
    termsDocs: pickArr(cms.termsDocs, D.termsDocs),
    csrHeading: pick(cms.csrHeading, D.csrHeading),
    csrMembers: pickArr(cms.csrMembers, D.csrMembers),
    policiesHeading: pick(cms.policiesHeading, D.policiesHeading),
    policiesDocs: pickArr(cms.policiesDocs, D.policiesDocs),
    noticeHeading: pick(cms.noticeHeading, D.noticeHeading),
    noticeHeadings: pickArr(cms.noticeHeadings, D.noticeHeadings),
    noticeRows: pickArr(cms.noticeRows, D.noticeRows),
    investorsHeading: pick(cms.investorsHeading, D.investorsHeading),
    investorsIntro: pick(cms.investorsIntro, D.investorsIntro),
    investorsContacts: pickArr(cms.investorsContacts, D.investorsContacts),
    investorsDocs: pickArr(cms.investorsDocs, D.investorsDocs),
    campaignHeading: pick(cms.campaignHeading, D.campaignHeading),
    campaignDocs: pickArr(cms.campaignDocs, D.campaignDocs),
    multipleMailingHeading: pick(cms.multipleMailingHeading, D.multipleMailingHeading),
    multipleMailingBody: pick(cms.multipleMailingBody, D.multipleMailingBody),
    iepfHeading: pick(cms.iepfHeading, D.iepfHeading),
    iepfContactHeading: pick(cms.iepfContactHeading, D.iepfContactHeading),
    iepfContact: pick(cms.iepfContact, D.iepfContact),
    iepfSharesHeading: pick(cms.iepfSharesHeading, D.iepfSharesHeading),
    iepfSharesColumns: pickArr(cms.iepfSharesColumns, D.iepfSharesColumns),
    iepfDividendHeading: pick(cms.iepfDividendHeading, D.iepfDividendHeading),
    iepfDividendColumns: pickArr(cms.iepfDividendColumns, D.iepfDividendColumns),
    iepfProcedureHeading: pick(cms.iepfProcedureHeading, D.iepfProcedureHeading),
    iepfProcedureItems: pickArr(cms.iepfProcedureItems, D.iepfProcedureItems),
  }
}

/* ───────────────────────── Shared UI pieces ───────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className={cormorant.className}
      style={{
        margin: 0,
        fontSize: 'clamp(30px, 4.4vw, 52px)',
        lineHeight: 1.05,
        fontWeight: 400,
        letterSpacing: '0.01em',
        color: INK,
      }}
    >
      {children}
    </h2>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className={`${dmSans.className} uppercase`}
      style={{
        margin: 0,
        fontSize: 'clamp(15px, 1.4vw, 18px)',
        fontWeight: 700,
        letterSpacing: '0.04em',
        color: INK,
      }}
    >
      {children}
    </h3>
  )
}

/* Document list — ESG-governance-style rows: label left, "Click to view" right. */
function DocTable({ docs }: { docs: IRDoc[] }) {
  const rows = docs.filter((d) => d.label)
  if (!rows.length) return null
  return (
    <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${BEIGE}` }}>
      {rows.map((d, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 md:px-7 md:py-5"
          style={{
            backgroundColor: i % 2 ? FAINT : '#FFFFFF',
            borderTop: i ? `1px solid ${BEIGE}` : 'none',
          }}
        >
          <span className={dmSans.className} style={{ fontWeight: 600, fontSize: 'clamp(14px,1.3vw,16px)', color: INK }}>
            {d.label}
          </span>
          {d.href ? (
            <a
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${dmSans.className} whitespace-nowrap underline-offset-4 hover:underline`}
              style={{ fontWeight: 500, fontSize: 'clamp(13px,1.1vw,15px)', color: LINK }}
            >
              Click to view
            </a>
          ) : (
            <span
              className={dmSans.className}
              title="PDF not linked yet — add it in Sanity"
              style={{ whiteSpace: 'nowrap', fontWeight: 500, fontSize: 'clamp(13px,1.1vw,15px)', color: SUB, opacity: 0.5 }}
            >
              Click to view
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

/* A vertical link, muted when no PDF is attached yet. */
function ColLink({ d }: { d: IRDoc }) {
  if (!d.label) return null
  return d.href ? (
    <a
      href={d.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${dmSans.className} block underline-offset-4 hover:underline`}
      style={{ fontSize: 'clamp(12.5px, 1vw, 15px)', lineHeight: 1.5, color: LINK }}
    >
      {d.label}
    </a>
  ) : (
    <span
      className={`${dmSans.className} block`}
      title="PDF not linked yet — add it in Sanity"
      style={{ fontSize: 'clamp(12.5px, 1vw, 15px)', lineHeight: 1.5, color: SUB, opacity: 0.55 }}
    >
      {d.label}
    </span>
  )
}

/* Column matrix — used by the Notice table and both IEPF tables.
   `fit` lays the columns out as an equal-width grid that fills the container
   (used for the IEPF tables); otherwise columns keep a fixed width and the
   strip scrolls horizontally (used for the wide, text-heavy Notice table).
   Either way it scrolls on very narrow screens rather than squashing. */
function ColumnMatrix({ columns, fit = false }: { columns: IRColumn[]; fit?: boolean }) {
  const cols = columns.filter((c) => c.heading || c.links?.length)
  if (!cols.length) return null
  return (
    <div
      className={`overflow-x-auto rounded-2xl ${fit ? '[--ir-col-min:10rem] lg:[--ir-col-min:0px]' : ''}`}
      style={{ border: `1px solid ${BEIGE}` }}
    >
      <div
        className={fit ? 'grid' : 'flex min-w-max'}
        style={
          fit
            ? { gridTemplateColumns: `repeat(${cols.length}, minmax(var(--ir-col-min), 1fr))` }
            : undefined
        }
      >
        {cols.map((c, i) => (
          <div
            key={i}
            className={`flex flex-col gap-3 p-3 md:p-4 ${fit ? '' : 'w-[220px] flex-none'}`}
            style={{ borderLeft: i ? `1px solid ${BEIGE}` : 'none' }}
          >
            <div
              className={dmSans.className}
              style={{ fontWeight: 700, fontSize: 'clamp(13px, 1.05vw, 16px)', color: INK, paddingBottom: 8, borderBottom: `1px solid ${BEIGE}` }}
            >
              {c.heading}
            </div>
            <div className="flex flex-col gap-2.5">
              {(c.links || []).map((d, j) => (
                <ColLink key={j} d={d} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Notice of General Meetings — a true aligned grid. Every row lines its cells up
   across the year columns (blank cells stay blank), matching the source table.
   Scrolls horizontally on narrow screens; columns share the width when it fits. */
function NoticeGrid({ headings, rows }: { headings: string[]; rows: { cells: IRDoc[] }[] }) {
  const n = headings.length
  if (!n) return null
  const cell = (
    k: string,
    content: React.ReactNode,
    i: number,
    opts: { head?: boolean; last?: boolean },
  ) => (
    <div
      key={k}
      className={dmSans.className}
      style={{
        padding: opts.head ? '12px 12px' : '11px 12px',
        borderLeft: i % n ? `1px solid ${BEIGE}` : 'none',
        borderBottom: opts.last ? 'none' : `1px solid ${BEIGE}`,
        backgroundColor: opts.head ? FAINT : 'transparent',
        fontWeight: opts.head ? 700 : 400,
        fontSize: opts.head ? 'clamp(13px, 1.05vw, 16px)' : undefined,
        color: INK,
      }}
    >
      {content}
    </div>
  )
  return (
    // Mobile: columns keep a readable min width and the table scrolls sideways
    // (--ir-col-min = 9.5rem). Desktop (lg+): min drops to 0 so the columns share
    // the width and fit without scrolling.
    <div
      className="overflow-x-auto rounded-2xl [--ir-col-min:9.5rem] lg:[--ir-col-min:0px]"
      style={{ border: `1px solid ${BEIGE}` }}
    >
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(var(--ir-col-min), 1fr))` }}
      >
        {headings.map((h, i) => cell(`h${i}`, h, i, { head: true }))}
        {rows.map((r, ri) =>
          Array.from({ length: n }).map((_, ci) =>
            cell(
              `${ri}-${ci}`,
              r.cells[ci]?.label ? <ColLink d={r.cells[ci]} /> : null,
              ci,
              { last: ri === rows.length - 1 },
            ),
          ),
        )}
      </div>
    </div>
  )
}

/* Address / contact block — preserves line breaks, links emails and phones. */
function ContactBlock({ c }: { c: IRContact }) {
  const lines = (c.body ?? '').split('\n')
  return (
    <div>
      {c.heading && (
        <p className={dmSans.className} style={{ margin: '0 0 6px', fontWeight: 700, color: INK, fontSize: 15 }}>
          {c.heading}
        </p>
      )}
      <address className={dmSans.className} style={{ fontStyle: 'normal', color: SUB, fontSize: 15, lineHeight: 1.85 }}>
        {lines.map((line, i) => {
          const email = line.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)
          if (email) {
            const before = line.slice(0, email.index)
            return (
              <div key={i}>
                {before}
                <a href={`mailto:${email[0]}`} style={{ color: LINK }} className="underline-offset-2 hover:underline">
                  {email[0]}
                </a>
              </div>
            )
          }
          return <div key={i}>{line}</div>
        })}
      </address>
    </div>
  )
}

/* ───────────────────────── Section bodies ───────────────────────── */

function SectionBody({ k, m }: { k: SectionKey; m: ReturnType<typeof useMerged> }) {
  if (k === 'terms')
    return (
      <div className="flex flex-col gap-8">
        <SectionTitle>{m.termsHeading}</SectionTitle>
        <DocTable docs={m.termsDocs} />
      </div>
    )

  if (k === 'csr')
    return (
      <div className="flex flex-col gap-8">
        <SectionTitle>{m.csrHeading}</SectionTitle>
        <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${BEIGE}` }}>
          <div
            className="grid grid-cols-2"
            style={{ backgroundColor: INK }}
          >
            {['Name of the Member', 'Designation'].map((h) => (
              <div key={h} className={dmSans.className} style={{ color: '#fff', fontWeight: 700, fontSize: 14, padding: '14px 20px' }}>
                {h}
              </div>
            ))}
          </div>
          {m.csrMembers.map((mem, i) => (
            <div
              key={i}
              className="grid grid-cols-2"
              style={{ backgroundColor: i % 2 ? FAINT : '#fff', borderTop: `1px solid ${BEIGE}` }}
            >
              <div className={dmSans.className} style={{ color: INK, fontSize: 15, padding: '14px 20px' }}>{mem.name}</div>
              <div className={dmSans.className} style={{ color: SUB, fontSize: 15, padding: '14px 20px' }}>{mem.designation}</div>
            </div>
          ))}
        </div>
      </div>
    )

  if (k === 'policies')
    return (
      <div className="flex flex-col gap-8">
        <SectionTitle>{m.policiesHeading}</SectionTitle>
        <DocTable docs={m.policiesDocs} />
      </div>
    )

  if (k === 'notice')
    return (
      <div className="flex flex-col gap-8">
        <SectionTitle>{m.noticeHeading}</SectionTitle>
        <NoticeGrid headings={m.noticeHeadings} rows={m.noticeRows} />
      </div>
    )

  if (k === 'investors')
    return (
      <div className="flex flex-col gap-10">
        <SectionTitle>{m.investorsHeading}</SectionTitle>
        <p className={dmSans.className} style={{ margin: 0, maxWidth: '70ch', color: SUB, fontSize: 16, lineHeight: 1.75 }}>
          {m.investorsIntro}
        </p>
        <div className="flex flex-col gap-8">
          {m.investorsContacts.map((c, i) => (
            <div key={i} className="flex flex-col gap-8">
              {i === 1 && (
                <span className={dmSans.className} style={{ fontWeight: 700, color: INK, fontSize: 15 }}>OR</span>
              )}
              <ContactBlock c={c} />
            </div>
          ))}
        </div>
        <DocTable docs={m.investorsDocs} />
        <div className="flex flex-col gap-6">
          <SubHeading>{m.campaignHeading}</SubHeading>
          <DocTable docs={m.campaignDocs} />
        </div>
        <div className="flex flex-col gap-3">
          <SubHeading>{m.multipleMailingHeading}</SubHeading>
          <p className={dmSans.className} style={{ margin: 0, maxWidth: '72ch', color: SUB, fontSize: 16, lineHeight: 1.75 }}>
            {m.multipleMailingBody}
          </p>
        </div>
      </div>
    )

  // iepf
  return (
    <div className="flex flex-col gap-10">
      <SectionTitle>{m.iepfHeading}</SectionTitle>
      <div className="flex flex-col gap-4">
        <SubHeading>{m.iepfContactHeading}</SubHeading>
        <ContactBlock c={{ body: m.iepfContact }} />
      </div>
      <div className="flex flex-col gap-5">
        <SubHeading>{m.iepfSharesHeading}</SubHeading>
        <ColumnMatrix columns={m.iepfSharesColumns} fit />
      </div>
      <div className="flex flex-col gap-5">
        <SubHeading>{m.iepfDividendHeading}</SubHeading>
        <ColumnMatrix columns={m.iepfDividendColumns} fit />
      </div>
      <div className="flex flex-col gap-4">
        <SubHeading>{m.iepfProcedureHeading}</SubHeading>
        <div className="flex flex-col gap-4">
          {m.iepfProcedureItems.map((it, i) => (
            <p key={i} className={dmSans.className} style={{ margin: 0, maxWidth: '80ch', color: SUB, fontSize: 15, lineHeight: 1.7 }}>
              {it.text}
              {it.url && (
                <>
                  {' '}
                  <a href={it.url} target="_blank" rel="noopener noreferrer" className="break-all underline-offset-2 hover:underline" style={{ color: LINK }}>
                    {it.url}
                  </a>
                </>
              )}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Page ───────────────────────── */

export default function InvestorRelationsClient({ cms }: { cms: InvestorRelations }) {
  const m = useMerged(cms)
  const [active, setActive] = useState<SectionKey>('terms')

  return (
    <div className={`${cormorant.variable} ${dmSans.variable}`} style={{ backgroundColor: '#FFFFFF' }}>
      {/* Page header */}
      <header className="px-[7vw] pt-[7vh] pb-8 md:pb-12">
        <p className={`${dmSans.className} uppercase`} style={{ fontSize: 11, letterSpacing: '0.22em', color: SUB, fontWeight: 500 }}>
          Investor Relations
        </p>
        <h1 className={`${cormorant.className} mt-4`} style={{ fontSize: 'clamp(38px,6vw,76px)', lineHeight: 1.03, fontWeight: 300, color: INK }}>
          Shareholder information
        </h1>
      </header>

      {/* Mobile section switcher */}
      <div className="px-[7vw] lg:hidden">
        <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto pb-1">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setActive(n.key)}
              className={`${dmSans.className} flex min-h-[40px] items-center whitespace-nowrap rounded-full px-4 py-2.5 text-left transition-colors`}
              style={{
                flexShrink: 0,
                fontSize: 12.5,
                fontWeight: 600,
                backgroundColor: active === n.key ? INK : FAINT,
                color: active === n.key ? '#fff' : INK,
              }}
            >
              {n.short}
            </button>
          ))}
        </div>
      </div>

      {/* Body: sticky sidebar + content */}
      <div className="grid grid-cols-1 gap-10 px-[7vw] pb-24 pt-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14 lg:pt-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">
          <nav className="sticky flex flex-col gap-2.5" style={{ top: 'calc(var(--nav-h) + 24px)' }}>
            {NAV.map((n) => {
              const on = active === n.key
              return (
                <button
                  key={n.key}
                  onClick={() => setActive(n.key)}
                  className={`${dmSans.className} rounded-xl px-5 py-4 text-left transition-colors duration-200`}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    backgroundColor: on ? INK : FAINT,
                    color: on ? '#FFFFFF' : INK,
                    border: `1px solid ${on ? INK : BEIGE}`,
                  }}
                >
                  {n.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <SectionBody k={active} m={m} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  )
}
