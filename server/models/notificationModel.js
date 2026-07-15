const pool = require('../config/db');

// Ek employee ko notification bhejna
const sendNotification = async (senderId, receiverId, message) => {
  const result = await pool.query(
    'INSERT INTO notifications (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *',
    [senderId, receiverId, message]
  );
  return result.rows[0];
};

// Employee apni notifications dekhe
const getMyNotifications = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM notifications WHERE receiver_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

module.exports = { sendNotification, getMyNotifications };