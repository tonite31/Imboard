var UserVo = function(param)
{
	this.id = null;
	this.displayId = null;
	this.name = null;
	this.provider = null;
	this.profileImgUrl = null;
	this.password = null;
	this.gender = null;
	this.userStatus = null;
	this.dropOutDate = null;
	
	this.level = undefined;
	this.point = undefined;
	this.lastAccessDate = undefined;
	
	this.visitCount = null;
	this.articleCount = null;
	this.commentCount = null;
	this.popularPoint = null;
	
	ParameterBinder.bind(this, param);
};

module.exports = UserVo;