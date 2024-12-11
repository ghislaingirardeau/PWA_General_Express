const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const webpush = require('./routes/webpush');

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

module.exports = app;
