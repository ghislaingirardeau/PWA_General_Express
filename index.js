const express = require('express');
const app = express();
const cors = require('cors');
const webPush = require('web-push');
require('dotenv').config();

const port = 3000;

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

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

app.get('/', (req, res) => res.send('PWA express server'));

app.post('/api/save-subscription', (req, res) => {
  const subscription = req.body;
  console.log('subscription', subscription);
  /* 
  SI je ne recois pas de souscription du front alors je retourne
  Cela arrive notamment si le sw est activé au chargement de l'app
  */
  if (!subscription) {
    res.end();
    return;
  }
  subDatabse.push(subscription);
  // SEND A RESPONSE TO USER THAT HE IS CONNECTED TO THE SERVICE WORKER
  res.json({ status: 'Success', message: 'Subscription saved!' });
});

app.get('/api/send-notification', (req, res) => {
  // EVERY TIME, THE ROUTE IS CALLED, A NOTIFICATION WILL BE SEND TO THE USERS WITH THE MESSAGE ABOVE
  console.log('send notification', subDatabse);
  /* 
  Envoie une notification A TOUS les utilisateurs avec une boucle each()
  Sans boucle, idée est de recuperer le "registration" de l'utilisateur que l'on souhaite notifier
  */
  subDatabse.forEach((element) => {
    webPush.sendNotification(element, 'Notification to all users');
  });
  // POUR TOUCHER UN SEUL UTILISATEUR
  // webPush.sendNotification(
  //   subDatabse[subDatabse.length - 1],
  //   'Notification to the last user only'
  // );
  res.json({ statue: 'Success', message: 'Message sent to push' });
});

app.post('/api/test', (req, res) => {
  res.json({ statue: 'Success', message: req.body });
});

app.listen(port, () => {
  console.log('Server running on port 3000!');
});

module.exports = app;
