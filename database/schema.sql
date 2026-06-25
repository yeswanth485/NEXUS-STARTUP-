-- ═══════════════════════════════════════════
-- NEXUS PLATFORM — FULL DATABASE SCHEMA
-- Safe to re-run: drops existing objects first
-- ═══════════════════════════════════════════

-- DROP existing triggers (order matters - drop triggers before functions)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trg_startup_company ON public.profiles;
DROP TRIGGER IF EXISTS trg_company_owner ON public.companies;
DROP TRIGGER IF EXISTS trg_proposal_count ON public.proposals;
DROP TRIGGER IF EXISTS trg_update_rating ON public.reviews;
DROP TRIGGER IF EXISTS trg_profiles_updated ON public.profiles;
DROP TRIGGER IF EXISTS trg_projects_updated ON public.projects;
DROP TRIGGER IF EXISTS trg_contracts_updated ON public.contracts;
DROP TRIGGER IF EXISTS trg_milestones_updated ON public.milestones;
DROP TRIGGER IF EXISTS trg_companies_updated ON public.companies;

-- DROP existing functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS handle_startup_company();
DROP FUNCTION IF EXISTS handle_company_owner();
DROP FUNCTION IF EXISTS update_proposals_count();
DROP FUNCTION IF EXISTS update_profile_rating();
DROP FUNCTION IF EXISTS update_updated_at();

-- DROP existing policies (skip if error)
DO $$ BEGIN DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "profiles_self_update" ON public.profiles; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "companies_public_read" ON public.companies; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "companies_owner_insert" ON public.companies; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "companies_owner_update" ON public.companies; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "companies_owner_delete" ON public.companies; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "cm_self_read" ON public.company_members; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "cm_company_insert" ON public.company_members; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "cm_self_delete" ON public.company_members; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "cm_admin_update" ON public.company_members; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "cp_public_read" ON public.company_portfolio; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "cp_member_write" ON public.company_portfolio; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "projects_public_read" ON public.projects; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "projects_client_insert" ON public.projects; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "projects_client_update" ON public.projects; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "proposals_freelancer_read" ON public.proposals; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "proposals_client_read" ON public.proposals; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "proposals_insert" ON public.proposals; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "proposals_update_freelancer" ON public.proposals; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "proposals_update_client" ON public.proposals; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "contracts_parties_read" ON public.contracts; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "contracts_client_insert" ON public.contracts; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "contracts_parties_update" ON public.contracts; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "milestones_parties_read" ON public.milestones; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "milestones_client_insert" ON public.milestones; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "milestones_parties_update" ON public.milestones; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "conversations_participants" ON public.conversations; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "messages_participants" ON public.messages; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "reviews_public_read" ON public.reviews; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "reviews_insert" ON public.reviews; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "portfolio_public_read" ON public.portfolio_items; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "portfolio_owner_write" ON public.portfolio_items; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "kanban_parties" ON public.kanban_tasks; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS "notifications_self" ON public.notifications; EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- DROP existing tables (reverse dependency order)
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.kanban_tasks CASCADE;
DROP TABLE IF EXISTS public.portfolio_items CASCADE;
DROP TABLE IF EXISTS public.company_portfolio CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.milestones CASCADE;
DROP TABLE IF EXISTS public.contracts CASCADE;
DROP TABLE IF EXISTS public.proposals CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.company_members CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ═══════════════════════════════════════════
-- CREATE TABLES
-- ═══════════════════════════════════════════

-- 1. PROFILES (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('client','freelancer','startup')),
  full_name TEXT NOT NULL DEFAULT '',
  title TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  hourly_rate NUMERIC DEFAULT 0,
  skills TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT 0,
  rating_count INT DEFAULT 0,
  jobs_completed INT DEFAULT 0,
  job_success_rate NUMERIC DEFAULT 100,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free','professional','business','enterprise')),
  is_available BOOLEAN DEFAULT true,
  verified_email BOOLEAN DEFAULT false,
  verified_phone BOOLEAN DEFAULT false,
  verified_identity BOOLEAN DEFAULT false,
  linkedin_url TEXT DEFAULT '',
  total_earned NUMERIC DEFAULT 0,
  balance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. COMPANIES (separate company profiles)
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  website TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  company_size TEXT DEFAULT '' CHECK (company_size IN ('1-10','11-50','51-200','201-500','500+','')),
  location TEXT DEFAULT '',
  founded_year INT,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  social_linkedin TEXT DEFAULT '',
  social_twitter TEXT DEFAULT '',
  social_github TEXT DEFAULT '',
  is_verified BOOLEAN DEFAULT false,
  is_hiring BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. COMPANY MEMBERS (users linked to companies)
