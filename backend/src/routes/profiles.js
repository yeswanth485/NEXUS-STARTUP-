const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { role, search, limit = 20, offset = 0 } = req.query;
    let query = supabase.from('profiles').select('*', { count: 'exact' });

    if (role) query = query.eq('role', role);
    if (search) query = query.or(`full_name.ilike.%${search}%,title.ilike.%${search}%,bio.ilike.%${search}%`);

    const { data, error, count } = await query
      .order('rating', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ data, count, limit: Number(limit), offset: Number(offset) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) return res.status(404).json({ error: 'Profile not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.id;
    delete updates.created_at;
    delete updates.updated_at;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
