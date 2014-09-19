var mysql = require("mysql"),
    config = require("../../config");

function handleError (err) {
  if (err) {
    // 如果是连接断开，自动重新连接
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connect();
    } else {
      console.error(err.stack || err);
    }
  }
}
function connect () {
  connection = mysql.createConnection(config.db);
  connection.connect(function(err) {if(err!=null) console.log(err);});
  connection.on('error', handleError);
}

var connection;
connect();

var DB = function(tabName) {
  this.connection = connection;
  this.tabName = tabName;
}

DB.prototype = {
  setTabName: function (tabName) {
    this.tabName = tabName;
    return this;
  },
  query: function(str, fn) {
    console.log("db: ", str);
    this.connection.query(str, function(err, rows) {
      fn(err, rows);
    });
  },
  findByID: function (id, fn) {
    var queryStr = "SELECT * FROM " + this.tabName + " where id = " + id;
    this.query(queryStr, fn);
  },
  getList: function (fn) {
    var queryStr = "SELECT * FROM " + this.tabName;
    this.query(queryStr, fn);
  }
}

exports.db = function(tabName) {
  return new DB(tabName);
}