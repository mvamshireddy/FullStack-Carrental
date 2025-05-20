const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getCurrentUser, 
  updateProfile 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, upload.single('licenseImage'), updateProfile);

module.exports = router;