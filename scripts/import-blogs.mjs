/**
 * Bulk blog importer for the JLM site.
 *
 * Reads public/Green_Highlighted_Blogs.xlsx (title, url, category), scrapes each
 * old smartmums.in post for its TEXT and the POSITIONS of its inline images,
 * then builds a Sanity `post` document:
 *   - title / slug / publish date / excerpt / SEO
 *   - author  -> "SmartMums Blog"
 *   - tags    -> normalised category (combined categories split into several)
 *   - body    -> Portable Text, with the same number of inline images in the
 *                same spots as the original
 *   - images  -> fresh, topic-relevant photos from Pexels (NOT scraped from the
 *                old, throttled site). Cover + each inline slot get different
 *                photos, varied per-post by a hash of the slug.
 *
 * Usage:
 *   node --env-file=.env.local scripts/import-blogs.mjs              # all rows
 *   node --env-file=.env.local scripts/import-blogs.mjs --limit 3    # first 3
 *   node --env-file=.env.local scripts/import-blogs.mjs --offset 50 --limit 50
 *   node --env-file=.env.local scripts/import-blogs.mjs --dry        # no writes
 *
 * Safe to re-run: doc id is derived from the slug, so re-runs update in place.
 */
import { createClient } from '@sanity/client'
import { JSDOM } from 'jsdom'
import { htmlToBlocks } from '@sanity/block-tools'
import { Schema } from '@sanity/schema'
import crypto from 'node:crypto'
import XLSX from 'xlsx'

const SHEET = 'public/Green_Highlighted_Blogs.xlsx'
const AUTHOR_NAME = 'SmartMums Blog'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'

// ---- args -----------------------------------------------------------------
const args = process.argv.slice(2)
const DRY = args.includes('--dry')
const numArg = (flag, def) => {
  const i = args.indexOf(flag)
  return i >= 0 && args[i + 1] ? parseInt(args[i + 1], 10) : def
}
const LIMIT = numArg('--limit', Infinity)
const OFFSET = numArg('--offset', 0)

// ---- env ------------------------------------------------------------------
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
const PEXELS_KEY = process.env.PEXELS_API_KEY
if (!projectId || (!token && !DRY)) {
  console.error('Missing Sanity env (NEXT_PUBLIC_SANITY_PROJECT_ID + SANITY_API_TOKEN).')
  process.exit(1)
}
if (!PEXELS_KEY) {
  console.error('Missing PEXELS_API_KEY in .env.local')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false })

// ---- block-tools schema ---------------------------------------------------
const blockContentType = Schema.compile({
  name: 'x',
  types: [
    {
      name: 'blockContent',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [{ name: 'link', type: 'object', fields: [{ name: 'href', type: 'url' }] }],
          },
        },
        { type: 'image', name: 'inlineImage' },
      ],
    },
  ],
}).get('blockContent')

// ---- helpers --------------------------------------------------------------
const key = () => crypto.randomUUID().slice(0, 8)
const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '')
const slugFromUrl = (url) => new URL(url).pathname.replace(/\/+$/, '').split('/').pop().toLowerCase().replace(/[^a-z0-9-]/g, '')
// IDs must be dot-free: Sanity's public read grant is `_id in path("*")`, which
// only covers top-level (non-namespaced) ids. A dot creates a private namespace.
const docId = (slug) => 'post-' + slug
const hashInt = (s) => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}
const metaContent = (doc, sel) => {
  const el = doc.querySelector(sel)
  return el ? el.getAttribute('content') : null
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
// the old server resets connections at random — retry a few times before giving up
async function fetchRetry(url, opts = {}, tries = 4) {
  let last
  for (let t = 0; t < tries; t++) {
    try {
      const res = await fetch(url, opts)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return res
    } catch (e) {
      last = e
      await sleep(1500 * (t + 1))
    }
  }
  throw last
}

// category -> clean canonical tag name(s)
const CANON = {
  'breastfeeding': 'Breastfeeding',
  'food & nutrition': 'Food & Nutrition',
  'infant care': 'Infant Care',
  'pregnancy': 'Pregnancy',
  'family dynamics': 'Family Dynamics',
  'baby health': 'Baby Health',
  'covid-19': 'Covid-19',
  'others': 'Others',
}
function normalizeCategories(raw) {
  if (!raw) return ['Others']
  // "Food & Nutrition" is a single category, but "&"/"+" also combine categories
  // ("Infant Care & Breastfeeding"). Protect the atomic one before splitting.
  const protectedRaw = raw.trim().toLowerCase().replace(/food\s*&\s*nutrition/g, 'food_nutrition')
  return [...new Set(
    protectedRaw
      .split(/\s*[&+]\s*/)
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => (c === 'food_nutrition' ? 'Food & Nutrition' : CANON[c] || c.replace(/\b\w/g, (m) => m.toUpperCase())))
  )]
}

