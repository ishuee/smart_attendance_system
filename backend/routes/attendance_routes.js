const express = require('express');

const router = express.Router();

const {
  markAttendance,
  manualAttendance
} = require(
  '../controllers/attendance_controllers'
);

router.post(
  '/mark',
  markAttendance
);

router.post(
  '/manual',
  manualAttendance
);

module.exports = router;