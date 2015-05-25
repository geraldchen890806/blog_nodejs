var koa = require('koa');
var jade = require('koa-jade');
var less = require('koa-less');
var serve = require('koa-static');
var path = require('path');
var staticCache = require('koa-static-cache');
var config = require("./config");
var session = require('koa-generic-session');
var MysqlStore = require('koa-mysql-session');
var gzip = require("koa-gzip");
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');

var route = require('./routes');
var app = koa();

app.use(gzip());

// view engine setup
app.keys = ['keys', 'geraldblog'];
app.use(jade.middleware({
    viewPath: __dirname + '/app/views',
    //debug: false,
    //pretty: false,
    //compileDebug: false,
    //locals: global_locals_for_all_pages,
    basedir: 'path/for/jade/extends'
        //helperPath: [
        //  'path/to/jade/helpers',
        //  { random: 'path/to/lib.js' },
        //  { _: require('lodash') }
        //]
}));

app.use(staticCache(path.join(__dirname, 'public'), {
    maxAge: 365 * 24 * 60 * 60
}));

var favicon = require('koa-favicon');

app.use(favicon(__dirname + '/favicon.ico'));

app.use(session({
    store: new MysqlStore(config.db),
    rolling: true,
    cookie: {
        maxage: 30 * 24 * 60 * 60 * 1000
    }
}));

// app.use(serve('public', {
//   maxage: 3650000000,
//   Etag: 1231231231
// }));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(function*(next) {
    if (this.hostname == "renjm.com") {
        var herf = this.request.href;
        this.redirect(href.replace("renjm.com", "www.renjm.com"));
    }
    yield next;
});

route(app);

// error handlers

module.exports = app;
