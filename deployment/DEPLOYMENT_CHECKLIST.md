# NEXUS DEPLOYMENT CHECKLIST
# ==========================
# Follow this order for a smooth deployment

## Phase 1: Supabase (Do First)
- [ ] Create Supabase project at https://supabase.com
- [ ] Copy Project URL, Anon Key, Service Role Key
- [ ] Go to SQL Editor, paste database/schema.sql, run it
- [ ] Verify 14 tables created in Table Editor
- [ ] Go to Auth > URL Configuration, add redirect URLs
- [ ] Enable Storage buckets (avatars, portfolio) if needed

## Phase 2: Razorpay
- [ ] Create Razorpay account at https://razorpay.com
- [ ] Get Test Mode API keys (Key ID + Key Secret)
- [ ] Note: Switch to Live Mode later for production

## Phase 3: Backend (Render)
- [ ] Push code to GitHub
- [ ] Create Web Service on Render
- [ ] Set Root Directory to "backend"
- [ ] Set Build Command: npm install
- [ ] Set Start Command: node src/index.js
- [ ] Add all 7 environment variables
- [ ] Deploy and verify /api/health endpoint works

## Phase 4: Frontend (Vercel)
- [ ] Create Project on Vercel
- [ ] Set Root Directory to "frontend" (or "./" if separate repo)
- [ ] Add all 3 environment variables
- [ ] Deploy and verify site loads
- [ ] Test registration and login flow

## Phase 5: Integration Testing
- [ ] Register a new user
- [ ] Login works
- [ ] Dashboard loads profile data
- [ ] Can create a project
- [ ] Can browse marketplace
- [ ] Chat connects via Socket.IO
- [ ] Payment flow works in test mode

## Phase 6: Production Polish
- [ ] Update CLIENT_URL to production frontend URL
- [ ] Update NEXT_PUBLIC_API_URL to production backend URL
- [ ] Switch Razorpay to Live Mode keys
- [ ] Enable Supabase email confirmations
- [ ] Add custom domain to Vercel
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Test complete user flow end-to-end
