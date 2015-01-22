var db = require("./db").db("tags");

db.sqlTags = function *() {
  this.tags = yield this.getList();
  return this.tags;
};

db.getTags = function *() {
  return this.tags || (yield this.sqlTags());
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