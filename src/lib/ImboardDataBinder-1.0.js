var Handlebars = require("handlebars");
var HandlebarHelper = require(_path.content + "/module/handlebarHelper.js");

var ArticleReaderVo = require(_path.src + "/vo/ArticleReaderVo.js");

var boardDao = require(_path.src + "/dao/BoardDao.js");
var articleDao = require(_path.src + "/dao/ArticleDao.js");
var articleReaderDao = require(_path.src + "/dao/ArticleReaderDao.js");
var commentDao = require(_path.src + "/dao/CommentDao.js");

var _component = {};

_component.compile = function($, el, req, callback)
{
	var componentList = $(el).find("*[data-bind]");
	
	var compile = function(componentList, index)
	{
		if(index >= componentList.length)
		{
			callback($.html());
		}
		else
		{
			var that = componentList[index];
			var name = $(that).attr("data-bind");
			$(that).removeAttr("data-bind");
			$(that).removeAttr("data-from");
			
			if(_component.hasOwnProperty(name))
			{
				_component[name]($, that, req, function()
				{
					compile(componentList, index+1)
				});
			}
			else
			{
				compile(componentList, index+1);
			}
		}
	};
	
	compile(componentList, 0);
};

_component.getTemplateHtml = function($, el)
{
	var html = null;
	var templateId = $(el).attr('data-template-id');
	if(templateId != null)
		html = $("#" + templateId).html();
	else
		html = $(el).html();

	$(el).removeAttr("data-template-id");
	
	return html;
};

_component.imboardList = function($, el, req, callback)
{
	var html = _component.getTemplateHtml($, el);
	
	imboardDao.getImboardList(function(response)
	{
		var template = Handlebars.compile(html);
		$(el).html(template({imboardList : response}));
		_component.compile($, el, req, function()
		{
			callback();
		});
	});
};

_component.frameList = function($, el, req, callback)
{
	var userId = req.session.user.id;
	var html = _component.getTemplateHtml($, el);	
	frameDao.getFrameList("all", userId, function(frameList)
	{
		var template = Handlebars.compile(html);
		$(el).html(template({frameList : frameList}));
		_component.compile($, el, req, function()
		{
			callback();
		});
	});
};

_component.boardList = function($, el, req, callback)
{
	var searchData = $(el).attr("data-search-data");
	$(el).removeAttr("data-search-data");
	
	if(searchData != null)
		searchData = JSON.parse(searchData);

	boardDao.getBoardList(searchData, function(response)
	{
		var html = _component.getTemplateHtml($, el);
		
		var template = Handlebars.compile(html);
		var html = template({boardList : response});
		
		$(el).html(html);
		_component.compile($, el, req, function()
		{
			callback();
		});
	});
};

_component.board = function($, el, req, callback)
{
	var boardId = $(el).attr("data-board-id");
	$(el).removeAttr("data-board-id");
	
	var boardVo = new BoardVo();
	boardVo.id = req.query.boardId;
	boardDao.getBoard(boardVo, function(response)
	{
		var html = _component.getTemplateHtml($, el);
		
		var template = Handlebars.compile(html);
		$(el).html(template({board : response}));
		_component.compile($, el, req, function()
		{
			callback();
		});
	});
};

_component.articleList = function($, el, req, callback)
{
	var boardId = $(el).attr("data-board-id");
	$(el).removeAttr("data-board-id");
	
	var registerDateType = $(el).attr("data-registerdate-type");
	$(el).removeAttr("data-registerdate-type");
	
	var pageIndex = req.query.pageIndex;
	if(pageIndex == null || isNaN(pageIndex))
		pageIndex = 1;
	
	var searchData = $(el).attr("data-search-data");
	$(el).removeAttr("data-search-data");
	
	var cpp = $(el).attr("data-cpp");
	$(el).removeAttr("data-cpp");
	
	if(cpp != null && cpp != "")
		cpp = parseInt(cpp);

	try
	{
		searchData = searchData == null ? {} : JSON.parse(searchData);
	}
	catch(err)
	{
		_log.error(err.stack);
		searchData = {};
	}
	
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
		if($(el).attr("data-pagination") != "false")
		{
			var pgc = $(el).attr("data-pgc");
			$(el).removeAttr("data-pgc");
			
			if(pgc != null && pgc != "")
				pgc = parseInt(pgc);
			
			if(req.session.user != null)
			{
				data.searchData.signinUserId = req.session.user.id;
			}
			
			articleDao.getArticleListCount(data.boardId, data.searchData, function(totalCount)
			{
				var maxPage = 0;
//				if(totalCount > 10)
//					maxPage = (Math.ceil(totalCount / 10) * 10) / cpp;
//				else
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
					
					var html = _component.getTemplateHtml($, this);
					var template = Handlebars.compile(html);
					$(this).html(template({pageList : pageData, pageIndex : parseInt(pageIndex), maxPage : maxPage}));
				});
				
				cb();
			});
			
