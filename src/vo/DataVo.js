var ImboardDataVo = function(param)
{
	this.id = null;
	this.data = null;
	this.type = null;
	
	ParameterBinder.bind(this, param);
};

module.exports = ImboardDataVo;