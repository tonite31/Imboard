var SqlMapClient = require(_path.lib + "/Sqlmapclient.js");
var ArticleFileVo = require(_path.src + "/vo/ArticleFileVo.js");

var ArticleFileDao = function()
{
	this.sqlMapClient = new SqlMapClient("articleFile");
	
	if(ArticleFileDao.caller != ArticleFileDao.getInstance)
		throw new Error("This ArticleFileDao object cannot be instanciated");
};

ArticleFileDao.instance = null;

ArticleFileDao.getInstance = function(){
	if(this.instance == null)
		this.instance = new ArticleFileDao();
	
	return this.instance;
}

ArticleFileDao.prototype.getArticleFileList = function(boardId, articleSeq, callback)
{
	var vo = new ArticleFileVo();
	vo.boardId = boardId;
	vo.articleSeq = articleSeq;
	
	this.sqlMapClient.selectQuery("getArticleFileList", vo, callback);
};

ArticleFileDao.prototype.insertArticleFile = function(articleFileVo, callback)
{
	this.sqlMapClient.insertQuery("insertArticleFile", articleFileVo, callback);
};

ArticleFileDao.prototype.deleteArticleFile = function(boardId, articleSeq, seq, callback)
{
	var vo = new ArticleFileVo();
	vo.boardId = boardId;
	vo.articleSeq = articleSeq;
	vo.seq = seq;
	
	this.sqlMapClient.deleteQuery("deleteArticleFile", vo, callback);
};

module.exports = ArticleFileDao.getInstance();