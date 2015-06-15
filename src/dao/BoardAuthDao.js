var SqlMapClient = require(_path.lib + "/Sqlmapclient.js");

var BoardAuthVo = require(_path.src + "/vo/BoardAuthVo.js");

var BoardAuthDao = function()
{
	this.sqlMapClient = new SqlMapClient("boardAuth");
	
	if(BoardAuthDao.caller != BoardAuthDao.getInstance)
		throw new Error("This BoardAuthDao object cannot be instanciated");
};

BoardAuthDao.instance = null;

BoardAuthDao.getInstance = function(){
	if(this.instance == null)
		this.instance = new BoardAuthDao();
	
	return this.instance;
}

BoardAuthDao.prototype.getBoardAuth = function(boardId, callback)
{
	this.sqlMapClient.selectQuery("getBoardAuth", boardId, callback);
};

BoardAuthDao.prototype.insertBoardAuth = function(boardAuthVo, callback)
{
	this.sqlMapClient.insertQuery("insertBoardAuth", boardAuthVo, callback);
};

BoardAuthDao.prototype.updateBoardAuth = function(boardAuthVo, callback)
{
	this.sqlMapClient.updateQuery("updateBoardAuth", boardAuthVo, callback);
};

BoardAuthDao.prototype.deleteBoardAuth = function(boardId, callback)
{
	this.sqlMapClient.deleteQuery("deleteBoardAuth", boardId, callback);
};

module.exports = BoardAuthDao.getInstance();