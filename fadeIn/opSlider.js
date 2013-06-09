;(function($){
    var Slider = function(target, opts){
        this.target = target;
        this.settings = opts;

        this.cel = target.children().children();
        this.len = this.cel.length;
        this.timer = null;
        this.index = 0;

        this.init();
    };
    Slider.prototype = {
        init: function(){
            var self = this;
            self.target.css('position','relative');
            self.cel.css({'position': 'absolute'}).hide().eq(0).show();

            var tpl = self.navBulid(), navId = $(self.settings.navId);
            navId.append(tpl);
            self.navBtn = navId.find('li');
            self.bindEvnet();
            self.moving();
        },
        bindEvnet: function(){
            var self = this;
            self.target.hover(function(){
                clearInterval(self.timer);
            },function(){
                self.moving();
            });
            self.navBtn.bind(self.settings.eventNav, function(){
                var index = self.navBtn.index($(this));
                self.change(index);
            })
        },
        moving: function(){
            var self = this;
            self.timer = setInterval(function(){
                self.index++;
                if (self.index >= self.len){
                    self.index = 0;
                }
                self.change(self.index);
            },self.settings.time);
        },
        change: function(index){
            var self = this;
            self.navBtn.removeClass(self.settings.currClass).eq(index).addClass(self.settings.currClass);
            self.cel.fadeOut(500).eq(index).fadeIn(1000);
        },
        navBulid: function(){
            var self = this,
            //获取滚动元素的尺寸
                navHtml = '<ul data-type="gOpSlider">';
            for(var i = 0; i<self.len; i++){
                if(i === 0){
                    navHtml += '<li class="'+self.settings.currClass+'">1</li>';
                }else{
                    navHtml += '<li>'+(i+1)+'</li>';
                }
            }
            navHtml += '</ul>';
            return navHtml;
        }
    };
    $.fn.gOpSlider = function(opts) {
        opts = $.extend({}, $.fn.gOpSlider.defaults, opts);
        new Slider($(this), opts);
    };
    $.fn.gOpSlider.defaults = {
        currClass: 'navOn',
        eventNav: 'click',
        navId: '#mar3Nav',
        time: 3000,
        beforeCallback: function(){},
        afterBack: function(){}
    };
})(jQuery);