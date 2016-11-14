(function(){
	function heredoc(fn) {
	    return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
	}

	var tmpl = heredoc(function(){/*
		<style>
			[grp-panel]{position: fixed;width:1000px;height:600px;background: rgba(108, 128, 185, 0.21);margin:0 auto;top:128px;left:100px;}
			[grp-header]{width:100%;height:50px;text-align: center;}
			[grp-body]{width:100%;height:550px;position: relative;}
			[grp-p]{width:200px;height:100%;float:left;}
			[itemarr],[grapharr]{width:400px;height:550px;overflow-y: auto;}
			[hide]{display:none;}
			[tool-icon]{position:absolute;width:20px;height:20px;top:0px;cursor: pointer;}
			[close]{right:44px;}
			[minilize]{right:0px;}
			[move]{right:22px;}
			[history-pannel],[graph-pannel]{position: absolute;width:800px;height:400px;margin:0 auto;left:-230px;top:100px;background: rgba(244, 244, 244, 0.88);}
			[history] table{
				width:99%;margin: 0 auto;
			}
			[record]{background:white;}
			table{border-collapse:collapse;border-spacing:0;border-left:1px solid #888;border-top:1px solid #888;background:#efefef;}
			th,td{border-right:1px solid #888;border-bottom:1px solid #888;padding:5px 15px;}
			th{font-weight:bold;background:#ccc;}
			[box]{
				box-shadow: 10px 8px 10px 3px #6c80b9;
    			-webkit-box-shadow: 10px 8px 10px 3px #7e9ab4;
				-moz-box-shadow: 10px 8px 10px 3px #7e9ab4;
			}
			[name=syses]{width:360px;}
			[name=taskid]{width:60px;}
			[name=hour],[name=minute]{width: 18px;}
			[console]{width:590px;overflow: auto;}
			.success{
				color: #fff;
			    background-color: #5cb85c!important;
			    border-color: #4cae4c;
			}
			.normal{
				color: #fff;
			    background-color: #5bc0de!important;
			    border-color: #46b8da;
			}
			.warn{
				color: #fff;
			    background-color: #f0ad4e!important;
			    border-color: #eea236;
			}
			.fail{
				color: #fff;
				background-color: #d9534f!important;
			    border-color: #d43f3a;
			}
		</style>
	    <div grp-panel box dragable target='[move]'>
	    	<a tool-icon move>[+]</a><a tool-icon close target='[grp-panel]'>x</a><a tool-icon minilize pos='left' target='[grp-panel]'>-</a>
			<div grp-header>
				syses:<input config type=text name=syses value='{syses}'/>
				taskid:<input config type=text name=taskid value='{taskid}' placeholder='taskid'/>
				hour:<input config type=text name=hour value='{hour}' placeholder='hour'/>
				minute:<input config type=text name=minute value='{minute}' placeholder='minute'/>
				<input type=button name=addtask value=addtask />
				<input type=button name=initialize value=initialize />
				<input type=button name=report value=report />
				<input type=button name=find value=find />
			</div>
			<div grp-body>
				<div grp-p taskarr tpl=taskarr>taskarr</div>
				<div grp-p sysarr tpl=sysarr>syses</div>
				<div grp-p console tpl=logarr>console</div>
			</div>
			<div history-pannel hide box>
				<a close target='[history-pannel]'>x</a>
				<div history tpl=history>history</div>
			</div>
		</div>
		<textarea tpl=sysarr hide>
			<%
				for(var i = 0; i < sysarr.length; i ++){
					var sys = sysarr[i];
			%>	
				<div record><%i+1%>-<%sys.sysname%><span><%sys.rstatus%></span></div>	
			<%	}
			%>
		</textarea>
		<textarea tpl=taskarr hide>
			<%
				for(var i = 0; i < taskarr.length; i ++){
					var task = taskarr[i];
			%>	
				<div record><%i+1%>-task-name:<%task.taskname%><span>runtime:<%task.hour%>:<%task.minute%></span></div>	
			<%	}
			%>
		</textarea>
		<textarea tpl=logarr hide>
			<%
				for(var i = 0; i < logarr.length; i ++){
					var log = logarr[i];
			%>	
				<div record>[<%log.now%>][<%log.level%>]<span>hour:<%log.msg%></span></div>	
			<%	}
			%>
		</textarea>
	*/});
	
	$.ppost = function(url,data,success,error,datatype,options){
		var doptions = {
			async: false,
			type: "POST",
			url: url || '',
			data: data || {},
			dataType : datatype || "html",
			success: success,
			error : error
		};
		$.ajax($.extend(doptions,options||{}));
	}
	$.gget = function(url,data,success,error,datatype,options){
		var doptions = {
			async: false,
			type: "GET",
			url: url || '',
			data: data || {},
			dataType : datatype || "html",
			success: success,
			error : error
		};
		$.ajax($.extend(doptions,options||{}));
	}
	

	define('itsm.report',function(){
		var syses = 'SHTS,CPO,MCP,CPP,SHDS,SIS,SFS,MSFS,FS,QS,MQS,DMS',taskid = $('#sctdTaskid').val();
		var public = {
			logarr : [],
			taskarr : [],
			taskid : taskid,
			syses : syses,
			hour : _.now('hh'),
			minute : 45
		};
		var service_config = {
			'search.url' : 'http://itsm.cnsuning.com/traffic-web-in/selftask/loadSelfTaskDetailList.htm',
			'report.url' : 'http://itsm.cnsuning.com/traffic-web-in/selftask/selfSystemReport.htm'
		};
		function updateconfig(config){
			if(config){
				$('[config]').objectalize(config);
			}
			var _config = $('[config]').objectalize();
			$.extend(public,_config);
			return _config;
		}
		function log(level){
			var args = Array.copy(arguments,1);
			var msg = args.join(',');
			var log = {level:level,msg:msg,now:_.now()};
			if( public.logarr.length > 150 ){
				public.logarr.shift();
			}
			public.logarr.push(log);
			$('[console]').refresh(public);
			$('[console]')[0].scrollTop = 99999999999999999999;
			console[level].apply(console,args);
		}
		function getsysmap(html){
			var sys_exp = {
  				id : "$('td:eq(0) .vmid',elm).val()",
  				desc : "$('td:eq(3)',elm).text().trim()",
  				sysname : "$('td:eq(4)',elm).text().trim()",
  				rstatus : "$('td:eq(5)',elm).text().trim()"
  			};
  			var sysarr = $('.wai-tb-body table tr',html).objectizes(sys_exp);
  			var sysmap = _.arr2map(sysarr,'sysname');
  			return sysmap;
		}
		function find(html,sysname){
  			var sysmap = getsysmap(html);
  			return sysmap[sysname];
		}
		//搜索
		function search(sysname,success,taskid){
			var params = {
				searchFcenter : $('#search_fcenter').val()||'供应商及商户平台研发中心',//一级中心
				searchScenter : $('#search_scenter').val()||'开放平台研发中心',//二级中心
				searchReportstatus : $('#search_reportstatus').val()||'未上报',//报告状态
				searchSystemstatus : '',//系统状态
				sctdTaskid : taskid||public.taskid||'',//任务id
				searchValue : sysname||'',//关键字
				currentPage : '0'
			};
			var url = service_config['search.url'];
			$.gget(url,params,function(html){
				var sysobj = find(html,sysname);
				success && success(sysobj);
				!sysobj && log('info','未找到',sysname,'系统'); 
			},function(){
				// error
				log('error','查找系统异常异常');
			},'html');
		}
		//刷新上报状态
		function flushStatus(status){
			for(var i = 0; i < public.sysarr.length; i ++){
				var sysobj = public.sysarr[i];
				sysobj.rstatus = status;
			}
			$('[sysarr]').refresh(public);
		}
		function report(ids,taskid){
			var params = {
				ids : ids||'',//系统id
				sctdSystemstatus : '正常',//系统状态
				sctdDes : '',
				sctdTaskid: taskid||public.taskid || ''//任务id
			};
			var url = service_config['report.url'];
			$.ppost(url,params,function(json){
				// success
				if(json.result){
					log('info',json.message);
					flushStatus('已上报');
				}else{
					log('error',json.message);
				}
			},function(){
				// error
				log('error','上报异常');
			},'json');
		}
		function findAselect(){
			public.sysarr = [],public.sysmap={};
			var sysarr = syses.split(',');
			var sysmap = getsysmap('body');
			for( var i = 0; i < sysarr.length; i ++ ){
				var sysname = sysarr[i];
				var sysobj = sysmap[sysname];
				if( sysobj ){
					$('.vmid[value={id}]'.format(sysobj)).attr('checked',true);
					var sysmap = _.$getobj(itsm.report,'sysmap');
					var sysarr = _.$getarr(itsm.report,'sysarr');
					sysmap[sysname] = sysobj;
					sysarr.push(sysobj);
					$('[sysarr]').refresh(itsm.report);
				}
			}
		}
		function addtask(taskid,hour){
			spring.timer.add({name:'report-task-'+taskid,cronExpression:'* {minute} {hour} * * *'.format({hour:hour},public),job:function(){
					initialize(taskid,function(){
						var idarr = _.objarr2arr(itsm.report.sysarr,'id') || [];
						if( idarr.length > 0 ){
							var ids = _.objarr2arr(itsm.report.sysarr,'id').join(',');
							itsm.report.report(ids,taskid);
							log('info','上报完毕');
						}else{
							log('warn','请先初始化环境哦');
						}
					})
				}
			});
		}
		function initialize(taskid,success){
			public.sysarr = [],public.sysmap={};
			public.taskid = taskid || $('[name=taskid]').val();
			var sysarr = syses.split(',');
			sysarr.each4delay(function(i,sys,next){
				log('info',i,'search',sys);
				search(sys,function(sysobj){
					if( sysobj ){
						var sysmap = _.$getobj(itsm.report,'sysmap');
						var sysarr = _.$getarr(itsm.report,'sysarr');
						sysmap[sys] = sysobj;
						sysarr.push(sysobj);
						$('[sysarr]').refresh(itsm.report);
						log('info','已找到系统',sys);
					}
					next();
				},taskid);
			},100,false,function(){
				log('info','search group host end');
				// end
				success && success();
			});
		}
		var proto = {
			initialize : initialize,
			findAselect : findAselect,
			report : report,
			getsysmap : getsysmap,
			find : find,
			addtask : addtask,
			log : log,
			flushStatus : flushStatus,
			updateconfig : updateconfig
		};
		return $.extend(public,proto);
	}());
	

	function deamon(time){
		var url = "http://itsm.cnsuning.com/traffic-web-in/selftask/loadSelfTaskList.htm?&currentPage=10&searchValue=";
		var iframeHtml = "<iframe src='"+url+"' name='deamon' width='100' height='50' />";
		var ifEl = $(iframeHtml);
		$(document.body).append(ifEl);
		setInterval(function(){
			console.info(Date.f(),'will living now!!!');
			try{
				ifEl[0].contentWindow.location.reload();	
			}catch(e){
				console.info(Date.f(),'离线异常，正在重新载入');
				ifEl[0].src = url;
			}
		},time||50000);
	}

	$(function(){
				
		$(document.body).append(tmpl.format(itsm.report));

		itsm.report.log('info','自动上报咯');
		//关闭
		$(document).on('click','[close]',function(){
			var target = $(this).attr("target");
			$(target).hide();
		});
		//最小化
		$(document).on('click','[minilize]',function(){
			var options = $(this).attrs("target",'pos','status');
			var animate = {
				'left-packup':function(target,lift){
					var width = target.width();
					var offset = $(target).offset();
					target.animate({left:lift-width});
					$(this).attr('status','packup');
					$(this).data('offset',offset);
				},
				'left-expand' : function(target){
					var offset = $(this).data('offset');
					$(target).animate(offset);
					$(this).attr('status','expand');
				}
			};
			var target = $(options.target),lift=20;
			var anim_name = [options.pos,(options.status||'expand') == 'expand' ? 'packup' : 'expand'].join('-');
			animate[anim_name].apply(this,[target,lift]);
		});
		
		function gettask(){
			var config = itsm.report.updateconfig();
			return $.extend({taskname:'report-task-'+config.taskid},config);
		}

		//初始化
		$(document).on('click','[name=initialize]',function(){
			var task = gettask();
			itsm.report.initialize(task.taskid);
		});
		//查找
		$(document).on('click','[name=find]',function(){
			itsm.report.findAselect();
		});
		//上报
		$(document).on('click','[name=report]',function(){
			var idarr = _.objarr2arr(itsm.report.sysarr,'id') || [];
			var task = gettask();
			if( idarr.length > 0 ){
				var ids = _.objarr2arr(itsm.report.sysarr,'id').join(',');
				itsm.report.report(ids,task.taskid);	
			}else{
				itsm.report.log('warn','请先初始化环境');
			}
		});
		//添加任务
		$(document).on('click','[name=addtask]',function(){
			var task = gettask();
			if( task.taskid && task.hour ){
				itsm.report.taskarr.push($.extend({},task));
				$('[taskarr]').refresh(itsm.report);
				itsm.report.addtask(task.taskid,task.hour);
			}else{
				itsm.report.log('warn','添加任务失败');
			}
			task.taskid ++;
			task.hour ++;
			itsm.report.updateconfig(task);
		});

		//守护
		$.request.get('deamon') && deamon(30000);

		$('[dragable]').dragable();

		//取消事件
		$('#search_reportstatus,#search_fcenter,#search_scenter').off('change');
	});

}());


