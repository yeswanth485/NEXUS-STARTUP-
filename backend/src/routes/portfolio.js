const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

router.get('/user/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('freelancer_id', req.params.userId)
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, image_url, project_url, tags, emoji } = req.body;
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({
        freelancer_id: req.user.id,
        title: title || '',
        description: description || '',
        image_url: image_url || '',
        project_url: project_url || '',
        tags: tags || [],
        emoji: emoji || '🖼️'
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
    delete updates.freelancer_id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from('portfolio_items')
      .update(updates)
      .eq('id', req.params.id)
      .eq('freelancer_id', req.user.id)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Portfolio item not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', req.params.id)
      .eq('freelancer_id', req.user.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Portfolio item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