CREATE TABLE public.company_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','member')),
  title TEXT DEFAULT '',
  department TEXT DEFAULT '',
  is_public BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, user_id)
);

-- 4. PROJECTS
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Web Dev','Mobile','AI/ML','Design','Marketing','SaaS','E-Commerce')),
  budget_min NUMERIC NOT NULL DEFAULT 0,
  budget_max NUMERIC NOT NULL DEFAULT 0,
  timeline TEXT NOT NULL DEFAULT '1 month',
  experience_level TEXT DEFAULT 'intermediate' CHECK (experience_level IN ('entry','intermediate','expert')),
  project_type TEXT DEFAULT 'fixed' CHECK (project_type IN ('fixed','hourly')),
  skills_required TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','review','completed','cancelled')),
  proposals_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. PROPOSALS
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT NOT NULL,
  bid_amount NUMERIC NOT NULL,
  timeline TEXT NOT NULL,
  portfolio_link TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','viewed','accepted','rejected','withdrawn')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, freelancer_id)
);

-- 6. CONTRACTS
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC NOT NULL DEFAULT 0,
  in_escrow NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','paused','completed','cancelled')),
  progress INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. MILESTONES
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  amount NUMERIC NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','funded','in_progress','submitted','approved','released','disputed')),
  razorpay_order_id TEXT DEFAULT '',
  razorpay_payment_id TEXT DEFAULT '',
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. CONVERSATIONS
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_ids UUID[] NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  last_message TEXT DEFAULT '',
  last_message_at TIMESTAMPTZ DEFAULT now(),
  unread_counts JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. MESSAGES
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  attachment_url TEXT DEFAULT '',
  attachment_name TEXT DEFAULT '',
  read_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(contract_id, reviewer_id)
);

-- 11. PORTFOLIO ITEMS
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  project_url TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  emoji TEXT DEFAULT '🖼️',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. COMPANY PORTFOLIO
CREATE TABLE public.company_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  project_url TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  completion_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. KANBAN TASKS
CREATE TABLE public.kanban_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  column_name TEXT DEFAULT 'backlog' CHECK (column_name IN ('backlog','in_progress','review','completed')),
  tags TEXT[] DEFAULT '{}',
  due_date DATE,
  position INT DEFAULT 0,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT DEFAULT '',
  link TEXT DEFAULT '',
  read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════
CREATE INDEX idx_projects_client ON public.projects(client_id);
CREATE INDEX idx_projects_company ON public.projects(company_id);
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_proposals_project ON public.proposals(project_id);
CREATE INDEX idx_proposals_freelancer ON public.proposals(freelancer_id);
CREATE INDEX idx_contracts_client ON public.contracts(client_id);
CREATE INDEX idx_contracts_freelancer ON public.contracts(freelancer_id);
CREATE INDEX idx_milestones_contract ON public.milestones(contract_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read);
CREATE INDEX idx_companies_owner ON public.companies(owner_id);
CREATE INDEX idx_companies_slug ON public.companies(slug);
CREATE INDEX idx_companies_industry ON public.companies(industry);
CREATE INDEX idx_company_members_company ON public.company_members(company_id);
CREATE INDEX idx_company_members_user ON public.company_members(user_id);
CREATE INDEX idx_company_portfolio_company ON public.company_portfolio(company_id);

