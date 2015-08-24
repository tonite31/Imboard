var DataVo = require(_path.src + "/vo/DataVo.js");
var SqlMapClient = require(_path.lib + "/Sqlmapclient.js");

var DataDao = function()
{
	this.sqlMapClient = new SqlMapClient("data");
	
	if(DataDao.caller != DataDao.getInstance)
		throw new Error("This DataDao object cannot be instanciated");
};

DataDao.instance = null;

DataDao.getInstance = function(){
	if(this.instance == null)
		this.instance = new DataDao();
	
	return this.instance;
}

DataDao.prototype.getData = function(id, callback)
{
	this.sqlMapClient.selectQuery("getData", id, callback);
};

DataDao.prototype.insertData = function(imboardDataVo, callback)
{
	this.sqlMapClient.insertQuery("insertData", imboardDataVo, callback);
};

DataDao.prototype.updateData = function(imboardDataVo, callback)
{
	this.sqlMapClient.updateQuery("updateData", imboardDataVo, callback);
};

DataDao.prototype.deleteData = function(id, callback)
{
	this.sqlMapClient.deleteQuery("deleteData", id, callback);
};

module.exports = DataDao.getInstance();