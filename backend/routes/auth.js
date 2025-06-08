const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { sendWelcomeMail, sendLoginMail } = require('../utils/mailer');
const User = require('../models/User');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user;
      // Send welcome email only if user is new
      if (!user.password && user.createdAt && (Date.now() - user.createdAt.getTime()) < 10000) {
        await sendWelcomeMail(user.email, user.name);
      } else {
        await sendLoginMail(user.email, user.name);
      }
    } catch (e) {
      console.error('[MAIL DEBUG] Google login/welcome mail failed:', e.message);
    }
    const token = jwt.sign(
      { userId: req.user._id, isAdmin: req.user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`${process.env.FRONTEND_URL}/google-auth-success?token=${token}`);
  }
);

module.exports = router;