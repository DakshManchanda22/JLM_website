# /public — static assets

Files here are served from the site root (e.g. `public/logo.png` → `/logo.png`).

## Required for SEO — please add these two images

The metadata and structured data reference two images that need to exist here:

| File | Size | Used for |
|---|---|---|
| `og-default.jpg` | 1200 × 630px | Default social share card (WhatsApp / LinkedIn / X) when a page has no custom share image set in Sanity. |
| `logo.png` | square, ~512px | The company logo in the Organization / Article structured data (helps Google show the brand logo). |

Until they're added, share previews fall back to a broken image and the logo
won't appear in rich results. Any page can still override the share card via
**Sanity → (page) → SEO → Share image**.

## Sitemap & robots are dynamic (not files)

There are no `robots.txt` / `sitemap.xml` files here. They're generated at
request time by `src/app/robots.ts` and `src/app/sitemap.ts` and served at
`/robots.txt` and `/sitemap.xml`. The sitemap queries Sanity live (ISR-cached,
hourly), so new blog posts and leaders appear automatically without a redeploy.
