const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*, client:client_id(full_name, avatar_url), freelancer:freelancer_id(full_name, avatar_url), project:project_id(title)')
      .or(`client_id.eq.${req.user.id},freelancer_id.eq.${req.user.id}`)
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('*, client:client_id(*), freelancer:freelancer_id(*), project:project_id(*), milestones(*)')
      .eq('id', req.params.id)
      .single();
    if (error) return res.status(404).json({ error: 'Contract not found' });
    if (data.client_id !== req.user.id && data.freelancer_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { project_id, proposal_id, freelancer_id, title, total_amount } = req.body;
    if (!freelancer_id || !title || !total_amount) {
      return res.status(400).json({ error: 'Freelancer ID, title, and total amount are required' });
    }
    const { data, error } = await supabase
      .from('contracts')
      .insert({
        project_id: project_id || null,
        proposal_id: proposal_id || null,
        client_id: req.user.id,
        freelancer_id,
        title,
        total_amount,
        in_escrow: 0
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
    const { status, progress } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (progress !== undefined) updates.progress = progress;

    const { data: contract } = await supabase
      .from('contracts')
      .select('client_id, freelancer_id')
      .eq('id', req.params.id)
      .single();
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    if (contract.client_id !== req.user.id && contract.freelancer_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('contracts')
      .update(updates)
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
