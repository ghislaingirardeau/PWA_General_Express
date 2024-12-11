const express = require('express');
const router = express.Router();

const { sendNotification, subscription } = require('../controllers/webpush');

router.post('/save-subscription', subscription);

router.get('/send-notification', sendNotification);

module.exports = router;
