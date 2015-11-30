var ArticleFileVo = function(param)
{
	this.boardId = undefined;
	this.articleSeq = undefined;
	this.seq = undefined;
	this.fileName = undefined;
	this.filePath = undefined;
	this.fileSize = undefined;
	
	ParameterBinder.bind(this, param);
};

module.exports = ArticleFileVo;