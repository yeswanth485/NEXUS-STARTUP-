# Nexus Platform — Deployment Guide

## Prerequisites

- Supabase project (free tier works)
- Render account (or Railway/Fly.io) for backend
- Vercel account (or Netlify) for frontend
- Razorpay test/live account for payments

---

## 1. Supabase Setup

### 1.1 Create project
- Go to https://supabase.com → New project
- Note your **Project URL** (e.g. `https://xyz.supabase.co`)
- Get your **anon key** and **service_role key** from Project Settings → API

### 1.2 Run schema
1. Open Supabase SQL Editor
2. Copy the entire contents of `database/schema.sql`
3. Paste and run (safe to re-run)
4. Copy the contents of `database/seed.sql`
5. Paste and run (inserts demo data)

### 1.3 Create storage buckets
In Supabase Dashboard → Storage:
- `avatars` (public)
- `portfolio` (public)
- `attachments` (public)
- `pitchdecks` (public)

For each bucket, set the policy to allow public read and authenticated insert:

```
CREATE POLICY "public_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "auth_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
```

---

## 2. Backend Deployment (Render)

### 2.1 Create a Web Service
1. Go to https://dashboard.render.com → New Web Service
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Node Version**: 18+

### 2.2 Set environment variables
| Variable | Value |
|---|---|
| `PORT` | `5000` |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `CLIENT_URL` | Your frontend URL (e.g. `https://nexus-app.vercel.app`) |
| `LOG_LEVEL` | `info` (use `warn` to reduce noise in production) |

### 2.3 Security built-in
- **Rate limiting**: 200 req/min global, 10 req/min on auth endpoints
- **CORS**: Locked to `CLIENT_URL` environment variable
- **Authorization**: Every endpoint enforces ownership checks (no IDOR)
- **Logging**: Structured JSON via Pino. Stack traces never reach clients.

### 2.4 Health check
After deploy, verify: `https://your-backend.onrender.com/health`

---

## 3. Frontend Deployment (Vercel)

### 3.1 Environment variables
| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com/api` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-backend.onrender.com` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay key ID |

### 3.2 Deploy
```bash
cd frontend
npx vercel --prod
# or connect to GitHub via Vercel dashboard
```

### 3.3 Error pages
- **404**: Custom dark-themed "Page not found" with back-to-home button
- **500**: Error boundary with "Try Again" button (logs to console)

---

## 4. Auth Configuration (Supabase)

1. Go to Supabase Dashboard → Authentication → Settings
2. Under **External OAuth Providers**:
   - Enable **Google**: Configure Google Cloud Console OAuth
   - Enable **GitHub**: Configure GitHub OAuth app
3. Add callback URL:
   - `https://your-project.supabase.co/auth/v1/callback`
4. Under **Site URL** set: `https://nexus-app.vercel.app`
5. Under **Redirect URLs** add: `https://nexus-app.vercel.app/**`

---

## 5. Verify Complete Flow

After deployment, test the complete user journey:

1. **Sign up / Google OAuth** → Should redirect to `/onboarding`
2. **Onboarding** → Fill details → Should redirect to `/dashboard`
3. **Dashboard** → All tabs load real data from Supabase
4. **Marketplace** → Browse projects, filter by category
5. **Post a project** (as client) → Appears in marketplace
6. **Submit proposal** (as freelancer) → Client sees in dashboard
7. **Accept proposal** → Creates contract automatically
8. **Chat** → Real-time messaging with socket.io
9. **Milestones & Payments** → Razorpay escrow flow

---

## 6. Troubleshooting

| Issue | Fix |
|---|---|
| Auth redirects to login in loop | Check `onboarding_complete` column exists in profiles table |
| Profile not found after signup | Check `handle_new_user()` trigger fired in Supabase SQL Editor |
| Socket.io not connecting | Verify `NEXT_PUBLIC_SOCKET_URL` points to backend URL with no trailing slash |
| RLS policy errors | Run `database/schema.sql` fully — it enables RLS and creates policies |
| "column does not exist" errors | Re-run `database/schema.sql` — it now has all required columns |
| Rate limit hit (429) | Wait 1 minute. Auth endpoints: 10 req/min. Global: 200 req/min. |
| 500 errors after deploy | Check backend logs (Render Dashboard > Logs). Stack traces never leak to client. |
