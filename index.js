import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import webpush from './routes/webpush.js';
import webAuhtn from './routes/WebAuthn.js';

import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app = express();

const port = 3000;

const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cookieParser('pwaAuthTest'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.json());

app.use(cors(corsOptions));

app.use(
  session({
    secret: 'pwaAuthTest',
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 60000,
    },
  })
);

app.get('/', (req, res) =>
  res.send('PWA express server, for test: webpush & authentification')
);

app.post('/api/test', (req, res) => {
  res.json({ statue: 'Success', message: req.body });
});

app.use('/api/webpush', webpush);
app.use('/api/webAuhtn', webAuhtn);

app.listen(port, () => {
  console.log('Server running on port 3000!');
});
