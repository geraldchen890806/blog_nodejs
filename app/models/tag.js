var DB = require("./db");
var db = new DB('tags');
var blog_tagDB = new DB('blog_tag');
var mm = require("moment");
var _ = require("lodash");

db.sqlTags = function*() {
    this.tags = yield this.getList();
    this.changeIndex = false;
    return this.tags;
};

db.getTags = function*() {
    return this.changeIndex ? (yield this.sqlTags()) : this.tags || (yield this.sqlTags());
};

db.save = function*(tag) {
    var self = this,
        db = self.db;
    tag.addTime = mm().format("YYYY-MM-DD hh:mm:ss");
    var res = yield new Promise(function(resolve, reject) {
        var result = [];
        db.serialize(function() {
            var stmt = db.run("insert into tags values (?,?,?)", [null, tag.name, tag.addTime]);
            db.get("SELECT * from tags where name = ?", tag.name, function(err, rows) {
                console.log(rows);
                resolve(rows);
            });
        });
    });
    if (res && res.id) {
        this.changeIndex = true;
        return {
            id: res.insertId,
            name: tag.name
        };
    }
    return false;
};

db.delete = function*(id) {
    var res = yield this.queryStr("delete from tags where id=?", id);
    var res1 = yield this.queryStr("delete from blog_tag where tagID=?", id);
    if (res) {
        this.changeIndex = true;
        return true;
    }
    return false;
};

db.saveBlogTags = function*(data) {
    var db = this.db;
    var res = yield new Promise(function(resolve, reject) {
        var result = [];
        db.serialize(function() {
            var stmt = db.prepare("insert into blog_tag values (?,?,?)");
            _.each(data, function(d) {
                stmt.run(d);
            });
            stmt.finalize();
            db.get("SELECT * from blog_tag where blogID = ? & tagID = ?", [data[0][1], data[0][2]], function(err, rows) {
                resolve(rows);
            });
        });
    });
    if (res && res.id) {
        return true;
    }
    return false;
};

db.deleteBlogTags = function*(blogID) {
    var res = yield this.queryStr("delete from blog_tag where blogID=?", blogID);
    return true;
};

exports.db = db;
