# 09 · Deployment

How code gets to production, the environments, DNS, caching, and how to roll back.

`Last updated: 2026-07-30`
`Maintainer:` TODO(verify)

---

## Hosting

Hosted on **Vercel** (JLM_license account, logged in via the JLM_license GitHub). Push to a branch → Vercel builds and deploys automatically.

| Environment | Branch / trigger | URL |
|---|---|---|
| Production | `main` | https://jlmorison.com |
| Preview / testing | `jlm-website-testing` project | https://jlm-website-testing.vercel.app/ |
| PR previews | every pull request | unique `*.vercel.app` URL |
| Staging (per brief) | `staging` branch | TODO(verify): confirm a `staging` environment exists |

Build command: `next build` (default). Output: Next.js App Router with ISR.

## Deploy flow

1. Branch off `main`, make changes, open a PR.
2. Vercel posts a **preview URL** on the PR — check it (including `/studio`).
3. Merge to `main` → Vercel builds and promotes to production automatically (typically ~1–2 min).

## Rollback

- **Fastest:** Vercel dashboard → Project → **Deployments** → pick the last good deployment → **Promote to Production** (instant redeploy of a previous build).
- **Git:** revert the offending commit on `main` and push.
- **Content rollback** (not code): in Sanity, open the document → history → restore a previous version, then Publish.

## Environment variables

Set in **Vercel → Project → Settings → Environment Variables** for Production, Preview, and Development. Full list + purpose in [03-DEVELOPMENT.md](03-DEVELOPMENT.md#environment-variables).

**Values that differ by environment:**
- `RESEND_API_KEY` should be set in Production (and Preview if you want forms to work on previews).
- Sanity project/dataset are the **same** across environments (single `production` dataset) — meaning preview and production read/write the same content. TODO(verify): whether a separate dataset is wanted for staging.
- To change who receives form emails without a deploy, edit the Sanity Careers/Contact docs (Tier 1) rather than the env fallbacks.

## DNS records

**Authoritative source: [`DNS_MIGRATION.md`](../DNS_MIGRATION.md)** in the repo root — every value there was read off the live domain with `dig` and verified 2026-07-27. Manage DNS in GoDaddy (the migration moves DNS Netcore → GoDaddy; **email on Microsoft 365 must keep working throughout**). Summary:

| Purpose | Type | Host | Value |
|---|---|---|---|
| Website apex | A | `@` | Vercel apex IP — **use what the Vercel dashboard shows** (currently `216.198.79.1`; older `76.76.21.21` is stale in some notes) |
| Website www | CNAME | `www` | Vercel's per-project `*.vercel-dns-*.com` target |
| Video/file CDN | — | `videos` | Points at the GCS load balancer for bucket `jlm_website_v2` — TODO(verify): exact record (A/CNAME) for `videos.jlmorison.com` |
| Email (M365) | MX | `@` | `jlmorison-com.mail.protection.outlook.com` |
| Email SPF | TXT | `@` | `v=spf1 include:spf.mandrillapp.com include:netcore.co.in include:spf.protection.outlook.com -all` |
| Resend sending | MX | `send.forms` | `feedback-smtp.ap-northeast-1.amazonses.com` (pri 10) |
| Resend SPF | TXT | `send.forms` | `v=spf1 include:amazonses.com ~all` |
| Resend DKIM | TXT | `resend._domainkey.forms` | `p=MIGf…` (DKIM key) |

Plus Microsoft 365 DKIM/DMARC/autodiscover/Teams (SIP) records — see `DNS_MIGRATION.md` Section A. **Golden rule from that doc:** build all records in GoDaddy first, switch nameservers last; never switch with an empty zone or email breaks.

> **`www` → apex:** `www.jlmorison.com` 308-redirects to the apex `jlmorison.com`, which is the canonical domain (`SITE_URL` in `src/sanity/seo.ts`). Keep it that way so Search Console doesn't flag duplicate/redirect canonicals.

## Caching layers & how to purge each

| Layer | What it caches | TTL | How to refresh/purge |
|---|---|---|---|
| Vercel ISR | Rendered page HTML | 60s (`revalidate = 60`); sitemap 3600s | Auto after TTL; or redeploy to purge immediately |
| Vercel static | `/_next/static`, fonts | 1 year, immutable (hashed filenames) | Never hand-purge; new build = new hashes |
| Next/Image | Optimised image variants | Long-lived | New source URL invalidates |
| Sanity API | Content Lake responses | `useCdn: false` → fresh each fetch | n/a |
| GCS objects | Videos/PDFs | Set via object `Cache-Control` | Upload under a **new filename** to bust ([05](05-MEDIA.md)) |
| Browser | Everything above | Per response headers | Hard refresh (Cmd/Ctrl+Shift+R) |

To make a content edit appear instantly (rather than waiting up to 60s), redeploy — or add Sanity webhook on-demand revalidation (not yet wired; [04](04-CONTENT-SANITY.md#revalidation-wiring)).

## Build-failure playbook

1. **Read the Vercel build log** — it names the failing file/line.
2. **Type errors:** reproduce locally with `npm run build`; fix types (strict mode).
3. **Lint errors:** `npm run lint`.
4. **Missing env var at build:** confirm it's set for the right environment in Vercel.
5. **Sanity fetch failing the build:** `fetch*()` helpers already guard on an unconfigured client and degrade to fallbacks — a genuine failure usually means a bad GROQ change; test the query in `/studio` Vision.
6. **Image domain error:** a new remote image host must be added to `next.config.mjs` `remotePatterns`.

## Performance budget

Targets (from `CLAUDE.md`): **LCP < 2.5s, CLS < 0.1, INP < 200ms, Lighthouse mobile 95+.** Watch:
- The homepage LCP is the **first brand card image** — keep it well-sized; it's already `priority`.
- Don't add blocking third-party scripts.
- Reserve space for media (aspect ratios / width-height) to protect CLS.
- Monitor real numbers in **Vercel Speed Insights**.
