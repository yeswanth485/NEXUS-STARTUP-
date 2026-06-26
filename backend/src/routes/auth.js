const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

router.post('/complete-onboarding', auth, async (req, res) => {
  const {
    step, role, full_name, avatar_url, location, timezone, languages,
    title, bio, hourly_rate, skills, experience_years, linkedin_url, website_url,
    company_name, industry, typical_budget, looking_to_build,
    team_size, founding_year, services_offered, tech_stack, elevator_pitch, pitch_deck_url,
    onboarding_complete
  } = req.body;

  const update = {};

  if (step !== undefined) update.onboarding_step = step;
  if (role) update.role = role;
  if (full_name) update.full_name = full_name;
  if (avatar_url !== undefined) update.avatar_url = avatar_url;
  if (location) update.location = location;
  if (timezone) update.timezone = timezone;
  if (languages) update.languages = languages;
  if (title) update.title = title;
  if (bio) update.bio = bio;
  if (hourly_rate !== undefined) update.hourly_rate = hourly_rate;
  if (skills) update.skills = skills;
  if (experience_years !== undefined) update.experience_years = experience_years;
  if (linkedin_url) update.linkedin_url = linkedin_url;
  if (website_url) update.website_url = website_url;
  if (company_name) update.company_name = company_name;
  if (industry) update.industry = industry;
  if (typical_budget) update.typical_budget = typical_budget;
  if (looking_to_build) update.looking_to_build = looking_to_build;
  if (team_size !== undefined) update.team_size = team_size;
  if (founding_year !== undefined) update.founding_year = founding_year;
  if (services_offered) update.services_offered = services_offered;
  if (tech_stack) update.tech_stack = tech_stack;
  if (elevator_pitch) update.elevator_pitch = elevator_pitch;
  if (pitch_deck_url) update.pitch_deck_url = pitch_deck_url;
  if (onboarding_complete !== undefined) update.onboarding_complete = onboarding_complete;

  const { data, error } = await supabase.from('profiles').update(update).eq('id', req.user.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
