var db = require("./db").db("tags");


db.sqlTags = function *() {
  this.tags = yield this.getList();
  return this.tags;
}

db.getTags = function *() {
  return this.tags || this.sqlTags();
}
exports.db = db;