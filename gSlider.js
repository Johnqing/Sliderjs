(function($){
	/**
	 * 默认参数
	 * @type {Object}
	 */
	var defaultConfig = {
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
                firstVCon = Math.round(self.wrapWidth/self.el.li.eq(0).width());
            self.firstClone = self.el.li.slice(0, firstVCon);
            self.getUlWidth();
            self.createNumBtn();
            self.bindEvent();
		},
        getUlWidth: function(){
            var self = this,
                liNode = self.el.li,
                len = liNode.length,
                ulWidth = liNode.width() * len;
            self.UlWidth = ulWidth;
            self.el.ul.width(10000);
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
        bindEvent: function(){
            var self = this;
            self.sliderNum = self.target.find('.gSilderNum span');
            self.sliderNum.bind('mouseenter',function() {
                self.index = self.sliderNum.index($(this));
                self.move();
            }).eq(0).trigger("mouseenter");

            self.target.hover(function() {
                clearInterval(self.timer);
            },function() {
                self.timer = setInterval(function() {
                    if(self.index == self.len) { //如果索引值等于li元素个数，说明最后一张图播放完毕，接下来要显示第一张图，即调用showFirPic()，然后将索引值清零
                        self.moveFirst();
                        self.index = 0;
                    } else { //如果索引值不等于li元素个数，按普通状态切换，调用showPics()
                        self.move(self.index);
                    }
                    self.index++;
                },3000); //此3000代表自动播放的间隔，单位：毫秒
            }).trigger("mouseleave");
        },
        move: function(){
            var self = this,
                ulNode = self.el.ul,
                //根据index值计算ul元素的left值
                nowLeft = -(self.index * self.wrapWidth);
            //通过animate()调整ul元素滚动到计算出的position
            ulNode.stop(true,false).animate({"left":nowLeft},500);
            //为当前的按钮切换到选中的效果
            self.sliderNum.removeClass(self.settings.currClass).eq(self.index).addClass(self.settings.currClass);
        },
        moveFirst: function(){
            var self = this,
                ulNode = self.el.ul,

                //根据index值计算ul元素的left值
                nowLeft = -(self.len*self.wrapWidth);
                var cloneNode = $(self.firstClone).clone();
                cloneNode.appendTo(ulNode)
                ulNode.stop(true,false).animate({"left": nowLeft},500,function() {
                    //通过callback，在动画结束后把ul元素重新定位到起点，然后删除最后一个复制过去的元素
                    ulNode.css("left","0");
                    cloneNode.each(function(){
                        $(this).remove();
                    });
                });
                self.sliderNum.removeClass(self.settings.currClass).eq(0).addClass(self.settings.currClass); //为第一个按钮添加选中的效果
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