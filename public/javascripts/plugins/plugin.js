! function($) {
    //jquery-1.10.2

    "use strict";

    window.GeUI = function() {};

    var Plugin = GeUI.Plugin = function(element) {
        this.$element = $(element);
    };
    Plugin.prototype = {
        constructor: Plugin,
        init: function() {
            //reload the opt-in plugin using the data-defer values
            var $deferred = $('[data-defer]', this.$element);
            $deferred.each(function() {
                var $this = $(this),
                    name = $this.attr('data-defer');
                if ($this[name]) {
                    $this[name]();
                } else {
                    throw 'A plugin with the name [' + name + '] could not be found. Make sure the script is included on the page.';
                }
            });
        }
    };

    Plugin.define = function(name, fn) {
        var old = $.fn[name];

        $.fn[name] = function(option) {
            return this.each(function() {
                var $this = $(this),
                    data = $this.data('off.' + name),
                    options = $.extend({}, $.fn[name].defaults, $this.data(), typeof option === 'object' && option);
                if (!data) $this.data('off.' + name, (data = new fn(this, options)));
                if (typeof option === 'string') data[option](); //call specific function on plugin
            });
        };

        $.fn[name].Constructor = fn;

        $.fn[name].noConflict = function() {
            $.fn[name] = old;
            return this;
        };
    };

    Plugin.define('plugin', Plugin);


    window.clearMenus = function($el) {
        $(".ge_menus").not($el).hide();
    };

    $(document).on('click.data-api', clearMenus);

}(window.jQuery);
