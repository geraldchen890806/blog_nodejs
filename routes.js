var home = require("./app/controllers/home"),
    user = require("./app/controllers/users"),
    blog = require("./app/controllers/blogs"),
    common = require("./app/controllers/common"),
    plugin = require("./app/controllers/plugins"),
    route = require("koa-route");

module.exports = function (app) {
     
  app.use(route.get('/', home.index));
  app.use(route.get('/recommend', home.recommend));
  app.use(route.get('/about', home.about));
  app.use(route.get('/feed', home.feed));
  app.use(route.get('/blog/new', blog.new));
  app.use(route.post('/blog/save', blog.save));
  app.use(route.get('/blog/edit/:id', blog.edit));
  app.use(route.get('/blog/delete/:id', blog.delete));
  app.use(route.get('/blog/:id', blog.index));
  app.use(route.post('/blog/comment', blog.comment));
  app.use(route.get('/blog/tag/:id', blog.tags));
  app.use(route.get('/user/login', user.index));
  app.use(route.post('/user/login', user.login));
  app.use(route.get('/user/logout', user.logout));
  app.use(route.post('/common/editor', common.editor));
  app.use(route.get('/plugin', plugin.index));
  //app.get('/users', user.index);

  // catch 404 and forward to error handler
  app.use(function *(next) {
    var err = new Error('Not Found');
    err.status = 404;
    this.err = err;
    yield next;
  });

  // development error handler
  // will print stacktrace
  //if (app.get('env') === 'development') {
    app.use(function *() {
      this.status = this.err.status;
      yield this.render('shares/error', {
        message: 'Not Found'
        //error: {
        //  status: this.status;
        //}
      });
    });
  //}

  // app.on('error', function (err) {
  //  console.log('error',new Date(),err);

  // })
}

