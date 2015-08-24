module.exports.getDate =
{
	type : 'post',
	path : '/date/getDate.do',
	callback : function(req, res)
	{
		var date = new Date();
		res.end(JSON.stringify({code : _code.SUCCESS, data : date.getTime(), msg : "SUCCESS"}));
	}
};