var db = require("./db").db("tags");
var mm = require("moment");

db.sqlTags = function *() {
  this.tags = yield this.getList();
  this.changeIndex = false;
  return this.tags;
};

db.getTags = function *() {
  return this.changeIndex ? (yield this.sqlTags()) : this.tags || (yield this.sqlTags());
};

db.save = function *(tag) {
  tag.addTime = mm().format("YYYY-MM-DD hh:mm:ss");
  var res = yield this.queryStr("insert into tags set ?", tag);
  if (res && res.insertId) {
    this.changeIndex = true;
    return {id: res.insertId, name: tag.name};
  }
  return false;
};

db.delete = function *(id) {
  var res = yield this.queryStr("delete from tags where id=?", id);
  var res1 = yield this.queryStr("delete from blog_tag where tagID=?", id);
  if (res) {
    this.changeIndex = true;
    return true;
  }
  return false;
};

db.saveBlogTags = function *(data) {
  var res = yield this.queryStr("insert into blog_tag values ?", [data]);
  if (res && res.insertId) {
    return true;
  }
  return false;
};

db.deleteBlogTags = function *(blogID) {
  var res = yield this.queryStr("delete from blog_tag where blogID=?", blogID);
  return true;
};

exports.db = db;