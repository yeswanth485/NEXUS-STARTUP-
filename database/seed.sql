-- ═══════════════════════════════════════════
-- NEXUS PLATFORM — SEED DATA
-- Run AFTER schema.sql
-- ═══════════════════════════════════════════

-- Seed profiles (use fixed UUIDs for demo)
INSERT INTO public.profiles (id, role, full_name, title, bio, avatar_url, hourly_rate, skills, rating, rating_count, jobs_completed, job_success_rate, is_available, verified_email, verified_phone, verified_identity, total_earned, balance, onboarding_complete, company_name, experience_years, timezone, languages, elevator_pitch) VALUES
  ('00000000-0000-0000-0000-000000000001', 'freelancer', 'Alex Rivera', 'Full-Stack Developer', 'Building quality web apps with React, Node, and AI integration. 5+ years experience.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', 85, ARRAY['React','Node.js','TypeScript','AI/ML','PostgreSQL'], 4.9, 24, 47, 98, true, true, true, true, 185000, 3200, true, '', 5, 'PST', ARRAY['English','Spanish'], ''),
  ('00000000-0000-0000-0000-000000000002', 'freelancer', 'Sarah Chen', 'UI/UX Designer', 'Designing beautiful, user-centered interfaces for web and mobile apps.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', 90, ARRAY['Figma','UI Design','UX Research','Prototyping','Design Systems'], 4.8, 18, 35, 97, true, true, true, false, 142000, 1800, true, '', 4, 'EST', ARRAY['English','Mandarin'], ''),
  ('00000000-0000-0000-0000-000000000003', 'freelancer', 'Marcus Johnson', 'AI/ML Engineer', 'Specializing in LLMs, computer vision, and production ML pipelines.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', 120, ARRAY['Python','TensorFlow','PyTorch','LLMs','Computer Vision'], 4.9, 12, 28, 100, true, true, true, true, 210000, 5600, true, '', 7, 'EST', ARRAY['English'], ''),
  ('00000000-0000-0000-0000-000000000004', 'freelancer', 'Priya Patel', 'Blockchain Developer', 'Smart contracts, dApps, DeFi protocols. Solidity and Rust expert.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', 110, ARRAY['Solidity','Rust','Web3','React','Node.js'], 4.7, 9, 19, 95, false, true, false, true, 168000, 4100, true, '', 3, 'IST', ARRAY['English','Hindi'], ''),
  ('00000000-0000-0000-0000-000000000005', 'freelancer', 'James Wilson', 'Mobile Developer', 'React Native and Flutter expert. 30+ apps on App Store and Play Store.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', 95, ARRAY['React Native','Flutter','TypeScript','Firebase','Swift'], 4.8, 15, 31, 96, true, true, true, true, 175000, 2900, true, '', 6, 'GMT', ARRAY['English'], ''),
  ('00000000-0000-0000-0000-000000000006', 'freelancer', 'Luna Martinez', 'DevOps Engineer', 'Cloud infrastructure, CI/CD, Kubernetes, and site reliability.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna', 100, ARRAY['AWS','Kubernetes','Docker','Terraform','CI/CD'], 4.6, 7, 14, 93, true, true, false, true, 98000, 1500, true, '', 4, 'PST', ARRAY['English','Spanish'], ''),
  ('00000000-0000-0000-0000-000000000007', 'freelancer', 'Ethan Brooks', 'Digital Marketing Expert', 'SEO, SEM, content marketing, and growth strategy for SaaS startups.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan', 75, ARRAY['SEO','SEM','Content Marketing','Analytics','Growth'], 4.7, 21, 42, 97, true, true, true, false, 130000, 2200, true, '', 6, 'EST', ARRAY['English'], ''),
  ('00000000-0000-0000-0000-000000000008', 'freelancer', 'Maya Singh', 'Data Scientist', 'Data analysis, visualization, and predictive modeling. Python and R expert.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya', 95, ARRAY['Python','R','SQL','Tableau','Machine Learning'], 4.8, 11, 23, 98, true, true, true, true, 145000, 3800, true, '', 5, 'IST', ARRAY['English','Hindi'], ''),
  ('00000000-0000-0000-0000-000000000009', 'client', 'Sarah Mitchell', 'CTO at TechVentures', 'Building the future of edtech. Looking for top-tier talent.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechVentures', 0, ARRAY['React','Python','AI'], 5.0, 3, 0, 100, true, true, true, true, 0, 50000, true, 'TechVentures Inc', 0, '', '{}', ''),
  ('00000000-0000-0000-0000-000000000010', 'startup', 'David Park', 'CEO & Founder', 'AI-powered analytics platform for e-commerce.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=NovaAI', 0, ARRAY['AI','ML','SaaS'], 4.5, 2, 0, 100, true, true, true, true, 0, 100000, true, 'Nova AI', 0, '', '{}', 'We help online retailers make data-driven decisions with cutting-edge AI.');

