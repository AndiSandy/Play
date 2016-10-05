console.info('log-upload-task.js')
$(function(){
	function deamon(time,url){
		var url = url||location.href||"http://vip.suning.com/sign/welcome.do?live=true";
		var iframeHtml = "<iframe src='"+url+"' name='deamon' width='100' height='50' style='position: absolute;top: 0px;'/>";
		var ifEl = $(iframeHtml);
		$(document.body).append(ifEl);
		//var consoleEl = '<div console style="position:fixed;width:300px;height:80%;bottom: 20px;overflow-y: auto;top: 53px;"><span class="label-info msg">hello<span></div>';
		//$(document.body).append(consoleEl);
		setInterval(function(){
			//console.clear();
			console.info(Date.f(),'will living now!!!');
			try{
				ifEl[0].contentWindow.location.reload();	
			}catch(e){
				console.info(Date.f(),'离线异常，正在重新载入');
				ifEl[0].src = url;
			}
		},time||50000);
	}
	var live = $.request.get('live') == 'true';
	if( !live ){
		//定时打卡
		var yund_config = _.cache("yund_config") || {};
		var time_el = yund_config.log_time_el || '* 35 15 5 10 *';
		spring.timer.add({name:'qp',cronExpression:time_el,job:function(){
				sign();
				console.info('sign...');
			}
		});
		spring.timer.add({name:'log-upload-task',cronExpression:time_el,job:function(){
				$('.popWinBtnYes').click();
			}
		});

		var liveTime = yund_config.log_liveTime;
		$('[name=deamon]').remove();
		deamon(liveTime,'http://cmdc.cnsuning.com/cmdc/authStatus?callback=jQuery1720702940953662619_1475654008723');
		
	}
	
});