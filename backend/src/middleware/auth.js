const supabase = require('../config/supabase');
module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    req.log?.warn?.('missing token');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    req.log?.warn?.({ error: error?.message }, 'invalid token');
    return res.status(401).json({ error: 'Invalid token' });
  }
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  req.user = user;
  req.profile = profile || {};
  next();
};
