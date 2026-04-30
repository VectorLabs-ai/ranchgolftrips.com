# Deployments: production vs dev

| Environment | URL | Source branch | Host |
|-------------|-----|---------------|------|
| **Production** | https://ranchgolftrips.com | `main` | GitHub Pages (this repo) |
| **Staging / dev** | https://dev.ranchgolftrips.com | `dev` | Cloudflare Pages or Netlify (see below) |

GitHub Pages only publishes **one** site per repository. Production stays on **`main`**. To get **`dev.ranchgolftrips.com`** on a **different** branch, use a second static host wired to the **`dev`** branch.

## Recommended workflow

1. Work on a feature branch, open a **pull request into `dev`**.
2. After review, **merge to `dev`** → staging site updates automatically.
3. When staging looks good, open a **pull request `dev` → `main`** (production approval).
4. Merge to **`main`** → **ranchgolftrips.com** updates (GitHub Pages).

Optional: protect `main` in GitHub (**Settings → Branches → Branch protection**) so merges require approvals.

---

## Option A — Cloudflare Pages (recommended if you use Cloudflare DNS)

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize GitHub and select this repo (`VectorLabs-ai/ranchgolftrips.com`).
3. **Configure build:**
   - **Production branch:** `dev` (not `main`).
   - **Framework preset:** None.
   - **Build command:** leave empty.
   - **Build output directory:** `/` (root).
4. Save and deploy. Cloudflare assigns a `*.pages.dev` URL; confirm the site loads.
5. **Custom domains** on the Pages project → **Set up** → enter `dev.ranchgolftrips.com`.
6. **DNS:** If the domain uses Cloudflare nameservers, Cloudflare can add the CNAME for you. Otherwise add a **CNAME** at your DNS provider:
   - **Name:** `dev`
   - **Target:** the hostname Cloudflare shows (e.g. `ranchgolftrips-dev.pages.dev`).

Do **not** change the repo’s `CNAME` file; it should remain `ranchgolftrips.com` for GitHub Pages production only.

---

## Option B — Netlify

1. [Netlify](https://www.netlify.com/) → **Add new site** → **Import an existing project** → GitHub → this repo.
2. **Branch to deploy:** set to **`dev`** (production context for this site).
3. **Build settings:** publish directory **`.`**, no build command (or `echo` no-op).
4. **Domain settings** → **Add domain** → `dev.ranchgolftrips.com`; add the **CNAME** Netlify gives you (`dev` → `something.netlify.app`).

Keep your existing **apex** / **www** records pointing at GitHub Pages for production.

---

## Branch setup

The `dev` branch should track the same history as `main` until you start merging features into `dev` first. Create it locally if needed:

```bash
git fetch origin
git checkout -b dev origin/main   # first time only
git push -u origin dev
```

To bring `dev` up to date with production without merging:

```bash
git checkout dev
git merge main
git push origin dev
```

---

## Quick checklist

- [ ] `dev` branch exists on GitHub and builds on Cloudflare Pages / Netlify.
- [ ] `dev.ranchgolftrips.com` CNAME points at the staging host (not GitHub).
- [ ] Repo `CNAME` file stays `ranchgolftrips.com` for GitHub Pages.
- [ ] `main` branch protection / required reviewers (optional but recommended).
