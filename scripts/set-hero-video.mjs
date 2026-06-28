/**
 * Set the homepage hero video to the MBD Women's Day clip hosted on GCS.
 * When a video is present the homepage hero shows the video instead of the
 * image slideshow.
 *
 * Run:  node --env-file=.env.local scripts/set-hero-video.mjs
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const VIDEO_URL =
  "https://storage.googleapis.com/jlm_website_v2/MBD%20Women's%20Day%20-%20Kaamyaab%20Video.mp4"

// Only a draft exists so far — patch whichever is present.
const exists = await client.fetch(
  '*[_id in ["homepage","drafts.homepage"]]| order(_id desc)[0]._id'
)
const targetId = exists || 'drafts.homepage'

const res = await client
  .patch(targetId)
  .set({
    heroVideo: {
      videoUrl: VIDEO_URL,
      brand: 'Kaamyaab',
      tagline: "Morisons Baby Dreams · Women's Day",
    },
  })
  .commit()

console.log('Hero video set on homepage:', res._id)
