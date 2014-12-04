var db = require('./db').db('blogs');
var tagDB = require('./tag').db;
var md = require("marked");
var mm = require("moment");

db.updateIndex = false;

db.sqlBlogs = function *() {
  this.updateIndex = false;
  var blogs = yield this.queryStr("SELECT * FROM blogs left join (select blog_tag.blogID,blog_tag.tagID,name as tagName from tags left join blog_tag on tags.id = blog_tag.tagID ) b on blogs.id = b.blogID order by blogs.addTime DESC");
  var res = [];
  blogs.forEach(function (v, i) {
    v.originContent = v.content
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
  return this.updateIndex ? (yield this.sqlBlogs()) : this.blogs || (yield this.sqlBlogs());
}

db.getRecentBlogs = function *() {
  var blogs = yield this.getBlogs();
  return blogs.slice(0, 15);
}

db.findByID = function *(id) {
  var blogs = yield this.getBlogs();
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
  var blogs = yield this.getBlogs();
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

db.saveLog = function *(id) {
    yield this.queryStr("update blogs set times= times + 1 where id=?",id)
}

db.save = function *(data) {
  var blog = {};
  var date = mm(new Date());
  blog.addTime = mm().format("YYYY-MM-DD hh:mm:ss");
  blog.title = data.title;
  blog.content = data.content;
  console.log(blog);
  var res = yield this.queryStr("insert into blogs set ?", blog);
  if (res && res.insertId) {
    var blogID = res.insertId;
    var tags = [];
    data.tags = !!(data.tags && data.tags instanceof Array) ? data.tags : [data.tags];
    data.tags.forEach(function(v, i) {
      tags.push([null, blogID, parseInt(v)]);
    })
    var res = yield tagDB.saveBlogTags(tags);
    if(!res.insertId) return "tagFails";
    this.updateIndex = true;
    return true;
  }
  return false;
}

db.update = function *(data) {
  var blog = {};
  var date = mm(new Date());
  blog.editTime = mm().format("YYYY-MM-DD hh:mm:ss");
  blog.title = data.title;
  blog.content = data.content;
  console.log("id", data.id);
  var res = yield this.queryStr("update blogs set ? where id= ?", [blog, data.id]);
  if (res && res.changedRows) {
    var blogID = data.id;
    var tags = [];
    data.tags = !!(data.tags && data.tags instanceof Array) ? data.tags : [data.tags];
    data.tags.forEach(function(v, i) {
      if(v) tags.push([null, blogID, parseInt(v)]);
    })
    var resDel = yield tagDB.deleteBlogTags(blogID);
    var resSave = true;
    if (tags.length) {
      resSave = yield tagDB.saveBlogTags(tags);
    }
    if(!(resDel && resSave)) return "tagFails";
    this.updateIndex = true;
    return true;
  }
  return false;
}


exports.db = db;
