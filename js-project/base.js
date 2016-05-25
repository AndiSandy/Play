(function(){

	$.extend(String,{
		fill : '...',
		show : function(s,length){
			var s = this.toString(s) || '';
			if(length > 0 && s.length > length){
				s = s.substring(0,length) + this.fill;
			}else if(s == null){
				s = "";
			}
			return (''+s).trim();
		},
		toString : function(s){
			return s == null ? '' : ''+s;
		}
	});
	/**
	 * 微型模板引擎
	 * example :
	 * hello qq,lili,hh
	 * "hello {0},{1},{2}".format('qq','lili','hh') =="hello {0},{1},{2}".format(['qq','lili','hh']);
	 * "hello {w},{s},{name}".format({w:'qq',s:'lili',name:'hh'});
	 * "hello {0},{s},{name}".format({w:'qq',s:'lili',name:'hh'});
	 */
	$.extend(String.prototype,{
		wrap : function(tag){
			return ['<'+tag+'>',this,'</'+tag+'>'].join('');
		},
		is : function(s){
			return this == s;
		},
		eq : function(s){
			return this == s;
		},
		//过滤字符
		filter : function(chars){
			var s = this;
			if(chars){
				for(var key in chars){
					s = s.replace(chars[key], key);
				}
			}
			return s;
		},
		ifNull : function(a,ifNull){
			return a == null ? ifNull : a;
		},
		isEmpty : function(){
			return this.trim() == "";
		},
		//string转化为json
		json : function(){
			return this.eval(this);
		},
		eval : function(v,scope){
			try{
				with(scope || window){
					return eval("("+v+")");
				}
			}catch(e){
				debug && console.warn && console.warn(e.message);
				return null;
			}
		},
		//格式化带点的字符串对象 shop.shopId
		format_dot_o : function(a,value){
			var func_reg = /([^\(]+)\(([^\)]+)\)/ig;
			if(func_reg.test(value)){//function
				var args = RegExp.$2;
				var func = RegExp.$1;
				func = this.format_dot_o(a,func) || function(){return func;};
				args = args.split(',');
				for(var i =0; i < args.length; i++){
					args[i] = this.format_dot_o(a,args[i]) || args[i];
				}
				//console.info(args +"-"+func);
				return func.apply(a,args);
			}else{
				var expression = value.match(/([^\.]+)/g);//[0-9a-zA-Z_]
				var v = a[expression[0]];
				for(var i=1; i < expression.length; i ++){
					v = v && v[expression[i]];
				}
				return this.ifNull(v,"".ifNull(this.eval(value,a),'{'+value+'}'));
			}
		},
		//格式化对象
		format_o: function(o){
			var string = this;
			return this.replace(/\{([^}]+)\}/g,function(index,value){
				return string.format_dot_o(o,value);
			});
		},
		//格式化数组
		format_a: function(a){
			var string = this;
			return this.replace(/\{([^}]+)\}/g,function(index,value){
				return string.format_dot_o(a,value);
			});
		},
		//格式化入口
		format	: function(){
			var content = this;
			if(arguments.length > 0){
				for(var i = 0; i < arguments.length; i++){
					var o = arguments[i];
					//console.debug('format');
					if($.isArray(o)){//array
						//console.debug("//array");
						content = content.format_a(o);
					}else if( typeof o == 'object'){//plain object $.isPlainObject(o)
						//console.debug("//plain object");
						content = content.format_o(o);
					}else{//arguments
						//console.debug("//arguments");
						var a = [].slice.apply(arguments, [0, arguments.length]);
						content = content.format_a(a);
					}
				}
				return content;
			}else{
				return this;
			}
		},
		//去前后空格
		trim : function(){
			return this.replace(/^\s*|\s*$/img,'');
		},
		html : function(){
			return this.filter({
				"&amp;" : /&/img,
				"&lt;" : /</img,
				"&gt;" : />/img,
				"&nbsp;" : / /img,
				"&quot;" : /"/img,
				"&#39;" : /'/img
			});
		}
	});
	
    
    /**
     * Array扩展
     */
    $.extend(Object,{
		toArray : function(o){
			var a = [];
			for(var attr in o){
				if(!$.isFunction(o[attr])){
					a.push([attr,o[attr]].join(':'));
				}
			}
			return a;
		}
	});
    $.extend(Array.prototype,{
    	each1 : function(f){
    		for(var i =0; i < this.length; i ++){
				f.apply(this,[i,this[i]]);
			}
    	},
		toObject : function(){
			var o = {};
			this.each1(function(i,elm){
				var kv = elm.split(':');
				o[kv[0]] = kv[1];
			});
			return o;
		},
		fill : function(s){
			var a = this;
			for(var i=0; i < a.length; i ++){
				if( a[i] == null){
					a[i] = s;
				}
			}
			return this;
		},
		random : function(){
			var length = this.length;
			var r = new Date().getTime() % length;
			return this[r];
		}
	});
    
    /*-----------------------
	 * request请求对象
	 * http://www.baidu.com/index.html?name=123
	 * example $.request.get('name') = 123;
	 -----------------------*/
	$.request = ( new function(){
		var console = window.console || {};
		console.info = console.info || function(a){
			alert(a);
		};
		this.parameters = {};
		this.init = function(search){
			var search = search || '';
			if(search.indexOf('?') == 0){
				search = search.substring(1);
			}
			var pa = search.split("&");
			for(var i = 0; i < pa.length; i ++){
				var kv = pa[i].split("=");
				this.parameters[kv[0]||''] = kv[1]||'';
			}
		};
		this.parameters = {};
		this.get = function(name){
			return this.parameters[name || ''] || '' ;
		};
		this.toString = function(){
			var string = "";
			for(var a in this.parameters){
				string += a + "-" + this.parameters[a] + "\n";
			}
			console.info(string);
		};
		var search = location.search.substring(1);
		this.init(search);
	});
	
	/**----------------------
	 * cookie plugin
	 * $.cookie().g('xxx')
	 * 
	 -----------------------*/
	$.cookie = function(){
  		var d= document;
  		var cookies = d.cookie.split("; ");
  		
  		var date = new Date();
  		var expiresFun = "toGMTString";
  		//default options
  		var o = {
  				expires :	'',
  				path	:	'/',
  				domain	:	location.hostname,
  				secure	:	false
  		};
  		//setting to string
  		var o2s = function(s){
  			var ss = [];
  			for(var n in s){
  				ss.push(n + "=" + s[n]);
  			}
  			return ss.join("; ");
  		};
  		//set
  		var s = function(n,v,ss){
  			var set = {};
  			set[n] = escape(v);
  			set = $.extend(set,ss||{});
  				
  			if(set && set.expires){
  				date.setTime(date.getTime() + set.expires );
  				set.expires = date[expiresFun]();
  			}
  			
  			console.info(o2s(set));
  			document.cookie = o2s(set);
  		};
  		//get
  		var g = function(n){
  			var find = false;
  			var v = null;
  			for(var i=0; i < cookies.length; i ++){
  				cookie = cookies[i].split("=");
  				var cn = cookie[0] || "";
  				var cv = cookie[1] || "";
  				if(cn == n){
  					if(!find){
  						v = unescape(cv);
  					} 
  					find = true;
  					console.info("get cookie:"+cn+"="+unescape(cv));
  				}
  			}
  			return v;
  		};
  		//del
  		var d = function(n,ss){
  			//date.setTime(date.getTime() - 10000 );
  			//document.cookie = n + "=; expires=" + date[expiresFun]();
  			s(n,null,$.extend({expires:-10000},ss||{}));
  		};
  		//list
  		var l = function(){
  			console.info(">>===========================");
  			$.each(cookies,function(i,cookie){
  				console.info(i+".	"+unescape(cookie));
  			});
  			console.info("<<===========================");
  		};
  		$.cokie = $.extend({},{s:s,g:g,d:d,l:l});
  		return $.cokie;
  	};
  	  		
	/* ----------================extend=============--------------*/
	/**
	 * map转数组
	 */
	function map2arr(o,k,v){
		var arr = [];
		for(var name in o){
			var oo = null;
			if( k && v ){
				oo = {};
				oo[k] = name;
				oo[v] = o[name];
			}else{
				oo = o[name];
			}
			arr.push(oo);
		}
		return arr;
	}
	function map2objarr(o){
		var arr = [];
		for(var name in o){
			var oo = {};
			oo[name] = o[name];
			arr.push(oo);
		}
		return arr;
	}
	/**
	 * 数组转map
	 */
	function arr2map(arr,k,v){
		var o = {};
		for(var i = 0; i < arr.length; i ++){
			if( k && v ){
				o[arr[i][k]] = arr[i][v];
			}else{
				o[arr[i][k]] = arr[i];
			}
		}
		return o;
	}
	function objarr2map(arr){
		var o = {};
		for(var i = 0; i < arr.length; i ++){
			for(var attr in arr[i]){
				o[attr] = arr[i][attr];
			}
		}
		return o;
	}

	window._ = {
			objarr2map : objarr2map,
			arr2map : arr2map,
			map2objarr : map2objarr,
			map2arr : map2arr
	};

	//类定义
	var Class = function Class(){};
	Class.extend = function(proto){
		console.info(111);
		function Class(){
			var __proto = this;
			$.extend(__proto,proto);
			if( this.init ){
				this.init.apply(this,arguments);
			}
		}
		return Class;
	}
	window.Class = Class;


	var _w = {};
	//队列定义
	var Queue = Class.extend({
		queue : [],
		max : 10,
		init : function(max,queue){
			this.queue = queue || [];
			this.max = max;
		},
		qin : function(elm){
			this.queue.unshift(elm);
			while( this.queue.length > this.max ){
				this.queue.pop();
			}
			return this;
		},
		qout : function(){
			return this.queue.pop();
		},
		copy : function(){
			var copy_queue = [];
			for(var i = 0; i < this.queue.length; i ++ ){
				copy_queue.push( this.queue[i] );
			}
			return copy_queue ;
		},
		join : function(join){
			return this.queue.join(join); 
		},
		toString : function(){
			return this.queue.toString();
		}
	});


	$.extend(_w,{
		Queue : Queue
	});
	$.extend(window,_w);
}());