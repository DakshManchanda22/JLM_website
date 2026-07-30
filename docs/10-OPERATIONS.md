# 10 · Operations

Running the site after handover: who owns what, what needs periodic attention, what fails silently, and how to recover.

`Last updated: 2026-07-30`
`Maintainer:` TODO(verify)

---

## Access & ownership matrix

Every service is under the **JLM_license** company account. No individual developer's personal account owns anything. No credentials are stored in this repo.

| Service | Owner | Login | Plan | Credentials stored in | Notes |
|---|---|---|---|---|---|
| Vercel | JLM_license | via JLM_license **GitHub** | TODO(verify) | TODO(verify: password manager?) | Hosting, analytics |
| Sanity | JLM_license | via JLM_license **GitHub** | TODO(verify) | TODO(verify) | Project `vfv5lxgr`, dataset `production` |
| Google Cloud (GCS) | JLM_license | JLM_license Google account | TODO(verify) | TODO(verify) | Bucket `jlm_website_v2`, `videos.jlmorison.com` |
| GitHub | JLM_license org | JLM_license | TODO(verify) | TODO(verify) | Source of truth for code |
| GoDaddy | JLM_license | JLM_license | — | TODO(verify) | Domain registrar + (post-migration) DNS |
| Resend | JLM_license | TODO(verify) | TODO(verify) | TODO(verify) | Sending domain `forms.jlmorison.com` |
| Microsoft 365 | JLM_license | JLM_license | — | TODO(verify) | Company email — do not disrupt (see DNS) |

TODO(verify): where the actual passwords/API tokens live (a shared password manager?).

## Recurring maintenance calendar

| Item | Frequency | Procedure | If missed |
|---|---|---|---|
| Domain renewal (jlmorison.com) | Annual | GoDaddy → ensure auto-renew on | Site + email go dark |
| GCP billing | Monthly | Confirm the GCP billing account is funded (bucket + load balancer) | Videos stop serving |
| Sanity plan limits | Quarterly | Check asset/bandwidth usage vs free tier | Editing/images may throttle |
| Resend domain verification | On DNS change | Confirm `forms.jlmorison.com` still "Verified" in Resend | Form emails stop sending |
| Dependency updates | Quarterly | `npm outdated`; bump Next/Sanity carefully on a branch; `npm run build`; test preview | Security drift, eventual breakage |
| SSL certificate | Auto (Vercel) | Nothing — Vercel auto-renews | n/a |
| Sanity content backup | Monthly (recommended) | `sanity dataset export production` (see below) | Harder recovery from bad edits |

## What has NO monitoring (fails silently)

There is **no uptime monitor, error tracker, or alerting wired** in this repo. These fail without anyone being told:

- **Form email delivery** — if Resend breaks or the domain unverifies, forms may 500 (visible) *or* appear to send but not deliver. Nobody is alerted. Recommend: periodic test submissions.
- **Video hosting** — if GCP billing lapses or the load balancer changes, videos silently stop. Recommend: spot-check brand pages.
- **Broken content** — a bad Sanity edit publishes live within ~60s with no review gate.
- **Search Console / SEO regressions** — only visible if someone checks Search Console.
- **Uptime** — the brief mentioned UptimeRobot; TODO(verify): set up a free UptimeRobot check on `https://jlmorison.com` with email alerts.

TODO(verify): decide whether to add error tracking (e.g. Sentry) and an uptime monitor.

## Incident runbook

