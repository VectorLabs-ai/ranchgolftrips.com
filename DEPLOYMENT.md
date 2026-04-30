# Deployments (Cloudflare)

All hosting below assumes **Cloudflare Pages** + **DNS on Cloudflare** for `ranchgolftrips.com`.

| Environment | URL | Branch | Typical setup |
|-------------|-----|--------|----------------|
| **Production** | https://ranchgolftrips.com | `main` | Cloudflare Pages project A — production branch `main` |
| **Staging** | https://dev.ranchgolftrips.com | `dev` | Cloudflare Pages project B — production branch `dev` |

Use **two separate Pages projects** connected to the **same GitHub repo**. Each project has its own production branch and custom domain. (One project cannot attach `ranchgolftrips.com` to `main` and `dev.ranchgolftrips.com` to `dev` at the same time.)

---

## 1. Production project (if not already set)

1. **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → this repo.
2. **Production branch:** `main`.
3. **Build:** Framework **None**, **build command** empty, **build output directory** `/` (repository root — static `index.html`).
4. Deploy, then **Custom domains** → add `ranchgolftrips.com` (and `www` if you use it). Cloudflare will create or fix **DNS** in your zone automatically when the domain is active there.

---

## 2. Staging project (`dev.ranchgolftrips.com`)

1. **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → **same repo** again (second project).
2. **Production branch:** `dev` (must exist on GitHub).
3. Same build settings: **None** / empty command / output `/`.
4. **Custom domains** → add `dev.ranchgolftrips.com` → approve the DNS record Cloudflare adds (usually a **CNAME** `dev` → your `*.pages.dev` hostname).

---

## 3. Git workflow

1. Feature branch → **PR into `dev`** → merge → staging rebuilds on the **dev** Pages project.
2. When approved → **PR `dev` → `main`** → merge → production rebuilds on the **main** Pages project.

Optional: GitHub **branch protection** on `main` with required reviewers.

---

## 4. About the `CNAME` file in this repo

The **`CNAME`** file in the repo root is used by **GitHub Pages** only. **Cloudflare Pages** does not use it; domains are configured in the Cloudflare dashboard. You can **leave `CNAME` as-is** (harmless if you are not publishing via GitHub) or remove it later if the site is **only** on Cloudflare.

---

## 5. Branch commands

```bash
git fetch origin
git checkout -b dev origin/main   # first-time dev branch
git push -u origin dev
```

Sync `dev` with production tip without a feature merge:

```bash
git checkout dev
git merge main
git push origin dev
```

---

## Quick checklist

- [ ] Pages project **#1**: branch `main`, domain `ranchgolftrips.com` (± `www`).
- [ ] Pages project **#2**: branch `dev`, domain `dev.ranchgolftrips.com`.
- [ ] GitHub repo connected to both projects (Cloudflare prompts for app access).
