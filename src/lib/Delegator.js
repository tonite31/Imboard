(function(exports){

	exports.create = function(ctx, func,args) {
		if(!ctx){
			throw('ctx is can not be undefined');
		}
		
		if(!func){
			throw('func is can not be undefined');
		}
		
		return function(that) {
			return function() {		
				arguments[arguments.length]=args;
				arguments.length++;
				func.apply(that, arguments);
			};
		}(ctx);
	};

})(typeof exports === 'undefined'? this['delegator']={}: exports);