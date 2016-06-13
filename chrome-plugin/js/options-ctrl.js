(function(){
	var playerModule = angular.module("player",[]).config(function($sceProvider,$compileProvider) {
		// Completely disable SCE to support IE7.
		$sceProvider.enabled(false);
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript|#):/);
		//$scope.backendName = 'suning player'
	});

	var dialog = {
			id : '#add',
			title : '摄像头信息',
			oper : 'doadd',
			operName : '添加',
			close : function(){
				$(this.id).modal('hide');
			}
	};
	var confirm = {
			id : '#config',
			title : '删除',
			close : function(){
				$(this.id).modal('hide');
			}
	};
	var alert = {
		id : '#alert',
		msgs : {
			success :{css:'success',title:'Well done!',content:'hello world!'},
			info :{css:'info',title:'Heads up!',content:'hello world!'},
			warning :{css:'warning',title:'Warning!',content:'hello world!'},
			danger :{css:'danger',title:'Oh snap!',content:'hello world!'}
		},
		msg : {css:'info',title:'Heads up!',content:'hello world!'},
		close : function(){
			$(this.id).alert('close');
		},
		alert : function(type,content){
			var msg = this.msgs[type];
			msg.content = content;
			this.msg = msg;
			$(alert.id).autocenter();
			$(this.id).alert();
		},
		success : function(content){
			var msg = this.alert('success',content);
		},
		info : function(content){
			var msg = this.alert('info',content);
		}, 
		warning : function(content){
			var msg = this.alert('warning',content);
		},
		danger : function(content){
			var msg = this.alert('danger',content);
		}
	};
	var box = {
		confirm : confirm,
		dialog : dialog,
		alert : alert
	};
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
						uri : 'ftl/yund-option.ftl',
						icon : 'fa-lemon-o'
					}
				]
			}
		];
		var action = {
			currAction : {uri:'ftl/yund-option.ftl'},
			doaction : function(action){
				this.currAction = action;
			}
		};
		var user = {
			userName : 'none'
		};
		$.extend($scope,{
			uri : 'ftl/yund-option.ftl',
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
			modelid : 'yund',
			params : {},
			save : function(){
				this.params.res = this.params.urls.split(',');
				_.cache(this.modelid,this.params);
				alert.success('保存成功');
			},
			init : function(){
				this.params = _.cache(this.modelid) || {};
			}
		};
		model.init();
		/**/
		$.extend($scope,model,box,{model:model});
	}]);

}());