var DB = require("./db");
var db = new DB("comments");
var mm = require("moment");
var blogDB = require("./blog").db;

db.getByBlogID = function*(id) {
    var blog = yield blogDB.findByID(id);
    if (blog.comments) return blog.comments;
    var comments = yield this.queryStr("SELECT * FROM comments where blogID ='" + id + "'");
    comments.map(function(v, i) {
        var date = mm(v.addTime);
        v.addTime = date.format("LLL");
        return v;
    });
    blogDB.updateLocal(id, 'comments', comments.reverse());
    return comments.reverse();
};

db.saveComment = function*(comment) {
    comment.id = null;
    var self = this,
        date = mm(comment.addTime);
    comment.addTime = mm().format("YYYY-MM-DD hh:mm:ss");
    console.log(comment);
    var res = yield new Promise(function(resolve, reject) {
        self.db.run("insert into comments values (?,?,?,?,?,?,?)", [null, comment.blogID, comment.name, comment.email, comment.content, comment.addTime, comment.relID]);
        self.db.get('select * from comments where blogID = ? and name = ?', [comment.blogID, comment.name], function(err, rows) {
            resolve(rows);
        });
    });
    var blog = yield blogDB.findByID(comment.blogID);
    comment.id = res.insertId;
    blog.comments.push(comment);
    if (res.id) return true;
    return false;
};

db.delComment = function*(id, blogID) {
    var res = yield this.queryStr("delete from comments where id=?", id);
    var blog = yield blogDB.findByID(id);
    delete blog.comments;
    return true;
};
exports.db = db;
