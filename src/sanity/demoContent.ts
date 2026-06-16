/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Fallback content used until the Sanity project is wired up.
 *
 * Once Daksh fills in NEXT_PUBLIC_SANITY_PROJECT_ID + NEXT_PUBLIC_SANITY_DATASET
 * in .env.local (or Vercel env vars) and publishes posts in /studio, the live
 * data takes over automatically and this file becomes inert.
 */
import type { Post, PostListItem } from './queries'

type DemoPostInput = {
  slug: string
  title: string
  excerpt: string
  category: string
  image: string
  author: string
  avatar: string
  role: string
  bio: string
  readTime: number
  publishedAt: string
  featured?: boolean
}

const DEMO_POSTS_INPUT: DemoPostInput[] = [
  {
    slug: 'gentle-baby-skincare',
    title: 'The science behind gentle baby skincare',
    excerpt:
      'How natural ingredients protect sensitive newborn skin — and why a thoughtful routine matters more than ever.',
    category: 'Baby Care',
    image: 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=2000&q=80',
    author: 'Riya Sharma',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&auto=format',
    role: 'Paediatric dermatologist',
    bio: 'Writes about everyday skincare for little ones. Twelve years in practice, two kids of her own.',
    readTime: 5,
    publishedAt: '2026-05-28',
    featured: true,
  },
  {
    slug: 'first-latch',
    title: 'The first latch: what no one tells new mums',
    excerpt: 'A gentle, judgement-free guide to those very first days of breastfeeding.',
    category: 'Breastfeeding',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=2000&q=80',
    author: 'Dr. Anand Mehta',
    avatar:
      'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=240&h=240&fit=crop&auto=format',
    role: 'Lactation consultant',
    bio: 'Father of three, advisor to new parents in Mumbai for fifteen years.',
    readTime: 4,
    publishedAt: '2026-05-12',
  },
  {
    slug: 'covid-safe-baby',
    title: 'Keeping baby safe in a post-Covid world',
    excerpt: 'Hygiene habits that have stayed with us — and which ones really matter.',
    category: 'Covid 19',
    image: 'https://images.unsplash.com/photo-1584462750742-30beae22b87b?w=2000&q=80',
    author: 'Meera Kapoor',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=240&fit=crop&auto=format',
    role: 'Family wellness writer',
    bio: 'Curious about quiet, repeatable habits. Writes about raising kids in modern Indian homes.',
    readTime: 6,
    publishedAt: '2026-04-22',
  },
  {
    slug: 'siblings-and-baby',
    title: 'When the second one arrives: sibling dynamics, made simple',
    excerpt: 'Inviting your older child into the new chapter — without anyone feeling left behind.',
    category: 'Family Dynamics',
    image: 'https://images.unsplash.com/photo-1607706189992-eae578626c86?w=2000&q=80',
    author: 'Ananya Iyer',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&auto=format',
    role: 'Family therapist',
    bio: 'Helps families navigate the small earthquakes of new beginnings.',
    readTime: 5,
    publishedAt: '2026-04-08',
  },
  {
    slug: 'first-foods',
    title: 'First foods: a calm, common-sense weaning guide',
    excerpt: 'Soft textures, single ingredients, and the small wins that get you started.',
    category: 'Food & Nutrition',
    image: 'https://images.unsplash.com/photo-1604908554027-3a6e6b3b0f3a?w=2000&q=80',
    author: 'Riya Sharma',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&auto=format',
    role: 'Paediatric dermatologist',
    bio: 'Writes about everyday skincare for little ones. Twelve years in practice, two kids of her own.',
    readTime: 7,
    publishedAt: '2026-03-30',
  },
  {
    slug: 'twelve-months-meals',
    title: 'Mealtime at 12 months+: textures, tools and tantrums',
    excerpt: 'A practical week of meals for the just-turned-one in your life.',
    category: 'For 12 months+ babies',
    image: 'https://images.unsplash.com/photo-1467453678174-768ec283a940?w=2000&q=80',
    author: 'Meera Kapoor',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=240&fit=crop&auto=format',
    role: 'Family wellness writer',
    bio: 'Curious about quiet, repeatable habits. Writes about raising kids in modern Indian homes.',
    readTime: 4,
    publishedAt: '2026-03-15',
  },
  {
    slug: 'eight-months-purees',
    title: 'Beyond purees: feeding the 8 month+ baby',
    excerpt: 'Soft finger foods, small spoons, and a calmer mealtime.',
    category: 'For 8 months+ babies',
    image: 'https://images.unsplash.com/photo-1597237079442-30aa4cbe7e29?w=2000&q=80',
    author: 'Dr. Anand Mehta',
    avatar:
      'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=240&h=240&fit=crop&auto=format',
    role: 'Lactation consultant',
    bio: 'Father of three, advisor to new parents in Mumbai for fifteen years.',
    readTime: 5,
    publishedAt: '2026-02-28',
  },
  {
    slug: 'nine-months-milestones',
    title: 'The 9 month+ milestone window — what to watch for',
    excerpt: 'Sitting, crawling, babbling — and a parent-friendly checklist.',
    category: 'For 9 months+ babies',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=2000&q=80',
    author: 'Ananya Iyer',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&auto=format',
    role: 'Family therapist',
    bio: 'Helps families navigate the small earthquakes of new beginnings.',
    readTime: 4,
    publishedAt: '2026-02-14',
  },
  {
    slug: 'pregnant-and-new-mums',
    title: 'A letter to pregnant mums & new mums',
    excerpt: 'Small, kind things you can do for yourself in the chaos of becoming.',
    category: 'For pregnant Mums & New Mums',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=2000&q=80',
    author: 'Riya Sharma',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&auto=format',
    role: 'Paediatric dermatologist',
    bio: 'Writes about everyday skincare for little ones. Twelve years in practice, two kids of her own.',
    readTime: 6,
    publishedAt: '2026-01-30',
  },
  {
    slug: 'infant-bathing',
    title: 'Infant care basics: bathing, holding, soothing',
    excerpt: 'The tiny rituals that build big trust in the first six months.',
    category: 'Infant care',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=2000&q=80',
    author: 'Meera Kapoor',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=240&fit=crop&auto=format',
    role: 'Family wellness writer',
    bio: 'Curious about quiet, repeatable habits. Writes about raising kids in modern Indian homes.',
    readTime: 5,
    publishedAt: '2026-01-18',
  },
  {
    slug: 'parenting-without-shouting',
    title: 'Parenting without the shouting (most days)',
    excerpt: 'Small mindset shifts that change a household.',
    category: 'Parenting',
    image: 'https://images.unsplash.com/photo-1623012072430-b66d4cb1e1cb?w=2000&q=80',
    author: 'Ananya Iyer',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&auto=format',
    role: 'Family therapist',
    bio: 'Helps families navigate the small earthquakes of new beginnings.',
    readTime: 5,
    publishedAt: '2025-12-29',
  },
  {
    slug: 'pregnancy-self-care',
    title: 'Pregnancy self-care: the underrated essentials',
    excerpt: 'Five gentle habits worth keeping for the full nine months.',
    category: 'Pregnancy',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=2000&q=80',
    author: 'Dr. Anand Mehta',
    avatar:
      'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=240&h=240&fit=crop&auto=format',
    role: 'Lactation consultant',
    bio: 'Father of three, advisor to new parents in Mumbai for fifteen years.',
    readTime: 6,
    publishedAt: '2025-12-14',
  },
  {
    slug: 'easy-baby-recipes',
    title: 'Five easy, no-fuss baby recipes for the week',
    excerpt: 'Wholesome, made-from-scratch, and ready in under fifteen.',
    category: 'Recipes',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=2000&q=80',
    author: 'Riya Sharma',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&auto=format',
    role: 'Paediatric dermatologist',
    bio: 'Writes about everyday skincare for little ones. Twelve years in practice, two kids of her own.',
    readTime: 4,
    publishedAt: '2025-11-30',
  },
  {
    slug: 'baby-zodiac-personalities',
    title: 'What your baby’s star sign might say about them',
    excerpt: 'A gentle, just-for-fun look at the twelve little personalities.',
    category: 'Zodiac',
    image: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=2000&q=80',
    author: 'Meera Kapoor',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=240&fit=crop&auto=format',
    role: 'Family wellness writer',
    bio: 'Curious about quiet, repeatable habits. Writes about raising kids in modern Indian homes.',
    readTime: 3,
    publishedAt: '2025-11-12',
  },
  {
    slug: 'other-tidbits',
    title: 'Other little things we’ve been thinking about',
    excerpt: 'A small round-up from the team — books, products, and quiet wins.',
    category: 'Others',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=2000&q=80',
    author: 'Ananya Iyer',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&auto=format',
    role: 'Family therapist',
    bio: 'Helps families navigate the small earthquakes of new beginnings.',
    readTime: 3,
    publishedAt: '2025-10-30',
  },
]

