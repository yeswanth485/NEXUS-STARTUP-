# NEXUS PLATFORM - COMPLETE DEPLOYMENT GUIDE

## Architecture Overview

| Component | Service | URL Pattern |
|-----------|---------|-------------|
| Frontend | Vercel | `https://your-app.vercel.app` |
| Backend | Render | `https://your-api.onrender.com` |
| Database | Supabase (PostgreSQL) | `https://your-project.supabase.co` |
| Auth | Supabase Auth | Built into Supabase |
| Storage | Supabase Storage | Built into Supabase |
| Payments | Razorpay | API integration |

---

## TABLE OF CONTENTS

1. [Prerequisites](#1-prerequisites)
2. [Step 1: Supabase Setup (Database + Auth + Storage)](#2-step-1-supabase-setup)
3. [Step 2: Razorpay Setup](#3-step-2-razorpay-setup)
4. [Step 3: Backend Deployment (Render)](#4-step-3-backend-deployment)
5. [Step 4: Frontend Deployment (Vercel)](#5-step-4-frontend-deployment)
6. [Environment Variables Reference](#6-environment-variables-reference)
7. [Post-Deployment Checklist](#7-post-deployment-checklist)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. PREREQUISITES

- GitHub account (code must be pushed to a Git repository)
- Vercel account (free tier works) - https://vercel.com
- Render account (free tier works) - https://render.com
- Supabase account (free tier works) - https://supabase.com
- Razorpay account (test mode to start) - https://razorpay.com
- Node.js v18+ installed locally (for testing)

---

## 2. STEP 1: SUPABASE SETUP (DATABASE + AUTH + STORAGE)

### 2.1 Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Choose your organization (create one if needed)
4. Fill in:
   - **Project Name**: `nexus-platform`
   - **Database Password**: Generate a strong password (SAVE THIS)
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait 1-2 minutes for the project to initialize

### 2.2 Get Your Supabase Credentials

After project creation, go to **Settings > API** (left sidebar):

Copy these values (you'll need them for ALL environment variables):

| Credential | Where to find | Used by |
|-----------|---------------|---------|
| **Project URL** | `Settings > API > Project URL` | Frontend + Backend |
| **Anon Key** | `Settings > API > anon public` | Frontend + Backend |
| **Service Role Key** | `Settings > API > service_role` | Backend ONLY |

Also note your **Project ID** (found in the URL: `https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]`)

### 2.3 Run the Database Schema

1. In the Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the ENTIRE content of `database/schema.sql` and paste it
4. Click **"Run"** (bottom right)
5. You should see "Success. No rows returned" - this created:
   - 14 tables (profiles, companies, projects, proposals, contracts, messages, etc.)
   - 18 indexes for performance
   - 8 triggers (auto-timestamps, auto-profile creation on signup, rating updates)
   - 20+ Row Level Security policies
   - Helper functions

### 2.4 Verify Tables Created

Go to **Table Editor** (left sidebar) and confirm you see these tables:

```
profiles
companies
company_members
projects
proposals
contracts
milestones
conversations
messages
reviews
portfolio_items
company_portfolio
kanban_tasks
notifications
```

### 2.5 Configure Auth Settings

1. Go to **Authentication > Providers** (left sidebar)
2. Ensure **Email** provider is enabled (it is by default)
3. Under **Authentication > URL Configuration**:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add these:
     ```
     http://localhost:3000/**
     https://your-frontend-app.vercel.app/**
     ```
4. Under **Authentication > Email Templates**:
   - Customize the confirmation and password reset emails if desired
   - Set the **Confirm signup** redirect URL to: `https://your-frontend-app.vercel.app/dashboard`

### 2.6 Configure Storage Buckets (if using file uploads)

1. Go to **Storage** (left sidebar)
2. Create a bucket named `avatars`:
   - Set **Public** = Yes
3. Create a bucket named `portfolio`:
   - Set **Public** = Yes
4. Go to **Storage > Policies** and ensure these policies exist (or create them):

```sql
-- Allow public read access to avatars
CREATE POLICY "Avatar public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Avatar upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow public read access to portfolio
CREATE POLICY "Portfolio public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');

-- Allow authenticated users to upload portfolio
CREATE POLICY "Portfolio upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
```

### 2.7 Enable Realtime (for chat)

1. Go to **Database > Replication** (left sidebar)
2. Enable replication for these tables:
   - `messages`
   - `conversations`
   - `profiles`
3. Go to **Settings > API** and check **Realtime** is enabled

---

## 3. STEP 2: RAZORPAY SETUP

### 3.1 Create Razorpay Account

1. Go to https://dashboard.razorpay.com/signup
2. Sign up and complete basic verification
3. For testing, you'll be in **Test Mode** automatically

### 3.2 Get Razorpay API Keys

1. Go to **Settings > API Keys** (left sidebar)
2. Click **"Generate Key"** (if not already generated)
3. Copy:
   - **Key ID**: `rzp_test_xxxxxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxxxxx`

### 3.3 Configure Webhook (Optional but Recommended)

1. Go to **Settings > Webhooks**
2. Click **"Add New Webhook"**
3. Enter: `https://your-backend.onrender.com/api/payments/webhook`
4. Select events: `payment.captured`, `payment.failed`
5. Save the webhook secret

---

## 4. STEP 3: BACKEND DEPLOYMENT (RENDER)

### 4.1 Push Code to GitHub

If not already done:

```bash
cd D:\NEXUS
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/nexus-platform.git
git push -u origin main
```

### 4.2 Create Render Service

1. Go to https://dashboard.render.com
2. Click **"New +"** (top left)
3. Select **"Web Service"**
4. Connect your GitHub repository
5. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `nexus-backend` |
| **Region** | Choose closest to users |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `node src/index.js` |
| **Instance Type** | Free (or Starter for production) |

### 4.3 Set Environment Variables on Render

Go to your service > **Environment** tab > **Add Environment Variable** for each:

| Key | Value | Notes |
|-----|-------|-------|
| `PORT` | `5000` | Render also sets PORT automatically, but include it |
| `CLIENT_URL` | `https://your-frontend-app.vercel.app` | **CRITICAL** - CORS origin |
| `SUPABASE_URL` | `https://your-project.supabase.co` | From Supabase Settings > API |
| `SUPABASE_ANON_KEY` | `your-anon-key` | From Supabase Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` | From Supabase Settings > API |
| `RAZORPAY_KEY_ID` | `rzp_test_xxxxxxxxxxxx` | From Razorpay Settings > API Keys |
| `RAZORPAY_KEY_SECRET` | `xxxxxxxxxxxxxxxx` | From Razorpay Settings > API Keys |

### 4.4 Deploy

1. Click **"Create Web Service"** (or "Save Changes")
2. Render will automatically start building and deploying
3. Wait for the deploy to complete (usually 2-3 minutes)
4. Your backend is live at: `https://nexus-backend.onrender.com`

### 4.5 Verify Backend

Visit: `https://nexus-backend.onrender.com/api/health`

Expected response:
```json
{"status":"ok","timestamp":"2026-06-25T..."}
```

### 4.6 Important: Handle Free Tier Sleep

Render free tier spins down after 15 minutes of inactivity. To handle this:

- First request after sleep takes ~30 seconds
- Consider adding a cron pinger (e.g., UptimeRobot hitting `/api/health` every 5 min)
- Or upgrade to Starter plan ($7/month)

---

## 5. STEP 4: FRONTEND DEPLOYMENT (VERCEL)

### 5.1 Push Code to GitHub

Ensure the frontend code is in the same repo (subfolder) or a separate repo.

If separate repo:
```bash
cd D:\NEXUS\frontend
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin https://github.com/YOUR_USERNAME/nexus-frontend.git
git push -u origin main
```

### 5.2 Create Vercel Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** > **"Project"**
3. Import your GitHub repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js (auto-detected) |
| **Root Directory** | `frontend` (if monorepo) or `./` |
| **Build Command** | `next build` |
| **Output Directory** | `.next` (default) |
| **Install Command** | `npm install` |

### 5.3 Set Environment Variables on Vercel

Go to **Settings > Environment Variables** and add:

| Key | Value | Environments |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` | Production, Preview, Development |
| `NEXT_PUBLIC_API_URL` | `https://nexus-backend.onrender.com` | Production, Preview, Development |

**IMPORTANT**: After adding variables, you must select which environments they apply to:
- Check **Production** (for live site)
- Check **Preview** (for PR previews)
- Check **Development** (for local dev)

### 5.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (usually 1-2 minutes)
3. Your frontend is live at: `https://your-frontend-app.vercel.app`

### 5.5 Configure Custom Domain (Optional)

1. Go to your project > **Settings > Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions

---

## 6. ENVIRONMENT VARIABLES REFERENCE

### Frontend Variables (Vercel)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | YES | `https://abc123.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | YES | `eyJhbGciOiJIUzI1NiIs...` | Supabase anonymous/public key |
| `NEXT_PUBLIC_API_URL` | YES | `https://nexus-backend.onrender.com` | Backend API base URL |

### Backend Variables (Render)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `PORT` | YES | `5000` | Server port |
| `CLIENT_URL` | YES | `https://your-app.vercel.app` | Frontend URL for CORS |
| `SUPABASE_URL` | YES | `https://abc123.supabase.co` | Supabase project URL |
| `SUPABASE_ANON_KEY` | YES | `eyJhbGciOiJIUzI1NiIs...` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | YES | `eyJhbGciOiJIUzI1NiIs...` | Supabase service role key (SECRET) |
| `RAZORPAY_KEY_ID` | YES | `rzp_test_xxxxxxxxxxxx` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | YES | `xxxxxxxxxxxxxxxx` | Razorpay API key secret |

### Where to Find Each Credential

| Credential | Location |
|-----------|----------|
| Supabase URL | Supabase Dashboard > Settings > API > Project URL |
| Supabase Anon Key | Supabase Dashboard > Settings > API > anon (public) |
| Supabase Service Role Key | Supabase Dashboard > Settings > API > service_role |
| Razorpay Key ID | Razorpay Dashboard > Settings > API Keys > Key ID |
| Razorpay Key Secret | Razorpay Dashboard > Settings > API Keys > Key Secret |

---

## 7. POST-DEPLOYMENT CHECKLIST

### Backend Verification

- [ ] Visit `https://nexus-backend.onrender.com/api/health` - should return `{"status":"ok"}`
- [ ] Test registration: `POST /api/auth/register` with `{"email":"test@test.com","password":"test123","full_name":"Test User","role":"freelancer"}`
- [ ] Test login: `POST /api/auth/login` with credentials
- [ ] Test profiles: `GET /api/profiles`

### Frontend Verification

- [ ] Visit `https://your-app.vercel.app` - should load landing page
- [ ] Click "Get Started" - should go to register page
- [ ] Register a new account - should redirect to dashboard
- [ ] Check email for confirmation link (if email confirmations enabled)
- [ ] Login and verify dashboard loads
- [ ] Test navigation to marketplace, projects, chat

### Supabase Verification

- [ ] Go to Supabase Dashboard > Table Editor > profiles - should show new user
- [ ] Check Authentication > Users - should show registered user
- [ ] Verify RLS policies are active (green shield icons)

### Integration Verification

- [ ] Login works end-to-end (Supabase Auth)
- [ ] Profile data loads from Supabase
- [ ] Can create a project
- [ ] Can submit a proposal
- [ ] Chat/messaging connects via Socket.IO
- [ ] Payment flow works (Razorpay test mode)

---

## 8. TROUBLESHOOTING

### Common Issues

**CORS Error on Frontend**
```
Access to fetch blocked by CORS policy
```
- Fix: Ensure `CLIENT_URL` in Render backend env is exactly `https://your-app.vercel.app` (no trailing slash)
- Fix: Redeploy backend after changing env vars

**Supabase Auth Error: "Invalid login credentials"**
- Fix: Check that email/password are correct
- Fix: Check if email confirmations are required (user must confirm email first)
- Fix: In Supabase Dashboard > Auth > Settings, temporarily disable "Confirm email" for testing

**Socket.IO Connection Failed**
- Fix: Ensure `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Fix: Check Render logs for Socket.IO errors
- Fix: Ensure backend is not sleeping (free tier)

**Build Failure on Vercel**
- Fix: Check build logs for missing dependencies
- Fix: Ensure `package.json` is in the root of the specified directory
- Fix: Run `npm install` locally first to verify no issues

**Build Failure on Render**
- Fix: Check build logs
- Fix: Ensure `node_modules` is not committed (check `.gitignore`)
- Fix: Verify Node.js version compatibility (project uses Node 18+)

**Database Connection Issues**
- Fix: Verify Supabase credentials are correct
- Fix: Check if Supabase project is paused (free tier pauses after 7 days of inactivity)
- Fix: Visit Supabase dashboard and click "Restore" if paused

**"Module not found" Error on Render**
- Fix: Ensure `npm install` is in the build command
- Fix: Check that all dependencies are in `package.json`

### Viewing Logs

**Render Logs:**
1. Go to Render Dashboard > your service > Logs
2. Check both Build Logs and Runtime Logs

**Vercel Logs:**
1. Go to Vercel Dashboard > your project > Logs
2. Check both Build Logs and Runtime Logs

**Supabase Logs:**
1. Go to Supabase Dashboard > Logs (left sidebar)
2. Check API logs and Auth logs

---

## 9. COMPLETE ENVIRONMENT VARIABLES SUMMARY

### Frontend (.env.local for local / Vercel env vars for production)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=https://nexus-backend.onrender.com
```

### Backend (.env for local / Render env vars for production)

```env
PORT=5000
CLIENT_URL=https://your-app.vercel.app
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

---

## 10. COST ESTIMATE (FREE TIERS)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Vercel | Hobby Plan | 100GB bandwidth/month, 1000 build minutes |
| Render | Free Tier | 750 hours/month, spins down after 15min |
| Supabase | Free Tier | 500MB database, 1GB file storage, 50K MAU |
| Razorpay | Pay-as-you-go | 2% per transaction (test mode is free) |

**Total Monthly Cost: $0** (using all free tiers)

---

## 11. PRODUCTION RECOMMENDATIONS

1. **Upgrade Render** to Starter plan ($7/month) to prevent sleep
2. **Set up UptimeRobot** (free) to ping your backend every 5 minutes
3. **Enable Supabase email confirmations** in production
4. **Switch Razorpay to Live Mode** when ready for real payments
5. **Add a custom domain** to Vercel for professional branding
6. **Set up Vercel Analytics** for performance monitoring
7. **Enable Supabase Point-in-Time Recovery** for database backups
8. **Add rate limiting** to backend API routes
9. **Set up error tracking** (Sentry, etc.)
10. **Configure proper CORS** with specific origins (not wildcards)

---

*Generated for the Nexus Platform - Last updated: June 2026*
