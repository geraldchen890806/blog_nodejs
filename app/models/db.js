var sqlite3 = require("sqlite3").verbose();
var fs = require("fs");

function Database(file) {
    var path = 'db/' + file + '.db';
    var db = this.db = new sqlite3.Database(path);
    this.tabName = file;
    // fs.readFile('sql/' + file + '.sql', 'utf8', function(a, data) {
    //         console.log(data);
    //         db.run(data);
    //     })
    if (!fs.existsSync(path)) {
        if (file == 'blogs') {
            db.serialize(function() {
                db.run("CREATE TABLE 'blogs' ('id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'title' TEXT NOT NULL,'url' TEXT NOT NULL,'content' TEXT NOT NULL,'addTime' datetime NOT NULL,'editTime' datetime DEFAULT NULL,'userID' INTEGER DEFAULT NULL,'times' INTEGER DEFAULT '0','reTimes' INTEGER DEFAULT '0','isLocal' INTEGER DEFAULT NULL,'isRecommend' INTEGER DEFAULT NULL,'isDraft' INTEGER DEFAULT '0')");
            });
        } else if (file == 'blog_tag') {
            db.serialize(function() {
                db.run("CREATE TABLE 'blog_tag' ('id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'blogID' INTEGER NOT NULL,'tagID' INTEGER NOT NULL)");
            });
        } else if (file == 'tags') {
            db.serialize(function() {
                db.run("CREATE TABLE 'tags' ('id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'name' TEXT NOT NULL,'addTime' TEXT NOT NULL)");
            });
        } else if (file == 'comment') {
            db.serialize(function() {
                db.run("CREATE TABLE 'comment' ('id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'blogID' INTEGER NOT NULL,'addTime' TEXT NOT NULL,'name' TEXT NOT NULL,'email' TEXT NOT NULL,'content' TEXT NOT NULL,'addTime' TEXT NOT NULL),'relID' TEXT NOT NULL");
            });
        } else if (file == 'users') {
            db.serialize(function() {
                db.run("CREATE TABLE 'users' ('userID' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'name' INTEGER NOT NULL,'password' TEXT NOT NULL,'email' TEXT NOT NULL)");
            });
        }
    }
}

Database.prototype = {
    queryStr: function*(str, options) {
        console.log('query db ******' + str);
        var db = this.db;
        return yield new Promise(function(resolve, reject) {
            db.serialize(function() {
                db.all(str, options, function(err, rows) {
                    resolve(rows);
                });
            });
        });
    },

    getList: function() {
        var queryStr = "SELECT * FROM " + this.tabName;
        return this.queryStr(queryStr);
    },

    findByID: function(id) {
        var queryStr = "SELECT * FROM " + this.tabName + " where id = " + id;
        return this.queryStr(queryStr);
    },
}

Database.prototype.create = function() {
    console.log("create database");
    var db = this.db;
    db.serialize(function() {
        db.run('CREATE TABLE items (' +
            'title TEXT,' +
            'description TEXT,' +
            'level INTEGER,' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT' +
            ')'
        );
    });
};

Database.prototype.add = function(title, description) {
    console.log("insert into database");
    var db = this.db;
    db.serialize(function() {
        var stmt = db.prepare("INSERT INTO items VALUES (?,?,?,?)");
        stmt.run([title, description, 0]);
        stmt.finalize();
    });
};

Database.prototype.queryall = function(fn) {
    console.log("query database");
    var db = this.db;
    db.serialize(function() {
        db.all("SELECT title, description, level, id FROM items ORDER BY level ASC", function(err, rows) {
            if (err) {
                console.log(err)
            } else {
                fn(rows);
            }
        });
    });
};

Database.prototype.query = function(id, fn) {
    console.log("query id database");
    var db = this.db;
    db.serialize(function() {
        db.each("SELECT title, description, level, id FROM items WHERE id=? LIMIT 1", id, function(err, row) {
            if (err) {
                console.log(err)
            } else {
                //console.log(row.title);
                fn(row);
            }
        });
    });
};

Database.prototype.update = function(title, description, level, id) {
    var db = this.db;
    db.serialize(function() {
        if (title.length) {
            console.log("update database");
            db.run("UPDATE items SET title=?, description=?, level=? WHERE id=?", [title, description, level, id]);
        } else {
            console.log("delete database row");
            db.run("DELETE FROM items WHERE id=?", id)
        };
    });
};

Database.prototype.deleteall = function(fn) {
    console.log("delete all database");
    var db = this.db;
    db.serialize(function() {
        db.run("DELETE FROM items");
    });
}

module.exports = Database;



// var wrapper = require("co-mysql"),
//     mysql = require("mysql"),
//     config = require("../../config"),
//     mm = require("moment");

// function handleError (err) {
//   if (err) {
//     // 如果是连接断开，自动重新连接
//     if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//       console.error("PROTOCOL_CONNECTION_LOST")
//       connect();
//     } else {
//       console.error(err.stack || err);
//     }
//   }
// }

// function connect () {
//   pool = mysql.createConnection(config.db);
//   pool.connect(function(err) {
//     if(err!=null) {
//       console.log("poolError", err);
//       setTimeout(connect, 2000);
//     }
//   });
//   pool.on('error', handleError);

//   connection = wrapper(pool);
// }

// var connection;
// connect();

// var DB = function(tabName) {
//   this.connection = connection;
//   this.tabName = tabName;
// };

// DB.prototype = {
//   setTabName: function (tabName) {
//     this.tabName = tabName;
//     return this;
//   },
//   queryStr: function *(str, options) {
//     //co-mysql do these
//     /*
//     var self = this;
//     var result = yield function (fn) {
//       self.connection.query(str, fn);
//     }
//     */
//     console.log(mm(new Date()).format("lll"), str);
//     var result = yield this.connection.query(str, options);
//     return result;
//   },
//   findByID: function (id) {
//     var queryStr = "SELECT * FROM " + this.tabName + " where id = " + id;
//     return this.queryStr(queryStr);
//   },
//   getList: function () {
//     var queryStr = "SELECT * FROM " + this.tabName;
//     return this.queryStr(queryStr);
//   }
// };

// exports.db = function(tabName) {
//   return new DB(tabName);
// };
