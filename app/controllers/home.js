/**
 * home
**/
var blogDB = require("../models/blog").db;
var tagDB = require("../models/tag").db;

var blogs = [];

exports.index = function *() {
  var data = {};
  var blogs = blogDB.blogs || (yield blogDB.getBlogs());
  var recentBlogs = yield blogDB.getRecentBlogs();
  var tags = yield tagDB.getTags();
  yield this.render('blogs/index', { blogs: blogs, recentBlogs: recentBlogs, tags: tags});
}