var blogDB = require("../models/blog").db,
    tagDB = require("../models/tag").db,
    common = require("./common"),
    extend = require("extend"),
    gravatar = require("gravatar");

var blogs = [];

exports.index = function *() {
  var data = {};
  var blogs = yield blogDB.sqlBlogs();
  var commonConfig = yield common.config();
  yield this.render('blogs/index', extend({ blogs: blogs}, commonConfig, {session: this.session}));
};

exports.about = function *() {
  var url = gravatar.url('geraldchen890806@gmail.com', {s: '200', r: 'pg', d: '404'});
  yield this.render('shares/about', {imageUrl: url, session: this.session});
};