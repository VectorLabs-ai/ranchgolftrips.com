# Cloudflare setup (easiest path)

**Production (`ranchgolftrips.com`) already on Cloudflare Pages?** You only need **Step B** (second project + `dev.ranchgolftrips.com`). Skip **Step A**.

---

Do staging setup **once**. After that, merging Git branches updates the sites automatically.

**Repo:** `VectorLabs-ai/ranchgolftrips.com`  
**Branches:** `main` = live site, `dev` = staging (branch already exists on GitHub).

---

## Before you start

- Log into [Cloudflare](https://dash.cloudflare.com/) and open the **`ranchgolftrips.com`** zone (nameservers on Cloudflare).
- In another tab, stay logged into **GitHub** (same account/org that owns the repo).

---

## Step A — Production (`ranchgolftrips.com`) *(reference only)*

**Skip entirely** if the site has been live for months—your existing Pages project already covers this.

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

## Camp chat (`/api/chat`, Durable Object)

**Architecture:** Cloudflare Pages **cannot** host a Durable Object class in the Pages bundle. Trip chat uses:

1. **Worker** **`ranchgolftrips-trip-chat`** (folder **`workers/trip-chat-do/`**) — owns class **`TripChatRoom`** and storage migrations.
2. **Pages** **`wrangler.toml`** — binds **`CHAT_ROOM`** with **`script_name = "ranchgolftrips-trip-chat"`** so `/api/chat` ( **`functions/api/chat.js`** ) forwards WebSockets to that Worker’s namespace.

**One-time / when changing the DO class:** deploy the Worker first, then redeploy Pages (Git push or dashboard).

```bash
cd workers/trip-chat-do
npx wrangler deploy
```

That account only needs **one** deploy of this Worker. **Production and staging Pages** both use the same `script_name`, so they share the **same** chat history (same `idFromName("mountain-man-2026")` storage).

**Repo root `wrangler.toml`:** must **not** include `[[migrations]]` (Pages rejects that). Migrations live only in **`workers/trip-chat-do/wrangler.toml`**.

**Local preview:** run the DO Worker and Pages together (see [Durable Objects bindings](https://developers.cloudflare.com/pages/functions/bindings/#durable-objects)), e.g.:

```bash
# Terminal A
cd workers/trip-chat-do && npx wrangler dev

# Terminal B — repo root; class@worker matches folder worker name
npx wrangler pages dev . --do CHAT_ROOM=TripChatRoom@ranchgolftrips-trip-chat
```

(Or use multi-config `wrangler pages dev -c wrangler.toml -c workers/trip-chat-do/wrangler.toml` if you standardize on that flow.)

---

## Quick checklist

- [x] **Project 1 (prod):** already done — `main` → `ranchgolftrips.com`.
- [ ] **Project 2 (staging):** new project — branch `dev` → `dev.ranchgolftrips.com`.
- [ ] Open `dev.ranchgolftrips.com` after a **merge to `dev`** to confirm it rebuilds.

---

## Branch commands (when you need them)

```bash
git checkout dev
git merge main    # make dev match production tip
git push origin dev
```
