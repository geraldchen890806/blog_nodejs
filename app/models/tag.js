var db = require("./db").db("tags");


db.getTags = function *() {
  if (!this.tags) {
    this.tags = yield this.getList();
  }
  return this.tags;
}

db.save = function *(tags) {
  var res = yield this.queryStr("insert into blog_tag values ?", [tags]);
  console.log("res", res);
  if(res.insertId) return true;
  return false;
}

exports.db = db;