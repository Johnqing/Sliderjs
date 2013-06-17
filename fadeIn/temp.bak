/**
 * Plugin name - gOpSlider
 * Version - v1.0
 * Updated - 2013-6-17
 * author - liuqing
 * up - 支持单图无线滚动
 * example - https://github.com/Johnqing/Sliderjs/tree/master/fadeIn
 */
;(function($){
    var Slider = function(target, opts){
        this.target = target;
        this.settings = opts;
        
        this.ulNode = target.find('ul:eq(0)');
        this.cel = target.children().children();
        this.w = target.width();
        this.len = this.cel.length;
        this.timer = null;
        this.index = 0;

        this.init();
    };
    Slider.prototype = {
        init: function(){
            var self = this;
            self.styleChange();

            var tpl = self.navBulid(), 
              navId = $(self.settings.navId);
            navId.append(tpl);
            self.navBtn = navId.find('li');
            self.bindEvnet();
            self.moving();
            self.imgLoad();
        },
        styleChange: function(){
            var self = this;
            self.target.css({'position': 'relative'});
            if(self.settings.animate){
                self.ulNode.css({
                    'position': 'absolute',
                    'width': 20000
                });
                self.cel.css({'float': 'left'});
                return;
            }
            self.cel.css({'position': 'absolute'}).hide().eq(0).show();         
        },
        imgLoad: function(){
            var self = this,
                el = self.cel.eq(self.index).find('img');
            if(!self.settings.isImgload || el.attr('data-name') === "imglazyload_offset"){return;}
            el.attr('src',el.attr('data-original')).attr('data-name','imglazyload_offset');
        },
        bindEvnet: function(){
            var self = this;
            self.target.hover(function(){
                clearInterval(self.timer);
            },function(){
                self.moving();
            });
            var eventFlag = false;
            self.navBtn.bind(self.settings.eventNav, function(){
                if(eventFlag){return;}
                eventFlag = true;
                var index = self.navBtn.index($(this));
                setTimeout(function(){
                    self.index = index;
                    self.change(index);
                    eventFlag = false;
                },150);                
            })
        },
        moving: function(){
            var self = this;
            self.timer = setInterval(function(){
                self.index++;
                self.change(self.index);
            },self.settings.time);
        },
        change: function(index){
            var self = this;
            self.index = self.index >= self.len ? 0 : self.index;
            if(self.settings.animate){
                if(index===self.len){
                    self.ulNode.css('padding-left',self.w).attr('flg',1);
                    self.cel.eq(0).css({
                        'position': 'absolute',
                        'left': self.w * index
                    });
                }  
                if(index === 1 && self.ulNode.attr('flg')){
                    self.ulNode.css({
                        'padding-left': 0,
                        'left': 0
                    });
                    self.cel.eq(0).removeAttr('style').css('float','left');
                }
                self.ulNode.animate({'left': -(self.w * index)});
            }else{
                self.cel.stop(true, false).animate({opacity:0}, 800).hide().eq(self.index).show().stop(true, false).animate({opacity:1}, 800);
            }
            self.navBtn.removeClass(self.settings.currClass).eq(self.index).addClass(self.settings.currClass);
            self.imgLoad();
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
        animate: true,
        currClass: 'navOn',
        eventNav: 'click',
        navId: '#mar3Nav',
        time: 3000,
        isImgload: false,
        beforeCallback: function(){},
        afterBack: function(){}
    };
})(jQuery);
