$(function(){

	window.angular_delay = true;


	var charTpl = [
		'<div ng-app="player" ng-controller="yundCtrl" style="position:absolute;bottom:0px;width:100%"><div ng-repeat="level in model.levels">{{level}}</div></div>'
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

		$(charTpl.join('')).appendTo(document.body);

		var playerModule = angular.module("player",[]).config(function($sceProvider,$compileProvider) {
			// Completely disable SCE to support IE7.
			$sceProvider.enabled(false);
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript|#):/);
		});

		playerModule.
				controller("yundCtrl", ["$scope", "$timeout","$interval","$http", function ($scope,$timeout,$interval,$http) {
			var model = {
				levels : [],
				play : play,
				max : 50,
				update : function(lo){
					this.levels.push(lo.alevel);
					while( this.levels.length > this.max ){
						this.levels.shift();
					}
				},
				setup : function(play){
					this.play = play;
					this.play.listeners.push(this.update);
				}
			};
			model.setup(play);
			$scope.model  =  model;
		}]);

		angular.init();		
				
	});
	
});