/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/
(function(){var a="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");Math.uuid=function(b,e){var g=a,d=[],c;e=e||g.length;if(b){for(c=0;c<b;c++){d[c]=g[0|Math.random()*e]}}else{var f;d[8]=d[13]=d[18]=d[23]="-";d[14]="4";for(c=0;c<36;c++){if(!d[c]){f=0|Math.random()*16;d[c]=g[(c==19)?(f&3)|8:f]}}}return d.join("")};Math.uuidFast=function(){var f=a,d=new Array(36),c=0,e;for(var b=0;b<36;b++){if(b==8||b==13||b==18||b==23){d[b]="-"}else{if(b==14){d[b]="4"}else{if(c<=2){c=33554432+(Math.random()*16777216)|0}e=c&15;c=c>>4;d[b]=f[(b==19)?(e&3)|8:e]}}}return d.join("")};Math.uuidCompact=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var d=Math.random()*16|0,b=e=="x"?d:(d&3|8);return b.toString(16)})}})();