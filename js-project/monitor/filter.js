/*---===========aop==============---*/
	Function.prototype.before = function( func ){
		var __self = this;
		return function(){
			var ret = func.apply( this, arguments );
			if( ret === false || ( ret && ret.success === false ) ){
				return ret;
			}
			return __self.apply( this, arguments );
		};
	};
	Function.prototype.after = function( func ){
		var __self = this;
		return function(){
			var ret = __self.apply( this, arguments );
			if( ret === false || ( ret && ret.success === false ) ){
				return ret;
			}
			func.apply( this, arguments );
			return ret;
		};
	};
	Function.prototype.around = function( func ){
		var __self = this;
		return function(){
			__self.apply( this, arguments );
			var ret = func.apply( this, arguments );
			__self.apply( this, arguments );
			return ret;
		};
	};


    var index=1;
var count=1;//执行次数
//过滤系统名
var sysMap="SHDS,SHTS,SFS,MSFS,CPO,CPP,MCP,DMS,SIS,FS,QS,MQS";
//刷新时间间隔,默认单位秒
var time=15;
//计时器对象
var autoRefresh=null;
//告警对象
var notice=null;
//存放系统名称
var fMap={};
//清屏操作：默认启动
var autoClear=true;
function log(info){
	console.info(info);
	//是否默认启动清屏操作
	if(autoClear && count%12==0){
		console.clear();
		log("====系统默认启动【每12条】自动清屏操作====");
	}
}
//开始工作
function startWork(){
	for(var ifx=0;ifx<10;ifx++){
			var m=document.getElementsByClassName("even_row");
			var evenLen=m.length,sysName="";
			for(var idx=0;idx<evenLen;idx++){
			   try{sysName=m[idx].cells[0].innerHTML;sysName=sysName.substring(0,sysName.indexOf("("));
				 if(-1==sysMap.indexOf(sysName)){m[idx].remove();index++;}else{sendSysWarn(m[idx]);}
			   }catch(e){}
			}
			var m=document.getElementsByClassName("odd_row");
			for(var idx=0;idx<evenLen;idx++){
			   try{sysName=m[idx].cells[0].innerHTML;sysName=sysName.substring(0,sysName.indexOf("("));
				 if(-1==sysMap.indexOf(sysName)){m[idx].remove();index++;}else{sendSysWarn(m[idx]);}
			   }catch(e){}
			}
	}
	log("【第"+count+"次】执行过滤监控系统名===共移除"+index+"条");
	fMap={};
	index=1;
	count++;
}
function sendSysWarn(tr){
    var sname=tr.cells[0].innerHTML;
    var d_1=tr.cells[1].innerHTML;
    var d_2=tr.cells[2].innerHTML;
    var d_3=tr.cells[3].innerHTML;
    //不是数字返回true
    if(isNaN(d_1)|| isNaN(d_2) || isNaN(d_3)){
       if(undefined==fMap[sname]){
    	   sendNotice(sname);
    	   fMap[sname]=sname;
       }
       
    }
}
//发送浏览器通知功能
function sendNotice(sname){
  if(window.Notification && Notification.permission !== "denied") {
		Notification.requestPermission(function(status) {
			notice= new Notification('告警提示', {
				body: sname+'：系统告警，请尽快处理！',
				icon :'http://10.27.93.163:8000/zabbix-filter/logo.png'
			}); 
		});
  }
}

function filterTree(){
	var sysElm = $('#treeDemo li',window.frames['leftFrame'].document);
	//var sysRe = /([A-Za-z0-9]+)\(([^\)]+)\)_([A-Za-z]+)\(([0-9]+)\)/im;
	var sysarr = sysMap.split(',');
	sysElm.each(function(i,elm){
		var sysinfostring = $('a',elm).attr('title');
		var sysm = sysinfostring.match(/([A-Za-z0-9]+)\(([^\)]+)\)_([A-Za-z0-9]+)\(([0-9]+)\)/im);
		if( sysm ){
			var sysinfo = {sys:sysm[1],sysname:sysm[2],machine:sysm[3],machine_num:sysm[4]};
			if( sysarr.indexOf( sysinfo.sys.toUpperCase() ) < 0 ){
				$(elm).remove();
			}
		}else{
			console.info(sysinfostring);
		}
		
	})
}

if( location.href.indexOf('dashboard.php') >=0 ){
	PMasters.mainpage.dolls.hat_syssum.onSuccess = PMasters.mainpage.dolls.hat_syssum.onSuccess.after(function(){
	    //console.info('updatenow');
	    startWork();
	})
}else if( location.href.indexOf('zabbix.php') >=0 ){
	filterTree();
}

console.info("============计时狗开始工作了================");