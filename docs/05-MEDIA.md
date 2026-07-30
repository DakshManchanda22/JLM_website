# 05 · Media (Images & Video)

How images and video are stored, optimised, and served — plus the copy-paste runbook for adding a video.

`Last updated: 2026-07-30`
`Maintainer:` TODO(verify)

---

## The two media pipelines

| Media | Stored in | Served from | Optimised by |
|---|---|---|---|
| Images (most of the site) | Sanity | `cdn.sanity.io` | `next/image` + Sanity CDN (format, resize, cache) |
| Static images (logo, OG default) | The repo `/public` | Vercel | Vercel |
| Video + large PDFs | Google Cloud Storage (bucket `jlm_website_v2`) | `videos.jlmorison.com` | Pre-encoded by you (ffmpeg) |

## Image pipeline (Sanity)

- Editors upload into Sanity fields. In code, images are fetched with the `imageWithLqip` GROQ fragment and resolved via `resolveImage()` (`src/sanity/resolveImage.ts`).
- URLs are built by `urlFor()` (`src/sanity/image.ts`): `.auto('format').fit('max').quality(75)` — Sanity serves WebP/AVIF where supported.
- Rendered with **`next/image`** (`fill` or width/height) and a `sizes` prop for responsive loading, plus a `blur` placeholder from the LQIP string.

### `next.config.mjs` remote image hosts

```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' }, // placeholder photos in some client defaults
    { protocol: 'https', hostname: 'cdn.sanity.io' },        // all Sanity-managed images
  ],
  dangerouslyAllowSVG: true,   // the Bigen logo is a remote SVG from Sanity
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
}
```

Why each entry exists: **`cdn.sanity.io`** — every CMS image; **`images.unsplash.com`** — placeholder photos still referenced in some component defaults (TODO(verify): replace remaining Unsplash defaults with brand assets); **`dangerouslyAllowSVG`** — allows the Sanity-hosted Bigen logo SVG, sandboxed by the CSP so it can't run scripts.

### Image spec sheet

| Slot | Ratio / size | Format | Notes |
|---|---|---|---|
| Homepage brand card | landscape, ~1600px wide | JPG/WebP | First card is the LCP — keep it lean |
| Homepage feature | ~1400px wide | JPG/WebP | 1+ images per feature (they cross-fade) |
| Stat card icon | small square | **single-colour SVG** | Colour is set by the field, not the file |
| Blog cover | ~1600px wide | JPG/WebP | Alt text required |
| Blog inline image | 16:10 (or 21:9 full-bleed) | JPG/WebP | Alt text required |
| Author avatar | square, ~88px shown | JPG/PNG | — |
| Leader portrait | 3:4 | JPG | Shown `object-top`; beige placeholder if none |
| Baby Dreams banner | 1464×600 | JPG/WebP | Carousel |
| Factory photo | 4:3 | JPG/WebP | — |
| Certification logo | small square | PNG/SVG | Optional per cert |
| OG / share image | 1200×630 | JPG | Per-page or the site default |
| Video poster | match video ratio | JPG | Shown while video loads |

## Video pipeline (Google Cloud Storage)

Videos live in the GCS bucket **`jlm_website_v2`** (owned by the JLM_license account). A Google Cloud **load balancer** puts the branded domain **`videos.jlmorison.com`** in front of the bucket. So:

```
Bucket object:  jlm_website_v2/hero-video.mp4
Public GCS URL: https://storage.googleapis.com/jlm_website_v2/hero-video.mp4
Branded URL:    https://videos.jlmorison.com/hero-video.mp4
```

### ⚠️ The URL rewrite rule (do this every time)

When you get a video's public URL from GCS, it looks like:

```
https://storage.googleapis.com/jlm_website_v2/FOLDER/FILENAME.mp4
```

**Convert it** to the branded URL before pasting it into Sanity — replace `storage.googleapis.com/jlm_website_v2` with `videos.jlmorison.com` (the bucket name drops out):

```
https://videos.jlmorison.com/FOLDER/FILENAME.mp4
```

> **Why:** `videos.jlmorison.com` is a load balancer pointing at the bucket. Using the branded URL gives clean, on-brand links and keeps us portable — if we ever move off GCS, only the load balancer target changes, not every link in the CMS.
>
> **The trap:** the raw `storage.googleapis.com/...` URL *also works*, so if you paste it, the video will play and nothing looks broken — which is exactly why people forget to convert it. Always convert.

