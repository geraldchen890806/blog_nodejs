var blogDB = require("../models/blog").db,
    tagDB = require("../models/tag").db,
    common = require("./common"),
    extend = require("extend"),
    gravatar = require("gravatar"),
    rss = require('rss'),
    sm = require("sitemap");

exports.index = function*() {
    var blogs = yield blogDB.getBlogs();
    var commonConfig = yield common.config();
    yield this.render('home/index', extend({
        blogs: blogs
    }, commonConfig, {
        session: this.session
    }));
};

exports.recommend = function*() {
    var blogs = yield blogDB.getRecommend();
    var commonConfig = yield common.config();
    yield this.render('home/index', extend({
        blogs: blogs
    }, commonConfig, {
        session: this.session
    }));
};

exports.about = function*() {
    var url = gravatar.url('geraldchen890806@gmail.com', {
        s: '200',
        r: 'pg',
        d: '404'
    });
    yield this.render('home/about', {
        imageUrl: url,
        session: this.session
    });
};

exports.feed = function*() {
    var feed = new rss({
        title: '修',
        description: '人生是一场独自修行的道路',
        feed_url: 'http://renjm.com/feed',
        site_url: 'http://renjm.com',
        image_url: gravatar.url('geraldchen890806@gmail.com', {
            s: '200',
            r: 'pg',
            d: '404'
        }),
    });
    var blogs = yield blogDB.getBlogs();
    blogs.forEach(function(v, i) {
        if (!v.isDraft) {
            feed.item({
                title: v.title,
                description: v.realContent,
                url: "http://renjm.com/blog/" + v.id,
                date: v.addTime
            })
        }
    });
    this.body = feed.xml();
    this.type = 'text/xml'
};

exports.sitemap = function*() {
    var blogs = yield blogDB.getBlogs();
    var tags = yield tagDB.getTags();
    var sitemap = sm.createSitemap({
        hostname: 'http://renjm.com',
        cacheTime: 600000
    });
    sitemap.add({
        url: "",
        priority: 1,
        changefreq: "daily"
    });
    blogs.forEach(function(v, i) {
        if (!v.isDraft) {
            sitemap.add({
                url: '/blog/' + v.url,
                lastmod: v.editTime || v.addTime
            });
        }
    });
    tags.forEach(function(v, i) {
        sitemap.add({
            url: '/tag/' + v.name,
            lastmod: v.addTime
        });
    });

    this.body = sitemap.toString();
    this.type = "application/xml";
};