// search-term selection: prefer a specific hint from the title, else category
const CAT_TERM = {
  'Breastfeeding': 'breastfeeding mother baby',
  'Food & Nutrition': 'healthy food nutrition',
  'Infant Care': 'mother and baby care',
  'Pregnancy': 'pregnant woman',
  'Family Dynamics': 'happy family with baby',
  'Baby Health': 'baby health checkup',
  'Covid-19': 'family at home safety',
  'Others': 'mother and baby',
}
const TITLE_HINTS = [
  [/\bsleep|nap\b/i, 'sleeping baby'],
  [/\bteeth|tooth|dental|teeth?ing\b/i, 'baby teeth dental'],
  [/\bmonsoon|rain\b/i, 'monsoon rain'],
  [/\bweight|postpartum|fitness|exercise|yoga\b/i, 'postpartum fitness mother'],
  [/\bvaccin|immuni\b/i, 'baby vaccination'],
  [/\bfever|sick|cold|cough|flu|infection\b/i, 'sick baby care'],
  [/\bmassage\b/i, 'baby massage'],
  [/\brecipe|food|nutrition|eat|diet|meal|snack\b/i, 'healthy food nutrition'],
  [/\btravel|trip|journey|flight\b/i, 'family travel with baby'],
  [/\bbath|bathing\b/i, 'baby bath'],
  [/\bskin|rash|eczema\b/i, 'baby skin care'],
  [/\bbottle|formula\b/i, 'baby bottle feeding'],
  [/\bmilk\b/i, 'mother breastfeeding'],
  [/\bpregnan|prenatal|trimester|labour|labor|delivery\b/i, 'pregnant woman'],
  [/\bdiaper|nappy\b/i, 'baby diaper change'],
  [/\bcry|colic\b/i, 'crying baby'],
  [/\bplay|toy|game\b/i, 'baby playing with toys'],
  [/\bschool|learn|education|read|book\b/i, 'child learning'],
]
function searchTerm(title, categories) {
  for (const [re, term] of TITLE_HINTS) if (re.test(title)) return term
  return CAT_TERM[categories[0]] || 'mother and baby'
}

