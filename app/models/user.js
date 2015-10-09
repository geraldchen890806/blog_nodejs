var DB = require("./db");
var db = new DB('users');
db.login = function*(data) {
    var result = yield this.queryStr("select * from users where name = ? and password = ?", [data.name, data.password]);
    return result;
};

exports.db = db;
