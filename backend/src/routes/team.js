const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

router.get('/startup/:startupId', async (req, res) => {
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('startup_id', req.params.startupId)
    .order('sort_order', { ascending: true });
  res.json(data || []);
});

router.post('/', auth, async (req, res) => {
  const { name, role, avatar_url, bio, linkedin_url } = req.body;
  if (req.profile.role !== 'startup') return res.status(403).json({ error: 'Only startups can add team members' });
  const { data, error } = await supabase.from('team_members')
    .insert({ startup_id: req.user.id, name, role, avatar_url, bio, linkedin_url })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/:id', auth, async (req, res) => {
  const updates = req.body;
  delete updates.id;
  delete updates.startup_id;
  delete updates.created_at;

  const { data, error } = await supabase.from('team_members')
    .update(updates)
    .eq('id', req.params.id)
    .eq('startup_id', req.user.id)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.delete('/:id', auth, async (req, res) => {
  const { error } = await supabase.from('team_members')
    .delete()
    .eq('id', req.params.id)
    .eq('startup_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