// ---- Pexels ---------------------------------------------------------------
const pexelsCache = new Map() // query -> photos[]
async function pexelsSearch(query) {
  if (pexelsCache.has(query)) return pexelsCache.get(query)
  let photos = []
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=50&orientation=landscape`,
      { headers: { Authorization: PEXELS_KEY }, signal: AbortSignal.timeout(30000) }
    )
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const j = await res.json()
    photos = j.photos || []
  } catch (e) {
    console.warn(`    ! pexels search failed for "${query}": ${e.message}`)
  }
  pexelsCache.set(query, photos)
  return photos
}
// variant 0 = cover (bigger), 1+ = inline. Picks a different photo per variant.
async function pexelsPick(query, slug, variant) {
  const photos = await pexelsSearch(query)
  if (!photos.length) return null
  const idx = (hashInt(slug) + variant * 13) % photos.length
  const p = photos[idx]
  const url = variant === 0 ? p.src.large2x || p.src.large : p.src.large || p.src.medium
  return { url, alt: (p.alt || query).slice(0, 200), credit: p.photographer }
}

const assetCache = new Map() // pexels url -> asset
async function downloadAndUpload(url, filename) {
  if (assetCache.has(url)) return assetCache.get(url)
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(60000), headers: { 'User-Agent': UA } })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 1024) throw new Error('too small')
    if (DRY) {
      const fake = { _id: 'image-DRY' }
      assetCache.set(url, fake)
      return fake
    }
    const asset = await client.assets.upload('image', buf, { filename })
    assetCache.set(url, asset)
    return asset
  } catch (e) {
    console.warn(`    ! image dl/upload failed (${e.message}): ${url}`)
    assetCache.set(url, null)
    return null
  }
}

// ---- doc helpers ----------------------------------------------------------
const ensured = new Set()
async function ensureDoc(id, body) {
  if (DRY || ensured.has(id)) return
  const existing = await client.getDocument(id).catch(() => null)
  if (!existing) await client.createOrReplace(body)
  ensured.add(id)
}
async function authorRef() {
  const id = 'author-smartmums-blog'
  await ensureDoc(id, { _id: id, _type: 'author', name: AUTHOR_NAME, slug: { _type: 'slug', current: 'smartmums-blog' } })
  return { _type: 'reference', _ref: id }
}
async function tagRefs(categories) {
  const refs = []
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const id = 'tag-' + slug
    await ensureDoc(id, { _id: id, _type: 'tag', title: name, slug: { _type: 'slug', current: slug } })
    refs.push({ _type: 'reference', _ref: id, _key: key() })
  }
  return refs
}

// ---- import one -----------------------------------------------------------
async function importOne(row, i) {
  const url = String(row.url).trim()
  const slug = slugFromUrl(url)
  console.log(`\n[${i}] ${url}`)

  const res = await fetchRetry(url, { signal: AbortSignal.timeout(60000), headers: { 'User-Agent': UA } })
  const dom = new JSDOM(await res.text())
  const doc = dom.window.document

  const title = text(doc.querySelector('h1.entry-title')) || text(doc.querySelector('h1')) || String(row.title).trim()
  const categories = normalizeCategories(String(row.category || ''))
  const term = searchTerm(title, categories)

  // date
  const dateStr = text(doc.querySelector('.td-post-date time, .td-post-date, time.entry-date'))
  let publishedAt = new Date().toISOString()
  const parsed = dateStr ? new Date(dateStr + ' 12:00:00 UTC') : null
  if (parsed && !isNaN(parsed)) publishedAt = parsed.toISOString()

  const metaDesc = metaContent(doc, 'meta[name="description"]') || metaContent(doc, 'meta[property="og:description"]')
  const ogImage = metaContent(doc, 'meta[property="og:image"]')

  // body
  const bodyEl = doc.querySelector('.td-post-content')
  if (!bodyEl) throw new Error('no .td-post-content')
  bodyEl
    .querySelectorAll('script, style, .td-post-sharing, .code-block, ins, .td_block_related_posts, noscript, iframe')
    .forEach((n) => n.remove())

  // mark inline image positions (skip the one that duplicates the featured/cover)
  let inlineCount = 0
  for (const img of [...bodyEl.querySelectorAll('img')]) {
    const src = img.getAttribute('data-src') || img.getAttribute('src') || ''
    const sameAsCover = ogImage && src.split('/').pop() === ogImage.split('/').pop()
    if (sameAsCover) {
      img.remove()
      continue
    }
    const marker = doc.createElement('p')
    marker.textContent = `@@IMG${inlineCount}@@`
    img.replaceWith(marker)
    inlineCount++
  }

  const firstPara = text(bodyEl.querySelector('p'))
  const excerpt = (metaDesc || firstPara || title).slice(0, 270)

  // HTML -> Portable Text
  const blocks = htmlToBlocks(bodyEl.innerHTML, blockContentType, { parseHtml: (h) => new JSDOM(h).window.document })

  // cover image (variant 0)
  const coverPick = await pexelsPick(term, slug, 0)
  const coverAsset = coverPick ? await downloadAndUpload(coverPick.url, `${slug}-cover.jpg`) : null

  // swap inline markers for Pexels-sourced inlineImage blocks
  const finalBlocks = []
  for (const block of blocks) {
    if (block._type === 'block') {
      const txt = (block.children || []).map((c) => c.text || '').join('')
      // drop the WPML/Polylang "This post is also available in: …" artifact
      if (/this post is also available in/i.test(txt)) continue
      const m = txt.match(/@@IMG(\d+)@@/)
      if (m) {
        const n = parseInt(m[1], 10)
        const pick = await pexelsPick(term, slug, n + 1)
        const asset = pick ? await downloadAndUpload(pick.url, `${slug}-inline${n}.jpg`) : null
        if (asset) {
          finalBlocks.push({
            _type: 'inlineImage',
            _key: key(),
            asset: { _type: 'reference', _ref: asset._id },
            alt: pick.alt || title,
          })
        }
        continue
      }
    }
    if (!block._key) block._key = key()
    finalBlocks.push(block)
  }

  const document = {
    _id: docId(slug),
    _type: 'post',
    title,
    slug: { _type: 'slug', current: slug },
    excerpt,
    publishedAt,
    author: await authorRef(),
    tags: await tagRefs(categories),
    ...(coverAsset
      ? { coverImage: { _type: 'image', asset: { _type: 'reference', _ref: coverAsset._id }, alt: title } }
      : {}),
    body: finalBlocks,
    seoTitle: title.slice(0, 70),
    seoDescription: (metaDesc || excerpt).slice(0, 160),
  }

  console.log(`    "${title}"`)
  console.log(`    slug=${slug} date=${publishedAt.slice(0, 10)} tags=[${categories.join(', ')}] term="${term}"`)
  console.log(`    cover=${coverAsset ? 'ok' : 'MISSING'} inline=${inlineCount} blocks=${finalBlocks.length}`)

  if (!DRY) {
    await client.createOrReplace(document)
    console.log('    ✓ written')
  } else {
    console.log('    (dry)')
  }
}

// ---- main -----------------------------------------------------------------
async function main() {
  const wb = XLSX.readFile(SHEET)
  let rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
  rows = rows.filter((r) => String(r.url || '').trim().startsWith('http'))
  const slice = rows.slice(OFFSET, OFFSET + LIMIT)
  console.log(`Importing ${slice.length} of ${rows.length} blog(s)${DRY ? ' [DRY]' : ''} (offset ${OFFSET})…`)

  let ok = 0
  const failures = []
  for (let i = 0; i < slice.length; i++) {
    try {
      await importOne(slice[i], OFFSET + i + 1)
      ok++
    } catch (e) {
      failures.push({ url: slice[i].url, error: e.message })
      console.error('    ✗ FAILED:', e.message)
    }
  }
  console.log(`\nDone. ${ok} imported, ${failures.length} failed.`)
  if (failures.length) {
    console.log('Failures:')
    failures.forEach((f) => console.log('  -', f.url, '→', f.error))
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
