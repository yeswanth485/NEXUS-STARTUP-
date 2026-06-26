const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  const { category, q, budget_max, level, type, limit = 20, offset = 0 } = req.query;
  let query = supabase
    .from('projects')
    .select('*, client:profiles!client_id(id,full_name,avatar_url,rating,company_name)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (category && category !== 'All') query = query.eq('category', category);
  if (budget_max) query = query.lte('budget_max', Number(budget_max));
  if (level) query = query.eq('experience_level', level);
  if (type) query = query.eq('project_type', type);
  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, client:profiles!client_id(*)')
    .eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Not found' });
  await supabase.from('projects').update({ views_count: (data.views_count || 0) + 1 }).eq('id', req.params.id);
  res.json(data);
});

router.post('/', auth, async (req, res) => {
  if (req.profile.role !== 'client') return res.status(403).json({ error: 'Only clients can post projects' });
  const { title, description, category, budget_min, budget_max, timeline, experience_level, project_type, skills_required } = req.body;
  if (!title || !description || !category) return res.status(400).json({ error: 'Missing required fields' });

  const { data, error } = await supabase.from('projects')
    .insert({ client_id: req.user.id, title, description, category, budget_min, budget_max, timeline, experience_level, project_type, skills_required })
    .select('*, client:profiles!client_id(id,full_name,avatar_url)').single();

  if (error) return res.status(400).json({ error: error.message });

  req.io.emit('new_project', data);
  res.status(201).json(data);
});

router.patch('/:id', auth, async (req, res) => {
  const { data: p } = await supabase.from('projects').select('client_id').eq('id', req.params.id).single();
  if (!p || p.client_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
  const { data, error } = await supabase.from('projects').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', auth, async (req, res) => {
  const { data: p } = await supabase.from('projects').select('client_id').eq('id', req.params.id).single();
  if (!p || p.client_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
  await supabase.from('projects').delete().eq('id', req.params.id);
  res.json({ success: true });
});

router.get('/mine/list', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, proposals(count)')
    .eq('client_id', req.user.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
