-- ═══════════════════════════════════════════
-- NEXUS — Assign demo data to real users
-- Run AFTER seed.sql
-- ═══════════════════════════════════════════

-- 1. Find all real (non-demo) users
SELECT id, email, raw_user_meta_data->>'full_name' AS name FROM auth.users WHERE email NOT LIKE '%@demo.nexus';

-- 2. Mark onboarding as complete for ALL non-demo users
UPDATE public.profiles
SET onboarding_complete = true, onboarding_step = 5, verified_email = true
WHERE id NOT IN ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000010')
  AND onboarding_complete = false;

-- 3. Make real users see open projects (already works via RLS)
-- No change needed — RLS policy allows SELECT on open projects

-- 4. If you want a specific user to see as a client, uncomment and replace UUID:
-- UPDATE public.projects SET client_id = 'PASTE_YOUR_UUID_HERE'
-- WHERE id IN ('b0000000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000002');

-- 5. If you want a specific user to see as a freelancer, uncomment and replace UUID:
-- INSERT INTO public.proposals (project_id, freelancer_id, cover_letter, bid_amount, timeline, status)
-- SELECT id, 'PASTE_YOUR_UUID_HERE', 'Interested in this project.', 5000, '1 month', 'pending'
-- FROM public.projects WHERE status = 'open' LIMIT 3;
