var dataDao = require(_path.src + "/dao/DataDao.js");
var DataVo = require(_path.src + '/vo/DataVo.js');

module.exports.getData =
{
	type : 'post',
	path : '/data/getData.do',
	callback : function(req, res)
	{
		var param = req.body;
		dataDao.getData(param.id, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.insertData =
{
	type : 'post',
	path : '/data/insertData.do',
	callback : function(req, res)
	{
		var dataVo = new DataVo(req.body);
		dataDao.insertData(dataVo, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS}));
		});
	}
};

module.exports.updateData =
{
	type : 'post',
	path : '/data/updateData.do',
	callback : function(req, res)
	{
		var dataVo = new DataVo(req.body);
		dataDao.updateData(dataVo, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
		});
	}
};

module.exports.deleteData =
{
	type : 'post',
	path : '/data/deleteData.do',
	callback : function(req, res)
	{
		var param = req.body;
		dataDao.deleteData(param.id, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
		});
	}
};