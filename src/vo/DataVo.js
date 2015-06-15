var ImboardDataVo = function(param)
{
	this.id = null;
	this.data = null;
	
	ParameterBinder.bind(this, param);
};

module.exports = ImboardDataVo;