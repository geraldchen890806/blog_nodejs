var md = require("marked"),
    blogDB = require("../models/blog").db,
    tagDB = require("../models/tag").db,
    commnetDB = require("../models/comment").db,
    parse = require("co-body"),
    common = require("./common"),
    extend = require("extend");

exports.index = function*(url, next) {
    //if(!/^\d+$/.test(id)) {
    //  yield next;
    //  return
    //}
    var result = yield blogDB.find("url", url);
    var id = result.id;
    if (result.isDraft && !this.session.cookie.login) {
        yield next;
        return;
    }

    if (result && !this.session.cookie.login) {
        var res = yield blogDB.saveLog(id);
        if (res) result.times++;
    }

    var comments = yield commnetDB.getByBlogID(id);
    var commonConfig = yield common.config();
    commonConfig.keys = commonConfig.keys.concat(result.title);
    var nextBlog = yield blogDB.findNext(id);
    yield this.render('blogs/blog', extend({
        blogs: [result],
        comments: comments,
        nextBlog: nextBlog
    }, commonConfig, {
        title: result.title + " | "
    }, {
        session: this.session.cookie
    }));
};

exports.tags = function*(name, next) {
    var result = yield blogDB.findByTagName(name);
    var commonConfig = yield common.config();
    yield this.render('home/index', extend({
        blogs: result
    }, commonConfig, {
        session: this.session.cookie
    }));
};

exports.saveTag = function*() {
    var body = yield parse(this);
    var res = yield tagDB.save(body);
    if (!res) {
        this.body = false;
    } else {
        this.body = res;
    }
};

exports.delTag = function*(id, next) {
    var body = yield parse(this);
    var res = yield tagDB.delete(body.id);
    if (!res) {
        this.body = false;
    } else {
        this.body = true;
    }
};

exports.comment = function*() {
    var body = yield parse(this);
    var res = yield commnetDB.saveComment(body);
    if (!res) {
        this.body = false;
    } else {
        this.body = true;
    }
};

exports.commentDel = function*(id, next) {
    var body = yield parse(this);
    var blogID = body.blogID;
    var res = yield commnetDB.delComment(id, blogID);
    if (!res) {
        this.body = false;
    } else {
        this.body = true;
    }
};

exports.new = function*(next) {
    if (!this.session.cookie.login) {
        this.redirect('/user/login');
        return
    };
    var commonConfig = yield common.config();
    yield this.render('blogs/new', extend({
        blog: {}
    }, {
        session: this.session.cookie
    }, commonConfig));
};

exports.edit = function*(url, next) {
    if (!this.session.cookie.login) {
        this.redirect('/user/login');
        return;
    }
    var result = yield blogDB.find("url", url);
    if (!result) {
        yield next;
        return;
    }
    var id = result.id;
    var comments = yield commnetDB.getByBlogID(id);
    var commonConfig = yield common.config();
    var tags = [];
    if (result.tags) {
        result.tags.forEach(function(v, i) {
            tags.push(v.id);
        })
    }
    yield this.render('blogs/new', extend({
        blog: result,
        myTags: tags
    }, commonConfig, {
        session: this.session.cookie
    }));
};

exports.delete = function*(id, next) {
    if (!this.session.cookie.login) {
        this.redirect('/user/login');
        return;
    }
    var result = yield blogDB.delete(id);
    if (result) {
        this.redirect("/");
    }
};

exports.save = function*() {
    if (!this.session.cookie.login) {
        this.redirect('/user/login');
        return;
    }
    var body = yield parse(this);
    var res = "";
    var blogID = body.id;
    var url = body.url;
    if (blogID) {
        var blog = yield blogDB.find("id", blogID);
        res = yield blogDB.update(body, !!(blog.isDraft));
    } else {
        res = yield blogDB.save(body);
    }
    console.log(res, blogID);
    var herf = "/";
    if (res && blogID) {
        herf = "/blog/" + url;
        this.session.cookie.newUpdateEvent = true;
    } else if (res && !blogID) {
        herf = "/";
        this.session.cookie.newUpdateEvent = true;
    } else if (!res && blogID) {
        herf = "/blog/eidt/" + url;
    } else if (!res && !blogID) {
        herf = "/blog/new";
    }
    this.redirect(herf);
};

exports.saveReTimes = function*() {
    var body = yield parse(this);
    var blogID = body.blogID;
    var res = yield blogDB.saveReTimes(blogID);
    this.body = res;
};
