var Class = function Class(){};
Class.extend = function(proto){
	function Class(){
		var __proto = this;
		$.extend(__proto,proto);
		if( this.init ){
			this.init.apply(this,arguments);
		}
	}
	return Class;
}
function assertNotNull(s,msg){
	console.assert(s != null,msg);
}
var Game = Class.extend({
	//发生倍数概率
	rate : { '0' : 21.46, '0.5' : 39.73, '1': 23.71, '3':10, '5' : 5.12},
	rateParam : { '0' : 0, '0.5' : 0.5, '1' : 1, '3' : 3, '5' : 5},
	rateArr : [],
	seedArr :[],
	count : 0,
	radix : 10000,
	initNum : 0,
	progress : '0',
	msgQueue : new Queue(17),
	init : function(){
		var total = 0;
		for( var multiple in this.rate ){
			var brate = this.rate[multiple];
			var rate =  Math.ceil ( brate * ( this.radix / 100 ) );
			total += rate;
		}
		this.total = total;
		this.rateArr.length = total;
		this.seedArr.length = total;
		for(var i = 0; i < total; i ++){
			this.seedArr[i] = i;
		}
	},
	init1 : function(){
		var total = this.total;
		var initNum = 0;
		console.info("要初始化%s个数据",total);
		for( var multiple in this.rate ){
			this.thread(multiple);
			//break;
		}
		console.info('初始化完毕,总共初始化%s个数据',total);
	},
	thread :function(multiple){
		var scope = this;
		function task(multiple){
			var brate = this.rate[multiple];
			var rate =  Math.ceil ( brate * ( this.radix / 100 ) );
			console.info("正在初始化",brate,rate,multiple);
			//this.thread(rate,multiple);
			/**/
			for(var i = 0; i < rate; ){
				var at = this.random4seed();
				//console.info(multiple,at);
				this.rateArr[at] = multiple;
				i ++;
				this.initNum ++;
				this.progress = Math.round((this.initNum/this.radix)*10000)/100;
				//console.info("%s-初始化进度%s%",initNum,this.progress);
				//this.$scope.$apply();
			}
			//this.$scope.$apply();
		};
		task.apply(scope,[multiple]);
		/*
		setTimeout(function(){
			task.apply(scope,[multiple]);	
		},1000);*/
	},
	seed : function( seed ){
		return parseInt( (seed || this.radix) * Math.random() );
	},
	random4seed : function(){
		var seedNum = this.seedArr.length;
		var seedAt = this.seed(seedNum);
		var	rateAt = this.seedArr[seedAt];
		//remove seedAt
		this.seedArr.splice(seedAt,1);
		return rateAt;
	},
	random : function(seed){
		var r = (new Date().getTime() + (++this.count) * this.seed(seed) ) % (seed || this.radix) ;
		assertNotNull(r,"random error");
		return r;
	},
	random4rate : function(){
		var r = this.random(this.total);
		return {rate:this.rateArr[r] || this.rateArr[this.count],at:r};
	},
	play : function( yund ,callback){
		var rateo = this.random4rate(),rate = rateo.rate;
		var y = yund * rate;
		var o = {rate : rate, yund : y,at:rateo.at };
		var content = "";
		if(rate > 1 ){
			var _3dstyle = "text-shadow: 0 1px 0 #fff,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em;color:red;";
			content = "恭喜您,云钻x{rate}倍,获得了{yund}个云钻!".format(o);
			//console.info("%c%s",_3dstyle,o.content);
		}else if( rate > 0 ){
			content = "恭喜您获得{yund}个云钻!".format(o);
		}else{
			content = "未中奖,请再接再厉吧!";
		}
		o.content = content;
		this.msgQueue.qin(o);
		hover(o);
		console.info("{content}\tx{rate}倍概率\t概率位{at}".format(o));
		callback && callback(o);
		return o;
	}
});
app.controller('playCtrl', function($scope,$timeout) {
	var timeid = "初始化对象";
		console.time(timeid);
	var game = window.game = new Game()
	console.timeEnd(timeid);
	game.$scope = $scope;
	$scope.yund = 10;
	$scope.game = game;
	$scope.cssMap = cssMap;
	$scope.title = "play game now";
	$timeout(function(){
		var timeid = "初始化数据";
		console.time(timeid);
		game.init1();
		console.timeEnd(timeid);
	},2000);
});