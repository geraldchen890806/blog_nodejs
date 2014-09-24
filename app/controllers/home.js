/**
 * home
**/
var blogDB = require("../models/blog").db;

var blogs = [];

exports.index = function *() {
  var data = {};
  var blogs = yield blogDB.getBlogs();
  yield this.render('index', { blogs: blogs });
}