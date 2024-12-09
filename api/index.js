const express = require('express');
const app = express();
const cors = require('cors');
const webPush = require('web-push');
require('dotenv').config();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors(corsOptions));

const publicVapidKey = process.env.TUTO_SW_PUBLIC;
const privateVapidKey = process.env.TUTO_SW_PRIVATE;

webPush.setVapidDetails(
  'mailto:test@example.com',
  publicVapidKey,
  privateVapidKey
);

const subDatabse = [];

app.get('/', (req, res) => res.send('Express on Vercel start deploy'));

app.post('/api/save-subscription', (req, res) => {
  // subscription IS UNIQUE FOR A DOMAIN, BUT COMMON TO ALLOW USER
  // IF ALL USERS ALLOWED NOTIFICATION => ALL GOT THE NOTIFICATION MESSAGE
  // STORE THE SUBSCRIPTION INSIDE DB
  const subscription = req.body;
  console.log('subscription', subscription);
  subDatabse.push(subscription);
  // SEND A RESPONSE TO USER THAT HE IS CONNECTED TO THE SERVICE WORKER
  res.json({ status: 'Success', message: 'Subscription saved!' });
});

app.get('/api/send-notification', (req, res) => {
  // EVERY TIME, THE ROUTE IS CALLED, A NOTIFICATION WILL BE SEND TO THE USER WITH THE MESSAGE ABOVE
  console.log('send notification', subDatabse);
  webPush.sendNotification(subDatabse[0], 'Hello world');
  res.json({ statue: 'Success', message: 'Message sent to push' });
});

app.post('/api/test', (req, res) => {
  res.json({ statue: 'Success', message: req.body });
});

app.listen(8080);

module.exports = app;
