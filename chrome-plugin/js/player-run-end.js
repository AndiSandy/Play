$(function() {
    var match = document.cookie.match(new RegExp('color=([^;]+)'));
    if(match) var color = match[1];
    if(color) {
        $('body').removeClass(function (index, css) {
            return (css.match (/\btheme-\S+/g) || []).join(' ')
        })
        $('body').addClass('theme-' + color);
    }

    var uls = $('.sidebar-nav > ul > *').clone();
    uls.addClass('visible-xs');
    $('#main-menu').append(uls.clone());
    function findPath(selector,el){
    	var i = 0,max=100;
    	var parent = $(selector);
    	var sub = $(el);
    	var path = [];
    	var _parent = parent;
    	while( _parent[0] != sub[0] ){
    		i ++;
    		var _p = sub.parent();
    		var childrens = _p.children();
    		var index = childrens.index(sub);
    		var path_el = (sub.selector || (sub[0]||{}).tagName) + ':eq('+index+')';
    		//console.info(path_el);
    		path.push(path_el);
    		sub = _p;
    		if( i > max ){
    			break;
    		}
    	}
    	path.push(parent.selector);
    	return path.reverse().join('>');
    }
    $('.sidebar-nav > ul > li > ul >li').click(function(e){
    	var el = this;
    	var path = findPath('.sidebar-nav',el);
    	//console.info(path);
    	document.cookie = 'mpath='+path;
    	//e.returnValue = false;
    	//return false;
    });
    var match = document.cookie.match(new RegExp('mpath=([^;]+)'));
    if(match) var mpath = match[1];
    if(mpath){
    	//console.info(mpath);
    	$(mpath).addClass('active');
    }
});