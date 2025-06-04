const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendWelcomeMail } = require('../utils/mailer');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already registered' });

    user = new User({ name, email, password, phone });
    await user.save();

    // Send welcome email (do not block registration if mail fails)
    sendWelcomeMail(user.email, user.name).catch(e => {
      console.error('Welcome email failed:', e.message);
    });

    // Do not send password in response
    const { password: pw, ...userData } = user.toObject();

    res.status(201).json(userData);
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { userId: user._id, isAdmin: user.isAdmin };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { name: user.name, email: user.email, isAdmin: user.isAdmin, _id: user._id } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};