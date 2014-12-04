var blogDB = require("../models/blog").db,
    tagDB = require("../models/tag").db,
    common = require("./common"),
    extend = require("extend");

var blogs = [];

exports.index = function *() {
  var data = {};
  var blogs = yield blogDB.sqlBlogs();
  var commonConfig = yield common.config();
  yield this.render('blogs/index', extend({ blogs: blogs}, commonConfig, {session: this.session}));
};

exports.about = function *() {
  yield this.render('shares/about');
};