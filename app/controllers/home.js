var blogDB = require("../models/blog").db,
    tagDB = require("../models/tag").db,
    common = require("./common"),
    extend = require("extend"),
    gravatar = require("gravatar");

var blogs = [];

exports.index = function *() {
  var blogs = yield blogDB.getBlogs();
  var commonConfig = yield common.config();
  yield this.render('blogs/index', extend({ blogs: blogs}, commonConfig, {session: this.session}));
};

exports.recommend = function *() {
  var blogs = yield blogDB.getRecommend();
  var commonConfig = yield common.config();
  yield this.render('blogs/index', extend({ blogs: blogs}, commonConfig, {session: this.session}));
}

exports.about = function *() {
  var url = gravatar.url('geraldchen890806@gmail.com', {s: '200', r: 'pg', d: '404'});
  yield this.render('shares/about', {imageUrl: url, session: this.session});
};