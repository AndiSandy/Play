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
		
	
	$.extend(String.prototype,{
		format_dot_o : function(a,value){
			var expression = value.match(/([^\.]+)/g);//[0-9a-zA-Z_]
			var v = a[expression[0]];
			for(var i=1; i < expression.length; i ++){
				v = v && v[expression[i]];
			}
			return $.string.show(v);
		},
		format_o: function(o){
			var string = this;
			return this.replace(/\{([^}]+)\}/g,function(index,value){
				return string.format_dot_o(o,value);
			});
		},
		format_a: function(a){
			var string = this;
			return this.replace(/\{([^}]+)\}/g,function(index,value){
				return string.format_dot_o(a,value);
				//return  $.string.show(a[value]);	
			});
		},
		format	: function(){
			if(arguments.length > 0){
				var o = arguments[0];
				//console.debug('format');
				if($.isPlainObject(o)){//plain object
					//console.debug("//plain object");
					return this.format_o(o);
				}else if($.isArray(o)){//array
					//console.debug("//array");
					return this.format_a(o);
				}else{//arguments
					//console.debug("//arguments");
					var a = [].slice.apply(arguments, [0, arguments.length]);
					return this.format_a(a);
				}
			}else{
				return this;
			}
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
	
	//setting to string
	var o2s = function(s){
		var ss = [];
		for(var n in s){
			ss.push(n + "=" + s[n]);
		}
		return ss.join("|	");
	};
	
	/*-----------------------
	 * ÈÕÖ¾¶ÔÏó
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
	 * requestÇëÇó¶ÔÏó
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
	  	
  	
  	/*-----------------------
	 * ÈÕÆÚ¸ñÊ½»¯d.f("yyy-MM-dd hh:mm:ss:SS EEE")
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
  		weeks: {en:["Sunday","Monday","Thuesday","Wednesay","Tursday","Friday","Saturday"],zh:["ÐÇÆÚÌì","ÐÇÆÚÒ»","ÐÇÆÚ¶þ","ÐÇÆÚÈý","ÐÇÆÚËÄ","ÐÇÆÚÎå","ÐÇÆÚÁù"]},
  		lang : 'en',
  		rs : rs,
  		dateObj : {},
  		isInit : false,
  		needpad	: true,
  			/* ²é±í·¨(¹ý³ÌÊ½°æ±¾)  by aimingoo */
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
  	
  	//¶¨Ê±Æ÷
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
							$.log.info("ÈÎÎñÃû³Æ¡¾{name}\t\t¡¿¿ªÊ¼Ê±¼ä¡¾{start}¡¿".format(this));
						}
						break;
					case 'e':
						if(this.end){
							$.log.info("ÈÎÎñÃû³Æ¡¾{name}\t\t¡¿½áÊøÊ±¼ä¡¾{end}¡¿ÏûºÄ¡¾{diff}¡¿ºÁÃë".format(this));
						}
						break;
					case 'l':
						for(var i = 1; i < this.time_seq.length; i ++){
							var p = this.time_seq[i];
							$.log.info("ÈÎÎñÃû³Æ¡¾{name}-{piece}\t\t¡¿Ö´ÐÐÊ±¼ä¡¾{d}¡¿ÏûºÄ¡¾{diff}¡¿ºÁÃë".format($.extend({},this,p)));
						}
						break;
					case 't':
						if(this.time_seq.length > 1){
							var p00 = this.time_seq[this.time_seq.length -1];
							$.log.info("ÈÎÎñÃû³Æ¡¾{name}-{piece}\t\t¡¿Ö´ÐÐÊ±¼ä¡¾{d}¡¿ÏûºÄ¡¾{diff}¡¿ºÁÃë".format($.extend({},this,p00)));
						}
						break;	
					default :break;
				}
				
			}
	};
	timmer.idmap = {};
	timmer.fn = {
		//ÑÓ³Ù¶¨Ê±Æ÷	
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
		//¼ä¸ô¶¨Ê±Æ÷
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
		//¶¨Ê±Æ÷½áÊø
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
		//¶¨Ê±Æ÷¿ªÊ¼
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
		//ÁÐ³ö¶¨Ê±Æ÷
		l	: function(){
			console.info(">>===========================");
			var i = 0;
  			for(var name in timmer.idmap){
				$log.info(i+".	"+name);
				i++;
			}
  			console.info("<<===========================");
			
		},
		//¿ªÊ¼¼ÆÊ±
		s	: function(name){
			var d = new Date();
			var p0 = {piece:'start',d:d};
			var c = $.extend(this.clock_data[name]||{},{start:d.f(),name:name,time_seq:[p0]},clock_impl,{
				show : function(){this._show('s');}
			});
			this.clock_data[name] = c;
			return c;
		},
		//¼ÆÊ±
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
		//½áÊø¼ÆÊ±Æ÷
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
		//»ñÈ¡clock¶ÔÏó
		g	: function(name){
			var c = $.extend(this.clock_data[name],clock_impl,{
				show : function(){this._show('l');}
			});
			return c;
		},
		//²âÊÔÊÇ·ñ´æÔÚÖ¸¶¨Ãû³Æ¶ÔÏó
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
	
	//·Âspring¶¨Ê±Æ÷
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
		//ÊØ»¤½ø³Ì
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
				//¼àÊÓÆ÷	
				monitor : function(){
					var d = new Date;
					var tl = This.filter(d);
					if(tl.length ==0 && spring.debug){
						$.log.info("spring.timer noop");
					}
				},
				//¹ýÂË·ûºÏÌõ¼þµÄÈÎÎñ
				filter : function(d){
					var tl = [];
					for(var i = 0; i < task_list.length; i++){
						var task = task_list[i];
						//Ê±¼ä¹æÔò½âÎö
						//¹æÔòÅÐ¶Ï
						if(ruler.test(d,task)){
							tl.push(task);
							(new Thread).run(task.job);
						}
						//¶àÏß³ÌÖ´ÐÐ
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
		//Ê±¼ä¹ýÔò½âÎö
		var format = "ss mm hh dd MM yyyy EEE";
		var fs = ["ss","mm","hh","dd","MM","yyyy","EEE"];
		var Ruler = function(){
			// yyy-MM-dd hh:mm:ss:SS EEE
			// SS ss mm hh dd MM yyyy EEE
			//    ss mm hh dd MM yyyy EEE
			//    *  *  *  *  *  *    *
			//	,/-
			var i = {
				//²âÊÔÖ¸¶¨Ê±¼äºÍÊ±¼ä±í´ïÊ½ÊÇ·ñÎÇºÏ	
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
					if(ok){//ÔËÐÐ¼ÇÂ¼
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
				//²âÊÔÖ¸¶¨Ê±¼äÆ¬¶ÎºÍÊ±¼äÆ¬¶Î±í´ïÊ½ÊÇ·ñÎÇºÏ
				testFragment : function(o,s,sd){
					var es = s.split(',');
					var ok = false;
					for(var i = 0; i < es.length; i++){
						var ss = es[i];
						var b = false;
						if(/\/+/g.test(s)){// ÔöÁ¿Ö´ÐÐ /
							b = this.testStep(o, ss,sd);
						}else if(/\-+/g.test(s)){// ·¶Î§Ö´ÐÐ -
							b = this.testRange(o, ss);
						}else if(/\*+/g.test(s)){// ·¶Î§Ö´ÐÐ -
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


  	$.fn.jsonp = function(url,data,callback,callname){
		var post = {
			type: "POST",
			url: url,
			cache : false,
			async : false,
			data : data,
			dataType : "jsonp",
			jsonp : "callback",
			jsonpCallback : callname,
			success: callback
		};
		$.ajax(post);
	}

  	//打卡
  	function sign(){
  		var url = "http://vip.suning.com/sign/doSign.do";
  		$.jsonp(url,{'dt' : encodeURIComponent(bd.rst()) },function(data){
			if( data.succ ){
				//success
			}
		},'lotteryDrawCallback');
  	}

	//定时打卡
	spring.timer.add({name:'qp',cronExpression:'* * 8 * * *',job:function(){
			sign();
		}
	});

	//live守护不掉线
	$('[name=deamon]').remove();
	function deamon(){
		var url = "http://vip.suning.com/sign/welcome.do";
		var iframeHtml = "<iframe src='"+url+"' name='deamon' width='100' height='50' />";
		var ifEl = $(iframeHtml);
		$(document.body).append(ifEl);
		setInterval(function(){
			console.info('will living now!!!');
			ifEl[0].contentWindow.location.reload();
		},50000);
	}
	deamon();
}(jQuery));

