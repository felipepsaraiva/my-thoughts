var User = require('../db').User;
var Post = require('../db').Post;
var Follow = require('../db').Follow;

var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var urlencoded = bodyParser.urlencoded({ extended: false });
var maxChar = 200;

router.get('/', function(req, res) {
  var user = req.session.user;
  if (!user) return res.redirect('/');

  renderDashboard(user, res);
});

router.post('/', urlencoded, function(req, res) {
  var user = req.session.user;
  if (!user) return res.redirect('/');

  var content = req.body.content;

  if (content && content.length < maxChar) {
    var post = new Post({
      author: user.username,
      content: content,
      date: Date.now()
    });

    post.save(function(err, post) {
      renderDashboard(user, res);
    });
  }
});

function renderDashboard(user, res) {
  Follow.find({ user: user.username }, function(err, data) {
    if (err) throw err;

    var follows = [user.username];
    for (let follow of data)
      follows.push(follow.followed);

    Post.find({ author: { $in: follows } }).sort({ date: -1 }).exec(function(err, posts) {
      if (err) throw err;

      res.render('dashboard', { maxChar: maxChar, user: user, posts: posts });
    });
  });
  //
}

module.exports = router;
