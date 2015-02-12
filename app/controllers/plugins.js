var extend = require("extend"),
    common = require("./common");

exports.index = function *() {
  var commonConfig = yield common.config();
  yield this.render("plugins/index",extend(commonConfig, {session: this.session}));
};
