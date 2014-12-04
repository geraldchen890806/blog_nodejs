var blogDB = require("../models/blog").db,
    tagDB = require("../models/tag").db,
    parse = require("co-body"),
    md = require("marked");

exports.config = function *() {
  var recentBlogs = yield blogDB.getRecentBlogs();
  var tags = yield tagDB.getTags();
  return {recentBlogs: recentBlogs, tags: tags}
}

exports.editor = function *() {
  var body = yield parse(this);
  this.body = md(body.data);
}