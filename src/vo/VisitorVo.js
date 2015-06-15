var VisitorVo = function(param)
{
	this.ip = null;
	this.userAgent = null;
	this.referer = null;
	this.accessDate = null;
	this.count = null;
	this.type = null;
	
	ParameterBinder.bind(this, param);
};

module.exports = VisitorVo;