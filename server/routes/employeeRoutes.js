const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const { protect } = require('../middleware/authMiddleware');
const {
  getMyProfile,
  submitWork,
  myHistory,
  markMyAttendance,
  myAttendanceHistory
} = require('../controllers/employeeController');

router.get('/profile', protect, getMyProfile);
router.post('/submit-work', protect, upload.single('screenshot'), submitWork);
router.get('/history', protect, myHistory);
router.post('/mark-attendance', protect, markMyAttendance);
router.get('/attendance-history', protect, myAttendanceHistory);

module.exports = router;