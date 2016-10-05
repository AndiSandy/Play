console.info('log-esb-statics.js')
$(function(){
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

	function query(service,next){
		var url = "http://myesb.cnsuning.com/esbauto-web-in/statistic/loadStatisticData.htm"
		var data = {
			env:'prd',
			start:'2016-10-05 00:00:00',
			end:'2016-10-05 23:59:59',
			serviceCode: service.code,
			timeType:'2',
		}
		$.post(url,data,function(json){
			//timeSeries
			var time_so = _.arr2map(json.timeSeries,'name','data');
			//服务方平均处理时间
			service.avg = (time_so["服务方平均处理时间"][0]).toFixed(2);
			//invokeSeries
			var invoke_so = _.arr2map(json.invokeSeries,'name','data');
			//调用总量,失败量
			service.total = invoke_so["调用总量"][0];
			service.fail = invoke_so["失败量"][0];
			service.success = service.total - service.fail;
			next();
		},'json');	
	}
	function write(services){
		services = services || esb_services;
		var tpl = '<td><table><tr><td colspan="4">{code}<br/>{name}</td></tr><tr><td>{total}</td><td>{success}</td><td>{fail}</td><td>{avg}</td></tr></table></td>';
		var tds = [];
		for(var i = 0; i < services.length; i ++){
			tds.push(tpl.format(services[i]));
		}
		var d = window.open();
		d.document.body.innerHTML = ['<style>table{border:1px;}</style><table><tr>',tds.join(''),'</tr></table>'].join('');
	}

	function statics(){
		console.info('query total',esb_services.length);
		esb_services.each4delay(function(i,service,next){
			console.info(i,'query',service.name);
			query(service,next);
		},100,false,function(services){
			write(services);
		});
	}
	window.esb = {
		statics : statics,
		write : write	
	}
	esb.statics();
});