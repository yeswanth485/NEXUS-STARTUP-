const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

router.get('/conversations', auth, async (req, res) => {
  const { data: convs } = await supabase
    .from('conversations')
    .select('*')
    .contains('participant_ids', [req.user.id])
    .order('last_message_at', { ascending: false });

  if (!convs?.length) return res.json([]);

  const allIds = [...new Set(convs.flatMap(c => c.participant_ids))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id,full_name,avatar_url,title,is_available')
    .in('id', allIds);

  const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));

  const result = convs.map(c => ({
    ...c,
    participants: c.participant_ids.map(function(id) { return profileMap[id]; }).filter(Boolean),
  }));

  res.json(result);
});

router.post('/conversations', auth, async (req, res) => {
  const { other_user_id, project_id } = req.body;
  const participants = [req.user.id, other_user_id].sort();

  const { data: existing } = await supabase.from('conversations')
    .select('*').contains('participant_ids', participants).limit(1);
  if (existing?.length) return res.json(existing[0]);

  const { data, error } = await supabase.from('conversations')
    .insert({ participant_ids: participants, project_id: project_id || null })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.get('/:conversationId', auth, async (req, res) => {
  const { data: conv } = await supabase.from('conversations').select('participant_ids').eq('id', req.params.conversationId).single();
  if (!conv || !conv.participant_ids.includes(req.user.id)) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  const { limit = 50, before } = req.query;
  let q = supabase.from('messages')
    .select('*, sender:profiles!sender_id(id,full_name,avatar_url)')
    .eq('conversation_id', req.params.conversationId)
    .order('created_at', { ascending: false })
    .limit(Number(limit));
  if (before) q = q.lt('created_at', before);
  const { data } = await q;
  res.json((data || []).reverse());
});

module.exports = router;
