const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional for Google OAuth users
  phone: { type: String },
  isAdmin: { type: Boolean, default: false },
  googleId: { type: String, unique: true, sparse: true }
});

// Hash password before saving (only if new/modified and exists)
userSchema.pre('save', async function(next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
  if (!this.password) return false; // Google-only users
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);