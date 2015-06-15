var RoleDao = require(_path.src + "/dao/RoleDao.js");

module.exports.roleList = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	RoleDao.getRoleList(function(roleList)
	{
		$(el).html(template({roleList : roleList}));
		next();
	});
};