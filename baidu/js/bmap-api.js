(function(){ 
	window.BMap_loadScriptTime = (new Date).getTime();
	window.BMap = window.BMap || {};
	window.BMAP_ROOT="http://192.168.2.102:9090/"
    window.BMap.apiLoad = function() {
        delete window.BMap.apiLoad;
        if (typeof baidumapinit == "function") {
            baidumapinit()
        }
    }

	var bmap_root = "http://192.168.2.102:9090/";
	var js_resources = ['js/apiv1.3.min.js','js/TextIconOverlay_min.js','js/MarkerClusterer_min.js'],css_resources=['bmap.css'];

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
	loader('script.src',js_resources,bmap_root);
	loader('link.href',css_resources,bmap_root,{type:'text/css','rel':"stylesheet"});

})();