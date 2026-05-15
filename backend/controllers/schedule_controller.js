const pool =
require('../db/connection');

const getSchedules =
async (req, res) => {

  try {

    const result =
      await pool.query(

        `SELECT

        schedule.id,
        classes.subject

        FROM schedule

        JOIN classes
        ON schedule.class_id =
        classes.id`
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
  getSchedules
};