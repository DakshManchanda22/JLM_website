/**
 * Investor Relations → "Notice of General Meetings / Postal Ballot" table.
 * The first row ("Notice for Annual General Meeting …") is missing the leading
 * empty cell that every other row has, so its entries sit one column to the
 * LEFT of the correct financial-year headers. This inserts an empty cell at the
 * start of that row, shifting each entry (and its attached PDF) one column right
 * so the years line up. Existing cells are untouched, so their PDF files move
 * with them.
 *
 * Run:  node --env-file=.env.local scripts/shift-ir-agm-notices.mjs
 */
import { createClient } from '@sanity/client'
import { randomBytes } from 'node:crypto'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const key = () => randomBytes(6).toString('hex')

const ids = await client.fetch('*[_type == "investorRelations"]._id')

for (const id of ids) {
  const doc = await client.getDocument(id)
  const rows = doc?.noticeRows ?? []
  const row0 = rows[0]
  if (!row0) {
    console.log(`[${id}] no noticeRows — skipped`)
    continue
  }

  const firstLabel = row0.cells?.[0]?.label ?? ''
  if (!/Annual General Meeting/i.test(firstLabel)) {
    console.log(
      `[${id}] row 0 is not the AGM row ("${firstLabel}") — skipped to avoid a wrong shift`,
    )
    continue
  }
  if (!firstLabel.trim()) {
    console.log(`[${id}] row 0 already starts with an empty cell — already shifted, skipped`)
    continue
  }

  const emptyCell = { _type: 'cell', _key: key() }
  const res = await client
    .patch(id)
    .insert('before', `noticeRows[_key=="${row0._key}"].cells[0]`, [emptyCell])
    .commit()
  console.log(`[${res._id}] inserted leading empty cell in AGM row — entries shifted one column right`)
}
