var User = require('../db').User;
var Post = require('../db').Post;
var Follow = require('../db').Follow;

var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var urlencoded = bodyParser.urlencoded({ extended: false });

function renderProfile(req, res) {
  var user = req.session.user;
  var profile = req.params.username;

  User.find({ username: profile }, function(err, data) {
    if (err) throw err;

    if (data && data.length == 1) {
      Post.find({ author: profile }).sort({ date: -1 }).exec(function(err, posts) {
        if (err) throw err;

        Follow.find({ user: user.username, followed: profile }, function(err, follow) {
          if (err) throw err;

          res.render('profile', {
            user: user,
            profile: data[0],
            posts: posts,
            follow: (follow.length > 0)
          });
        });
      });

    } else {
      //Render not found
      res.send('Not Found');
    }
  });
}

router.get('/:username', renderProfile);

router.post('/:username', urlencoded, function(req, res) {
  var user = req.session.user;
  var profile = req.body.profile;
  console.log(profile);

  if (user) {
    Follow.find({ user: user.username, followed: profile }, function (err, data) {
      if (err) throw err;

      if (data.length > 0) {
        data[0].remove(function(err) {
          if (err) throw err;

          renderProfile(req, res);
        });
      } else {
        var follow = new Follow({
          user: user.username,
          followed: profile
        });

        follow.save(function(err, follow) {
          if (err) throw err;

          renderProfile(req, res);
        });
      }
    });

  } else {
    renderProfile(req, res);
  }
});

module.exports = router;
