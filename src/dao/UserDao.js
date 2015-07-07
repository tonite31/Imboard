var UserVo = require(_path.src + "/vo/UserVo.js");
var SqlMapClient = require(_path.lib + "/Sqlmapclient.js");

var UserDao = function()
{
	this.sqlMapClient = new SqlMapClient("user");
	
	if(UserDao.caller != UserDao.getInstance)
		throw new Error("This UserDao object cannot be instanciated");
};

UserDao.instance = null;

UserDao.getInstance = function(){
	if(this.instance == null)
		this.instance = new UserDao();
	
	return this.instance;
}

UserDao.prototype.getUserList = function(callback)
{
	this.sqlMapClient.selectsQuery("getUserList", {}, callback);
};

UserDao.prototype.getUser = function(userVo, callback)
{
	this.sqlMapClient.selectQuery("getUser", userVo, callback);
};

UserDao.prototype.getUserWithInfo = function(userId, callback)
{
	var vo = new UserVo();
	vo.id = userId;
	
	this.sqlMapClient.selectQuery("getUserWithInfo", vo, callback);
};

UserDao.prototype.getEncryptKey = function(id, callback)
{
	this.sqlMapClient.selectQuery("getEncryptKey", id, callback);
};

UserDao.prototype.insertUser = function(userVo, callback)
{
	this.sqlMapClient.insertQuery("insertUser", userVo, callback);
};

UserDao.prototype.updateUser = function(userVo, callback)
{
	this.sqlMapClient.updateQuery("updateUser", userVo, callback);
};

UserDao.prototype.updateLastAccessDate = function(id, callback)
{
	this.sqlMapClient.updateQuery("updateLastAccessDate", id, callback);
};

UserDao.prototype.updateUserPassword = function(id, password, callback)
{
	var vo = new UserVo();
	vo.id = id;
	vo.password = password;
	
	this.sqlMapClient.updateQuery("updateUserPassword", vo, callback);
};

UserDao.prototype.deleteUser = function(userId, callback)
{
	this.sqlMapClient.deleteQuery("deleteUser", userId, callback);
};

module.exports = UserDao.getInstance();