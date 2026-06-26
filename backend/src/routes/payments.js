const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const supabase = require('../config/supabase');

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set');
  }
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
};

router.post('/create-order', auth, async (req, res) => {
  const { milestone_id } = req.body;
  const { data: m } = await supabase.from('milestones').select('*, contract:contracts(client_id)').eq('id', milestone_id).single();
  if (!m || m.contract.client_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

  let razorpay;
  try { razorpay = getRazorpay(); } catch (e) { return res.status(500).json({ error: 'Payments not configured' }); }

  const order = await razorpay.orders.create({
    amount: Math.round(m.amount * 100),
    currency: 'INR',
    receipt: `nexus_m_${milestone_id.slice(0,8)}`,
    notes: { milestone_id, platform: 'nexus' }
  });
  await supabase.from('milestones').update({ razorpay_order_id: order.id }).eq('id', milestone_id);
  res.json({ order_id: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
});

router.post('/verify', auth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, milestone_id } = req.body;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  if (expected !== razorpay_signature) return res.status(400).json({ error: 'Invalid signature' });

  const { data: m } = await supabase.from('milestones')
    .update({ status: 'funded', razorpay_payment_id })
    .eq('id', milestone_id)
    .select('*, contract:contracts(id,freelancer_id,in_escrow)').single();

  await supabase.from('contracts').update({ in_escrow: m.contract.in_escrow + m.amount }).eq('id', m.contract.id);
  await supabase.from('notifications').insert({
    user_id: m.contract.freelancer_id, type: 'milestone_funded',
    title: 'Milestone Funded', body: `"${m.title}" is in escrow. Start working!`, link: '/dashboard'
  });
  req.io.to(`user_${m.contract.freelancer_id}`).emit('notification', { type: 'milestone_funded', milestone: m });
  res.json({ success: true });
});

router.post('/release', auth, async (req, res) => {
  const { milestone_id } = req.body;
  const { data: m } = await supabase.from('milestones')
    .select('*, contract:contracts(id,client_id,freelancer_id,in_escrow,paid_amount)')
    .eq('id', milestone_id).single();
  if (!m || m.contract.client_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
  if (m.status !== 'submitted') return res.status(400).json({ error: 'Milestone must be submitted first' });

  await supabase.from('milestones').update({ status: 'released' }).eq('id', milestone_id);
  await supabase.from('contracts').update({
    in_escrow: Math.max(0, m.contract.in_escrow - m.amount),
    paid_amount: m.contract.paid_amount + m.amount
  }).eq('id', m.contract.id);

  const { data: pf } = await supabase.from('profiles').select('balance,total_earned').eq('id', m.contract.freelancer_id).single();
  await supabase.from('profiles').update({
    balance: pf.balance + m.amount, total_earned: pf.total_earned + m.amount
  }).eq('id', m.contract.freelancer_id);

  await supabase.from('notifications').insert({
    user_id: m.contract.freelancer_id, type: 'payment_released',
    title: 'Payment Released!',
    body: `$${m.amount} for "${m.title}" added to your balance.`, link: '/dashboard?tab=earnings'
  });
  req.io.to(`user_${m.contract.freelancer_id}`).emit('notification', { type: 'payment_released', amount: m.amount });
  res.json({ success: true });
});

module.exports = router;
