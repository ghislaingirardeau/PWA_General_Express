import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import webpush from './routes/webpush.js';

const app = express();

const port = 3000;

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json());

app.use(cors(corsOptions));

app.get('/', (req, res) =>
  res.send('PWA express server, for test: webpush & authentification')
);

app.post('/api/test', (req, res) => {
  res.json({ statue: 'Success', message: req.body });
});

app.use('/api/webpush', webpush);

app.listen(port, () => {
  console.log('Server running on port 3000!');
});
