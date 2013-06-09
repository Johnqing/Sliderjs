
(function($){
    var bind = function(object, fun) {
        return function(event) {
            return fun.call(object, (event || window.event));
        }
    },
    animate = {
        easeOutQuad: function(t,b,c,d){
            return -c *(t/=d)*(t-2) + b;
        },
        easeOutQuint: function(t,b,c,d){
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        }
    };
    var GSlider = function(target, opts){
        this.target = target; //滚动元素容器
        this.settings = opts;

        this.scrollObj = target.get(0);  //滚动元素容器DOM
        this.scrollW = target.width();   //滚动元素容器的宽度
        this.scrollH = target.height();  //滚动元素容器的高度
        this.el = target.children();     //滚动元素
        this.cel = this.el.children();   //滚动子元素
        this.scrollSize = 0;             //滚动元素尺寸
        //滚动类型，1左右，0上下
        this.type = (opts.direction == 'left' || opts.direction == 'right') ? 1 : 0;
        this.scrollId = this.rollId = this.isMove = this.targetId = null;
        //滚动动画的参数,t:当前时间，b:开始的位置，c:改变的位置，d:持续的时间，e:结束的位置
        this.t = this.b = this.c = this.d = this.e = 0;
        //子元素的尺寸与个数
        this.size = this.len = 0;
        this.nav = this.navBtn = null;
        this.arrPos = [];
        this.viewNum = this.rollNum = this.moveNum = 0;

        this.init();
    };
    GSlider.prototype = {
        init: function(){
            var self = this;
                navTpl = self.navBuild();
            self.moveNav(navTpl);
            self.initPostion();
            self.moving();
        },
        start: function(){
            var self = this;
            self.rollId = setInterval(function(){
                self.rollFunc();
            }, self.settings.time);
        },
        stop: function(){
            clearInterval(this.rollId);
        },
        initPostion: function(){
            var self = this;
            //设定初始位置
            if (self.settings.direction == 'right' || self.settings.direction == 'down') {
                self.scrollObj[self.type ? 'scrollLeft' : 'scrollTop'] = self.scrollSize;
            }else{
                self.scrollObj[self.type ? 'scrollLeft' : 'scrollTop'] = 0;
            }
        },
        navBuild: function(){
            var self = this;
            self.el.css(self.type ? 'width' : 'height', 10000);
            //获取滚动元素的尺寸
            var navHtml = '<ul>';
            //判断是否等宽
            if (self.settings.isEqual) {
                self.size = self.cel[self.type ? 'outerWidth' : 'outerHeight']();
                self.len = self.cel.length;
                self.scrollSize = self.size * self.len;
                for(var i=0; i<self.len; i++){
                    self.arrPos.push(i*self.size);
                    navHtml += '<li>'+ (i+1) +'</li>';
                }
            }else{
                self.cel.each(function(i){
                    self.arrPos.push(self.scrollSize);
                    self.scrollSize += $(this)[self.type ? 'outerWidth' : 'outerHeight']();
                    navHtml += '<li>'+ (i+1) +'</li>';
                });
            }
            navHtml += '</ul>';
            return navHtml;
        },
        moveNav: function(navTpl){
            var self = this;
            //滚动元素总尺寸小于容器尺寸，不滚动
            if (self.scrollSize<(self.type ? self.scrollW : self.scrollH)) return;
            //克隆滚动子元素将其插入到滚动元素后，并设定滚动元素宽度
            self.el.append(self.cel.clone()).css(self.type ? 'width' : 'height', self.scrollSize*2);

            //轮换导航
            if (self.settings.navId) {
                self.nav = $(self.settings.navId).append(navTpl).hover( self.stop, self.start );
                self.navBtn = $('li', self.nav);
                self.navBtn.each(function(i){
                    $(this).bind(self.settings.eventNav,function(){
                        if(self.isMove) return;
                        if(self.viewNum == i) return;
                        self.rollFunc(self.arrPos[i]);
                        self.navBtn.eq(self.viewNum).removeClass(self.settings.currClass);
                        self.viewNum = i;
                        $(this).addClass(self.settings.currClass);
                    });
                });
                self.navBtn.eq(self.viewNum).addClass(self.settings.currClass);
            }
        },
        moving: function(){
            var self = this;
            if(self.settings.istarget){
                //滚动开始
                //targetId = setInterval(scrollFunc, self.settings.scrollDelay);
                self.targetId = setTimeout(bind(self, self.scrollFunc), self.settings.scrollDelay);
                //鼠标划过停止滚动
                self.target.hover(
                    function(){
                        clearInterval(self.targetId);
                    },
                    function(){
                        //targetId = setInterval(scrollFunc, self.settings.scrollDelay);
                        clearInterval(self.targetId);
                        self.targetId = setTimeout(bind(self, self.scrollFunc), self.settings.scrollDelay);
                    }
                );

                //控制加速运动
                if(self.settings.controlBtn){
                    $.each(self.settings.controlBtn, function(i,val){
                        $(val).bind(self.settings.eventA,function(){
                            self.settings.direction = i;
                            self.settings.oldAmount = self.settings.scrollAmount;
                            self.settings.scrollAmount = self.settings.newAmount;
                        }).bind(self.settings.eventB,function(){
                                self.settings.scrollAmount = self.settings.oldAmount;
                            });
                    });
                }
            }else{
                if(self.settings.isAuto){
                    //轮换开始
                    self.start();

                    //鼠标划过停止轮换
                    self.target.hover( self.stop, self.start );
                }

                //控制前后走
                if(self.settings.btnGo){
                    $.each(self.settings.btnGo, function(i,val){
                        $(val).bind(self.settings.eventGo,function(){
                            //if(isMove == true) return;
                            self.settings.direction = i;
                            self.rollFunc();
                            if (self.settings.isAuto) {
                                self.stop();
                                self.start();
                            }
                        });
                    });
                }
            }
        },
        scrollFunc: function(){
            var self = this,
                _dir = (self.settings.direction == 'left' || self.settings.direction == 'right') ? 'scrollLeft' : 'scrollTop';

            if(self.settings.istarget){
                if (self.settings.loop > 0) {
                    self.moveNum += self.settings.scrollAmount;
                    if(self.moveNum > self.scrollSize*self.settings.loop){
                        self.scrollObj[_dir] = 0;
                        return clearInterval(self.targetId);
                    }
                }
                var newPos = self.scrollObj[_dir] + (self.settings.direction == 'left' || self.settings.direction == 'up' ? 1 : -1) * self.settings.scrollAmount;
            }else{
                if(self.settings.duration){
                    if(self.t++ < self.d){
                        self.isMove = true;
                        var newPos = Math.ceil(animate.easeOutQuad(self.t, self.b, self.c, self.d));
                        if(self.t == self.d){
                            newPos = self.e;
                        }
                    }else{
                        newPos = self.e;
                        clearInterval(self.scrollId);
                        self.isMove = false;
                        return;
                    }
                }else{
                    var newPos = self.e;
                    clearInterval(self.scrollId);
                }
            }

            if(self.settings.direction == 'left' || self.settings.direction == 'up'){
                if(newPos >= self.scrollSize){
                    newPos -= self.scrollSize;
                }
            }else{
                if(newPos <= 0){
                    newPos += self.scrollSize;
                }
            }
            self.scrollObj[_dir] = newPos;

            if(self.settings.istarget){
                self.targetId = setTimeout(bind(self, self.scrollFunc), self.settings.scrollDelay);
            }else if(self.t < self.d){
                if(self.scrollId) clearTimeout(self.scrollId);
                self.scrollId = setTimeout(bind(self, self.scrollFunc), self.settings.scrollDelay);
            }else{
                self.isMove = false;
            }
        },
        rollFunc: function(pPos){
            var self = this;
            self.isMove = true;
            var _dir = (self.settings.direction == 'left' || self.settings.direction == 'right') ? 'scrollLeft' : 'scrollTop',
                _neg = self.settings.direction == 'left' || self.settings.direction == 'up' ? 1 : -1;

            self.rollNum = self.rollNum + _neg;
            //得到当前所看元素序号并改变导航CSS
            if(pPos == undefined && self.settings.navId){
                self.navBtn.eq(self.viewNum).removeClass('navOn');
                self.viewNum +=_neg;
                if(self.viewNum >= self.len){
                    self.viewNum = 0;
                }else if(self.viewNum < 0){
                    self.viewNum = self.len-1;
                }
                self.navBtn.eq(self.viewNum).addClass('navOn');
                self.rollNum = self.viewNum;
            }

            var _temp = self.rollNum<0 ? self.scrollSize : 0;
            self.t = 0;
            self.b = self.scrollObj[_dir];
            //c=(pPos != undefined)?pPos:_neg*self.settings.distance;
            self.e = (pPos != undefined) ? pPos : _temp+(self.settings.distance*self.rollNum)%self.scrollSize;
            if(_neg==1){
                if(self.e > self.b){
                    self.c = self.e - self.b;
                }else{
                    self.c = self.e + self.scrollSize - self.b;
                }
            }else{
                if(self.e > self.b){
                    self.c = self.e - self.scrollSize - self.b;
                }else{
                    self.c = self.e - self.b;
                }
            }
            self.d = self.settings.duration;

            //scrollId = setInterval(bind(self, self.scrollFunc), self.settings.scrollDelay);
            if(self.scrollId) clearTimeout(self.scrollId);
            self.scrollId = setTimeout(bind(self, self.scrollFunc), self.settings.scrollDelay);
        }
    };
    $.fn.gSlider = function(options){
        var opts = $.extend({},$.fn.gSlider.defaults, options);

        return this.each(function(){
            new GSlider($(this), opts);
        });
    };
    $.fn.gSlider.defaults = {
        istarget:false,//是否为target
        isEqual:true,//所有滚动的元素长宽是否相等,true,false
        loop: 0,//循环滚动次数，0时无限
        newAmount:3,//加速滚动的步长
        eventA:'mousedown',//鼠标事件，加速
        eventB:'mouseup',//鼠标事件，原速
        isAuto:true,//是否自动轮换
        time:5000,//停顿时间，单位为秒
        currClass: 'navOn',
        duration:50,//缓动效果，单次移动时间，越小速度越快，为0时无缓动效果
        eventGo:'click', //鼠标事件，向前向后走
        direction: 'left',//滚动方向，'left','right','up','down'
        scrollAmount:1,//步长
        scrollDelay:10,//时长
        eventNav:'click'//导航事件
    };

    $.fn.gSlider.setDefaults = function(settings) {
        $.extend( $.fn.gSlider.defaults, settings );
    };

})(jQuery);
