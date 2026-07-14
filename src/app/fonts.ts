import { Roboto } from 'next/font/google'

/**
 * Site-wide typeface: Roboto everywhere. Google serves Roboto as static weights
 * (100–900) with real italics — the `wdth` axis only exists in "Roboto Flex",
 * which has no true italic — so we mimic the old mix of faces by varying WEIGHT
 * and ITALIC instead of width.
 *
 * `roboto` is the base (full weight range + italic) and carries the CSS variable
 * used as the default font in Tailwind + on <body>. `robotoHeavy` and
 * `robotoBlack` bake in heavier weights so headings that used a bold display
 * face (Anton, Abril Fatface, Inter 600–900) stay bold when their elements
 * don't set a weight of their own.
 */
export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
})

// Only heavy weights loaded, so elements that don't set a weight default to the
// nearest (700) — keeps former semibold/bold display text bold.
export const robotoHeavy = Roboto({
  subsets: ['latin'],
  weight: ['700', '900'],
  display: 'swap',
})

// Single black weight — for big display headings (baked into its className).
export const robotoBlack = Roboto({
  subsets: ['latin'],
  weight: '900',
  display: 'swap',
})
