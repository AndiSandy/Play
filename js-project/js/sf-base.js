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
(function(W,D,$){
	
	/**
	 * 微型模板引擎
	 * example :
	 * hello qq,lili,hh
	 * "hello {0},{1},{2}".format('qq','lili','hh') =="hello {0},{1},{2}".format(['qq','lili','hh']);
	 * "hello {w},{s},{name}".format({w:'qq',s:'lili',name:'hh'});
	 * "hello {0},{s},{name}".format({w:'qq',s:'lili',name:'hh'});
	 */
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
			return this.replace(/\{([^\{\}]+)\}/g,function(index,value){
				return string.format_dot_o(o,value);
			});
		},
		//格式化数组
		format_a: function(a){
			var string = this;
			return this.replace(/\{([^\{\}]+)\}/g,function(index,value){
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
  	
  	/**
  	 * 模板引擎
  	 * example :
  	 * var template = 
  	 *	'My skills:' + 
  	 *	'<%if(this.showSkills) {%>' + 
  	 *	'<%for(var index in this.skills) {%>' + 
  	 *		'<a href="#"><%this.skills[index]%></a>' + 
	 *		'<%}%>' + 
	 *	'<%} else {%>' + 
	 *		'<p>none</p>' + 
	 *	'<%}%>'; 
	 *	console.log(TemplateEngine(template, { 
	 *		skills: ["js", "html", "css"], 
	 *		showSkills: true 
	 *	}));
	*/
  	var TemplateEngine = function(html, options) { 
		return TemplateEngine.compile(html).process(options); 
	};
	/**
	 * 配置
	 */
	TemplateEngine.config = {
		tagMap : {//标签映射
		    'src' : /s-src/img,
		    'lazy-src' : /s-lazy-src/img
		}
	};
	/**
	 * 标签处理
	 * @param code 代码
	 * @returns
	 */
	TemplateEngine.makeTags = function(code){
		return code.filter(TemplateEngine.config.tagMap);
	};
	TemplateEngine.compile = function(html){
		html = html.replace(/\n+|\t+/img,'');
		var re = /<%(.*?)%>/g, reExp = /(^( )?(if|for|else|switch|case|break|return|{|}))(.*)?/g, code = '', cursor = 0; 
		var add = function(line, js) {
			line = $.trim(line);
			debug && console.debug(line,js);
			js? (code += line.match(reExp) ? line + '\r\n' : 'r.push(' + line + ');\r\n') : 
				(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\r\n' : ''); 
			return add; 
		};
		while(match = re.exec(html)) { 
			debug && console.debug(match);
			add(html.slice(cursor, match.index))(match[1], true); 
			cursor = match.index + match[0].length; 
		}
		add(html.substr(cursor, html.length - cursor)); 
		code = 'var r=[];\n with(this){\n'+code+'}return r.join("");'; 
		code = TemplateEngine.makeTags(code);//code.trim().replace(/(<[^>]*?)s-(.*?)([^>]?>)/img,'$1$2$3');
		info && console.info(code);
		return {
			tplFn : new Function(code),
			process : function(options){
				return this.tplFn.apply(options);
			}
		};
	};
	/**
	 * example:
	 * "hello<%name%>".sara({name:'james'}) 
	 * ==>
	 * 	hello james
	 * @param data
	 * @returns
	 */
	String.prototype.sara = function(data){
		return TemplateEngine(this,data).process();
	};
	//模板编译
	String.prototype.compile = function(){
		return TemplateEngine.compile(this);
	};
	/**
	 * example:
	 * 	<a>hello <%name%></a>
	 * 	$('a').sara({name:'james'});
	 * ==>
	 * <a>hello james</a>
	 */
	$.fn.saraDom = function(odata,otpl){
		var param = $(this).attrs("tpl"),tplElm = $('textarea[tpl={tpl}]'.format(param)),ptpl = tplElm.val();
		var tpl = (otpl&&otpl.compile()) || $(this).data("tpl");
		( ptpl && !tpl ) && ( tpl = ptpl.compile() );
		tpl = tpl || ($(this).html()||'').trim().filter({
			"<" : /&lt;/img,
			">" : /&gt;/img,
			"&" : /&amp;/img
		}).compile();
		var data = odata || $(this).data("data");
		tpl && $(this).data("tpl",tpl);
		$(this).show().empty();
		var tplHtml = tpl.process(data) || '';
		data && !tplHtml.isEmpty() && $(this).html(tplHtml);
		//数据绑定
		$(this).keyup(function(){
			//console.info('reflash data');
			$('[s-bind]',this).each(function(){
				var name = $(this).attr("s-bind");
				var value = $(this).val();
				//console.info(name + ":" + value);
				name && value && (data[name] = value);
			});
			return true;
		});
		function sclick(e){
			var __ParamValidator = window.ParamValidator || window.top.ParamValidator;
			var validate = $(this).attr("s-validate");
			var success = true;
			if( validate && __ParamValidator ){
				validate = ($(this).attr("s-validate") || '{}').json();
				success = __ParamValidator.$$validate(validate,data,document).success;
			}
			if( success ){
				var action = $(this).attr("s-click");
				action && action.eval(action,data);
			}
			return success;
		}
		//点击事件绑定
		$('[s-click]',this).click(sclick);
		sclick.apply(this);
		//if
		function sif(){
			var action = $(this).attr("s-if");
			var _class = $(this).attr("s-class");
			if( action ){
				var r = action.eval(action,data);
				if( r ){
					_class ? $(this).addClass(_class) : $(this).show();
				}else{
					_class ? $(this).removeClass(_class) : $(this).hide();
				}
			}
		}
		$('[s-if]',this).each(sif);
		sif.apply(this);
	};
	
	/**
	 * example:
	 * <a sara json="url" jsonp="">hello<%name%>
	 * $('a').sara();
	 */
	$.fn.sara = function(setting){
		var elm = this;
		var osetting = $(elm).attrs("sara","json","jsonp");
		var o = $.extend({},osetting,setting||{});
		o.data && $(elm).saraDom(o.data);
		o.sara && $(elm).saraDom(o.sara.json());
		o.json && $.get(o.json,function(data){
			data && $(elm).saraDom(data);
			(setting.callback || $.noop)(data);
		},'json');
		o.jsonp && $.ajax({
			url : o.jsonp,
			type : 'GET',
			dataType : "jsonp",						
			jsonpCallback : "sara",
			data : {},
			success : function(data) {
				data && $(elm).saraDom(data);
				(setting.callback || $.noop)(data);
			},
			error: function(xhr, textStatus, thrown) {						
				
			}
		});
		(!setting) && $(elm).saraDom();
	};
	/**
	 * $(dom).refresh();
	 */
	$.fn.refresh = function(data,tpl){
		if($(this).size()>1){
			$(this).each(function(i,elm){
				data && $(this).data("data",data);
				tpl && $(this).data("tpl",tpl.compile());
				$(this).sara();	
			});
		}else{
			data && $(this).data("data",data);
			tpl && $(this).data("tpl",tpl.compile());
			$(this).sara();	
		}
	};
	
	//翻页对象
	W.Pagination = function(total,pagesize,pageAction,context){
		var $page = this;
		$.extend(this,context||{right : false});
		//计算初始化数据
		$page.calculate = function(ototal,opagesize,opageAction){
			$.extend($page,{
				range : 4,
				pageAction : opageAction || pageAction || $page.pageAction || function(){},//翻页action
				total : "".ifNull(ototal || total,$page.total || 10) ,//总记录数
				pagesize : "".ifNull(opagesize||pagesize , $page.pagesize || 10),//每页记录数量
				page : "".ifNull($page.page,0)//当前页码init 0
			});
			var totalpage = Math.ceil($page.total/$page.pagesize);
			$page.totalpage = totalpage;
			$page.calculatePage();
		};
		//计算页码范围
		$page.calculateRange = function(){
			$page.rangeList = [];
			var page = $page.page,pageat = $page.page,range = $page.range;
			var range2f = Math.floor(range/2),range2c = Math.ceil(range/2);
			var totalpage = $page.totalpage;
			if( totalpage > $page.range ){
				if( pageat <= range2f ){
					pageat = range2f;
				}
				if( (pageat + range2c) >= totalpage ){
					pageat = totalpage - range2c;
				}
			}
			var rangUp = Math.min( range2c + pageat,totalpage);
			var rangDown = Math.max(0, pageat- range2f );
			if( totalpage <= $page.range ){
				rangDown = 0,rangUp = totalpage;
			}
			for(var i = rangDown; i < rangUp; i++){
				$page.rangeList.push({page:i,pagei:(i+1),actived: i == $page.page});
			}
			$page.header0 = (totalpage>range) && (page>range2f) ;
			$page.header1 = (totalpage>range) && (page>(range2f+1));
			$page.footer0 = (totalpage>range) && totalpage >(page+range2c);
			$page.footer1 = (totalpage>range) && totalpage>(page+range2c+1);
			$page.pagei = $page.page + 1;
		};
		//计算翻页数据
		$page.calculatePage = function(){
			$page.page = Math.max(0,$page.page);
			$page.page = Math.min($page.page,$page.totalpage-1);
			$page.page = Math.max(0,$page.page);
			$page.start = $page.page * $page.pagesize;
			$page.end = ($page.page + 1) * $page.pagesize;
			if( $page.page <= 0 ){
				$page.prev.disabled = true;
			}else{
				$page.prev.disabled = false;
			}
			if( $page.page >= ($page.totalpage-1)){
				$page.next.disabled = true;
			}else{
				$page.next.disabled = false;
			}
			$page.calculateRange();
		};
		//跳转到指定页码
		$page.gotopage = function(page){
			$page.page = page;
			$page.calculatePage();
			$page.pageAction();
		};
		//前一页
		$page.prev = function(){
			--$page.page;
			if(!$page.prev.disabled){
				$page.calculatePage();
				$page.pageAction();
			}
		};
		//后一页
		$page.next = function(){
			++$page.page;
			if(!$page.next.disabled){
				$page.calculatePage();
				$page.pageAction();
			}
		};
		//初始化计算数据
		$page.calculate();
		$page.initialize && $page.initialize();
	};
	
	/**
	 * 按键映射
	 * @example $key(e).when('enter',function(){console.info("enter")})
	 */
	W.$key = function(e){
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
	 * 图片懒加载
	 * @example 
	 * selecter [lazy-src]
	 * $(document).lazyLoad.lazyLoad();
	 */
	var lazy_src = "lazy-src",lazyEl = "lazy-container";
	var l_blank = "http://script.suning.cn/images/ShoppingArea/Common/blank.gif";
	var lazy, l = lazy = $.LazyLoad = {
    	lazy_src : lazy_src,	
    	lazy_not_load : 'img[{src}][{src}!=finish]'.format({src:lazy_src}),
    	blank : l_blank,
    	holder : {
    		blank : l_blank
    	},
    	listeners : [],//
    	context : function(el){
    		var contextEl = el || lazyEl;
    		var context = $( contextEl )[0];
    		return $( context || document.body );
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
    		var src = elm.getAttribute(l.lazy_src);
    		elm.onerror = lazy.onerror;
    		//$(this).error(lazy.onerror);
    		if(src){
    			log && console.log('lazy load image:'+src);
    			elm.src=src;
        		elm.className=elm.className+"bouseIn";
        		elm.setAttribute(l.lazy_src,"finish");
    		}
    	},
    	load1screen : function(el){
    		l.context(el).find(l.lazy_not_load).each(function(){
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
        	var context = l.context(el);
        	var lazyImages = context.find(l.lazy_not_load);
        	if(lazyImages.size() > 0){
        		//加载第一屏图片
                lazy.load1screen(el);
        	}
            var delay = null;
            function $lazy(){
            	context.find(l.lazy_not_load).each(function(){
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
	
    /**
     * 扩展jquery-事件触发切换样式
     * @param event 事件名称
     * @param scope 父上下文
     * @param className 要切换的样式名称
     * @param callback 回调函数
     */
    $.fn.$toggleClass = function(o){
    	o = $.extend({
    		scope : document,
    		event : 'click',
    		className : '',
    		single : true,
    		callback : $.noop
    	},o);
    	var elms = $(this); 
    	debug && console.debug('toggle class binding!');
		o.callback2 = o.callback2 || o.callback;
		o.event && $(elms.selector).live(o.event + '.toggleClass',function(e){
			var curr = $(this);
			var scope = curr.parents(o.scope);
			var scope_elms = $(elms.selector,scope).not(curr);
			scope_elms.removeClass(o.className);
			if(!curr.is("." + o.className)){
				curr.addClass(o.className);
				return o.callback.apply(this,[e]);
			}else{
				o.single && curr.removeClass(o.className);
				return o.callback2.apply(this,[e]);
			}
		});
    };
    
    /********2016年8月20日14:17:43扩展******/
    /**
	 * 拷贝数组
	 * @param a
	 * @returns
	 */
	Array.copy = function(a){
		var args = Array.prototype.slice.apply(arguments,[1]);
		return Array.prototype.slice.apply(a,args);
	};
	$.extend(Array.prototype,{
		//移除元素
		remove : function(){
			var args = Array.copy(arguments);
			if( this.length > 0 ){
				for(var i = 0; i < args.length; i ++){
					var elm = args[i];
					if( elm instanceof Array ){
						this.remove.apply(this,elm);
					}else{
						var at = this.indexOf(elm);
						at && this.splice(at, 1);
					}
				}
			}
		},
		//删除元素
		add : function(){
			var args = Array.copy(arguments);
			if( args.length > 0 ){
				for(var i = 0; i < args.length; i ++){
					var elm = args[i];
					if( elm instanceof Array ){
						this.add.apply(this,elm);
					}else{
						this.push(elm);
					}
				}
			}
		},
		//复制元素
		copy : function(propname ,objective){
			objective = objective || typeof propname != 'string';
			var  list = [];
			for(var i = 0; i < this.length; i ++){
				var thiso = this[i];
				var o = objective ? _.copy(thiso,propname) : thiso[propname];
				list.push(o);
			}
			return list;
		}
	});

	//数组延迟执行
	Array.prototype.each4delay = function(f,t,auto,end){
	     var a = this,auto = auto == null ? true : auto ;
	     a.i = 0;
	     a.tid = 0;
	     function callback(a){
	          if( a.i < a.length ){
	             a.tid = setTimeout(function(){
	                 function next(){
	                 	callback(a);
	                 };
	                 f(a.i,a[a.i],next);
	                 a.i ++;
	                 auto && next();
	              },t|1000);
	          }else{
	             clearTimeout(a.tid);
	             end && end(a);
	          }
	     }
	     callback(a);
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
	window.pckg = pckg;
	/**
	 * 扩展jquery方法，取多个属性值，返回一个包含属性值的对象
	 */
	$.fn.attrs = function(){
		var args = Array.copy(arguments,0);
		var elm = $(this);
		function attrs(){
			var o = {};
			var args = Array.copy(arguments,0);
			for(var i = 0; i < args.length; i ++ ){
				var oprop = args[i];
				if( oprop instanceof Array ){
					for( var j = 0; j < oprop.length; j ++){
						var prop = oprop[j];
						$.extend(o,attrs(prop));
					}
				}else if( typeof oprop == 'string' ){
					o[oprop] = elm.attr( oprop ) || '';
				}
			}
			return o;
		}
		return attrs(args);
	};
	/**
	 * 复制属性
	 */
	$.fn.copy4attrs = function(a){
		var args = Array.copy(arguments,1);
		var elm = $(this);
		var attrs = $(a).attrs(args);
		for(var attr in attrs){
			elm.attr(attr,attrs[attr]);
		}
		return elm;
	};
	$.fn.and = function(el,context){
		return $($(this).toArray().concat($(el,context).toArray()));
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
	function uuid() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	}
	function copy(omap,attrs){
		var co = {};
		if( attrs ){
			for( var i = 0; i < attrs.length; i ++ ){
				var attr = attrs[i];
				co[attr] = omap[attr];
			}
		}else{
			for(var prop in omap){
				co[prop] = omap[prop];
			}
		}
		return co;
	}
	function now( format ){
		var now = new Date();
		var attrs = {
				yyyy : 'getFullYear',
				mm : 'getMonth',
				dd : 'getDate',
				hh : 'getHours',
				MM : 'getMinutes',
				ss : 'getSeconds',
				SSS : 'getMilliseconds'
		};
		var values = {};
		for( attr in attrs ){
			var v = now[attrs[attr]]();
			values[attr] = v;
		}
		return (format || "{yyyy}-{mm}-{dd+1} {hh}:{MM}:{ss}").format(values);
	}
	window._ = {
			objarr2map : objarr2map,
			arr2map : arr2map,
			map2objarr : map2objarr,
			map2arr : map2arr,
			uuid : uuid,
			copy : copy,
			now : now,
			$uuid : function(){
				var uuid = this.uuid();
				return uuid.replace(/-/g,'');
			}
	};
	
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
    
    $(function(){
		$("[sara]").each(function(){
			$(this).sara();
		});
		document.onerror =function(e, url, line){
			console.info("document error",e, url, line);
		};
		window.onerror =function(e, url, line){
			console.info("window error",e, url, line);
		};
		//图片懒加载
		$.LazyLoad.lazyLoad();
	});
	
    window.debug = $.request.get('debug') == 'true';
	window.warn = $.request.get('warn') == 'true';
	window.info = $.request.get('info') == 'true';
	window.log = $.request.get('log') == 'true';
	window.search_disable = $.request.get('search_disable') == 'true';
	window.cart_disable = $.request.get('cart_disable') == 'true';
	
	var helloworld = '%cFS通用活动装修系统!\n%chttp://www.suning.com\n-------------\n2016年8月17日15:25:03  Powered by 开放平台店铺开发部';
	var imageTxt =[ 
		    '%c'+'		╭﹌☆﹌﹌﹌☆﹌  ╮',  
				'		∣　　　　　　　  ∣',  
				'		∣　●　　　●       ∣',  
				'		∣　　　▽　　　   ∣  ',
				'		╰—————--—╯',  
				'		　∣　﹏　﹏　 ∣', 
				'		　╰∪———∪╯'];		
	//console.log(helloworld,"color:#347be4; font-size:19px;font-family:'microsoft yahei'");
	try{
		window.console = console || {};
		console.debug = console.debug || function(){};
		var topwindown = parent == window;
		topwindown && console && console.log && console.log(helloworld, 'color:#009a61; font-size: 28px;', 'color:#009a61');
		topwindown && console.log(imageTxt.join('\n'),"color:#347be4; font-size:19px;font-family:'microsoft yahei'");
	}catch(e){
		
	}
	
	
})(window,document,jQuery);

