const express =
require('express');

const router =
express.Router();

const {
  getSchedules
}
=
require(
  '../controllers/schedule_controller'
);

router.get(
  '/',
  getSchedules
);

module.exports =
router;