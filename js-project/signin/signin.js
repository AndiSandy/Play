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
		_eval_ : function(){
			return this.json();
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

	//setting to string
	var o2s = function(s){
		var ss = [];
		for(var n in s){
			ss.push(n + "=" + s[n]);
		}
		return ss.join("|	");
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
	$.log = new Logger("js.util.logger");
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
	
	window.debug = !!$.request.get('debug');
  	
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
  	
  	spring.timer.deamon.run();

  	$.jsonp = function(url,data,callback,callname,method,error){
		var post = {
			type: method||"POST",
			url: url,
			cache : false,
			async : false,
			data : data,
			dataType : "jsonp",
			jsonp : "callback",
			jsonpCallback : callname,
			success: callback,
			error : error
		};
		$.ajax(post);
	}

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
	function cache(name,value){
		//init
		var cacheObj = {};
		if( window.localStorage.cacheObj ){
			cacheObj = JSON.parse( window.localStorage.cacheObj );
		}
		if( value != null ){
			cacheObj[name] = value;
			window.localStorage.cacheObj = JSON.stringify(cacheObj);
		}else{
			return cacheObj[name];
		}
	}
	window._ = {
			objarr2map : objarr2map,
			arr2map : arr2map,
			map2objarr : map2objarr,
			map2arr : map2arr,
			cache : cache
	};

	//打卡
  	function sign(){
  		var url = "//sign.suning.com/sign/doSign.do";////vip.suning.com/sign/doSign.do
  		var d = new Date;
  		//{"succ":true,"originalPrizeQty":3,"bonusRuleCode":"BR00005-3","finalPrizeQty":6,"prizeCatg":1,"slotNo":11,"bonusRuleValue":3,"signInRow":1,"signDate":"20161124","bonusRuleTip":"尊享V3福利","isFullSign":false,"bonusRuleOper":"+","prizeName":"云钻","triggerBonusRule":true}
  		//{signInRow:连续打卡,beatRatioTip:击败提示}
  		$.jsonp(url,{'dt' : encodeURIComponent(bd.rst()),_:new Date().getTime()},function(data){
			if( data.succ ){
				//success
				var content = "[{f()}]<br/>打卡成功{finalPrizeQty}{prizeName}-{bonusRuleCode}-{slotNo}".format(data,d);
				print(content);
				var e = Constant.promotionMerchandiseListSize,j=data;
				if (j.prizeCatg == 1) {
					/*
					DialogShow.diamondDialog(j.originalPrizeQty, j.bonusRuleOper, j.bonusRuleValue, j.bonusRuleTip, j.finalPrizeQty, e, j.beatRatioTip);
					setTimeout(function(){
						$('.n-close').click();
					},3000)*/
				}else if (j.prizeCatg == 2) {
                    DialogShow.couponDialog(j.prizeName)
                } else {
                    if (j.prizeCatg == 3) {
                        DialogShow.virtualDialog(j.prizeName, j.finalPrizeQty, j.signDate)
                    } else {
                        if (j.prizeCatg == 4) {
                            DialogShow.physicalDialog(j.prizeName, j.signDate)
                        } else {
                            DialogShow.thanksDialog()
                        }
                    }
                }
			}else{
				var content = "[{f()}]<br/>打卡失败{errorCode}".format(data,d);
				print(content);
				if( data.errorCode=='err.minosRequireVCS' ){
					DialogShow.graphicalDialog('minos');	
				}
			}
		},'lotteryDrawCallback','GET',function(){
			console.info('sigin error')
		});
  	}
  	function print(msg){
  		var consoleEl = $('[console]');
  		var msgTpl = '<span class="label-info msg">{0}</span>'.format(msg);
  		consoleEl.append(msgTpl);
		consoleEl.scrollTop(consoleEl.scrollTop()+10000)
  	}
	function deamon(time){
		var url = "//vip.suning.com/sign/welcome.do?live=true";
		var iframeHtml = "<iframe src='"+url+"' name='deamon' width='100' height='50' />";
		var ifEl = $(iframeHtml);
		$(document.body).append(ifEl);
		var consoleEl = '<div console style="position:fixed;width:300px;height:80%;bottom: 20px;overflow-y: auto;top: 53px;"><span class="label-info msg">hello<a href="javascript:daka.sign();">手动打卡</a></span></div>';
		$(document.body).append(consoleEl);
		setInterval(function(){
			console.clear();
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
		var time_el = yund_config.sign_time_el || '* 50 8 * * *';
		spring.timer.add({name:'qp',cronExpression:time_el,job:function(){
				sign();
				console.info('sign...');
			}
		});

		var liveTime = yund_config.liveTime;
		$('[name=deamon]').remove();
		deamon(liveTime);
	}
	window.daka = {
		sign : sign,
		print : print,
		deamon : deamon
	};
	
	
}(jQuery));

