// controllers/student_controller.js

const pool = require('../db/connection');

const getStudents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email
       FROM users
       WHERE role = 'student'
       ORDER BY name`
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
  getStudents
};