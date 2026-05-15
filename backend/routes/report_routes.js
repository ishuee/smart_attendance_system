const express = require('express');

const router = express.Router();

const {
  getAttendanceReport
} = require('../controllers/report_controller');

router.get(
  '/',
  getAttendanceReport
);

module.exports = router;