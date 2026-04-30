# Cloudflare setup (easiest path)

Do this **once**. After that, merging Git branches updates the sites automatically.

**Repo:** `VectorLabs-ai/ranchgolftrips.com`  
**Branches:** `main` = live site, `dev` = staging (branch already exists on GitHub).

---

## Before you start

- Log into [Cloudflare](https://dash.cloudflare.com/) and open the **`ranchgolftrips.com`** zone (nameservers on Cloudflare).
- In another tab, stay logged into **GitHub** (same account/org that owns the repo).

---

## Step A — Production (`ranchgolftrips.com`)

**Skip this block if** you already have a Cloudflare Pages project deploying `main` for this site.

1. Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. **Install / authorize** the Cloudflare GitHub app when asked → pick repo **`ranchgolftrips.com`**.
3. **Configure:**
   - **Project name:** anything clear, e.g. `ranchgolftrips` or `ranchgolftrips-prod`.
   - **Production branch:** `main`.
   - **Framework preset:** None.
   - **Build command:** *(leave empty)*.
   - **Build output directory:** `/` *(single slash = site root)*.
4. **Save and deploy.**
5. Open your project → **Custom domains** → **Set up a domain** → add **`ranchgolftrips.com`** (and **`www`** if you use it). **Activate** any DNS records Cloudflare suggests.

---

## Step B — Staging (`dev.ranchgolftrips.com`)

1. **Workers & Pages** → **Create** → **Pages** → **Connect to Git** again.
2. Choose the **same repo** (`ranchgolftrips.com`). GitHub may not ask to install again.
3. **Configure:**
   - **Project name:** e.g. `ranchgolftrips-dev`.
   - **Production branch:** `dev` *(not `main`)*.
   - **Framework preset:** None.
   - **Build command:** *(empty)*.
   - **Build output directory:** `/`.
4. **Save and deploy.**
5. **Custom domains** → add **`dev.ranchgolftrips.com`** → activate DNS.

---

## Day to day (after setup)

| Goal | What you do |
|------|-------------|
| Update **staging** | Merge work into **`dev`** (e.g. via PR). |
| Go **live** | When staging looks good, merge **`dev` → `main`** (e.g. via PR). |

No Cloudflare clicks required for normal updates—**push/merge triggers builds**.

---

## Optional: safer `main`

GitHub repo → **Settings** → **Branches** → add a rule for **`main`** → require **pull request** + **approvals** so nobody ships to production by accident.

---

## `CNAME` file in this repo

Cloudflare **does not** read it. It only mattered for GitHub Pages. Safe to leave as-is or remove later if you are **only** on Cloudflare.

---

## Quick checklist

- [ ] **Project 1:** branch `main` → `ranchgolftrips.com` works.
- [ ] **Project 2:** branch `dev` → `dev.ranchgolftrips.com` works.
- [ ] Both projects show **green** latest deployments after a test merge.

---

## Branch commands (when you need them)

```bash
git checkout dev
git merge main    # make dev match production tip
git push origin dev
```
