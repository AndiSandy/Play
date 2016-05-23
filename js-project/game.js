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
	rateArr : [],
	count : 0,
	radix : 10000,
	initNum : 0,
	progress : '0',
	init : function(){
		var total = 0;
		var initNum = 0;
		for( var multiple in this.rate ){
			var brate = this.rate[multiple];
			var rate =  Math.ceil ( brate * ( this.radix / 100 ) );
			total += rate;
		}
		//= this.radix
		this.rateArr.length = total;
		console.info("要初始化%s个数据",total);
		for( var multiple in this.rate ){
			var brate = this.rate[multiple];
			var rate =  Math.ceil ( brate * ( this.radix / 100 ) );
			console.info("正在初始化",brate,rate,multiple);
			//this.thread(rate,multiple);
			/**/
			for(var i = 0; i < rate; ){
				var at = this.random();
				var miss = 0;
				while( this.rateArr[at||0] != null ){
					miss ++;
					if( miss > 10 ){
						at = this.selectUninit();
					}else{
						at = this.random();
					}
				}
				//console.info(multiple,at);
				this.rateArr[at] = multiple;
				i ++;
				this.initNum = initNum ++;
				this.progress = Math.round((initNum/this.radix)*10000)/100;
				//console.info("%s-初始化进度%s%",initNum,this.progress);
			}
			//break;
		}
		console.info('初始化完毕,总共初始化%s个数据',total);
	},
	selectUninit : function(){
		var uninit = [];
		for(var i = 0; i < this.rateArr.length; i ++){
			if( this.rateArr[i] == null ){
				uninit.push(i);
			}
		}
		var at = this.seed(uninit.length);
		var atValue = uninit[at];
		assertNotNull(atValue,"selectUninit error ：" + at);
		return atValue ;
	},
	seed : function( seed ){
		return parseInt( (seed || this.radix) * Math.random() );
	},
	random : function(){
		var r = (new Date().getTime() + (++this.count) * this.seed() ) % this.radix ;
		assertNotNull(r,"random error");
		return r;
	},
	random4rate : function(){
		var r = this.random();
		return this.rateArr[r] || this.rateArr[this.count];
	},
	play : function( yund ){
		var rate = this.random4rate();
		var y = yund * rate;
		if(rate > 1 ){
			var _3dstyle = "text-shadow: 0 1px 0 #fff,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em;color:red;";
			console.info("%c恭喜您,云钻x%s倍,获得了%s个云钻!",_3dstyle,rate,y);
		}
		return {rate : rate, yund : y };
	}
});
app.controller('playCtrl', function($scope,$timeout) {
	var s = new Date().getTime();
	var game = window.game = new Game()
	var e = new Date().getTime();
	console.info("耗时",(e-s))
	$scope.game = game;
	$scope.title = "play game now";
});