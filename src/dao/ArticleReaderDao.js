var SqlMapClient = require(_path.lib + "/Sqlmapclient.js");
var ArticleReaderVo = require(_path.src + "/vo/ArticleReaderVo.js");

var ArticleReaderDao = function()
{
	this.sqlMapClient = new SqlMapClient("articleReader");
	
	if(ArticleReaderDao.caller != ArticleReaderDao.getInstance)
		throw new Error("This ArticleReaderDao object cannot be instanciated");
};

ArticleReaderDao.instance = null;

ArticleReaderDao.getInstance = function(){
	if(this.instance == null)
		this.instance = new ArticleReaderDao();
	
	return this.instance;
}

ArticleReaderDao.prototype.getArticleReader = function(boardId, articleSeq, userId, callback)
{
	var vo = new ArticleReaderVo();
	vo.boardId = boardId;
	vo.articleSeq = articleSeq;
	vo.userId = userId;
	
	this.sqlMapClient.selectQuery("getArticleReader", vo, callback);
};

ArticleReaderDao.prototype.insertArticleReader = function(articleReaderVo, callback)
{
	this.sqlMapClient.insertQuery("insertArticleReader", articleReaderVo, callback);
};

ArticleReaderDao.prototype.updateArticleReaderStatus = function(articleReaderVo, callback)
{
	this.sqlMapClient.insertQuery("updateArticleReaderStatus", articleReaderVo, callback);
};

ArticleReaderDao.prototype.deleteArticleReader = function(boardId, articleSeq, userId, callback)
{
	var vo = new ArticleReaderVo();
	vo.boardId = boardId;
	vo.articleSeq = articleSeq;
	vo.userId = userId;
	
	this.sqlMapClient.deleteQuery("deleteArticleReader", vo, callback);
};

module.exports = ArticleReaderDao.getInstance();