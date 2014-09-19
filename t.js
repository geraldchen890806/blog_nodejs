var mysql = require("mysql"),
    config = require("./config");

exports = function() {
  var connection = mysql.createConnection(config.db);
  console.log(connection);
  connection.connect(function(err) {if(err!=null) console.log(err);});
  connection.query('select * from users', function(err, rows, fields) {
    //if (err) console.log(err);
    console.log('The solution is: ', fields);
  });

  connection.end();
}()