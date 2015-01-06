var blogDB = require("../models/blog").db,
    tagDB = require("../models/tag").db,
    common = require("./common"),
    extend = require("extend"),
    gravatar = require("gravatar"),
    rss = require('rss');

var blogs = [];

var feed = new rss({
  title: '陈佳人',
  description: '人生是一场独自修行的道路',
  feed_url: 'http://renjm.com/feed',
  site_url: 'http://renjm.com',
  image_url : gravatar.url('geraldchen890806@gmail.com', {s: '200', r: 'pg', d: '404'}),
})

exports.index = function *() {
  var blogs = yield blogDB.getBlogs();
  var commonConfig = yield common.config();

  blogs.forEach(function (v, i) {
    feed.item({
      title: v.title,
      description: v.content.substring(1,20),
      url: "http://renjm.com/blog/" + v.id,
      date: v.addTime
    })
  })

  var fs = require('fs')
  fs.writeFile("public/feed.xml",feed.xml())

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

