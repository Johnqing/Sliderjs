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
* btnGo: {left: null, right:null}, //按钮
* beforeCallback: function(){},    //初始化之前 需要执行的回调函数
* afterCallback: function(){}      //初始化完成后，需要执行的回调函数
