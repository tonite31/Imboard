var boardDao = require(_path.src + "/dao/BoardDao.js");
var BoardVo = require(_path.src + '/vo/BoardVo.js');
var boardAuthDao = require(_path.src + '/dao/BoardAuthDao.js');

var urlAuthDao = require(_path.src + "/dao/UrlAuthDao.js");
var UrlAuthVo = require(_path.src + '/vo/UrlAuthVo.js');

module.exports.getBoardList =
{
	type : 'post',
	path : '/board/getBoardList.do',
	callback : function(req, res)
	{
		var vo = new BoardVo();
		if(req.session.user != null)
		{
			vo.signinUserId = req.session.user.id;
			vo.signinUserLevel = req.session.user.level;
		}
		
		boardDao.getBoardList(vo, function(response)
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
		
		if(req.session.user)
			boardVo.creator = req.session.user.id;
		
		boardDao.getBoard(boardVo.id, function(response)
		{
			if(response)
			{
				res.end(JSON.stringify({code : _code.DUPLICATED, data : _code.DUPLICATED, msg : "DUPLICATED"}));
			}
			else
			{
				boardDao.insertBoard(boardVo, function(response)
				{
					res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
				});
			}
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
		
		boardDao.getBoard(boardVo.id, function(response)
		{
			if(!response.creator || (req.session.user && (req.session.user.level < 0 || response.creator == req.session.user.id)))
			{
				boardDao.updateBoard(boardVo, function(response)
				{
					res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
				});
			}
			else
			{
				res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : _code.ACCESS_DENIED, msg : "ACCESS_DENIED"}));
			}
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
		boardDao.getBoard(param.id, function(response)
		{
			if(!response.creator || (req.session.user && (req.session.user.level < 0 || response.creator == req.session.user.id)))
			{
				boardDao.deleteBoard(param.id, function(response)
				{
					boardAuthDao.deleteBoardAuth(param.id, function(response)
					{
						res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
					});
				});
			}
			else
			{
				res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : _code.ACCESS_DENIED, msg : "ACCESS_DENIED"}));
			}
		});
	}
};