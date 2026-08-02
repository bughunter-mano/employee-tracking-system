const mongoose = require('mongoose');
require('../config/db');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
  performance_score: { type: Number, default: 100 },
  status: { type: String, enum: ['active', 'warning', 'blocked'], default: 'active' },
  reset_token: { type: String, default: null },
  reset_token_expiry: { type: Date, default: null }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const createUser = async (name, email, hashedPassword, role) => {
  const user = new User({ name, email, password_hash: hashedPassword, role: role || 'employee' });
  await user.save();
  return user;
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (id) => {
  return await User.findById(id);
};

module.exports = { User, createUser, findUserByEmail, findUserById };