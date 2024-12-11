import express from 'express';
import { sendNotification, subscription } from '../controllers/webpush.js';

const router = express.Router();

router.post('/save-subscription', subscription);

router.get('/send-notification', sendNotification);

export default router;
