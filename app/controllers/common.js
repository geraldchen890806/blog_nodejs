var blogDB = require("../models/blog").db;
var tagDB = require("../models/tag").db;

exports.config = function *(){
  var recentBlogs = yield blogDB.getRecentBlogs();
  var tags = yield tagDB.getTags();
  return {recentBlogs: recentBlogs, tags: tags}
}