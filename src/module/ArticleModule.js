
var ArticleReaderVo = require(_path.src + "/vo/ArticleReaderVo.js");

var ArticleDao = require(_path.src + "/dao/ArticleDao.js");
var ArticleReaderDao = require(_path.src + "/dao/ArticleReaderDao.js");
var BoardDao = require(_path.src + "/dao/BoardDao.js");
var BoardAuthDao = require(_path.src + "/dao/BoardAuthDao.js");

module.exports.articleList = function($, el, param, req, next)
{
	var that = this;
	var boardId = param.boardId;
	
	var searchData = param.searchData;
	ArticleDao.getArticleList(boardId, searchData, function(list)
	{
		var template = that.getTemplate($, el);
		$(el).html(template({articleList : list}));
		next();
	});
};

module.exports.articleComponent = function($, el, param, req, next)
{
	var that = this;
	var boardId = param.boardId;
	var registerDateType = param.registerDateType;
	
	var getArticleList = function()
	{
		var pageIndex = req.query.pageIndex;
		if(pageIndex == null || isNaN(pageIndex))
			pageIndex = 1;
		
		var searchData = param.searchData;
		var cpp = param.cpp;
		
		if(cpp)
			cpp = parseInt(cpp);
		else
			cpp = 10;
		
		if(searchData == null)
			searchData = {};

		if(searchData.tag != null)
		{
			var tag = "";
			for(var i=0; i<searchData.tag.length; i++)
			{
				if(i > 0)
					tag += " AND ";
				tag += "TAG REGEXP '" + searchData.tag[i] + "'";
			}
			
			searchData.tag = tag;
		}
		
		var data = {
			boardId : boardId,
			searchData : searchData
		};
		
		data.searchData.registerDateType = registerDateType;
		
		var setPagination = function(cb)
		{
			if(param.pagination != "false")
			{
				var pgc = param.pgc;
				
				if(pgc != null && pgc != "")
					pgc = parseInt(pgc);
				else
					pgc = 10;
				
				if(req.session.user != null)
				{
					data.searchData.signinUserId = req.session.user.id;
					data.searchData.signinUserLevel = req.session.user.level;
				}
				
				ArticleDao.getArticleListCount(data.boardId, data.searchData, function(totalCount)
				{
					var maxPage = 0;
//					if(totalCount > 10)
//						maxPage = (Math.ceil(totalCount / 10) * 10) / cpp;
//					else
						maxPage = Math.ceil(totalCount / cpp);
					
					var startPage = Math.ceil(pageIndex / pgc);
					startPage = startPage + (startPage - 1) * (pgc - 1);
					
					var pageData = [];
					for(var i=startPage; i<startPage + pgc && i <= maxPage; i++)
					{
						pageData.push({pageNumber : i, href : "?piece=" + req.query.piece + "&boardId=" + data.boardId + "&pageIndex=" + i});
					}
					
					$(el).find("*[data-parts='pagination']").each(function()
					{
						$(this).removeAttr("data-parts");
						
						var template = that.getTemplate($, this);
						$(this).html(template({pageList : pageData, pageIndex : parseInt(pageIndex), maxPage : maxPage}));
					});
					
					cb();
				});
				
//				var totalCount = $.api.article.getArticleListCount(data);
			}
			else
			{
				cb();
			}
		}
		
		var setArticleList = function(cb)
		{
			data.searchData.cpp = cpp;
			data.searchData.pageIndex = pageIndex;
			
			if(param.searchData != null)
			{
				var searchData = param.searchData;
				for(var key in searchData)
				{
					data.searchData[key] = searchData[key];
				}
			}
			
			if(param.withContent == "true")
				data.searchData.withContent = "true";
			
//			var list = $.api.article.__getArticleList(data);
			
			try
			{
				if(pageIndex != null && cpp != null)
				{
					data.searchData.startIndex = parseInt(cpp) * (parseInt(pageIndex) -1);
					data.searchData.endIndex = parseInt(cpp);
				}
			}
			catch(err)
			{
				data.searchData.startIndex = null;
				data.searchData.endIndex = null;
			}
			
			if(req.session.user != null)
			{
				data.searchData.signinUserId = req.session.user.id;
				data.searchData.signinUserLevel = req.session.user.level;
			}
			
			ArticleDao.getArticleList(data.boardId, data.searchData, function(list)
			{
				var divideCount = parseInt(param.divideCount);
				if(!isNaN(divideCount))
				{
					var bodyList = $(el).find("*[data-parts='body']");
					var index = 0;
					for(var i=0; i<list.length; i++)
					{
						var template = bodyList[index].template;
						if(!template)
						{
							template = that.getTemplate($, bodyList[index]);
							bodyList[index].template = template;
						}
						
						$(bodyList[index++]).append(template(list[i]));
						if(index == divideCount)
							index = 0;
					}
				}
				else
				{
					$(el).find("*[data-parts='body']").each(function()
					{
						$(this).removeAttr("data-parts");
						
						var template = that.getTemplate($, this);
						$(this).html(template({articleList : list}));
					});
				}
				
				next();
			});
		};
		
		_async.waterfall([setPagination, setArticleList]);
	};
	
	_async.waterfall([getArticleList]);
};

module.exports.article = function($, el, param, req, next)
{
	var that = this;
	
	var boardId = param.boardId;
	var seq = param.seq;
	
	var bindArticle = function()
	{
		var getArticle = function(cb)
		{
			var searchData = {};
			if(req.session.user != null)
			{
				searchData.signinUserId = req.session.user.id;
				searchData.signinUserLevel = req.session.user.level;
			}
			
			ArticleDao.getArticle(boardId, seq, searchData, function(article)
			{
				if(article)
				{
					if(article.password != null)
					{
						if((req.session.user != null && req.session.user.level < 0) || article.password == param.password)
						{
							var template = that.getTemplate($, el);
							$(el).html(template(article));
							cb();
						}
						else
						{
							next();
						}
					}
					else
					{
						var template = that.getTemplate($, el);
						$(el).html(template(article));
						cb();
					}
				}
				else
				{
					$(el).html("<p class='databind-error'>비공개이거나 볼 수 있는 권한이 없습니다.</p>");
					next();
				}
			});
		};
		
		var updateHit = function(cb)
		{
			var userId = null;
			if(req.session.user != null && req.session.user.id != null)
				userId = req.session.user.id;
			else
				userId = (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + "__" + req.headers['user-agent'];
			
			ArticleReaderDao.getArticleReader(boardId, seq, userId, function(articleReader)
			{
				if(articleReader == null)
				{
					var vo = new ArticleReaderVo();
					vo.boardId = boardId;
					vo.articleSeq = seq;
					vo.userId = userId;
					
					ArticleReaderDao.insertArticleReader(vo);
					
					ArticleDao.updateHit(vo.boardId, vo.articleSeq, function()
					{
						next();
					});
				}
				else
				{
					next();
				}
			});
		};
		
		_async.waterfall([getArticle, updateHit]);
	};
	
	_async.waterfall([bindArticle]);
};