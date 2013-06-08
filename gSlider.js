(function($){
    /**
     * 默认参数
     * @type {Object}
     */
    var defaultConfig = {
            //speed代表自动播放的间隔，单位：毫秒
            speed: 3000,
            currClass: 'gActive'
    };
    /**
     * Slider Class
     * @param  {[Object]} target 当前的dom对象
     * @param  {[Object]} opts   参数
     * @return {[Object]}        
     */
    var Slider = function(target, opts){
        this.target = target;

        this.wrapWidth = target.width();
        this.UlWidth = 100;
        this.index = 0;
        this.timer = null;
        
        this.el = {
            ul: target.children('ul'),
            li: target.children('ul').children('li')
        };
        this.settings = opts;

        this.init();
    };
    Slider.prototype = {
        init: function(){
            var self = this,
                liLen = self.el.li.length,
                len = Math.round(self.wrapWidth/self.el.li.eq(0).width()),
                lastVCon = liLen-len;
            self.firstClone = self.el.li.slice(0, len);
            self.lastClone = self.el.li.slice(lastVCon);
            self.getUlWidth();
            self.createNumBtn();
            self.createNextPrev();
            self.bindEvent();
        },
        getUlWidth: function(){
            var self = this,
                liNode = self.el.li,
                len = liNode.length,
                ulWidth = liNode.width() * len;
            self.UlWidth = ulWidth;
            self.el.ul.width(999999999);
        },
        createNumBtn: function(){
            var self = this,
            NBtn = '<div class="gSilderNum">';
            self.len = Math.round(self.UlWidth/self.wrapWidth);
            for(var i = 0; i< self.len; i++){
                if(i==0){
                    NBtn += '<span class="'+self.settings.currClass+'">'+(i+1)+'</span>';
                }else{
                    NBtn += '<span>'+(i+1)+'</span>';
                }
            }
            NBtn += '</div>';
            self.target.append(NBtn);
        },
        createNextPrev: function(){
            var btn = '<span class="gSliderPrev">prev</span><span class="gSliderNext">next</span>';
            this.target.append(btn);
        },
        bindEvent: function(){
            var self = this;
            self.sliderNum = self.target.find('.gSilderNum span');
            /**
             * 数字点击
             */
            self.sliderNum.bind('mouseenter',function() {
                self.index = self.sliderNum.index($(this));
                self.move(self.index);
            }).eq(0).trigger("mouseenter");
            /**
             * 鼠标滑过清除定时
             */
            self.target.hover(function() {
                clearInterval(self.timer);
            },function() {
                self.timer = setInterval(function() {
                    if(self.index == self.len) { 
                        self.moveFirst();
                        self.index = 0;
                    } else { 
                        self.move(self.index);
                    }
                    self.index++;
                }, self.settings.speed);
            }).trigger("mouseleave");
            /**
             * 上一页下一页
             * @type {*}
             */
            self.preBtn = self.target.find('.gSliderPrev');
            self.nextBtn = self.target.find('.gSliderNext');

            self.preBtn.bind('click', function(){
                if(self.index == self.len) {
                    self.moveFirst();
                    self.index = 0;
                } else {
                    self.move(self.index);
                }
                self.index++;
            });
            self.nextBtn.bind('click', function(){
                if(self.index == 0) {
                    self.moveLast();
                    self.index = self.len;
                } else {
                    self.move(self.index);
                }
                self.index--;
            });
        },
        /**
         * 动起来。。
         */
        move: function(index){
            var self = this,
                ulNode = self.el.ul,
                nowLeft = -(index * self.wrapWidth);
            console.log(index);
            ulNode.stop(true,false).animate({"left":nowLeft},500);
            self.sliderNum.removeClass(self.settings.currClass).eq(index).addClass(self.settings.currClass);
        },
        moveFirst: function(){
            var self = this,
            ulNode = self.el.ul,

            nowLeft = -(self.len*self.wrapWidth);
            var cloneNode = $(self.firstClone).clone();
            cloneNode.addClass('cloned').appendTo(ulNode);
            ulNode.stop(true,false).animate({"left": nowLeft},500,function() {
                ulNode.css("left","0");
                ulNode.find('.cloned').remove();
            });
            self.sliderNum.removeClass(self.settings.currClass).eq(0).addClass(self.settings.currClass);
        },
        moveLast: function(){
            var self = this,
                ulNode = self.el.ul;
            var cloneNode = $(self.lastClone).clone();
            cloneNode.addClass('cloned').prependTo(ulNode);
            ulNode.css('left', ~self.wrapWidth)
                .stop(true,false).animate({"left": 0},500,function() {
                    ulNode.css("left", ~(self.wrapWidth * self.index));
                    self.index--;
                    ulNode.find('.cloned').remove();
                });
            self.sliderNum.removeClass(self.settings.currClass).eq(self.len-1).addClass(self.settings.currClass);
        }
    };
    /**
     * api
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    $.fn.gSlider = function(opts){
        opts = $.extend({}, defaultConfig, opts);
        new Slider($(this), opts);
    };
})(jQuery);
