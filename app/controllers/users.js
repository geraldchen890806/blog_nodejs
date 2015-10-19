var userDB = require("../models/user").db,
    parse = require("co-body");

exports.index = function*() {
    yield this.render("users/login", {
        session: this.session.cookie
    });
};

exports.login = function*() {
    var body = yield parse(this);
    var res = yield userDB.login(body);
    if (res.length) {
        this.session.cookie.login = true;
        this.session.cookie.loginData = res[0];
        this.session.cookie.saveLogin = !!(body.saveLogin);
        this.redirect("/");
    } else {
        this.session.cookie.loginData = null;
        this.redirect("login")
    }
};

exports.logout = function*() {
    this.session.cookie.login = false;
    if (!this.session.cookie.saveLogin) this.session.cookie.loginData = null;
    this.redirect("/");
};
