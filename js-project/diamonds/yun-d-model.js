$.jsonp = function(url,data,callback,callname,method){
	var post = {
		type: method||"POST",
		url: url,
		cache : false,
		async : false,
		data : data||{},
		dataType : "jsonp",
		jsonp : "callback",
		jsonpCallback : callname,
		success: callback
	};
	$.ajax(post);
}

//input:{0,1,2,3,4,5}-output:{0,1,2,3,4,5}
//json-input:{inputNum,dt,gameActivitiesConfigureId},output:{awardsResult:奖励结果0、0.5、1、3、5,content:提示内容,result:结果位置,resultCode:结果编码,resultType:结果类型,state:状态}
//http://vip.suning.com/pointGame/execute.do?dt={dt}&inputNum={10}&gameActivitiesConfigureId={gameActivitiesConfigureId}

//jsonp-callbackMemberListPointsFun{pointNum:云钻点数}
//http://vip.suning.com/ajax/list/memberPoints.do?callback=callbackMemberListPointsFun&_=1477051789134

//活动{活动配置id,时间,奖励配置,消费配置}
//活动-奖励布局
//活动-投递/消费记录-->投递结果
(function(){
	act_config = {
		'game.play.exec' : 'http://vip.suning.com/pointGame/execute.do?dt={dt}&inputNum={chip}&gameActivitiesConfigureId={actId}'，
		'game.player.points.query' : 'http://vip.suning.com/ajax/list/memberPoints.do?_={new Date().getTime()}',
		'el.player.points' : '#points',
		'el.game.chip' : '.diam-num',
		'el.game.actId' : '#gameActivitiesConfigureId'
	};
	
	//活动
	act = function(){
		function initialize(){
			var actId = $(act_config['el.game.actId']).val();
			proto.actId = actId;
		}
		function rst(){
			return encodeURIComponent(bd.rst());
		}
		var proto = {
			initialize : initialize,
			rst : rst
		};
		return proto;
	}();
	act_layout = {};
	act_cost = {};
	game = function(){
		function initialize(){
			//活动初始化
			act.initialize();
			$(proto).on('game.play.before',function(){

			})
			$(proto).on('game.play.after',function(){

			})
		}
		//开始投递/消费-点数
		function play(chip,callback){
			chip = chip || $(act_config['el.game.chip']).val();
			var data = {
				chip : chip，
				dt : act.rst();
			};
			//触发投递/执行前事件
			$(proto).trigger('game.play.before',data);
			var url = act_config['game.play.exec'].format(act,data);
			$.get(url,function(json){
				callback && callback(json);
				//触发投递/执行后事件
				$(proto).trigger('game.play.after',json);
			},'json');
		}
		function play_bebore(data){

		}
		function play_after(json){
			
		}
		//查询玩家点数
		function query(){
			var url = act_config['game.player.points.query'].format({});
			$.jsonp( url, null, function(json){
				//更新显示点数
				$(act_config['el.player.points']).html(json.pointNum);
			},'callbackMemberListPointsFun','GET');
		}
		var proto = {
			initialize : initialize,
			play : play,
			query : query
		};
		return proto;
	}();
	$(function(){
		//初始化
		game.initialize();
	});
}());


