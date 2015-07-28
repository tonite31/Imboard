var ArticleVo = function(param)
{
	this.boardId = undefined;
	this.boardName = undefined;
	this.seq = undefined;
	this.subject = undefined;
	this.content = undefined;
	this.registerDate = undefined;
	this.hit = undefined;
	this.good = undefined;
	this.bad = undefined;
	this.writerId = undefined;
	this.writerName = undefined;
	this.writerDisplayId = undefined;
	this.writerProfileImgUrl = undefined;
	this.groupId = undefined;
	this.parentSeq = undefined;
	this.parentArticleWriterId = undefined;
	this.status = undefined;
	this.thumbnailUrl = undefined;
	this.tag = undefined;
	this.commentCount = undefined;
	this.password = undefined;
	this.isNotice = undefined;
	this.point = undefined;
	this.readStatus = undefined;
	this.checkSigninUser = undefined;
	this.signinUserId = undefined;
	this.signinUserLevel = undefined;
	this.useSigninUser = undefined;
	
	this.existThumbnailUrl = undefined;
	
	//searchData
	this.pageIndex = undefined;
	this.startIndex = undefined;
	this.endIndex = undefined;
	this.registerDateType = undefined;
	this.withContent = undefined;
	
	this.orderBySeq = undefined;
	this.orderByIsNotice = undefined;
	this.orderByRegisterDate = undefined;
	this.orderByGroupId = undefined;
	
	this.likeWriterDisplayId = undefined;
	this.likeWriterId = undefined;
	this.likeWriterName = undefined;
	
	ParameterBinder.bind(this, param);
};

module.exports = ArticleVo;