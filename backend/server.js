require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');
const app = express();

// Import routes
const userRoutes = require('./routes/user');
const carRoutes = require('./routes/car');
const bookingRoutes = require('./routes/booking');
const paymentRoutes = require('./routes/payment'); // <-- Make sure file is named payment.js
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

// ---- SESSION AND PASSPORT MIDDLEWARES ----
app.use(session({
  secret: process.env.SESSION_SECRET || 'some_secret',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  })
}));
app.use(passport.initialize());
app.use(passport.session());

// ---- ROUTES ----
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes); // <-- endpoint is /api/payments/...

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