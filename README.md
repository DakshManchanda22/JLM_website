# JL Morison (India) Ltd. — Website

The marketing website for J.L. Morison (India) Ltd. and its three brands — Morisons Baby Dreams, Emoform, and Bigen. Built with Next.js 14 (App Router), content managed in Sanity, hosted on Vercel.

`Last updated: 2026-07-30`
`Maintainer:` TODO(verify): name + email of the person who owns this repo.

---

## Live URLs

| What | URL |
|---|---|
| Production site | https://jlmorison.com (apex; `www.jlmorison.com` 308-redirects here) |
| Preview / testing site | https://jlm-website-testing.vercel.app/ |
| Sanity Studio (production) | https://jlmorison.com/studio |
| Sanity Studio (preview) | https://jlm-website-testing.vercel.app/studio |
| Sanity Studio (local dev) | http://localhost:3000/studio |
| Video / file storage (GCS, branded) | https://videos.jlmorison.com/ (see [docs/05-MEDIA.md](docs/05-MEDIA.md)) |

## Stack at a glance

| Layer | Tool | One line |
|---|---|---|
| Framework | Next.js 14 (App Router) | Server Components + ISR, one route per page |
| Language | TypeScript (strict) | — |
| Styling | Tailwind CSS 3 | Utility classes; values are inline, no custom theme tokens |
| CMS | Sanity 3 | Content + embedded Studio at `/studio` |
| Scroll animation | GSAP + ScrollTrigger | Scroll reveals, count-ups, pinned effects |
| UI animation | Framer Motion | Enter animations, hovers, menus, carousels |
| Smooth scroll | Lenis | Eased wheel scroll, synced to GSAP |
| Forms | Resend | Contact + careers emails |
| Video / large files | Google Cloud Storage | Bucket `jlm_website_v2`, served via `videos.jlmorison.com` |
| Analytics | Vercel Analytics + Speed Insights | GA4 intentionally not used — see [docs/08](docs/08-INTEGRATIONS.md) |
| Hosting | Vercel | Push to `main` → production deploy |

Full detail: [docs/01-ARCHITECTURE.md](docs/01-ARCHITECTURE.md).

## Quickstart

```bash
git clone <repo-url> && cd "JLM website"
cp .env.example .env.local     # then fill in the values (see docs/03-DEVELOPMENT.md)
npm install
npm run dev                    # http://localhost:3000  (Studio at /studio)
```

Requires Node 20 LTS. TODO(verify): exact Node version used by the Vercel build.

---

## Self-service tiers

These three tiers are referenced throughout the docs. They describe **who** can make a given change.

- **Tier 1 — Anyone, no code.** Edit content in Sanity Studio. Changes appear live within the revalidation window (about a minute). No developer, no deploy.
- **Tier 2 — Anyone following a written runbook.** A step outside Sanity that has a documented procedure: uploading a video to Google Cloud Storage, adding a redirect in Vercel, changing an environment variable. No coding, but you follow instructions exactly.
- **Tier 3 — Requires a developer.** New page layouts, new animations, Sanity schema changes, structural or code-level work.

## "Can I do this myself?"

| I want to… | Tier | Where |
|---|---|---|
| Publish or edit a blog post | 1 | [04 · Content](docs/04-CONTENT-SANITY.md#part-a--editor-guide) |
| Swap a homepage image or headline | 1 | [04 · Content](docs/04-CONTENT-SANITY.md#recipe-swap-a-homepage-image) |
| Edit brand page copy / images (Baby Dreams, Emoform, Bigen) | 1 | [04 · Content](docs/04-CONTENT-SANITY.md#part-a--editor-guide) |
| Update a CSR / ESG / Philanthropy tile | 1 | [04 · Content](docs/04-CONTENT-SANITY.md#part-a--editor-guide) |
| Change footer links, address, or social icons | 1 | [04 · Content](docs/04-CONTENT-SANITY.md#recipe-edit-the-footer) |
| Update SEO title / description / share image for a page | 1 | [04 · Content](docs/04-CONTENT-SANITY.md#seo-fields) |
| Add or replace a video | 2 | [05 · Media](docs/05-MEDIA.md#tier-2-runbook-upload-a-video) |
| Add a redirect from an old URL | 2 | [08 · Integrations](docs/08-INTEGRATIONS.md#redirects) |
| Change an environment variable / email recipient | 2 (or 1 for form recipients) | [09 · Deployment](docs/09-DEPLOYMENT.md#environment-variables) |
| Add a new brand or page layout | 3 | [07 · Pages](docs/07-PAGES.md#recipe-add-a-new-brand-page) |
| Change an animation or add a new one | 3 | [06 · Animation](docs/06-ANIMATION.md) |

## Documentation map

| File | What it covers |
|---|---|
| [01-ARCHITECTURE.md](docs/01-ARCHITECTURE.md) | System diagram, rendering strategy, decision log, request trace |
| [02-COMPONENT-MAP.md](docs/02-COMPONENT-MAP.md) | Every visible component → code, content source, how to change it |
| [03-DEVELOPMENT.md](docs/03-DEVELOPMENT.md) | Local setup, env vars, scripts, conventions, git workflow |
| [04-CONTENT-SANITY.md](docs/04-CONTENT-SANITY.md) | Editor guide (non-technical) + schema reference |
| [05-MEDIA.md](docs/05-MEDIA.md) | Images, video, GCS upload runbook, encoding commands |
| [06-ANIMATION.md](docs/06-ANIMATION.md) | GSAP vs Framer Motion, patterns, cleanup rules |
| [07-PAGES.md](docs/07-PAGES.md) | Page inventory + "add a new brand page" recipe |
| [08-INTEGRATIONS.md](docs/08-INTEGRATIONS.md) | Resend, analytics, SEO plumbing, redirects |
| [09-DEPLOYMENT.md](docs/09-DEPLOYMENT.md) | Vercel config, DNS records, caching, rollback |
| [10-OPERATIONS.md](docs/10-OPERATIONS.md) | Ownership matrix, maintenance calendar, incident runbook |
| [11-DESIGN-SYSTEM.md](docs/11-DESIGN-SYSTEM.md) | Typography, colour, spacing, signature patterns |

## Ownership

Every service (Vercel, Sanity, GCP, GitHub, GoDaddy) is under the **JLM_license** company account. Full matrix in [docs/10-OPERATIONS.md](docs/10-OPERATIONS.md#access--ownership-matrix).