-- Companies
INSERT INTO public.companies (id, owner_id, name, slug, tagline, description, industry, company_size, location, founded_year, is_hiring) VALUES
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Nova AI', 'nova-ai', 'AI-powered analytics for e-commerce', 'We help online retailers make data-driven decisions with cutting-edge AI.', 'AI/ML', '11-50', 'San Francisco, CA', 2022, true);

-- Company members
INSERT INTO public.company_members (company_id, user_id, role, title) VALUES
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'owner', 'CEO & Founder');

-- Projects
INSERT INTO public.projects (id, client_id, title, description, category, budget_min, budget_max, timeline, experience_level, project_type, skills_required, status, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000009', 'E-Learning Platform Dashboard', 'Build a comprehensive analytics dashboard for our edtech platform. Must handle real-time data visualization and user progress tracking.', 'Web Dev', 15000, 30000, '3 months', 'expert', 'fixed', ARRAY['React','D3.js','Node.js','PostgreSQL','WebSockets'], 'open', now() - interval '2 days'),
  ('b0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000009', 'Mobile App UI Redesign', 'Complete UI/UX overhaul of our mobile learning app. Need modern, accessible design system.', 'Design', 8000, 15000, '2 months', 'intermediate', 'fixed', ARRAY['Figma','UI Design','Mobile Design','Design Systems'], 'open', now() - interval '5 days'),
  ('b0000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000010', 'AI Chatbot Integration', 'Integrate GPT-4 powered chatbot into our analytics platform for natural language querying.', 'AI/ML', 20000, 40000, '2 months', 'expert', 'fixed', ARRAY['Python','GPT-4','LangChain','FastAPI','React'], 'open', now() - interval '1 day'),
  ('b0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000009', 'Social Media Marketing Campaign', 'Run a 3-month social media campaign targeting Gen Z students for our edtech platform.', 'Marketing', 5000, 10000, '3 months', 'entry', 'hourly', ARRAY['TikTok','Instagram','SEO','Content Creation'], 'open', now() - interval '3 days'),
  ('b0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000009', 'SaaS Payment Integration', 'Implement subscription billing with Stripe, including tiered plans, coupons, and invoicing.', 'SaaS', 12000, 22000, '6 weeks', 'expert', 'fixed', ARRAY['Node.js','Stripe API','React','PostgreSQL','Redis'], 'open', now() - interval '7 days'),
  ('b0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000009', 'E-Commerce Recommendation Engine', 'Build ML-powered product recommendation system using collaborative filtering.', 'AI/ML', 25000, 45000, '4 months', 'expert', 'fixed', ARRAY['Python','TensorFlow','PostgreSQL','Redis','AWS'], 'open', now() - interval '1 day'),
  ('b0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000009', 'Cross-Platform Mobile App', 'Develop a cross-platform mobile app for course access, progress tracking, and community features.', 'Mobile', 20000, 35000, '4 months', 'expert', 'fixed', ARRAY['React Native','Firebase','TypeScript','Stripe','WebSockets'], 'open', now() - interval '4 days'),
  ('b0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000010', 'E-Commerce Analytics Dashboard', 'Build real-time analytics dashboard for e-commerce merchants with AI-driven insights.', 'Web Dev', 18000, 32000, '3 months', 'expert', 'fixed', ARRAY['React','D3.js','Python','PostgreSQL','WebSockets'], 'open', now() - interval '2 days'),
  ('b0000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000010', 'Brand Identity & Website', 'Create complete brand identity and marketing website for our AI analytics startup.', 'Design', 10000, 18000, '2 months', 'intermediate', 'fixed', ARRAY['Figma','Web Design','Brand Strategy','UI/UX'], 'open', now() - interval '6 days');

-- Proposals
INSERT INTO public.proposals (id, project_id, freelancer_id, cover_letter, bid_amount, timeline, status, created_at) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'I have built 3 similar analytics dashboards for edtech companies. My experience with D3.js and real-time data visualization makes me the perfect fit for this project.', 22000, '12 weeks', 'pending', now() - interval '1 day'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'While I am primarily a designer, I have worked on dashboard UI design that improved user engagement by 40%. Happy to collaborate with a developer.', 18000, '10 weeks', 'pending', now() - interval '12 hours'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000007', 'I have run successful social media campaigns for 4 edtech startups, achieving an average of 300% ROAS. I have a specific strategy for Gen Z engagement.', 7000, '3 months', 'viewed', now() - interval '2 days'),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 'Built recommendation systems processing 10M+ queries/day at my previous role at Amazon. TensorFlow and collaborative filtering are my specialties.', 35000, '12 weeks', 'pending', now() - interval '6 hours'),
  ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000005', 'I have published 8 cross-platform apps with React Native, including 2 education apps with 100K+ downloads each.', 28000, '14 weeks', 'pending', now() - interval '1 day'),
  ('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'Full-stack developer with e-commerce analytics experience. Built similar dashboards handling 1M+ events/day.', 25000, '10 weeks', 'pending', now() - interval '8 hours');

-- Conversations
INSERT INTO public.conversations (id, participant_ids, project_id, last_message, last_message_at, unread_counts) VALUES
  ('d0000000-0000-0000-0000-000000000001', ARRAY['00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001'], 'b0000000-0000-0000-0000-000000000001', 'Sounds good, lets start next week!', now() - interval '3 hours', '{"00000000-0000-0000-0000-000000000001": 0, "00000000-0000-0000-0000-000000000009": 1}'),
  ('d0000000-0000-0000-0000-000000000002', ARRAY['00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003'], 'b0000000-0000-0000-0000-000000000010', 'Can you share some examples of your chatbot work?', now() - interval '1 hour', '{"00000000-0000-0000-0000-000000000003": 1, "00000000-0000-0000-0000-000000000010": 0}'),
  ('d0000000-0000-0000-0000-000000000003', ARRAY['00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000007'], 'b0000000-0000-0000-0000-000000000004', 'Great proposal! Lets schedule a call.', now() - interval '1 day', '{"00000000-0000-0000-0000-000000000007": 0, "00000000-0000-0000-0000-000000000009": 1}');

-- Messages
INSERT INTO public.messages (id, conversation_id, sender_id, content, created_at) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Hi! I saw your project and I am very interested.', now() - interval '5 hours'),
  ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000009', 'Great! Your portfolio looks impressive.', now() - interval '4 hours'),
  ('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Thank you! I have attached some similar projects I have worked on.', now() - interval '3.5 hours'),
  ('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000009', 'Sounds good, lets start next week!', now() - interval '3 hours'),
  ('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Hello! I specialize in GPT-4 and LangChain integrations.', now() - interval '2 hours'),
  ('e0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Can you share some examples of your chatbot work?', now() - interval '1 hour'),
  ('e0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007', 'I have a detailed strategy document ready for your review.', now() - interval '2 days'),
  ('e0000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000009', 'Great proposal! Lets schedule a call.', now() - interval '1 day');

-- Notifications
INSERT INTO public.notifications (user_id, type, title, body, link, created_at) VALUES
  ('00000000-0000-0000-0000-000000000009', 'proposal', 'New Proposal Received', 'Alex Rivera submitted a proposal for "E-Learning Platform Dashboard"', '/dashboard?tab=proposals', now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000009', 'proposal', 'New Proposal Received', 'Sarah Chen submitted a proposal for "E-Learning Platform Dashboard"', '/dashboard?tab=proposals', now() - interval '12 hours'),
  ('00000000-0000-0000-0000-000000000010', 'proposal', 'New Proposal Received', 'Alex Rivera submitted a proposal for "E-Commerce Analytics Dashboard"', '/dashboard?tab=proposals', now() - interval '8 hours'),
  ('00000000-0000-0000-0000-000000000001', 'message', 'New Message', 'TechVentures Inc sent you a message', '/chat', now() - interval '4 hours'),
  ('00000000-0000-0000-0000-000000000007', 'message', 'New Message', 'TechVentures Inc sent you a message', '/chat', now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000003', 'message', 'New Message', 'Nova AI sent you a message', '/chat', now() - interval '1 hour'),
  ('00000000-0000-0000-0000-000000000009', 'system', 'Profile Views Milestone', 'Your project has received 50+ views!', '/marketplace', now() - interval '2 days');

-- Reviews
INSERT INTO public.reviews (contract_id, reviewer_id, reviewee_id, rating, comment, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', 5, 'Excellent work! Delivered ahead of schedule and exceeded expectations.', now() - interval '30 days');

-- User settings (auto-created by trigger, but seed for demo)
INSERT INTO public.user_settings (id) VALUES
  ('00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0000-000000000005'),
  ('00000000-0000-0000-0000-000000000006'),
  ('00000000-0000-0000-0000-000000000007'),
  ('00000000-0000-0000-0000-000000000008'),
  ('00000000-0000-0000-0000-000000000009'),
  ('00000000-0000-0000-0000-000000000010')
ON CONFLICT DO NOTHING;

-- Team members
INSERT INTO public.team_members (startup_id, name, role, bio, linkedin_url, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000010', 'David Park', 'CEO & Founder', 'Former ML engineer at Google. Building the future of e-commerce analytics.', 'https://linkedin.com/in/davidpark', 0),
  ('00000000-0000-0000-0000-000000000010', 'Lisa Kim', 'CTO', 'Full-stack engineer with 8 years of experience in data-intensive applications.', 'https://linkedin.com/in/lisakim', 1),
  ('00000000-0000-0000-0000-000000000010', 'Mike Torres', 'Head of Design', 'Product designer who has worked with 10+ YC startups on their UX.', 'https://linkedin.com/in/miketorres', 2);

-- Portfolio items
INSERT INTO public.portfolio_items (freelancer_id, title, description, emoji, tags, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'E-Commerce Dashboard', 'Real-time analytics dashboard for a major e-commerce platform handling 1M+ daily events.', '📊', ARRAY['React','D3.js','Node.js','WebSockets'], now() - interval '60 days'),
  ('00000000-0000-0000-0000-000000000001', 'AI Chat Platform', 'Full-stack chat platform with AI-powered responses and real-time messaging.', '🤖', ARRAY['React','Python','WebSockets','AI'], now() - interval '45 days'),
  ('00000000-0000-0000-0000-000000000002', 'FinTech App Design', 'Complete design system and UI for a mobile banking application.', '🎨', ARRAY['Figma','Design System','Mobile'], now() - interval '30 days'),
  ('00000000-0000-0000-0000-000000000003', 'Recommendation Engine', 'ML-based recommendation system processing 10M+ queries per day.', '🧠', ARRAY['Python','TensorFlow','MLOps'], now() - interval '90 days'),
  ('00000000-0000-0000-0000-000000000005', 'Health Tracking App', 'Cross-platform mobile app for health and fitness tracking with 100K+ downloads.', '📱', ARRAY['React Native','Firebase','HealthKit'], now() - interval '45 days');
