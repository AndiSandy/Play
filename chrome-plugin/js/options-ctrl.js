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
			resources : [],
			add : function(){
				var pojo = {host:this.params.host};
				this.resources.push(pojo);
			},
			save : function(){
				for(var i = 0; i < this.resources.length; i ++){
					var resource = this.resources[i];
					resource.scripts = (resource.scriptsTxt||'').split(',');
					resource.stylesheets = (resource.stylesheetsTxt||'').split(',');
				}
				_.cache(this.modelid,this);
				alert.success('保存成功');
			},
			init : function(){
				var pojo = _.cache(this.modelid) || {"title":"yund options","modelid":"yund","params":{"host":"http://localhost:9080/"},"resources":[{"host":"http://10.27.93.163:8000/js-project/","scriptesTxt":"lib/jquery.indexeddb.js,lib/storedb.js,lib/angular.js,base.js,player.js,player-chart.js","stylesheetsTxt":"css/play.css","matches":"/pointGame/pgWlcm.do","name":"yund","scriptsTxt":"lib/jquery.indexeddb.js,lib/storedb.js,lib/angular.js,base.js,player.js,player-chart.js","scripts":["lib/jquery.indexeddb.js","lib/storedb.js","lib/angular.js","base.js","player.js","player-chart.js"],"stylesheets":["css/play.css"]},{"host":"http://10.27.93.163:8000/js-project/","matches":"/sign/welcome.do","scriptsTxt":"signin/signin.js","name":"signin","scripts":["signin/signin.js"],"stylesheets":[""]},{"host":"http://10.27.93.163:8000/js-project/","name":"el","matches":"/indexLearningList|oa/","scriptsTxt":"el/e-learning-auto.js","scripts":["el/e-learning-auto.js"],"stylesheets":[""]}],"host":"http://localhost:9080/","urls":"lib/angular.js,base.js,player.js,player-chart.js","res":["lib/angular.js","base.js","player.js","player-chart.js"],"scriptsTxt":"lib/jquery.indexeddb.js,lib/storedb.js,lib/angular.js,base.js,player.js,player-chart.js","stylesheetsTxt":"css/play.css","scripts":["lib/jquery.indexeddb.js","lib/storedb.js","lib/angular.js","base.js","player.js","player-chart.js"],"stylesheets":["css/play.css"]};
				$.extend(this,pojo);
			}
		};
		model.init();
		/**/
		$.extend($scope,model,box,{model:model});
	}]);


}());