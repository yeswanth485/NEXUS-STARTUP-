const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

router.get('/my', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('*, project:project_id(title, category, budget_min, budget_max, status)')
      .eq('freelancer_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/project/:projectId', authenticate, async (req, res) => {
  try {
    const { data: project } = await supabase
      .from('projects')
      .select('client_id')
      .eq('id', req.params.projectId)
      .single();

    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.client_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the project owner can view proposals' });
    }

    const { data, error } = await supabase
      .from('proposals')
      .select('*, freelancer:freelancer_id(full_name, avatar_url, title, rating, hourly_rate)')
      .eq('project_id', req.params.projectId)
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { project_id, cover_letter, bid_amount, timeline, portfolio_link } = req.body;
    if (!project_id || !cover_letter || !bid_amount) {
      return res.status(400).json({ error: 'Project ID, cover letter, and bid amount are required' });
    }

    const { data: existing } = await supabase
      .from('proposals')
      .select('id')
      .eq('project_id', project_id)
      .eq('freelancer_id', req.user.id)
      .maybeSingle();
    if (existing) return res.status(409).json({ error: 'You already submitted a proposal for this project' });

    const { data, error } = await supabase
      .from('proposals')
      .insert({
        project_id,
        freelancer_id: req.user.id,
        cover_letter,
        bid_amount,
        timeline: timeline || '1 month',
        portfolio_link: portfolio_link || ''
      })
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const { data: proposal } = await supabase
      .from('proposals')
      .select('*, project:project_id(client_id)')
      .eq('id', req.params.id)
      .single();
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    const isFreelancer = proposal.freelancer_id === req.user.id;
    const isClient = proposal.project.client_id === req.user.id;

    if (!isFreelancer && !isClient) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (isFreelancer && !['withdrawn'].includes(status)) {
      return res.status(403).json({ error: 'Freelancers can only withdraw proposals' });
    }

    if (isClient && !['accepted', 'rejected', 'viewed'].includes(status)) {
      return res.status(403).json({ error: 'Clients can only accept, reject, or mark as viewed' });
    }

    const { data, error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
