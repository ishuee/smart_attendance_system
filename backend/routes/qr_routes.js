const express = require('express');

const router = express.Router();

const {
  generateQR
} = require('../controllers/qr_controllers');

router.post('/generate', generateQR);

module.exports = router;