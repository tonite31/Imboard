var CommentDao = require(_path.src + "/dao/CommentDao.js");
var CommentVo = require(_path.src + '/vo/CommentVo.js');

module.exports.getCommentListCount =
{
	type : 'post',
	path : '/comment/getCommentListCount.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		var boardId = param.boardId;
		var articleSeq = param.articleSeq;
		
		CommentDao.getCommentListCount(boardId, articleSeq, param.searchData, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.getCommentList = {
	type : 'post',
	path : '/comment/getCommentList.do',
	auth : {check : true},
	callback : function(req, res)
	{
		var param = req.body;
		
		var boardId = param.boardId;
		var articleSeq = param.articleSeq;

		if(param.searchData == null)
			param.searchData = {};
		
		var pageIndex = param.searchData.pageIndex;
		var cpp = param.searchData.cpp;
		
		try
		{
			if(pageIndex != null && cpp != null)
			{
				param.searchData.startIndex = parseInt(cpp) * (parseInt(pageIndex) -1);
				param.searchData.endIndex = parseInt(cpp);
			}
		}
		catch(err)
		{
			param.searchData.startIndex = null;
			param.searchData.endIndex = null;
		}
		
		CommentDao.getCommentList(boardId, articleSeq, param.searchData, function(response)
		{
			if(response)
				res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
			else
				res.end();
		});
	}
};

module.exports.insertComment =
{
	type : 'post',
	path : '/comment/insertComment.do',
	auth : {check : true},
	callback : function(req, res)
	{
		var param = req.body;
		
		var vo = new CommentVo(param);
		
		if(vo.writerId == null && req.session.user != null)
			vo.writerId = req.session.user.id;
		
		CommentDao.getNextSeq(vo.boardId, vo.articleSeq, function(seq)
		{
			vo.seq = seq;
			CommentDao.insertComment(vo, function(response)
			{
				res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
			});
		});
	}
};

module.exports.updateComment = 
{
	type : 'post',
	path : '/comment/updateComment.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		var vo = new CommentVo(param);
		CommentDao.getComment(param.boardId, param.articleSeq, param.seq, function(response)
		{
			if(response)
			{
				if((!response.writerId && (!response.password || response.password == param.password)) || (req.session && req.session.user && (req.session.user.id == response.writerId || req.session.user.level < 0)))
				{
					CommentDao.updateComment(vo, function(response)
					{
						res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
					});
				}
				else
				{
					res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : '', msg : "ACCESS_DENIED"}));
				}
			}
			else
			{
				res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : '', msg : "COMMENT IS NOT FOUND"}));
			}
		});
	}
};

module.exports.updateGood = 
{
	type : 'post',
	path : '/comment/updateGood.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		if(req.session && req.session.user)
		{
			commentDao.updateGood(param.boardId, param.articleSeq, param.seq, function(response)
			{
				res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
			});
		}
		else
		{
			res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : '', msg : "ACCESS_DENIED"}));
		}
	}
};

module.exports.updateBad = 
{
	type : 'post',
	path : '/comment/updateBad.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		if(req.session && req.session.user)
		{
			commentDao.updateBad(param.boardId, param.articleSeq, param.seq, function(response)
			{
				res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
			});
		}
		else
		{
			res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : '', msg : "ACCESS_DENIED"}));
		}
	}
};

module.exports.deleteComment = 
{
	type : 'post',
	path : '/comment/deleteComment.do',
	auth : {check : true},
	callback : function(req, res)
	{
		var param = req.body;
		
		CommentDao.getComment(param.boardId, param.articleSeq, param.seq, function(response)
		{
			if(response)
			{
				if((!response.writerId && (!response.password || response.password == param.password)) || (req.session && req.session.user && (req.session.user.id == response.writerId || req.session.user.level < 0)))
				{
					CommentDao.deleteComment(param.boardId, param.articleSeq, param.seq, param.isRemove, function(response)
					{
						res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
					});
				}
				else
				{
					res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : '', msg : "ACCESS_DENIED"}));
				}
			}
			else
			{
				res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : '', msg : "COMMENT IS NOT FOUND"}));
			}
		});
	}
};