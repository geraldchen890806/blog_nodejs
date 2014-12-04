!function ($) {
    /*
    * require plugin.js
    * require plugin.css
    */
    "use strict";

    var Editor = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, this.defaults, options);
        this.init();
    };

    Editor.prototype = {
        constructor: Editor,
        defaults: {
        },
        init: function () {
            var $el = this.$element;
            this.$text = $el.find("textarea");
            this.$preview = $el.find(".preview");
            this.$btnEdit = $el.find(".commit-edit");
            this.$btnPreview = $el.find(".commit-preview");

            this.$btnEdit.on("click", $.proxy(this.showEdit, this));
            this.$btnPreview.on("click", $.proxy(this.showPreview, this));
            this.$preview.hide();
        },
        showEdit: function (e) {
            e.preventDefault();
            this.$preview.hide();
            this.$btnPreview.removeClass("selected");
            this.$text.show();
            this.$btnEdit.addClass("selected");
        },
        showPreview: function (e) {
            e.preventDefault();
            var self = this;
            this.$text.hide();
            this.$btnEdit.removeClass("selected");
            this.$preview.show();
            this.$btnPreview.addClass("selected");
            this.$preview.html("请稍后。。。。");
            var data = this.$text.val();
            $.ajax({
                type: "post",
                url: "/common/editor",
                data: {"data": data},
                success: function (data) {
                    self.$preview.html(data);
                }
            })
        }
    };

    GeUI.Plugin.define('editor', Editor);

} (window.jQuery);