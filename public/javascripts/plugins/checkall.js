!function ($) {
    /*
     * require plugin.js
     * 多选框全选插件
     * 在全选的input上添加属性 data-defer="checkAll" data-group="*selector*"
     * data-group 为全选操作对象的selector,例 data-group="#contentArea td input[type=checkbox]"
     */
    "use strict";

    var CheckAll = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, this.defaults, options);
        this.init();
    };

    CheckAll.prototype = {
        constructor: CheckAll,
        defaults: {
        },
        init: function () {
            var $el = this.$element;
            this.initGroup();
            if (this.$element.prop("checked")) this.$group.prop("checked", this.$element.prop("checked"));
            $el.on("click", $.proxy(this.checkAll, this));
            this.trigger = $el.data("trigger");
            this.check();
        },
        initGroup: function () {
            this.$group = $(this.options.group).not(this.$element);
            this.$group.on("click", $.proxy(this.check, this));
        },
        checkAll: function (e) {
            if (!this.$group.length) this.initGroup();
            if (this.$element.prop("middleStatus")) {
                this.$element.prop("checked", false);
            }
            this.$element.prop("middleStatus", false);
            this.$group.prop("checked", this.$element.prop("checked"));
            if(this.trigger) $(document).trigger(this.trigger);
        },
        check: function () {
            if (!this.$group.length) this.initGroup();
            this.$element.prop("checked", !this.$group.filter(":not(:checked)").length && this.$group.length);
            if (!this.$element.prop("checked") && this.$group.length && this.$group.filter(":checked").length) {
                this.$element.prop("indeterminate", true);
                this.$element.prop("middleStatus", true);
            } else {
                this.$element.prop("indeterminate", false);
                this.$element.prop("middleStatus", false);
            }
            if (this.trigger) $(document).trigger(this.trigger);
        }
    };

    GeUI.Plugin.define('checkAll', CheckAll);

} (window.jQuery);