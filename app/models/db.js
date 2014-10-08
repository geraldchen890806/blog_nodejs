var mysql = require("co-mysql"),
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
  //connection.connect(function(err) {if(err!=null) console.log(err);});
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
  queryStr: function *(str) {
    console.log(new Date().toLocaleString(), str);
    var result = yield this.connection.query(str);
    return result[0];
  },
  findByID: function (id) {
    var queryStr = "SELECT * FROM " + this.tabName + " where id = " + id;
    return this.queryStr(queryStr);
  },
  getList: function () {
    var queryStr = "SELECT * FROM " + this.tabName;
    return this.queryStr(queryStr);
  }
}

exports.db = function(tabName) {
  return new DB(tabName);
}