var CommentDao = require(_path.src + "/dao/CommentDao.js");

module.exports.commentList = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	CommentDao.getCommentList(param.boardId, param.articleSeq, param.searchData, function(commentList)
	{
		$(el).html(template({commentList : commentList}));
		next();
	});
};