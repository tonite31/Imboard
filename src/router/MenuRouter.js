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
		var menuVo = new MenuVo(req.body);
		menuDao.updateMenu(menuVo, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
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
		menuDao.deleteMenu(param.id, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
		});
	}
};