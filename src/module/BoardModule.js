var BoardVo = require(_path.src + "/vo/BoardVo.js");
var BoardDao = require(_path.src + "/dao/BoardDao.js");
var RoleDao = require(_path.src + "/dao/RoleDao.js");

module.exports.board = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	BoardDao.getBoard(param.id, function(board)
	{
		$(el).html(template(board));
		next();
	});
};

module.exports.boardList = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	BoardDao.getBoardList(function(boardList)
	{
		RoleDao.getRoleList(function(roleList)
		{
			$(el).html(template({boardList : boardList, roleList : roleList}));
			next();
		});
	});
};