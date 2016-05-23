$('[name=deamon]').remove();
function deamon(){
	var url = "http://vip.suning.com/scdc-web/pointGame/pgWlcm.do";
	var iframeHtml = "<iframe src='"+url+"' name='deamon' width='100' height='50' />";
	var ifEl = $(iframeHtml);
	$(document.body).append(ifEl);
	setInterval(function(){
		console.info('will living now!!!');
		ifEl[0].contentWindow.location.reload();
	},50000);
}
deamon();