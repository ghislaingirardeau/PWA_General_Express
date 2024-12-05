const express = require('express');
const webPush = require('web-push');
require('dotenv').config();
const router = express.Router();

const publicVapidKey = process.env.TUTO_SW_PUBLIC;
const privateVapidKey = process.env.TUTO_SW_PRIVATE;

webPush.setVapidDetails(
  'mailto:test@example.com',
  publicVapidKey,
  privateVapidKey
);

const subDatabse = [
  {
    endpoint:
      'https://fcm.googleapis.com/fcm/send/cFeOvYJs5bs:APA91bHFpp8mt40gjCxwYUiO1BfAJ_EVoj1_OcoH84kM-Gy3aJ_nlBAY68VHFiGNjy42HTgVajsgInun7ycthscFLlzSTQaUL303W2Orf_RcfGFblGxVzB_eqK22KHlWb7GwHicCjDim',
    expirationTime: null,
    keys: {
      p256dh:
        'BCJ5tWk-jld_dgi1X5sld9ibJkxpgGAs18KDzBfZXfX3AqdfKxp42TXYYo8Xt9hezykzmBtPxAbvIrQppX7JrxY',
      auth: 'ytL9QImbw4fI3TfPgvhHDA',
    },
  },
];

router.get('/', (req, res) => {
  res.send('Hello web push notification');
});

router.post('/save-subscription', (req, res) => {
  // subscription IS UNIQUE FOR A DOMAIN, BUT COMMON TO ALLOW USER
  // IF ALL USERS ALLOWED NOTIFICATION => ALL GOT THE NOTIFICATION MESSAGE
  // STORE THE SUBSCRIPTION INSIDE DB
  const subscription = req.body;
  console.log(subscription);
  subDatabse.push(subscription);
  // SEND A RESPONSE TO USER THAT HE IS CONNECTED TO THE SERVICE WORKER
  res.json({ status: 'Success', message: 'Subscription saved!' });
});

router.get('/send-notification', (req, res) => {
  // EVERY TIME, THE ROUTE IS CALLED, A NOTIFICATION WILL BE SEND TO THE USER WITH THE MESSAGE ABOVE
  console.log(subDatabse);
  webPush.sendNotification(subDatabse[subDatabse.length - 1], 'Hello world');
  res.json({ statue: 'Success', message: 'Message sent to push' });
});

module.exports = router;
