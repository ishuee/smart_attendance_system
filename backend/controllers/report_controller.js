const pool = require('../db/connection');

const getAttendanceReport = async (req, res) => {

  try {

    const result = await pool.query(
  `SELECT
    attendance.id,
    users.name AS student_name,
    classes.subject,
    schedule.day,
    schedule.start_time,
    schedule.end_time,
    attendance.status,
    attendance.method,
    attendance.marked_at
  FROM attendance
  JOIN users
  ON attendance.student_id = users.id
  JOIN schedule
  ON attendance.schedule_id = schedule.id
  JOIN classes
  ON schedule.class_id = classes.id
  ORDER BY attendance.marked_at DESC`
);

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
};

module.exports = {
  getAttendanceReport
};