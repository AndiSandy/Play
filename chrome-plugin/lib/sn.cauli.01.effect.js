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
 * @author 14041326
 * @date 2015年11月17日20:50:09
 */
+function ($,_) {
	'use strict';
	// AutoCenter CLASS DEFINITION
	// ======================
	var dismiss = '[data-dismiss="auto-center"]';
	var dtarget = '[data-target]';
	var AutoCenter   = function (el) {
		this.$elment = $(el);
		var target = $(el).attr('data-target');
		if( target ){
			this.$elment = $(target);
		}
		this.$elment.appendTo(document.body);
		/* 当前页面高度 */
    	this.pageHeight = function pageHeight() {
    	    return document.body.scrollHeight;
    	};
    	/* 当前页面宽度 */
    	this.pageWidth = function pageWidth() {
    	    return document.body.scrollWidth;
    	};
    	//浏览器视口的高度
    	this.windowHeight = function windowHeight() {
    	    var de = document.documentElement;
    	    var dbody = document.body;
    	    return el.innerHeight || (de && de.clientHeight) || dbody.clientHeight;
    	};
    	//浏览器视口的宽度
    	this.windowWidth = function windowWidth() {
    	    var de = document.documentElement;
    	    var dbody = document.body;
    	    return el.innerWidth || (de && de.clientWidth) || dbody.clientWidth;
    	};
    	/* 浏览器垂直滚动位置 */
    	this.scrollY = function scrollY() {
    	    var de = document.documentElement;
    	    var dbody = document.body;
    	    return el.pageYOffset || (de && de.scrollTop) || dbody.scrollTop;
    	};
    	/* 浏览器水平滚动位置 */
    	this.scrollX = function scrollX() {
    	    var de = document.documentElement;
    	    var dbody = document.body;
    	    return el.pageXOffset || (de && de.scrollLeft) || dbody.scrollLeft;
    	};
	};
	AutoCenter.prototype.autocenter = function(){
		var $this = this;
		var top = Math.floor($this.$elment.attr('data-top'));
		/* 定位到页面中心 */
		var w = $this.$elment.width();
		var h = $this.$elment.height();
		//var t = $this.scrollY() + (top || ($this.windowHeight()/2)) - (h/2);
		var t = (top || ($this.windowHeight()/2)) - (h/2);
		if(t < 0) t = 0;
		var l = $this.scrollX() + ($this.windowWidth()/2) - (w/2);
		if(l < 0) l = 0;
		$this.$elment.css({position: 'fixed',left: l+'px', top: t +'px'});
	};
	// ALERT PLUGIN DEFINITION
  	// =======================
  	var old = $.fn.autocenter;
	$.fn.autocenter = function (option) {
	  return this.each(function () {
	    var $this = $(this);
	    var data  = $this.data('bs.autocenter');
	    if (!data) $this.data('bs.autocenter', (data = new AutoCenter(this)));
	    if (typeof option == 'string') data[option]($this);
	    else data.autocenter();
	  });
	};
	$.fn.autocenter.Constructor = AutoCenter;
	// ALERT NO CONFLICT
	// =================
	$.fn.autocenter.noConflict = function () {
	  $.fn.autocenter = old;
	  return this;
	};
	$(function(){
		$(dismiss).filter(dtarget).on('click', dismiss, this.autocenter);
	});
}(jQuery,window.Cauli = window.Cauli || {} );