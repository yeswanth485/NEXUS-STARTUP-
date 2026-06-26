const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

router.get('/contract/:contractId', auth, async (req, res) => {
  const { data: c } = await supabase.from('contracts').select('client_id,freelancer_id').eq('id', req.params.contractId).single();
  if (!c || (c.client_id !== req.user.id && c.freelancer_id !== req.user.id)) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  const { data } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviewer_id(id,full_name,avatar_url)')
    .eq('contract_id', req.params.contractId);
  res.json(data || []);
});

router.get('/user/:userId', async (req, res) => {
  const { data } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviewer_id(id,full_name,avatar_url)')
    .eq('reviewee_id', req.params.userId)
    .order('created_at', { ascending: false });
  res.json(data || []);
});

router.post('/', auth, async (req, res) => {
  const { contract_id, reviewee_id, rating, comment } = req.body;
  if (!contract_id || !reviewee_id || !rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const { data: c } = await supabase.from('contracts')
    .select('client_id,freelancer_id,status')
    .eq('id', contract_id).single();
  if (!c || c.status !== 'completed') return res.status(400).json({ error: 'Contract must be completed' });
  if (c.client_id !== req.user.id && c.freelancer_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { data, error } = await supabase.from('reviews')
    .insert({ contract_id, reviewer_id: req.user.id, reviewee_id, rating, comment })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

module.exports = router;
