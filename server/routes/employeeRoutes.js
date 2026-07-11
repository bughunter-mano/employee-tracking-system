const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMyProfile,
  submitWork,
  myHistory,
  markMyAttendance,
  myAttendanceHistory
} = require('../controllers/employeeController');

router.get('/profile', protect, getMyProfile);
router.post('/submit-work', protect, submitWork);
router.get('/history', protect, myHistory);
router.post('/mark-attendance', protect, markMyAttendance);
router.get('/attendance-history', protect, myAttendanceHistory);

module.exports = router;