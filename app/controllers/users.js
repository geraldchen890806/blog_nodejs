var userDB = require("../models/user").db,
    parse = require("co-body");

exports.index = function *() {
  yield this.render("users/login",{session: this.session});
};

exports.login = function *() {
  var body = yield parse(this);
  var res = yield userDB.login(body);
  if (res.length) {
    this.session.login = true;
    this.session.loginData = res[0];
    this.session.saveLogin = !!(body.saveLogin);
    this.redirect("/");
  } else {
    this.session.loginData = null;
    this.redirect("login")
  }
};

exports.logout = function *() {
  this.session.login = false;
  if(!this.session.saveLogin) this.session.loginData = null;
  this.redirect("/");
};