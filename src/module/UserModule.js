var UserDao = require(_path.src + "/dao/UserDao.js");
var UserVo = require(_path.src + "/vo/UserVo.js");
var RoleDao = require(_path.src + "/dao/RoleDao.js");

module.exports.signedUser = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	var user = req.session.user;
	if(user)
		user.password = null;
	
	$(el).html(template({user : user}));
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

module.exports.user = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	
	var userVo = new UserVo(param);
	UserDao.getUser(userVo, function(user)
	{
		user.password = "null;"
		$(el).html(template(user));
		next();
	});
};