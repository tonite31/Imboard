var UserDao = require(_path.src + "/dao/UserDao.js");
var UserVo = require(_path.src + "/vo/UserVo.js");
var RoleDao = require(_path.src + "/dao/RoleDao.js");

module.exports.signedUser = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	$(el).html(template({user : req.session.user}));
	next();
};

module.exports.userList = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	
	UserDao.getUserList(function(userList)
	{
		RoleDao.getRoleList(function(roleList)
		{
			$(el).html(template({userList : userList, roleList : roleList}));
			next();
		});
	});
};

module.exports.getUser = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	
	var userVo = new UserVo(param);
	UserDao.getUser(userVo, function(user)
	{
		$(el).html(template({user : user}));
		next();
	});
};