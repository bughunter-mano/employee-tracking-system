const mongoose = require('mongoose');
require('../config/db');

const notificationSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

notificationSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

const sendNotification = async (senderId, receiverId, message) => {
  const notification = new Notification({ sender_id: senderId, receiver_id: receiverId, message });
  await notification.save();
  return notification;
};

const getMyNotifications = async (userId) => {
  return await Notification.find({ receiver_id: userId }).sort({ created_at: -1 });
};

module.exports = { Notification, sendNotification, getMyNotifications };