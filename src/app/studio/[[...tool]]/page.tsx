/**
 * Embedded Sanity Studio mounted at /studio.
 * Marketing edits blog posts, authors, and tags here without leaving the site.
 */
import Studio from './Studio'

export const dynamic = 'force-static'
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <Studio />
}
