var CommentVo = function(param)
{
	this.boardId = undefined;
	this.articleSeq = undefined;
	this.seq = undefined;
	this.content = undefined;
	this.registerDate = undefined;
	this.good = undefined;
	this.bad = undefined;
	this.writerId = undefined;
	this.writerName = undefined;
	this.writerDisplayId = undefined;
	this.groupId = undefined;
	this.parentSeq = undefined;
	this.parentWriterId = undefined;
	this.parentWriterName = undefined;
	this.parentWriterDisplayId = undefined;
	this.status = undefined;
	this.profileImgUrl = undefined;
	
	this.registerDateType = undefined;
	
	//searchData
	this.pageIndex = undefined;
	this.startIndex = undefined;
	this.endIndex = undefined;
	this.registerDateType = undefined;
	this.withContent = undefined;
	this.orderByGroupId = undefined;
	this.orderBySeq = undefined;
	
	ParameterBinder.bind(this, param);
};

module.exports = CommentVo;