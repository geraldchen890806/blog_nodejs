var md = require("marked"),
    blogDB = require("../models/blog").db,
    tagDB = require("../models/tag").db,
    commnetDB = require("../models/comment").db,
    parse = require("co-body"),
    common = require("./common"),
    extend = require("extend");

exports.index = function *() {
  var id = this.url.replace(/^\/blog\//,"");
  if(!/^\d+$/.test(id)) {
    throw new Error("error");
  }
  var result = yield blogDB.findByID(id);
  if(this.ip !="::1" && result) {
    yield blogDB.saveLog(id);
  }
  var comments = yield commnetDB.getByBlogID(id);
  var commonConfig = yield common.config();
  yield this.render('blogs/blog', extend({ blog: result, comments: comments}, commonConfig, {session: this.session}));
}

exports.tags = function *() {
  console.log(this.request.query)
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
  if (!this.session.login) return;
  var commonConfig = yield common.config();
  yield this.render('blogs/new', extend({ blog: {}},{session: this.session}, commonConfig));
}

exports.edit = function *() {
  if (!this.session.login) return;
  var id = this.url.replace(/^\/blog\/edit\//,"");
  if(!/^\d+$/.test(id)) {
    throw new Error("error");
    return;
  }
  var result = yield blogDB.findByID(id);
  var comments = yield commnetDB.getByBlogID(id);
  var commonConfig = yield common.config();
  var tags = [];
  if(result.tags){
    result.tags.forEach(function (v,i) {
      tags.push(v.id);      
    })
  }
  yield this.render('blogs/new', extend({ blog: result, myTags: tags}, commonConfig, {session: this.session}));
}

exports.save = function *() {
  if (!this.session.login) return;
  var body = yield parse(this);
  var res = "";
  var blogID = body.id;
  if(blogID){
    res = yield blogDB.update(body);
  } else {
    res = yield blogDB.save(body);
  }

  var url = "/";
  if (res && blogID) {
    url = "/blog/" + blogID;
    this.session.newUpdateEvent = true;
  } else if (res && !blogID){
    url = "/";
    this.session.newUpdateEvent = true;
  } else if (!res && blogID) {
    url = "blog/eidt/" + blogID;
  } else if (!res && !blogID) {
    url = "blog/new";
  }
  this.redirect(url);
}