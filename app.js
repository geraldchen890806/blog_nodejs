var koa = require('koa');
var jade = require('koa-jade');
var less = require('koa-less');
var serve = require('koa-static');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');

var route = require('./routes');
var app = koa();

// view engine setup
app.use(jade.middleware({
  viewPath: __dirname + '/app/views',
  //debug: false,
  //pretty: false,
  //compileDebug: false,
  //locals: global_locals_for_all_pages,
  basedir: 'path/for/jade/extends',
  //helperPath: [
  //  'path/to/jade/helpers',
  //  { random: 'path/to/lib.js' },
  //  { _: require('lodash') }
  //]
}));

app.use(serve('public', {
  maxage: 3650000000,
  Etag: 1231231231
}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

route(app);

// error handlers

module.exports = app;
