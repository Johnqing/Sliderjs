gSlider
========

> 这是一块基于jquery的slider插件

1. 支持图片滚动
2. 横向滚动
3. 纵向滚动
4. 文字无限滚动
5. 点击按钮滚动等

**CSS**
*    #target {width:200px;height:50px;overflow:hidden;}
 

**Use**
*  	$('#target').gSlider(options);


**options**
* isAuto: true,                     // 是否自动滚动
* isImgLoad: false,                // 是否图片后加载
* dataOriginal: 'data-original',  //图片存储属性名
* time: 3000,                 // 间隔时间（毫秒）
* direction: 'forward',           // 向前 -  forward / 向后 - backward
* duration: 500,                     // 移动速度（毫秒）
* showNum: 1,                     // 显示个数
* stepLen: 1,                     // 每次滚动步长
* type: 'horizontal',             // 水平滚动 - horizontal / 垂直滚动 - vertical
* btnGo: {left: null, right:null},
* prevBefore: function() {},      // 上一组移动前回调
* prevAfter: function() {},       // 上一组移动后回调
* nextBefore: function() {},      // 下一组移动前回调
* nextAfter: function() {},       // 下一组移动后回调
* pauseElement: null,             // 暂停按钮元素
* pauseBefore: function() {},     // 暂停前回调
* pauseAfter: function() {},      // 暂停后回调
* resumeElement: null,            // 继续按钮元素
* resumeBefore: function() {},    // 继续前回调
* resumeAfter: function() {}      // 继续后回调
