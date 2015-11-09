var UserDao = require(_path.src + "/dao/UserDao.js");
var UserVo = require(_path.src + "/vo/UserVo.js");
var RoleDao = require(_path.src + "/dao/RoleDao.js");

module.exports.signedUser = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	if(req.session.user)
	{
		UserDao.getUserById(req.session.user.id, function(user)
		{
			user.password = "null;"
			$(el).html(template({user : user}));
			next();
		});
	}
	else
	{
		$(el).html(template());
		next();
	}
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

module.exports.user = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	
	UserDao.getUserById(param.id, function(user)
	{
		user.password = "null;"
		$(el).html(template(user));
		next();
	});
};