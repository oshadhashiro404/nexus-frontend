# Host frontend on Vercel (fix CORS)

## Why you see CORS

The browser must **not** call `https://nexus-core-ag.vercel.app` directly.

It must call **`/api/...` on your frontend** (same website). Next.js forwards that to the hosted backend.

---

## Part A — Fix local dev (5 steps)

### 1. Use the correct folder

```bash
cd nexus-core-backend/frontend
```

(Not `nexus-core/src` and not the repo root.)

### 2. Create `.env.local`

File: `nexus-core-backend/frontend/.env.local`

```env
NEXUS_API_PROXY_TARGET=https://nexus-core-ag.vercel.app
```

**Delete** any line like:

```env
NEXT_PUBLIC_NEXUS_API_URL=https://nexus-core-ag.vercel.app
```

That line causes the CORS error.

### 3. Clear cache and restart

```bash
Remove-Item -Recurse -Force .next
pnpm dev
```

### 4. Hard refresh the browser

Press **Ctrl + Shift + R** (or use a private window).

### 5. Check Network tab

Requests should look like:

- `http://localhost:3001/api/admin/policies` ✅

Not:

- `https://nexus-core-ag.vercel.app/api/admin/policies` ❌

---

## Part B — Deploy frontend to Vercel

### 1. Push code to GitHub

### 2. Vercel → Add New Project → import repo

### 3. Settings

| Setting | Value |
|---------|--------|
| **Root Directory** | `frontend` (if repo is `nexus-core-backend`) or `nexus-core-backend/frontend` |
| **Framework** | Next.js |

### 4. Environment variables (Vercel dashboard)

Add **only**:

| Name | Value |
|------|--------|
| `NEXUS_API_PROXY_TARGET` | `https://nexus-core-ag.vercel.app` |

Do **not** add `NEXT_PUBLIC_NEXUS_API_URL`.

### 5. Deploy

Open your new frontend URL (e.g. `https://your-app.vercel.app`), login with `nexus-admin`.

---

## Part C — Backend on Vercel (already hosted)

Your API: `https://nexus-core-ag.vercel.app`

Ensure these env vars exist on the **backend** Vercel project:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Run SQL migrations in Supabase.

Optional (only if you use direct browser → API calls):

- `ALLOWED_ORIGINS` = your frontend URL, e.g. `https://your-frontend.vercel.app,http://localhost:3000`