/* ─── helpers to fabricate Portable Text from a single source string ───
 * Lets us keep one rich demo body and render it through PortableBody, so
 * the demo and Sanity pipelines exercise the exact same renderer.
 */

function makeBody(input: DemoPostInput): any[] {
  const sub = input.category
  return [
    block(
      'normal',
      `For ${input.author.split(' ')[0]}, this question came up the same week ${input.excerpt.toLowerCase().replace(/[.?!]$/, '')}. What followed was a small reframing — quiet, practical, and, in retrospect, obvious.`,
    ),
    block('normal', 'We rarely talk about the everyday choices that shape a family. They get lost between the milestones — first words, first steps, first day of school. But the rituals in between are doing most of the work.'),
    block('h2', `What ${sub.toLowerCase()} actually asks of us`),
    block('normal', 'Begin with the obvious, because the obvious is usually right. Sleep. Touch. A calm voice. Repetition of the small, kind things. These compound in ways that are difficult to measure but easy to feel.'),
    image(input.image, input.title, `${sub} · A moment from a quiet morning`),
    block('normal', 'There is a habit — common in households we visit — of trying to optimise the obvious. It rarely works. The obvious is obvious because it is correct.'),
    pullQuote(
      'The rituals you reach for first each day are the ones doing the most work.',
      input.author,
    ),
    block('h2', 'A small, repeatable practice'),
    block('normal', 'If you take only one thing away, take this: pick three rituals you can do, every day, with very little effort. Hold them lightly. Repeat them often. Adjust as the season changes.'),
    list('bullet', [
      'Start the morning the same way for at least two weeks.',
      'Move the screen out of the room you sleep in.',
      'Choose one meal where everyone sits down together.',
      'Pick a story; read it slowly; finish it the next night.',
    ]),
    block('h3', 'When it stops working'),
    block('normal', 'It will. It is supposed to. A ritual that worked for a six-month-old will not work for a two-year-old; the two-year-old will tell you so, often loudly. The fix is the same fix every time — slow down, watch carefully, change one thing, watch again.'),
    list('number', [
      'Notice what shifted before you change anything.',
      'Change one thing, not three.',
      'Give it a week before deciding it has failed.',
    ]),
    block('normal', 'The work, in other words, is mostly attention. The rest follows.'),
    block('blockquote', 'In every family I have visited, the parents who seem the calmest are not the ones with the best systems. They are the ones paying the closest attention.'),
    block('normal', 'That is the whole brief, really. Pay attention, choose the small thing, repeat it. The rest builds itself.'),
  ]
}

