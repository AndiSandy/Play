$(function(){

	window.angular_delay = true;


	var charTpl = [
		'<div ng-app="player" ng-controller="yundCtrl" style="text-align:center;position:fixed;bottom:0px;height:160px;width:100%">',
		//丢失次数
		'<div style="width: 100%;height:25px"><div style="width:30px;float:left" ng-repeat="lo in model.last"><div class="kbd ng-binding rate-half">{{lo.lastMiss}}</div></div></div>',
		//表图
		'<div style="height:135px"><div ng-repeat="lo in model.levels" style="width:30px;height:100%;float:left;position: relative;">',
		'<div style="height:{{((20*lo.alevel)||15)+10}}px;position:absolute;bottom:0px;width: 100%;" class="rate-{{model.cssMap[lo.alevel]}}">{{lo.alevel}}</div>',
		'<div class="kbd {{lo.last?\'rate-half\':\'\'}}">{{lo.miss}}</div>',
		'</div></div>',

		'</div>'
	];
	
	// 对象不存在 回调埋点
	var until_times = 0,until_max=10000;
	var _u = {
		until : function(time,condition,callback){
			if(condition()){
				try{
					callback();
				}catch(e){
					//baseApi.showTip(''+e);
				}
			}else{
				var t = setInterval(function(){
					if( until_times < until_max ){
						if(condition()){
							callback(); 
							clearTimeout(t);
						}
					}else{
						clearTimeout(t);
					}
					//baseApi.showTip("until_times:"+until_times);
					until_times ++ ;
				}, time);
					
			}
		}
	};
			
	_u.until(10,function(){
		return window.angular;
	},function(){
		var yunEl = $(charTpl.join(''));
		yunEl.appendTo(document.body);
		
		yunEl.css({
			zIndex:2147483650
		})

		var playerModule = angular.module("player",[]).config(function($sceProvider,$compileProvider) {
			// Completely disable SCE to support IE7.
			$sceProvider.enabled(false);
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript|#):/);
		});

		playerModule.
				controller("yundCtrl", ["$scope", "$timeout","$interval","$http", function ($scope,$timeout,$interval,$http) {
			var cssMap = {
				'0' : 'zero',
				'0.5' : 'half',
				'1' : 'one',
				'3' : 'three',
				'5' : 'five'	
			};
			var model = {
				levels : [],
				last : [],
				play : window.play,
				max : Math.floor( document.body.offsetWidth / 30 ),
				cssMap : cssMap,
				update : function(lo){
					this.levels.push(lo);
					if( lo.alevel >= 3 ){
						this.last.push(lo);
					}
					while( this.levels.length > this.max ){
						this.levels.shift();
					}
					while( this.last.length > this.max ){
						this.last.shift();
					}
					$scope.$apply();
				},
				setup : function(play){
					var m = this;
					this.play = play;
					this.play.listeners.push(function(lo){
						m.update(lo);
					});
				}
			};
			model.setup(play);
			$scope.model  =  model;
		}]);

		angular.init();		
				
	});
	
});