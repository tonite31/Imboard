
var ArticleReaderVo = require(_path.src + "/vo/ArticleReaderVo.js");

var ArticleDao = require(_path.src + "/dao/ArticleDao.js");
var ArticleReaderDao = require(_path.src + "/dao/ArticleReaderDao.js");
var BoardDao = require(_path.src + "/dao/BoardDao.js");
var BoardAuthDao = require(_path.src + "/dao/BoardAuthDao.js");

module.exports.articleListCount = function($, el, param, req, next)
{
	var that = this;
	
	var boardId = param.boardId;
	var searchData = param.searchData;
	ArticleDao.getArticleListCount(boardId, searchData, function(count)
	{
		var template = that.getTemplate($, el);
		$(el).html(template({count : count}));
		next();
	});
};

module.exports.articleTagList = function($, el, param, req, next)
{
	var that = this;
	var boardId = param.boardId;
	
	var filter = {};
	var tagList = [];
	ArticleDao.getArticleTagList(boardId, function(list)
	{
		for(var i=0; i<list.length; i++)
		{
			if(list[i])
			{
				var split = list[i].split(" ");
				for(var j=0; j<split.length; j++)
				{
					if(!filter[split[j]])
					{
						filter[split[j]] = {tag : split[j], count : 1};
					}
					else
					{
						filter[split[j]].count++;
					}
				}
			}
		}
		
		for(var key in filter)
		{
			tagList.push(filter[key]);
		}
		
		var template = that.getTemplate($, el);
		$(el).html(template({tagList : tagList}));
		next();
	});
};

module.exports.articleList = function($, el, param, req, next)
{
	var that = this;
	var boardId = param.boardId;

	var searchData = param.searchData;
	var checkAuth = function(cb)
	{
		BoardAuthDao.getBoardAuth(boardId, function(response)
		{
			if(response && response.viewListlLevel != null)
			{
				if(req.session.user && req.session.user.level <= response.viewListlLevel)
				{
					cb();
				}
				else
				{
					$(el).html("<p class='databind-error'>Access denied.</p>");
					next();
				}
			}
			else
			{
				cb();
			}
		});
	};

	var getArticleList = function(cb)
	{
		ArticleDao.getArticleList(boardId, searchData, function(list)
		{
			var template = that.getTemplate($, el);
			$(el).html(template({articleList : list}));
			next();
		});
	}

	_async.waterfall([checkAuth, getArticleList]);
};

module.exports.articleComponent = function($, el, param, req, next)
{
	var that = this;
	var boardId = param.boardId;
	var registerDateType = param.registerDateType;

	var checkAuth = function(cb)
	{
		BoardAuthDao.getBoardAuth(boardId, function(response)
		{
			if(response && response.viewListlLevel != null)
			{
				if(req.session.user && req.session.user.level <= response.viewListlLevel)
				{
					cb();
				}
				else
				{
					$(el).html("<p class='databind-error'>Access denied.</p>");
					next();
				}
			}
			else
			{
				cb();
			}
		});
	};

	var pageIndex = req.query.pageIndex;
	if(!pageIndex || isNaN(pageIndex))
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
				var maxPage = Math.ceil(totalCount / cpp);
				maxPage = maxPage == 0 ? 1 : maxPage;


				var startPage = Math.ceil(pageIndex / pgc);
				startPage = startPage + (startPage - 1) * (pgc - 1);

				var pageList = [];
				for(var i=startPage; i<startPage + pgc && i <= maxPage; i++)
				{
					pageList.push({pageNumber : i, href : "?piece=" + req.query.piece + "&boardId=" + data.boardId + "&pageIndex=" + i});
				}

				$(el).find("*[data-parts='pagination']").each(function()
				{
					$(this).removeAttr("data-parts");

					var template = that.getTemplate($, this);
					$(this).html(template({pageList : pageList, pageIndex : parseInt(pageIndex), maxPage : maxPage}));
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
				var templateId = $(el).attr("data-template-id");
				if(templateId)
					$(el).html($("#" + templateId).html());
				
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

	_async.waterfall([checkAuth, setPagination, setArticleList]);
};

module.exports.article = function($, el, param, req, next)
{
	var that = this;

	var boardId = param.boardId;
	var seq = param.seq;

	var checkAuth = function(cb)
	{
		BoardAuthDao.getBoardAuth(boardId, function(response)
		{
			if(response && response.viewDetailLevel != null)
			{
				if(req.session.user && req.session.user.level <= response.viewDetailLevel)
				{
					cb();
				}
				else
				{
					$(el).html("<p class='databind-error'>Access denied.</p>");
					next();
				}
			}
			else
			{
				cb();
			}
		});
	};

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
						return;
					}
					else
					{
						$(el).html("<p class='databind-error'>Access denied.</p>");
						next();
						return;
					}
				}
			}
			
			var template = that.getTemplate($, el);
			$(el).html(template(article));
			
			if(article)
				cb();
			else
				next();
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

	_async.waterfall([checkAuth, getArticle, updateHit]);
};
