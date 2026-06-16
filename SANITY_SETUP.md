# Sanity CMS — One-time setup

The blog is wired up to Sanity. Until you finish the steps below, the site falls back to demo posts so nothing breaks. As soon as you fill the env vars, the live data takes over automatically.

---

## 1. Create the Sanity project

1. Go to **https://www.sanity.io/manage** and sign in with the JLM company email.
2. Click **Create new project**.
3. Project name: `JL Morison`. Dataset: `production` (default).
4. After it's created, copy the **Project ID** from the project's dashboard URL or the “Project info” box. It looks like `abc12345`.

## 2. Add env vars locally

Create `.env.local` in the project root (it's gitignored — never commit it):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=abc12345    # the ID from step 1
NEXT_PUBLIC_SANITY_DATASET=production
```

Restart `npm run dev`.

## 3. Add the same env vars on Vercel

Dashboard → JLM project → **Settings → Environment Variables**. Add both for **Production**, **Preview**, and **Development** environments. Redeploy.

## 4. Open the embedded Studio

Once the dev server is running with those env vars, visit:

```
http://localhost:3000/studio
```

Sign in with the same JLM account. You'll see three sections in the sidebar:

- **Blog posts** — the articles
- **Authors** — writer profiles (avatar, bio, role)
- **Tags** — categories used on the blog index

> **First time only:** Sanity will ask you to add `http://localhost:3000` to the project's **CORS origins**. Confirm. After deploy, also add `https://jlmorison.com` and the Vercel preview/staging URLs.

## 5. Add your first post

In Studio:

1. **Authors** → **+** → fill name, bio, role, avatar. Save & Publish.
2. **Tags** → **+** → add e.g. “Baby Care”, “Parenting”, “Recipes”. Save & Publish.
3. **Blog posts** → **+** →
   - Title, slug (auto), excerpt, cover image.
   - In **Body**, click **+** to insert subheadings (Heading / Subheading), bulleted or numbered lists, inline images (with caption and full-bleed option), or a pull quote.
   - Pick an author (the reference field) and one or more tags.
   - SEO tab: optional — falls back to title + excerpt + cover image when blank.
4. Click **Publish**.

Refresh `/blog` — your post appears. Click into it — full editorial layout, author card at the bottom.

## 6. Day-to-day editing

- Add new posts: **Blog posts → +**
- Remove a post: open it, click the three dots → **Delete**, or just **Unpublish** to hide it
- Reorder priority on the index: turn on **Feature on blog index** on one post — it slots into the large featured card
- Change a tag's name: edit the tag in **Tags** — all posts referencing it update everywhere

## 7. Production deploy of Studio

The Studio is hosted *as part of the website itself* — when you push to `main` and Vercel deploys, the URL becomes:

```
https://jlmorison.com/studio
```

No separate deploy needed.

---

## Quick reference

| Action | Where |
|---|---|
| Add / edit / delete posts | `/studio` → Blog posts |
| Add / edit authors | `/studio` → Authors |
| Add / edit tags | `/studio` → Tags |
| Inline images mid-article | Body editor → **+** → Inline image |
| Bulleted / numbered lists | Body editor → list buttons in the toolbar |
| Pull quote block | Body editor → **+** → Pull quote |
| Subheadings (H2 / H3) | Body editor → style dropdown → Heading / Subheading |
| SEO meta | Each post → **SEO** tab |

---

## Troubleshooting

- **`/blog` still shows demo posts** — env vars not picked up. Restart the dev server (or redeploy on Vercel) and double-check the project ID.
- **Images not loading** — make sure `cdn.sanity.io` is in `next.config.mjs` `images.remotePatterns` (it already is).
- **CORS error in Studio** — Sanity manage → API → CORS origins → add the URL you're using.
