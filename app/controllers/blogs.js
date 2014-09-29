var md = require("marked");
var blogDB = require("../models/blog").db;
var tagDB = require("../models/tag").db;

exports.index = function *() {
  var id = this.url.replace(/^\/blog\//,"");
  var result = yield blogDB.findByID(id);
  if(this.ip !="127.0.0.1") {
    yield blogDB.queryStr("update `blogs` set `times`="+ (parseInt(result.times) + 1) +" where `id`=" + id)
  }
  var recentBlogs = yield blogDB.getRecentBlogs();
  var tags = yield tagDB.getTags();
  yield this.render('blogs/blog', { blog: result, recentBlogs: recentBlogs, tags: tags});
}

exports.tags = function *() {
  var id = this.url.replace(/^\/blog\/tag\//,"");
  var result = yield blogDB.findByTag(id);
  var recentBlogs = yield blogDB.getRecentBlogs();
  var tags = yield tagDB.getTags();
  yield this.render('blogs/index', { blogs: result, recentBlogs: recentBlogs, tags: tags});
}