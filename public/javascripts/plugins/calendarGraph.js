!function ($) {
    /*
     * require plugin.js
     * require plugin.css
     */
    "use strict";
    var CalendarGraph = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, this.defaults, options);
        this.init();
    };

    CalendarGraph.prototype = {
        constructor: CalendarGraph,
        defaults: {},
        init: function (){
            this.date = new Date();
            this.date = [];
        },
        createCal: function () {
            //var currentDate = this.date();
            //var firstDate = new Date(currentDate).setFullYear(currentDate.getFullYear() - 1);
            //var num = (currentDate- new Date(currentDate).setFullYear(currentDate.getFullYear() - 1))/1000/3600/24;
        },
        createSvg: function () {

            var firstWDate = lastDate.getDay();
            this.$svg = $("<svg width='240' height='800' class='graph-svg'></svg>");
            while (num){

            }
        },
        getDaysMonth: function (date) {
            return new Date(new Date(date.getFullYear(), (date.getMonth() + 1)%11, 1)  - 1).getDate();
        }
    };

    GeUI.Plugin.define('calendarGraph', CalendarGraph);

} (window.jQuery);