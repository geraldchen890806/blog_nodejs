/**
 * home
**/
var md = require("marked");
var blogDB = require("../models/blog").db;

var blogs = [];

exports.index = function *() {
  var data = {};
  var blogs = yield blogDB.getList();
  yield this.render('index', { blogs: blogs });
}