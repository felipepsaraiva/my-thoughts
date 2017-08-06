var User = require('../db').User;

var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var urlencoded = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res) {
  res.render('register', { errors: [], success: false, data: {} });
});

router.post('/', urlencoded, function(req, res) {
  var data = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    passwordAgain: req.body['password-again']
  }

  var success = false;
  var errors = [];

  if (!data.email || !data.username || !data.password)
    errors.push('All fields are required!');

  if (!/^[0-9a-zA-Z_.]+$/.test(data.username))
    errors.push('Username only allows letters, digits, underscores and dots!');

  if (data.password.length < 6)
    errors.push('Password must have at least 6 characters!');

  if (data.password != data.passwordAgain)
    errors.push("Passwords doesn't match!");

  User.find({ username: data.username }, function(err, data) {
    if (err)
      errors.push("An internal error occurred, try again!");

    if (data && data.length > 0)
      errors.push("Username already exists!");

    respond();
  });

  function respond() {
    if (errors.length == 0) {
      var user = new User({
        email: data.email,
        username: data.username,
        password: data.password,
        joined: Date.now()
      });

      user.save(function(err) {
        if (!err)
          success = true;

        res.render('register', { errors: errors, success: success, data: data });
      });
    } else {
      res.render('register', { errors: errors, success: success, data: data });
    }
  }
});

module.exports = router;
