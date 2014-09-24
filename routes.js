var home = require("./app/controllers/home"),
    user = require("./app/controllers/users"),
    blog = require("./app/controllers/blogs"),
    route = require("koa-route"),
    fs = require("fs");

module.exports = function (app) {

  // app.use(/.*/, function(req, res, next) {
  //   next()
  // })
  
  // app.use(assets({
  //   urls: [{
  //     rule: /assets\/stylesheets/,
  //     dest: '~/public/stylesheets/'
  //   }]
  // }));
    
  app.use(route.get('/', home.index));
  app.use(route.get('/blog/:id', blog.index));
  //app.get('/users', user.index);

  // catch 404 and forward to error handler
  app.use(function *(next) {
    var err = new Error('Not Found');
    err.status = 404;
    yield next;
  });

  // development error handler
  // will print stacktrace
  //if (app.get('env') === 'development') {
    app.use(function *() {
      this.status = 404;
      this.render('error', {
        message: "Not Found",
        //error: err
      });
    });
  //}
}

