// JavaScript Document
//
//   █████▒█    ██  ▄████▄   ██ ▄█▀       ██████╗ ██╗   ██╗ ██████╗
// ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒        ██╔══██╗██║   ██║██╔════╝
// ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░        ██████╔╝██║   ██║██║  ███╗
// ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄        ██╔══██╗██║   ██║██║   ██║
// ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄       ██████╔╝╚██████╔╝╚██████╔╝
//  ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒       ╚═════╝  ╚═════╝  ╚═════╝
//  ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
//  ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
//           ░     ░ ░      ░  ░
//  
/**
 * 店铺基础脚本
 * 2015年3月12日17:55:41
 * 14041326
 * W	windows
 * D	document
 * $	jquery object
 * sn	suning context
 * S	shop object
 */
(function(){
	
	/*-------------base extend-----------------*/
	/**
	 * 拷贝数组
	 * @param a
	 * @returns
	 */
	Array.copy = function(a){
		var args = Array.prototype.slice.apply(arguments,[1]);
		return Array.prototype.slice.apply(a,args);
	};
	/**
	 * 定义包
	 */
	var pckg = function(){
		var packages = Array.copy(arguments,0);
		var pckgs = window;
		for(var pi = 0; pi < packages.length; pi++){
			var _package = packages[pi];
			var pnames = _package.match(/[^\.]+/g);
			for(var i = 0; i < pnames.length; i++){
				if(!pckgs[pnames[i]])
					pckgs[pnames[i]] = {};
				pckgs = pckgs[pnames[i]];
			}
		}
		return pckgs;
	};
	var define = function(packages, def, context) {
        var pckgs = context || window
          , pko = null;
        var pnames = packages.match(/[^\.]+/g);
        for (var i = 0; i < pnames.length; i++) {
            if (!pckgs[pnames[i]] && i < pnames.length -1 ) {
                pckgs[pnames[i]] = {};
            }
            if (i == pnames.length - 1) {
                if (typeof def == "object") {
                    var old = pckgs[pnames[i]];
                    pckgs[pnames[i]] = old == null ? def : $.extend(old||{}, def || {});
                } else {
                    pckgs[pnames[i]] = def;
                }
            }
            pckgs = pckgs[pnames[i]];
        }
        return def;
    };
	window.define = define;
	window.pckg = pckg;
	
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
			var search = decodeURIComponent(search || '');
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
	window.req = $.request.parameters;
	
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
  	window.coookie = $.icookie = $.cookie;
	
	/**
	 * 按键映射
	 * @example $key(e).when('enter',function(){console.info("enter")})
	 */
	window.$key = function(e){
		function k(e){
			this.e = e;
			var KeyMap = {
				"ctrl+enter":function(e){
					var is = e.ctrlKey && e.which == 10;
					return is;
				},
				"shit+enter":function(e){
					var is = e.shiftKey && e.which == 13;
					return is;
				},
				"enter":function(e){
					var enter = e.which == 13;
					return enter;
				},
				down : function(e){
					return e.keyCode == 40;
				},
				up : function(e){
					return e.keyCode == 38;
				},
				left : function(e){
					return e.keyCode == 37;
				},
				right : function(e){
					return e.keyCode == 39;
				},
				del : function(e){
					return e.keyCode == 46;
				}
			};
			var $k = this;
			$k.when = function(key,keyAction){
				var keyEvent = KeyMap[key];
				if(keyEvent && keyEvent(this.e)){
					keyAction.apply(this,[this.e]);
				}
				return this;
			};
		}
		return new k(e);
	};
	
	/**
	 * 微型模板引擎
	 * example :
	 * hello qq,lili,hh
	 * "hello {0},{1},{2}".format('qq','lili','hh') =="hello {0},{1},{2}".format(['qq','lili','hh']);
	 * "hello {w},{s},{name}".format({w:'qq',s:'lili',name:'hh'});
	 * "hello {0},{s},{name}".format({w:'qq',s:'lili',name:'hh'});
	 */
	//TODO 字符串格式化输出
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
		eachf : function(arr,callback){
			var segs = [];
			for(var i = 0; i < arr.length; i ++){
				var model = arr[i],html;
				if(callback){
					html = callback(model,i,arr);
				}
				model = arr[i];
				segs.push(this.format(model));
			}
			return segs.join('');
		},
		//去前后空格
		trim : function(){
			return this.replace(/^\s*|\s*$/img,'');
		},
		hex : function(){
			var hex_arr = [],string = this;
			for(var i =0; i < string.length; i ++){
				var char0 = string.charCodeAt(i),hex = (char0).toString(16);
				hex_arr.push(hex);
			}
			return hex_arr;
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
		},
		format_prop : function(mix,contexts){
			var propname = $.trim(this);
			var __const__ = {
				__break__ : 'PTYPE_BREAK',
				__continue__ : 'PTYPE_CONTINUE'
			};
			function error(desc){
				var d = new Date().toLocaleString();
				req['format.debug'] && console.warn('['+d+']','[error]','字符串格式化错误 ',desc.formata(Array.copy(arguments,1)));
			}
			function safe_check(code){
				var ban_regex = /document\.cookie/img;
				if(ban_regex.test(code)){
					throw new Error('unsafe code['+code+']');
				}
			}
			function __eval__(code,__context){
				try{
					safe_check(code);
					return function(){
						with(__context||window){
							return eval("("+(code)+")");
						}
					}.apply(__context||window);
				}catch(e){
					error('{0}eval处理异常-{1}',code,e);
				}
			}
			var prop_types = {
				'number-value' : {
					entry : true,
					match : /^\d+$/,
					exec : function(propname,matches,mix,self){
						var ret = __const__.__continue__;
						try{
							var arg_num = parseInt(propname);
							ret = mix['arg'+arg_num];
						}catch(e){
							error('{1}处理{0}异常-{2}',propname,self.ptype_name,e);
						}
						return ret;
					}
				},
				'function' : {
					entry : true,
					match : /^([^\(]+)\(([^\)]*)\)/,
					route : 'expr-eval'
				},
				'value' :{
					entry : true,
					match : /^[^\(\=\)]+$/,
					route : {
						'const-value' : /^("|')([^"']+)("|')$/,
						'dot-value' : /[\.]+/,
						'arr-value' : /([^\[\]]+)\[([^\]]+)\]/,
						'no-dot-value' : /^[a-zA-Z\$_]+[\w$]*$/,
						'unkown-expr-value' : 'expr-eval'
					}
				},
				'const-value' : {
					exec : function(propname,matches,mix,self){
						return matches[2];
					}
				},
				'arr-value' : {
					exec : function(propname,matches,mix,self){
						var v1 = matches[1],v2=matches[2];
						var v = mix[v1] || {};
						return v[v2];
					}
				},
				'dot-value' : {
					regex_name : /([^\.]+)/g,
					exec : function(propname,matches,mix,self){
						var ret = __const__.__continue__;
						function dot_value(propname,context){
							var props = propname.match(self.regex_name);
							var value = context[props[0]];
							for(var i=1; i < props.length; i ++){
								value = value!=null ? value[props[i]] : null ;
							}
							return value;
						}
						try{
							ret = dot_value(propname,mix);
							ret = ret == null ? __eval__(propname,mix) : ret ; 
						}catch(e){
							error('{1}处理{0}异常-{2}',propname,self.ptype_name,e);
						}
						return ret;
					}
				},
				'no-dot-value' : {
					exec : function(propname,matches,mix,self){
						var ret = __const__.__continue__;
						try{
							ret = mix[propname];
							ret = ret == null ? window[propname] : ret ; 
						}catch(e){
							error('{1}处理{0}异常-{2}',propname,self.ptype_name,e);
						}
						return ret;
					}
				},
				'expr' : {
					entry : true,
					match : /[\+\-\*\/\%\=\>\<\?\:\(\)]+/,
					route : {
						'unkown-expr' : 'expr-eval'
					}
				},
				'expr-eval' : {
					exec : function(propname,matches,mix,self){
						var ret = __const__.__continue__;
						try{
							ret = __eval__(propname,mix);
						}catch(e){
							error('{1}处理{0}异常-{2}',propname,self.ptype_name,e);
						}
						return ret;
					}
				},
				__route2__ : function(ptype_name,propname,mix,route_matched){
					try{
						var ptype = prop_types[ptype_name],ptype_matched;
						var matches = ptype.__match__(propname,mix);
						//no matched
						if( !matches.is_match ) return matches;
						//route
						var route_matches = ptype.__route__(propname,matches.matched,mix);
						if( route_matches.route_matched ){
							ptype_matched = $.extend(matches,route_matches);
						}else{
							var pexec = ptype.__exec__(propname,route_matched||matches.matched,mix);
							//matched
							ptype_matched = $.extend(matches,pexec);
						}
						req['format.debug'] && console.info(ptype_name,propname,ptype_matched.pvalue);
						return ptype_matched;
					}catch(e){
						error('ptypes-route2-{0}-处理{1}异常-{2}',ptype_name,propname,e);
						throw e;
					}
				}
			};
			//匹配
			function ptype_match(propname,mix){
				var ptype = this,ptype_name=ptype.name;
				var matches = null;
				if( $.isRegex(ptype.match) ){//regex
					matches = propname.match(ptype.match);
				}else if($.isFunction(ptype.match)){//match function
					if( $.isRegex(ptype.regex) ){
						var re_matches = propname.match(ptype.regex);
						if( re_matches != null ){
							matches = ptype.match(propname,ptype,re_matches,mix);
						}
					}else{
						matches = ptype.match(propname,ptype,mix);
					}
				}else{
					matches = true;
				}
				return {
					is_match : ptype.match == null || !(matches == null || matches === false),
					matched : matches
				};
			}
			//路由
			function ptype_route(propname,matches,mix){
				var ptype = this,ptype_name=ptype.name,next_route=null,route_ret,route_matched;
				if( ptype.route == null ){
					return {
						route_matched : false
					};
				}
				if( $.isFunction(ptype.route) ){
					next_route = ptype.route(propname,matches,mix);
				}else if( $.isPlainObject(ptype.route) ){
					for(var route_name in ptype.route ){
						var route_obj = ptype.route[route_name];
						if( $.isRegex(route_obj) ){
							var regex = route_obj;
							route_matched = propname.match(regex);
							if( route_matched ){
								next_route = route_name;
								break;
							}
						}else if( $.isFunction(route_obj) ){
							var route_fun = route_obj;
							route_matched = route_fun.apply(ptype,[propname,matches,mix]);
							if( route_matched ){
								next_route = route_name;
								break;
							}
						}else if( typeof route_obj == 'string' ){
							next_route = route_obj;
							window.debug && console.info(ptype_name+'->'+route_name,propname);
							break;
						}
					}
				}else if( typeof ptype.route == 'string' ){
					next_route = ptype.route;
				}else{
					error('route-{1}处理{0}无匹配路由',propname,ptype_name);
				}
				if( next_route != null && prop_types[next_route] ){
					route_ret = prop_types.__route2__(next_route,propname,mix,route_matched);
				}
				return $.extend({
					route_matched : next_route != null && route_ret != null
				},route_ret||{});
			}
			//执行
			function ptype_exec(propname,matches,mix){
				var ptype = this;
				if( !$.isFunction(ptype.exec) ){
					return {is_continue : true};
				}
				var pexec = ptype.exec(propname,matches,mix,ptype);
				var is_continue = pexec === __const__.__continue__;
				var is_break = pexec === __const__.__break__;
				return {
					is_continue : is_continue,
					is_break : is_break,
					is_success : !(is_continue || is_break),
					pvalue : pexec
				};
			}
			//初始化
			function init_ptypes(){
				for(var ptype_name in prop_types){
					var ptype = prop_types[ptype_name];
					$.extend(ptype,{
						name : ptype_name,
						__match__ : ptype_match,
						__exec__ : ptype_exec,
						__route__ : ptype_route
					});
				}
			}
			init_ptypes();
			var pvalue = null;
			for(var ptype_name in prop_types){
				var ptype = prop_types[ptype_name];
				if( ptype.entry === true ){
					var matches = prop_types.__route2__(ptype_name,propname,mix);
					//no matched
					if( !matches.is_match ) continue;
					//matched
					if( matches.is_continue ){
						continue;
					}else if( matches.is_break ){
						break;
					}else{
						pvalue = matches.pvalue;
						break;
					}
				}
			}
			return pvalue;
		},
		format:function(){
			var contexts = Array.copy(arguments);
			var arg0 = contexts[0],string = this;
			if( contexts.length == 1 && $.isArray(arg0) ){
				contexts = arg0;
			}
			var mix={};
			mix.length = contexts.length;
			$.mix(contexts,mix);
			var string_formated =   string.replace(/\{([^\{\}]+)\}/g,function(expr,prop,at,contextstring){
				var value = prop.format_prop(mix);
				value = value == null ? expr : value;
				return value;
			});
			window.debug && console.info('string_formated',string_formated);
			return string_formated;
		},
		formata:function(){
			var contexts = Array.copy(arguments);
			var arg0 = contexts[0],string = this;
			if( contexts.length == 1 && $.isArray(arg0) ){
				contexts = arg0;
			}
			var string_formated =  string.replace(/\{([^\{\}]+)\}/g,function(expr,prop,at,contextstring){
				var value = contexts[prop];
				value = value == null ? expr : value;
				return value;
			});
			return string_formated;
		}
	});
	
	//补码技术
	define("String.prototype.pad_code",function (len){
		var zero18 = '000000000000000000';
		var code = this || zero18;
		var clen = code.length;
		if( clen > len ){
			code = code.substring(0,len);
		}else if( clen < len ){
			code = zero18.substring(0,len-clen) + code;
		}
		return code;
	});
	//去码技术
	define("String.prototype.sub_code",function (){
		 var productcode=this || '';
	     if(""!=productcode){
	     var pcodeLen=productcode.length;
	     for(var idx=0;idx<pcodeLen;idx++){
	     if("0"!=productcode.charAt(0)){
	     break;
	     }
	     productcode=productcode.substring(1);
	     }
	     }
	     return productcode;
	});
	
	//TODO 元素输出模板
	//数据格式化
	$.fn.format = function(){
		var args = Array.copy(arguments);
		args = args.length == 1 && $.isArray(args[0]) ? args[0] : args;
		$(this).each(function(i,el){
			var istext = el.nodeType === 3;
			var tpl = $(el).data('format-tpl') || ( istext ? $(el).text() : $(el).html());
			tpl && $(el).data('format-tpl',tpl);
			var content = tpl.format.apply(tpl,args);
			tpl && ( istext ? $(el).txt(content) : $(el).html(content) );
		});
		return $(this);
	};
	//获取outHtml
	$.fn.ohtml = function(html){
		if( html ){
			var item = $(html);
			$(this).replaceWith(item);
			return item;
		}else{
			var copy = $('<div></div>');
			$(this).clone().appendTo(copy);
			var content = copy.html();
			copy.remove();
			return content;
		}
	};
	//注释掉元素本身
	$.fn.comment = function(){
		var html = $(this).ohtml();
		html = '<!-- '+html+' -->';
		$(this).ohtml(html);
	};
	//向下遍历最近的子元素
	$.fn.childest = function(el){
		function search(elm,el){
			var elms = $();
			if( elm.find(el).size() > 0 ){
				var children = elm.children();
				var target_children = children.filter(el);
				$.merge(elms,target_children.toArray());
				children.not(target_children).each(function(i,celm){
					var ochildren = search($(celm),el);
					$.merge(elms,ochildren.toArray());
				});
			} 
			return elms;
		}
		return search($(this),el);
	};
	//获取文本节点
	$.fn.texts = function(){
		return $(this).contents().filter(function() {
		    return this.nodeType === 3;
		});
	};
	$.fn.txt = function(txt){
		var elm = this[0];
		var istext = elm.nodeType === 3;
		txt && istext && (elm.nodeValue = txt);
		return txt ? $(this) : istext ? elm.nodeValue : $(this).text();
	};
	$.expr[':'].parents = function(elm,index,m,all){
		return m && m[3] && $(elm).parents(m[3]).size() > 0 ;
	};
	//混合
	$.mix = function mix(contexts,mixed_context){
		for(var i = contexts.length -1 ; i >= 0 ; i --){
			var context = contexts[i];
			context = contexts[i] == null ? {} : context ;
			if( typeof context == 'object' ){
				$.extend(mixed_context,context);
			}else{
				mixed_context['arg'+i] = context;
			}
		}
		return mixed_context;
	};
	//是否为正则表达式
	$.isRegex = function(regex){
		return regex instanceof RegExp;
	};
	/**
	 * 元素输出
	 */
	$.fn.elmout = function(){
		var contexts = Array.copy(arguments),arg_len=arguments.length;
		//混合上下文
		var mixed_context = {};
		function mix(contexts,mixed_context){
			for(var i = contexts.length -1 ; i >= 0 ; i --){
				var context = contexts[i];
				context = contexts[i] == null ? {} : context ;
				if( typeof context == 'object' ){
					$.extend(mixed_context,context);
				}else{
					mixed_content['arg'+i] = context;
				}
			}
			return mixed_context;
		}
		mix(contexts,mixed_context);
		//标签配置
		var tag_config = {
			'e-if' : function(elm,no){
				//if
				var parent = $(elm).parents('[e-each]');
				var scope = mixed_context;
				if( parent.length>0 ){
					if( parent.is('[e-id*="e-each"]') ){
						scope = $.extend({},scope,parent.data('scope')||{});
					}else{
						return;
					}
				}
				var expr = $(elm).attr('e-if')||'';
				var scope = mixed_context;
				scope = $.extend({},scope,parent_scope(elm));
				if( expr.format_prop(scope) ){
					$(elm).attr('e-id',eid('e-if',no)).data('scope',scope);
					if(!$(elm).is('[e-each]')){
						if(start(elm)){
							$(elm).texts().format(contexts);
						}else{
							$(elm).format(contexts);
						}
					}
				}else{
					$(elm).comment();
				}
			},
			'e-each' : function(elm,no){
				function each_do(el,scope,scope_name){
					var before = $(el),inner = $(el).is('[inner]'),html= inner ? $(el).html():$(el).ohtml(); 
					var length = scope.length;
					inner && before.empty();
					for( var i = 0; i < scope.length; i ++ ){
						var item_scope={},item_value=scope[i];
						if( $.isPlainObject(item_value) ){
							$.extend(item_scope,item_value);
						}
						item_scope[scope_name] = item_value;
						item_scope[scope_name+'_index'] = i;
						item_scope[scope_name+'_length'] = length;
						var item_html = html.format(item_scope,parent_scope(item),mixed_context);
						var item = $(item_html);
						if(inner){
							$(before).append(item);
						}else{
							$(before).after(item);
							before = item;
						}
						var $eid = eid('e-each-'+scope_name,no+'-'+i);
						item_scope.$eid = $eid;
						item.data('scope',item_scope).attr('e-id',$eid);
						start(item);
					}
					!inner && $(el).comment();
					return elms;
				}
				//分组
				function group(el,scope,scope_name){
					var before = $(el),group=before.attr('group'),groupi=parseInt(group)||0,html=before.ohtml();
					if(groupi>0&&scope.length>0){
						var scope_arrs = scope.split(groupi);
						for(var i=0;i<scope_arrs.length;i++){
							var scope_arr = scope_arrs[i];
							var item = $(html);
							$(before).after(item);
							var $eid = eid('e-group-'+scope_name,no+'-'+i);
							item.attr('e-id',$eid);
							each_do(item,scope_arr,scope_name);
							before = item;
						}
						$(el).comment();
					}else{
						each_do(el,scope,scope_name);
					}
				}
				var scope_name = $.trim($(elm).attr('e-each')||''),scope={},data_scope_name;
				var matches = scope_name.match(/^(\S+)\s+as\s+(\S+)$/);
				if( matches ){
					data_scope_name = matches[1];
					scope_name = matches[2];
				}else{
					data_scope_name = scope_name;
				}
				scope = resolve_scope(data_scope_name);
				var elms = group(elm,scope,scope_name);
			},
			'e-out' : function(elm,no){
				var scope_name = $(elm).attr('e-out');
				var scope = resolve_scope(scope_name);
				scope_name && $(elm).html(scope);
				!scope_name && $(elm).format(contexts);
				//.attr('e-id',eid('e-out',no));
			},
			'e-on':function(elm,no,prop){
				var scope = parent_scope(elm);
				var onAction=$(elm).attrs('on-click','on-class','on-else-click','on-else-class');
				var if_true = prop && prop.format_prop($.extend({},scope,mixed_context));
				if( if_true ){
					//on-class
					if( onAction['on-class']){
						$(elm).addClass(onAction['on-class']);
					}
					//on-click
					if( onAction['on-click']){
						$(elm).off('click.on.click').on('click.on.click',function(){
							onAction['on-click'].format_prop($.extend({},scope,mixed_context));
						});
					}
				}else{
					//on-else-class
					if( onAction['on-else-class']){
						$(elm).addClass(onAction['on-else-class']);
					}
					//on-click
					if( onAction['on-else-click']){
						$(elm).off('click.on.click').on('click.on.click',function(){
							onAction['on-else-click'].format_prop($.extend({},scope,mixed_context));
						});
					}
				}
				//on-show
				if( $(elm).is('[on-show]') ){
					if( if_true ){
						$(elm).show();
					}else{
						$(elm).hide();
					}
				}
				if( $(elm).is('[on-else-show]') ){
					if( !if_true ){
						$(elm).show();
					}else{
						$(elm).hide();
					}
				}
				if( !$(elm).is('[e-id*="e-each"]') ){
					start(elm);
				}
			},
			'e-show' : function(elm,no,prop){
				var scope = parent_scope(elm);
				if( prop && prop.format_prop($.extend({},scope,mixed_context)) ){
					$(elm).show();
					start(elm);
				}else{
					$(elm).hide();
				}
			},
			'e-click' : function(elm,no){
				var scope = parent_scope(elm),clickFunName=$(elm).attr('e-click');
				$(elm).off('click.eclick').on('click.eclick',function(){
					clickFunName && clickFunName.format_prop($.extend({},scope,mixed_context));
				});
			},
			'e-bind' : function(elm,no,prop){
				var scope = parent_scope(elm);
				if(prop){
					$(elm).off('keyup.e-bind').on('keyup.e-bind',function(){
						scope[prop] = $(this).val();
					});
				}
			}
		};
		function eid(scope_name,no){
			return scope_name + '-'+new Date().getTime() + '-' + (no||0);
		}
		//标签列表el
		function list_tags(){
			var tag_els = [];
			for(var tag in tag_config ){
				if( tag != 'tags' ){
					tag_els.push('['+tag+']');
				}
			}
			return tag_els;
		}
		//父作用域
		function parent_scope(elm){
			var ptag = $($(elm).filter('[e-id*="e-each"]')[0]||$(elm).parents('[e-id],[e-root]')[0]);
			var pscope = ptag[0] ? ptag.eq(0).data('scope') || {} : {};
			return pscope;
		}
		//作用域解析
		function resolve_scope(scope_name){
			var scope = null;
			if( typeof scope_name == 'string' ){
				for(var i = 0; i < contexts.length; i ++){
					var context = contexts[i] || {};
					scope = context[scope_name];
					if( scope != null ){
						break;
					}
				}
			}
			return scope == null ? contexts[0] : scope;
		}
		//标签解析
		function resolve_tag(tags){
			var tags_el_arr = list_tags();
			for(var i = 0; i < tags_el_arr.length; i ++ ){
				var the_tag_el = tags_el_arr[i],the_tag_name = the_tag_el.unwrap();
				var the_tags = tags.filter(the_tag_el);
				if( the_tags.length > 0 ){
					the_tags.each(function(i,tag_elm){
						tag_config[the_tag_name](tag_elm,i,$(tag_elm).attr(the_tag_name));
					});
				}
			}
		}
		//解析each标签
		function resolve_each_tag(tag_elm){
			var tags_el_arr = list_tags().$remove('[e-each]');
			for(var i = 0; i < tags_el_arr.length; i ++ ){
				var the_tag_el = tags_el_arr[i],the_tag_name = the_tag_el.unwrap();
				if( tag_elm.is(the_tag_el) ){
					tag_config[the_tag_name](tag_elm,i,$(tag_elm).attr(the_tag_name));
				}
			}
		}
		//开始解析
		function start(context){
			var tags_el = list_tags().join(',');
			var tag_elms = $(context).childest(tags_el);
			var has_tag = tag_elms.length > 0;
			if($(context).is('[e-id*="e-each"]')){
				resolve_each_tag(context);
			}
			if( has_tag ){
				resolve_tag(tag_elms);
			}else if( !$(context).is('[e-id]') ){
				$(context).format(contexts);
			}
			return has_tag;
		}
		//准备
		function ready(context){
			var load_el = $(context).attr('loading');
			if( load_el && !$(context).data('loaded') ){
				$(load_el).show();
				$(context).hide();
			}
			var copy = $(context).data('copy');
			if( copy ){
				$(context).html(copy);
			}else{
				copy = $(context).html();
				$(context).data('copy',copy);
			}
			var scope = $(context).data('scope');
			if( arg_len == 0 && scope ){
				mixed_context = scope;
			}
			$(context).data('scope',mixed_context).attr('e-root','root');
		}
		function over(context){
			var load_el = $(context).attr('loading');
			if( load_el && !$(context).data('loaded') ){
				$(load_el).hide();
				$(context).show().data('loaded',true);
			}
		}
		ready(this);
		start(this);
		over(this);
		return $(this);
	};
	//TODO 基础扩展
	//数据范围解析
	Number.range = function(roption){
		var range_arr = [],range_rule_re = /^([\(\[])+([^\)\]]+)([\)\]]+)$/i;
		var range_char_funcs = {
			'[]' : function(n,start,end){
				return end == null ? n == start : n >= start && n <= end;
			},
			'()' : function(n,start,end){
				return end == null ? n == start : n > start && n < end;
			},
			'[)' : function(n,start,end){
				return end == null ? n >= start : n >= start && n < end;
			},
			'(]' : function(n,start,end){
				return end == null ? n <= start : n > start && n <= end;
			}
		};
		function parse(range_rule,in_range_value){
			var range_rule_match = range_rule.match(range_rule_re);
			if( !range_rule_match ) return;
			var rrm_length = range_rule_match.length;
			if( rrm_length == 4 ){
				var start_char = range_rule_match[1],range_value = range_rule_match[2],end_char = range_rule_match[3];
				var range_char_func = range_char_funcs[start_char+end_char];
				if(range_char_func){
					return {
						range_value : in_range_value,
						range_values : range_value.split(','),
						range_func : range_char_func,
						exec : function(n){
							var in_range = this.range_func.apply(this,[n].concat(this.range_values));
							return in_range ? this.range_value : null;
						}
					};
				}
			}
		}
		for( var r in roption ){
			var rv = roption[r];
			var range_obj = parse(r,rv);
			range_obj && range_arr.push(range_obj);
		}
		return {
			range_arr : range_arr,
			range : function(n){
				var rv = null;
				for(var i= 0; i< this.range_arr.length; i++ ){
					var range_obj = this.range_arr[i];
					rv = range_obj.exec(n);
					if( rv != null ){
						break;
					}
				}
				return rv;
			}
		};
	};
	Number.prototype.pad0 = String.prototype.pad0 = function(len){
		var z18 = '000000000000000000',max=z18.length,snum=(this).toString(),clen=snum.length;
		return clen > len ? snum.substring(0,len) : z18.substring(0,len-clen)+snum; 
	};
	Number.prototype.add = function(num){
		return this + num; 
	};
	//数组延迟执行
	Number.prototype.each_delay = function(func,delay,over,auto){
		var start = 0,self,end = self = this,auto = auto == null ? false : auto;
		var delay_is_func = typeof delay == 'function';
		self.i = start,self.tid = 0;
		self.next = function next(){
			this.exec();
        };
		self.exec = function exec(){
			var self = this;
			if( self.i < end ){
				var delay_i = delay_is_func ? delay(self.i) : delay;
				delay_i = delay_i == null ? 1000 : delay_i;
				if( delay_i > 0 ){
					self.tid = setTimeout(function(){
						func(self.i++,self);
						auto && self.next();
					}, delay_i );
				}else{
					func(self.i++,self);
				}
			}else{
				clearTimeout(self.tid);
				over && over(self);
			}
		};
		self.cancel = function(){
			clearTimeout(self.tid);
		};
		self.exec();
		return self;
	};
	Date.weeks = {en:["Sunday","Monday","Thuesday","Wednesay","Tursday","Friday","Saturday"],zh:["星期天","星期一","星期二","星期三","星期四","星期五","星期六"]};
	Date.now = function(){return new Date();};
	Date.prototype.format = function(frmt){
		frmt = frmt || 'yyyy-MM-dd hh:mm:ss.SSS';
		var self = this;
		var frmt_funcs = {
			'y' : function(expr){var y = self.getYear(); y = y < 1900 ? 1900 + y : y;return y.pad0(expr.length);},
			'M' : function(expr){return self.getMonth().add(1).pad0(expr.length);},
			'd' : function(expr){return self.getDate().pad0(expr.length);},
			'h' : function(expr){return self.getHours().pad0(expr.length);},
			'm' : function(expr){return self.getMinutes().pad0(expr.length);},
			's' : function(expr){return self.getSeconds().pad0(expr.length);},
			'S' : function(expr){return self.getMilliseconds().pad0(expr.length);},
			'E' : function(expr){return Date.weeks.zh[self.getDay()].pad0(expr.length);}
		};
		return frmt.replace(/(y+|M+|d+|h+|m+|s+|S+|E+)/g,function(expr1,expr2,at,string){
			//console.info(expr1,expr2);
			var frmt_func = frmt_funcs[expr1[0]];
			var frmt_val = frmt_func ? frmt_func.apply(self,[expr1]) : expr1;
			return frmt_val == null ? expr1 : frmt_val ;
		});
	};
	Date.parse = function(date,frmt){
		frmt = frmt || 'yyyy-MM-dd hh:mm:ss.SSS';
		var self=new Date();
		var s_frmt_funcs = {
			'y' : function(v){v=v<1900?v+1900:v;return self.setYear(v);},
			'M' : function(v){return self.setMonth(v-1);},
			'd' : function(v){return self.setDate(v);},
			'h' : function(v){return self.setHours(v);},
			'm' : function(v){return self.setMinutes(v);},
			's' : function(v){return self.setSeconds(v);},
			'S' : function(v){return self.setMilliseconds(v);},
			'E' : function(v){return self.setDay(v);}
		};
		frmt.replace(/(y+|M+|d+|h+|m+|s+|S+|E+)/g,function(expr1,expr2,at,string){
			var v = date.substr(at,expr2.length),v=parseInt(v)||0;
			//console.info(expr2,v);
			var s_frmt_func = s_frmt_funcs[expr1[0]];
			s_frmt_func ? s_frmt_func.apply(self,[v]):'';
			return expr1;
		});
		return self;
	};
	define('Date.prototype',{
		eq : function(d1){
			var d = this;
			return d.getTime() == d1.getTime();
		},
		gt : function(d1){
			var d = this;
			return d.getTime() > d1.getTime();
		},
		gte : function(d1){
			var d = this;
			return d.getTime() >= d1.getTime();
		},
		lt : function(d1){
			var d = this;
			return d.getTime() < d1.getTime();
		},
		lte : function(d1){
			var d = this;
			return d.getTime() <= d1.getTime();
		}
	});
	String.prototype.date2str = function(format2,format1){
		return Date.parse(this,format1).format(format2); 
	};
	//数组拷贝
	Array.prototype.copy = function(){
		var newArray = [];
		for(var i=0;i<this.length;i++){
			newArray.push(this[i]);
		}
		return newArray;
	};
	//数组转map
	Array.prototype.tomap = function(key,value){
		var map = {};
		for(var i=0; i < this.length; i ++){
			var o = this[i];
			var prop = o[key] || o;
			if(value){
				o = o[value];
			}
			map[ prop ] = o;
		}
		return map;
	};
	//数组分组
	Array.prototype.split = function(num){
		var arrs = [];
		var me = this;
		var len = me.length;
		if( len > 0 ){
			var group = parseInt(len / num);
			var left = len % num;
			group = left > 0 ? group + 1 : group;
			for( var i = 0; i < group; i ++){
				var start = i * num,end = (i+1) * num;
				var arr = me.slice(start,end);
				arrs.push(arr);
			}
		}else{
			arrs.push(this);
		}
		return arrs;
	};
	Array.prototype.$search = function(obj,filter){
		var elm = null;
		for(var i=0;i<this.length;i++){
			var o = this[i];
			if(filter){
				if(filter(o,obj)){
					elm = o;
					break;
				}
			}else if( obj == o ){
				elm = o;
				break;
			}
		}
		return elm;
	};
	Array.prototype.$indexOf = function(obj,filter){
		var at = -1;
		for(var i=0;i<this.length;i++){
			if(filter){
				if(filter(this[i],obj)){
					at = i;
				}
			}else if( obj == this[i] ){
				at = i;
			}
		}
		return at;
	};
	Array.prototype.$remove = function(obj,filter){
		var at = this.$indexOf(obj,filter);
		if(at>=0){
			this.splice(at,1);
		}
		return this;
	};
	Array.prototype.$clear = function(){
		this.length = 0;
		return this;
	};
	Array.prototype.push_all = function(arr){
		var len = arr.length;
		if( len != null ){
			this.push.apply(this,arr);
		}else{
			this.push(arr);
		}
		return this;
	};
	//数组延迟执行
	Array.prototype.each_delay = function(func,delay,over){ 
	     var start = 0,self = this,end=self.length; 
	     var delay_is_func = typeof delay == 'function';
	     self.i = start,self.tid = 0;
	     self.next = function next(){
	    	 this.exec();
	     };
	     self.exec = function exec(){
	    	 var self = this;
	    	 if( self.i < end ){
	    		 var delay_i = delay_is_func ? delay(self.i) : delay;
	    		 delay_i = delay_i == null ? 1000 : delay_i;
	    		 if( delay_i > 0 ){
	    			 self.tid = setTimeout(function(){
						func(self.i,self[self.i],self);
						self.i++;
						self.next();
	    			 }, delay_i );
	    		 }else{
	    			 func(self.i,self[self.i++],self);
	    		 }
	    	 }else{
	    		 clearTimeout(self.tid);
	    		 over && over(self);
	    	 }
	     };
	     self.cancel = function(){
	    	 clearTimeout(self.tid);
	     };
	     self.exec();
	     return self;
	};
	//map 2 array
	window.map2array = function(me,b,props){
		var arr = [];
		if( props ){
			for(var i=0;i<props.length;i++){
				var prop = props[i];
				var value = me[prop];
				if( value ){
					if( b ){
						arr.push( value );
					}else{
						arr.push( prop );
					}
				}
			}
			return arr;
		}
		for(var prop in me){
			if( me.hasOwnProperty( prop ) ){
				var value = me[prop];
				if( b ){
					arr.push( value );
				}else{
					arr.push( prop );
				}
			}
		}
		return arr;
	};
		
	/**
	 * 图片懒加载
	 * @example 
	 * selecter [lazy-src]
	 * $(document).lazyLoad.lazyLoad();
	 */
	var lazy_src = "lazy-src";
	var l_blank = "//imgssl.suning.com/images/ShoppingArea/Common/blank.gif";
	var LazyLoad = {
    	lazy_src : lazy_src,	
    	lazy_not_load : 'img[{src}][{src}!=finish]'.format({src:lazy_src}),
    	blank : l_blank,
    	holder : {
    		blank : l_blank
    	},
    	filters : [],//过滤器
		exec_filters : function(elm){
			var i = 0;
			function next(){
				var filter = lazy.filters[i++];
				if( filter ){
					filter.apply(elm,[i,elm,next]);
				}
			}
			next();
		},
		filter_add : function(filter){
			lazy.filters.push(filter);
		},
    	onerror : function(){
    		debug && console.debug("load img error");
    		$(this).attr('error',this.src);
    		var holder = $(this).attr('holder') || '';
    		holder = l.holder[holder] || l.blank;
    		holder = holder == this.src ? l.blank : holder;
    		this.src = holder;
    	},
    	loadImg : function(elm){
    		elm.onerror = lazy.onerror;
    		lazy.exec_filters(elm);
    		var src = elm.getAttribute(l.lazy_src);
    		if(src){
    			log && console.log('lazy load image:'+src);
    			elm.src=src;
        		elm.setAttribute(l.lazy_src,"finish");
    		}
    	},
    	load1screen : function(el){
    		$(el || document.body).find(l.lazy_not_load).each(function(){
                var _this = $(this)[0];
                var top = Math.max(_this.offsetTop,$(this).offset().top);
                var height = window.innerHeight;
                debug && console.info("{top} < {height}".format({
                	top : top,
                	height : height
                }));
                if( top < height ){
                	lazy.loadImg(_this);
                }
            });
    	},
        lazyLoad:function(el){
        	var lazyImages = $(el||document.body).find(l.lazy_not_load);
        	if(lazyImages.size() > 0){
        		//加载第一屏图片
                lazy.load1screen(el);
        	}
            var delay = null;
            
            function $lazy(){
            	$(el||document.body).find(l.lazy_not_load).each(function(){
                    var _this = $(this)[0];
                    if(_this.getAttribute(l.lazy_src) == null){
                        return;
                    }
                    var top = Math.max(_this.offsetTop,$(this).offset().top);
                    var h = window.innerHeight || window.screen.height;
                    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                    debug && console.info("document scrollTop:{scrollTop}--window height:{h}--img top:{top}".format({
                    	top : top,
                    	h : h,
                    	scrollTop : scrollTop
                    }));
                    
                    if(scrollTop > top + h || scrollTop < top - h){
                    	//_this.onerror = lazy.onerror;
                        clearTimeout(delay);
                        return;
                    }
                    if(scrollTop > top - h){
                    	lazy.loadImg(_this);
                    }
                });
            }
            $(window).bind('img-lazy',function(){
            	$lazy();
            	$(window).trigger('img-lazy-lisenter');
            });
           //绑定滚动优化
           $(window).add("body").bind('scroll', function(){
                delay = setTimeout(function(){
                 $(window).trigger('img-lazy');
                },100);
           });
        }
        
    };
  	var l = LazyLoad;
	/*---===========aop==============---*/
	Function.prototype.before = function( func ){
		var __self = this;
		return function(){
			var ret = func.apply( this, arguments );
			if( ret === false || ( ret && ret.success === false ) ){
				return ret;
			}
			return __self.apply( this, arguments );
		};
	};
	Function.prototype.after = function( func ){
		var __self = this;
		return function(){
			var ret = __self.apply( this, arguments );
			if( ret === false || ( ret && ret.success === false ) ){
				return ret;
			}
			func.apply( this, arguments );
			return ret;
		};
	};
	Function.prototype.around = function( func ){
		var __self = this;
		return function(){
			__self.apply( this, arguments );
			var ret = func.apply( this, arguments );
			__self.apply( this, arguments );
			return ret;
		};
	};
    
	$.fn.attrs = function() {
        var args = Array.copy(arguments, 0);
        var elm = $(this);
        function attrs() {
            var o = {};
            var args = Array.copy(arguments, 0);
            for (var i = 0; i < args.length; i++) {
                var oprop = args[i];
                if (oprop instanceof Array) {
                    for (var j = 0; j < oprop.length; j++) {
                        var prop = oprop[j];
                        $.extend(o, attrs(prop));
                    }
                } else {
                    if (typeof oprop == "string") {
                        o[oprop] = elm.attr(oprop) || "";
                    }
                }
            }
            return o;
        }
        return attrs(args);
    };
	
	$.jsonp = function(url, data, success, error, callname, method, option) {
        var params = {
            type: method || "GET",
            url: url,
            cache: false,
            async: false,
            data: data || {},
            dataType: "jsonp",
            jsonp: "callback",
            success: success || $.noop,
            error: error || $.noop
        };
        callname && (params.jsonpCallback = callname);
        $.ajax($.extend({}, params, option || {}));
    };
    
    $(function(){
		document.onerror =function(e, url, line){
			console.info("document error",e, url, line);
		};
		//图片懒加载
		LazyLoad.lazyLoad();
	});
	
    window.debug = $.request.get('debug') == 'true';
	
	var helloworld = '%c店铺展示系统SFS!\n%chttp://www.suning.com\n如有店铺相关问题建议或兴趣请反馈QQ群：104646505\n-------------\n2015年3月30日19:23:06  Powered by 开放平台店铺开发部';
	var imageTxt =[ '%c'+
'	    ___           ___           ___                       ___           ___        ',     
'       /\\  \\         /\\__\\         /\\__\\          ___        /\\__\\         /\\  \\       ',    
'      /::\\  \\       /:/  /        /::|  |        /\\  \\      /::|  |       /::\\  \\      ',   
'     /:/\\ \\  \\     /:/  /        /:|:|  |        \\:\\  \\    /:|:|  |      /:/\\:\\  \\     ',  
'    _\\:\\~\\ \\  \\   /:/  /  ___   /:/|:|  |__      /::\\__\\  /:/|:|  |__   /:/  \\:\\  \\    ', 
'   /\\ \\:\\ \\ \\__\\ /:/__/  /\\__\\ /:/ |:| /\\__\\  __/:/\\/__/ /:/ |:| /\\__\\ /:/__/_\\:\\__\\   ',
'   \\:\\ \\:\\ \\/__/ \\:\\  \\ /:/  / \\/__|:|/:/  / /\\/:/  /    \\/__|:|/:/  / \\:\\  /\\ \\/__/   ',
'    \\:\\ \\:\\__\\    \\:\\  /:/  /      |:/:/  /  \\::/__/         |:/:/  /   \\:\\ \\:\\__\\     ',  
'     \\:\\/:/  /     \\:\\/:/  /       |::/  /    \\:\\__\\         |::/  /     \\:\\/:/  /     ',  
'      \\::/  /       \\::/  /        /:/  /      \\/__/         /:/  /       \\::/  /      ',   
'       \\/__/         \\/__/         \\/__/                     \\/__/         \\/__/       ',        
       ];		
	try{
		window.console = console || {};
		//console && console.log && console.log(helloworld, 'color:#009a61; font-size: 28px;', 'color:#009a61');
		//console.log(imageTxt.join('\n'),"background-color:#338fff;color:white;");
	}catch(e){}
	
})();

