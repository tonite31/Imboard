var visitorDao = require(_path.src + "/dao/VisitorDao.js");
var VisitorVo = require(_path.src + '/vo/VisitorVo.js');

module.exports.getVisitorList =
{
	type : 'post',
	path : '/visitor/getVisitorList.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		var type = "USER_AGENT";
		if(param.type == "referer")
			type = "REFERER";
		else if(param.type == "date")
			type = "ACCESS_DATE";
		
		visitorDao.getVisitorList(type, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};