-- ═══════════════════════════════════════════
-- FUNCTIONS
-- ═══════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, verified_email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email_confirmed_at IS NOT NULL,
    COALESCE(NEW.raw_user_meta_data->>'role', 'freelancer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION handle_startup_company()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'startup' THEN
    INSERT INTO public.companies (owner_id, name, slug, tagline)
    VALUES (
      NEW.id,
      COALESCE(NEW.full_name, 'My Startup'),
      LOWER(REPLACE(COALESCE(NEW.full_name, 'startup'), ' ', '-')) || '-' || SUBSTR(NEW.id::TEXT, 1, 8),
      'We are building something amazing.'
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION handle_company_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.company_members (company_id, user_id, role, title)
  VALUES (NEW.id, NEW.owner_id, 'owner', 'Owner')
  ON CONFLICT (company_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_proposals_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.projects SET proposals_count = proposals_count + 1 WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.projects SET proposals_count = proposals_count - 1 WHERE id = OLD.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    rating = (SELECT AVG(rating) FROM public.reviews WHERE reviewee_id = NEW.reviewee_id),
    rating_count = (SELECT COUNT(*) FROM public.reviews WHERE reviewee_id = NEW.reviewee_id)
  WHERE id = NEW.reviewee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_contracts_updated BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_milestones_updated BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_companies_updated BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER trg_startup_company
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION handle_startup_company();

CREATE TRIGGER trg_company_owner
  AFTER INSERT ON public.companies
  FOR EACH ROW EXECUTE FUNCTION handle_company_owner();

CREATE TRIGGER trg_proposal_count
  AFTER INSERT OR DELETE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION update_proposals_count();

CREATE TRIGGER trg_update_rating
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_profile_rating();

-- ═══════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- COMPANIES
CREATE POLICY "companies_public_read" ON public.companies FOR SELECT USING (status = 'active' OR owner_id = auth.uid());
CREATE POLICY "companies_owner_insert" ON public.companies FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "companies_owner_update" ON public.companies FOR UPDATE USING (
  auth.uid() = owner_id OR
  auth.uid() IN (SELECT user_id FROM public.company_members WHERE company_id = id AND role IN ('owner', 'admin'))
);
CREATE POLICY "companies_owner_delete" ON public.companies FOR DELETE USING (auth.uid() = owner_id);

-- COMPANY MEMBERS
CREATE POLICY "cm_self_read" ON public.company_members FOR SELECT USING (
  user_id = auth.uid() OR
  company_id IN (SELECT company_id FROM public.company_members WHERE user_id = auth.uid())
);
CREATE POLICY "cm_company_insert" ON public.company_members FOR INSERT WITH CHECK (
  company_id IN (SELECT company_id FROM public.company_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);
CREATE POLICY "cm_self_delete" ON public.company_members FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "cm_admin_update" ON public.company_members FOR UPDATE USING (
  company_id IN (SELECT company_id FROM public.company_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);

-- COMPANY PORTFOLIO
CREATE POLICY "cp_public_read" ON public.company_portfolio FOR SELECT USING (
  company_id IN (SELECT id FROM public.companies WHERE status = 'active')
);
CREATE POLICY "cp_member_write" ON public.company_portfolio FOR ALL USING (
  company_id IN (SELECT company_id FROM public.company_members WHERE user_id = auth.uid())
);

-- PROJECTS
CREATE POLICY "projects_public_read" ON public.projects FOR SELECT USING (status = 'open' OR client_id = auth.uid());
CREATE POLICY "projects_client_insert" ON public.projects FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "projects_client_update" ON public.projects FOR UPDATE USING (auth.uid() = client_id);

-- PROPOSALS
CREATE POLICY "proposals_freelancer_read" ON public.proposals FOR SELECT USING (freelancer_id = auth.uid());
CREATE POLICY "proposals_client_read" ON public.proposals FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
);
CREATE POLICY "proposals_insert" ON public.proposals FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "proposals_update_freelancer" ON public.proposals FOR UPDATE USING (freelancer_id = auth.uid());
CREATE POLICY "proposals_update_client" ON public.proposals FOR UPDATE USING (
  project_id IN (SELECT id FROM public.projects WHERE client_id = auth.uid())
);

-- CONTRACTS
CREATE POLICY "contracts_parties_read" ON public.contracts FOR SELECT USING (client_id = auth.uid() OR freelancer_id = auth.uid());
CREATE POLICY "contracts_client_insert" ON public.contracts FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "contracts_parties_update" ON public.contracts FOR UPDATE USING (client_id = auth.uid() OR freelancer_id = auth.uid());

-- MILESTONES
CREATE POLICY "milestones_parties_read" ON public.milestones FOR SELECT USING (
  contract_id IN (SELECT id FROM public.contracts WHERE client_id = auth.uid() OR freelancer_id = auth.uid())
);
CREATE POLICY "milestones_client_insert" ON public.milestones FOR INSERT WITH CHECK (
  contract_id IN (SELECT id FROM public.contracts WHERE client_id = auth.uid())
);
CREATE POLICY "milestones_parties_update" ON public.milestones FOR UPDATE USING (
  contract_id IN (SELECT id FROM public.contracts WHERE client_id = auth.uid() OR freelancer_id = auth.uid())
);

-- CONVERSATIONS
CREATE POLICY "conversations_participants" ON public.conversations FOR ALL USING (auth.uid() = ANY(participant_ids));

-- MESSAGES
CREATE POLICY "messages_participants" ON public.messages FOR ALL USING (
  conversation_id IN (SELECT id FROM public.conversations WHERE auth.uid() = ANY(participant_ids))
);

-- REVIEWS
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- PORTFOLIO
CREATE POLICY "portfolio_public_read" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "portfolio_owner_write" ON public.portfolio_items FOR ALL USING (auth.uid() = freelancer_id);

-- KANBAN
CREATE POLICY "kanban_parties" ON public.kanban_tasks FOR ALL USING (
  contract_id IN (SELECT id FROM public.contracts WHERE client_id = auth.uid() OR freelancer_id = auth.uid())
);

-- NOTIFICATIONS
CREATE POLICY "notifications_self" ON public.notifications FOR ALL USING (auth.uid() = user_id);
