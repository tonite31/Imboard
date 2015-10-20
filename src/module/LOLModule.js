var ArticleDao = require(_path.src + "/dao/ArticleDao.js");

module.exports.lol_getBankpickList = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	
	var boardId = param.boardId;
	var startIndex = param.startIndex ? param.startIndex : 0;
	var endIndex = param.endIndex ? param.endIndex : 10;
	
	ArticleDao.getArticleList(boardId, {withContent : "true", startIndex : startIndex, endIndex : endIndex}, function(list)
	{
		var banpickList = [];
		for(var i=0; i<list.length; i++)
		{
			var data = JSON.parse(list[i].content);
			data.banpickName = list[i].subject;
			data.seq = list[i].seq;
			banpickList.push(data);
		}
		
		$(el).html(template({banpickList : banpickList}));
		next();
	});
};