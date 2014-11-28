var db = require("./db").db("comments");
var mm = require("moment");

db.getByBlogID = function *(id) {
  var commnets = yield this.queryStr("SELECT * FROM comments where blogID ='" + id + "'");
  commnets.map(function (v, i) {
    var date = mm(v.addTime);
    v.addTime = date.format("LLL");
    return v;
  })
  return commnets.reverse();
}

db.saveComment = function *(comment) {
  comment.id = null
  var date = mm(comment.addTime);
  comment.addTime = mm().format("YYYY-MM-DD hh:mm:ss")
  console.log(comment);
  var res = yield this.queryStr("insert into comments set ?", comment);
  if(res.insertId) return true;
  return false;
}
exports.db = db;