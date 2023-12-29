require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const validUrl = require('valid-url');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const urlMappings = {};
let counter = 1;

app.post('/api/shorturl', (req, res) => {
  const longUrl = req.body.url;

  if (!validUrl.isWebUri(longUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = `https://${req.get('host')}/api/shorturl/${counter}`;

  urlMappings[shortUrl] = longUrl;
  counter++;

  res.json({ original_url: longUrl, short_url: counter - 1 });
});

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  const shortUrl = `https://${req.get('host')}/api/shorturl/${id}`;

  if (urlMappings.hasOwnProperty(shortUrl)) {
    res.redirect(urlMappings[shortUrl]);
  } else {
    res.json({ error: 'Short URL not found' });
  }
});

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});