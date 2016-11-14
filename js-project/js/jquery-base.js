/**
 * 	
                  _             
                 (_)            
  ___ _   _ _ __  _ _ __   __ _ 
 / __| | | | '_ \| | '_ \ / _` |
 \__ \ |_| | | | | | | | | (_| |
 |___/\__,_|_| |_|_|_| |_|\__, |
                           __/ |
                          |___/ 
 *	装修服务组件
 * 	dependency sf-base.js
 *  @author 14041326
 *  @time 2016年8月30日10:44:46
 */
(function(deco){
	
	//菜单切换
	$.fn.toggleMenu = function(config){
		//config{sourceEl:'',sourceClass:'',subEl:'',}
		config && $(this).each(function(i,menuElm){
			var menu = $(menuElm);//菜单
			var submenu = $(config.subEl,menuElm);//子菜单
			var source = $(config.sourceEl,menuElm);//事件源
			if( submenu.length > 0 ){
				source.click(function(){
					menu.toggleClass(config.sourceClass);
					submenu.toggle();
				});
			}
		});
	};
	//移动
	$.fn.moveable = function(config){
		$(this).each(function(i,moveEl){
			if( typeof config == 'string' ){
				$(moveEl).sortable(config);
			}else{
				var placeholder = (moveEl.className||'').split(' ')[0] || 'sf-module990';
				var placeholder_config = {placeholder:config.placeholder.format({placeholder:placeholder})};
				$(moveEl).sortable($.extend({},config,placeholder_config));
			}
		});
	};
	//查找指定元素的位置
	$.fn.indexOf = function( el ){
		var at = -1;
		for(var i =0; i < this.length; i ++ ){
			if( $(this[i]).is( el ) ){
				at = i;
				break;
			}
		}
		return at;
	};
	//是否包含某子元素
	$.fn.hasElm = function(){
		var els = Array.copy(arguments,0),has = false;
		for(var i =0; i < els.length; i ++){
			var el = els[i];
			has = has || $(el,this).length > 0;
		}
		return has;
	};
	//是否包含某子元素
	$.fn.hasParents = function(){
		var els = Array.copy(arguments,0);
		var parents = $(this).parentsElm.apply(this,els);
		return parents.length > 0  ;
	};
	//是否包含某样式
	$.fn.hasClasses = function(){
		var elm = $(this);
		var classes = Array.copy(arguments,0),has=false;
		for(var i =0; i < classes.length; i ++){
			var clazz = classes[i];
			has = has || elm.hasClass(clazz);
		}
		return has;
	};
	//获取父元素
	$.fn.parentsElm = function(){
		var els = Array.copy(arguments,0),parentElm = this;
		for(var i =0; i < els.length; i ++){
			var el = els[i];
			if( $(parentElm).is( el )){
				//noop
			}else{
				parentElm = $(parentElm).parents(el)[0];
			}
			if( parentElm ){
				break;
			}
		}
		return $(parentElm);
	};
	//tab标签切换
	$.fn.sntabs = function(tabEl,padEl,selectTabClass,callback,click){
		var context = this;
		var tabs = $(tabEl,this);
		var pads = $(padEl,this);
		tabs.click(function(){
			var curr = $(this),at = tabs.index(curr);
			prototype.selectedIndex = at;
			//处理选中样式
			tabs.removeClass(selectTabClass);
			curr.addClass(selectTabClass);
			//显示对于的内容
			pads.hide();
			pads.eq(at).show();
			(click||$.noop).apply(this,[at,tabs,pads,selectTabClass]);
		});
		//初始化完成回调
		(callback||$.noop).apply(this,[tabs,pads,selectTabClass]);
		//选中的tab
		var selectedTab = function(){
			return tab.eq(prototype.selectedIndex);
		}
		//选中的tab内容
		,selectedPad = function(){
			return pads.eq( prototype.selectedIndex );
		},
		select = function(at){
			tabs.eq(at).click();
			return this;
		}
		;
		var prototype = {
			context : this,
	    	tabs : tabs,
	    	pads : pads,
	    	selectedIndex : 0,
	    	selectedTab : selectedTab,
	    	selectedPad : selectedPad,
	    	select : select
	    };
		//初始化
		select(0);
	    return prototype;
	};
	$.fn.snhover = function(el,hoverclass){
		var context = $('[sn-hover]',this)[0] || this;
		el = el || $(context).attr('sn-hover') || '[sn-hover]';
		hoverclass = hoverclass || $(context).attr('sn-hover-class') || 'hover';
		$(context).on('hover',el,function(){
			$(this).toggleClass(hoverclass);
		});
	};
		
	//输入框-占位符
	var placeholder = {
		isenable : function(){
			return 'placeholder' in document.createElement('input');
		},
		bind : function(){
			var me = this;
			if( !me.isenable() ){
				jQuery(':input[placeholder]').each(function(index, element) {
	                var self = $(this),txt = self.attr('placeholder'),sw = self.outerWidth(),sf = self.css('float');
	                self.wrap($('<div></div>').css({
	                	position:'relative', zoom:'1', border:'none', 
	                	background:'none', padding:'none', 
	                	margin:'none', 'width': sw, 'float':sf}));
	                var pos = self.position(),h = self.outerHeight(true),paddingleft = self.css('padding-left');
	                var holder = $('<span placeholder-mask></span>').text(txt).css({
	                	position:'absolute', left:pos.left, 
	                	top:pos.top, height:h, 
	                	//lineHeight:h+'px', 
	                	paddingLeft:paddingleft, color:'#aaa', 
	                	border: 0,'font-family':'Arial, Helvetica, sans-serif'}).appendTo(self.parent());
	                self.keyup(function(e) {
	                	self.val() ? holder.hide() : holder.show();
	                }).focusout(function(e) {
	                	!self.val() ? holder.show() : holder.hide();
	                });
	                holder.click(function(e) {
	                    holder.hide();
	                    self.focus();
	                });
	            });
			}
		}
	};
	$(function(){
		placeholder.bind();
	});
	
	//垂直居中
	$.fn.verticalAlign = function(height,style){
		var that = $(this);
		var calculate = {
			'top' : function(){
				return 0;
			},
			'middle' : function(height){
				var oheight = this.height(),top = height - oheight,top = top / 2 ;
				return Math.max(top,0);
			},
			'bottom' : function(){
				var oheight = this.height(),top = height - oheight;
				return Math.max(top,0);
			}
		};
		var top = calculate[style||'top'].apply(that,[height]);
		that.css('margin-top',top);
		return that;
	};
	
	//像素尺寸缩放
	var Pixel = function(opixel,ounit){
		var unit = ounit || Pixel.unit;
		if( opixel.initialize ){
			opixel.initialize( opixel,ounit );
			return opixel;
		}
		return new function pixel(opixel,ounit){
			var x1,y1,u = unit;
			var proto = {
				precision : 5,
				ratioxy : function(){
					var ratio = (x1 / y1).toFixed(this.precision);
					this.$ratioxy = ratio;
					return ratio;
				},
				ratioyx : function(){
					var ratio = (y1 / x1 ).toFixed(this.precision);
					this.$ratioyx = ratio;
					return ratio;
				},
				//比例
				ratio : function(pixel2,u){
					u = u||unit;
					var p2 = Pixel.to(pixel2,u);
					var ratiox = p2.x == 0 ? 0 : x1 / p2.x;
					var ratioy = p2.y == 0 ? 0 : y1 / p2.y;
					return {ratiox: ratiox,ratioy: ratioy };
				},
				initialize : function(opixel,ounit){
					unit = ounit || unit;
					opixel = opixel || this;
					x1 = opixel[unit.x],y1 = opixel[unit.y];
					x1 = x1 || opixel.x || 0, y1 = y1 || opixel.y || 0;
					this[unit.x] = x1;
					this[unit.y] = y1;
					this.x = x1;
					this.y = y1;
					return this;
				},
				gte : function(p2){
					p2 = Pixel.to(p2,u);
					return x1 >= p2.x || y1 >= p2.y;
				},
				scale2p : function(pixel2,style){
					var p2 = Pixel.to(pixel2,u);
					var ratioyx1 = this.ratioyx(),ratioxy1 = this.ratioxy();
					// y / x2 = ratioyx1(y1/x1) => y = x2 * ratioyx1
					// x / y2 = ratioxy1(x1/y1) => x = y2 * ratioxy1
					var y = p2.x * ratioyx1;//p2.x,y
					var x = p2.y * ratioxy1;//x,p2.y
					//放大
					if( style == 'out' ){
						if( y > p2.y ){
							y = p2.y;
						}else if( x > p2.x ){
							x = p2.x;
						}
					}else{//缩小
						if( y > p2.y ){
							y = p2.y;
						}else if( x > p2.x ){
							x = p2.x;
						}
					}
					return Pixel.to({x:x,y:y},u);
				},
				//缩放
				scale : function(pixel2,u,style){
					u = u||unit;
					var p2 = Pixel.to(pixel2,u),p = this;;
					var gte = this.gte(p2);
					var out = style == 'out' ? !gte : style == 'to' ? true : gte;
					if( out ){
						p = this.scale2p(p2,style);
					}
					return p;
				},
				//按比例缩放
				scaleto : function(ratio){
					var ratiox = ratio, ratioy = ratio;
					if( ratio.ratiox != null){
						ratiox = ratio.ratiox;
						ratioy = ratio.ratioy;
					}
					return Pixel.to({x:Math.round(x1*ratiox),y:Math.round(y1*ratioy)},u);
				},
				//缩放到指定像素尺寸内
				scale2 : function(pixel2,u){
					return this.scale(pixel2,u,'to');
				},
				//缩小
				scalein : function(pixel2,u){
					return this.scale(pixel2,u,'in');
				},
				//放大
				scaleout : function(pixel2,u){
					return this.scale(pixel2,u,'out');
				},
				to : function(u){
					u = u||unit;
					var o = {};
					o[u.x] = x1;
					o[u.y] = y1;
					return o;
				},
				reverse : function(){
					var pixel2 = {};
					pixel2[unit.x] = -x1;
					pixel2[unit.y] = -y1;
					return Pixel.to(pixel2,u);
				}
			};
			proto.initialize(opixel,ounit);
			$.extend(this,proto);
		}(opixel,ounit);
	};
	$.extend(Pixel,{
		unit : {x:'x',y:'y'},
		nnow : function(opixel,ounit){
			return Pixel(opixel,ounit);
		},
		to : function(p2,u){
			if( p2.x == null){
				p2 = Pixel(p2,u);
			}
			return Pixel(p2,u);
		}
	});
	$.Pixel = Pixel;
		
	$.extend4null = function(){
		var arg1 = arguments[0],args = Array.copy(arguments,1);
		if( arg1 && args.length ){
			for(var i = 0; i < args.length; i ++ ){
				var arg = args[i];
				if( arg ){
					for(var prop in arg){
						if( arg[prop] != null ){
							arg1[prop] = arg[prop];
						}
					}
				}
			}
		}
		return arg1;
	};
	$.extend4true = function(){
		var arg1 = arguments[0],args = Array.copy(arguments,1);
		if( arg1 && args.length ){
			for(var i = 0; i < args.length; i ++ ){
				var arg = args[i];
				if( arg ){
					for(var prop in arg){
						if( arg[prop] ){
							arg1[prop] = arg[prop];
						}
					}
				}
			}
		}
		return arg1;
	};
	//缩放
	$.fn.scaleImage = function(max, oWidth, oHeight){
		var sizeof = $(this).sizeof();
		$.extend4null(sizeof,{width:oWidth,height:oHeight});
		sizeof = $.Pixel(sizeof,{x:'width',y:'height'}).scalein({width:max,height:max});
		$(this).sizeof(sizeof);
		return $(this);
	};
	//获取设置长宽尺寸
	$.fn.sizeof = function( osizeof ){
		var that = $(this);
		if( osizeof ){
			if( osizeof.width == null){
				osizeof = $(osizeof).sizeof();
			}
			that.width(osizeof.width).height(osizeof.height);
			return that;
		}else{
			return {width:that.width(),height:that.height()};
		}
	};
	//获取多值
	$.fn.vals = function(){
		var vals = [];
		$(this).each(function(i,elm){
			vals.push($(elm).val());
		});
		return vals;
	};
	//属性列表
	$.fn.list4prop = function( propname ,objective ){
		var elm = $(this), elms = elm,l=[];
		objective = objective || typeof propname != 'string';
		if( elm.length <= 1 ){
			elms = elm.siblings().andSelf();
		}
		elms.each(function(i,oelm){
			var props = objective ? $( oelm ).attrs( propname ) : $( oelm ).attr( propname );
			l.push( props );
		});
		return l;
	};
	//关联
	$.fn.link = function(linkObj){
		if( linkObj ){
			linkObj = $(linkObj);
			var olink = $(this).data('link') || [];
			var linkElm = $(linkObj).toArray();
			olink.remove(linkElm);
			//set link
			olink.add( linkElm );
			$(this).data('link',olink);
			//互相链接
			var oolink = linkObj.data('link') || [];
			var _this = $(this).toArray();
			oolink.remove(_this);
			oolink.add(_this);
			linkObj.data('link',oolink);
			return $(this);
		}else{
			return $($(this).data('link'));
		}
	};
	
	//字符长度-一个汉字长度=2
	$.char_length = function(string){
		return string.replace(/[\u4E00-\u9FA5\uF900-\uFA2D\uFF00-\uFFEF]/img,"00").length;
	};
	//字符宽度
	$.fn.string_width = function(){
		var span = '<span string-width style="word-break: normal;word-wrap: normal;"></span>';
		span = $($('[string-width]')[0] || $(span));
		var spanElm = span[0];
		var ori_width = spanElm.offsetWidth;
		span.text(string);
		var auto_width = spanElm.offsetWidth;
		span.remove();
		return auto_width - ori_width;
	};
	//字符自动宽度
	$.fn.string_auto = function(){
		var elm = $(this),string = elm.text(),width = elm.width();
		var tid = new Date().getTime();
		var span = '<span string-auto-'+tid+' style="visibility: hidden;word-break: normal;word-wrap: normal;">0</span>';
		span = $($('[string-auto-'+tid+']')[0] || $(span));
		span.copy4css(this,"font-size");
		var spanElm = span[0];
		$(this).html(span);
		//span.appendTo(this);
		var ori_height = spanElm.offsetHeight;
		span.text("");
		var ori_width = spanElm.offsetWidth;
		//有宽度设置宽度
		if( width ){
			var chars = [];
			for( var i = 0; i < string.length; i ++ ){
				var char = string.charAt(i);
				var cur_chars = span.text() + char;
				span.text(cur_chars);
				var auto_width = spanElm.offsetWidth;
				var diff_width = auto_width - ori_width;
				var auto_height = spanElm.offsetHeight;
				if( diff_width < width && auto_height == ori_height){
					chars.push(char);
				}else{
					break;
				}
			}
			elm.text(chars.join('')).attr('alt',string);
			span.remove();
		}
		return $(this);
	};
	//substring,字符串截取一个汉字长度=2
	$.substring = function(string,start,end){
		var reg = /[\u4E00-\u9FA5\uF900-\uFA2D\uFF00-\uFFEF]/;
		var chars = [];
		var length = 0,char=null,i = 0,start = Math.max(start,0);
		while(char = string.charAt(i++)){
			var large = reg.test(char);
			var charl = large ? 2 : 1;
			length += charl;
			if( length >= start && length <= end ){
				chars.push(char);
			}
			if( large && (end - start) <= 1){
				chars.push(char);
			}
			if( length > end ){
				break;
			}
		}
		return chars.join('');
	};
	//把对象中的属性转成整型
	$.parseInt = function( obj){
		var props = Array.copy(arguments,1);
		if(props.length){
			for(var i = 0; i < props.length; i ++){
				var prop = props[i];
				if( obj[prop] != null ){
					obj[prop] = parseInt(obj[prop]);
				}
			}
		}else{
			for(var prop in obj){
				obj[prop] = parseInt(obj[prop]);
			}
		}
	};
	//复制样式
	$.fn.copy4css = function(oelm){
		var props = Array.copy(arguments,1);
		if(props.length){
			var csses = {};
			for(var i = 0; i < props.length; i ++){
				var prop = props[i];
				var css = $(oelm).css(prop);
				if( css != null ){
					csses[prop] = css;
				}
			}
			$(this).css(csses);
		}
		return $(this);
	};

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
	
	//位置 pos{x,y}
	$.pos2offset = function(pos){
		if( pos.x != null){
			return $.extend({},pos,{left:pos.x,top:pos.y});
		}
		return pos;
	}
	$.offset2pos = function(offset){
		if( offset.left != null){
			return $.extend({},offset,{x:offset.left,y:offset.top});
		}
		return offset;
	}
	$.diff2pos = function(pos1,pos2){
		return {x:pos1.x-pos2.x,y:pos1.y-pos2.y};
	}
	$.plus2pos = function(pos1,pos2){
		return {x:pos1.x+pos2.x,y:pos1.y+pos2.y};
	}
	$.fn.position = function(pos){
		if( pos ){
			var offset = $.pos2offset(pos);
			$(this).css('position','absolute').offset( offset );
			pos.color && $(this).css('background',pos.color);
			pos.r && $(this).css('width',pos.r).css('height',pos.r);
			return $(this);
		}else{
			var offset = $(this).offset();
			return $.offset2pos(offset);
		}
	}
	$.getArgs = function($args){
		var args = Array.copy($args,0);
		var arg0 = args[0];
		if( arg0 instanceof Array){
			args = arg0;
		}
		return args;
	}
	$.drawPoint = function(pos,color,r){
		$('<div style="width:{r}px;height:{r}px;"></div>'.format({r:r||1})).appendTo('body').position(pos).css('background',color);
	}
	$.drawPoints = function(){
		var args = $.getArgs(arguments);
		var tpl = '<div style="width:1px;height:1px;"></div>';
		for(var i = 0; i < args.length; i ++){
			var pos = args[i];
			$(tpl).appendTo('body').position(pos);
		}
	}
	//拖动
	$.fn.dragable = function(){
		var page = {
            event: function (evt) {
                var ev = evt || window.event;
                return ev;
            },
            pageX: function (evt) {
                var e = this.event(evt);
                return e.pageX || (e.clientX + document.body.scrollLeft - document.body.clientLeft);
            },
            pageY: function (evt) {
                var e = this.event(evt);
                return e.pageY || (e.clientY + document.body.scrollTop - document.body.clientTop);
            },
            layerX: function (evt) {
                var e = this.event(evt);
                return e.layerX || e.offsetX;
            },
            layerY: function (evt) {
                var e = this.event(evt);
                return e.layerY || e.offsetY;
            }
        }
		function releaseEvents(target){
			target && target.releaseCapture && target.releaseCapture();
			window.releaseEvents && window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
		}
		function captrueEvents(target){
			target && target.setCapture && target.setCapture();
			window.captureEvents && window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
		}
		function setup(target,move){
			var dragid = $(target).attr('dragid');
			captrueEvents(target);
			$(document).on('mousemove.drag-'+dragid,function(e){
				//清除选择
				window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
				move && move({x:page.pageX(e),y:page.pageY(e)});
			});
			$(document).on('mouseup.drag-'+dragid,function(e){
				takeoff(target);
			});
		}
		function takeoff(target){
			var dragid = $(target).attr('dragid');
			releaseEvents(target);
			$(document).off('mousemove.drag-'+dragid+' mouseup.drag-'+dragid);
		}
		$(this).each(function(i,elm){
			var source = this,target = $(this).attr('target') || source ;
			var id = _.now('yyyyMMddhhmmssSSS') + i;
			$(target).attr('dragid',id).data('source',source).css('cursor','move')
			.mousedown(function(e){
				var target = this,source = $(target).data('source');
				var x = page.pageX(e);
                var y = page.pageY(e);
                var source_pos1 = $.offset2pos($(source).offset());
                var source_pos = {x:x,y:y};
                setup(target,function(target_pos){
                	
                	var tx = target_pos.x - source_pos.x;
	                var ty = target_pos.y - source_pos.y;
	                var off = $.diff2pos(target_pos,source_pos);
	                off = $.plus2pos(source_pos1,off);
	                //$.drawPoint(off,'red',1);
	                //$.drawPoint(target_pos,'yellow',1);

	                $(source).offset($.pos2offset(off));

                });
                e.stopPropagation();
			});
		});
	}


	//表单控件对象化
	$.fn.objectalize = function($obj){
		if( $obj ){
			for( var name in $obj ){
				var inputobj = {name:name,value:($obj[name]).toString()};
				var input = $('[name={name}]'.format(inputobj));
				if( input.size() > 0 ){
					if( $(input).is('[type=checkbox]') || $(input).is('[type=radio]') ){
						$(input).filter('[value={value}]'.format(inputobj)).attr('checked',true);
					}else{
						input.val(inputobj.value);
					}
				}
			}
		}else{
			var obj = {};
			var formInputs = this;
			function put(inputobj){
				if( inputobj.name ){
					obj[inputobj.name] = inputobj.value;		
				}
			}
			function remove(inputobj){
				delete obj[inputobj.name];
			}
			$(formInputs).each(function(i,input){
				var inputobj = $(input).attrs('name','value');
				if( inputobj.name ){
					if( obj[inputobj.name] ){
						if( $(input).is('[type=checkbox]') || $(input).is('[type=radio]') ){
							remove(inputobj);
							inputobj = $('[name={name}]:checked'.format(inputobj)).attrs('name','value');
							put(inputobj);
						}
					}else{
						put(inputobj);
					}
				}
			});
			return obj;
		}
	}



}());