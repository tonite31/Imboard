var boardDao = require(_path.src + "/dao/BoardDao.js");
var BoardVo = require(_path.src + '/vo/BoardVo.js');

var urlAuthDao = require(_path.src + "/dao/UrlAuthDao.js");
var UrlAuthVo = require(_path.src + '/vo/UrlAuthVo.js');

module.exports.getBoardList =
{
	type : 'post',
	path : '/board/getBoardList.do',
	callback : function(req, res)
	{
		boardDao.getBoardList(function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.getBoard =
{
	type : 'post',
	path : '/board/getBoard.do',
	callback : function(req, res)
	{
		var param = req.body;
		boardDao.getBoard(param.id, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.getBoardByName =
{
	type : 'post',
	path : '/board/getBoardByName.do',
	callback : function(req, res)
	{
		var param = req.body;
		boardDao.getBoardByName(param.name, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.insertBoard =
{
	type : 'post',
	path : '/board/insertBoard.do',
	callback : function(req, res)
	{
		var boardVo = new BoardVo(req.body);
		if(boardVo.priority == null || boardVo.priority == "")
			boardVo.priority = 0;
		
		boardDao.insertBoard(boardVo, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
		});
	}
};

module.exports.updateBoard =
{
	type : 'post',
	path : '/board/updateBoard.do',
	callback : function(req, res)
	{
		var boardVo = new BoardVo(req.body);
		if(boardVo.priority == null || boardVo.priority == "")
			boardVo.priority = 0;
		
		//권한레벨이 0보다 작거나 글쓰기 권한이 있는 유저만 업데이트를 할 수 있음
		boardDao.updateBoard(boardVo, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
		});
	}
};

module.exports.deleteBoard =
{
	type : 'post',
	path : '/board/deleteBoard.do',
	callback : function(req, res)
	{
		var param = req.body;
		boardDao.deleteBoard(param.id, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
		});
	}
};