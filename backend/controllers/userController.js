const User = require('../models/User');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { sendWelcomeMail, sendLoginMail, sendCustomMail } = require('../utils/mailer');

// Register a new user (local)
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already registered' });
    user = new User({ name, email, password, phone });
    await user.save();
    sendWelcomeMail(user.email, user.name)
      .then(() => console.log('[MAIL DEBUG] Welcome email sent to:', user.email))
      .catch(e => console.error('[MAIL DEBUG] Welcome email failed:', e));
    const { password: pw, ...userData } = user.toObject();
    res.status(201).json(userData);
  } catch (err) {
    console.error('[ERROR] Registration failed:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login user (local) and notify all users by email
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const payload = { userId: user._id, isAdmin: user.isAdmin };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    sendLoginMail(user.email, user.name)
      .then(() => console.log('[MAIL DEBUG] Login email sent to:', user.email))
      .catch(e => console.error('[MAIL DEBUG] Login email failed:', e));
    // Notify all users
    User.find({}, 'email name').then(users => {
      users.forEach(u => {
        sendCustomMail(
          u.email,
          "User Login Notification",
          `<p>Hello ${u.name || ''},<br/>A user just logged in to ShadowCars.</p>`
        )
          .then(() => console.log(`[MAIL DEBUG] Login notification sent to: ${u.email}`))
          .catch(e => console.error(`[MAIL DEBUG] Failed to notify ${u.email}:`, e));
      });
    });
    res.json({
      token,
      user: { name: user.name, email: user.email, isAdmin: user.isAdmin, _id: user._id }
    });
  } catch (err) {
    console.error('[ERROR] Login failed:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};