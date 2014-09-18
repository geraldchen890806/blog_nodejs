#!/usr/bin/env node
var debug = require('debug')('nodeserver');
var app = require('./app');
var config = require('./config').config

app.set('port', process.env.PORT || config.port);

var server = app.listen(config.port, function() {
  console.log('Express server listening on port ' + server.address().port);
});
