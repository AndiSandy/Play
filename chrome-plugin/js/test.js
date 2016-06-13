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
// 是否触发展示插件
chrome.extension.sendRequest(
    {type: "yund", url: location.href},
    function(response) {
        if (response.yund_option) {
        	loader('script.src',response.yund_option.res,response.yund_option.host);
        }
    }
);