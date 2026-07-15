const { sendNotification, getMyNotifications } = require('../models/notificationModel');
const { getAllUsers } = require('../models/adminModel');

// Admin: notification bhejna (ek, kuch, ya sab ko)
const sendNotificationToEmployees = async (req, res) => {
  try {
    const { message, recipientIds } = req.body;
    // recipientIds ek array hai employee IDs ka. Agar "all" bheja gaya, to sab ko bhejo.

    let targetIds = recipientIds;

    if (recipientIds === 'all') {
      const allEmployees = await getAllUsers();
      targetIds = allEmployees.map((emp) => emp.id);
    }

    const results = [];
    for (const id of targetIds) {
      const notification = await sendNotification(req.user.id, id, message);
      results.push(notification);
    }

    res.status(201).json({ message: `Notification sent to ${results.length} employee(s)`, results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Employee: apni notifications dekhna
const viewMyNotifications = async (req, res) => {
  try {
    const notifications = await getMyNotifications(req.user.id);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { sendNotificationToEmployees, viewMyNotifications };