# Note Web Push API

**Associer avec le projet Quasar-vueSchool, la shopping Liste**

## Host

- deploiement pas possible sur Vercel > pb de CORS lors des appels POST
- Déploiement fait sur Render > https://dashboard.render.com/web/srv-ctbd20popnds73en4ee0/logs

## Usage

l'envoie de la notification se fera à tous les usagers (si je fais une boucle d'envoie de notification pour chaque `registration` dans ma BDD) ou à un seul utilisateur cible. Le tout grace à la fonction de `webPush.sendNotification`

/!\ Comportement différent suivant les navigateurs
Sur Mozilla, la notification apparaitra dés que le navigateur sera ouvert
Sur Chrome, la notification apparait meme si le navigateur est fermé

## Coté front

Une fois la registration envoyé, pas besoin de s'enregistrer une nouvelle fois (celle le meme objet qui sera renvoyé)
