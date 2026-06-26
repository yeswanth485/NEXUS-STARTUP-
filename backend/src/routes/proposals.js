const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

router.get('/mine', auth, async (req, res) => {
  const { data } = await supabase
    .from('proposals')
    .select('*, project:projects(id,title,category,budget_min,budget_max,status,client:profiles!client_id(full_name,avatar_url))')
    .eq('freelancer_id', req.user.id)
    .order('created_at', { ascending: false });
  res.json(data || []);
});

router.get('/project/:id', auth, async (req, res) => {
  const { data: proj } = await supabase.from('projects').select('client_id').eq('id', req.params.id).single();
  if (!proj || proj.client_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
  const { data } = await supabase
    .from('proposals')
    .select('*, applicant:profiles!freelancer_id(id,full_name,avatar_url,title,rating,rating_count,jobs_completed,hourly_rate,skills,elevator_pitch)')
    .eq('project_id', req.params.id)
    .order('created_at', { ascending: false });
  res.json(data || []);
});

router.post('/', auth, async (req, res) => {
  if (req.profile.role === 'client') return res.status(403).json({ error: 'Clients cannot apply' });

  if (req.profile.plan === 'free') {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const { count } = await supabase.from('proposals').select('id', { count: 'exact', head: true })
      .eq('freelancer_id', req.user.id).gte('created_at', startOfMonth);
    if (count >= 5) return res.status(403).json({ error: 'Free plan limit: 5 proposals/month. Upgrade to Professional.' });
  }

  const { project_id, cover_letter, bid_amount, timeline, portfolio_link } = req.body;
  const { data, error } = await supabase.from('proposals')
    .insert({ project_id, freelancer_id: req.user.id, cover_letter, bid_amount, timeline, portfolio_link })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });

  const { data: proj } = await supabase.from('projects').select('client_id,title').eq('id', project_id).single();
  if (proj) {
    await supabase.from('notifications').insert({
      user_id: proj.client_id, type: 'new_proposal',
      title: 'New Proposal Received',
      body: `${req.profile.full_name} applied to "${proj.title}"`,
      link: `/dashboard?tab=proposals&project=${project_id}`,
      metadata: { proposal_id: data.id, applicant_id: req.user.id }
    });
    req.io.to(`user_${proj.client_id}`).emit('notification', { type: 'new_proposal', data });
  }
  res.status(201).json(data);
});

router.patch('/:id', auth, async (req, res) => {
  const { data: proposal } = await supabase.from('proposals')
    .select('*, project:projects(client_id,title)')
    .eq('id', req.params.id).single();
  if (!proposal) return res.status(404).json({ error: 'Not found' });

  const isClient = proposal.project?.client_id === req.user.id;
  const isApplicant = proposal.freelancer_id === req.user.id;
  if (!isClient && !isApplicant) return res.status(403).json({ error: 'Not authorized' });

  const { data, error } = await supabase.from('proposals').update({ status: req.body.status }).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });

  if (req.body.status === 'accepted' && isClient) {
    const { data: contract } = await supabase.from('contracts').insert({
      project_id: proposal.project_id,
      proposal_id: proposal.id,
      client_id: req.user.id,
      freelancer_id: proposal.freelancer_id,
      title: proposal.project.title,
      total_amount: proposal.bid_amount
    }).select().single();

    await supabase.from('projects').update({ status: 'in_progress' }).eq('id', proposal.project_id);
    await supabase.from('proposals').update({ status: 'rejected' })
      .eq('project_id', proposal.project_id).neq('id', proposal.id);

    await supabase.from('notifications').insert({
      user_id: proposal.freelancer_id, type: 'proposal_accepted',
      title: 'Proposal Accepted!',
      body: `Your proposal for "${proposal.project.title}" was accepted. Contract is live!`,
      link: '/dashboard',
      metadata: { contract_id: contract.id }
    });
    req.io.to(`user_${proposal.freelancer_id}`).emit('notification', { type: 'proposal_accepted', contract });
    return res.json({ proposal: data, contract });
  }
  res.json(data);
});

module.exports = router;
