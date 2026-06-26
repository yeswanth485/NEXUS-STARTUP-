const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

router.get('/contract/:contractId', auth, async (req, res) => {
  const { data: c } = await supabase.from('contracts').select('client_id,freelancer_id').eq('id', req.params.contractId).single();
  if (!c || (c.client_id !== req.user.id && c.freelancer_id !== req.user.id)) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  const { data } = await supabase.from('kanban_tasks')
    .select('*')
    .eq('contract_id', req.params.contractId)
    .order('position', { ascending: true });
  res.json(data || []);
});

router.post('/', auth, async (req, res) => {
  const { contract_id, title, description, column_name, tags, due_date, position, priority } = req.body;
  const { data: c } = await supabase.from('contracts').select('client_id,freelancer_id').eq('id', contract_id).single();
  if (!c || (c.client_id !== req.user.id && c.freelancer_id !== req.user.id)) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  const { data, error } = await supabase.from('kanban_tasks')
    .insert({ contract_id, created_by: req.user.id, title, description, column_name, tags, due_date, position, priority })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.patch('/:id', auth, async (req, res) => {
  const { data: t } = await supabase.from('kanban_tasks')
    .select('*, contract:contracts(client_id,freelancer_id)')
    .eq('id', req.params.id).single();
  if (!t) return res.status(404).json({ error: 'Not found' });
  if (t.contract.client_id !== req.user.id && t.contract.freelancer_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  const { data, error } = await supabase.from('kanban_tasks')
    .update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', auth, async (req, res) => {
  const { data: t } = await supabase.from('kanban_tasks')
    .select('*, contract:contracts(client_id,freelancer_id)')
    .eq('id', req.params.id).single();
  if (!t) return res.status(404).json({ error: 'Not found' });
  if (t.contract.client_id !== req.user.id && t.contract.freelancer_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  await supabase.from('kanban_tasks').delete().eq('id', req.params.id);
  res.json({ success: true });
});

module.exports = router;
