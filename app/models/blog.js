var DB = require('./db');
var db = new DB('blogs');
var tagDB = require('./tag').db;
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

    return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">' + (escaped ? code : escape(code, true)) + '\n</code></pre>\n';
};

db.updateIndex = false;

db.sqlBlogs = function*() {
    if (this.blogs && !this.updateIndex) return this.blogs;
    this.updateIndex = false;
    this.updateDate = new Date().getDate();

    var blogs = yield this.queryStr("SELECT * FROM blogs left join (select blog_tag.blogID,blog_tag.tagID,name as tagName from tags left join blog_tag on tags.id = blog_tag.tagID ) b on blogs.id = b.blogID order by blogs.addTime DESC");
    var res = [];
    if (blogs) {
        blogs.forEach(function(v, i) {
            v.originContent = v.content;
            md.setOptions({
                renderer: render,
                langPrefix: '',
                highlight: function(code) {
                    return highlight(code);
                }
            });
            v.realContent = v.content;
            v.content = md(v.content, {
                gfm: true,
                pedantic: false,
                sanitize: false,
                tables: true,
                breaks: true,
                smartLists: true,
                smartypants: true
            });

            var id = parseInt(v.id);
            if (res[id]) {
                res[id].tags.push({
                    "id": v.tagID,
                    'name': v.tagName
                });
            } else {
                var date = mm(v.addTime);
                v.pubDate = date.format();
                v.addTime = date.format("LL");
                v.tags = [];
                if (v.tagID) {
                    v.tags.push({
                        "id": v.tagID,
                        'name': v.tagName
                    });
                }
                res[id] = v;
            }
            // console.log(res[id]);
        });
    }
    res = res.filter(function(v, i) {
        return !!(v);
    }).reverse();
    this.blogs = res;
    return res;
};

db.getBlogs = function*(start, end) {
    if (new Date().getDate() != this.updateDate) this.updateIndex = true;
    var blogs = yield this.sqlBlogs();
    return blogs.slice(start, end);
};

db.getRecommend = function*() {
    var blogs = yield this.getBlogs();
    return blogs.filter(function(v, i) {
        return v.isRecommend;
    })
};

db.getRecentBlogs = function*() {
    var blogs = yield this.getBlogs();
    return blogs.slice(0, 8);
};

db.find = function*(filter, value) {
    var blogs = yield this.getBlogs();
    blogs = blogs.filter(function(v, i) {
        return (v[filter] == value)
    });
    if (blogs.length) {
        return blogs[0]
    } else {
        return null;
    }
}

db.findNext = function*(id) {
    var blogs = yield this.getBlogs();
    var preID = 0;
    blogs = blogs.filter(function(v, i) {
        if (preID == id) {
            return true
        } else {
            preID = v.id;
            return false;
        }
    });
    if (blogs.length) {
        return blogs[0]
    } else {
        return null;
    }
};


db.findByTag = function*(id) {
    var blogs = yield this.getBlogs();
    return blogs.filter(function(v, i) {
        var flag = false;
        v.tags.forEach(function(t, j) {
            if (t.id == id) {
                flag = true;
            }
        });
        return flag;
    })
};

db.findByTagName = function*(name) {
    var blogs = yield this.getBlogs();
    return blogs.filter(function(v, i) {
        var flag = false;
        v.tags.forEach(function(t, j) {
            if (t.name == name) {
                flag = true;
            }
        });
        return flag;
    })
};

db.updateLocal = function(id, param, value) {
    var blogs = this.blogs;
    blogs.forEach(function(v, i) {
        if (v.id == id) {
            v[param] = value;
        }
    })
};

db.saveLog = function*(id) {
    var res = yield this.queryStr("update blogs set times= times + 1 where id=?", id);
    this.blogs.forEach(function(v, i) {
        if (v.id == id) {
            v.times++;
        }
    })
};
db.saveReTimes = function*(id) {
    var res = yield this.queryStr("update blogs set reTimes= reTimes + 1 where id=?", id);
    this.blogs.forEach(function(v, i) {
        if (v.id == id) {
            v.reTimes++;
        }
    });
    return res;
};

db.save = function*(data) {
    var self = this,
        blog = {};
    var date = mm(new Date());
    blog.title = data.title;
    blog.url = data.url;
    blog.content = data.content;
    blog.addTime = mm().format("YYYY-MM-DD hh:mm:ss") + '';
    blog.editTime = mm().format("YYYY-MM-DD hh:mm:ss") + '';
    blog.userId = data.userId || null;
    blog.times = data.times || 1;
    blog.reTimes = data.reTimes || 1;
    blog.isLocal = data.isLocal ? 1 : 0;
    blog.isRecommend = data.isRecommend ? 1 : 0;
    blog.isDraft = data.isDraft ? 1 : 0;
    var stmt = this.db.prepare;
    var res = yield new Promise(function(resolve, reject) {
        self.db.run(("INSERT INTO blogs VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"), [null, blog.title, blog.url, blog.content, blog.addTime, blog.editTime, blog.userId, blog.times, blog.reTimes, blog.isLocal, blog.isRecommend, blog.isDraft]);
        self.db.get('select * from blogs where url = ?', [blog.url], function(err, rows) {
            resolve(rows);
        });
    });
    this.updateIndex = true;
    if (res && res.id) {
        var blogID = res.id;
        var tags = [];
        data.tags = !!(data.tags && data.tags instanceof Array) ? data.tags : [data.tags];
        data.tags.forEach(function(v, i) {
            if (v) tags.push([null, blogID, parseInt(v)]);
        });
        if (tags.length) {
            var resSave = yield tagDB.saveBlogTags(tags);
        }
        this.updateIndex = true;
        return true;
    }
    return true;
};

db.update = function*(data, isDrafted) {
    var blog = {},
        self = this;
    var date = mm(new Date());
    blog.editTime = mm().format("YYYY-MM-DD hh:mm:ss");
    blog.title = data.title;
    blog.url = data.url;
    blog.content = data.content;
    blog.isLocal = data.isLocal ? 1 : 0;
    blog.isRecommend = data.isRecommend ? 1 : 0;
    blog.isDraft = data.isDraft ? 1 : 0;
    if (!blog.isDraft && isDrafted) {
        blog.addTime = blog.editTime;
    }
    var res = yield new Promise(function(resolve, reject) {
        self.db.run("update blogs set title = ?, url =?,content=?,editTime=?,isRecommend=?,isDraft=? where id = ?", [blog.title, blog.url, blog.content, blog.editTime, blog.isRecommend, blog.isDraft, data.id]);
        self.db.get('select * from blogs where url = ?', [blog.url], function(err, rows) {
            resolve(rows);
        });
    });
    this.updateIndex = true;
    // var res = yield this.queryStr("update blogs set ? where id= ?", [blog, data.id]);
    if (res && res.id) {
        var blogID = data.id;
        var tags = [];
        data.tags = !!(data.tags && data.tags instanceof Array) ? data.tags : [data.tags];
        data.tags.forEach(function(v, i) {
            if (v) tags.push([null, blogID, parseInt(v)]);
        })
        var resDel = yield tagDB.deleteBlogTags(blogID);
        var resSave = true;
        if (tags.length) {
            resSave = yield tagDB.saveBlogTags(tags);
        }
        self.updateIndex = true;
        if (!(resDel && resSave)) return "tagFails";
        return true;
    }
    return false;
};

db.delete = function*(id) {
    var res = yield this.queryStr("delete from blogs where id=?", id);
    var resTag = yield tagDB.deleteBlogTags(id);
    this.updateIndex = true;
    return true;
};

exports.db = db;
