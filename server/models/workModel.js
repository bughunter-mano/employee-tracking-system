const mongoose = require('mongoose');
require('../config/db');

const workSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  screenshot_url: { type: String, default: null },
  github_link: { type: String, default: null }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

workSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const ProofOfWork = mongoose.models.ProofOfWork || mongoose.model('ProofOfWork', workSchema);

const addProofOfWork = async (userId, date, screenshotUrl, githubLink) => {
  const work = new ProofOfWork({
    user_id: userId,
    date,
    screenshot_url: screenshotUrl,
    github_link: githubLink
  });
  await work.save();
  return work;
};

const getWorkHistory = async (userId) => {
  return await ProofOfWork.find({ user_id: userId }).sort({ date: -1 });
};

const checkTodaySubmission = async (userId, date) => {
  return await ProofOfWork.findOne({ user_id: userId, date });
};

module.exports = { ProofOfWork, addProofOfWork, getWorkHistory, checkTodaySubmission };