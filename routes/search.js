var User = require('../db').User;

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var username = req.query.username;
  username = username.replace('@', '');
  var regex = new RegExp(username);

  User.find({ username: regex }).sort({ username: 1 }).exec(function(err, users) {
    res.render('search', { username: username, users: users });
  });
});

module.exports = router;
