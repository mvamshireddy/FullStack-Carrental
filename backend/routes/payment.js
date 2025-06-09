const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const auth = require('../middleware/auth'); // If you want to restrict to logged-in users

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-intent', auth, async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount || !currency)
      return res.status(400).json({ message: "Amount and currency required." });

    // Stripe expects amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;