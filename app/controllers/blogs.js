var md = require("marked");
var blogDB = require("../models/blog").db;

exports.index = function (req, res, next) {
  console.log(req.params.id)
  blogDB.findByID(req.params.id, function (err, data) {
    data.map(function(v, i){
      v.content = md(v.content)
      return v;
    })
    if (data.length) {
      res.render('blog', { blog: data[0] });
    } else {
      res.status(404).send('Sorry, we cannot find that!');
    }
  })
}