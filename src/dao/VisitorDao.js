var VisitorVo = require(_path.src + "/vo/VisitorVo.js");
var SqlMapClient = require(_path.lib + "/Sqlmapclient.js");

var VisitorDao = function()
{
	this.sqlMapClient = new SqlMapClient("visitor");
	
	if(VisitorDao.caller != VisitorDao.getInstance)
		throw new Error("This VisitorDao object cannot be instanciated");
};

VisitorDao.instance = null;

VisitorDao.getInstance = function(){
	if(this.instance == null)
		this.instance = new VisitorDao();
	
	return this.instance;
}

VisitorDao.prototype.getVisitorList = function(type, callback)
{
	this.sqlMapClient.selectsQuery("getVisitorList", type, callback);
};

VisitorDao.prototype.getVisitor = function(vo, callback)
{
	this.sqlMapClient.selectQuery("getVisitor", vo, callback);
};

VisitorDao.prototype.insertVisitor = function(ip, userAgent, referer, callback)
{
	var that = this;
	this.sqlMapClient.deleteQuery("deleteVisitor", {}, function()
	{
		var today = new Date();
		
		var vo = new VisitorVo();
		vo.ip = ip;
		vo.userAgent = userAgent;
		vo.referer = referer;
		
		var month = (today.getMonth() + 1);
		month = month < 10 ? "0" + month : month;
		
		var date = today.getDate();
		date = date < 10 ? "0" + date : date;
		
		var hour = today.getHours();
		hour = hour < 10 ? "0" + hour : hour;
		
		var min = today.getMinutes();
		min = min < 10 ? "0" + min : min;
		
		vo.accessDate = today.getFullYear() + "-" + month + "-" + date + " " + hour + ":" + min;
		
		that.getVisitor(vo, function(data)
		{
			if(data == null)
				that.sqlMapClient.insertQuery("insertVisitor", vo, callback);
			else
				callback();
		});
	});
};

module.exports = VisitorDao.getInstance();