var userDB = require("../models/user").db,
    parse = require("co-body");

exports.index = function *() {
  yield this.render("users/login")
}

exports.login = function *() {
  var body = yield parse(this);
  var res = yield userDB.login(body);
  if (res.length) {
    this.session.login = true;
    this.session.loginData = res[0];
    this.redirect("/");
  } else {
    this.redirect("login")
  }
}