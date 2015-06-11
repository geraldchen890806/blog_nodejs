var home = require("./app/controllers/home"),
    user = require("./app/controllers/users"),
    blog = require("./app/controllers/blogs"),
    common = require("./app/controllers/common"),
    route = require("koa-route");

module.exports = function(app) {

    app.use(route.get('/', home.index));
    app.use(route.get('/recommend', home.recommend));
    app.use(route.get('/about', home.about));
    app.use(route.get('/feed', home.feed));
    app.use(route.get('/sitemap', home.sitemap));
    app.use(route.get('/blog/new', blog.new));
    app.use(route.post('/blog/save', blog.save));
    app.use(route.post('/blog/reTimes', blog.saveReTimes));
    app.use(route.get('/blog/edit/:id', blog.edit));
    app.use(route.get('/blog/delete/:id', blog.delete));
    app.use(route.post('/blog/comment/delete/:id', blog.commentDel));
    app.use(route.post('/blog/comment', blog.comment));
    app.use(route.get('/blog/:id', blog.index));
    app.use(route.post('/blog/tag/save', blog.saveTag));
    app.use(route.post('/blog/tag/del', blog.delTag));

    app.use(route.get('/blog/tag/:id', blog.tags));
    app.use(route.get('/user/login', user.index));

    app.use(route.post('/user/login', user.login));
    app.use(route.get('/user/logout', user.logout));
    app.use(route.post('/common/editor', common.editor));
    //app.get('/users', user.index);

    // development error handler
    // will print stacktrace
    //if (app.get('env') === 'development') {
    app.use(function*() {
        var err = this.session.err || {
            status: 404,
            message: "Not Found"
        }
        this.status = err.status || 404;
        yield this.render('shares/error', {
            message: err.message || 'Not Found'
                //error: {
                //  status: this.status;
                //}
        });
        return;
    });
    //}

    //app.on('error', function(err, ctx) {
    //    console.log('error', new Date(), err);
    //})
};
