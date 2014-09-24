var md = require("marked");
var blogDB = require("../models/blog").db;

exports.index = function *() {
  var id = this.url.replace(/^\/blog\//,"");
  var result = yield blogDB.findByID(id)
  result.map(function(v, i){
    v.content = md(v.content)
    return v;
  })
  console.log(result)
  if(this.ip !="127.0.0.1") {
    yield blogDB.queryStr("update `blogs` set `times`="+ (parseInt(result[0].times) + 1) +" where `id`=" + id)
  }
  yield this.render('blog', { blog: result[0] });

}