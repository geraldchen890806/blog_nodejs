/**
 * Created by glchen on 2015/1/27.
 */
!function ($) {
    /*
     * require plugin.js
     * require plugin.css
     */
    "use strict";

    var InfiniteScroll = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, this.defaults, options);
        this.init();
    };

    InfiniteScroll.prototype = {
        constructor: InfiniteScroll,
        defaults: {},
        init: function () {
            
        }
    };

    GeUI.Plugin.define('InfiniteScroll', InfiniteScroll);

} (window.jQuery);