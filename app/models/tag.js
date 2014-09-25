var db = require("./db").db("tags");


db.getTags = function *() {
  if (!this.tags) {
    this.tags = yield this.getList();
  }
  return this.tags;
}
exports.db = db;