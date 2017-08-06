var express = require('express');
var app = express();

var cookieSession = require('cookie-session');

var login = require('./routes/login');
var register = require('./routes/register');
var dashboard = require('./routes/dashboard');
var search = require('./routes/search');
var user = require('./routes/user');

app.set('view engine', 'ejs');

app.use('/assets', express.static(__dirname + '/public'));
app.use(cookieSession({
  name: 'session',
  secret: process.env.SS_KEY
}));

app.use('/login', login);
app.use('/register', register);
app.use('/dashboard', dashboard);
app.use('/search', search);
app.use('/user', user);

app.get('/', function(req, res) {
  var user = req.session.user;
  if (user) return res.redirect('/dashboard');

  res.render('index');
});

var port = process.env.PORT || 3000;
app.listen(port);
