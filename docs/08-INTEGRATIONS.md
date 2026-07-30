# 08 · Integrations

Third-party services the site talks to: email (Resend), analytics, SEO plumbing, and redirects.

`Last updated: 2026-07-30`
`Maintainer:` TODO(verify)

---

## Resend (form email)

Both forms email their submissions via **Resend**. No database — a submission becomes an email.

- **Sending (verified) domain:** `forms.jlmorison.com`
- **Senders:** careers form → `careers@forms.jlmorison.com`; contact form → `website@forms.jlmorison.com`
- **API key:** `RESEND_API_KEY` (secret, Vercel env). If unset, the routes return a 500 "Email service is not configured".

### Domain verification (DNS)
Resend requires DNS records on `forms.jlmorison.com` (SPF/DKIM, and a return-path/MX). These live wherever DNS is managed (Netcore per the DNS memo, not GoDaddy — see [09-DEPLOYMENT.md](09-DEPLOYMENT.md#dns-records)).
TODO(verify): capture the exact Resend DKIM/SPF/return-path records currently set for `forms.jlmorison.com`.

### The two flows

| Flow | Route | Method | Recipients | Extras |
|---|---|---|---|---|
| Contact | `POST /api/contact` (`src/app/api/contact/route.ts`) | JSON | Sanity `contactUs → recipientEmails` → else `CONTACT_TO_EMAILS` env → else `customercare@jlmorison.com, info@jlmorison.com` | Fields: firstName, lastName, email, message (all required); HTML-escaped; `replyTo` = submitter |
| Careers | `POST /api/careers` (`src/app/api/careers/route.ts`) | `multipart/form-data` | Sanity `careers → recipientEmails` → else `HR_EMAIL` env → else `hr@jlmorison.com` | 12 fields + **resume** attachment (PDF/DOC/DOCX, ≤5 MB); `replyTo` = applicant |

**Where submissions land:** the recipient inbox(es) above. Editors can change recipients in Sanity (Contact Us / Careers docs) — Tier 1, overrides the env fallback.

### Deliverability troubleshooting
1. Form returns 500 → `RESEND_API_KEY` missing/invalid in Vercel env.
2. Form succeeds but no email arrives → check Resend dashboard logs; verify the **sender** is on the verified `forms.jlmorison.com` domain; check recipient spam.
3. "Domain not verified" in Resend → DNS records for `forms.jlmorison.com` missing/incorrect.
4. Careers upload rejected → file >5 MB or not PDF/DOC/DOCX.

## Analytics

The site uses **Vercel Analytics** + **Vercel Speed Insights** (`<Analytics />` and `<SpeedInsights />` in `src/app/layout.tsx`). Data appears in the Vercel dashboard — no setup beyond deploying on Vercel.

> **GA4 is intentionally not used.** The project brief mentioned GA4, but the site standardised on Vercel Analytics instead. The unused `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var has been removed. If GA4 is ever needed, add the tag and re-introduce the variable.

## SEO plumbing

| Piece | Where | Notes |
|---|---|---|
| Canonical origin | `SITE_URL = 'https://jlmorison.com'` in `src/sanity/seo.ts` | Apex; `www` 308-redirects to it |
| Default metadata | `src/app/layout.tsx` `metadata` | Title template `%s \| JL Morison`, description, keywords, robots, default OG/Twitter |
| Per-page metadata | each `page.tsx` `generateMetadata()` → `buildMetadata()` | Pulls Sanity SEO fields via `fetchPageSeo(type)`, falls back to hardcoded title/description |
| OG images | Sanity `ogImage` per page → else `/og-default.jpg` | **`/public/og-default.jpg` is currently missing** ([10](10-OPERATIONS.md#known-issues--technical-debt)) |
| Sitemap | `src/app/sitemap.ts` (ISR 3600s) | 14 static routes + live blog posts + leader slugs, degrades gracefully if Sanity is down |
| robots.txt | `src/app/robots.ts` | Allows all; disallows `/studio` + `/api`; points to sitemap |
| Search Console verification | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env → layout `verification.google` | TODO(verify): confirm the token is set in Vercel |
| theme-color | `viewport` export in layout | `#111111` to match the dark navbar |

### Structured data (JSON-LD)
- **OrganizationSchema** (`components/seo/OrganizationSchema.tsx`) — rendered once in the layout on every page. Name, `foundingDate: 1920`, `logo: /logo.png`, `sameAs` from Sanity footer socials.
- **BreadcrumbSchema** (`components/seo/BreadcrumbSchema.tsx`) — on all 15 content pages, crumbs passed per page.
- **Article JSON-LD** — emitted on `/blog/[slug]`.
- Both use the small `JsonLd` helper (`components/seo/JsonLd.tsx`).

## Redirects

Old-site → new-site 301 redirects live in **`vercel.json`** (edge-level, no code deploy needed to edit). Current map:

| From | To |
|---|---|
| `/mr-anand-laxmanan`, `/mr-ashwani-kumar`, `/mr-nitin-manchanda`, `/mr-sohan-sarda`, `/mrs-kavita-wagh`, `/mrs-sakshi-mody`, `/mr-pratap-nikam` | `/leadership-team/<name>` |
| `/about-us` | `/our-story` |
| `/our-people` | `/life-at-jlm` |
| `/financial-results` | `/investor-relations` |
| `/governance`, `/environment` | `/esg` |
| `/breast-feeding`, `/feeding-range` | `/morisons-baby-dreams` |
| `/life-jlm`, `/lifeatjlm`, `/why-jlm` | `/life-at-jlm` |
| `/join-us` | `/careers` |

### How to add a redirect
- **Code (permanent, versioned):** add an entry to `vercel.json` `redirects` (`source`, `destination`, `statusCode: 301`) and deploy.
- **No-code (Tier 2):** add it in the **Vercel dashboard → Project → Settings → Redirects**. TODO(verify): confirm redirects are managed in `vercel.json` only vs also in the dashboard, to avoid conflicts.

### smartmums.in
The blog content was **imported from smartmums.in** (`scripts/import-blogs.mjs`), but there are **no smartmums.in → jlmorison.com redirects** configured in this repo. TODO(verify): whether smartmums.in redirects are needed and, if so, where they'd be handled (that domain's own DNS/host, not this project).

## Third-party inventory

| Service | Used for | Plan | Cost |
|---|---|---|---|
| Vercel | Hosting, CDN, analytics | TODO(verify) | TODO(verify) |
| Sanity | CMS | TODO(verify) (free tier?) | TODO(verify) |
| Google Cloud Storage | Video/file hosting (`jlm_website_v2`) | TODO(verify) | TODO(verify) |
| Resend | Form email | TODO(verify) (free tier?) | TODO(verify) |
| GoDaddy / Netcore | Domain / DNS | TODO(verify) | TODO(verify) |
| Pexels API | Blog image sourcing (scripts only) | Free API | — |
