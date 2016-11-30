(function(){
  		
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
	
}());