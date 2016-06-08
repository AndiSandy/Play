(function(){
	var hexcase = 0
	  , b64pad = ""
	  , chrsz = 8;
	function hex_md5(a) {
		return binl2hex(core_md5(str2binl(a), a.length * chrsz))
	}
	function b64_md5(a) {
		return binl2b64(core_md5(str2binl(a), a.length * chrsz))
	}
	function str_md5(a) {
		return binl2str(core_md5(str2binl(a), a.length * chrsz))
	}
	function hex_hmac_md5(a, f) {
		return binl2hex(core_hmac_md5(a, f))
	}
	function b64_hmac_md5(a, f) {
		return binl2b64(core_hmac_md5(a, f))
	}
	function str_hmac_md5(a, f) {
		return binl2str(core_hmac_md5(a, f))
	}
	function md5_vm_test() {
		return "900150983cd24fb0d6963f7d28e17f72" == hex_md5("abc")
	}
	function core_md5(a, f) {
		a[f >> 5] |= 128 << f % 32;
		a[(f + 64 >>> 9 << 4) + 14] = f;
		for (var b = 1732584193, c = -271733879, d = -1732584194, e = 271733878, g = 0; g < a.length; g += 16)
			var n = b
			  , l = c
			  , t = d
			  , w = e
			  , b = md5_ff(b, c, d, e, a[g + 0], 7, -680876936)
			  , e = md5_ff(e, b, c, d, a[g + 1], 12, -389564586)
			  , d = md5_ff(d, e, b, c, a[g + 2], 17, 606105819)
			  , c = md5_ff(c, d, e, b, a[g + 3], 22, -1044525330)
			  , b = md5_ff(b, c, d, e, a[g + 4], 7, -176418897)
			  , e = md5_ff(e, b, c, d, a[g + 5], 12, 1200080426)
			  , d = md5_ff(d, e, b, c, a[g + 6], 17, -1473231341)
			  , c = md5_ff(c, d, e, b, a[g + 7], 22, -45705983)
			  , b = md5_ff(b, c, d, e, a[g + 8], 7, 1770035416)
			  , e = md5_ff(e, b, c, d, a[g + 9], 12, -1958414417)
			  , d = md5_ff(d, e, b, c, a[g + 10], 17, -42063)
			  , c = md5_ff(c, d, e, b, a[g + 11], 22, -1990404162)
			  , b = md5_ff(b, c, d, e, a[g + 12], 7, 1804603682)
			  , e = md5_ff(e, b, c, d, a[g + 13], 12, -40341101)
			  , d = md5_ff(d, e, b, c, a[g + 14], 17, -1502002290)
			  , c = md5_ff(c, d, e, b, a[g + 15], 22, 1236535329)
			  , b = md5_gg(b, c, d, e, a[g + 1], 5, -165796510)
			  , e = md5_gg(e, b, c, d, a[g + 6], 9, -1069501632)
			  , d = md5_gg(d, e, b, c, a[g + 11], 14, 643717713)
			  , c = md5_gg(c, d, e, b, a[g + 0], 20, -373897302)
			  , b = md5_gg(b, c, d, e, a[g + 5], 5, -701558691)
			  , e = md5_gg(e, b, c, d, a[g + 10], 9, 38016083)
			  , d = md5_gg(d, e, b, c, a[g + 15], 14, -660478335)
			  , c = md5_gg(c, d, e, b, a[g + 4], 20, -405537848)
			  , b = md5_gg(b, c, d, e, a[g + 9], 5, 568446438)
			  , e = md5_gg(e, b, c, d, a[g + 14], 9, -1019803690)
			  , d = md5_gg(d, e, b, c, a[g + 3], 14, -187363961)
			  , c = md5_gg(c, d, e, b, a[g + 8], 20, 1163531501)
			  , b = md5_gg(b, c, d, e, a[g + 13], 5, -1444681467)
			  , e = md5_gg(e, b, c, d, a[g + 2], 9, -51403784)
			  , d = md5_gg(d, e, b, c, a[g + 7], 14, 1735328473)
			  , c = md5_gg(c, d, e, b, a[g + 12], 20, -1926607734)
			  , b = md5_hh(b, c, d, e, a[g + 5], 4, -378558)
			  , e = md5_hh(e, b, c, d, a[g + 8], 11, -2022574463)
			  , d = md5_hh(d, e, b, c, a[g + 11], 16, 1839030562)
			  , c = md5_hh(c, d, e, b, a[g + 14], 23, -35309556)
			  , b = md5_hh(b, c, d, e, a[g + 1], 4, -1530992060)
			  , e = md5_hh(e, b, c, d, a[g + 4], 11, 1272893353)
			  , d = md5_hh(d, e, b, c, a[g + 7], 16, -155497632)
			  , c = md5_hh(c, d, e, b, a[g + 10], 23, -1094730640)
			  , b = md5_hh(b, c, d, e, a[g + 13], 4, 681279174)
			  , e = md5_hh(e, b, c, d, a[g + 0], 11, -358537222)
			  , d = md5_hh(d, e, b, c, a[g + 3], 16, -722521979)
			  , c = md5_hh(c, d, e, b, a[g + 6], 23, 76029189)
			  , b = md5_hh(b, c, d, e, a[g + 9], 4, -640364487)
			  , e = md5_hh(e, b, c, d, a[g + 12], 11, -421815835)
			  , d = md5_hh(d, e, b, c, a[g + 15], 16, 530742520)
			  , c = md5_hh(c, d, e, b, a[g + 2], 23, -995338651)
			  , b = md5_ii(b, c, d, e, a[g + 0], 6, -198630844)
			  , e = md5_ii(e, b, c, d, a[g + 7], 10, 1126891415)
			  , d = md5_ii(d, e, b, c, a[g + 14], 15, -1416354905)
			  , c = md5_ii(c, d, e, b, a[g + 5], 21, -57434055)
			  , b = md5_ii(b, c, d, e, a[g + 12], 6, 1700485571)
			  , e = md5_ii(e, b, c, d, a[g + 3], 10, -1894986606)
			  , d = md5_ii(d, e, b, c, a[g + 10], 15, -1051523)
			  , c = md5_ii(c, d, e, b, a[g + 1], 21, -2054922799)
			  , b = md5_ii(b, c, d, e, a[g + 8], 6, 1873313359)
			  , e = md5_ii(e, b, c, d, a[g + 15], 10, -30611744)
			  , d = md5_ii(d, e, b, c, a[g + 6], 15, -1560198380)
			  , c = md5_ii(c, d, e, b, a[g + 13], 21, 1309151649)
			  , b = md5_ii(b, c, d, e, a[g + 4], 6, -145523070)
			  , e = md5_ii(e, b, c, d, a[g + 11], 10, -1120210379)
			  , d = md5_ii(d, e, b, c, a[g + 2], 15, 718787259)
			  , c = md5_ii(c, d, e, b, a[g + 9], 21, -343485551)
			  , b = safe_add(b, n)
			  , c = safe_add(c, l)
			  , d = safe_add(d, t)
			  , e = safe_add(e, w);
		return [b, c, d, e]
	}
	function md5_cmn(a, f, b, c, d, e) {
		return safe_add(bit_rol(safe_add(safe_add(f, a), safe_add(c, e)), d), b)
	}
	function md5_ff(a, f, b, c, d, e, g) {
		return md5_cmn(f & b | ~f & c, a, f, d, e, g)
	}
	function md5_gg(a, f, b, c, d, e, g) {
		return md5_cmn(f & c | b & ~c, a, f, d, e, g)
	}
	function md5_hh(a, f, b, c, d, e, g) {
		return md5_cmn(f ^ b ^ c, a, f, d, e, g)
	}
	function md5_ii(a, f, b, c, d, e, g) {
		return md5_cmn(b ^ (f | ~c), a, f, d, e, g)
	}
	function core_hmac_md5(a, f) {
		var b = str2binl(a);
		16 < b.length && (b = core_md5(b, a.length * chrsz));
		for (var c = Array(16), d = Array(16), e = 0; 16 > e; e++)
			c[e] = b[e] ^ 909522486,
			d[e] = b[e] ^ 1549556828;
		b = core_md5(c.concat(str2binl(f)), 512 + f.length * chrsz);
		return core_md5(d.concat(b), 640)
	}
	function safe_add(a, f) {
		var b = (a & 65535) + (f & 65535);
		return (a >> 16) + (f >> 16) + (b >> 16) << 16 | b & 65535
	}
	function bit_rol(a, f) {
		return a << f | a >>> 32 - f
	}
	function str2binl(a) {
		for (var f = [], b = (1 << chrsz) - 1, c = 0; c < a.length * chrsz; c += chrsz)
			f[c >> 5] |= (a.charCodeAt(c / chrsz) & b) << c % 32;
		return f
	}
	function binl2str(a) {
		for (var f = "", b = (1 << chrsz) - 1, c = 0; c < 32 * a.length; c += chrsz)
			f += String.fromCharCode(a[c >> 5] >>> c % 32 & b);
		return f
	}
	function binl2hex(a) {
		for (var f = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", b = "", c = 0; c < 4 * a.length; c++)
			b += f.charAt(a[c >> 2] >> c % 4 * 8 + 4 & 15) + f.charAt(a[c >> 2] >> c % 4 * 8 & 15);
		return b
	}
	function binl2b64(a) {
		for (var f = "", b = 0; b < 4 * a.length; b += 3)
			for (var c = (a[b >> 2] >> b % 4 * 8 & 255) << 16 | (a[b + 1 >> 2] >> (b + 1) % 4 * 8 & 255) << 8 | a[b + 2 >> 2] >> (b + 2) % 4 * 8 & 255, d = 0; 4 > d; d++)
				f = 8 * b + 6 * d > 32 * a.length ? f + b64pad : f + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c >> 6 * (3 - d) & 63);
		return f
	}
	function _ec_replace(a, f, b) {
		if (-1 < a.indexOf("&" + f + "=") || 0 === a.indexOf(f + "=")) {
			var c = a.indexOf("&" + f + "="), d;
			-1 === c && (c = a.indexOf(f + "="));
			d = a.indexOf("&", c + 1);
			return -1 !== d ? a.substr(0, c) + a.substr(d + (c ? 0 : 1)) + "&" + f + "=" + b : a.substr(0, c) + "&" + f + "=" + b
		}
		return a + "&" + f + "=" + b
	}
	var _baseKeyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	function _utf8_encode(a) {
		a = a.replace(/\r\n/g, "\n");
		for (var f = "", b = 0, c = a.length, d; b < c; b++)
			d = a.charCodeAt(b),
			128 > d ? f += String.fromCharCode(d) : (127 < d && 2048 > d ? f += String.fromCharCode(d >> 6 | 192) : (f += String.fromCharCode(d >> 12 | 224),
			f += String.fromCharCode(d >> 6 & 63 | 128)),
			f += String.fromCharCode(d & 63 | 128));
		return f
	}
	function encode(a) {
		var f = "", b, c, d, e, g, n, l = 0;
		for (a = _utf8_encode(a); l < a.length; )
			b = a.charCodeAt(l++),
			c = a.charCodeAt(l++),
			d = a.charCodeAt(l++),
			e = b >> 2,
			b = (b & 3) << 4 | c >> 4,
			g = (c & 15) << 2 | d >> 6,
			n = d & 63,
			isNaN(c) ? g = n = 64 : isNaN(d) && (n = 64),
			f = f + _baseKeyStr.charAt(e) + _baseKeyStr.charAt(b) + _baseKeyStr.charAt(g) + _baseKeyStr.charAt(n);
		return f
	}
	
	(function(){
		var f = "", b, c, d, e, g = 0, n, l, t = NaN, w = !1, K = !1;
		Rp = "dr";
		fstr = ul = "";
		var A = {}, B = {}, C = {}, D, E, F, G, L, W = 0, p = [], q = [];
		D = function(a) {
			var b = a || window.event;
			if ("mousemove" != b.type || 0 == W++ % 2) {
				var c = (new Date).getTime() - e
				  , d = ++g
				  , f = H(b.target || b.srcElement);
				h(10, [c, A[b.type], d, "mousedown" == b.type ? b.which ? b.which : [0, 1, 3, 0, 2][b.button] : 0, f, a.pageX || a.clientX + document.body.scrollLeft, a.pageY || a.clientY + document.body.scrollHeight, b.clientX, b.clientY])
			}
		}
		;
		E = function(b) {
			b = b || window.event;
			var a = (new Date).getTime() - e
			  , c = b.target || b.srcElement;
			if ("input" != c.tagName.toLowerCase() || "password" != c.type.toLowerCase()) {
				var d = ++g
				  , f = H(c)
				  , v = b.keyCode
				  , r = 0;
				b.ctrlKey && 17 != v && (r += 1);
				b.altKey && 18 != v && (r += 2);
				b.shiftKey && 16 != v && (r += 4);
				b.metaKey && 91 != v && (r += 8);
				h(11, [a, B[b.type], d, v, r, f, c.value])
			}
		}
		;
		F = function(b) {
			b = b || window.event;
			var a = (new Date).getTime() - e
			  , c = ++g;
			h(12, [a, C[b.type], c])
		}
		;
		G = function() {
			var b = (new Date).getTime();
			h(9, [L, b])
		}
		;
		var m = function(b) {
			"function" === (typeof b).toLowerCase() && (b = "" + b);
			if (null  == b)
				return null ;
			for (var a = 64222, c = 0; c < b.length; c++)
				a ^= (a << 8) + (a >>> 3) + b.charCodeAt(c);
			return a
		}
		, z, X = function(b) {
			z();
			for (var a = "", c = m(f) >> 3 & 255, d = 0; d < b.length; d++)
				a += String.fromCharCode((b.charCodeAt(d) ^ (0 == d ? c : a.charCodeAt(d - 1))) & 255);
			return a
		}
		, I = function(b, a) {
			for (var c = b.length; c--; )
				if (b[c] === a)
					return !0;
			return !1
		}
		, k = "abcdefghijklmnoqprstuvwxyz", Y = function(b) {
			z();
			for (var a = "", c, d = 0; b.length >= d + 3; )
				c = (b.charCodeAt(d++) & 255) << 16 | (b.charCodeAt(d++) & 255) << 8 | b.charCodeAt(d++) & 255,
				a += k.charAt((c & 16515072) >> 18),
				a += k.charAt((c & 258048) >> 12),
				a += k.charAt((c & 4032) >> 6),
				a += k.charAt(c & 63);
			0 < b.length - d && (c = (b.charCodeAt(d++) & 255) << 16 | (b.length > d ? (b.charCodeAt(d) & 255) << 8 : 0),
			a += k.charAt((c & 16515072) >> 18),
			a += k.charAt((c & 258048) >> 12),
			a += b.length > d ? k.charAt((c & 4032) >> 6) : "=",
			a += "=");
			return a
		}
		, h = function(a, d) {
			z();
			var g = (12 < f.length ? "^" : "") + a + Z(d).replace(/[\t\r\n\x0B\f]/g, " ");
			if (w) {
				10 == a && p.push(g);
				11 == a && q.push(g);
				10 != a && 11 != a && 800 > f.length && 400 > g.length && (f += g);
				var g = (new Date).getTime() - e
				  , x = []
				  , y = []
				  , x = 8 < q.length ? q.slice(q.length - 8) : q
				  , y = 8 < p.length ? p.slice(p.length - 8) : p
				  , x = x.join("")
				  , y = y.join("")
				  , g = encode(g + "^" + f + y + x)
				  , g = hex_md5(Rp + g).toUpperCase() + g;
				b ? b.value = g : window[c] = g
			}
		}
		, M = function(b) {
			d = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(b) {
				var a = 16 * Math.random() | 0;
				return ("x" == b ? a : a & 3 | 8).toString(16)
			}
			);
			e = (new Date).getTime();
			ul = b.url;
			h(0, [d, e, b.appKey, b.token])
		}
		, N = function() {
			var b = [navigator.userAgent, navigator.platform, -1 * (new Date).getTimezoneOffset(), navigator.language || navigator.userLanguage.toLowerCase()];
			h(1, b)
		}
		, O = function() {
			h(2, [window.mozInnerScreenX || window.screenLeft || 0, window.mozInnerScreenY || window.screenTop || 0, document.body.clientWidth, document.body.clientHeight, screen.width, screen.height, screen.availWidth, screen.availHeight])
		}
		, P = function() {
			if (isNaN(t)) {
				var b = []
				  , a = navigator.plugins.length;
				2 < a && (a = 2);
				for (var c = 0; c < a; c++) {
					var d = navigator.plugins[c];
					b.push(d.name + (d.version ? " " + d.version : ""))
				}
				h(3, b)
			}
		}
		, Q = function() {
			isNaN(t) && h(4, [])
		}
		, R = function() {
			var b = [document.getElementsByTagName("iframe").length, document.forms.length, document.getElementsByTagName("input").length, document.getElementsByTagName("script").length, document.images.length];
			h(5, b)
		}
		;
		n = m(arguments.callee);
		var S = function() {
			if (isNaN(t)) {
				var b = []
				  , a = document.getElementsByTagName("script")
				  , c = a.length;
				2 < c && (c = 2);
				for (var d = 0; d < c; d++)
					b.push("" == a[d].src ? m(a[d].text) : a[d].src.substring(0, 20));
				h(6, b)
			}
		}
		  , T = []
		  , aa = function(b) {
			for (var a = 0, c = 0, d = b.offsetWidth, e = b.offsetHeight; b; )
				a += b.offsetLeft,
				c += b.offsetTop,
				b = b.offsetParent;
			return [a, c, d, e]
		}
		  , H = function(b) {
			var a;
			a = b;
			for (var c = []; a && 1 == a.nodeType; a = a.parentNode) {
				var d = 0;
				if (a && a.id) {
					c.splice(0, 0, "#" + a.id);
					break
				}
				for (var e = a.previousSibling; e; e = e.previousSibling)
					10 != e.nodeType && e.nodeName == a.nodeName && ++d;
				e = a.nodeName.toLowerCase();
				c.splice(0, 0, e + (d ? d : ""))
			}
			a = c.length ? c.join(">") : null ;
			c = m(a);
			if (I(T, c))
				return c;
			T.push(c);
			1E3 > f && h(7, [c, a].concat(aa(b)));
			return c
		}
		  , U = function() {
			var a = location.href
			  , b = document.referrer
			  , a = a.substring(0, 10);
			100 < b.length && (b = "ref");
			h(8, [a, b, history.length, n])
		}
		  , V = function() {
			var a = document.createElement("img");
			a.width = a.height = 0;
			L = (new Date).getTime();
			a.onload = G
		}
		  , J = function(a, b, c) {
			for (var d in a)
				a.hasOwnProperty(d) && (c.addEventListener ? c.addEventListener(a[d], b, !1) : c.attachEvent("on" + a[d], b, !1))
		}
		  , k = k + "ABCDEFGHJIKLMNOPQRSTUVWXYZ"
		  , ba = function() {
			var a = []
			  , b = !1
			  , c = function(a, b) {
				a.apply(this, b || [])
			}
			  , d = function() {
				b = !0;
				for (var d = 0; d < a.length; d++)
					c(a[d].fn, a[d].args || []);
				a = []
			}
			;
			this.add = function(d, e) {
				b ? c(d, e) : a[a.length] = {
					fn: d,
					args: e
				};
				return this
			}
			;
			window.addEventListener ? window.document.addEventListener("DOMContentLoaded", function() {
				d()
			}
			, !1) : function() {
				if (window.document.uniqueID || !window.document.expando) {
					var a = window.document.createElement("document:ready");
					try {
						a.doScroll("left"),
						d()
					} catch (b) {
						setTimeout(arguments.callee, 0)
					}
				}
			}
			();
			return this
		}
		();
		z = function() {
			if (!l) {
				l = {};
				var a = {};
				a[m(X)] = [h];
				a[m(Y)] = [h];
				a[m(h)] = [N, O, R, Q, H, E, D, F, V, U, P, M, S, G, arguments.callee];
				for (var b in a)
					if (a.hasOwnProperty(b)) {
						var c = l[b] = [], d;
						for (d in a[b])
							a[b].hasOwnProperty(d) && c.push(m(a[b][d]))
					}
			}
			a = arguments.callee.caller;
			b = m(a);
			b in l ? (c = m(a.caller),
			I(l[b], c) || h(13, [0, "" + a.caller, b])) : h(13, [1, "" + a, b])
		}
		;
		var Z = function(a) {
			var b = /[\t\r\n\x0B\f]/g
			  , c = function(a) {
				b.lastIndex = 0;
				return b.test(a) ? '"' + a.replace(b, function(a) {
					var b = I[a];
					return "string" === typeof b ? b : eval("\\u") + ("0000" + a.charCodeAt(0).toString(16).slice(-4))
				}
				) + '"' : '"' + a + '"'
			}
			  , d = function(a, b) {
				var e, g, f = b[a];
				switch (typeof f) {
				case "string":
					return c(f);
				case "number":
					return isFinite(f) ? String(f) : "null";
				case "object":
					if (!f)
						return "null";
					g = [];
					if ("[object Array]" === Object.prototype.toString.apply(f)) {
						e = f.length;
						for (var u = 0; u < e; u += 1)
							g[u] = d(u, f) || "null";
						return e = 0 === g.length ? "[]" : "[" + g.join(",") + "]"
					}
					return null ;
				default:
					return null 
				}
			}
			;
			return d("", {
				"": a
			})
		};

		var rst = function() {
			var a = (new Date).getTime() - e
			  , b = []
			  , c = []
			  , b = 7 < q.length ? q.slice(q.length - 7) : q
			  , c = 7 < p.length ? p.slice(p.length - 7) : p
			  , b = b.join("")
			  , c = c.join("")
			  , a = encode(a + "^" + f + c + b);
			return hex_md5(Rp + a).toUpperCase() + a
		}
		$.extend(window._ = window._  || {} ,{
			rst : rst,
		});

	}());
	
}());