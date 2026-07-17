require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
require('./config/db');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const testRoutes = require('./routes/testRoutes');
const { runDailyScoreCheck } = require('./controllers/scoreController');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// General rate limiter — har IP se 100 requests per 15 min
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
});
app.use(generalLimiter);

// Login/signup ke liye zyada sakht limit (brute-force se bachne ke liye)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again later.' }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/test', testRoutes);

cron.schedule('1 0 * * *', () => {
  console.log('Cron job triggered at 12:01 AM');
  runDailyScoreCheck();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));