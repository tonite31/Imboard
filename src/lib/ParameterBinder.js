var parseValue = {
	int : function(value){return parseInt(value);},
	integer : function(value){return parseInt(value);},
	float : function(value){return parseFloat(value);},
	double : function(value){return parseDouble(value);}
};

module.exports.bind = function(obj, param)
{
	for(var key in param)
	{
		if(obj.hasOwnProperty(key))
		{
			obj[key] = param[key];
		}
	}
};