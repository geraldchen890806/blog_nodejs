var db = require("./db").db("users");

db.login = function * (data){
  var result = yield this.queryStr("select * from users where name = ? and password = ?", [data.name, data.password]);
  return result;
}

exports.db = db;
