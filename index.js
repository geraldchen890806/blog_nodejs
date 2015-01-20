var app = require('./app');
var config = require('./config').config

var server = app.listen(config.port, function() {
  console.log('koa server listening on port ' + server.address().port);
});
