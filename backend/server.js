require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

const userRoutes = require('./routes/user');
const carRoutes = require('./routes/car');
const bookingRoutes = require('./routes/booking');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const app = express();
app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'some_secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);

const MONGO_URI = process.env.MONGODB_URI;
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
  });
}

module.exports = app;