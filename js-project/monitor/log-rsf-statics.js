console.info('log-rsf-statics.js')
$(function(){});
	var rsf_services = [
		{code:"decorationInfoService",name:"RSF获取装修数据"},
		{code:"modulePrototypeService",name:"RSF获取模块原型"},
		{code:"templateBaseInfoService",name:"RSF模板基本信息"},
		{code:"templateSkinService",name:"RSF模板配色"},
	];
	window.rsf_services = rsf_services;
	window.config = {
		date : _.now('yyyy-mm-dd') || '2016-11-07',
		setDate : function(date){
			this.date = date;
		}
	};
	function loadrsf(callback){
		console.info('加载rsf接口...');
		var url = 'http://{host}/method/findAllInterface.do?_=1476095797433'.format(location);
		$.get(url,function(json){
			rsf.interfaces = json;
			console.info('总共',rsf.interfaces.length,'个rsf接口');
			callback(json);
		},'json');
	}
	function searchService(end){
		console.info('准备处理rsf接口',rsf_services.length);
		var rsf_map = _.arr2map(rsf_services,'code');
		var rsf_arr = _.objarr2arr(rsf_services,'code');
		rsf.interfaces.filter(function(oservice,i){
			for(var j = 0; j < rsf_arr.length; j ++ ){
				var sername = rsf_arr[j];
				var serviceMethod = oservice.value;
				if( serviceMethod.indexOf(sername) >= 0 ){
					rsf_map[sername].serviceMethod = serviceMethod;
					console.info('找到服务',sername,'-',serviceMethod);
					rsf_arr.splice(j,1);
					break;
				}
			}
		});
		function search(serviceMethod,callback){
			var url = 'http://{host}/statistic/searchStatisticAvg.do'.format(location);
			var data = {serviceMethod:serviceMethod};
			$.post(url,data,function(json){
				callback(json);
			},'json');
		}
		rsf_services.each4delay(function(i,service,next){
			console.info(i,'query',service.name);
			search(service.serviceMethod,function(json){
				var so = _.copy(json,['contract','implCode','method']);
				console.info('接口',service.name);
				service.rsf = so;
				next();
			});
		},100,false,function(services){
			console.info('搜索rsf完毕...');
			end();
		});
	}
	function query(service,next){
		function static4rsf(invokeList){
			//总量,耗时，成功，失败
			var total = 0,cost = 0,success=0,fail=0,max=0;
			invokeList.filter(function(invoke,i){
				total += invoke.totalInvokeCount;
				max = Math.max(max,invoke.totalInvokeCount);
				cost += invoke.totalInvokeCostTime;
				success += invoke.successInvokeCount;
				fail += (invoke.totalInvokeCount - invoke.successInvokeCount);
			});
			return {total:total,success:success,fail:fail,max:max,avg: success == 0 ? 0 : parseInt(cost/success)};
		}
		var url = "http://{host}/statistic/searchStatisticByDay.do".format(location);
		var data = $.extend({},service.rsf,config);
		$.post(url,data,function(json){
			service[config.date] = static4rsf(json);
			//$.extend(service,static4rsf(json));
			next();
		},'json');
	}
	function write(services,dates){
		dates = dates || [config.date];
		services = services || rsf_services;
		var tpl4tr1 = '<td colspan="4">{code}<br/>{name}</td>';
		var tpl4tr2 = '<td>{total}</td><td>{success}</td><td>{fail}</td><td>{max}</td>';
		var tr1 = [];
		var trs = [];
		tr1.push('<td>接口<br/>统计日期</td>');
		
		for(var i = 0; i < services.length; i ++){
			tr1.push(tpl4tr1.format(services[i]));
		}
		for(var j = 0; j < dates.length; j ++ ){
			var date = dates[j],tr2=[];
			tr2.push('<td>{0}</td>'.format(date));
			for(var i = 0; i < services.length; i ++){
				tr2.push(tpl4tr2.format(services[i][date]));
			}
			trs.push('<tr>',tr2.join(''),'</tr>');
		}
		
		var d = window.open();
		try{
			d.document.body.innerHTML = ['<title>rsf接口统计</title><style>table{border-collapse:collapse;border-spacing:0;border-left:1px solid #888;border-top:1px solid #888;background:#efefef;}',
			'th,td{border-right:1px solid #888;border-bottom:1px solid #888;padding:5px 15px;}',
			'th{font-weight:bold;background:#ccc;}</style><table><tr>',tr1.join(''),'</tr>',trs.join(''),'</table>'].join('');	
		}catch(e){
			alert('右上角，允许弹出');
		}
	}

	function statics(date,dnext){
		date && config.setDate(date);
		console.info('query total',rsf_services.length,'date',config.date,'end');
		rsf_services.each4delay(function(i,service,next){
			console.info(i,'query',service.name);
			query(service,next);
		},100,false,function(services){
			!dnext && write(services,[config.date]);
			dnext && dnext();
		});
	}

	function statics4range(dates){
		dates.each4delay(function(i,date,next){
			console.info(i,'query',date);
			statics(date,next);
		},100,false,function(dates){
			write(rsf_services,dates);
		});
	}
	window.rsf = {
		statics : statics,
		statics4range : statics4range,
		write : write	
	}
	
	loadrsf(function(){
		searchService(function(){
			rsf.statics('2017-01-01');
		});	
	});
	