| Symptom | Likely cause | Fix | Escalate to |
|---|---|---|---|
| Whole site down | Bad deploy / DNS | Vercel → Promote last good deployment; check `dig jlmorison.com A` vs Vercel | Developer / Vercel support |
| Site up, email down | DNS MX/SPF changed | Compare live DNS to [`DNS_MIGRATION.md`](../DNS_MIGRATION.md) Section A; restore MX | Developer / M365 admin |
| Forms not arriving | Resend key/domain | Check Resend logs + domain "Verified"; verify `RESEND_API_KEY` in Vercel | Developer |
| Video not playing | GCS object private / billing / wrong URL | Confirm object public-read; confirm URL uses `videos.jlmorison.com`; check GCP billing | Developer / GCP admin |
| Content edit not showing | Not published / cache | Publish; wait ~60s; hard refresh | — (self-serve) |
| Images 404 / config error | New image host not allowed | Add host to `next.config.mjs` `remotePatterns`; redeploy | Developer |
| Build failing | Type/lint/env | See [09 build-failure playbook](09-DEPLOYMENT.md#build-failure-playbook) | Developer |

## Troubleshooting FAQ

1. **My change isn't live.** Did you click Publish? Wait ~60s and hard-refresh. Right document?
2. **A video won't play.** Is the URL `videos.jlmorison.com/...`? Is the GCS object public? Is it a faststart MP4?
3. **The share preview on WhatsApp is wrong/blank.** The page's OG image, or the missing `/public/og-default.jpg` default (see Known issues). Set a per-page OG image in the SEO tab.
4. **A form says "Email service is not configured."** `RESEND_API_KEY` is missing in Vercel.
5. **A leader disappeared from the page.** They were removed from the Leadership Team drag-list; re-add them (removing there doesn't delete the person).
6. **Fonts look different across pages.** By design — each page has its own type treatment ([11](11-DESIGN-SYSTEM.md)).
7. **The homepage has no big hero image.** Correct — the homepage opens on the brand cards; there is no hero section.
8. **Studio won't load / Publish bar is off-screen.** Use `/studio` directly; it renders full-viewport (SiteChrome is bypassed there).
9. **Blog post 404s after renaming.** Changing a slug changes the URL; add a redirect in `vercel.json` or restore the slug.
10. **Two of the same singleton appear.** Singletons are pinned by Studio structure, not hard-locked; edit via the pinned sidebar entry, not by creating new docs.

## Backup & recovery

- **Code:** GitHub — every commit is a restore point.
- **Content:** Sanity cloud (automatic). Manual export:
  ```bash
  npx sanity dataset export production backup-$(date +%F).tar.gz
  ```
  Requires Sanity CLI auth for the JLM_license account. Store exports somewhere safe (TODO(verify): agree a backup location/cadence).
- **Media:** GCS. TODO(verify): enable **object versioning** on the `jlm_website_v2` bucket so overwrites are recoverable.
- **Env vars:** not in git — keep a copy in the password manager (TODO(verify)).

## Known issues & technical debt

Found during the audit:

1. **`/public/og-default.jpg` is missing** — referenced by the layout + `buildMetadata()` as the default share image. Add a 1200×630 JPG at `public/og-default.jpg`.
2. **Raw GCS URLs in code/content** — some videos/PDFs use `storage.googleapis.com/jlm_website_v2/...` instead of the branded `videos.jlmorison.com/...`. Low priority; convert opportunistically ([05](05-MEDIA.md#the-url-rewrite-rule-do-this-every-time)).
3. **`document.getElementById('page-scroller')`** — a legacy GSAP `scroller` reference in `StatsSection`, `HomeFeatures`, `blog/InlineImage`, `blog/PullQuote`; the element no longer exists, so it harmlessly falls back to the viewport. Safe to clean up.
4. **GA4 intentionally not used** — analytics is Vercel Analytics + Speed Insights only; the unused `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var was removed. (Resolved.)
5. **Unsplash placeholder images** still referenced in some component defaults — replace with brand assets and remove `images.unsplash.com` from `next.config.mjs` when done.
6. **`CLAUDE.md` was stale** (fonts, redirects location, homepage hero) — corrected in this handover; keep it in sync going forward.
7. **No uptime/error monitoring** (see above).
8. **`.env.example` sender defaults** were on root `@jlmorison.com`; corrected to `@forms.jlmorison.com` (the verified Resend domain) during handover.

## Handover checklist

- [ ] Fill every `TODO(verify)` across the docs (see [VERIFY summary](#) at the end of the handover message).
- [ ] Add `public/og-default.jpg` (1200×630).
- [ ] Confirm all env vars are set in Vercel (Production + Preview).
- [ ] Confirm Resend shows `forms.jlmorison.com` as Verified.
- [ ] Confirm GCS bucket `jlm_website_v2` has public-read + versioning; document the `videos.jlmorison.com` DNS record.
- [ ] Set up an UptimeRobot check on the production URL.
- [ ] Record where credentials live (password manager) in the ownership matrix.
- [ ] Agree a Sanity export backup cadence and location.
- [ ] Confirm the Node version for the Vercel build and add an `engines`/`.nvmrc`.
