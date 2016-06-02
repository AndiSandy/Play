setTimeout(function(){
	console.info('content-js-sample',play);
},5000);

function loadJS(url, onload) {
    var domscript = document.createElement('script');
    domscript.src = url;
    domscript.charset = 'utf-8';
    if (onload) {
        domscript.onloadDone = false;
        domscript.onload = onload;
        domscript.onreadystatechange = function () {
            if ("loaded" === domscript.readyState && domscript.onloadDone) {
                domscript.onloadDone = true;
                domscript.onload();
                domscript.removeNode(true);
            }
        };

  }
  document.getElementsByTagName('head')[0].appendChild(domscript);
}

loadJS("file:///E:/github/Play/js-project/base.js");
