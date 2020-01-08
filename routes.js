// node routes.js

const express = require('express');
const app = express();
const port = 3000;

// https://github.com/googleapis/google-auth-library-nodejs/issues/355#issuecomment-385228363
//const googleapis = require('googleapis');
const { google } = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
// Client, secret & redirect are set and gotten from https://console.developers.google.com/
var client = '****.apps.googleusercontent.com';
var secret = '****';
var redirect = 'https://***.com/express/google/oauth2callback';
var oauth2Client = new OAuth2Client(client, secret, redirect);
var plus = google.plus('v1');

// Getting started https://codeburst.io/getting-started-with-expressjs-3cbb279bd5e6
//app.get('/', (req, res) => res.send('Hello World!'));

// Jade https://stackoverflow.com/questions/45269288/how-to-install-and-use-jade
// Pug https://expressjs.com/en/guide/using-template-engines.html
// Pug Docs: https://pugjs.org/api/getting-started.html
app.set('view engine', 'pug');
app.get('/', function (req, res) {
  res.render('index', { title: 'Google SignIn', message: 'Google SignIn' });
});

// Google SignIn
app.get('/google', function(req, res) {
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/plus.me'
  });

  res.redirect(url);
});
app.get('/google/oauth2callback', function(req, res) {
  var code = req.query.code;

  oauth2Client.getToken(code, function(err, tokens) {
    oauth2Client.setCredentials(tokens);
    
    plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
      res.render('home', { title: 'Google SignIn', message: profile.displayName });
    });
  });
});

app.listen(port, () => console.log(`Express Google SignIn Demo app is listening on port ${port}!`));
