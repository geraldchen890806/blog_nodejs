var db = require('./db').db('blogs');
var tagDB = require('./tag').db;
var md = require("marked");
var mm = require("moment");
var highlight = require("../help/highlight");
var render = new md.Renderer();

render.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return (escaped ? code : escape(code, true));
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
}

db.updateIndex = false;

db.sqlBlogs = function *() {
  if(this.blogs && !this.updateIndex) return this.blogs;
  this.updateIndex = false;
  this.updateDate = new Date().getDate();
  var blogs = yield this.queryStr("SELECT * FROM blogs left join (select blog_tag.blogID,blog_tag.tagID,name as tagName from tags left join blog_tag on tags.id = blog_tag.tagID ) b on blogs.id = b.blogID order by blogs.addTime DESC");
  var res = [];
  blogs.forEach(function (v, i) {
    v.originContent = v.content;
    md.setOptions({
      renderer: render,
      langPrefix: '',
      highlight: function(code){
        return highlight(code);
      }
    });
    v.content = md(v.content,{
      gfm: true,
      pedantic: false,
      sanitize: false,
      tables: true,
      breaks: true,
      smartLists: true,
      smartypants: true
    });

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
  if(new Date().getDate() != this.updateDate) this.updateIndex = true;
  return yield this.sqlBlogs();
}

db.getRecommend = function *() {
  var blogs = yield this.getBlogs();
  return blogs.filter(function(v, i) {
    return v.isRecommend;
  })
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
  var res = yield this.queryStr("update blogs set times= times + 1 where id=?",id);
  this.blogs.forEach(function (v, i) {
    if(v.id == id) {
      v.times++;
    }
  })
}

db.save = function *(data) {
  var blog = {};
  var date = mm(new Date());
  blog.addTime = mm().format("YYYY-MM-DD hh:mm:ss");
  blog.title = data.title;
  blog.content = data.content;
  blog.isLocal = data.isLocal;
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
  blog.isLocal = data.isLocal ? 1 : 0;
  blog.isRecommend = data.isRecommend ? 1 : 0;;
  console.log(blog)
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

db.delete = function *(id) {
  var res = yield this.queryStr("delete from blogs where id=?", id);
  var resTag = yield tagDB.deleteBlogTags(id);
  console.log(res);
  console.log(resTag);
  return true;
}

exports.db = db;
