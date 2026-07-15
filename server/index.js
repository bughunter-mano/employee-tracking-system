require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('./config/db');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const testRoutes = require('./routes/testRoutes');
const { runDailyScoreCheck } = require('./controllers/scoreController');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/test', testRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Cron Job: Har roz raat 12:01 baje chalega
// Format: minute hour day month weekday
cron.schedule('1 0 * * *', () => {
  console.log('Cron job triggered at 12:01 AM');
  runDailyScoreCheck();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));