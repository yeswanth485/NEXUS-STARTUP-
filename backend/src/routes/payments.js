const express = require('express');
const router = express.Router();
const razorpay = require('../config/razorpay');
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const crypto = require('crypto');

router.post('/create-order', authenticate, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount is required' });

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: { ...notes, user_id: req.user.id }
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/verify', authenticate, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, milestone_id } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    if (milestone_id) {
      const { error } = await supabase
        .from('milestones')
        .update({
          status: 'funded',
          razorpay_order_id,
          razorpay_payment_id
        })
        .eq('id', milestone_id);
      if (error) return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, razorpay_payment_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/key', (_req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxx' });
});

module.exports = router;
