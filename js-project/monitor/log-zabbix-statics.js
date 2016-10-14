(function(){

	window.zabbix = {
		user:{
		 	"user": "14041326",
		 	"password": "@00OOkkkk"
		},
		id : 1,
		auth : null,
		syses : ['sis','msfs','sfs','shds','shts'],
		sysmap : {},
		sysarr : [],
		start:_.now('yyyy-mm-dd 00:00:00') || '2016-10-05 00:00:00',
		end:_.now('yyyy-mm-dd 23:59:59') || '2016-10-05 23:59:59',
		date : _.now('yyyy-mm-dd') || '2016-10-05',
		setDate : function(date){
			var dateo = {date:date};
			$.extend(this,{
				start:'{date} 00:00:00'.format(dateo),
				end:'{date} 23:59:59'.format(dateo)
			});
			this.date = date;
		},
		find : function($path){
			var paths = $path.split('/'),o= this.sysmap;
			for(var i = 0; i < paths.length; i ++){
				var path = paths[i];
				o = o[path];
			}
			return o;
		}
	};
	//api请求
	function request(params,success,error){
		var config = {
		 	"jsonrpc": "2.0",//2.2.8
		 	"id": zabbix.id ++,
		 	"auth": zabbix.auth
		};
		var data = $.extend({},config,params);
		$.ajax({
			url : 'http://zabbix.cnsuning.com/zabbix/api_jsonrpc.php',
			contentType : 'application/json-rpc',
			data : JSON.stringify(data),
			dateType : 'json',
			type: 'POST',
			success : function(json){
				if( json.error ){
					console.info('query zabbix api failed');
					console.info('error code:{code}\ndata:{data},\nmsg:{message}'.format(json.error));
					error && error(json);
				}else{
					//console.info('query zabbix api success');
					success && success(json);
				}
			},
			error : function(){
				console.info('zabbix api error',arguments);
				error && error();
			}
		});
		return this;
	}
	function api(apiname,params,success,error){
		request({
			method : apiname,
			params : params
		},success,error);
		return this;
	}
	//登陆
	function login(user,success){
		user = user || zabbix.user;
		zabbix.auth = null;
		api('user.login',user,function(json){
			console.info(json);
			zabbix.auth = json.result;
			console.info('zabbix user auth:',zabbix.auth);
			success && success(json);
		},function(){
			console.info('zabbix login fail');
		});
	}
	function logout(){
		var params = {};
		api('user.logout',params,function(json){
			console.info('logout success');
		},function(){
			console.info('logout fail');
		});
	}
	//初始化
	function initialize(){
		console.info('zabbix api initializing...');
		var auth = $.cookie().g('auth');
		zabbix.auth = auth;
		/**/
		$(window).on('login',function(){
			login(null,function(json){
				$.cookie().s('auth',zabbix.auth);
			});
		})
		var params = {
	        "output": [
	            "hostid",
	            "host"
	        ],
	        "selectInterfaces": [
	            "interfaceid",
	            "ip"
	        ]
	    };
		api('host.get',params,function(json){
			console.info('zabbix is login');
		},function(json){
			var msg = 'Not authorized'
			if( json && json.error && json.error.data == msg ){
				console.info(msg);
				$(window).trigger('login');
			}
		});

		//groupget();
		//search4groups();
	}
	function $getobj(obj,name){
		var o = obj[name] = obj[name] || {};
		return o;
	}
	function $getarr(obj,name){
		var o = obj[name] = obj[name] || [];
		return o;
	}
	//api获取主机组信息
	function groupget(syses,end){
		syses = syses || zabbix.syses;
		function $search(groups){
			$(groups).each(function(i,$group){
				var group = $group.name;
		        var groupname = group.split('_')[1] || '';
		        groupname = groupname.toLowerCase();
		        var sysname = group.containsInArray(syses,'elm');
		        if( sysname ){
		            var groupid = $group.groupid;
		            if( groupid > 0 ){
		                console.info('get',sysname,groupname,groupid);
		                var groupobj = {sysname:sysname,groupname:groupname,groupid:groupid,path:[sysname,'groupmap',groupname].join('/')};
		                
		                var sysmap = $getobj(zabbix,'sysmap');
		                var sys = $getobj(sysmap,sysname);
		                sys.sysname = sysname;
		                var groupmap = $getobj(sys,'groupmap');
		                var grouparr = $getarr(sys,'grouparr');
		                groupmap[groupname] = groupobj;
		                grouparr.push(groupobj);
		            }
		        }
			});
		}
		zabbix.api('hostgroup.get',{"output": "extend"},function(json){
			var groups = json.result;
			$search(groups);
			var sysarr = zabbix.sysarr = _.map2arr(zabbix.sysmap);
			end && end();
			/*
	    	sysarr.each4delay(function(i,sys,next){
				console.info(i,'search',sys.sysname);
				sys.grouparr.each4delay(function(j,group,dnext){
					console.info(i,j,'search',sys.sysname,group.groupname);
					hostget(group,dnext);
				},10,false,function(){
					next();
				});
			},100,false,function(){
				console.info('search group host end');
				end && end();
			});*/
		});
	}
	//api获取主机信息
	function hostget(group,dnext){
		function $search(hosts){
			$(hosts).each(function(i,$host){
	            var hostip = $host.host;
	            var hostid = $host.hostid;
	            var hostname = $host.name
	            var check = true;
                if( group.filter && group.filter.hostip ){
                    check = hostip.containsInArray(group.filter.hostip);
                }
                if( check ){
                    var hostobj = {hostip:hostip,hostid:hostid,hostname:hostname,path:[group.path,'hostmap',hostname].join('/')};
                    var grp = _.copy(group,['groupid','groupname','sysname']);
                    $.extend(hostobj,grp);
                    var hostmap = $getobj(group,'hostmap');
                    var hostarr = $getarr(group,'hostarr');
                    hostmap[hostip] = hostobj;
                    hostarr.push(hostobj);
                }
	        });
		}
	    zabbix.api('host.get',{"output": "extend",groupids:group.groupid},function(json){
			var hosts = json.result;
			$search(hosts);
			dnext && dnext();
		});
	}
	function itemget(host,dnext){
		var fileds = 'hostid,itemid,description,key_,name'.split(',');
		function format(itemobj){
			var name = itemobj.name;
			if( name.indexOf("$1") >= 0 ){
				var $1 = /\[([^,]+),?([^\]]+)?\]/img.exec(itemobj.key_)[1];
				name = name.replace("$1",$1);
				itemobj.name = name;
			}
		}
		function $search($items){
			$($items).each(function(i,$item){
				var itemobj = _.copy($item,fileds);
				format(itemobj);
				var itemid = itemobj.itemid;
				var hst = _.copy(host,['groupid','groupname','sysname','hostip']);
				$.extend(itemobj,hst,{
					path : [host.path,'itemmap',itemid].join('/')
				});
				var itemmap = $getobj(host,'itemmap');
                var itemarr = $getarr(host,'itemarr');
                itemmap[itemid] = itemobj;
                itemarr.push(itemobj);
				//console.info('itemid:{itemid},key_:{key_},name:{name},description:{description}'.format(itemobj));
			});
		}
		zabbix.api('item.get',{"output": "extend",hostids: host.hostid || "58664"},function(json){
			var items = json.result;
			$search(items);
			dnext && dnext();
		});
	}
	function graphget(host,dnext){
		var fileds = 'graphid,name,width'.split(',');
		function $search($graphs){
			$($graphs).each(function(i,$graph){
				var graphobj = _.copy($graph,fileds);
				var graphid = graphobj.graphid;
				var hst = _.copy(host,['groupid','groupname','sysname','hostip']);
				$.extend(graphobj,hst,{
					path : [host.path,'graphmap',graphid].join('/')
				});
				var graphmap = $getobj(host,'graphmap');
                var grapharr = $getarr(host,'grapharr');
                graphmap[graphid] = graphobj;
                grapharr.push(graphobj);
				//console.info('graphid:{graphid},name:{name}'.format(graphobj));
			});
		}
		zabbix.api('graph.get',{"output": "extend",hostids:host.hostid || "58664"},function(json){
			var graphs = json.result;
			$search(graphs);
			dnext && dnext();
		});
	}
	function historyget(item,dnext){
		//clock,itemid,ns,value
		zabbix.api('history.get',{"output": "extend",history:0,itemids:item.itemid || "18673356","limit": 10},function(json){
			//console.info(json.result)
			item.history = json.result;
			dnext && dnext();
		});
	}
	$.extend(zabbix,{
		request : request,
		api : api,
		login : login,
		logout : logout,
		initialize : initialize,
		groupget : groupget,
		hostget : hostget,
		itemget : itemget,
		graphget : graphget,
		historyget : historyget
	});	
	zabbix.initialize();

	// group->host->{item,graph,history}
	//host.get
	//item.get
	//history.get
	//http.get
	//hostgroup.get
	//zabbix.api('hostgroup.get',{"output": "extend",hostids:"58664"},function(json){console.info(json.result)});

	/*
	var d = new Date();
	titems.each4delay(function(i,item){
		console.info(i,'query',item.itemid);
		zabbix.api('history.get',{
			"history":0,
			"itemids":[item.itemid],
	        "limit": 10,
	        "output":"extend"
    },function(json){console.info(json.result)});
	},100,true,function(){});
	*/
}());


