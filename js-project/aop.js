Function.prototype.before = function( func ){
	var __self = this;
	return function(){
		if( func.apply( this, arguments ) === false ){
			return false;
		}
		return __self.apply( this, arguments );
	};
};
Function.prototype.after = function( func ){
	var __self = this;
	return function(){
		var ret = __self.apply( this, arguments );
		if( ret === false ){
			return false;
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