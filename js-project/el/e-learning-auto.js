/*!
 * jQuery sunign auto e-learning JavaScript Library v2.1.1
 * http://magic0115.duapp.com/health
 *
 *
 * Copyright 2014 magic Foundation, Inc. and other contributors
 * Released under the MIT license
 *
 * Date: 2014-09-01T09:11Z
 */
(function($){
	if(!$) return;
	
	//////////////定义一类///////////////
	var defineClass = function(_clazz_,_static_,_impl_){
		console.info('dfine class...');
		var _class_ = _clazz_.constructor || _clazz_ ||function(){};
		var _static_ = _clazz_._static_ || _static_;
		var _public_ = _clazz_._public_ || _impl_;
		$.extend(_class_,_static_ || {});
		$.extend(_class_.prototype, _public_ ||{},{constructor:_class_});
		return _class_;
	};
	window.defineClass = defineClass;
	
	var Browser = defineClass({
		constructor : function(){
			//Mozilla/Version [Language] (Platform; Encryption)
			//Mozilla/Version (Platform; Encryption [; OS-or-CPU description])
			//Mozilla/2.0 (compatible; MSIE Version; Operating System)
			//呈现引擎-rendering engine
			console.info('browser...');
			var reg_config = {
					version : '[\w\.]+'
			};
			var o = ['Platform','OS-or-CPU','Engine','Language','Encryption','Product'];
			var NA = navigator;
			var UA = NA.userAgent;
			UA.match(/(\w+\/[\d\.]+)\s+(\([^\)]+\))+\s+(\w+\/[\d\.]+)?\s?(\([^\)]+\))?\s+(\w+\/[\d\.]+)+/img);
			
			var browser = this.browser;
			for(var brw in browser){
				if(browser[brw].is.test(UA)){
					browser[brw] = true;
					browser['product'] = {
							name : brw,
							version : RegExp.$1
					};
				}
			}
			browser.lang = NA.language;
			if(!browser.product){
				browser.unkown = true;
				browser.product = {
						name : 'unkown',
						version : 'unkown',
				};
			}
			
			//ie
			//Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.3)"
			
			
			//firefox
			//Mozilla/MozillaVersion (Platform; Encryption; OS-or-CPU; Language; PrereleaseVersion) Gecko/GeckoVersion ApplicationProduct/ApplicationProductVersion
			//Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0
			
			
			//safari
			//Mozilla/5.0 (Platform; Encryption; OS-or-CPU; Language) AppleWebKit/AppleWebKitVersion (KHTML, like Gecko) Safari/SafariVersion
			//Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/124 (KHTML, like Gecko) Safari/125.1
			
			//chrome
			//Mozilla/5.0 (Platform; Encryption; OS-or-CPU; Language) AppleWebKit/AppleWebKitVersion (KHTML, like Gecko) Chrome/ChromeVersion Safari/SafariVersion
			//Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.13 (KHTML, like Gecko) Chrome/0.2.149.29 Safari/525.13
			
			//opera
			//Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36 OPR/23.0.1522.77
			
			//browser/version (Platform version; OS-or-CPU) Engine/version (Engine describe) browser/version browser/version browser/version
			//xp是windows nt5.1，vista是windows nt6.0，win7是windows nt6.1，win8是windows nt6.2
			//Windows NT 6.1
		},
		_public_ : {
			browser : {
				chrome : {
					is : /Chrome\/([\w\.]+) Safari\/([\w\.]+)/ig,
					engine : /(AppleWebKit)[/]([\w\.]+)/ig
				},
				opera : {
					is : /OPR[/]([\w\.]+)/ig,
					engine : /(AppleWebKit)[/]([\w\.]+)/ig
				},
				mise : {
					is : /MSIE[/\s]*([\w\.]+)/ig,
					engine : /(Trident)[/]([\w\.]+)/ig
				},
				firefox : {
					is : /Firefox[/]([\w\.]+)/ig,
					engine : /(Gecko)[/]([\w\.]+)/ig
				},
				safari : {
					is : /Version[/]([\d\.]) Safari\/[\d\.]+/,
					engine : /(AppleWebKit)[/]([\w\.]+)/ig
				}
			}
		},
		_static_ : {
		}
	});
	$.browser = new Browser().browser;
	
	//////////base///////////////////
	$.extend(String.prototype,{
		wrap : function(w){
			var s = w.split('');
			s[1] = s[1] || s[0];
			return [s[0],this,s[1]].join('');
		},
		unwrap : function(){
			var s = this;
			return s.slice(1,s.length-1);
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
				warn && console.warn(e.message);
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
		//前补位
		prePad : function(l,p){
			var len = l - this.length;
			return len > 0 ? Array(len+1).join(p)+this:this;
		},
		html : function(){
			/*
			var htmlencode = $('[htmlencode]');
			if( htmlencode.size() == 0 ){
				htmlencode = $('<div htmlencode style="display:none;"></div>');
				htmlencode.appendTo('body');
			}
			try{
				return htmlencode.text(this.toString()).html();
			}catch(e){
				debug && console.info(e);
			}*/
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
	
	$.extend(Array.prototype,{
		equals	: function(a,b){
			return a == (b);
		},
		indexOf : function(a,f){
			for(var i =0; i < this.length; i ++){
				if((f||this.equals)(a,this[i])){
					return i;
				}
			}
			return -1;
		},
		filter : function(a,f,arr,max){
			var l = arr || [];
			max = max || Number.MAX_VALUE;
			for(var i =0; i < this.length; i ++){
				if((f||this.True)(a,this[i]) && l.length <  max){
					l.push(this[i]);
				}
			}
			return l;
		},
		random : function(){
			var length = this.length;
			var index = $.helper.random(length);
			return this[index];
		},
		True : function(){
			return true;
		},
		remove : function(iOro,f){
			var at = -1;
			if($.isPlainObject(iOro)){
				at = this.indexOf(iOro,f);
			}else if($.isNumeric(iOro)){
				at = iOro;
			} 
			if(at >=0){
				this.splice(at,1);
			}
		}
	});
	
	//计算tab长度
	Math.tab = function(num){
		var t = parseInt(num / String.tab_size);
		var ts = num % String.tab_size;
		return t + ( ts >(String.tab_size/2 + 1) ? 1 : 0 );
	};
	String.tab_size = 4;
	String.prototype.trim = function(){
		return this.replace(/^\s*|\s*$/img,'');
	};
	String.prototype.pad = function(){
		return function(n, fill, pre) {
			var tbl = [];
			var num = this;
			pre = pre || 'pre';
			var fill = fill || '0';
			//console.info(fill);
			var snum = num.toString();
			var len = n - snum.Length();
			if (len <= 0) {
				snum = snum.substring(0,n);
				return snum;
			};
			if (!tbl[len]) tbl[len] = (new Array(len+1)).join(fill);
			return pre == 'pre' ? tbl[len] + num : num + tbl[len];
	  };
	}();
	String.prototype.tabPad = function(){
		return function(n, pre) {
			var tbl = [];
			var num = this;
			pre = pre || 'pre';
			var fill =  '\t';
			//console.info(fill);
			var snum = num.toTabString();
			var len = n - parseInt(Math.tab(snum.Length()));
			if (len <= 0) {
				snum = snum.substring(0,n*String.tab_size);
				return snum;
			};
			if (!tbl[len]) tbl[len] = (new Array(len+1)).join(fill);
			return pre == 'pre' ? tbl[len] + num : num + tbl[len];
	  };
	}();
	//计算字符串长度包括双字节字符
	String.prototype.Length = function(){
		return this.replace(/[^\x00-\xff]/g, '__').replace(/\t/g,'____').length;
	};
	String.prototype.isEmpty = function(){
		var s = this.trim();
		return s == "" ;
	};
	String.prototype.toTabString = function(){
		var t = parseInt(this.Length() /String.tab_size);
		var ts = this.Length() % String.tab_size;
		t = t + (ts > 0 ? 1 : 0);
		var s = ts > 0 ? this.pad(t * String.tab_size,' ','suffix') : this;
		return s;
	};
	function nul(obj){
		return obj == null;	
	}; 
	Object.nul = nul;
	
	String.Null = function(s){
		return s == null || s.isEmpty();	
	};
	
	/*-----------------------
	 * 日志对象
	 -----------------------*/
	var Logger = window.Logger =  function(package){this.init(package);};
	Logger.getLogger = function(package){
			return new Logger(package);
	};
	var log_impl = {
		package : 'javascript.lang.util.js',
		apis	:['info','warn','error','debug','log','clear','assert'],
		logFile : [],
		exist	: function(s){
			return typeof s != 'undefined';
		},
		existSysConsole	: typeof console != 'undefined',
		init : function(package){
			var log = this;
			log.package = package || log.package;
			var console = {};
			if(this.existSysConsole){
				console = window.console;
			}
			this.console = console;
			for(var i =0; i < this.apis.length; i ++){
				var apiName = this.apis[i];
				var api = console[apiName];
				if(!this.exist(api)){
					console[apiName] = api = console['info'] || console['log'] || $.noop;
				}
				this[apiName] = function(text){
					var args = [].slice.apply(arguments,[1, arguments.length]);
					var time = new Date().f();
					var log_text = "["+time+"]["+log.package+"]	"+$.string.show(text).format.apply(text,args);//[]
					var func = arguments.callee.api;
					try{
						func(log_text);
					}catch(e){
						//alert(e);
						func.call(console,log_text);
					}
				};
				this[apiName].api = api;
			}
			
		},
		loge : function(text){
			var args = [].slice.apply(arguments,[1, arguments.length]);
			var time = new Date().f();
			var log_text = "["+time+"]["+log.package+"]	"+$.string.show(text).format.apply(text,args);//[]
			this.logFile.push({date:time,text:log_text});
		}
	};
	$.extend(Logger.prototype,log_impl);
	$.Logger = Logger;
	$.logger = new Logger();
	$.log = new Logger("javascript.lang.util.js");
	$log = $.log;
	
	$.isNumeric = function(obj){
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	};
	
	/*-----------------------
	 * request请求对象
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
	
	$.string = (new function(){
		this.fill = "..";
		this.show = function(s,length){
			var s = this.toString(s) || '';
			if(length > 0 && s.length > length){
				s = s.substring(0,length) + this.fill;
			}else if(s == null){
				s = "";
			}
			return (''+s).trim();
		};
		this.toString = function(s){
			return s == null ? '' : ''+s;
		};
	});
	
	$.helper = (new function(){
		//var img_regex = //img;
		this.tableKey = function(num){
			var table = "\t";
			var s = "";
			for(var i = 0; i < num; i ++){
				s += table;
			}
			return s;
		};
		this.toString = function(config,level){
			var level = level || 0;
			var tableKey = this.tableKey(level);
			if(config){
				var s = "";
				for(var attr in config){
					var cv = config[attr];
					
					var isobj = false;
					try{
						isobj = $.isPlainObject(cv);
					}catch(e){
						
					}
					if(isobj){
						s += tableKey + attr + "\n" +this.toString(cv,level + 1);
					}else if($.isArray(cv)){
						var sa = attr + "=[";
						for(var i = 0; i < cv.length; i ++){
							var ca = cv[i];
							if( $.isPlainObject(ca)){
								s += "\n"+tableKey +this.toString(ca,level + 1);
							}else if($.isArray(ca)){
								s += "\n"+tableKey +this.toString(ca,level + 1);
							}else if($.isFunction(ca)){
								sa += i + "=[function],";	
							}else{
								sa += i + "="+ca+",";
							}
						}
						sa += "];\n";
						s += tableKey + sa;
					}else if($.isFunction(cv)){
						s += tableKey + attr + "=[function];\n";		
					}else{
						s += tableKey + attr + "=" + cv + ";\n";
					}
				}
				return s;
			}
		};
		this.random = function(max){
			var max = max || 0;
			var timesmap = new Date().getTime();
			var seed = Math.random() * timesmap;
			var r = max > 0 ? seed % max : seed;
			r = window.parseInt(r);
			return r;
		};
	});
	
	
	/*-----------------------
	 * 获取input参数
	 -----------------------*/
  	$.fn.getParameters = function(keys){
  		var p = {};
  		var keys = keys || [];
  		for(var i=0; i < keys.length; i ++){
  			var key = keys[i] || '';
  			var val = $.string.show($("input[name="+key+"]",this).val());
  			p[key] = val;
  		}
  		return p;
  	};
  	
  	
  	/*-----------------------
	 * 日期格式化d.f("yyy-MM-dd hh:mm:ss:SS EEE")
	 -----------------------*/
  	var rs = [
  		{name:'y',y:{regex:/(y+)/,getapi:'getYear',formatter:function(v){
  			if(v < 2000){
  				return 1900 +v;
  			}
  			return v;
  		},pad:'pad4reverse'}},
  		{name:'M',M:{regex:/(M+)/mg,getapi:'getMonth',pad:'pad',formatter:function(v){return v+1;}}},
  		{name:'d',d:{regex:/(d+)/mg,getapi:'getDate',pad:'pad'}},
  		{name:'h',h:{regex:/(h+)/mg,getapi:'getHours',pad:'pad'}},
  		{name:'m',m:{regex:/(m+)/mg,getapi:'getMinutes',pad:'pad'}},
  		{name:'s',s:{regex:/(s+)/mg,getapi:'getSeconds',pad:'pad'}},
  		{name:'S',S:{regex:/(S+)/mg,getapi:'getMilliseconds',pad:'pad'}},
  		{name:'E',E:{regex:/(E+)/mg,getapi:'getDay',formatter:function(v){
  			var weeks = this.weeks[Date.lang || this.lang];
  			return weeks[v];
  		},pad:'pad'}}
  	];
  	var d_static_impl = {
  		lang	: 'zh',
  		f : function(f){
  			return new Date().f(f);
  		},
  		now: function(){
  			return new Date();
  		}
  	};
  	var d_ipml = {
  		weeks: {en:["Sunday","Monday","Thuesday","Wednesay","Tursday","Friday","Saturday"],zh:["星期天","星期一","星期二","星期三","星期四","星期五","星期六"]},
  		lang : 'en',
  		rs : rs,
  		dateObj : {},
  		isInit : false,
  		needpad	: true,
  			/* 查表法(过程式版本)  by aimingoo */
		pad : function() {
		  var tbl = [];
		  return function(num, n) {
			var snum = num.toString();
		    var len = n - snum.length;
		    if (len <= 0) {
		    	snum = snum.substring(0,n);
		    	return snum;
		    };
		    if (!tbl[len]) tbl[len] = (new Array(len+1)).join('0');
		    return tbl[len] + num;
		  };
		}(),
		pad4reverse : function() {
		  var tbl = [];
		  return function(num, n) {
			var snum = num.toString();
		    var len = n - snum.length;
		    if (len <= 0) {
		    	if($.isNumeric(num)){
		    		snum = snum.split('').reverse().join('');
			    	snum = snum.substring(0,n);
			    	snum = snum.split('').reverse().join('');
		    	}else{
		    		snum = snum.substring(0,n);
		    	}
		    	return snum;
		    };
		    if (!tbl[len]) tbl[len] = (new Array(len+1)).join('0');
		    return tbl[len] + num;
		  };
		}(),
  		initDateObj : function(){
  			for(var i =0;i < this.rs.length; i ++){
  				var eld = this.rs[i];
  				var v = this[eld[eld.name].getapi]();
  				var f = eld[eld.name].formatter;
  				if(f){
  					v = f.call(this,v);
  				}
  				eld[eld.name].text = v;
  				this.dateObj[eld.name] = eld[eld.name];
  			}
  			this.isInit = true;
  		},
  		formatter : 'yyyy-MM-dd hh:mm:ss',
  		f:function(formatter){
  			var d = this;
  			this.initDateObj();
  			var ff = formatter || this.formatter;
  			for(var i = 0; i < this.rs.length; i ++){
  				var obj = this.rs[i];
  				var regex = obj[obj.name].regex;
  				var text = obj[obj.name].text;
  				var pad = obj[obj.name].pad;
  				//console.debug("f():"+text);
  				ff = ff.replace(regex,function(s){
  					return d[pad](text,s.length);
  				});
  			}
  			//console.info("date:"+ff);
  			return ff;
  		}
  	};
  	$.extend(Date.prototype,d_ipml,{
  		toString : function(){return this.f();}
  	});
  	$.extend(Date,d_static_impl);
  	$.date = Date;
  	
  	
  	$.coookie = function(){
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
  		return $.extend(this,{s:s,g:g,d:d,l:l});
  	};
  	
  	//定时器
  	var timmer = function(){
		this.i = this.interval;
		this.t = this.timeout;
		this.clock_data = {};
  	}; 
	var clock_impl = {
			_show :function(t){
				switch(t){
					case 's':
						if(this.start){
							$.log.info("任务名称【{name}\t\t】开始时间【{start}】".format(this));
						}
						break;
					case 'e':
						if(this.end){
							$.log.info("任务名称【{name}\t\t】结束时间【{end}】消耗【{diff}】毫秒".format(this));
						}
						break;
					case 'l':
						for(var i = 1; i < this.time_seq.length; i ++){
							var p = this.time_seq[i];
							$.log.info("任务名称【{name}-{piece}\t\t】执行时间【{d}】消耗【{diff}】毫秒".format($.extend({},this,p)));
						}
						break;
					case 't':
						if(this.time_seq.length > 1){
							var p00 = this.time_seq[this.time_seq.length -1];
							$.log.info("任务名称【{name}-{piece}\t\t】执行时间【{d}】消耗【{diff}】毫秒".format($.extend({},this,p00)));
						}
						break;	
					default :break;
				}
				
			}
	};
	timmer.idmap = {};
	timmer.fn = {
		//延迟定时器	
		timeout	:function(name,delay,callback,option){
			$log.debug("[{1}]timmer.timeout[{0}]",delay,name);
			var o = {};
			if($.isPlainObject(name)){
				o = name;
				o.func = arguments.callee;
				o = timmer.idmap[o.name] = $.extend(timmer.idmap[o.name],o);
			}else{
				o = timmer.idmap[name] = $.extend(timmer.idmap[name],{name:name,delay:delay,callback:callback,option:option});
				o.func = arguments.callee;
			}
			var id = setTimeout(function(a,b,c){
				o.callback.apply(o,[a,b,c]);
			},o.delay,o.option);
			o.id = id;
		},
		delay : function(dly,cb,o){
			this.t('timmer.delay.func'+Date.f() + '-'+ dly,dly,cb,o);
		},
		//间隔定时器
		interval:function(name,delay,callback,option){
			$log.debug("[{1}]timmer.interval[{0}]",delay,name);
			var o = {};
			if($.isPlainObject(name)){
				o = name;
				o.func = arguments.callee;
				o = timmer.idmap[o.name] = $.extend(timmer.idmap[o.name],o);
			}else{
				if(timmer.idmap[name] && timmer.idmap[name].status == 0){
					this.stop(name);
				}
				o = timmer.idmap[name] = $.extend(timmer.idmap[name],{name:name,delay:delay,callback:callback,option:option});
				o.func = arguments.callee;
			}
			var id = setInterval(function(a,b,c){
				o.callback.apply(o,[a,b,c]);
			},o.delay,o.option);
			o.id = id;
			o.status = 0;
		},
		//定时器结束
		stop	:function(name){
			if(!timmer.idmap[name]){
				$log.info("no timer named:[{0}]to timmer.stop",name);
				return;
			}
			$log.info("[{0}]timmer.stop",name);	
			var id = timmer.idmap[name].id || 0;
			var func = timmer.idmap[name].func || $.noop;
			if(func == this.timeout && id !=0){
				clearTimeout(id);
				timmer.idmap[name].status = 1;
			}else if(func == this.interval  && id !=0){
				clearInterval(id);
				timmer.idmap[name].status = 1;
			}
		},
		//定时器开始
		start	:function(name,delay,callback,option){
			if(!timmer.idmap[name]){
				$log.info("no timer named:[{0}]to timmer.start",name);
				return;
			}
			$log.debug("[{0}]timmer.start",name);
			var o = {};
			if($.isPlainObject(name)){
				o = name;
				o = timmer.idmap[o.name] = $.extend(timmer.idmap[o.name],o);
			}else{
				o = timmer.idmap[name] = $.extend(timmer.idmap[name],{name:name,delay:delay,callback:callback,option:option});
			}
			var func = timmer.idmap[o.name].func || $.noop;
			var id = timmer.idmap[o.name].id || 0;
			if(id > 0){
				this.stop(o.name);
			}
			if(func == this.timeout){
				this.timeout(o);
			}else if(func == this.interval){
				this.interval(o);
			}
		},
		//列出定时器
		l	: function(){
			console.info(">>===========================");
			var i = 0;
  			for(var name in timmer.idmap){
				$log.info(i+".	"+name);
				i++;
			}
  			console.info("<<===========================");
			
		},
		//开始计时
		s	: function(name){
			var d = new Date();
			var p0 = {piece:'start',d:d};
			var c = $.extend(this.clock_data[name]||{},{start:d.f(),name:name,time_seq:[p0]},clock_impl,{
				show : function(){this._show('s');}
			});
			this.clock_data[name] = c;
			return c;
		},
		//计时
		tm	: function(name,piece){
			var d = new Date();
			//console.info('timmer'+d.f());
			var c = $.extend(this.clock_data[name],clock_impl,{
				show : function(){this._show('t');}
			});
			if(c){
				c.time_seq = c.time_seq || [];
				var p1 = c.time_seq[c.time_seq.length-1];
				var p2 = {piece:piece,d:d};
				c.time_seq.push(p2);
				if(p1 && p2){
					p2.diff = p2.d.getTime() - p1.d.getTime();
				}
			}
			return c;
		},
		//结束计时器
		e	: function(name){
			var d = new Date();
			var c = $.extend(this.clock_data[name],{end:d.f()},clock_impl,{
				show : function(){this._show('e');}
			});
			var p00 = {piece:'end',d:d};
			var p0 = c.time_seq[0];
			var p1 = c.time_seq[c.time_seq.length-1];
			c.time_seq.push(p00);
			if(p00 && p1){
				p00.diff = p00.d.getTime() - p1.d.getTime();
			}
			if(p00 && p0){
				c.diff = p00.d.getTime() - p0.d.getTime();
			}
			return c;
		},
		//获取clock对象
		g	: function(name){
			var c = $.extend(this.clock_data[name],clock_impl,{
				show : function(){this._show('l');}
			});
			return c;
		},
		//测试是否存在指定名称对象
		test : function(name){
			return this.clock_data[name] || timmer.idmap[name];
		}
	};
	
	/*
	 	$.timmer.s('hello').show();
	 	$.timmer.tm('hello','1').show();
	 	$.timmer.tm('hello','2').show();
	 	$.timmer.tm('hello','3').show();
	 	$.timmer.g('hello').show();
	 	$.timmer.e('hello').show();
	 */
	
	$.extend(timmer.prototype,timmer.fn);
	//timmer.fn = timmer.prototype;
	
	$.timmer = new timmer();
	
	//仿spring定时器
	var Package = function(){
		var packages = [].slice.apply(arguments, [0,arguments.length]);
		for(var pi = 0; pi < packages.length; pi++){
			var _package = packages[pi];
			var pnames = _package.match(/[^\.]+/g);
			var p = window;
			for(var i = 0; i < pnames.length; i++){
				if(!p[pnames[i]])
					p[pnames[i]] = {};
				p = p[pnames[i]];
			}
		}
	};
	Package("spring.Timer","spring.context","spring.timer");
	spring.Timer = function(){
		//守护进程
		var Deamon = function(timer){
			var timer_id = 'spring.timer.deamon';
			var i = {
				run : function(){
					console.info('spring.timer.deamon.run');
					$.timmer.i(timer_id,1000,timer.monitor,timer);
				},
				start: function(){
					$.timmer.start(timer_id);
				},
				stop : function(){
					$.timmer.stop(timer_id);
				}
			};
			$.extend(this,i);
		};
		var Timer = function(){
			var task_list = spring.context.task_list = [];
			var This = this;
			var i = {
				//监视器	
				monitor : function(){
					var d = new Date;
					var tl = This.filter(d);
					if(tl.length ==0 && spring.debug){
						$.log.info("spring.timer noop");
					}
				},
				//过滤符合条件的任务
				filter : function(d){
					var tl = [];
					for(var i = 0; i < task_list.length; i++){
						var task = task_list[i];
						//时间规则解析
						//规则判断
						if(ruler.test(d,task)){
							tl.push(task);
							(new Thread).run(task.job);
						}
						//多线程执行
					}
					return tl;
				},
				add : function(task){
					task.start = new Date;
					console.info(o2s(task));
					var at = task_list.indexOf(task,function(a,b){return a.name == b.name;});
					if(at >=0){
						task_list[at] = task;
					}else{
						task_list.push(task);
					}
				},
				remove:function(name){
					var at = task_list.indexOf(name,function(name,b){return b.name == name;});
					if( at >= 0){
						task_list.remove(i);
					}
				},
				log_length : 10
			};
			$.extend(this,i);
		};
		//时间过则解析
		var format = "ss mm hh dd MM yyyy EEE";
		var fs = ["ss","mm","hh","dd","MM","yyyy","EEE"];
		var Ruler = function(){
			// yyy-MM-dd hh:mm:ss:SS EEE
			// SS ss mm hh dd MM yyyy EEE
			//    ss mm hh dd MM yyyy EEE
			//    *  *  *  *  *  *    *
			//	,/-
			var i = {
				//测试指定时间和时间表达式是否吻合	
				test : function(d,task){
					var ds = d.f(format).match(/[\S]+/g);
					var sds = task.start.f(format).match(/[\S]+/g);
					//console.info(ds);
					var exps = task.cronExpression.match(/[\S]+/g);
					var ok = true;
					
					var runId = [];
					var flag = -1;
					for(var i = 0; i < exps.length; i++){
						var o = ds[i];
						var s = exps[i];
						var sd = sds[i];
						if(/^\*+$/g.test(s)){
							//noop
						}else{
							ok = ok && this.testFragment(parseInt(o), s,sd);
							if(ok){
								if(flag < 0) flag = i;
								//runId.push(o);
							}
						}
					}
					if(ok){//运行记录
						runId = ds.splice(flag,ds.length-1-flag).join('-');
						var log = task.log = task.log || [];
						if(log.indexOf(runId) >=0){
							ok = false;
						}else{
							task.log.push(runId);
						}
						if(log.length > timer.log_length){
							log.splice(0, 10);
						}
					}
					return ok;
				},
				//测试指定时间片段和时间片段表达式是否吻合
				testFragment : function(o,s,sd){
					var es = s.split(',');
					var ok = false;
					for(var i = 0; i < es.length; i++){
						var ss = es[i];
						var b = false;
						if(/\/+/g.test(s)){// 增量执行 /
							b = this.testStep(o, ss,sd);
						}else if(/\-+/g.test(s)){// 范围执行 -
							b = this.testRange(o, ss);
						}else if(/\*+/g.test(s)){// 范围执行 -
							b = true;
						}else{
							b = ss == o;
						}
						ok = ok || b;
					}
					return ok;
				},
				testStep : function(o,s,sd){
					var ok = false;
					var oo = Math.abs(o - sd);
					if(oo > 0){
						var params = s.split("/");
						if(/\-+/g.test(s)){
							if(this.testRange(o, s)){
								ok = oo % params[1] == 0;
							}
						}else{
							var p1 = params[0].replace(/\*+/g,oo);
							ok = p1 % params[1] == 0;
						}
					}
					return ok;
				},
				testRange : function(o,s){
					var ok = true;
					var params = s.split("-");
					var p1 = parseInt(params[0]),p2 = parseInt(params[1]);
					if(p1 < p2){
						ok = o >= p1 && o <= p2;
					}else if( p1 >= p2){
						ok = o >= p1 || o <= p2;
					}
					return ok;
				}
			};
			$.extend(this,i);
		};
		var ruler = new Ruler;
		var Thread = function(){
			this.run = function(task){
				var seq = Thread.seq = Thread.seq || 1;
				var id = "spring.thread-" + seq;
				Thread.seq ++;
				$.timmer.t(id,1,task);
			};
		};
		var timer = new Timer;
		var deamon = new Deamon(timer);
		
		$.extend(timer,{ruler:ruler,deamon:deamon});
		spring.timer = timer;
		//run
		//deamon.run();
	};
  	spring.Timer();
  	
	$._get = function(url,callback,dataType,error){
		$.ajax({
			url	:	url,
			async	:	false,
			cache	:	false,
			type	:	'GET',
			dataType:	dataType || 'html',
			success	:	callback || $.noop,
			error	:	error
		});
	};
	$._post = function(url,data,callback,dataType,error){
		$.ajax({
			url	:	url,
			async	:	false,
			cache	:	false,
			type	:	'POST',
			data	:	data || {},
			dataType:	dataType || 'html',
			success	:	callback || $.noop,
			error	:	error
		});
	};
	
	
	//////////////////////////////
	//jquery扩展					//
	/////////////////////////////
	//对象化
	var objectize = function(selectors){
		selectors = selectors || {};
		var object = {};
		var elm = this;
	for(var name in selectors){
		var selector = selectors[name];
		var v = "";
		if($.isFunction(selector)){
			v = selector(elm);
		}else{
			//$('abc',elm).val();
			v = eval("({0});".format(selector));
		}
		object[name] = v;
	}
		return object;
	};
	var objectizes = function(selectors){
		selectors = selectors || {};
		var list = [];
		$(this).each(function(i,elm){
			var object = $(elm).objectize(selectors);
			list.push(object);
		});
		return list;
	};
	$.fn.objectize = objectize;
	$.fn.objectizes = objectizes;
	
	//setting to string
	var o2s = function(s){
		var ss = [];
		for(var n in s){
			ss.push(n + "=" + s[n]);
		}
		return ss.join("|	");
	};
	
	//sequence
	var seq_serialize = 0;
	var seq = function(array,callback,end,timeout,i){
		i = i || 1;
		callback = callback || $.noop;
		end = end || $.noop;
		array = array || [];
		var elm = array.shift();
		if(elm){
			callback(i-1,elm);
			i ++;
			seq_serialize ++;
			$.timmer.timeout('el-sequence-'+seq_serialize,timeout,function(){
				seq(array,callback,end,timeout,i);
			});
		}else{
			end();
		}
	};
	$.logData = ($.EL && $.EL.logData) || $.logData;
  	$.el = function(){
  		//课程列表地址
  		var courseListUrl = "http://el.cnsuning.com/e-learning/course/indexLearningList.do?courseLearningForm.searchStatus=3";
  		//el登录地址
  		var elUrl = "http://el.cnsuning.com/e-learning/loginSSOAction.do";
  		//学习记录进度地址
  		var studyUrl = "/e-learning/course/learningRecord.do";
  		//oa首页地址
  		var oaUrl = "http://oa.cnsuning.com/portal/soa/index.htm";
  		//课程学习地址
  		var courseUrl = "http://el.cnsuning.com/e-learning/course/learningCourse.do?courseLearningForm.cid={cid}&courseLearningForm.myPid={pid}";
  		//oa登录地址
  		var oaAuthURl = "http://oa.cnsuning.com/SuningUUMWeb/AuthenticationServlet";
  		
  		
  		//记录日志									错误堆栈		错误次数	成功次数		课程学习进度记录    每天课程学习记录
  		var logData = $.logData = $.logData || ($.EL && $.EL.logData) || {stackTrace:[],error:0,success:0,courses:[],dclogs:[]};
  		var error_length = 30;
  		//记录错误日志
  		var logError = function(timeout,loginfo){
  			if(timeout){
  				logData.error ++;
  				logData.stackTrace.push($.extend(loginfo,{show:function(){
					return o2s(this);
				}}));
  				if(logData.stackTrace.length > error_length){
  					logData.stackTrace.shift();
  				}
  			}
  		};
  		//记录成功日志
  		var logSuccess = function(loginfo){
  			logData.success ++;
			if(loginfo)
				logData.stackTrace.push($.extend(loginfo,{show:function(){
					return o2s(this);
				}}));
  		};
  		var log = function(){
  			
  		};
  		var getLog = function(){
  			var d = Date.f("yyyy-MM-dd");
			var at = logData.dclogs.indexOf(d,function(a,b){
				return a == b.date;
			});
			var dlog = {date:d,log:[],ct:[],cd:[]};
			if(at >= 0){
				dlog = logData.dclogs[at];
			}else{
				logData.dclogs.push(dlog);
			}
			return dlog;
  		};
  		//记录课程进度
  		var logProgress  = function(courses){
  			if(courses){
  				function f(a,b){
  	  				return a.name == b.name;
  	  			}
  				//记录学习进度
  				for(var i=0; i <courses.length; i++){
  	  				var course = courses[i];
  	  				var find = logData.courses.indexOf(course,f);
  	  	  			if(find >= 0){//判读课程是否存在
  	  	  				var c = logData.courses[find];
  	  	  				var clog = logData.courses[find].log;
  	  	  				if(clog.indexOf(course.progress) < 0){
  	  	  					clog.push(course.progress);
  	  	  				}
  	  	  				//学习查过多少次还是0%则加入黑名单
  	  	  				logData.courses[find].times = logData.courses[find].times || 1;
  	  	  				Robot.setting.bad_times = Robot.setting.bad_times || 10;
  	  	  				var exist = $.el.bad_courses.indexOf(c.name,function(a,b){return a.trim() == b.trim();});
  	  	  				if(exist < 0 && logData.courses[find].times > Robot.setting.bad_times && clog.length == 1 && clog[0] == '0%'){
  	  	  					$.el.bad_courses.push(logData.courses[find].name.trim());
  	  	  				}
  	  	  				logData.courses[find].times ++;
  	  	  			}else{
  	  	  				logData.courses.push($.extend({},course,{log:[course.progress],times:1}));
  	  	  			}
  	  			}
  				var dlog = getLog();
  				//补列表中不存在的100%课程
  				for(var i=0; i < logData.courses.length; i ++){
  					var course = logData.courses[i];
  					var find = courses.indexOf(course,f) >= 0;
  					if(!find && course.log.indexOf('100%') < 0){
  						course.log.push('100%');
  						dlog.log.push(course);
  					}
  				}
  			}
  			l(false,logData.courses);
  		};
  		
  		
  		//登录oa
  		var loginOA = function(u,p){
  			var loginData = {
  				"UUM_COMPANYCODE" : "oa.cnsuning.com",
				"UUM_SYSTEM" : "UWPPORTAL",
				"j_password" : password || Robot.setting.password || p || "xxxx",
				"j_snyl" : "",
				"j_snyl_type" : "0",
				"j_username" : username || Robot.setting.username || u || "xxxx"
  			};
  			$._post(oaAuthURl, loginData, function(html){
  				var ok = html.indexOf('员工天地') >= 0;
  				$.log.info("{0}登陆{1}!!!",u,(ok ? "成功":"失败"));
  				logError(!ok,{msg:oaAuthURl,html:html});
  			}, 'html', function(){
  				$.log.info("{0}登陆超时!!!",u);
  				logError(!ok,{msg:oaAuthURl,html:"{0}登陆超时!!!"});
  			});
  		};
  		
  		var courses = [];
  		//获取课程 get course
  		var g = function(context){
  			$.log.info("正在提取课程信息...");
  			courses = [];
  			var tabNum = $.EL.tabNum || (parseInt(32/String.tab_size));
  			var context = context || document;
  			var course_exp = {
  				name : "$('td:eq(0)',elm).attr('title').tabPad("+tabNum+",'suffix')",
  				cid : "$('td:eq(0) a',elm).attr('href').match(/\\d+/g)[0]",
  				pid : "$('td:eq(0) a',elm).attr('href').match(/\\d+/g)[1]",
  				project : "$('td:eq(1)',elm).text().trim()",
  				start : "$('td:eq(2)',elm).text()",
  				end : "$('td:eq(3)',elm).text()",
  				progress : "$('td:eq(5) div div',elm).css('width') || '0%'"
  			};
  			courses = $(".tab_table tbody tr",context).objectizes(course_exp);
  			return courses;
  		};
  		
  		var course_tpl = [
  		'<tr>',
			'<td title="{name}" class="text_left">',
				"<a href=\"javascript:courseInfo('{cid}','{pid}')\">{name}</a>",
			'</td>',
			'<td class="text_left"><a href="javascript:projectInfo(\'{pid}\')">{project}</a></td>',
			'<td>{start}</td>',
			'<td>{end}</td>',
			'<td>在线</td>',
			'<td style="line-height:17px;" title="{progress}">',
					'<div style="width:100%; height:15px; background-color:white; border:1px solid #ccc;">',
						'<div style="float:left; width:0%; height:15px; background-color:#006DB2;">{progress}</div>',
					'</div>',
			'</td>',
			'<td><a href="javascript:doLearning(\'/e-learning\',\'{cid}\',\'{pid}\')">学习</a></td>',
		'</tr>'
		];
  		
  		//更新页面进度
  		var u = function(cs){
  			cs = cs || courses ;
  			var tbody = $(".tab_table tbody");
  			if(cs && cs.length > 0){
  				tbody.empty();
  				$.each(cs,function(i,c){
  	  				var course = $(course_tpl.join('').format(c));
  	  				tbody.append(course);
  	  				if(c.progress.trim() == '0%'){
  	  					$('div',course).html(c.progress);
	  				}else{
	  					$('div div',course).animate({width:"{0}".format(c.progress)});
	  				}
  	  			});
  			}
  		};
  		
  		// list course
  		var l = function(dynamic,cs){
  			if(dynamic){
  				q();
  			}
  			console.info(">>===========================");
  			$.each((cs||courses),function(i,course){
  				console.info("{0}.	{1}".format(i,o2s(course)));
  			});
  			console.info("<<===========================");
  		};
  		
  		//查询课程信息
  		var q = function(surl,callback){
  			$.log.info("正在查询课程信息...");
  			var timeout = true;
  			var url = surl || courseListUrl;
  			$.ajax({
  				url	:	url,
  				async	:	false,
  				cache	:	false,
  				type	:	'GET',
  				dataType:	'html',
  				success	:	function(html){
  					timeout = html.indexOf('过期') >= 0 || html.indexOf('操作失败') >= 0;
  					logError(timeout,{msg:url,html:html});
  					g($(html));//获取
  					$.log.info("查询到{0}个课程信息!!!!",courses.length);
  					if(courses && courses.length ==0 ){
  						$.log.error("查询到课程为空!!!!!!");
  					}else{
  						$.log.info("确认有{0}个课程,准备中...",courses.length);
  						(callback || $.noop)(courses);
  					}
  				},
  				error	:	function(){
  					$.log.info("查询课程信息超时失败");
  					timeout = true;
  				}
  			});
  			$.log.info("{0}查询课程信息",(timeout ? "没有":"有"));
  			return !timeout;
  		};
  		
  		//激活学习进程
  		var live_course = function(c){
  			var timeout = true;
  			var url = courseUrl.format(c);
  			$.ajax({
  				url	:	url,
  				async	:	false,
  				cache	:	false,
  				type	:	'GET',
  				success	:	function(html){
  					timeout = html.indexOf('过期') >= 0 || html.indexOf('操作失败') >= 0;
  					logError(timeout,{msg:url,html:html});
  					$.log.info("激活学习进程{0}",timeout?"失败":"成功");
  				},
  				error	:	function(){
  					timeout = true;
  				}
  			});
  			return !timeout;
  		};
  		
  		//记录课程进度
  		//http://el.cnsuning.com/e-learning/course/learningRecord.do?courseLearningForm.cid=&courseLearningForm.myPid=
  		var record = function(course){
  			var timeout = true;
  			var date = new Date();
  			var msg = "正在学习课程【"+course.name+"】...";
  			//$.log.info(msg);
  			$.ajax({
			   type: "POST",
			   async: false,
			   cache : false,
			   url: studyUrl,
			   data: {
				   "courseLearningForm.cid"		:	course.cid,
				   "courseLearningForm.myPid"	:	course.pid,
				   time							:	date.getTime()
			   },
			   success: function(html){
				   timeout = html.indexOf('过期') >= 0 || html.indexOf('操作失败') >=0;
				   logError(timeout,{msg:studyUrl,html:html});
				   var msg = !timeout ? "成功...":"失败...";
				   $.log.warn("学习课程【{0}】{1}",course.name.trim(),msg);
			   },
			   timeout:30000,
			   error:function(request,msg,thro)
			   {
				   $.log.error("学习课程【{0}】超时...",course.name.trim());
			   }
			});
  			//$.log.info("学习课程【"+course.name+"】结束...");
  			return !timeout;
  		};
  		
  		//copy course
  		var copy = function(c){
  			var cs = [];
  			for(var i =0; i < c.length; i ++){
  				cs.push(c[i]);
  			}
  			return cs;
  		};
  		
  		var seq_timeout = 1000 * 10;
  		//study
  		var study = function(o){
  			console.info(">>=【el自助学习机】【每{0}分钟学习一次】【第{1}次学习开始】==========================================".format(o.minute,times));
  			seq(copy(courses),function(i,course){
  				//$.log.info("---->sequence in");
  				if(o.f(i,course,courses)) {
  					if(!record(course)){
  						live_course(course);
  					}
  				}else{
  					$.log.info("课程【{0}】不符合过滤器条件",course.name.trim());
  				}
  			},function(){
  				if(q()){
  					l();//查询
  	  				u();//更新页面
  	  				logProgress(courses);//记录课程进度
  				}
  				console.info("<<=【el自助学习机】【每{0}分钟学习一次】【第{1}次学习结束】==========================================".format(o.minute,times));
  				$.timmer.tm('el-study.task','el-自动学习任务');
  				var t = $.timmer.e('el-study.task');
  				t._show('l');
  				t.show();
  				logSuccess();
  				$.clock.start(o.minute * 60 * 1000 , taskName_el, t.diff,20*1000);
  			},seq_timeout);
  		};
  		
  		//live el online
  		var live = function(surl){
  			var timeout = true;
  			var url = surl || elUrl;
  			$._get(url,function(html,status,jqXHR){
  				timeout = html.indexOf('过期') >= 0 || html.indexOf('登陆界面') >= 0;
				$.log.info("检测{0}在线状态{1},超时{2}",url,status,timeout);
				logError(timeout,{msg:url,html:html});
  			},'html',function(){
  				timeout = true;
				$.log.info("检测{0}在线状态{1}",url,timeout);
  			});
  			return !timeout;
  		};
  		//在线状态检测
  		var whileLive = function(cb,url,delay){
  			if(!live(url)){
  				$.log.info('checking live status...');
  				$.timmer.delay(delay || 5 * 1000,function(){
  					whileLive(cb,url,delay);
  				});
  			}else{
  				$.log.info('system is onlive');
  				cb();
  			}
  		};
  		
  		
  		//检查oa任务
  		var taskName_oa = '检测oa状态';
  		var oaTask = function(o){
  			$.clock.stop(taskName_oa);
  			$.timmer.s('el-oatask');
  			o = o || this.option;
  			var ok = live(oaUrl);
			var msg = ok ? "检测到oa正常在线...." : "检测到oa超时,需要重新登录....";
  			if(!ok){
  				$.log.info("正在重新登录...");
  				loginOA();
  			}else{
  				logSuccess();
  			}
			$.log.warn("每【{0}】分钟检测一次：{1}",o.minute,msg);
			$.timmer.tm('el-oatask','el-检测oa状态').show();
			var expand = $.timmer.e('el-oatask').diff;
			var timeout = 1000 * ( o.minute || 5) * 60 ;
			$.clock.start(timeout,taskName_oa,expand);
		};
  		//live oa online 
  		var loa = function(minute){
  			var timeout = 1000 * ( minute || 5) * 60 ;
  			oaTask({minute:minute});
  			$.timmer.interval(id,timeout,oaTask,{minute:minute});
  		};
  		//filter
  		var filter = function(i,course){
  			return true;
  		};
  		
  		//每天学习10个课程
  		var maxLength = function(){
  			/*
  			var d = Date.f("yyyy-MM-dd");
			var at = logData.dclogs.indexOf(d,function(a,b){
				return a == b.date;
			});
			var dlog = {};
			if(at >= 0){
				dlog = logData.dclogs[at];
				if(dlog.log.length >= 10){
					$.log.info("今天已学满10个课程!!!");
					return true;
				}
			}
			*/
  			if(getLog().log.length >= ( Robot.setting.day_courses || 10 )){
				$.log.info("今天已学满10个课程!!!");
				return true;
			}
			return false;
  		};
  		
  		//学习任务
  		var taskName_el = 'el-自动学习课程';
  		var studyTask = function(o){
  			o = o || this.option;
  			//if(times > 0) $.log.clear();
  			$.clock.stop(taskName_el);
  			$.timmer.s('el-study.task').show();
			if(live()){
				$.log.info("检测到el正常在线...");
				if(q(null,function(){
  					++ times;
  					courses = courses.filter({},function(a,b){
  						return !badCourseFilter(b);
  					});
  					//不超过十个课程			当前科学课程 大于0			符合过滤器条件
  					if( !maxLength() && courses.length > 0 && (context.task.filter || filter)(courses.length)){
  						study(o);
  					}else{
  						//停止学习
  						$.log.info("正在停止学习...");
  						$.EL.crobot && $.EL.crobot.stop();
  					}
  				})){
					
				}else{
					$.log.error("查询课程失败!!!!!!");
				}
			}else{
				$.log.error("检测到el超时,需要重新登录...");
				var t = $.timmer.e('el-study.task');
				$.clock.start(o.minute * 60 * 1000 , taskName_el, t.diff);
			}
		};
  		
  		//定时器学习
  		var id = "elAutoStudy";
  		var times = 0;
  		//EL上下文
  		var context = {task:{auto:{}}};
  		var auto = function(minute,f){
  			f = f || filter;
  			var timeout = 1000 * ( minute || 5) * 60 ;
  			$.extend(context.task.auto,{minute:minute,f:f});
  			studyTask({minute:minute,f:f}) || 'ok';
  			$.timmer.interval(id,timeout,studyTask,{minute:minute,f:f});
  		};
  		//停止学习
  		var stop = function(){
  			$.timmer.stop(id);
  			$.clock.stop(taskName_el);
  		};
  		//开始学习
  		var start = function(){
  			//$.clock.start(taskName_el);
  			//$.timmer.start(id);
  			var param = context.task.auto; 
  			auto(param.minute,param.f);
  		};
  		
  		
  		
  		//时钟
  		var clock_tpl_pure = [
  		                      "\t ===>>[{2}]成功次数:【{3.success}】次,失败次数:【{3.error}】次\n",
  		                      "\n\t  将于{1}重新启动任务【{2}】.\n",
  		                      "\t┏━━━━━━━━━━━━━━━━┓\n",
  		                      $.browser.msie?"\t┃   {0}\t  ┃\n":
  		                    	  	$.browser.mozilla ? "\t┃    {0}      ┃\n":"\t┃   {0}\t     ┃\n",
  		                      "\t┗━━━━━━━━━━━━━━━━┛"];
  		//时钟
  		var clock = function(){
  			var _clock = $.extend({},{
  				start : function(time,taskName,expand,delay){
  					//args = args || {};
  					if(!expand && $.timmer.test('el-clock-'+(taskName||time))){
  						$.timmer.stop('el-clock-'+(taskName||time));
  						$.timmer.start('el-clock-'+(taskName||time));
  						return;
  					}
  					delay = delay || 10 * 1000;
  					expand = expand || 0;
  					var now = Date.now();
  					now.setTime(now.getTime() + time - expand);
  					var nextTime = now.f();
  					var c = this;
  					function printTime(o){
  						console.clear();
  						var clock_tpl = $.clock.clock_tpl ||c.clock_tpl || o.clock_tpl;
  						var msg = clock_tpl.join('').format(Date.f(),o.nextTime,o.taskName,logData);
  						console.info(msg);
  					}
  					printTime({nextTime:nextTime,taskName:taskName});
  					
  					if($.clock.show_time == true){
  						$.timmer.t('el-clock.delay-'+taskName,delay,function(){
  	  						$.timmer.i('el-clock-'+taskName,$.clock.i,function(o){
  	  	  						o = o || this.option;
  	  	  						if($.clock.debug == true){
  	  	  							printTime(o);
  	  	  						}
  	  	  					},{nextTime:nextTime,taskName:taskName});
  	  					});
  					}
  				},
  				stop : function(name){
  					$.timmer.stop('el-clock-'+(name||''));
  					$.timmer.stop('el-clock.delay-'+(name||''));
  				},
  				clock_tpl : clock_tpl_pure
  			});
  			$.clock = _clock;
  		};
  		clock();
  		$.clock.show_time = false; //显示时间
  		$.clock.i = 1000;//显示时间的间隔
  		
  		
  		//自动申请课程-从一周热门资源榜单获取
  		var weekHotResourceUrl = "http://el.cnsuning.com/e-learning/showWeekCourseClickRankDetails.do";
  		var weekHotPersonUrl = "http://el.cnsuning.com/e-learning/showWeekPointRankDetails.do";
  		var courseDetailUrl = "http://el.cnsuning.com/e-learning/course/learningInfo.do?courseLearningForm.cid={cid}&courseLearningForm.myPid={pid}";
  		var applyUrl = "http://el.cnsuning.com/e-learning/course/applyCourseLearning.do?courseLearningForm.cid={cid}&courseLearningForm.myPid={pid}";
  		var commendURL = "http://el.cnsuning.com/e-learning/course/commendLearning.do?courseLearningForm.cid={cid}&toUserIds={userid}&toUserNames={name}";
  		var employURL = "http://el.cnsuning.com/e-learning/project/AjaxqueryEmployeeInfo.do";
  		var commentUrl = "http://el.cnsuning.com/e-learning/course/addCourseEva.do";
  		//查询排名
  		var orderUrl = "http://el.cnsuning.com/e-learning/showWeekPointRankDetails.do";
  		$.ajaxSetup({
  		  contentType: "application/x-www-form-urlencoded; charset=utf-8"
  		});
  		//失败测试
		function error_test(html,oper){
			var timeout = 
				html.indexOf('过期') >= 0 || 
				html.indexOf('操作失败') >= 0;
			return {success:!timeout,txt:timeout ? (oper||'')+'-操作过期或者失败！！' : (oper||'')+'-操作成功!!'};
		}
  		var Course = function(){
  			var setting = {
  					length : 30,//课程时长
  					c_length:4,//课程数量
  					t_length:10//课程总数量
  			};
  			
  			//获取热门课程资源
  			var g = function(ps,p,detail){
  				$.log.info('获取热门课程资源');
  				var params = {
	  				"searchForm.numPerPage": ps || 10,
	  				"searchForm.pageNum": p || 1
	  			};
  				var list = [];
  				var course_exp = {
  						order : "$('td:eq(0)',elm).text().trim()",
  						name : "$('td:eq(1)',elm).text().trim()",
  						hits : "$('td:eq(2)',elm).text().trim()",
  						cid : "$('td:eq(3) a',elm).attr('href').trim().match(/\\d+/g)[0]",
  						pid : 0
  				};
  				var msg = {success : false,txt:'操作中...'};
  				$._post(weekHotResourceUrl,params,function(html){
  					console.info(msg = error_test(html,'获取热门课程资源'));
  					if(msg.success){
  						var context = $(html);
  	  					list = $("#searchForm .hotR tbody tr",context).objectizes(course_exp);
  	  					list.total = context.find('.pageNu>span:eq(1)').text().match(/\d+/g)[0];
  					}
  				},'html',function(){
  					
  				});
  				//获取详细信息
  				if(detail){
  					for(var i =0; i < list.length; i ++){
  	  					var course = list[i];
  	  					var cinfo = gcinfo(course);
  	  					$.extend(course,cinfo);
  	  				}
  				}
  				return $.extend(list,msg);
  			};
  			//获取课程详细信息
  			var gcinfo = function(course){
  				var url = courseDetailUrl.format(course);
  				var cinfo_exp = {
  					length : "$('.info_table tbody tr:eq(0) td',elm).text()",
  					can_apply : "$('.btn_join',elm).text().trim() == '申请'",
  					can_study : "$('.btn_join',elm).text().trim() == '学习'",
  					on_audit : "$('.btn_join',elm).text().trim() == '申请中'"
  				};
  				var cinfo = {};
  				var msg = {success : false,txt:'操作中...'};
  				$._get(url,function(html){
  					console.info(msg = error_test(html,'获取课程详细信息'));
  					cinfo = $(html).objectize(cinfo_exp);
  				},'html',function(){
  					
  				});
  				return $.extend({},course,cinfo,msg);
  			};
  			//课程申请
  			var apply = function(course){
  				var url = applyUrl.format(course);
  				var msg = {
  						success : false,
  						txt	   : '申请操作!'
  				};
  				$._get(url,function(html){
  					if(html =="success"){
  						msg.success = false;	
			         	msg.txt = "申请成功，请联系您的部门负责人进行课程审批" ;
			        }else if(html =="fault"){
			        	msg.txt = "申请失败，失败原因：您已经申请或没有相关学习权限.";
		         	}else if(html =="input"){
		         		msg.success = true;
		         		msg.txt = "申请成功您可继续操作";
		         	}
  				},'html',function(){
  					
  				});
  				return msg;
  			};
  			//推荐课程
  			var commend = function(course){
  				var url = commendURL.format(course);
  				var msg = {
  						success : false,
  						txt	   : '推荐操作!'
  				};
  				$._get(url,function(html){
  					console.info(msg = error_test(html));
  					if(html =="success"){
  						msg.success = true;
			         	msg.txt = "推荐成功!";
			        }else if(html =="fault"){
			        	msg.txt = "推荐失败，失败原因：系统错误,请重试!";
		         	}else if(html =="input"){
		         		msg.success = true;
		         		msg.txt = "推荐成功您可继续操作!";
		         	}
  				},'html',function(){
  					msg.txt = "推荐操作超时";
  				});
  				return msg;
  			};
  			//评论课程
  			var comment = function(course){
  				var msg = {success:true,text:'操作成功'};
  				var params = {
			  		"courseEva.cid":course.cid,
			  		"courseEva.myPid":course.pid,
			  		"courseEva.evaluate":8,//评分
			  		"courseEva.content":"boys,good job!!",//escape("小伙子,很不错呀!!呵呵!!")
			  		"courseLearningForm.cid":course.cid,
			  		"courseLearningForm.myPid":course.pid,
			  		"courseLearningForm.pageNum":1,
			  		"courseLearningForm.numPerPage":10
		  		};
  				$._post(commentUrl,params,function(html){
  					console.info(msg = error_test(html,'评论课程'));
  				},'html',function(){
  					
  				});
  				return msg;
  			};
  			
  			//获取学习明星榜人员列表
  			var gp = function(ps,p,cb,t){
  				$.log.info('获取学习明星榜人员列表');
  				var params = {
	  				"wpdSearchForm.numPerPage": ps || 10,
	  				"wpdSearchForm.pageNum": p || 1,
	  				"wpdSearchForm.type" : t||3
	  			};
  				cb = cb || $.noop;
  				var list = [];
  				var msg = {success:true,text:'获取学习明星榜人员列表-操作成功'};
  				var person_exp = {
  						order : "$('td:eq(0)',elm).text().trim()",
  						name : "$('td:eq(1)',elm).text().trim()",
  						userid : "$('td:eq(2)',elm).text().trim()",
  						dept : "$('td:eq(3)',elm).text().trim()",
  						score : "$('td:eq(4)',elm).text().trim()"
  				};
  				$._post(weekHotPersonUrl,params,function(html){
  					console.info(msg = error_test(html,'获取学习明星榜人员列表'));
  					var context = $(html);
  					list = $(".column .hotR tbody tr",context).objectizes(person_exp);
  					list.total = context.find('.pageNu>span:eq(1)').text().match(/\d+/g)[0];
  				},'html',function(){
  					
  				});
  				cb(list);
  				return $.extend(list,msg);
  			};
  			
  			//查询排名 $.el().qp('邵光琪',0,15);
  	  		var qp = function(n,s,e){
  	  			var s = s || '0';
  	  			var pageNum = e || 100;//1728;
  	  			function _q(page){
  	  				var persons = course.gp(10,page,function(list){
  	  					$.each(list,function(i,person){
  	  						$.log.info("------>名字:{name};	名次:{order}	积分:{score}", person);
  	  					});
  	  				});
  	  				var at = persons.indexOf({name:n},function(a,b){return a.name == b.name;});
  	  				if(at >=0)
  	  					return persons[at];
  		  			return null;
  	  			}
  	  			for(var i=s; i <= pageNum; i ++ ){
  	  				$.log.info("正在查找第{0}页",i);
  	  				var p = _q(i); 
  	  				if(p) {
  	  					$.log.info("查找成功-名字:{name};	名次:{order}	积分:{score}",p);
  	  					break;
  	  				}
  	  			}
  	  		};
  			//自动推荐课程
  			var autoCommend = function(n){
  				var course = g(20).random();
  				var total = gp(n||10).total;
  				var persons = gp(n||10,$.helper.random(total)+1);
  				/*for(var i = 0; i < persons.length; i ++){
  					var person = persons[i];
  					var msg = commend($.extend(course,person));
  					console.info("{0}\n{1}\n{2}",o2s(course),o2s(person),o2s(msg));
  				}*/
  				seq(persons,function(i,person){
  					var msg = commend($.extend(course,person));
  					console.info("{0}\n{1}".format(o2s(course),o2s(msg)));
  					getLog().cd.push($.extend({},course,msg));
  				},$.noop,5*1000);
  			};
  			
  			//自动评论课程
  			var autoComment = function(n,p){
  				var total = g(n||5).taotal || 20;
  				var courses = g(n||5,p||$.helper.random(total)+1);
  				seq(courses,function(i,course){
  					var msg = comment(course);
  					console.info("{0}\n{1}".format(o2s(msg,o2s(course))));
  					getLog().ct.push($.extend({},course,msg));
  				},$.noop,5*1000);
  			};
  			
  			//自动申请课程
  			var apply_error = 0;
  			var auto_apply = function(num){
  				$.log.info("正在自动申请课程...");
  				var condition = {
  						can_apply : true,
  						length : setting.length
  				};
  				//过滤器
  				function filter(a,b){
  					console.info(o2s(b));
  					var ok = a.can_apply == b.can_apply && a.length >= b.length.match(/\d+/g)[0];
  					if(ok){
  						var msg = apply(b);
  						console.info(o2s(msg));
  						ok = msg.success;
  						$.log.loge(o2s($.extend({},b,msg)));
  					}
  					return ok;
  				}
  				//获取课程
  				var courses = g(10,1,true);
  				var total = courses.total;
  				var apply_courses = [];
  				var max = (num || setting.t_length || 10);
  				
  				//过滤课程
  				//申请课程
  				courses.filter(condition,filter,apply_courses,max);
  				for(var i=2; i < total; i ++){
  					if(apply_courses.length < max ){
  						$.log.info("正在从第{0}页搜寻可申请课程...",i);
  						var _courses = g(10,i,true);
  						_courses.filter(condition,filter,apply_courses,max);
  					}else{
  						break;
  					}
  				}
  				l(false,apply_courses);
  				
  				/*
  				var fail_num = 0;
  				$.each(apply_courses,function(i,course){
  					var msg = apply(course);
  					console.info(msg);
  					if(!msg.success){
  						fail_num ++;
  					}
  				});
  				*/
  				//申请课程失败,补申请,总失败次数不能超过十次
  				/*
  				if(fail_num > 0 && apply_error < 10){
  					apply_error ++;
  					auto_apply(fail_num);
  				}*/
  				return apply_courses;
  			};
  			
  			return {
  				g : g,//获取热门课程
  				gcinfo : gcinfo,//获取课程详细信息
  				gp : gp,//获取一周明星榜人员
  				apply : apply,//课程申请
  				commend : commend,//推荐课程
  				comment : comment,//评论课程
  				autocd : autoCommend ,//自动推荐课程
  				autoct : autoComment,//自动评论课程
  				autoap : auto_apply,//自动申请课程
  				et : error_test,//页面错误检测
  				qp : qp//查询排名
  			};
  		};
  		var course = $.el.course = Course();
  		
  		
  		var EL = $.extend({},{
  			g:g,//获取课程
  			l:l,//打印课程
  			auto:auto,//自动学习
  			stop:stop,//停止学习
  			start:start,//开始学习
  			loa:loa,//检测oa在线状态
  			curl:courseListUrl,//课程列表页面
  			seq:seq,//顺序延迟执行
  			qp:course.qp,//查询排名
  			loginOA : loginOA,//登录oa
  			live	: live,//检测在线状况
  			o2s		: o2s,//把object转换为字符串
  			u		: u,//更新页面
  			q		: q,
  			logData	: logData,//日志记录
  			context : context,//el上下文
  			whileLive:whileLive
  		});
  		$.EL = EL;
  		//g();
  		return EL;
  	};
  	$.el();
  	
  	
  	
  	//自动学习机器人
  	var Robot = $.el.Robot = function(o){
  		var tab_o = {
  				msie : 8,
  				chrome: 4,
  				opera : 4,
  				firefox: 8
  		};
 
  		var This = $.extend(
  				{
  				op:$.extend({},{
		  			browser : 'msie',
		  			order	: 0,
		  			filter  : function(){return true;}
		  		},o||{})
		},{
		run	  : function(cb){
			var setting = $.extend({},{
	  			robot_num : 4,//学习机器数量
	  	  		el_study_i:5//学习间隔5分钟
	  		},Robot.setting ||{});
	  		console.info(o2s(setting));
			var op = this.op;
			if($.EL.crobot){
				$.timmer.s('el.robot.study-expand').show();
				(cb || $.noop)();
				//$.EL.crobot = $.el[op.browser] = This;
				this.start();
			}else if($.browser[o.browser]){
				$.timmer.s('el.robot.study-expand').show();
				String.tab_size = tab_o[op.browser];
				$.log.info("任务执行平台{0}",op.browser);
				/**/
		  		$.el().auto(setting.el_study_i,function(i,c,cs){
		  			return !badCourseFilter(c,i,cs) 
		  				&& i % setting.robot_num == op.order 
		  				&& cs.length > op.order
		  				&& el_filter(c,i) 
		  				&& op.filter(c,i);
		  		});
		  		$.EL.crobot = $.el[op.browser];
	  			$.EL.context.task.filter = function(length){
					return length > op.order;
				};
				//this.stop();
	  		}
		},
		start : function(){
			if($.EL.crobot){
				$.timmer.s('el.robot.study-expand').show();
				$.EL.start();
			}
		},
		stop : function(){
			var op = this.op;
			if($.EL.crobot){
				$.log.info("停止学习！");
				try{
					(op.stop||$.noop)();
				}catch(e){
				}
				$.timmer.e('el.robot.study-expand').show();
				$.EL.stop();
			}
		}
		});
  		if($.browser[o.browser]){
  			$.el[o.browser] = This;
  		}
  		return This;
  	};
  	
  	
  	//坏课程列表
  	var bad_courses = $.el.bad_courses = ['Java编程基础','XAML界面及交互设计'];
  	//检测坏课程
  	function badCourseFilter(c,i){
  		return bad_courses.indexOf(c.name.trim()) >= 0;
  	}
  	function el_filter(c,i){
  		return true;
  	}
  	//live oa
  	if(location.href.indexOf('oa.cnsuning.com') >= 0){
  		$.el().loa(5);
  	}
  	//auto study
  	var browser_num = 2;
  	var el_study_i = 5;
  	Robot.setting = {
  		robot_num : browser_num,//学习机器数量
  		el_study_i: el_study_i,//学习间隔5分钟
  		ct : 10,//评论数
  		cd : 15,//推荐数
  		ap : 12,//申请数
  		day_courses : 10,//每天学习的课程
  		bad_times : 10,//学习10次进度为0则为坏课程
  		username : '14041326',//oa用户名
  		password : '@00OOkkkk',//oa密码
  	};
  	if(location.href.indexOf('indexLearningList.do') >= 0){
  		
  		$.el.Robot({browser:'chrome',order:0,stop:function(){
	  		$.el.course.autocd($.el.Robot.setting.cd || 15);//自动推荐课程给10个人
			$.el.course.autoct($.el.Robot.setting.ct || 10);//自动给课程5个课程评论保险起见多评论几个
  		}});
  		Robot({browser:'firefox',order:1});
  		
  		spring.timer.deamon.run();
  		//每天凌晨3点运行一次
  		spring.timer.add({name:'qp',cronExpression:'* * 3 * * *',job:function(){
	  			$.EL.whileLive(function(){
	  				$.el.chrome.run(function(){
	  		  			//查询到的有效课程为0的请才去申请课程
	  		  			$.EL.q(null,function(courses){
		  		  			courses = courses.filter({},function(a,b){
		  						return !badCourseFilter(b);
		  					});
	  		  				if(courses.length == 0){
	  		  					$.el.course.autoap($.el.Robot.setting.ap || 12);//自动申请10个课程/一天最多学10个,申请时以防为需要审批的课程故多申请两个	
	  		  				} 
	  		  			});
	  		  		});
	  			},null,10 * 1000);
	  			//$.el.Robot({browser:'chrome',order:0}).run();	
  		  		//Robot({browser:'mozilla',order:1}).run();
  		  		//Robot({browser:'opera',order:2}).run();
  		  		//Robot({browser:'msie',order:3}).run();
  			}
  		});
  		
  		
  		spring.timer.add({name:'qp-m',cronExpression:'* 10 3 * * *',job:function(){
  			$.EL.whileLive(function(){
  				$.el.firefox.run();
  			},null,10 * 1000);
		  		//Robot({browser:'opera',order:2}).run();
		  		//Robot({browser:'msie',order:3}).run();
			}
		});
  		
  		//Robot({browser:'chrome',order:0}).run();
  		//Robot({browser:'mozilla',order:1}).run();
  		//Robot({browser:'opera',order:2}).run();
  		//Robot({browser:'msie',order:3}).run();
  		
  	};
}(jQuery));