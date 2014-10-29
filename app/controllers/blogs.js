var md = require("marked");
var blogDB = require("../models/blog").db;
var tagDB = require("../models/tag").db;
var commnetDB = require("../models/comment").db;
var parse = require("co-body");

exports.index = function *() {
  var id = this.url.replace(/^\/blog\//,"");
  var result = yield blogDB.findByID(id);
  if(!/^\d+$/.test(id)) {
    throw new Error("error");
  }
  if(this.ip !="127.0.0.1" && result && result.length) {
    yield blogDB.queryStr("update `blogs` set `times`="+ (parseInt(result.times) + 1) +" where `id`=" + id)
  }
  var recentBlogs = yield blogDB.getRecentBlogs();
  var tags = yield tagDB.getTags();
  var comments = yield commnetDB.getByBlogID(id);
  yield this.render('blogs/blog', { blog: result, recentBlogs: recentBlogs, tags: tags, comments: comments});
}

exports.tags = function *() {
  var id = this.url.replace(/^\/blog\/tag\//,"");
  var result = yield blogDB.findByTag(id);
  var recentBlogs = yield blogDB.getRecentBlogs();
  var tags = yield tagDB.getTags();
  yield this.render('blogs/index', { blogs: result, recentBlogs: recentBlogs, tags: tags});
}

exports.comment = function *() {
  var body = yield parse(this);
  console.log(body);
  var res = yield commnetDB.saveComment(body);
  if (res) {
    this.body = true;
  } else {
    this.body = false;
  }
}