var UrlAuthVo = require(_path.src + "/vo/UrlAuthVo.js");
var SqlMapClient = require(_path.lib + "/Sqlmapclient.js");

var UrlAuthDao = function()
{
	this.sqlMapClient = new SqlMapClient("urlAuth");
	
	if(UrlAuthDao.caller != UrlAuthDao.getInstance)
		throw new Error("This UrlAuthDao object cannot be instanciated");
};

UrlAuthDao.instance = null;

UrlAuthDao.getInstance = function(){
	if(this.instance == null)
		this.instance = new UrlAuthDao();
	
	return this.instance;
}

UrlAuthDao.prototype.getUrlAuthList = function(callback)
{
	this.sqlMapClient.selectsQuery("getUrlAuthList", {}, callback);
};

UrlAuthDao.prototype.matchUrlAuth = function(url, useYn, callback)
{
	var vo = new UrlAuthVo();
	vo.url = url;
	
	this.sqlMapClient.selectsQuery("matchUrlAuth", vo, callback);
};

UrlAuthDao.prototype.getUrlAuth = function(url, callback)
{
	var vo = new UrlAuthVo();
	vo.url = url;
	
	this.sqlMapClient.selectQuery("getUrlAuth", vo, callback);
};

UrlAuthDao.prototype.checkUrlAuth = function(url, level, boardId, useYn, callback)
{
	var vo = new UrlAuthVo();
	vo.url = url;
	vo.level = level;
	vo.boardId = boardId;
	vo.useYn = useYn;
	
	this.sqlMapClient.selectQuery("checkUrlAuth", vo, callback);
};

UrlAuthDao.prototype.insertUrlAuth = function(urlAuthVo, callback)
{
	if(urlAuthVo.editable == null)
		urlAuthVo.editable = "Y";
	
	this.sqlMapClient.insertQuery("insertUrlAuth", urlAuthVo, callback);
};

UrlAuthDao.prototype.updateUrlAuth = function(urlAuthVo, callback)
{
	if(urlAuthVo.editable == null)
		urlAuthVo.editable = "Y";
	
	this.sqlMapClient.updateQuery("updateUrlAuth", urlAuthVo, callback);
};

UrlAuthDao.prototype.deleteUrlAuth = function(url, callback)
{
	this.sqlMapClient.deleteQuery("deleteUrlAuth", url, callback);
};

module.exports = UrlAuthDao.getInstance();