//			var totalCount = $.api.article.getArticleListCount(data);
		}
		else
		{
			cb();
		}
	}
	
	var setArticleList = function(cb)
	{
		$(el).removeAttr("data-pagination");
		
		data.searchData.cpp = cpp;
		data.searchData.pageIndex = pageIndex;
		
		if($(el).attr("data-searchdata") != null)
		{
			var searchData = $(el).attr("data-searchdata");
			$(el).removeAttr("data-searchdata");
			
			searchData = JSON.parse(searchData);
			for(var key in searchData)
			{
				data.searchData[key] = searchData[key];
			}
		}
		
		if($(el).attr("data-with-content") == "true")
			data.searchData.withContent = "true";
		
		$(el).removeAttr("data-with-content");
		
//		var list = $.api.article.__getArticleList(data);
		
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
		}
		
		articleDao.getArticleList(data.boardId, data.searchData, function(list)
		{
			$(el).find("*[data-parts='body']").each(function()
			{
				$(this).removeAttr("data-parts");
				
				var html = _component.getTemplateHtml($, this);
				var template = Handlebars.compile(html);
				
				$(this).html(template({articleList : list}));
			});
			
			_component.compile($, el, req, function()
			{
				callback();
			});
		});
	};
	
	_async.waterfall([setPagination, setArticleList]);
};