> **Known inconsistency:** some existing videos/PDFs in the code and content still use the raw `storage.googleapis.com/jlm_website_v2/...` form (e.g. Baby Dreams and Bigen hero videos, the footer Privacy Policy PDF). New media should use `videos.jlmorison.com`; converting the old ones is low-priority tech debt ([10-OPERATIONS.md](10-OPERATIONS.md#known-issues--technical-debt)).

### Encoding a video (before upload)

Web-friendly H.264 MP4 with the moov atom at the front (so it starts playing before fully downloaded), plus a poster frame:

```bash
# Encode to a web-optimised MP4
ffmpeg -i input.mov \
  -vcodec libx264 -profile:v high -pix_fmt yuv420p \
  -crf 22 -preset slow \
  -acodec aac -b:a 128k \
  -movflags +faststart \
  hero-video.mp4

# Extract a poster frame (at 1 second) for the video's poster image
ffmpeg -i hero-video.mp4 -ss 00:00:01 -vframes 1 hero-poster.jpg
```

Keep hero clips short and muted (they autoplay). Upload the poster into the relevant Sanity image field.

### Tier 2 runbook: upload a video

For a non-developer. You need access to the Google Cloud Console for the JLM_license account.

1. Encode the video with the ffmpeg command above (ask a developer if you don't have ffmpeg). Aim for a reasonable file size — large files are slow to load.
2. Go to **Google Cloud Console → Cloud Storage → Buckets → `jlm_website_v2`**. TODO(verify): direct console URL / project name.
3. (Optional but tidy) open or create a **folder** for the brand (e.g. `BIGEN/`, `MBD/`).
4. Click **Upload files** and select your `.mp4`.
5. After upload, click the file → note its path. Its public URL is `https://storage.googleapis.com/jlm_website_v2/<folder>/<file>.mp4`.
6. Confirm the object is **publicly readable**. TODO(verify): whether new objects inherit public-read automatically or must be set per-file (bucket IAM). If the video doesn't play, this is the usual cause.
7. Set metadata **`Cache-Control: public, max-age=31536000, immutable`** on the object so browsers/CDN cache it long-term (use a new filename when you replace a video, rather than overwriting). TODO(verify): confirm the team's preferred cache policy.
8. **Convert the URL** to the branded form (see the rewrite rule above): `https://videos.jlmorison.com/<folder>/<file>.mp4`.
9. Paste the branded URL into the relevant **Sanity** field (e.g. Our Brands → Baby Dreams → Video → Video URL), and **Publish**.

<!-- SCREENSHOT: Google Cloud Console — jlm_website_v2 bucket file list with a video's public URL visible -->
<!-- SCREENSHOT: Sanity video field showing where the videos.jlmorison.com URL is pasted -->

## Playback conventions

The site's video components (`InlineVideo`, and the brand hero videos) follow these rules — match them for any new video UI:
- `muted` + `playsInline` + `autoPlay` + `loop` — required for iOS/Android autoplay.
- A **poster** image shows until playback actually begins (avoids a black box on slow connections).
- The frame locks to the video's true aspect ratio once metadata loads (no cropping).
- Mute/unmute and fullscreen controls are custom; touch devices get the native player on tap.
- `preload="auto"` on inline videos; keep hero files small.
- Respect `prefers-reduced-motion` for decorative motion.

## Media inventory

| Media | Location | Used on |
|---|---|---|
| Baby Dreams teaser video | `storage.googleapis.com/jlm_website_v2/MBD-Teaser-25-11%201.mp4` (raw — convert) | `/morisons-baby-dreams` |
| Baby Dreams Women's Day clip | `…/jlm_website_v2/MBD Women's Day - Kaamyaab Video.mp4` | homepage hero video (seed) / Philanthropy |
| Bigen Jadeja clip | `…/jlm_website_v2/BIGEN JADEJA 10 SEC…HD 5.mp4` (raw — convert) | `/bigen` |
| Privacy Policy PDF | `…/jlm_website_v2/Privacy-Policy.pdf` (raw) | Footer link |
| Unpaid/Unclaimed Dividend list | `…/jlm_website_v2/List-of-Unpaid…-2.pdf` | `/investor-relations` |
| Site logo (static) | `/public/logo.png` | Org JSON-LD, favicon set |
| OG default image | `/public/og-default.jpg` — **MISSING**, referenced by metadata | all pages' default share image — see [10-OPERATIONS.md](10-OPERATIONS.md#known-issues--technical-debt) |
