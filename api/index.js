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

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

const publicVapidKey = process.env.TUTO_SW_PUBLIC;
const privateVapidKey = process.env.TUTO_SW_PRIVATE;

webPush.setVapidDetails(
  'mailto:test@example.com',
  publicVapidKey,
  privateVapidKey
);

const subDatabse = [];

app.get('/', (req, res) => res.send('Express on Vercel start deploy'));

app.post('/save-subscription', (req, res) => {
  // subscription IS UNIQUE FOR A DOMAIN, BUT COMMON TO ALLOW USER
  // IF ALL USERS ALLOWED NOTIFICATION => ALL GOT THE NOTIFICATION MESSAGE
  // STORE THE SUBSCRIPTION INSIDE DB
  const subscription = req.body;
  console.log(subscription);
  subDatabse.push(subscription);
  // SEND A RESPONSE TO USER THAT HE IS CONNECTED TO THE SERVICE WORKER
  res.json({ status: 'Success', message: 'Subscription saved!' });
});

app.get('/send-notification', (req, res) => {
  // EVERY TIME, THE ROUTE IS CALLED, A NOTIFICATION WILL BE SEND TO THE USER WITH THE MESSAGE ABOVE
  console.log(subDatabse);
  webPush.sendNotification(subDatabse[subDatabse.length - 1], 'Hello world');
  res.json({ statue: 'Success', message: 'Message sent to push' });
});

app.listen(8080);

module.exports = app;
