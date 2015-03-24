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
            this.$menus.on("click", function (e) { e.stopPropagation(); });
            $el.on("click", $.proxy(this.toggle, this));
            this.$menus.on("click", "input[type=checkbox]", $.proxy(this.check, this));
            this.$add = $el.find(".btn");
            this.$add.on("click", $.proxy(this.add, this));
            this.$menus.on("click", ".octicon", $.proxy(this.del, this));
            this.$menus.find("li").hover($.proxy(this.hoverItem, this), $.proxy(this.leaveItem, this));
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
                //e.stopPropagation();
            }

            var $checked = this.$menus.find("input:checked");

            //if ($checked.length > 1 && this.$selectAll.length) {
            //    $checked = $checked.not(this.$selectAll);
            //    this.$selectAll.prop("checked", false);
            //}
            //
            //if (e && $(e.target).is(this.$selectAll)) {
            //    this.$items.not(this.$selectAll).prop("checked", false);
            //    $checked = this.$selectAll;
            //}
            //
            //if (this.$selectAll.length && $checked.length == this.$items.not(this.$selectAll).length) {
            //    this.$items.prop("checked", false);
            //    this.$selectAll.prop("checked", true);
            //    $checked = this.$selectAll;
            //}

            var res = [];
            $checked.each(function (i, v) {
                var $this = $(this).next();
                res.push($this.html());
            })
            this.$text.html(res.join(","));
        },
        add: function () {
            var tag = this.$element.find("#newTag").val();
            if(!$.trim(tag)) { return; }
            var self = this;
            $.ajax({
                type: "post",
                url: "/blog/tag/save",
                data: {name: tag},
                success: function (data) {
                    $('<li><label class="checkbox"><input type="checkbox" value="' + data.id +'" name="tags" checked><span>' + data.name + '</span></label><span class="octicon octicon-trashcan hide"></span></li>').insertAfter(self.$element.find("ul li:first"))
                    self.check();
                }
            })
        },
        del: function (e) {
            var $target = $(e.target);
            var id = $target.parent().find("input").val();
            if(!$.trim(id)) { return; }
            var self = this;
            $.ajax({
                type: "post",
                url: "/blog/tag/del",
                data: {id: id},
                success: function (data) {
                    self.$menus.find("li.tag" + id).remove();
                }
            })
        },
        hoverItem: function (e) {
            var $target = $(e.target);
            $target.find(".octicon").show();
        },
        leaveItem: function (e) {
            var $target = $(e.target);
            $target.find(".octicon").hide();
        }
    };

    GeUI.Plugin.define('dropdown', Dropdown);

} (window.jQuery);