const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

router.get('/contract/:contractId', auth, async (req, res) => {
  const { data: c } = await supabase.from('contracts').select('client_id,freelancer_id').eq('id', req.params.contractId).single();
  if (!c || (c.client_id !== req.user.id && c.freelancer_id !== req.user.id)) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  const { data } = await supabase.from('milestones')
    .select('*')
    .eq('contract_id', req.params.contractId)
    .order('position', { ascending: true });
  res.json(data || []);
});

router.post('/', auth, async (req, res) => {
  const { contract_id, title, description, amount, due_date, position } = req.body;
  const { data: c } = await supabase.from('contracts').select('client_id').eq('id', contract_id).single();
  if (!c || c.client_id !== req.user.id) return res.status(403).json({ error: 'Only client can create milestones' });
  const { data, error } = await supabase.from('milestones')
    .insert({ contract_id, title, description, amount, due_date, position })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.patch('/:id', auth, async (req, res) => {
  const { data: m } = await supabase.from('milestones')
    .select('*, contract:contracts(client_id,freelancer_id)')
    .eq('id', req.params.id).single();
  if (!m) return res.status(404).json({ error: 'Not found' });
  const isClient = m.contract.client_id === req.user.id;
  const isContractor = m.contract.freelancer_id === req.user.id;
  if (!isClient && !isContractor) return res.status(403).json({ error: 'Not authorized' });

  if (req.body.status === 'submitted' && isContractor) {
    const { data, error } = await supabase.from('milestones')
      .update({ status: 'submitted' }).eq('id', req.params.id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
  }

  const { data, error } = await supabase.from('milestones')
    .update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
