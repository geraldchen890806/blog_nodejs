var md = require("marked"),
    blogDB = require("../models/blog").db,
    tagDB = require("../models/tag").db,
    commnetDB = require("../models/comment").db,
    parse = require("co-body"),
    common = require("./common"),
    extend = require("extend");

exports.index = function *(id, next) {
  if(!/^\d+$/.test(id)) {
    yield next;
    return
  }
  var result = yield blogDB.findByID(id);

  if(result.isDraft && !this.session.login) {
    yield next;
    return;
  }

  if(result && !this.session.login) {
    var res = yield blogDB.saveLog(id);
    if (res) result.times++;
  }

  var comments = yield commnetDB.getByBlogID(id);
  var commonConfig = yield common.config();
  commonConfig.keys = commonConfig.keys.concat(result.title);
  var nextBlog = yield blogDB.findNext(id);
  yield this.render('blogs/blog', extend({ blogs: [result], comments: comments, nextBlog: nextBlog}, commonConfig, { title : result.title +" | "}, {session: this.session}));
};

exports.tags = function *(id, next) {
  var result = yield blogDB.findByTag(id);
  var commonConfig = yield common.config();
  yield this.render('home/index', extend({ blogs: result}, commonConfig, {session: this.session}));
};

exports.comment = function *() {
  var body = yield parse(this);
  var res = yield commnetDB.saveComment(body);
  if (!res) {
    this.body = false;
  } else {
    this.body = true;
  }
};

exports.commentDel = function *(id, next) {
  var body = yield parse(this);
  var blogID = body.blogID;
  var res = yield commnetDB.delComment(id, blogID);
  if (!res) {
    this.body = false;
  } else {
    this.body = true;
  }
};

exports.new = function *(next) {
  if (!this.session.login) {
    yield next;
    return
  };
  var commonConfig = yield common.config();
  yield this.render('blogs/new', extend({ blog: {}},{session: this.session}, commonConfig));
};

exports.edit = function *(id, next) {
  if(!this.session.login || !/^\d+$/.test(id)) {
    this.session.err = {status:500, message: "you have no permission"};
    yield next;
    return;
  }
  var result = yield blogDB.findByID(id);
  if(!result) {
    yield next;
    return;
  }
  var comments = yield commnetDB.getByBlogID(id);
  var commonConfig = yield common.config();
  var tags = [];
  if(result.tags){
    result.tags.forEach(function (v,i) {
      tags.push(v.id);      
    })
  }
  yield this.render('blogs/new', extend({ blog: result, myTags: tags}, commonConfig, {session: this.session}));
};

exports.delete = function *(id, next) {
  if(!this.session.login || !/^\d+$/.test(id)) {
    this.session.err = {status:500, message: "you have no permission"};
    yield next;
    return;
  }
  var result = yield blogDB.delete(id);
  if (result) {
    this.redirect("/");
  }
};

exports.save = function *() {
  if(!this.session.login) {
    this.session.err = {status:500, message: "you have no permission"};
    yield next;
    return;
  }
  var body = yield parse(this);
  var res = "";
  var blogID = body.id;
  if(blogID){
    var blog = yield blogDB.findByID(blogID);
    res = yield blogDB.update(body, !!(blog.isDraft));
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
};