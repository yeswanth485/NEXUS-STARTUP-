const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

router.get('/me', auth, async (req, res) => {
  const { data } = await supabase.from('profiles').select('*, portfolio_items(*), team_members(*)').eq('id', req.user.id).single();
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, portfolio_items(*), team_members(*), reviews:reviews!reviewee_id(*, reviewer:profiles!reviewer_id(full_name,avatar_url,title))')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Profile not found' });
  res.json(data);
});

router.patch('/me', auth, async (req, res) => {
  const allowed = ['full_name','title','bio','avatar_url','hourly_rate','skills','experience_years',
    'location','timezone','languages','linkedin_url','website_url','is_available',
    'company_name','industry','elevator_pitch','tech_stack','services_offered','pitch_deck_url',
    'team_size','badges'];
  const update = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

  const { data, error } = await supabase.from('profiles').update(update).eq('id', req.user.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.get('/browse/freelancers', async (req, res) => {
  const { q, skills, rate_max, limit = 20, offset = 0 } = req.query;
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('role', 'freelancer')
    .eq('onboarding_complete', true)
    .order('rating', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (q) query = query.or(`full_name.ilike.%${q}%,title.ilike.%${q}%,bio.ilike.%${q}%`);
  if (rate_max) query = query.lte('hourly_rate', Number(rate_max));
  if (skills) query = query.overlaps('skills', skills.split(','));

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.get('/browse/startups', async (req, res) => {
  const { q, industry, limit = 20, offset = 0 } = req.query;
  let query = supabase
    .from('profiles')
    .select('*, team_members(*), portfolio_items(*)')
    .eq('role', 'startup')
    .eq('onboarding_complete', true)
    .order('rating', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (q) query = query.or(`full_name.ilike.%${q}%,elevator_pitch.ilike.%${q}%,company_name.ilike.%${q}%`);
  if (industry) query = query.eq('industry', industry);

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
