var UrlAuthDao = require(_path.src + "/dao/UrlAuthDao.js");
var RoleDao = require(_path.src + "/dao/RoleDao.js");

module.exports.urlAuthListWithRole = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	UrlAuthDao.getUrlAuthList(function(urlAuthList)
	{
		RoleDao.getRoleList(function(roleList)
		{
			$(el).html(template({urlAuthList : urlAuthList, roleList : roleList}));
			next();
		});
	});
};