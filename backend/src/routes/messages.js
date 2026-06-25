const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

router.get('/conversations', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .contains('participant_ids', [req.user.id])
      .order('last_message_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });

    const enriched = await Promise.all((data || []).map(async (conv) => {
      const otherId = conv.participant_ids.find(id => id !== req.user.id);
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, title, role')
        .eq('id', otherId)
        .single();
      return { ...conv, other_user: profile };
    }));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/conversations/:id', authenticate, async (req, res) => {
  try {
    const convId = req.params.id;
    const { data: conv } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', convId)
      .single();
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    if (!conv.participant_ids.includes(req.user.id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });
    if (error) return res.status(400).json({ error: error.message });

    const otherId = conv.participant_ids.find(id => id !== req.user.id);
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, title, role')
      .eq('id', otherId)
      .single();

    res.json({ ...conv, messages, other_user: profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/conversations', authenticate, async (req, res) => {
  try {
    const { participant_id, project_id } = req.body;
    if (!participant_id) return res.status(400).json({ error: 'Participant ID is required' });

    const participantIds = [req.user.id, participant_id].sort();

    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .contains('participant_ids', participantIds)
      .maybeSingle();
    if (existing) {
      const otherId = existing.participant_ids.find(id => id !== req.user.id);
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, title, role')
        .eq('id', otherId)
        .single();
      return res.json({ ...existing, other_user: profile });
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        participant_ids: participantIds,
        project_id: project_id || null,
        unread_counts: { [req.user.id]: 0, [participant_id]: 0 }
      })
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });

    const otherId = participant_id;
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, title, role')
      .eq('id', otherId)
      .single();

    res.status(201).json({ ...data, other_user: profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/conversations/:id/read', authenticate, async (req, res) => {
  try {
    const { data: conv } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });

    const unread = conv.unread_counts || {};
    unread[req.user.id] = 0;

    const { error } = await supabase
      .from('conversations')
      .update({ unread_counts: unread })
      .eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
