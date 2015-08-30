var SqlMapClient = require(_path.lib + "/Sqlmapclient.js");
var CommentVo = require(_path.src + "/vo/CommentVo.js");

var CommentDao = function()
{
	this.sqlMapClient = new SqlMapClient("comment");
	
	if(CommentDao.caller != CommentDao.getInstance)
		throw new Error("This CommentDao object cannot be instanciated");
};

CommentDao.instance = null;

CommentDao.getInstance = function(){
	if(this.instance == null)
		this.instance = new CommentDao();
	
	return this.instance;
}

CommentDao.prototype.getNextSeq = function(boardId, articleSeq, callback)
{
	var vo = new CommentVo();
	vo.boardId = boardId;
	vo.articleSeq = articleSeq;
	
	this.sqlMapClient.selectQuery("getNextSeq", vo, callback);
};

CommentDao.prototype.getCommentListCount = function(boardId, articleSeq, searchData, callback)
{
	var vo = new CommentVo();
	vo.boardId = boardId;
	vo.articleSeq = articleSeq;
	
	if(searchData)
		ParameterBinder.bind(vo, searchData);
	
	this.sqlMapClient.selectQuery("getCommentListCount", vo, callback);
};

CommentDao.prototype.getCommentList = function(boardId, articleSeq, searchData, callback)
{
	var vo = new CommentVo();
	vo.boardId = boardId;
	vo.articleSeq = articleSeq;
	
	if(searchData)
		ParameterBinder.bind(vo, searchData);
	
	if(!vo.registerDateType)
		vo.registerDateType = "short";
	
	this.sqlMapClient.selectsQuery("getCommentList", vo, callback);
};

CommentDao.prototype.getComment = function(boardId, articleSeq, seq, callback)
{
	var vo = new CommentVo();
	vo.boardId = boardId;
	vo.articleSeq = articleSeq;
	vo.seq = seq;
	
	this.sqlMapClient.selectQuery("getComment", vo, callback);
};

CommentDao.prototype.insertComment = function(commentVo, callback)
{
	this.sqlMapClient.insertQuery("insertComment", commentVo, callback);
};

CommentDao.prototype.updateComment = function(commentVo, callback)
{
	this.sqlMapClient.updateQuery("updateComment", commentVo, callback);
};

CommentDao.prototype.updateGood = function(boardId, articleSeq, seq, callback)
{
	var vo = new CommentVo();
	vo.boardId = boardId;
	vo.articleSeq = articleSeq;
	vo.seq = seq;
	
	this.sqlMapClient.updateQuery("updateGood", vo, callback);
};

CommentDao.prototype.updateBad = function(boardId, articleSeq, seq, callback)
{
	var vo = new CommentVo();
	vo.boardId = boardId;
	vo.articleSeq = articleSeq;
	vo.seq = seq;
	
	this.sqlMapClient.updateQuery("updateBad", vo, callback);
};

CommentDao.prototype.updateCommentStatus = function(commentVo, callback)
{
	this.sqlMapClient.updateQuery("updateCommentStatus", commentVo, callback);
};

CommentDao.prototype.deleteComment = function(boardId, articleSeq, seq, isRemove, callback)
{
	var vo = new CommentVo();
	vo.boardId = boardId;
	vo.articleSeq = articleSeq;
	vo.seq = seq;
	vo.status = -1;
	
	if(isRemove == "Y")
		this.sqlMapClient.deleteQuery("deleteComment", vo, callback);
	else
		this.sqlMapClient.updateQuery("updateCommentStatus", vo, callback);
};

CommentDao.prototype.deleteCommentByArticle = function(boardId, articleSeq, callback)
{
	var vo = new CommentVo();
	vo.boardId = boardId;
	vo.articleSeq = articleSeq;
	
	this.sqlMapClient.deleteQuery("deleteCommentByArticle", vo, callback);
};

module.exports = CommentDao.getInstance();