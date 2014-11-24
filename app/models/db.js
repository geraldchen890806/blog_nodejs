var wrapper = require("co-mysql"),
    mysql = require("mysql"),
    config = require("../../config"),
    mm = require("moment");

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
  pool = mysql.createConnection(config.db);
  pool.connect(function(err) {
    if(err!=null) {
      console.log("poolError", err);
      setTimeout(connect, 2000);
    }
  });
  pool.on('error', handleError);

  connection = wrapper(pool);
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
  queryStr: function *(str, options) {
    console.log(mm(new Date()).format("lll"), str);
    //co-mysql do these
    /*
    var self = this;
    var result = yield function (fn) {
      self.connection.query(str, fn);
    }
    */
    var result = yield this.connection.query(str, options);
    return result;
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