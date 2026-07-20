/**
 * Publishes the full Investor Relations content into Sanity so marketing can
 * see and edit every section from the Studio (until now this copy lived only as
 * code defaults in InvestorRelationsClient.tsx). PDFs are NOT linked here — each
 * document row is seeded with just its label; marketing attaches the actual PDF
 * (upload or URL) per row in Sanity.
 *
 * Idempotent: createIfNotExists + setIfMissing, so any edits marketing has
 * already made in the Studio are preserved and never clobbered.
 *
 * Run with:  node --env-file=.env.local scripts/seed-investor-relations.mjs
 */
import { randomUUID } from 'node:crypto'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Missing env. Run with: node --env-file=.env.local scripts/seed-investor-relations.mjs')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false })

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

/* A single PDF link (label only — marketing attaches the file/URL in Sanity). */
const doc = (label) => ({ _type: 'docLink', _key: key(), label })
/* A cell inside the Notice matrix (same shape, different member name). */
const cell = (label) => ({ _type: 'cell', _key: key(), label })
/* A column of links for the IEPF tables. */
const col = (heading, links) => ({ _type: 'linkColumn', _key: key(), heading, links })

/* ─────────── Notice of General Meetings — the row×column matrix ─────────── */

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
const NOTICE_MATRIX = [
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

/* ─────────── IEPF tables ─────────── */

const IEPF_SHARES = [
  ['2017-18', 'Details of shares transferred to IEPF in FY 2025-26'],
  ['2016-17', 'Details of shares transferred to IEPF in FY 2024-25'],
  ['2015-16', 'Details of shares transferred to IEPF in FY 2023-24'],
  ['2014-15', 'Details of shares transferred to IEPF in FY 2022-23'],
  ['2013-14', 'Details of shares transferred to IEPF in FY 2021-22'],
  ['2012-13', 'Details of shares transferred to IEPF in FY 2020-21'],
  ['2011-12', 'Details of shares transferred to IEPF in FY 2019-20'],
].map(([heading, detail]) =>
  col(heading, [doc('Notice in Newspaper for transfer of Shares to IEPF'), doc(detail)]),
)

const IEPF_DIVIDEND = [
  { heading: '31st March, 2024', years: ['2021-22', '2020-21', '2019-20', '2018-19', '2017-18', '2016-17', '2015-16'] },
  { heading: '31st March, 2023', years: ['2021-22', '2020-21', '2019-20', '2018-19', '2017-18', '2016-17', '2015-16'] },
  { heading: '31st March, 2022', years: ['2020-21', '2019-20', '2018-19', '2017-18', '2016-17', '2015-16', '2014-15'] },
  { heading: '31st March, 2021', years: ['2019-20', '2018-19', '2017-18', '2016-17', '2015-16', '2014-15', '2013-14'] },
  { heading: '31st March, 2020', years: ['2018-19', '2017-18', '2016-17', '2015-16', '2014-15', '2013-14', '2012-13'] },
  { heading: '31st March, 2019', years: ['2017-18', '2016-17', '2015-16', '2014-15', '2013-14', '2012-13', '2011-12'] },
  { heading: '3rd August, 2018', years: ['2016-17', '2015-16', '2014-15', '2013-14', '2012-13', '2011-12', '2010-11'] },
].map((c) => col(c.heading, c.years.map(doc)))

/* ─────────── The full document ─────────── */

const IR = {
  termsHeading: 'TERMS OF APPOINTMENT OF INDEPENDENT DIRECTORS',
  termsDocs: [doc('Terms of Appointment of Independent Directors')],

  csrHeading: 'CORPORATE SOCIAL RESPONSIBILITY COMMITTEE',
  csrMembers: [
    { _type: 'member', _key: key(), name: 'Mr. Sohan Sarda', designation: 'Chairman' },
    { _type: 'member', _key: key(), name: 'Mrs. Annapurna Dubey', designation: 'Member' },
    { _type: 'member', _key: key(), name: 'Mr. Chandra Kumar Murarka', designation: 'Member' },
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
  noticeRows: NOTICE_MATRIX.map((cells) => ({
    _type: 'noticeRow',
    _key: key(),
    cells: cells.map(cell),
  })),

  investorsHeading: 'INVESTORS INFORMATION',
  investorsIntro:
    'For any assistance regarding dematerialization of shares, share transfers, transmissions, change of address, non – receipt of dividend or any other grievances, please write to:',
  investorsContacts: [
    {
      _type: 'contactBlock',
      _key: key(),
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
      _type: 'contactBlock',
      _key: key(),
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
      _type: 'contactBlock',
      _key: key(),
      heading: 'REGISTERED OFFICE :',
      body: [
        'Adventz Infinity @ 5, Plot No. 5,',
        'Block – BN, North Wing, No. 1106,',
        '11th Floor, Sector – V, Salt Lake',
        'Kolkata – 700 091.',
        'Phone No : 033 22480114.',
      ].join('\n'),
    },
  ],
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
  iepfSharesColumns: IEPF_SHARES,
  iepfDividendHeading:
    'Details of unclaimed/unpaid Dividend to be transferred to IEPF Authority',
  iepfDividendColumns: IEPF_DIVIDEND,
  iepfProcedureHeading: 'Procedure for claiming the refund of shares and dividend from IEPF',
  iepfProcedureItems: [
    {
      _type: 'procedureItem',
      _key: key(),
      text: 'Any person whose shares, unclaimed dividend, etc., has been transferred to the Fund, may claim their refunds to the IEPF Authority by submitting an online application in Form IEPF-5 available on the website of Investor Education and Protection Fund at',
      url: 'http://www.iepf.gov.in/IEPF/refund.html',
    },
    {
      _type: 'procedureItem',
      _key: key(),
      text: 'Search for Investor wise unclaimed and unpaid details on following link and click on SEARCH UNCLAIMED /UNPAID AMOUNT',
      url: 'http://www.iepf.gov.in/IEPFWebProject/SearchInvestorAction.do?method=gotoSearchInvestor',
    },
    {
      _type: 'procedureItem',
      _key: key(),
      text: 'List of unpaid/unclaimed dividend pursuant to Section 124(2) of the Companies Act, 2013',
      url: 'https://jlmorison.com/wp-content/uploads/2022/02/List-of-Unpaid-and-Unclaimed-Dividend-Sec-124-2.pdf',
    },
  ],
}

/* ─────────────────────────── run ─────────────────────────── */

async function run() {
  console.log('• Investor Relations')
  await client.createIfNotExists({ _id: 'investorRelations', _type: 'investorRelations' })
  await client.patch('investorRelations').setIfMissing(IR).commit()
  console.log(`  published ${Object.keys(IR).length} fields.`)
  console.log('\nDone. PDFs still need to be attached per row in the Studio.')
}

await run()
