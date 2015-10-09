var koa = require('koa');
var jade = require('koa-jade');
var less = require('koa-less');
var serve = require('koa-static');
var path = require('path');
var staticCache = require('koa-static-cache');
var config = require("./config");
var session = require('koa-generic-session');
// var MysqlStore = require('koa-mysql-session');
var gzip = require("koa-gzip");

var route = require('./routes');
var app = koa();

app.use(gzip());

// view engine setup
app.keys = ['keys', 'geraldblog'];
app.use(jade.middleware({
    viewPath: __dirname + '/app/views',
    basedir: 'path/for/jade/extends'
}));

app.use(staticCache(path.join(__dirname, 'public'), {
    maxAge: 365 * 24 * 60 * 60
}));

var favicon = require('koa-favicon');

app.use(favicon(__dirname + '/favicon.ico'));

app.use(session({
    rolling: true,
    cookie: {
        maxage: 30 * 24 * 60 * 60 * 1000
    }
}));

app.use(function*(next) {
    if (this.hostname == "renjm.com") {
        var herf = this.href;
        this.redirect("http://www.renjm.com" + this.url);
    }
    yield next;
});

route(app);

module.exports = app;
