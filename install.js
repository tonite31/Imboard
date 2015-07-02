var UserDao = require(_path.src + "/dao/UserDao.js");
var UserVo = require(_path.src + '/vo/UserVo.js');
var Utils = require(_path.src + '/lib/Utils.js');

module.exports = function(callback)
{
	var vo = new UserVo();
	vo.id = "admin";
	
	UserDao.getUser(vo, function(response)
	{
		if(!response)
		{
			vo.displayId = "마스터";
			vo.name = "마스터";
			vo.level = -2;
			UserDao.insertUser(vo, function()
			{
				UserDao.updateUserPassword("admin", Utils.encrypt("admin", _config.encryptKey), function(response)
				{
					if(callback)
						callback();
				});
			});
		}
		else
		{
			callback();
		}
	});
};