var MenuVo = function(param)
{
	this.id = null;
	this.name = null;
	this.type = null;
	this.parameter = null;
	this.priority = null;
	this.parentMenuId = null;
	this.viewLevel = null;
	this.childMenuCount = null;
	
	ParameterBinder.bind(this, param);
};

module.exports = MenuVo;