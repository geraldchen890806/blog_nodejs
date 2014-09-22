/**
 * home
**/
var md = require("marked");
var blogDB = require("../models/blog").db;

var blogs = [{'title': 'test1', 'content': 'testttestttestttestttestttestttestttestttestttestttestttestttestttestttestttestt','tag':'test','addTime': '2014:09-22 11:11:11'},
             {'title': 'test2', 'content': 'testttestttestttestttestttestttestttestttestttestttestttestttestttestttestttestt','tag':'test','addTime': '2014:09-22 11:11:11'},
             {'title': 'test3', 'content': 'testttestttestttestttestttestttestttestttestttestttestttestttestttestttestttestt','tag':'test','addTime': '2014:09-22 11:11:11'},
            ]

exports.index = function (req, res, next) {
  blogDB.getList(function (err, data) {
    data.map(function(v, i){
      v.content = md(v.content)
      return v;
    })
    res.render('index', { blogs: data });
  })
}