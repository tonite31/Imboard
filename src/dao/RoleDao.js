var RoleVo = require(_path.src + "/vo/RoleVo.js");
var SqlMapClient = require(_path.lib + "/Sqlmapclient.js");

var RoleDao = function()
{
	this.sqlMapClient = new SqlMapClient("role");
	
	if(RoleDao.caller != RoleDao.getInstance)
		throw new Error("This RoleDao object cannot be instanciated");
};

RoleDao.instance = null;

RoleDao.getInstance = function(){
	if(this.instance == null)
		this.instance = new RoleDao();
	
	return this.instance;
}

RoleDao.prototype.getRoleList = function(callback)
{
	this.sqlMapClient.selectsQuery("getRoleList", {}, callback);
};

RoleDao.prototype.getRole = function(level, callback)
{
	var vo = new RoleVo();
	vo.level = level;
	
	this.sqlMapClient.selectQuery("getRole", vo, callback);
};

RoleDao.prototype.insertRole = function(roleVo, callback)
{
	if(roleVo.editable == null)
		roleVo.editable = "Y";
	
	this.sqlMapClient.insertQuery("insertRole", roleVo, callback);
};

RoleDao.prototype.updateRole = function(roleVo, callback)
{
	if(roleVo.editable == null)
		roleVo.editable = "Y";
	
	this.sqlMapClient.updateQuery("updateRole", roleVo, callback);
};

RoleDao.prototype.deleteRole = function(level, callback)
{
	var vo = new RoleVo();
	vo.level = level;
	
	this.sqlMapClient.deleteQuery("deleteRole", vo, callback);
};

module.exports = RoleDao.getInstance();