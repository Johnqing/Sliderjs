(function($) {
    function gSlider(element, options) {
        this.elements = {
            wrap: element,
            ul: element.children('ul'),
            li: element.children('ul').children('li')
        };
        this.settings = $.extend({}, $.fn.gSlider.defaults, options);
        this.cache = {
            allowgSlider: true
        };
        
        this.timer = false;
        this.init();
    }
    gSlider.prototype = {
        /**
         * 初始化
         */
        init: function() {
            this.setStyle();
            this.move();
            this.bind();
    		this.imgLoad();
    	},
        /**
         * 样式调整都在这
         */
        setStyle: function() {
            var self = this,
                floatStyle, liMargin, liOuterH, liOuterW, ulH, ulW, wrapH, wrapW;

            liOuterW = self.elements.li.outerWidth(true);
            liOuterH = self.elements.li.outerHeight(true);
            liMargin = Math.max(parseInt(self.elements.li.css('margin-top'), 10), parseInt(self.elements.li.css('margin-bottom'), 10));
            switch (self.settings.type) {
                case 'horizontal':
                    wrapW = self.settings.showNum * liOuterW;
                    wrapH = liOuterH;
                    ulW = 9999;
                    ulH = 'auto';
                    floatStyle = 'left';
                    self.cache.stepW = self.settings.stepLen * liOuterW;
                    self.cache.prevAnimateObj = {
                        left: -self.cache.stepW
                    };
                    self.cache.nextAnimateObj = {
                        left: 0
                    };
                    self.cache.leftOrTop = 'left';
                    break;
                case 'vertical':
                    wrapW = liOuterW;
                    wrapH = self.settings.showNum * liOuterH - liMargin;
                    ulW = 'auto';
                    ulH = 9999;
                    floatStyle = 'none';
                    self.cache.stepW = self.settings.stepLen * liOuterH - liMargin;
                    self.cache.prevAnimateObj = {
                        top: -self.cache.stepW
                    };
                    self.cache.nextAnimateObj = {
                        top: 0
                    };
                    self.cache.leftOrTop = 'top';
            }
            self.elements.wrap.css({
                position: 'static' ? 'relative' : self.elements.wrap.css('position'),
                width: wrapW,
                height: wrapH,
                overflow: 'hidden'
            });
            self.elements.ul.css({
                position: 'relative',
                width: ulW,
                height: ulH
            });
            self.elements.li.css({
                float: floatStyle
            });
        },
        /**
         * 事件绑定
         */
        bind: function(){
            var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, self;

            self = this;
            if ((_ref = self.settings.btnGo.left) != null) {
                $(_ref).click(function(ev) {
                    ev.preventDefault();
                    self.prev();
                });
            }
            if ((_ref1 = self.settings.btnGo.right) != null) {
                $(_ref1).click(function(ev) {
                    ev.preventDefault();
                    self.next();
                });
            }
            if ((_ref2 = self.settings.pauseElement) != null) {
                $(_ref2).click(function(ev) {
                    ev.preventDefault();
                    self.pause();
                });
            }
            if ((_ref3 = self.settings.resumeElement) != null) {
                $(_ref3).click(function(ev) {
                    ev.preventDefault();
                    self.resume();
                });
            }
            if ((_ref4 = self.elements.wrap) != null) {
                $(_ref4).hover(function() {
                    self.pause();
                }, function() {
                    self.resume();
                });
            }
        },
        /**
         * 滚动函数
         */
        move: function(){
            var time, moveEvent, self;

            self = this;
            if (self.settings.isAuto) {
                switch (self.settings.direction) {
                    case 'forward':
                        moveEvent = self.prev;
                        break;
                    case 'backward':
                        moveEvent = self.next;
                }
                time = self.settings.time;
                setTimeout(function() {
                    moveEvent.call(self);
                    setTimeout(arguments.callee, time);
                }, time);
                this.cache.moveBefore = this.cache.moveAfter = function() {
                    return null;
                };
            } else {
                this.cache.moveBefore = function() {
                    return self.cache.allowgSlider = false;
                };
                this.cache.moveAfter = function() {
                    return self.cache.allowgSlider = true;
                };
            }
        },
        /**
         * 前一组
         */
        prev: function(){
            var preEls, ul, self;
            self = this;
            if (this.cache.allowgSlider) {
            	self.cache.allowgSlider = false;
            	self.cache.moveBefore.call(self);
                self.settings.prevBefore.call(self);
                ul = self.elements.ul;
                preEls = ul.children().slice(0, self.settings.stepLen);
                preEls.clone().appendTo(ul);
                ul.animate(this.cache.prevAnimateObj, self.settings.duration, function() {
                    ul.css(self.cache.leftOrTop, 0);
                    preEls.remove();
                    self.cache.moveAfter.call(self);
                    self.settings.prevAfter.call(self);
                    self.imgLoad();
                    self.cache.allowgSlider = true;
                });
            }
        },
        /**
         * 后一组
         */
        next: function(){
            var sufEls, ul, self;

            self = this;
            if (self.cache.allowgSlider) {
            	self.cache.allowgSlider = false;
            	self.cache.moveBefore.call(self);
                self.settings.nextBefore.call(self);
                ul = self.elements.ul;
                sufEls = ul.children().slice(-self.settings.stepLen);
                sufEls.clone().prependTo(ul);
                ul.css(self.cache.leftOrTop, -self.cache.stepW).animate(self.cache.nextAnimateObj, self.settings.duration, function() {
                    sufEls.remove();
                    self.cache.moveAfter.call(self);
                    self.settings.nextAfter.call(self);  
                    self.imgLoad();
                    self.cache.allowgSlider = true;
                });
            }
        },
        /**
         * 暂停
         */
        pause: function(){
            this.settings.pauseBefore.call(this);
            this.cache.allowgSlider = false;
            this.settings.pauseAfter.call(this);
        },
        /**
         * 继续
         */
        resume: function(){
            this.settings.resumeBefore.call(this);
            this.cache.allowgSlider = true;
            this.settings.resumeAfter.call(this);
        },
        /**
         * 图片加载
         */
        imgLoad: function(){
        	if(!this.settings.isImgLoad){return false}
        	var self = this,
        	el = self.elements.ul.children().slice(0, self.settings.stepLen);
        	
        	el.each(function(){
        		var imgNode = $(this).find('img');
        		imgNode.attr('src', imgNode.attr(self.settings.dataOriginal));
        	});
        }
    };

  $.fn.gSlider = function(options) {
    this.each(function(key, value) {
        new gSlider($(this), options);
    });
  };

  $.fn.gSlider.defaults = {
      isAuto: true,                     // 是否自动滚动
      isImgLoad: false,                // 是否图片后加载
      dataOriginal: 'data-original',  //图片存储属性名
      time: 3000,                 // 间隔时间（毫秒）
      direction: 'forward',           // 向前 -  forward / 向后 - backward
      duration: 500,                     // 移动速度（毫秒）
      showNum: 1,                     // 显示个数
      stepLen: 1,                     // 每次滚动步长
      type: 'horizontal',             // 水平滚动 - horizontal / 垂直滚动 - vertical
      btnGo: {left: null, right:null},
      prevBefore: function() {},      // 上一组移动前回调
      prevAfter: function() {},       // 上一组移动后回调
      nextBefore: function() {},      // 下一组移动前回调
      nextAfter: function() {},       // 下一组移动后回调
      pauseElement: null,             // 暂停按钮元素
      pauseBefore: function() {},     // 暂停前回调
      pauseAfter: function() {},      // 暂停后回调
      resumeElement: null,            // 继续按钮元素
      resumeBefore: function() {},    // 继续前回调
      resumeAfter: function() {}      // 继续后回调
  };
})(jQuery);
