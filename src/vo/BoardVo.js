var BoardVo = function(param)
{
	this.id = null;
	this.name = null;
	this.description = null;
	this.useYn = null;
	this.priority = null;
	
	this.viewListLevel = null;
	this.viewDetailLevel = null;
	this.writeLevel = null;
	this.writeCommentLevel = null;
	
	this.creator = null;
	
	this.articleListCount = null;
	
	ParameterBinder.bind(this, param);
};

module.exports = BoardVo;