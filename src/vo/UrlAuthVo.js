var UrlAuthVo = function(param)
{
	this.level = null;
	this.useYn = null;
	this.url = null;
	
	ParameterBinder.bind(this, param);
};

module.exports = UrlAuthVo;