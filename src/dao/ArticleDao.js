var SqlMapClient = require(_path.lib + "/Sqlmapclient.js");
var ArticleVo = require(_path.src + "/vo/ArticleVo.js");

var ArticleDao = function()
{
	this.sqlMapClient = new SqlMapClient("article");
	
	if(ArticleDao.caller != ArticleDao.getInstance)
		throw new Error("This ArticleDao object cannot be instanciated");
};

ArticleDao.instance = null;

ArticleDao.getInstance = function(){
	if(this.instance == null)
		this.instance = new ArticleDao();
	
	return this.instance;
}

ArticleDao.prototype.getNextSeq = function(boardId, callback)
{
	var vo = new ArticleVo();
	vo.boardId = boardId;
	
	this.sqlMapClient.selectQuery("getNextSeq", vo, callback);
};

ArticleDao.prototype.getArticleListCount = function(boardId, searchData, callback)
{
	var vo = new ArticleVo();
	vo.boardId = boardId;
	
	if(searchData)
		ParameterBinder.bind(vo, searchData);
	
	vo.useOrderByGroupId = vo.useOrderByGroupId == "N" ? null : "Y";
	vo.useOrderBySeq = vo.useOrderBySeq == "N" ? null : "Y";
	
	if(!vo.orderByGroupId)
		vo.orderByGroupId = "DESC";
	else
		vo.orderByGroupId = vo.orderByGroupId.toUpperCase();

	this.sqlMapClient.selectQuery("getArticleListCount", vo, callback);
};

ArticleDao.prototype.getArticleList = function(boardId, searchData, callback)
{
	var vo = new ArticleVo();
	vo.boardId = boardId;
	
	if(searchData)
		ParameterBinder.bind(vo, searchData);
	
	vo.useOrderByGroupId = vo.useOrderByGroupId == "N" ? null : "Y";
	vo.useOrderBySeq = vo.useOrderBySeq == "N" ? null : "Y";
	
	if(!vo.registerDateType)
		vo.registerDateType = "short";
	
	if(!vo.orderByGroupId)
		vo.orderByGroupId = "DESC";
	else
		vo.orderByGroupId = vo.orderByGroupId.toUpperCase();
	
	this.sqlMapClient.selectsQuery("getArticleList", vo, callback);
};

ArticleDao.prototype.getArticle = function(boardId, seq, searchData, callback)
{
	var vo = new ArticleVo();
	vo.boardId = boardId;
	vo.seq = seq;
	
	if(searchData)
		ParameterBinder.bind(vo, searchData);
	
	if(!vo.registerDateType)
		vo.registerDateType = "short";
	
	this.sqlMapClient.selectQuery("getArticle", vo, callback);
};

ArticleDao.prototype.insertArticle = function(articleVo, callback)
{
	this.sqlMapClient.insertQuery("insertArticle", articleVo, callback);
};

ArticleDao.prototype.insertArticleWithSeq = function(articleVo, callback)
{
	this.sqlMapClient.insertQuery("insertArticleWithSeq", articleVo, callback);
};

ArticleDao.prototype.updateArticle = function(articleVo, callback)
{
	this.sqlMapClient.updateQuery("updateArticle", articleVo, callback);
};

ArticleDao.prototype.updateHit = function(boardId, seq, callback)
{
	var vo = new ArticleVo();
	vo.boardId = boardId;
	vo.seq = seq;
	
	this.sqlMapClient.updateQuery("updateHit", vo, callback);
};

ArticleDao.prototype.updateGood = function(boardId, seq, callback)
{
	var vo = new ArticleVo();
	vo.boardId = boardId;
	vo.seq = seq;
	
	this.sqlMapClient.updateQuery("updateGood", vo, callback);
};

ArticleDao.prototype.updateBad = function(boardId, seq, callback)
{
	var vo = new ArticleVo();
	vo.boardId = boardId;
	vo.seq = seq;
	
	this.sqlMapClient.updateQuery("updateBad", vo, callback);
};

ArticleDao.prototype.updateStatus = function(articleVo, callback)
{
	this.sqlMapClient.updateQuery("updateArticleStatus", articleVo, callback);
};

ArticleDao.prototype.deleteArticle = function(boardId, seq, isRemove, callback)
{
	var vo = new ArticleVo();
	vo.boardId = boardId;
	vo.seq = seq;
	vo.status = -1;
	
	if(isRemove == "Y")
		this.sqlMapClient.deleteQuery("deleteArticle", vo, callback);
	else
		this.sqlMapClient.updateQuery("updateArticleStatus", vo, callback);
};

module.exports = ArticleDao.getInstance();