const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

router.get('/', auth, async (req, res) => {
  const { data } = await supabase.from('user_settings').select('*').eq('id', req.user.id).single();
  res.json(data || {});
});

router.patch('/', auth, async (req, res) => {
  const allowed = [
    'email_new_message','email_new_proposal','email_payment','email_marketing',
    'push_new_message','push_proposals',
    'show_earnings','show_online_status','profile_visible',
    'theme'
  ];
  const update = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

  const { data, error } = await supabase.from('user_settings')
    .update(update).eq('id', req.user.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
