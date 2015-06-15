var ArticleReaderVo = function(param)
{
	this.boardId = undefined;
	this.articleSeq = undefined;
	this.userId = undefined;
	this.status = undefined;
	
	ParameterBinder.bind(this, param);
};

module.exports = ArticleReaderVo;