var DataVo = require(_path.src + "/vo/DataVo.js");
var DataDao = require(_path.src + "/dao/DataDao.js");

module.exports.data = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	
	DataDao.getData(param.id, function(data)
	{
		$(el).html(template(data));
		next();
	});
};