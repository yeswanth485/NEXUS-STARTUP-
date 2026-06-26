const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

router.get('/user/:userId', async (req, res) => {
  const { data } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('freelancer_id', req.params.userId)
    .order('created_at', { ascending: false });
  res.json(data || []);
});

router.post('/', auth, async (req, res) => {
  const { title, description, image_url, project_url, tags, emoji } = req.body;
  const { data, error } = await supabase.from('portfolio_items')
    .insert({ freelancer_id: req.user.id, title, description, image_url, project_url, tags, emoji })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/:id', auth, async (req, res) => {
  const updates = req.body;
  delete updates.id;
  delete updates.freelancer_id;
  delete updates.created_at;

  const { data, error } = await supabase.from('portfolio_items')
    .update(updates)
    .eq('id', req.params.id)
    .eq('freelancer_id', req.user.id)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

router.delete('/:id', auth, async (req, res) => {
  const { error } = await supabase.from('portfolio_items')
    .delete()
    .eq('id', req.params.id)
    .eq('freelancer_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
