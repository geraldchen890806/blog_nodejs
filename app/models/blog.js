var db = require('./db').db('blogs');
var tagDB = require('./tag').db;
var md = require("marked");
var mm = require("moment");

db.sqlBlogs = function *() {
  var blogs = yield this.queryStr("SELECT * FROM blogs join (select blog_tag.blogID,blog_tag.tagID,name as tagName from tags inner join blog_tag where tags.id = blog_tag.tagID ) b where blogs.id = b.blogID order by blogs.addTime DESC");
  var res = [];
  blogs.forEach(function (v, i) {
    v.content = md(v.content)
    var id = parseInt(v.id);
    if(res[id]) {
      res[id].tags.push({"id": v.tagID, 'name': v.tagName});
    } else {
      var date = mm(v.addTime);
      v.addTime = date.format("LL");
      v.tags= []
      if(v.tagID) {
        v.tags.push({"id": v.tagID, 'name': v.tagName});
      }
      res[id] = v;
    }
  });
  res = res.filter(function (v, i) {
    return !!(v);
  }).reverse();
  this.blogs = res;
  return res;
}

db.getBlogs = function *() {
  return this.blogs || (yield this.sqlBlogs());
}

db.getRecentBlogs = function *() {
  var blogs = this.blogs || (yield this.sqlBlogs());
  return blogs.slice(0, 15);
}

db.findByID = function *(id) {
  var blogs = this.blogs || (yield this.sqlBlogs());
  blogs = blogs.filter(function (v ,i) {
    return (v.id == id)
  })
  if (blogs.length) {
    return blogs[0]
  } else {
    return null;
  }
}

db.findByTag = function *(id) {
  var blogs = this.blogs || (yield this.sqlBlogs());
  return blogs.filter(function (v ,i) {
    var flag = false;
    v.tags.forEach(function (t, j){
      if (t.id == id) {
        flag = true;
      }
    });
    return flag;
  })
}

exports.db = db;
