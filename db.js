var mongoose = require('mongoose');

var dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

var userSchema = mongoose.Schema({
    email: String,
    username: String,
    password: String,
    joined: Number
});
var User = mongoose.model('user', userSchema);

var postSchema = mongoose.Schema({
    author: String,
    content: String,
    date: Number
});
var Post = mongoose.model('post', postSchema);

var followSchema = mongoose.Schema({
    user: String,
    followed: String
});
var Follow = mongoose.model('follow', followSchema);

module.exports = {
  db: mongoose,
  User: User,
  Post: Post,
  Follow: Follow
};
