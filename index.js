require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const urlMappings = {};

app.post('/api/shorturl', (req, res) => {
  const longUrl = req.body.url;

  const shortUrl = `https://${req.get('host')}/${Object.keys(urlMappings).length + 1}`;

  urlMappings[shortUrl] = longUrl;

  res.json({ original_url: longUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  const shortUrl = `https://${req.get('host')}/${id}`;

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