let keyCounter = 0
const nextKey = () => `demo-${++keyCounter}`

function block(style: string, text: string) {
  return {
    _type: 'block',
    _key: nextKey(),
    style,
    children: [{ _type: 'span', _key: nextKey(), text, marks: [] }],
    markDefs: [],
  }
}

function list(listType: 'bullet' | 'number', items: string[]) {
  return items.map((text) => ({
    _type: 'block',
    _key: nextKey(),
    style: 'normal',
    listItem: listType,
    level: 1,
    children: [{ _type: 'span', _key: nextKey(), text, marks: [] }],
    markDefs: [],
  }))
}

function image(url: string, alt: string, caption?: string) {
  return {
    _type: 'inlineImage',
    _key: nextKey(),
    _url: url,
    alt,
    caption,
    fullBleed: false,
  }
}

function pullQuote(quote: string, attribution?: string) {
  return {
    _type: 'pullQuote',
    _key: nextKey(),
    quote,
    attribution,
  }
}

function flattenBody(items: any[]): any[] {
  return items.flatMap((item) => (Array.isArray(item) ? item : [item]))
}

const DEMO_POSTS: Post[] = DEMO_POSTS_INPUT.map((p) => ({
  _id: p.slug,
  title: p.title,
  slug: p.slug,
  excerpt: p.excerpt,
  coverImage: { _url: p.image, alt: p.title } as any,
  publishedAt: p.publishedAt,
  readTime: p.readTime,
  featured: p.featured,
  author: {
    name: p.author,
    avatar: { _url: p.avatar, alt: p.author } as any,
    bio: p.bio,
    role: p.role,
  },
  tags: [{ title: p.category, slug: slugify(p.category) }],
  body: flattenBody(makeBody(p)),
}))

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function demoPosts(): PostListItem[] {
  return DEMO_POSTS
}

export function demoPostBySlug(slug: string): Post | null {
  return DEMO_POSTS.find((p) => p.slug === slug) ?? null
}

export function demoPostSlugs(): string[] {
  return DEMO_POSTS.map((p) => p.slug)
}

/** True if a Sanity image/asset object actually carries a plain URL (demo mode). */
export function urlFromImage(img: any): string | undefined {
  if (!img) return undefined
  if (typeof img === 'string') return img
  if (img._url) return img._url
  return undefined
}
