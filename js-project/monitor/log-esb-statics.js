console.info('log-esb-statics.js')
$(function(){});
	var esb_services = [
		{code:"CStoreMgmt-queryHotSaleInfo",name:"查询热销"},
		{code:"CStoreMgmt-queryCmmdtySaleVolume",name:"查询销量"},
		{code:"CStoreMgmt-queryHomePageRenoInfoATempl",name:"查询店铺页面装修信息SIS-SFS"},
		{code:"CStoreMgmt-queryCmmdtyPageRenoInfoATempl",name:"查询商品页面装修信息SIS-B2C"},
		{code:"CStoreMgmt-queryManualStoreCategoryInfo",name:"查询手工分类信息SIS-SFS"},
		{code:"CStoreMgmt-queryStoreCategoryRelateCmmdty",name:"查询手工分类商品关系SIS-SFS-MOBTS"},
		{code:"CClientStoreMgmt-queryManualCategoryCmmdty",name:"手动分类商品查询sis-msfs"},
		{code:"CClientStoreRenovationMgmt-queryCClientRenovationInfo",name:"页面装修数据查询sis-msfs"},
		{code:"CStoreMgmt-queryCommdityNameAndSellingPoint",name:"自营名称卖点SFS&MSFS-主站"},
		{code:"SelfFlagshipStoreMgmt-callStoreComclaResult",name:"自动分类类目SFS、MSFS"}
	];
	window.esb_services = esb_services;
	window.config = {
		env:'prd',
		start:_.now('yyyy-mm-dd 00:00:00') || '2016-10-05 00:00:00',
		end:_.now('yyyy-mm-dd 23:59:59') || '2016-10-05 23:59:59',
		date : _.now('yyyy-mm-dd') || '2016-11-07',
		timeType:'1',
		setDate : function(date){
			var dateo = {date:date};
			$.extend(this,{
				start:'{date} 00:00:00'.format(dateo),
				end:'{date} 23:59:59'.format(dateo)
			});
			this.date = date;
		},
		list : []
	};
	function calculate(rawData){
		var esbo = {total:0,success:0,max:0};
		$(rawData).each(function(i,data){
			esbo.total += data.transTotalNum;
			esbo.success += data.successNum;
			esbo.max = Math.max(esbo.max,data.transTotalNum);
		});
		esbo.fail = esbo.total - esbo.success;
		return esbo;
	}
	function query(service,next){
		var url = "http://myesb.cnsuning.com/esbauto-web-in/statistic/loadStatisticData.htm"
		var data = $.extend({serviceCode: service.code},config);
		$.post(url,data,function(json){
			/*
			//timeSeries
			var time_so = _.arr2map(json.timeSeries,'name','data');
			//服务方平均处理时间
			var esbo = {};
			esbo.avg = (time_so["服务方平均处理时间"][0]).toFixed(2);
			//invokeSeries
			var invoke_so = _.arr2map(json.invokeSeries,'name','data');
			//调用总量,失败量
			esbo.total = invoke_so["调用总量"][0];
			esbo.fail = invoke_so["失败量"][0];
			esbo.success = esbo.total - esbo.fail;
			*/
			// rawData[{successNum,transTotalNum}]
			var rawData = json.rawData || [];
			var esbo = calculate(rawData);
			service[config.date] = esbo;
			next();
		},'json');	
	}
	
	function write(services,dates){
		dates = dates || [config.date];
		services = services || esb_services;
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
			d.document.body.innerHTML = ['<title>esb接口统计</title><style>table{border-collapse:collapse;border-spacing:0;border-left:1px solid #888;border-top:1px solid #888;background:#efefef;}',
			'th,td{border-right:1px solid #888;border-bottom:1px solid #888;padding:5px 15px;}',
			'th{font-weight:bold;background:#ccc;}</style><table><tr>',tr1.join(''),'</tr>',trs.join(''),'</table>'].join('');
		}catch(e){
			alert('右上角，允许弹出');
		}
	}

	function statics(date,dnext){
		date && config.setDate(date);
		console.info('query total',esb_services.length,'start',config.start,'end',config.end);
		esb_services.each4delay(function(i,service,next){
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
		},100,false,function(services){
			write(esb_services,dates);
		});
	}
	window.esb = {
		statics : statics,
		statics4range : statics4range,
		write : write	
	}
	esb.statics('2017-01-01');
