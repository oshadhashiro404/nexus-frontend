# NexusCore Frontend

Admin UI for the NEXUS bunker system. Connects to the **hosted API** at `https://nexus-core-ag.vercel.app` via a same-origin proxy (no CORS issues).

## Quick start

```bash
cd frontend
pnpm install
pnpm dev
```

Open **http://localhost:3000** (or the port shown in the terminal).  
Login password: **`nexus-admin`**

## How it connects to the hosted backend

| Layer | What happens |
|--------|----------------|
| Browser | Calls `http://localhost:3000/api/admin/...` (same origin) |
| Next.js | `app/api/[...path]/route.ts` forwards to `https://nexus-core-ag.vercel.app/api/...` |
| Hosted API | Your Vercel backend + Supabase |

Configure the hosted URL in **`frontend/.env.local`**:

```env
NEXUS_API_PROXY_TARGET=https://nexus-core-ag.vercel.app
```

Do **not** set `NEXT_PUBLIC_NEXUS_API_URL` unless you also configure CORS on the backend.

## Hosted backend requirements (Vercel)

On the **backend** Vercel project (`nexus-core-ag`), set:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ALLOWED_ORIGINS` — only needed for direct browser → API calls

Run Supabase migrations (`supabase/migrations/*.sql`) on your project so tables like `survivors` and `policies` exist.

## Deploy frontend to Vercel

1. Root directory: `frontend`
2. Environment variable: `NEXUS_API_PROXY_TARGET=https://nexus-core-ag.vercel.app`
3. Deploy — the proxy route runs on the server and talks to the hosted API.

## Troubleshooting

- **CORS errors** — You are calling the Vercel URL directly from the browser. Remove `NEXT_PUBLIC_NEXUS_API_URL`, restart `pnpm dev`, hard-refresh.
- **Disconnected / empty data** — Check hosted API: open `https://nexus-core-ag.vercel.app/api/admin/survivors` in the browser. If it errors, fix Supabase env vars and migrations on the backend deployment.
