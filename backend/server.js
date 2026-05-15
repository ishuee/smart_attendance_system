require('dotenv').config();
const cors = require('cors');

const express = require('express');
const app = express();
const studentRoutes =require('./routes/student_routes');
const scheduleRoutes =require('./routes/schedule_routes');
const reportRoutes =require('./routes/report_routes');

app.use(cors());

const PORT = process.env.PORT || 5000;

const pool = require('./db/connection');
const authRoutes = require('./routes/auth_routes');
const attendanceRoutes = require('./routes/attendance_routes');
const qrRoutes = require('./routes/qr_routes');

app.use(express.json());
app.use('/students',
studentRoutes);

app.get('/', (req, res) => {
  res.send('Server running');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Database connection failed'
    });
  }
});

app.use('/auth', authRoutes);


app.use('/attendance', attendanceRoutes);
app.use('/qr', qrRoutes);
app.use(
  '/schedules',
  scheduleRoutes
);

app.use(
  '/reports',
  reportRoutes
);

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running');
});