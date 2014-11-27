

var db = require("../models/user").db;

exports.index = function(req, res, next) {
  //console.log(db)
  db.getList(function(err, data){
    res.render("users", {data: data})
  })
}

exports.login = function(req, res, next) {
  
}