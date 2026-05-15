const pool = require('../db/connection');

const markAttendance = async (req, res) => {
  const ipAddress = req.ip;
  const deviceInfo = req.headers['user-agent'];

  const {
    student_id,
    schedule_id,
    qr_generated_at,
    teacher_latitude,
    teacher_longitude,
    student_latitude,
    student_longitude,
    status
  } = req.body;

  try {
    const existingAttendance = await pool.query(
      `SELECT * FROM attendance
       WHERE student_id = $1
       AND schedule_id = $2`,
      [student_id, schedule_id]
    );

    if (existingAttendance.rows.length > 0) {
      await pool.query(
        `INSERT INTO attendance_logs
        (student_id, schedule_id, ip_address, device_info, is_suspicious)
        VALUES ($1, $2, $3, $4, $5)`,
        [student_id, schedule_id, ipAddress, deviceInfo, true]
      );

      return res.status(400).json({
        message: 'Attendance already marked'
      });
    }

    const classCheck = await pool.query(
      `SELECT class_students.*
       FROM class_students
       JOIN schedule
       ON class_students.class_id = schedule.class_id
       WHERE class_students.student_id = $1
       AND schedule.id = $2`,
      [student_id, schedule_id]
    );

    if (classCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO attendance_logs
        (student_id, schedule_id, ip_address, device_info, is_suspicious)
        VALUES ($1, $2, $3, $4, $5)`,
        [student_id, schedule_id, ipAddress, deviceInfo, true]
      );

      return res.status(403).json({
        message: 'You are not enrolled in this subject'
      });
    }

    const currentTime = Date.now();
    const difference = (currentTime - qr_generated_at) / 1000;

    if (difference > 120) {
      return res.status(400).json({
        message: 'QR expired'
      });
    }

    const latDifference = Math.abs(student_latitude - teacher_latitude);
    const longDifference = Math.abs(student_longitude - teacher_longitude);

    if (latDifference > 0.05 || longDifference > 0.05) {
      return res.status(400).json({
        message: 'You are not within classroom range'
      });
    }

    const result = await pool.query(
      `INSERT INTO attendance
      (student_id, schedule_id, status)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [student_id, schedule_id, status]
    );

    await pool.query(
      `INSERT INTO attendance_logs
      (student_id, schedule_id, ip_address, device_info, is_suspicious)
      VALUES ($1, $2, $3, $4, $5)`,
      [student_id, schedule_id, ipAddress, deviceInfo, false]
    );

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
};

const manualAttendance = async (req, res) => {
  const {
    attendanceData,
    schedule_id
  } = req.body;

  try {
    for (const studentId in attendanceData) {
      const selectedStatus = attendanceData[studentId];

      if (selectedStatus === 'not_considered') {
        continue;
      }

      await pool.query(
        `INSERT INTO attendance
        (student_id, schedule_id, status, method)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (student_id, schedule_id)
        DO UPDATE SET
        status = EXCLUDED.status,
        method = EXCLUDED.method`,
        [
          studentId,
          schedule_id,
          selectedStatus,
          'manual'
        ]
      );
    }

    res.json({
      message: 'Manual attendance marked'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
};

module.exports = {
  markAttendance,
  manualAttendance
};