const express = require('express');
const webpush = require('./routes/webpush');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => res.send('Express on Vercel start deploy'));

app.use('/api', webpush);

app.listen(8080);

module.exports = app;
