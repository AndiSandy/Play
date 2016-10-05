//数组延迟执行
Array.prototype.each4delay = function(f,t,auto,end){
	 var a = this,auto = auto == null ? true : auto ;
	 a.i = 0;
	 a.tid = 0;
	 function callback(a){
		  if( a.i < a.length ){
			 a.tid = setTimeout(function(){
				 function next(){
					callback(a);
				 };
				 f(a.i,a[a.i],next);
				 a.i ++;
				 auto && next();
			  },t|1000);
		  }else{
			 clearTimeout(a.tid);
			 end && end(a);
		  }
	 }
	 callback(a);
};
function loader(attrTpl,resources,root,props){
	var attrs = attrTpl.split('.');
	if( !resources || resources.length == 0 ) return;
	resources.each4delay(function(i,content,next){
		var content = resources[i];
		if( content == "" ) return;
		var content = root + content;
		var s = document.createElement(attrs[0]);
		if( props ){
			for(var prop in props){
				s[prop] = props[prop];
			}
		}
		s[attrs[1]] = content;
		s.onload = function(){
			next();
		};
		document.body.appendChild(s);
	},10,false,function(){
		console.info('loaded');
	});
}
var u = {
	eval : function(code){
		return eval('('+code+')');
	}
}
// 是否触发展示插件
chrome.extension.sendRequest(
    {type: "yund", url: location.href},
    function(response) {
        if (response.yund_option) {
        	var yund = response.yund_option,host = yund.host;
        	for(var i = 0; i < yund.resources.length; i ++ ){
        		var resource = yund.resources[i];
        		var matches = resource.matches || '/.*/i';
        		var fix = false;
        		if( /^\/[^\/]+\/[img]*$/.exec(matches) ){
					matches = u.eval(matches);
					fix = matches.exec( location.href );
				}else{
					fix = location.href.indexOf( matches ) >= 0;
				}
        		if( fix ){
        			loader('script.src',resource.scripts,resource.host || yund.host ,{type:'text/javascript',' charset':'UTF-8'});
					loader('link.href',resource.stylesheets,resource.host || yund.host ,{type:'text/css','rel':"stylesheet"});
        		}
        	}
        }
    }
);
//保存配置
chrome.extension.sendRequest(
    {type: "yund_config", url: location.href},
    function(response) {
        if (response.yund_config) {
        	var yund_config = response.yund_config;
        	_.cache("yund_config",yund_config);
        }
    }
);