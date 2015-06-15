var SqlMapClient = require(_path.lib + "/Sqlmapclient.js");

var BoardVo = require(_path.src + "/vo/BoardVo.js");

var BoardDao = function()
{
	this.sqlMapClient = new SqlMapClient("board");
	
	if(BoardDao.caller != BoardDao.getInstance)
		throw new Error("This BoardDao object cannot be instanciated");
};

BoardDao.instance = null;

BoardDao.getInstance = function(){
	if(this.instance == null)
		this.instance = new BoardDao();
	
	return this.instance;
}

BoardDao.prototype.getBoardList = function(callback)
{
	this.sqlMapClient.selectsQuery("getBoardList", {}, callback);
};

BoardDao.prototype.getBoardListWithAuth = function(callback)
{
	this.sqlMapClient.selectsQuery("getBoardListWithAuth", {}, callback);
};

BoardDao.prototype.getBoard = function(id, callback)
{
	var boardVo = new BoardVo();
	boardVo.id = id;
	
	this.sqlMapClient.selectQuery("getBoard", boardVo, callback);
};

BoardDao.prototype.getBoardByName = function(name, callback)
{
	var boardVo = new BoardVo();
	boardVo.name = name;
	
	this.sqlMapClient.selectsQuery("getBoardByName", boardVo, callback);
};

BoardDao.prototype.insertBoard = function(boardVo, callback)
{
	this.sqlMapClient.insertQuery("insertBoard", boardVo, callback);
};

BoardDao.prototype.updateBoard = function(boardVo, callback)
{
	this.sqlMapClient.updateQuery("updateBoard", boardVo, callback);
};

BoardDao.prototype.deleteBoard = function(id, callback)
{
	var boardVo = new BoardVo();
	boardVo.id = id;
	
	this.sqlMapClient.deleteQuery("deleteBoard", boardVo, callback);
};

module.exports = BoardDao.getInstance();