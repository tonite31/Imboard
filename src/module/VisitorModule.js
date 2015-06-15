var VisitorDao = require(_path.src + "/dao/VisitorDao.js");

module.exports.visitorList = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	
	var type = "USER_AGENT";
	VisitorDao.getVisitorList(type, function(visitorList)
	{
		$(el).html(template({visitorList : visitorList}));
		next();
	});
};