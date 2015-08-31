var roleDao = require(_path.src + "/dao/RoleDao.js");
var RoleVo = require(_path.src + '/vo/RoleVo.js');

module.exports.getRoleList =
{
	type : 'post',
	path : '/role/getRoleList.do',
	callback : function(req, res)
	{
		var param = req.body;
		roleDao.getRoleList(function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.insertRole =
{
	type : 'post',
	path : '/role/insertRole.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		var vo = new RoleVo(param);
		if(vo.level == null)
		{
			res.end(JSON.stringify({code : _code.KEY_UNDEFINED, msg : "Level is undefined"}));
		}
		else
		{
			roleDao.getRole(vo.level, function(role)
			{
				if(role)
				{
					res.end(JSON.stringify({code : _code.DUPLICATED, msg : "Level is duplicated"}));
				}
				else
				{
					roleDao.insertRole(vo, function(response)
					{
						res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
					});
				}	
			});
		}
	}
};

module.exports.updateRole =
{
	type : 'post',
	path : '/role/updateRole.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		var vo = new RoleVo(param);
		if(vo.level == null)
		{
			res.end(JSON.stringify({code : _code.KEY_UNDEFINED, msg : "Level is undefined"}));
		}
		else
		{
			roleDao.updateRole(vo, function(response)
			{
				res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
			});
		}
	}
};

module.exports.deleteRole =
{
	type : 'post',
	path : '/role/deleteRole.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		var vo = new RoleVo(param);
		if(vo.level == null)
		{
			res.end(JSON.stringify({code : _code.KEY_UNDEFINED, msg : "Level is undefined"}));
		}
		else
		{
			roleDao.deleteRole(vo.level, function(response)
			{
				res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
			});
		}
	}
};