var md = require("marked"),
    blogDB = require("../models/blog").db,
    tagDB = require("../models/tag").db,
    commnetDB = require("../models/comment").db,
    parse = require("co-body"),
    common = require("./common"),
    extend = require("extend");

exports.index = function *() {
  var id = this.url.replace(/^\/blog\//,"");
  var result = yield blogDB.findByID(id);
  if(!/^\d+$/.test(id)) {
    throw new Error("error");
  }
  if(this.ip !="::1" && result) {
    yield blogDB.saveLog(id);
  }
  var comments = yield commnetDB.getByBlogID(id);
  var commonConfig = yield common.config();
  yield this.render('blogs/blog', extend({ blog: result, comments: comments}, commonConfig, {session: this.session}));
}

exports.tags = function *() {
  var id = this.url.replace(/^\/blog\/tag\//,"");
  var result = yield blogDB.findByTag(id);
  var commonConfig = yield common.config();
  yield this.render('blogs/index', extend({ blogs: result}, commonConfig, {session: this.session}));
}

exports.comment = function *() {
  var body = yield parse(this);
  var res = yield commnetDB.saveComment(body);
  if (res) {
    this.body = true;
  } else {
    this.body = false;
  }
}

exports.new = function *() {
  var commonConfig = yield common.config();
  yield this.render('blogs/new', extend({session: this.session}, commonConfig));
}

exports.save = function *() {
  var body = yield parse(this);
  var res = yield blogDB.save(body);
  console.log("saveRes", res);
  if (res) {
    this.redirect("/")
  } else {
    this.redirect("/blog/new")
  }
}