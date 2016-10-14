(function(){
	function heredoc(fn) {
	    return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
	}

	var tmpl = heredoc(function(){/*
		<style>
			[grp-panel]{position: relative;width:1000px;height:600px;background: rgba(108, 128, 185, 0.21);margin:0 auto;}
			[grp-header]{width:100%;height:50px;text-align: center;}
			[grp-body]{width:100%;height:550px;position: relative;}
			[grp-p]{width:200px;height:100%;float:left;}
			[itemarr],[grapharr]{width:400px;height:550px;overflow-y: auto;}
			[hide]{display:none;}
			[close]{position:absolute;width:20px;height:20px;right:0px;top:0px;cursor: pointer;}
			[history-pannel],[graph-pannel]{position: absolute;width:800px;height:400px;margin:0 auto;left:-230px;top:100px;background: rgba(244, 244, 244, 0.88);}
			[history] table{
				width:99%;margin: 0 auto;
			}
			table{border-collapse:collapse;border-spacing:0;border-left:1px solid #888;border-top:1px solid #888;background:#efefef;}
			th,td{border-right:1px solid #888;border-bottom:1px solid #888;padding:5px 15px;}
			th{font-weight:bold;background:#ccc;}
			[box]{
				box-shadow: 10px 8px 10px 3px #6c80b9;
    			-webkit-box-shadow: 10px 8px 10px 3px #7e9ab4;
				-moz-box-shadow: 10px 8px 10px 3px #7e9ab4;
			}
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
			[t-item],[t-graph]{position:absolute;top:-20px;}
			[t-item]{right:50px;}
			[t-graph]{right:0px;}
		</style>
	    <div grp-panel box>
	    	<a close target='[grp-pannel]'>x</a>
			<div grp-header>
				<input type=button name=login value=login />
				<input type=text name=syses value='{syses}'/><input type=button name=sysget value=sysget />
				<input type=text name=date value='{date}'/><input type=button name=prev value=prev /><input type=button name=next value=next />
			</div>
			<div grp-body>
				<div grp-p sysarr tpl=sysarr>syses</div>
				<div grp-p grouparr tpl=grouparr>groups</div>
				<div grp-p hostarr tpl=hostarr>hosts</div>
				<div pad grp-p itemarr tpl=itemarr>items</div>
				<div pad grp-p grapharr tpl=grapharr hide>graphs</div>
				<a tab t-item target='[itemarr]'>item</a>
				<a tab t-graph target='[grapharr]'>graph</a>
			</div>
			<div history-pannel hide box>
				<a close target='[history-pannel]'>x</a>
				<div history tpl=history>history</div>
			</div>
			<div graph-pannel hide box>
				<a close target='[graph-pannel]'>x</a>
				<div graph tpl=graph>graph</div>
			</div>
		</div>
		<textarea tpl=sysarr hide>
			<%
				for(var i = 0; i < sysarr.length; i ++){
					var sys = sysarr[i];
			%>	
				<div><%sys.sysname%><input type=button name=groupget value=groupget sysname='<%sys.sysname%>' /></div>	
			<%	}
			%>
		</textarea>
		<textarea tpl=grouparr hide>
			<%
				for(var i = 0; i < grouparr.length; i ++){
					var group = grouparr[i];
			%>	
				<div><%group.groupname%><input type=button name=hostget value=hostget groupid='<%group.groupid%>' path='<%group.path%>'/></div>	
			<%	}
			%>
		</textarea>
		<textarea tpl=hostarr hide>
			<%
				for(var i = 0; i < hostarr.length; i ++){
					var host = hostarr[i];
			%>	
				<div><%host.hostip%><input type=button name=itemget value=itemget hostid='<%host.hostid%>' path='<%host.path%>'/></div>
			<%	}
			%>
		</textarea>
		<textarea tpl=itemarr hide>
			<%
				for(var i = 0; i < itemarr.length; i ++){
					var item = itemarr[i];
			%>	
				<div tabindex='<%10+i%>' focus=historyget title='<%item.description||item.name%>' name=historyget>
					<input type=checkbox name=item  hostid='<%item.itemid%>' path='<%item.path%>'/>
					<%item.name%>
				</div>
			<%	}
			%>
		</textarea>
		<textarea tpl=grapharr hide>
			<%
				for(var i = 0; i < grapharr.length; i ++){
					var graph = grapharr[i];
			%>	
				<div tabindex='<%10+i%>' focus=historyget title='<%graph.name%>' name=graphget>
					<input type=checkbox name=graph  graphid='<%graph.graphid%>' path='<%graph.path%>'/>
					<%graph.name%>
				</div>
			<%	}
			%>
		</textarea>
		<textarea tpl=history hide>
			<h1><%name%>[<%history.length%>]</h1>
			<table>
			<%
				if( history.length > 0 ){
			%>
				<%
					for(var i = 0; i < history.length; i ++){
						var his = history[i];
				%>	
					<tr><td><%_.dformat(new Date(his.clock*1000))%></td><td><%his.itemid%></td><td><%his.ns%></td><td><%his.value%></td></tr>
				<%	}
				%>
			<%	}else{
			%>
				<tr><td>暂无数据</td></tr>
			<%	}
			%>
			</table>
		</textarea>
		<textarea tpl=graph hide>
			graph-img
			<img src='http://zabbix.cnsuning.com/chart2.php?graphid=<%graphid%>&period=3600&stime=20161014170000&etime=20161014175959&updateProfile=1&width=680' />
		</textarea>
	*/}).format(zabbix);
	window.zview = {};

	$.extend(zview,{
		
	});

	$(function(){
		//关闭
		$(document.body).append(tmpl);
		$('[grp-body]').sntabs('[tab]','[pad]','normal');
		$(document).on('click','[close]',function(){
			var target = $(this).attr("target");
			$(target).hide();
		});
		//登陆
		$('[name=login]').click(function(){
			zabbix.login();
		});
		//查询系统
		$('[name=sysget]').click(function(){
			var syses = $('[name=syses]').val().split(',');
			zabbix.syses = syses;
			zabbix.groupget(syses,function(){
				$('[sysarr]').refresh(zabbix);
			});
		});
		//查询主机组
		$(document).on('click','[name=groupget]',function(){
			var sysname = $(this).attr("sysname");
			var sys = zabbix.sysmap[sysname];
			$('[grouparr]').refresh(sys);
		});
		//查询主机
		$(document).on('click','[name=hostget]',function(){
			var group = $(this).attrs("groupid","path");
			group = zabbix.find(group.path);
			function $render(){
				$('[hostarr]').refresh(group);
			}
			if(group.hostarr){
				$render();
			}else{
				zabbix.hostget(group,$render);	
			}
		});
		//查询项目
		$(document).on('click','[name=itemget]',function(){
			var host = $(this).attrs("hostid","path");
			host = zabbix.find(host.path);
			var style = $('[tab].normal').is('[t-item]') ? 'itemarr' : 'grapharr';
			var config = {
				itemarr : {el:'[itemarr]',method:'itemget'},
				grapharr : {el:'[grapharr]',method:'graphget'}
			}
			var curconfig = config[style];
			function $render(){
				$(curconfig.el).refresh(host);
			}
			if(host[style]){
				$render();
			}else{
				zabbix[curconfig.method].apply(zabbix,[host,$render]);
				//zabbix.itemget(host,$render);	
			}
		});
		//查询历史数据
		$(document).on('click','[name=historyget]',function(){
			var itemElm = $(this);
			var item = $('[name=item]',this).attrs("itemid","path");
			item = zabbix.find(item.path);
			function $render(){
				var clazz = item.history.length > 0 ? 'success' : 'fail'
				$('[history-pannel]').show();
				$('[history]').refresh(item);
				itemElm.addClass(clazz);
			}
			if(item.history){
				$render();
			}else{
				zabbix.historyget(item,$render);	
			}
		});
		//查询历史数据
		$(document).on('focus','[focus=historyget]',function(){
			$(this).click();
		})
		var Keyop = {
			ArrowDown : function(){
				$(this).next().focus();
			},
			ArrowUp : function(){
				$(this).prev().focus();
			}
		}
		//http://zabbix.cnsuning.com/chart2.php?graphid=849240&period=3600&stime=20161014170000&etime=20161014175959&updateProfile=1&width=1136
		$(document).on('click','[name=graphget]',function(){
			var graph = $('[name=graph]',this).attrs("graphid","path");
			graph = zabbix.find(graph.path);
			function $render(){
				$('[graph-pannel]').show();
				$('[graph]').refresh(graph);
			}
			$render();
		})
		var Keyop = {
			ArrowDown : function(){
				$(this).next().focus();
			},
			ArrowUp : function(){
				$(this).prev().focus();
			}
		}

		//ArrowDown/ArrowUp
		$(document).on('keydown','[focus=historyget]',function(e){
			var keyop = Keyop[e.key];
			if( keyop ){
				keyop.apply(this,[e]);
				return false;
			}
		})

		$("body img").click(function(){
			var tags = [];
			var p = $(this);
			var tagName = $(p).prop('tagName').toLowerCase();
			while(tagName != 'body'){
				tags.push(tagName);
				p = p.parent();
				tagName = $(p).prop('tagName').toLowerCase();
			}
			tags.push(tagName);
			tags.push(this.src);
			console.info(tags.reverse().join('/'));
		});
		
	});


}());


