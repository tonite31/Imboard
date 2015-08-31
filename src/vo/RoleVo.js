var RoleVo = function(param)
{
	this.level = null;
	this.name = null;
	this.point = null;
	
	ParameterBinder.bind(this, param);
};

module.exports = RoleVo;