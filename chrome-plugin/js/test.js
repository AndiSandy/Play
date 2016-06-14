function loader(attrTpl,resources,root,props){
	var attrs = attrTpl.split('.');
	for(var i = 0; i < resources.length; i++ ){
		var content = root+resources[i];
		var s = document.createElement(attrs[0]);
		if( props ){
			for(var prop in props){
				s[prop] = props[prop];
			}
		}
		s[attrs[1]] = content;
		document.body.appendChild(s);
	}
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
        			loader('script.src',resource.scripts,resource.host || yund.host );
					loader('link.href',resource.stylesheets,resource.host || yund.host ,{type:'text/css','rel':"stylesheet"});
        		}
        	}
        }
    }
);