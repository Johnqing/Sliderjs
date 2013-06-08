gSlider
========

> 这是一块基于jquery的slider插件


 **CSS**
 *    #target {width:200px;height:50px;overflow:hidden;}
 **Use**
 *  	$('#target').gSlider(options);
 **options**
 *		distance:200,//一次滚动的距离
 *		duration:20,//缓动效果，单次移动时间，越小速度越快，为0时无缓动效果
 *		time:5,//停顿时间，单位为秒
 *		direction: 'left',//滚动方向，'left','right','up','down'
 *		scrollAmount:1,//步长
 *		scrollDelay:20//时长，单位为毫秒
 *		isEqual:true,//所有滚动的元素长宽是否相等,true,false
 *		loop: 0,//循环滚动次数，0时无限
 *		btnGo:{left:'#goL',right:'#goR'},//控制方向的按钮ID，有四个属性left,right,up,down分别对应四个方向
 *		eventGo:'click',//鼠标事件
 *		controlBtn:{left:'#goL',right:'#goR'},//控制加速滚动的按钮ID，有四个属性left,right,up,down分别对应四个方向
 *		newAmount:4,//加速滚动的步长
 *		eventA:'mouseenter',//鼠标事件，加速
 *		eventB:'mouseleave',//鼠标事件，原速
 *		navId:'#targetNav', //导航容器ID，导航DOM:<ul><li>1</li><li>2</li><ul>,导航CSS:.navOn
 *		eventNav:'click' //导航事件
