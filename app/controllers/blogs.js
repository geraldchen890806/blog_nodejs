var md = require("marked");
var blogDB = require("../models/blog").db;

exports.index = function (req, res, next) {
  blogDB.findByID(req.params.id, function (err, data) {
    data.map(function(v, i){
      v.content = md(v.content)
      return v;
    })
    if (data.length) {
      blogDB.query("update `blogs` set `times`="+ (parseInt(data[0].times) + 1) +" where `id`=" + req.params.id, function(err, data){
        console.log(data)
      })
      res.render('blog', { blog: data[0] });
    } else {
      res.status(404).send('Sorry, we cannot find that!');
    }
  })
}