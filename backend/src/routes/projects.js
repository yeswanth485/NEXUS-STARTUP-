const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, status, search, min_budget, max_budget, limit = 20, offset = 0 } = req.query;
    let query = supabase.from('projects').select('*, client:client_id(full_name, avatar_url, title)', { count: 'exact' });

    query = query.eq('status', status || 'open');
    if (category) query = query.eq('category', category);
    if (min_budget) query = query.gte('budget_min', Number(min_budget));
    if (max_budget) query = query.lte('budget_max', Number(max_budget));
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ data, count, limit: Number(limit), offset: Number(offset) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*, client:client_id(full_name, avatar_url, title, bio, rating, hourly_rate)')
      .eq('id', req.params.id)
      .single();
    if (error) return res.status(404).json({ error: 'Project not found' });

    await supabase.rpc('increment_project_views', { project_id: req.params.id });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, category, budget_min, budget_max, timeline, experience_level, project_type, skills_required } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }
    const { data, error } = await supabase
      .from('projects')
      .insert({
        client_id: req.user.id,
        title, description, category,
        budget_min: budget_min || 0,
        budget_max: budget_max || 0,
        timeline: timeline || '1 month',
        experience_level: experience_level || 'intermediate',
        project_type: project_type || 'fixed',
        skills_required: skills_required || []
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
    const updates = req.body;
    delete updates.id;
    delete updates.client_id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', req.params.id)
      .eq('client_id', req.user.id)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Project not found or unauthorized' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id)
      .eq('client_id', req.user.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
