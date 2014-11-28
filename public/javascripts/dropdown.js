!function ($) {
    /*
    * require plugin.js
    * require css/common.css
    * 下拉框内容为多选框
    * <div class="dropdown" data-defer="dropdown" data-initSelect=":last"> *默认选中 :last/:first/eq(1..)*
    *   <a class="dropdown-toggle" href="#">*下拉框显示内容*</>
    *   <div class="dropdown-item"></div> *下拉框箭头* 
    *   <ul class="dropdown-menu mo_menus" style="display:none"> *下拉框选项列表*
    *       <label>
    *           <input type="checkbox" value='全部'/>
    *           <span></span>
    *       </label>
    *       。。。
    *   </ul>
    */
    "use strict";

    var Dropdown = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, this.defaults, options);
        this.init();
    };

    Dropdown.prototype = {
        constructor: Dropdown,
        defaults: {
            initSelect: ""
        },
        init: function () {
            var $el = this.$element, self = this;
            this.$text = $el.find("a");
            this.$menus = $el.find("ul");
            this.$items = $el.find("ul input[type=checkbox]");
            this.$initSelect = this.$menus.find("input[type=checkbox]" + this.options.initSelect);
            this.$selectAll = this.$menus.find("input[type=checkbox][value='All']");
            this.$menus.on("click", function (e) { e.stopPropagation(); })
            $el.on("click", $.proxy(this.toggle, this));
            this.$items.on("click", $.proxy(this.check, this));
            //init checkAll
            // if (this.$menus.find("input:checked").length == 0) {
            //     this.$initSelect.prop("checked", true);
            // }
            this.check();
        },
        toggle: function (e) {
            e.stopPropagation();
            var isHide = !!(this.$menus.css("display") == "none")
            clearMenus();
            if (isHide) {
                this.$text.focus();
                this.$menus.toggle();
            } else {
                this.$text.blur();
            }
        },
        check: function (e) {

            if (e) {
                this.$text.focus();
                e.stopPropagation();
            }

            var $checked = this.$menus.find("input:checked");

            if ($checked.length > 1 && this.$selectAll.length) {
                $checked = $checked.not(this.$selectAll);
                this.$selectAll.prop("checked", false);
            }

            if (e && $(e.target).is(this.$selectAll)) {
                this.$items.not(this.$selectAll).prop("checked", false);
                $checked = this.$selectAll;
            }

            if (this.$selectAll.length && $checked.length == this.$items.not(this.$selectAll).length) {
                this.$items.prop("checked", false);
                this.$selectAll.prop("checked", true);
                $checked = this.$selectAll;
            }

            // zero ==> checkAll
            // if (this.$menus.find("input:checked").length == 0) {
            //     this.$initSelect.prop("checked", true);
            //     $checked = this.$initSelect;
            // }

            var res = [];
            $checked.each(function (i, v) {
                var $this = $(this).next();
                res.push($this.html());
            })
            this.$text.html(res.join(","));
        }

    };

    GeUI.Plugin.define('dropdown', Dropdown);

} (window.jQuery);