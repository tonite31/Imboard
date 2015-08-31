var SqlMapClient = require(_path.lib + "/Sqlmapclient.js");

var MenuVo = require(_path.src + "/vo/MenuVo.js");

var MenuDao = function()
{
	this.sqlMapClient = new SqlMapClient("menu");

	if(MenuDao.caller != MenuDao.getInstance)
		throw new Error("This MenuDao object cannot be instanciated");
};

MenuDao.instance = null;

MenuDao.getInstance = function(){
	if(this.instance == null)
		this.instance = new MenuDao();

	return this.instance;
}

MenuDao.prototype.getMenuList = function(parentMenuId, callback)
{
	this.sqlMapClient.selectsQuery("getMenuList", {parentMenuId : parentMenuId}, callback);
};

MenuDao.prototype.searchMenu = function(menuVo, callback)
{
	this.sqlMapClient.selectsQuery("searchMenu", menuVo, callback);
};

MenuDao.prototype.getMenu = function(id, callback)
{
	this.sqlMapClient.selectQuery("getMenu", id, callback);
};

MenuDao.prototype.getNextPriority = function(callback)
{
	this.sqlMapClient.selectQuery("getNextPriority", null, callback);
};

MenuDao.prototype.insertMenu = function(menuVo, callback)
{
	this.sqlMapClient.insertQuery("insertMenu", menuVo, callback);
};

MenuDao.prototype.updateMenu = function(menuVo, callback)
{
	this.sqlMapClient.updateQuery("updateMenu", menuVo, callback);
};

MenuDao.prototype.deleteMenu = function(id, callback)
{
	this.sqlMapClient.deleteQuery("deleteMenu", id, callback);
	this.sqlMapClient.deleteQuery("deleteMenuByParentMenuId", id, callback);
};

module.exports = MenuDao.getInstance();