_component.article = function($, el, req, callback)
{
	var boardId = $(el).attr("data-board-id");
	var seq = $(el).attr("data-seq");
	
	$(el).removeAttr("data-board-id");
	$(el).removeAttr("data-seq");
	
	var checkHit = function(cb)
	{
		var userId = null;
		if(req.session.user != null && req.session.user.id != null)
			userId = req.session.user.id;
		else
			userId = (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + "__" + req.headers['user-agent'];
		
		articleReaderDao.getArticleReader(boardId, seq, userId, function(articleReader)
		{
			if(articleReader == null)
			{
				var vo = new ArticleReaderVo();
				vo.boardId = boardId;
				vo.articleSeq = seq;
				vo.userId = userId;
				
				articleReaderDao.insertArticleReader(vo);
				
				articleDao.updateHit(vo.boardId, vo.articleSeq, function()
				{
					cb();
				});
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
			searchData.signinUserId = req.session.user.id;
		
		articleDao.getArticle(boardId, seq, searchData, function(response)
		{
			cb(null, response);
		});
	};
	
	var bindArticle = function(article, cb)
	{
		var html = _component.getTemplateHtml($, el);
		
		if(article.code == _code.ACCESS_DENIED)
		{
			html = Render.getData(_path.content + "/frame/Imboard/uidef/accessDenied.html");
			$(el).html(html);
		}
		else
		{
			var template = Handlebars.compile(html);
			$(el).html(template({article : article}));
		}
		
		$(el).find("*[data-parts='edit']").each(function()
		{
			var viewOption = $(this).attr("data-view-option");
			if((viewOption == null || viewOption == "manager-only") && req.session.user.id != article.writerId && req.session.user.memberInfo.level > 0)
				$(this).remove();
			if(viewOption == "writer-only" && req.session.user.id != article.writerId)
				$(this).remove();
			else
				$(this).removeAttr("data-parts");
		});
		
		_component.compile($, el, req, function()
		{
			callback();
		});
	};
	
	_async.waterfall([checkHit, getArticle, bindArticle]);
	
//	var article = $.api.article.__getArticle({imboardId : boardId : boardId, seq : seq});
//	el.article = article;
};

_component.commentList = function($, el, req, callback)
{
	el.commentPageData = {};
	el.parts = {
		pagination : [],
		body : [],
		info : []
	};
	
	var boardId = $(el).attr("data-board-id");
	var articleSeq = $(el).attr("data-article-seq");
	var cpp = $(el).attr("data-cpp");
	var isPagination = $(el).attr("data-pagination");
	var pgc = $(el).attr("data-pgc");
	var orderByGroupId = $(el).attr("data-orderby-groupid");
	var orderBySeq = $(el).attr("data-orderby-seq");
	var registerDateType = $(el).attr("data-registerdate-type");
	var commentPageIndex = req.query.commentPageIndex;
	if(commentPageIndex == null || isNaN(commentPageIndex))
		commentPageIndex = 1;
	
	if(cpp != null && cpp != "")
		cpp = parseInt(cpp);
	if(pgc != null && pgc != "")
		pgc = parseInt(pgc);
	
	$(el).removeAttr("data-board-id");
	$(el).removeAttr("data-article-seq");
	$(el).removeAttr("data-pagination");
	$(el).removeAttr("data-cpp");
	$(el).removeAttr("data-pgc");
	$(el).removeAttr("data-orderby-groupid");
	$(el).removeAttr("data-orderby-seq");
	
	el.commentPageData.boardId = boardId;
	el.commentPageData.articleSeq = articleSeq;
	el.commentPageData.searchData = {
		cpp : cpp,
		commentPageIndex : commentPageIndex,
		orderByGroupId : orderByGroupId,
		orderBySeq : orderBySeq,
		registerDateType : registerDateType
	};
	el.commentPageData.pgc = pgc;
	el.commentPageData.isPagination = isPagination;
	
	$(el).find("*[data-parts='info']").each(function()
	{
		$(this).removeAttr("data-parts");
		this.templateData = _component.getTemplateHtml($, this);
		el.parts.info.push(this);
	});
	
	$(el).find("*[data-parts='body']").each(function()
	{
		$(this).removeAttr("data-parts");
		this.templateData = _component.getTemplateHtml($, this);
		el.parts.body.push(this);
	});
	
	el.loadComment = function(commentPageIndex)
	{
		if(commentPageIndex != null && !isNaN(commentPageIndex))
		{
			this.commentPageData.searchData.commentPageIndex = commentPageIndex;
		}
		else
		{
			this.commentPageData.searchData.commentPageIndex = 1;
		}
		
		var bodyList = el.parts.body;
		
		if(bodyList && bodyList.length > 0)
		{
			if(this.setPageNumbers != null)
				this.setPageNumbers();
//			var list = $.api.comment.__getCommentList({imboardId : this.commentPageData.imboardId, boardId : this.commentPageData.boardId, articleSeq : this.commentPageData.articleSeq, searchData : this.commentPageData.searchData});
			
			try
			{
				if(commentPageIndex != null && cpp != null)
				{
					this.commentPageData.searchData.startIndex = parseInt(cpp) * (parseInt(commentPageIndex) -1);
					this.commentPageData.searchData.endIndex = parseInt(cpp);
				}
			}
			catch(err)
			{
				this.commentPageData.searchData.startIndex = null;
				this.commentPageData.searchData.endIndex = null;
			}
			
			commentDao.getCommentList(this.commentPageData.boardId, this.commentPageData.articleSeq, this.commentPageData.searchData, function(response)
			{
				var bodyLength = bodyList.length;
				for(var i=0; i<bodyLength; i++)
				{
					var html = bodyList[i].templateData;
					var template = Handlebars.compile(html);
					$(bodyList[i]).html(template({commentList : response, userId : (req.session.user != null ? req.session.user.id : null)}));
				}
				
				_component.compile($, el, req, function()
				{
					callback();
				});
			});
		}
		else
		{
			_component.compile($, el, req, function()
			{
				callback();
			});
		}
	};
	
	if(el.commentPageData.isPagination != "false")
	{
		$(el).find("*[data-parts='pagination']").each(function()
		{
			$(el).removeAttr("data-parts");
			this.templateData = _component.getTemplateHtml($, this);
			el.parts.pagination.push(this);
		});
		
		el.commentPageData.searchData.cpp = cpp;
		el.commentPageData.searchData.commentPageIndex = commentPageIndex;
		
		el.setPageNumbers = function()
		{
			var that = this;
			var pagination = this.parts.pagination;
			
			if(pagination != null)
			{
				var commentPageIndex = this.commentPageData.searchData.commentPageIndex;
				if(commentPageIndex == null || isNaN(commentPageIndex))
					commentPageIndex = 1;
				
//				var totalCount = $.api.comment.getCommentListCount({imboardId : this.commentPageData.imboardId, boardId : this.commentPageData.boardId, articleSeq : this.commentPageData.articleSeq});
				commentDao.getCommentListCount(this.commentPageData.boardId, this.commentPageData.articleSeq, this.commentPageData.searchData, function(totalCount)
				{
					var maxPage = 0;
					
					var infoList = that.parts.info;
					var infoLength = infoList.length;
					for(var i=0; i<infoLength; i++)
					{
						var html = infoList[i].templateData;
						var template = Handlebars.compile(html);
						$(infoList[i]).html(template({count : totalCount}));
					}
					
//					if(totalCount > 10)
//					{
//						maxPage = (Math.ceil(totalCount / 10) * 10) / cpp;
//					}
//					else
//					{
						maxPage = Math.ceil(totalCount / cpp);
//					}
					
					var startPage = Math.ceil(commentPageIndex / pgc);
					startPage = startPage + (startPage - 1) * (pgc - 1);
					
					var pageData = [];
					for(var i=startPage; i<startPage + pgc && i <= maxPage; i++)
					{
						pageData.push({pageNumber : i});
					}
					
					var length = pagination.length;
					for(var i=0; i<length; i++)
					{
						var html = pagination[i].templateData;
						var template = Handlebars.compile(html);
						$(pagination[i]).html(template({pageList : pageData, commentPageIndex : parseInt(commentPageIndex), maxPage : maxPage}));
					}
				});
			}
		};
	}
	
	el.loadComment(commentPageIndex);
};

module.exports = _component;