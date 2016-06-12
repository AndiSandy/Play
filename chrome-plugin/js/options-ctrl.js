(function(){
	var playerModule = angular.module("player",[]).config(function($sceProvider,$compileProvider) {
		// Completely disable SCE to support IE7.
		$sceProvider.enabled(false);
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
		//$scope.backendName = 'suning player'
	});

	playerModule.
			controller("mainCtrl", ["$scope", "$timeout","$interval","$http", function ($scope,$timeout,$interval,$http) {
		var sys = {
			backendName : 'suning player',
			title : 'index'
		};
		var menus = [
			{
				name : 'parent',
				subs : [
					{
						name:'yund',
						url : 'ftl/yund-option.ftl',
						icon : 'fa-lemon-o'
					}
				]
			}
		];
		var action = {
			currAction : {url:'ftl/yund-option.ftl'},
			doaction : function(action){
				this.currAction = action;
			}
		};
		var user = {
			userName : 'none'
		};
		$.extend($scope,{
			sys:sys,
			menus : menus,
			user : user,
			action : action
		})
	}]);

	playerModule.
			controller("yundCtrl", ["$scope", "$timeout","$interval","$http", function ($scope,$timeout,$interval,$http) {
		var model = {
			title : 'yund options',
			modelid : 'yund'
		};
		$.extend($scope,{
			model:model
		});
	}]);

}());