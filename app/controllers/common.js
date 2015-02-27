var blogDB = require("../models/blog").db,
    tagDB = require("../models/tag").db,
    parse = require("co-body"),
    md = require("marked");

exports.config = function *() {
  var recentBlogs = yield blogDB.getRecentBlogs();
  var tags = yield tagDB.getTags();
  return {recentBlogs: recentBlogs, tags: tags, title: ""}
};

exports.editor = function *() {
  var body = yield parse(this);
  this.body = md(body.data);
};

exports.checkPermission = function *(session, next) {
  if(session.login) {
    session.err = {status:500, message: "you have no permission123"};
    return false;
  }
  return true;
};