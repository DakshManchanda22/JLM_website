# 03 · Development

Everything a developer needs to run, understand, and safely change the code locally.

`Last updated: 2026-07-30`
`Maintainer:` TODO(verify)

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20 LTS recommended | No `engines`/`.nvmrc` in repo — TODO(verify) the Vercel build's Node version and pin it |
| npm | 10+ | Ships with Node 20. `package-lock.json` is the lockfile — use npm, not yarn/pnpm |
| Git | any | — |
| ffmpeg | recent | Only for encoding videos before GCS upload ([05-MEDIA.md](05-MEDIA.md)) |

## Local setup

```bash
git clone <repo-url>
cd "JLM website"
cp .env.example .env.local        # fill in values (table below)
npm install
npm run dev                       # http://localhost:3000
```

The **Sanity Studio runs inside the app** at http://localhost:3000/studio — no separate process. It reads/writes the same `production` dataset as the live site, so **edits you make in local Studio are live edits to production content.** Be careful.

If `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset, the site still renders using each component's hardcoded fallbacks (the Sanity client is `null` and every `fetch*()` returns empty). Set the env vars to see real content.

## Environment variables

Store secrets in `.env.local` locally (gitignored) and in Vercel for deployed environments. See [09-DEPLOYMENT.md](09-DEPLOYMENT.md#environment-variables).

| Name | Required | Public/Secret | Purpose | How to obtain |
|---|---|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Public | Sanity project (value: `vfv5lxgr`) | sanity.io/manage → project |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Public | Dataset (`production`) | Same |
| `SANITY_API_TOKEN` | Only for scripts | **Secret** | Write access for `scripts/*.mjs` (seeds/migrations). The runtime site does **not** use it | sanity.io/manage → API → Tokens (Editor) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Public | Google Search Console meta verification | Search Console → Settings → Ownership |
| `RESEND_API_KEY` | Yes (for forms) | **Secret** | Sends contact + careers emails | resend.com → API Keys |
| `RESEND_FROM_EMAIL` | Yes (careers) | Public-ish | Careers sender — must be on a Resend-verified domain (`careers@forms.jlmorison.com`) | Resend domain settings |
| `HR_EMAIL` | Fallback | Public-ish | Careers recipient fallback (`Hrd@jlmorison.com`) | JLM |
| `CONTACT_FROM_EMAIL` | Yes (contact) | Public-ish | Contact sender (`website@forms.jlmorison.com`) | Resend domain settings |
| `CONTACT_TO_EMAILS` | Fallback | Public-ish | Comma-separated contact recipients fallback | JLM |
| `GCS_BUCKET_NAME` | No | Public | In `.env.example` but **not read** by app code; bucket `jlm_website_v2` is referenced directly in URLs | — |
| `PEXELS_API_KEY` | No | **Secret** | Only `scripts/import-blogs.mjs` (bulk blog image sourcing) | pexels.com API |

> Form email recipients can also be set in Sanity (Careers / Contact docs), which **override** the env fallbacks — that path is Tier 1, no code needed.

## npm scripts

| Script | Command | What it does |
|---|---|---|
| `npm run dev` | `next dev` | Local dev server with hot reload |
| `npm run build` | `next build` | Production build (run before deploying to catch type/lint errors) |
| `npm run start` | `next start` | Serve a production build locally |
| `npm run lint` | `next lint` | ESLint (`next/core-web-vitals` + `next/typescript`) |

There is no test script. `playwright` and `jsdom` are dev dependencies used ad-hoc by scripts, not a wired test suite.

### One-off scripts (`scripts/*.mjs`)

Run with `node scripts/<name>.mjs`. They require `SANITY_API_TOKEN` (write) in `.env.local`; the blog importer also needs `PEXELS_API_KEY`. These are **seed/migration** tools — most are one-time and already run. Read the header comment of each before running; several mutate production content.

## Code conventions

- **Server Components by default.** Add `'use client'` only when a component needs hooks, browser APIs, or an animation library. Data fetching stays on the server.
- **Page pattern:** `page.tsx` (server: metadata + Sanity fetch) → `*Client.tsx` (`'use client'`: UI/animation). Keep fetches out of client components.
- **Never fetch Sanity client-side.** Fetch in `page.tsx`/`layout.tsx` and pass props (or use `SiteSettingsProvider` context).
- **Import alias:** `@/*` → `src/*` (see `tsconfig.json`).
- **Images:** use `next/image` with a `sizes` prop. The only intentional raw `<img>` is the Navbar logo (documented inline with an eslint-disable, because its source is a remote SVG chosen at runtime).
- **Styling:** Tailwind utility classes; one-off values via inline `style`. `tailwind.config.ts` has an empty theme — colours/sizes are written inline (see [11-DESIGN-SYSTEM.md](11-DESIGN-SYSTEM.md)).
- **Fonts:** `next/font` (google or local), imported in the component that uses them.
- **GROQ + fetching:** all queries and `fetch*()` helpers live in `src/sanity/queries.ts`. Add new ones there, with a TypeScript type.
- **Animation cleanup:** GSAP must run in `gsap.context(...)` and `ctx.revert()` on unmount ([06-ANIMATION.md](06-ANIMATION.md)).

## Where does a new component go?

| It is… | Put it in |
|---|---|
| Reused across multiple pages | `src/components/` |
| Blog-specific | `src/components/blog/` |
| Structured-data / SEO | `src/components/seo/` |
| A low-level visual/motion primitive | `src/components/ui/` |
| Used by exactly one page | Alongside that page in `src/app/<route>/` (like `EmoformFeatures.tsx`) |

After adding a component, add a row to [02-COMPONENT-MAP.md](02-COMPONENT-MAP.md).

## Git workflow

- Branches: `main` → production, `staging` → staging, every PR gets a Vercel preview URL.
- **Commits:** do **not** add a `Co-Authored-By: Claude` (or any AI) trailer — human author only. This is a project rule in `CLAUDE.md`.
- Open a PR into `main`; check the preview deployment before merging.

## Pre-ship QA checklist

- [ ] `npm run build` passes (no type or lint errors).
- [ ] `npm run lint` clean.
- [ ] Checked at mobile (~375px), tablet, and desktop widths.
- [ ] Tested in Chrome + Safari (iOS Safari if touch behaviour changed).
- [ ] Any new image uses `next/image` with a `sizes` prop.
- [ ] Any new video URL uses `videos.jlmorison.com`, `muted playsinline`, and a poster.
- [ ] Any new GSAP animation reverts on unmount and respects reduced-motion.
- [ ] [02-COMPONENT-MAP.md](02-COMPONENT-MAP.md) updated if components/content sources changed.
- [ ] `CLAUDE.md` + [01-ARCHITECTURE.md](01-ARCHITECTURE.md) updated if the stack changed.

## About `CLAUDE.md`

`CLAUDE.md` at the repo root holds the project's standing instructions (palette, stack, animation rules, commit conventions). Treat it as authoritative for conventions. **Rule:** any stack change must be reflected in both `CLAUDE.md` and [01-ARCHITECTURE.md](01-ARCHITECTURE.md); any component/content-source change must be reflected in [02-COMPONENT-MAP.md](02-COMPONENT-MAP.md).
