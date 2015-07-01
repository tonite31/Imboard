var urlAuthDao = require(_path.src + "/dao/UrlAuthDao.js");
var UrlAuthVo = require(_path.src + '/vo/UrlAuthVo.js');
var UserDao = require(_path.src + "/dao/UserDao.js");
var Utils = require(_path.lib + "/Utils.js");

module.exports.getUrlAuthList =
{
	type : 'post',
	path : '/auth/getUrlAuthList.do',
	callback : function(req, res)
	{
		var param = req.body;
		urlAuthDao.getUrlAuthList(param.imboardId, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.checkUrlAuth =
{
	type : 'post',
	path : '/auth/checkUrlAuth.do',
	callback : function(req, res)
	{
		var param = req.body;
		var userVo = new UserVo();
		userVo.id = req.session.user.id;
		UserDao.getUser(userVo, function(member)
		{
			urlAuthDao.getUrlAuth(req.session.imboardId, param.boardId, param.url, function(response)
			{
				if(response.useYn == "Y")
				{
					if(member && member.level <= response.level)
					{
						res.end(JSON.stringify({code : _code.SUCCESS, data : true, msg : "SUCCESS"}));
					}
					else
					{
						res.end(JSON.stringify({code : _code.SUCCESS, data : false, msg : "SUCCESS"}));
					}
				}
				else
				{
					res.end(JSON.stringify({code : _code.SUCCESS, data : true, msg : "SUCCESS"}));
				}
			});
		});
	}
};

module.exports.insertUrlAuth =
{
	type : 'post',
	path : '/auth/insertUrlAuth.do',
	callback : function(req, res)
	{
		var param = req.body;
		var vo = new UrlAuthVo(param);
		
		urlAuthDao.getUrlAuth(vo.url, function(response)
		{
			if(response != null && response.url != null)
			{
				res.end(JSON.stringify({code : _code.DUPLICATED, data : response, msg : "SUCCESS"}));
			}
			else
			{
				urlAuthDao.insertUrlAuth(vo, function(response)
				{
					res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
				});
			}
		});
	}
};

module.exports.updateUrlAuth =
{
	type : 'post',
	path : '/auth/updateUrlAuth.do',
	callback : function(req, res)
	{
		var param = req.body;
		var vo = new UrlAuthVo(param);
		
		if(vo.useYn != "N")
			vo.useYn = "Y";
		
		vo.editable = "Y";
		urlAuthDao.updateUrlAuth(vo, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.deleteUrlAuth =
{
	type : 'post',
	path : '/auth/deleteUrlAuth.do',
	callback : function(req, res)
	{
		var param = req.body;
		urlAuthDao.deleteUrlAuth(param.url, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS}));
		});
	}
};
