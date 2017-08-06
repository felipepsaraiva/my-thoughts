var User = require('../db').User;

var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var urlencoded = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res) {
  res.render('login', { errors: [], data: {} })
});

router.post('/', urlencoded, function(req, res) {
  var params = {
    username: req.body.username,
    password: req.body.password
  }

  var errors = [];

  if (!params.username || !params.password)
    errors.push('All fields are required');

  if (errors.length == 0) {
    User.find(params, function(err, data) {
      if (err)
        errors.push("An internal error occurred, try again!");

      if (data && data.length == 1) {
        req.session.user = {
          id: data[0]._id,
          username: data[0].username
        };

        res.redirect('/dashboard');
      } else {
        errors.push("Invalid username or password!");
        res.render('login', { errors: errors, data: params });
      }
    });
  } else {
    res.render('login', { errors: errors, data: params });
  }
});

router.get('/logout', function(req, res) {
  req.session = null;
  res.redirect('/');
});

module.exports = router;
