var BoardVo = function(param)
{
	this.boardId = null;
	this.viewListLevel = null;
	this.viewDetailLevel = null;
	this.writeLevel = null;
	this.writeCommentLevel = null;

	ParameterBinder.bind(this, param);
};

module.exports = BoardVo;