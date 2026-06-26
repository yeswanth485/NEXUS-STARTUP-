const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*, client:profiles!client_id(id,full_name,avatar_url), freelancer:profiles!freelancer_id(id,full_name,avatar_url), project:projects(id,title)')
    .or(`client_id.eq.${req.user.id},freelancer_id.eq.${req.user.id}`)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data || []);
});

router.get('/:id', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*, client:profiles!client_id(*), freelancer:profiles!freelancer_id(*), project:projects(*), milestones(*), kanban_tasks(*)')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Not found' });
  if (data.client_id !== req.user.id && data.freelancer_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  res.json(data);
});

router.post('/', auth, async (req, res) => {
  const { project_id, proposal_id, freelancer_id, title, total_amount } = req.body;
  const { data, error } = await supabase.from('contracts')
    .insert({ project_id, proposal_id, client_id: req.user.id, freelancer_id, title, total_amount })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.patch('/:id', auth, async (req, res) => {
  const { data: c } = await supabase.from('contracts').select('client_id,freelancer_id').eq('id', req.params.id).single();
  if (!c || (c.client_id !== req.user.id && c.freelancer_id !== req.user.id)) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  const { status, progress } = req.body;
  const updates = {};
  if (status) updates.status = status;
  if (progress !== undefined) updates.progress = progress;
  const { data, error } = await supabase.from('contracts').update(updates).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
