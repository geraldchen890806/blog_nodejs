var home = require("./app/controllers/home"),
    user = require("./app/controllers/users"),
    blog = require("./app/controllers/blogs"),
    fs = require("fs");

module.exports = function (app) {

  // app.use(/.*/, function(req, res, next) {
  //   next()
  // })
    
  app.get('/', home.index);
  app.get('/users', user.index);
  app.get('/blog/:id', blog.index);


  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  
}

