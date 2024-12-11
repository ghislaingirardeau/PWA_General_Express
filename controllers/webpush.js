import webPush from 'web-push';

const publicVapidKey = process.env.TUTO_SW_PUBLIC;
const privateVapidKey = process.env.TUTO_SW_PRIVATE;

webPush.setVapidDetails(
  'mailto:test@example.com',
  publicVapidKey,
  privateVapidKey
);

const subDatabse = [];

export function subscription(req, res) {
  const subscription = req.body;
  /* 
      SI je ne recois pas de souscription du front alors je retourne
      Cela arrive notamment si le sw est activé au chargement de l'app
      */
  if (!subscription) {
    res.end();
    return;
  }
  subDatabse.push(subscription);
  console.log('subscription', subDatabse);

  // SEND A RESPONSE TO USER THAT HE IS CONNECTED TO THE SERVICE WORKER
  res.json({ status: 'Success', message: 'Subscription saved!' });
}

export function sendNotification(req, res) {
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
}
