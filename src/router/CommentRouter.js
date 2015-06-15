var commentDao = require(_path.src + "/dao/CommentDao.js");
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
		
		commentDao.getCommentListCount(boardId, articleSeq, param.searchData, function(response)
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
		
		commentDao.getCommentList(boardId, articleSeq, param.searchData, function(response)
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
		
		commentDao.getNextSeq(vo.boardId, vo.articleSeq, function(seq)
		{
			vo.seq = seq;
			commentDao.insertComment(vo, function(response)
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
		
		commentDao.updateComment(vo, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
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
		
		commentDao.updateGood(param.boardId, param.articleSeq, param.seq, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
		});
	}
};

module.exports.updateBad = 
{
	type : 'post',
	path : '/comment/updateBad.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		commentDao.updateBad(param.boardId, param.articleSeq, param.seq, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
		});
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
		
		commentDao.deleteComment(param.boardId, param.articleSeq, param.seq, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
		});
	}
};