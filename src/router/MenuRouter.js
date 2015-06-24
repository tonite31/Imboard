var menuDao = require(_path.src + "/dao/MenuDao.js");
var MenuVo = require(_path.src + '/vo/MenuVo.js');

module.exports.getMenuList =
{
	type : 'post',
	path : '/menu/getMenuList.do',
	callback : function(req, res)
	{
		menuDao.getMenuList("", function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.getMenu =
{
	type : 'post',
	path : '/menu/getMenu.do',
	callback : function(req, res)
	{
		var param = req.body;
		menuDao.getMenu(new MenuVo(param), function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.insertMenu =
{
	type : 'post',
	path : '/menu/insertMenu.do',
	callback : function(req, res)
	{
		var menuVo = new MenuVo();
		menuVo.id = req.body.id
		menuDao.getMenu(menuVo, function(menu)
		{
			if(!menu || menu.length == 0)
			{
				menuVo = new MenuVo(req.body);
				if(menuVo.id != menuVo.parentMenuId)
				{
					if(req.session.user)
						menuVo.creator = req.session.user.id;
					
					menuDao.insertMenu(menuVo, function(response)
					{
						res.end(JSON.stringify({code : _code.SUCCESS}));
					});
				}
				else
				{
					res.end(JSON.stringify({code : _code.FAIL, msg : "menu.id equals menu.parentMenuId"}));
				}
			}
			else if(menu.length > 0)
			{
				res.end(JSON.stringify({code : _code.DUPLICATED, msg : "DUPLICATED"}));
			}
		});
	}
};

module.exports.updateMenu =
{
	type : 'post',
	path : '/menu/updateMenu.do',
	callback : function(req, res)
	{
		var menuVo = new MenuVo();
		menuVo.id = req.body.id;
		menuDao.getMenu(menuVo, function(response)
		{
			if(req.session.user && (req.session.user.level < 0 || response.creator == req.session.user.id))
			{
				menuVo = new MenuVo(req.body);
				menuDao.updateMenu(menuVo, function(response)
				{
					res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
				});
			}
			else
			{
				res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : _code.ACCESS_DENIED, msg : "ACCESS_DENIED"}));
			}
		});
	}
};

module.exports.deleteMenu =
{
	type : 'post',
	path : '/menu/deleteMenu.do',
	callback : function(req, res)
	{
		var param = req.body;
		var menuVo = new MenuVo();
		menuVo.id = param.id;
		
		menuDao.getMenu(menuVo, function(response)
		{
			if(req.session.user && (req.session.user.level < 0 || response.creator == req.session.user.id))
			{
				menuDao.deleteMenu(param.id, function(response)
				{
					res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
				});
			}
			else
			{
				res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : _code.ACCESS_DENIED, msg : "ACCESS_DENIED"}));
			}
		});
	}
};