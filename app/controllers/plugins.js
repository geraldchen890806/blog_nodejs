exports.index = function *() {
  yield this.render("plugins/mk",{session: this.session})
};
