var ArticleFileVo = function(param)
{
	this.boardId = undefined;
	this.articleSeq = undefined;
	this.seq = undefined;
	this.path = undefined;
	
	ParameterBinder.bind(this, param);
};

module.exports = ArticleFileVo;