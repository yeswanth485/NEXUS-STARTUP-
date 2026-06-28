/**
 * Nexus Platform — Seed Script
 * Usage: node database/seed.js
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DEMO_USERS = [
  { email: 'alex@demo.nexus', password: 'Demo123!', full_name: 'Alex Rivera', role: 'freelancer', title: 'Full-Stack Developer', bio: 'Building quality web apps with React, Node, and AI integration. 5+ years experience.', hourly_rate: 85, skills: ['React','Node.js','TypeScript','AI/ML','PostgreSQL'], rating: 4.9, rating_count: 24, jobs_completed: 47, job_success_rate: 98, location: 'San Francisco', experience_years: 5, timezone: 'PST', languages: ['English','Spanish'], is_available: true },
  { email: 'sarah@demo.nexus', password: 'Demo123!', full_name: 'Sarah Chen', role: 'freelancer', title: 'UI/UX Designer', bio: 'Designing beautiful, user-centered interfaces for web and mobile apps.', hourly_rate: 90, skills: ['Figma','UI Design','UX Research','Prototyping','Design Systems'], rating: 4.8, rating_count: 18, jobs_completed: 35, job_success_rate: 97, location: 'New York', experience_years: 4, timezone: 'EST', languages: ['English','Mandarin'], is_available: true },
  { email: 'marcus@demo.nexus', password: 'Demo123!', full_name: 'Marcus Johnson', role: 'freelancer', title: 'AI/ML Engineer', bio: 'Specializing in LLMs, computer vision, and production ML pipelines.', hourly_rate: 120, skills: ['Python','TensorFlow','PyTorch','LLMs','Computer Vision'], rating: 4.9, rating_count: 12, jobs_completed: 28, job_success_rate: 100, location: 'Boston', experience_years: 7, timezone: 'EST', languages: ['English'], is_available: true },
  { email: 'priya@demo.nexus', password: 'Demo123!', full_name: 'Priya Patel', role: 'freelancer', title: 'Blockchain Developer', bio: 'Smart contracts, dApps, DeFi protocols. Solidity and Rust expert.', hourly_rate: 110, skills: ['Solidity','Rust','Web3','React','Node.js'], rating: 4.7, rating_count: 9, jobs_completed: 19, job_success_rate: 95, location: 'Bangalore', experience_years: 3, timezone: 'IST', languages: ['English','Hindi'], is_available: false },
  { email: 'james@demo.nexus', password: 'Demo123!', full_name: 'James Wilson', role: 'freelancer', title: 'Mobile Developer', bio: 'React Native and Flutter expert. 30+ apps on App Store and Play Store.', hourly_rate: 95, skills: ['React Native','Flutter','TypeScript','Firebase','Swift'], rating: 4.8, rating_count: 15, jobs_completed: 31, job_success_rate: 96, location: 'London', experience_years: 6, timezone: 'GMT', languages: ['English'], is_available: true },
  { email: 'luna@demo.nexus', password: 'Demo123!', full_name: 'Luna Martinez', role: 'freelancer', title: 'DevOps Engineer', bio: 'Cloud infrastructure, CI/CD, Kubernetes, and site reliability.', hourly_rate: 100, skills: ['AWS','Kubernetes','Docker','Terraform','CI/CD'], rating: 4.6, rating_count: 7, jobs_completed: 14, job_success_rate: 93, location: 'Austin', experience_years: 4, timezone: 'PST', languages: ['English','Spanish'], is_available: true },
  { email: 'ethan@demo.nexus', password: 'Demo123!', full_name: 'Ethan Brooks', role: 'freelancer', title: 'Digital Marketing Expert', bio: 'SEO, SEM, content marketing, and growth strategy for SaaS startups.', hourly_rate: 75, skills: ['SEO','SEM','Content Marketing','Analytics','Growth'], rating: 4.7, rating_count: 21, jobs_completed: 42, job_success_rate: 97, location: 'Chicago', experience_years: 6, timezone: 'EST', languages: ['English'], is_available: true },
  { email: 'maya@demo.nexus', password: 'Demo123!', full_name: 'Maya Singh', role: 'freelancer', title: 'Data Scientist', bio: 'Data analysis, visualization, and predictive modeling.', hourly_rate: 95, skills: ['Python','R','SQL','Tableau','Machine Learning'], rating: 4.8, rating_count: 11, jobs_completed: 23, job_success_rate: 98, location: 'Mumbai', experience_years: 5, timezone: 'IST', languages: ['English','Hindi'], is_available: true },
  { email: 'client@demo.nexus', password: 'Demo123!', full_name: 'Sarah Mitchell', role: 'client', title: 'CTO at TechVentures', bio: 'Building the future of edtech. Looking for top-tier talent.', company_name: 'TechVentures Inc', is_available: true },
  { email: 'startup@demo.nexus', password: 'Demo123!', full_name: 'David Park', role: 'startup', title: 'CEO & Founder', bio: 'AI-powered analytics platform for e-commerce.', company_name: 'Nova AI', elevator_pitch: 'We help online retailers make data-driven decisions with cutting-edge AI.', team_size: 12, is_available: true, skills: ['AI','ML','SaaS'] },
];

async function seed() {
  console.log('Creating demo users...\n');

  const profiles = [];

  for (const u of DEMO_USERS) {
    const { data: existing } = await supabase.auth.admin.listUsers();

    const exists = existing?.users?.find((eu: any) => eu.email === u.email);
    if (exists) {
      console.log(`  ${u.email} — already exists, skipping creation`);
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', exists.id).single();
      profiles.push({ id: exists.id, email: u.email, ...u });
      continue;
    }

    const { data: authUser, error } = await supabase.auth.admin.createUser({
      email: u.email, password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.full_name, role: u.role },
    });

    if (error) {
      console.error(`  ${u.email} — FAILED: ${error.message}`);
      continue;
    }

    console.log(`  ${u.email} — created (id: ${authUser.user.id})`);

    const updateData: any = {
      full_name: u.full_name,
      title: u.title || '',
      bio: u.bio || '',
      hourly_rate: u.hourly_rate || 0,
      skills: u.skills || [],
      rating: u.rating || 0,
      rating_count: u.rating_count || 0,
      jobs_completed: u.jobs_completed || 0,
      job_success_rate: u.job_success_rate || 100,
      is_available: u.is_available ?? true,
      experience_years: u.experience_years || 0,
      timezone: u.timezone || '',
      languages: u.languages || [],
      company_name: u.company_name || '',
      elevator_pitch: u.elevator_pitch || '',
      team_size: u.team_size || 1,
      onboarding_complete: true,
      onboarding_step: 5,
      verified_email: true,
    };

    const { error: updateErr } = await supabase.from('profiles').update(updateData).eq('id', authUser.user.id);
    if (updateErr) console.error(`  ${u.email} — profile update failed: ${updateErr.message}`);

    profiles.push({ id: authUser.user.id, email: u.email, ...u });
  }

  if (profiles.length < 3) {
    console.log('\nNot enough users created. Stopping.');
    return;
  }

  const idMap = (email: string) => profiles.find(p => p.email === email)?.id;
  const cId = idMap('client@demo.nexus');
  const sId = idMap('startup@demo.nexus');
  const f1 = idMap('alex@demo.nexus');
  const f2 = idMap('sarah@demo.nexus');
  const f3 = idMap('marcus@demo.nexus');
  const f4 = idMap('james@demo.nexus');
  const f5 = idMap('ethan@demo.nexus');
  const f6 = idMap('luna@demo.nexus');
  const f7 = idMap('priya@demo.nexus');
  const f8 = idMap('maya@demo.nexus');

  console.log('\nSeeding companies...');
  if (sId) {
    await supabase.from('companies').upsert({ id: 'a0000000-0000-0000-0000-000000000001', owner_id: sId, name: 'Nova AI', slug: 'nova-ai', tagline: 'AI-powered analytics for e-commerce', description: 'We help online retailers make data-driven decisions with cutting-edge AI.', industry: 'AI/ML', company_size: '11-50', location: 'San Francisco, CA', founded_year: 2022, is_hiring: true }).select();
    await supabase.from('company_members').upsert({ company_id: 'a0000000-0000-0000-0000-000000000001', user_id: sId, role: 'owner', title: 'CEO & Founder' });
    console.log('  Nova AI company created');
  }

  console.log('Seeding projects...');
  const projectData = [
    { id: 'b0000000-0000-0000-0000-000000000001', client_id: cId, title: 'E-Learning Platform Dashboard', description: 'Build a comprehensive analytics dashboard for our edtech platform.', category: 'Web Dev', budget_min: 15000, budget_max: 30000, timeline: '3 months', experience_level: 'expert', project_type: 'fixed', skills_required: ['React','D3.js','Node.js','PostgreSQL','WebSockets'] },
    { id: 'b0000000-0000-0000-0000-000000000002', client_id: cId, title: 'Mobile App UI Redesign', description: 'Complete UI/UX overhaul of our mobile learning app.', category: 'Design', budget_min: 8000, budget_max: 15000, timeline: '2 months', experience_level: 'intermediate', project_type: 'fixed', skills_required: ['Figma','UI Design','Mobile Design','Design Systems'] },
    { id: 'b0000000-0000-0000-0000-000000000010', client_id: sId, title: 'AI Chatbot Integration', description: 'Integrate GPT-4 powered chatbot into our analytics platform.', category: 'AI/ML', budget_min: 20000, budget_max: 40000, timeline: '2 months', experience_level: 'expert', project_type: 'fixed', skills_required: ['Python','GPT-4','LangChain','FastAPI','React'] },
    { id: 'b0000000-0000-0000-0000-000000000003', client_id: cId, title: 'Social Media Marketing Campaign', description: 'Run a 3-month social media campaign targeting Gen Z.', category: 'Marketing', budget_min: 5000, budget_max: 10000, timeline: '3 months', experience_level: 'entry', project_type: 'hourly', skills_required: ['TikTok','Instagram','SEO','Content Creation'] },
    { id: 'b0000000-0000-0000-0000-000000000004', client_id: cId, title: 'SaaS Payment Integration', description: 'Implement subscription billing with Stripe.', category: 'SaaS', budget_min: 12000, budget_max: 22000, timeline: '6 weeks', experience_level: 'expert', project_type: 'fixed', skills_required: ['Node.js','Stripe API','React','PostgreSQL','Redis'] },
    { id: 'b0000000-0000-0000-0000-000000000005', client_id: cId, title: 'E-Commerce Recommendation Engine', description: 'Build ML-powered product recommendation system.', category: 'AI/ML', budget_min: 25000, budget_max: 45000, timeline: '4 months', experience_level: 'expert', project_type: 'fixed', skills_required: ['Python','TensorFlow','PostgreSQL','Redis','AWS'] },
    { id: 'b0000000-0000-0000-0000-000000000006', client_id: cId, title: 'Cross-Platform Mobile App', description: 'Develop a cross-platform mobile app for course access.', category: 'Mobile', budget_min: 20000, budget_max: 35000, timeline: '4 months', experience_level: 'expert', project_type: 'fixed', skills_required: ['React Native','Firebase','TypeScript','Stripe','WebSockets'] },
    { id: 'b0000000-0000-0000-0000-000000000007', client_id: sId, title: 'E-Commerce Analytics Dashboard', description: 'Build real-time analytics dashboard for e-commerce merchants.', category: 'Web Dev', budget_min: 18000, budget_max: 32000, timeline: '3 months', experience_level: 'expert', project_type: 'fixed', skills_required: ['React','D3.js','Python','PostgreSQL','WebSockets'] },
    { id: 'b0000000-0000-0000-0000-000000000008', client_id: sId, title: 'Brand Identity & Website', description: 'Create complete brand identity and marketing website.', category: 'Design', budget_min: 10000, budget_max: 18000, timeline: '2 months', experience_level: 'intermediate', project_type: 'fixed', skills_required: ['Figma','Web Design','Brand Strategy','UI/UX'] },
  ];

  for (const p of projectData) {
    if (!p.client_id) continue;
    await supabase.from('projects').upsert(p).select();
  }
  console.log(`  ${projectData.filter(p => p.client_id).length} projects created`);

  console.log('Seeding proposals...');
  if (cId && f1) {
    await supabase.from('proposals').upsert({ project_id: 'b0000000-0000-0000-0000-000000000001', freelancer_id: f1, cover_letter: 'I have built 3 similar analytics dashboards for edtech companies.', bid_amount: 22000, timeline: '12 weeks', status: 'pending' });
  }
  if (cId && f2) {
    await supabase.from('proposals').upsert({ project_id: 'b0000000-0000-0000-0000-000000000001', freelancer_id: f2, cover_letter: 'While I am primarily a designer, I have worked on dashboard UI design.', bid_amount: 18000, timeline: '10 weeks', status: 'pending' });
  }
  if (cId && f5) {
    await supabase.from('proposals').upsert({ project_id: 'b0000000-0000-0000-0000-000000000004', freelancer_id: f5, cover_letter: 'I have run successful social media campaigns for 4 edtech startups.', bid_amount: 7000, timeline: '3 months', status: 'viewed' });
  }
  if (cId && f3) {
    await supabase.from('proposals').upsert({ project_id: 'b0000000-0000-0000-0000-000000000005', freelancer_id: f3, cover_letter: 'Built recommendation systems processing 10M+ queries/day.', bid_amount: 35000, timeline: '12 weeks', status: 'pending' });
  }
  if (cId && f4) {
    await supabase.from('proposals').upsert({ project_id: 'b0000000-0000-0000-0000-000000000006', freelancer_id: f4, cover_letter: 'I have published 8 cross-platform apps with React Native.', bid_amount: 28000, timeline: '14 weeks', status: 'pending' });
  }
  if (sId && f1) {
    await supabase.from('proposals').upsert({ project_id: 'b0000000-0000-0000-0000-000000000007', freelancer_id: f1, cover_letter: 'Full-stack developer with e-commerce analytics experience.', bid_amount: 25000, timeline: '10 weeks', status: 'pending' });
  }
  console.log('  6 proposals created');

  console.log('Seeding conversations & messages...');
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
  const conv1 = { participant_ids: [cId, f1].sort(), project_id: 'b0000000-0000-0000-0000-000000000001', last_message: 'Sounds good, lets start next week!', last_message_at: hoursAgo(3) };
  if (cId && f1) await supabase.from('conversations').upsert({ id: 'd0000000-0000-0000-0000-000000000001', ...conv1 });
  const conv2 = { participant_ids: [sId, f3].sort(), project_id: 'b0000000-0000-0000-0000-000000000010', last_message: 'Can you share some examples of your chatbot work?', last_message_at: hoursAgo(1) };
  if (sId && f3) await supabase.from('conversations').upsert({ id: 'd0000000-0000-0000-0000-000000000002', ...conv2 });
  const conv3 = { participant_ids: [cId, f5].sort(), project_id: 'b0000000-0000-0000-0000-000000000004', last_message: 'Great proposal! Lets schedule a call.', last_message_at: hoursAgo(24) };
  if (cId && f5) await supabase.from('conversations').upsert({ id: 'd0000000-0000-0000-0000-000000000003', ...conv3 });

  const messages = [
    { conversation_id: 'd0000000-0000-0000-0000-000000000001', sender_id: f1, content: 'Hi! I saw your project and I am very interested.', created_at: hoursAgo(5) },
    { conversation_id: 'd0000000-0000-0000-0000-000000000001', sender_id: cId, content: 'Great! Your portfolio looks impressive.', created_at: hoursAgo(4) },
    { conversation_id: 'd0000000-0000-0000-0000-000000000001', sender_id: f1, content: 'Thank you! I have attached some similar projects I have worked on.', created_at: hoursAgo(3.5) },
    { conversation_id: 'd0000000-0000-0000-0000-000000000001', sender_id: cId, content: 'Sounds good, lets start next week!', created_at: hoursAgo(3) },
    { conversation_id: 'd0000000-0000-0000-0000-000000000002', sender_id: f3, content: 'Hello! I specialize in GPT-4 and LangChain integrations.', created_at: hoursAgo(2) },
    { conversation_id: 'd0000000-0000-0000-0000-000000000002', sender_id: sId, content: 'Can you share some examples of your chatbot work?', created_at: hoursAgo(1) },
    { conversation_id: 'd0000000-0000-0000-0000-000000000003', sender_id: f5, content: 'I have a detailed strategy document ready for your review.', created_at: hoursAgo(48) },
    { conversation_id: 'd0000000-0000-0000-0000-000000000003', sender_id: cId, content: 'Great proposal! Lets schedule a call.', created_at: hoursAgo(24) },
  ];
  for (const m of messages) {
    if (!m.sender_id) continue;
    await supabase.from('messages').insert(m);
  }
  console.log('  Conversations & messages created');

  console.log('Seeding notifications...');
  const notifs = [
    { user_id: cId, type: 'proposal', title: 'New Proposal Received', body: 'Alex Rivera submitted a proposal for "E-Learning Platform Dashboard"', link: '/dashboard?tab=proposals' },
    { user_id: cId, type: 'proposal', title: 'New Proposal Received', body: 'Sarah Chen submitted a proposal for "E-Learning Platform Dashboard"', link: '/dashboard?tab=proposals' },
    { user_id: sId, type: 'proposal', title: 'New Proposal Received', body: 'Alex Rivera submitted a proposal for "E-Commerce Analytics Dashboard"', link: '/dashboard?tab=proposals' },
    { user_id: f1, type: 'message', title: 'New Message', body: 'TechVentures Inc sent you a message', link: '/chat' },
    { user_id: f3, type: 'message', title: 'New Message', body: 'Nova AI sent you a message', link: '/chat' },
    { user_id: f5, type: 'message', title: 'New Message', body: 'TechVentures Inc sent you a message', link: '/chat' },
    { user_id: cId, type: 'system', title: 'Profile Views Milestone', body: 'Your project has received 50+ views!', link: '/marketplace' },
  ];
  for (const n of notifs) {
    if (!n.user_id) continue;
    await supabase.from('notifications').insert(n);
  }
  console.log(`  ${notifs.filter(n => n.user_id).length} notifications created`);

  console.log('Seeding team members...');
  const teamMembers = [
    { startup_id: sId, name: 'David Park', role: 'CEO & Founder', bio: 'Former ML engineer at Google. Building the future of e-commerce analytics.', linkedin_url: 'https://linkedin.com/in/davidpark', sort_order: 0 },
    { startup_id: sId, name: 'Lisa Kim', role: 'CTO', bio: 'Full-stack engineer with 8 years of experience in data-intensive applications.', linkedin_url: 'https://linkedin.com/in/lisakim', sort_order: 1 },
    { startup_id: sId, name: 'Mike Torres', role: 'Head of Design', bio: 'Product designer who has worked with 10+ YC startups on their UX.', linkedin_url: 'https://linkedin.com/in/miketorres', sort_order: 2 },
  ];
  for (const t of teamMembers) {
    if (!t.startup_id) continue;
    await supabase.from('team_members').insert(t);
  }
  console.log(`  ${teamMembers.filter(t => t.startup_id).length} team members created`);

  console.log('Seeding reviews...');
  if (cId && f1) {
    await supabase.from('reviews').insert({ contract_id: '00000000-0000-0000-0000-000000000001', reviewer_id: cId, reviewee_id: f1, rating: 5, comment: 'Excellent work! Delivered ahead of schedule and exceeded expectations.', created_at: hoursAgo(720) });
  }
  console.log('  1 review created');

  console.log('Seeding portfolio items...');
  const portfolioItems = [
    { freelancer_id: f1, title: 'E-Commerce Dashboard', description: 'Real-time analytics dashboard for a major e-commerce platform.', emoji: '📊', tags: ['React','D3.js','Node.js','WebSockets'] },
    { freelancer_id: f1, title: 'AI Chat Platform', description: 'Full-stack chat platform with AI-powered responses.', emoji: '🤖', tags: ['React','Python','WebSockets','AI'] },
    { freelancer_id: f2, title: 'FinTech App Design', description: 'Complete design system and UI for a mobile banking application.', emoji: '🎨', tags: ['Figma','Design System','Mobile'] },
    { freelancer_id: f3, title: 'Recommendation Engine', description: 'ML-based recommendation system processing 10M+ queries per day.', emoji: '🧠', tags: ['Python','TensorFlow','MLOps'] },
    { freelancer_id: f4, title: 'Health Tracking App', description: 'Cross-platform mobile app with 100K+ downloads.', emoji: '📱', tags: ['React Native','Firebase','HealthKit'] },
  ];
  for (const p of portfolioItems) {
    if (!p.freelancer_id) continue;
    await supabase.from('portfolio_items').insert(p);
  }
  console.log(`  ${portfolioItems.filter(p => p.freelancer_id).length} portfolio items created`);

  console.log('\n✅ Seed complete!');
  console.log('Demo login credentials:');
  console.log('  Email: alex@demo.nexus    Password: Demo123!    (freelancer)');
  console.log('  Email: client@demo.nexus  Password: Demo123!    (client)');
  console.log('  Email: startup@demo.nexus Password: Demo123!    (startup)');
}

seed().catch(console.error);
