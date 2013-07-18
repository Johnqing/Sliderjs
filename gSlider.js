/**
 * 多图滚动插件
 * 
 * @module gSlider
 * @author liuqing
 */
;(function($) {
    /**
    * gSlider类(此类是私有类，调用需要使用Example中的方法)111111
    *
    *
    * @class gSlider
    * @param {Object} element 实例化对象在此dom对象内执行
    * @param {Object} options 参数
    * @example 
        $(xx).gSlider({
            isAuto: true,                     // 是否自动滚动
            isImgLoad: false,                // 是否图片后加载
            dataOriginal: 'data-original',  //图片存储属性名
            speed: 3000,                 // 间隔时间（毫秒）
            direction: 'forward',           // 向前 -  forward / 向后 - backward
            duration: 500,                     // 移动速度（毫秒）
            showNum: 1,                     // 显示个数
            stepLen: 1,                     // 每次滚动步长
            type: 'horizontal',             // 水平滚动 - horizontal / 垂直滚动 - vertical
            btnGo: {left: null, right:null},
            beforeCallback: function(){},
            afterCallback: function(){}
        });
    * @constructor
    */
    function gSlider(element, options) {
        this.elements = {
            wrap: element,
            ul: element.children('ul'),
            li: element.children('ul').children('li')
        };
        this.len = this.elements.li.length;
        this.settings = options;
        this.cache = {
            allowgSlider: true
        };
        
        this.pos = this.index = 0;

        this.timer = false;
        this.init();
    }
    gSlider.prototype = {
        /**
         * @method 初始化
         */
        init: function() {
            var self = this;
            self.elements.ul.append(self.elements.ul.html());
            self.settings.beforeCallback.call(self);
            self.setStyle();
            self.move();
            self.bind();
            self.settings.afterCallback.call(self);
            self.imgLoad();
        },
        setStyle: function(){
            var self = this;
            switch (self.settings.type) {
                case 'horizontal':
                    self.leftOrTop = 'left';
                    self.oneWidth = self.settings.oneWidth ? self.settings.oneWidth : self.elements.li.eq(0).outerWidth();
                    self.elements.ul.width(self.oneWidth * self.len * 2);
                    break;
                case 'vertical':
                    self.leftOrTop = 'top';
                    self.oneWidth = self.settings.oneWidth ? self.settings.oneWidth : self.elements.li.eq(0).outerHeight();
                    self.elements.li.css({
                        'float': 'none',
                        'display': 'block'
                    });
                    self.elements.ul.height(self.oneWidth * self.len * 2);
                    break;  
            };
            self.wraperSize = self.oneWidth * self.len;
            self.stepWidth = self.oneWidth * self.settings.stepLen;
            self.elements.ul.css({
                position: 'relative'
            });
        },
        bind: function(){
            var self = this;
            $(self.settings.btnGo.left).bind('click', function (){
                clearInterval(self.timer);
                self.index++;
                self.moving(self.elements.ul[0], -self.stepWidth*self.index, function(){
                    self.move();
                });
            });
            $(self.settings.btnGo.right).bind('click', function (){
                clearInterval(self.timer);
                self.index--;
                if (self.index<0) {
                    if (self.index === -1) {
                        self.pos = -self.stepWidth * self.len;
                    };
                    self.index = self.len + self.index;                     
                };
                self.moving(self.elements.ul[0], -self.stepWidth*self.index, function(){
                    self.move();
                });
            });
        },
        move: function(){
            var self = this;
            if (self.settings.isAuto) {
                self.timer = setInterval(function(){
                    self.index++;
                    self.moving(self.elements.ul[0], -self.stepWidth*self.index);
                }, self.settings.speed);
            }
        },
        moving: function(obj, iTarget, callback){
            var self = this;
            self.imgLoad();
            callback = callback || function(){}
            clearInterval(obj.tLimer);
            obj.tLimer = setInterval(function (){
                var speed = (iTarget-self.pos)/6;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                
                if(self.pos == iTarget){
                    clearInterval(obj.tLimer);
                    callback();
                }
                
                self.pos += speed;

                obj.style[self.leftOrTop] = (self.pos % self.wraperSize)+'px';

            }, 30);
        },
        /**
         * @method 图片加载
         */
        imgLoad: function(){
            var self = this;
            if(!self.settings.isImgLoad){return false}
            var len = Math.abs(self.index % self.len) *  self.settings.showNum;
                liNode = self.elements.ul.children().slice(len, len + self.settings.showNum);
            liNode.each(function(){
                var imgNode = $(this).find('img');
                if(imgNode.attr(self.settings.dataOriginal)){
                    imgNode.attr('src', imgNode.attr(self.settings.dataOriginal)).removeAttr(self.settings.dataOriginal);
                }   
            });
            
        }
    };
  
  $.fn.gSlider = function(options) {
      options = $.extend({}, $.fn.gSlider.defaults, options);
      this.each(function(){
          new gSlider($(this), options);
      });
  };
  /**
   * @property 默认配置
   * @type {Object}
   * 
   */
  $.fn.gSlider.defaults = {
      oneWidth: null,
      isAuto: true,                     // 是否自动滚动
      isImgLoad: false,                // 是否图片后加载
      dataOriginal: 'data-original',  //图片存储属性名
      speed: 3000,                 // 间隔时间（毫秒）
      direction: 'forward',           // 向前 -  forward / 向后 - backward
      duration: 500,                     // 移动速度（毫秒）
      showNum: 1,                     // 显示个数
      stepLen: 1,                     // 每次滚动步长
      type: 'horizontal',             // 水平滚动 - horizontal / 垂直滚动 - vertical
      btnGo: {left: null, right:null},
      beforeCallback: function(){},
      afterCallback: function(){}
  };
})(jQuery);
