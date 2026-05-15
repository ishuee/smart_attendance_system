const QRCode = require('qrcode');

const generateQR = async (req, res) => {

  try {

    const {
      schedule_id,
      latitude,
      longitude
    } = req.body;

    if (!schedule_id || !latitude || !longitude) {

      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    // QR payload
    const qrData = JSON.stringify({
      schedule_id,
      generated_at: Date.now(),
      teacher_latitude: latitude,
      teacher_longitude: longitude
    });

    // Generate QR image
    const qrImage = await QRCode.toDataURL(qrData);

    res.json({
      message: 'QR generated successfully',
      qr: qrImage,
      data: JSON.parse(qrData)
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error'
    });
  }
};

module.exports = {
  generateQR
};