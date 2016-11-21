(function(){
	
	function ang2rad(ang){
		return 2*Math.PI/360 * ang;
	}

	Number.prototype.each = function(callback){
		for(var i = 0; i < this; i ++){
			callback(i);
		}
	}

	Array.prototype.each =  Array.prototype.each || function(callback){
		for(var i = 0; i < this.length; i ++){
			callback(i,this[i]);
		}
	}

	//数组延迟执行
	Number.prototype.each4delay = function(f,t,auto,end){
	     var a = this,auto = auto == null ? true : auto ;
	     a.i = 0;
	     a.tid = 0;
	     function callback(a){
	          if( a.i < a ){
	             a.tid = setTimeout(function(){
	                 function next(){
	                 	callback(a);
	                 };
	                 f(a.i++,next);
	                 auto && next();
	              },t||1000);
	          }else{
	             clearTimeout(a.tid);
	             end && end(a);
	          }
	     }
	     callback(a);
	};

	//e{client{x,y},offset{x,y},screen{x,y}}
	$.epoint = function(e,name){
		return {x:e[name+'X'],y:e[name+'Y']};
	};

	//cos,sin,tan
	function draw(type){
		(1920).each4delay(function(i){
			$.drawPoint({x:i,y: 200 + (100 * Math[type](ang2rad(i%360)))},'red',2,true,type+'p',i);
		},1);	
	}
	//draw('sin');
	//draw('cos');

	define('paint.point',function(){
		var public = {};
		var proto = {};
		return $.extend(public,proto);
	}());
	define('paint.line',function(){
		var public = {};
		function kfn(p1,p2){
			return p2.y - p1.y / p2.x - p1.x;
		}
		function bfn(p1,p2){
			return p1.y + p1.x * kfn(p1,p2);
		}
		function yfn(k,b,x){
			return k * x + b;
		}
		/**  
		 函数功能：根据两点坐标画直线。  
		 函数思路：根据两点的坐标计算机斜率，然后根据第一个点坐标及斜率计算直线上所有点然后画线。垂直线特殊处理  
		*/  
		function draw(p1,p2,color,name,r,fixed){
			name = name || 'line1';
			var x1 = p1.x, y1 = p1.y,x2 = p2.x,y2 = p2.y;
		 	var slope=(y2-y1)/(x2-x1); //斜率  
		 	var diff=x2-x1;
		 	var p = null;
		 	if(x1<x2){  
		  		for(var i=0;i<diff;i++){  
		  			p = { x : x1 + i, y : y1 + slope * i};
		  			$.drawPoint(p,color||'red',r,fixed||true,name + '-line',i);
		  		}  
		 	}else if(x1>x2){  
		  		for(var i=0;i>diff;i--){  
		  			p = { x : x1 + i, y : y1 + slope * i};
		  			$.drawPoint(p,color||'red',r,fixed||true,name + '-line',i);
		  		}  
		 	}else{ //画垂直线  
		  		var temp=y2-y1;  
		  		if(temp>0){  
			   		for(var i=0;i<temp;i++){ 
			   			p = { x : x1, y : y1 + i};
			   			$.drawPoint(p,color||'red',r,fixed||true,name + '-line',i);
			   		}
		   		}else{  
			   		for(var i=0;i>temp;i--){ 
			   			p = { x : x1, y : y1 + i};
			   			$.drawPoint(p,color||'red',r,fixed||true,name + '-line',i);
			   		}
			   	}
		   	}
		   	
		} 
		
		var proto = {
			k : kfn,
			b : bfn,
			y : yfn,
			draw : draw
		};
		return $.extend(public,proto);
	}());

	define('paint.circle',function(){
		var public = {};
		function pfn(center,ang,r){
			var x = center.x + Math.sin(ang2rad(ang)) * r;
			var y = center.y + Math.cos(ang2rad(ang)) * r;
			var p = {x:x,y: y};
			return p;
		}
		//	X坐标=a + Math.sin(2*Math.PI / 360) * r ；Y坐标=b + Math.cos(2*Math.PI / 360) * r
		function draw(center,r,name,color,w,fixed){
			//remove && $('[circle]').remove();
			//remove && $('[center]').remove();
			name = name || 'sample';
			(360).each4delay(function(i){
				var p = pfn(center,i,r);
				$.drawPoint(p,color||'red',w||1,fixed||true,name + '-circle',i);
			},1)
		}
		function drawLine(start,r,ang,name,color,w,fixed){
			// y = kx + b;
			(r).each(function(i){
				var p = paint.circle.pfn(start,ang,i);
				$.drawPoint(p,color||'red',w||1,fixed||true,name + '-line',i);
			});
		}
		var proto = {
			pfn : pfn,
			draw : draw,
			drawLine : drawLine
		};
		return $.extend(public,proto);
	}());
	
	define('paint.brush',function(){
		var public = {};
		function drawPoint(p,color,w,fixed,name){
			$.drawPoint(p,color,w,fixed,name);
		}
		function drawLine(p1,p2,color,name,w,fixed){
			paint.line.draw(p1,p2,color,name,w,fixed);
		}
		function drawCircle(center,r,name,color,w,fixed){
			paint.circle.draw(center,r,name,color,w,fixed);
		}
		function drawTriangle(p1,p2,p3,color,name,w,fixed){
			paint.line.draw(p1,p2,color,name,w,fixed);
			paint.line.draw(p2,p3,color,name,w,fixed);
			paint.line.draw(p3,p1,color,name,w,fixed);
		}
		function drawPolygon(points,color,name,w,fixed){
			for(var i = 0; i < points.length-1; i ++ ){
				paint.line.draw(points[0],points[1],color,name,w,fixed);
			}
			paint.line.draw(points[points.length-1],points[0],color,name,w,fixed);
		}
		function drawRect(p1,w,h,color,name,w,fixed){
			var p2 = {x:p1.x+w,y:p1.y},p3 = {x:p1.x+2,y:p1.y+h},p4={x:p1.x,y:p1.y+h};
			paint.line.draw(p1,p2,color,name,w,fixed);
			paint.line.draw(p2,p3,color,name,w,fixed);
			paint.line.draw(p3,p4,color,name,w,fixed);
			paint.line.draw(p4,p1,color,name,w,fixed);
		}
		var proto = {
			drawPoint : drawPoint,
			drawLine : drawLine,
			drawCircle : drawCircle,
			drawTriangle : drawTriangle,
			drawPolygon : drawPolygon,
			drawRect : drawRect
		};
		return $.extend(public,proto);
	}());

	
	define('sample.Clock',function(){
		var center = {x:screen.availWidth/2,y:screen.availHeight/2},r = 200,dvalue=180,ssr=190,mmr=150,hhr=120;
		var public = {
			center : center,
			r : r
		};
		function ss2ang(ss){
			return (ss%60) * (360/60) + dvalue;
		}
		function mm2ang(mm){
			return (mm%60) * (360/60) + dvalue;
		}
		function hh2ang(hh){
			return (hh%12) * (360/12) + dvalue;
		}
		function draw4ss(ss){
			var ang = -ss2ang(ss);
			paint.circle.drawLine(center,ssr,ang,'ss');
		}
		function draw4mm(mm){
			var ang = -mm2ang(mm);
			paint.circle.drawLine(center,mmr,ang,'mm');
		}
		function draw4hh(hh,mm){
			mm = mm || 0;
			hh = hh + parseFloat(mm/60)
			var ang = -hh2ang(hh);
			paint.circle.drawLine(center,hhr,ang,'hh');
		}
		function drawCircle(){
			paint.brush.drawPoint(center,'green',5,true,'clock-center');
			paint.brush.drawCircle( center ,r,'clock');
		}
		function drawScale(){
			// draw hour scale
			(12).each(function(i){
				var ang = -hh2ang(i);
				var start = paint.circle.pfn(center,ang,190);
				paint.circle.drawLine(start,15,ang,'hh-scale'+i);
			});
			// draw mm scale
			(60).each(function(i){
				var ang = -mm2ang(i);
				var start = paint.circle.pfn(center,ang,198);
				paint.circle.drawLine(start,5,ang,'mm-scale'+i);
			});
		}
		function draw(){
			draw4ss(public.ss);
			draw4mm(public.mm);
			draw4hh(public.hh,public.mm);
		}
		function run(){
			public.clock = setInterval(function(){
				var mm = parseInt(++public.ss/60);
				public.ss = public.ss % 60;
				public.mm = public.mm + mm;
				hh = parseInt(public.mm/60);
				public.mm = public.mm % 60;
				public.hh = public.hh + hh;
				public.hh = public.hh % 12;
				draw();
			},1000);
		}
		function stop(){
			clearInterval(public.clock);
		}
		function now(){
			var d = new Date();
			var ss = d.getSeconds();
			var mm = d.getMinutes();
			var hh = d.getHours();
			public.ss = ss;
			public.mm = mm;
			public.hh = hh;
		}
		function initialize(){
			drawCircle();
			drawScale();
			now();
			draw();
			run();
		}
		var proto = {
			ss2ang : ss2ang,
			draw4ss : draw4ss,
			draw4mm : draw4mm,
			draw4hh : draw4hh,
			drawScale : drawScale,
			drawCircle : drawCircle,
			draw : draw,
			run : run,
			stop : stop,
			initialize : initialize
		};
		return $.extend(public,proto);
	}());
	sample.Clock.initialize();
	/*
	setInterval(function(){
		var d = new Date();
		var ss = d.getSeconds();
		var mm = d.getMinutes();
		var hh = d.getHours();
		drawLine(center,r,time,'ss');
		time -= 6;
	},1000);
	*/
	
}());