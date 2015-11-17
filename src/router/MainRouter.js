var fs = require('fs');

var cheerio = require('cheerio');
var VisitorDao = require(_path.src + "/dao/VisitorDao.js");
var DataBindModule = require(_path.lib + "/DataBindModule.js");
var Utils = require(_path.src + "/lib/Utils.js");

module.exports.main =
{
	type : 'get',
	path : '/*',
	callback : function(req, res, next)
	{
		try
		{
//			이부분은 딱히 필요가 없을거같다.
//			var re = new RegExp(("http://" + req.headers.host), 'gi');
//			var match = _host.match(re);
//			if(match == null)
//			{
//				res.redirect(global._host + req.url);
//				return;
//			}
			
			if(!req.session)
				req.session = {};			
			
			var path = req.path.replace(".page", ".html");
			if(path.match(/^\/settings\/?$/) != null)
			{
				try
				{
					 global._localize2 = require(_path.content + '/common/settings/properties/localize');
				}
				catch(err)
				{
					
				}
				
				render(req, res, "common", "settings", "/index.html");
			}
			else if(path.match(/^\/signin\/?$/) != null)
			{
				try
				{
					 global._localize2 = require(_path.content + '/common/core/properties/localize');
				}
				catch(err)
				{
					_loge.error("=================================================");
					_loge.error("time : " + new Date().toString());
					_loge.error("name : MainRouter main");
					_loge.error("-------------------------------------------------");
					_loge.error(err.stack);
					_loge.error("=================================================");
				}
				
				if(req.session.user != null && req.session.user.id != null)
				{
					render(req, res, "common", "core", "/signed.html");
				}
				else
				{
					render(req, res, "common", "core", "/signin.html");
				}
			}
			else if(path.match(/^\/accessDenied\/?$/) != null)
			{
				render(req, res, "common", "core", "/accessDenied.html");
			}
			else if(path.match(/^\/favicon.ico\/?$/) != null)
			{
				next();
			}
			else
			{
				if(req.url.match(/resources/) != null || req.url.match(/[^\.]*.js/) != null || req.url.match(/[^\.]*.css/) != null)
				{
					next();
					return;
				}
				
				req.session.lastUrl = req.url;
				
				//분석
				var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
				var userAgent = req.headers['user-agent'];
				var referer = req.headers['referer'];
				
				if(referer == null)
					referer = "";
				
				VisitorDao.insertVisitor(ip, userAgent, referer, function()
				{
					var frame = _config.frame;
					render(req, res, "frame", frame, path);
				});
			}
		}
		catch(err)
		{
			_loge.error("=================================================");
			_loge.error("time : " + new Date().toString());
			_loge.error("name : MainRouter main");
			_loge.error("-------------------------------------------------");
			_loge.error(err.stack);
			_loge.error("=================================================");
			render(req, res, "common", "core", "/500.html");
		}
	}
};

function replaceData(html, req, frame)
{
	var cc = "default";
	try
	{
		if(req.query.locale)
		{
			cc = req.query.locale;
		}
		else
		{
			var al = req.headers["accept-language"];
			if(al)
			{
				cc = al.split(",")[0];
				var split = cc.split("-");
				if(split && split.length == 2)
					cc = split[0] + "-" + split[1].toUpperCase();
			}
		}
	}
	catch(err)
	{
		_loge.error("=================================================");
		_loge.error("time : " + new Date().toString());
		_loge.error("name : MainRouter replaceData");
		_loge.error("-------------------------------------------------");
		_loge.error(err.stack);
		_loge.error("=================================================");
	}
	finally
	{
		html = localize(cc, html);
		
		try
		{
			var matchs = html.match(/[^]?#{lan.[^}]*}/gi);
			if(matchs != null)
			{
				for(var i=0; i<matchs.length; i++)
				{
					var m = matchs[i].substring(1);
					if(matchs[i][0] == "#")
					{
						html = html.replace(matchs[i], m);
						continue;
					}
					
					var key = m.replace("#{lan.", "").replace("}", "");
					if(frame == "core")
					{
						if(_localizeCore.hasOwnProperty(key))
							html = html.replace(m, (_localizeCore[key][cc] ? _localizeCore[key][cc] : _localizeCore[key]["default"]));
					}
					else if(frame == "settings")
					{
						if(_localizeSettings.hasOwnProperty(key))
							html = html.replace(m, (_localizeSettings[key][cc] ? _localizeSettings[key][cc] : _localizeSettings[key]["default"]));
					}
					else
					{
						if(_localize.hasOwnProperty(key))
							html = html.replace(m, (_localize[key][cc] ? _localize[key][cc] : _localize[key]["default"]));
					}
				}
			}

			matchs = html.match(/[^]?#{locale}/gi);
			if(matchs)
			{
				for(var i=0; i<matchs.length; i++)
				{
					var m = matchs[i].substring(1);
					if(matchs[i][0] == "#")
					{
						html = html.replace(matchs[i], "#{locale}");
						continue;
					}
					
					html = html.replace(m, cc);
				}
			}
			
//			matchs = html.match(/[^]?#{locale[^}]*}/gi);
//			if(matchs != null)
//			{
//				for(var i=0; i<matchs.length; i++)
//				{
//					var m = matchs[i].substring(1);
//					if(matchs[i][0] == "#")
//					{
//						html = html.replace(matchs[i], m);
//						continue;
//					}
//
//					html = html.replace(m, cc);
//				}
//			}
			
			matchs = html.match(/[^]?#{query}/gi);
			if(matchs)
			{
				var query = "";
				for(var key in req.query)
				{
					query += (query ? "&" : "?") + key + "=" + req.query[key];
				}
				
				for(var i=0; i<matchs.length; i++)
				{
					var m = matchs[i].substring(1);
					if(matchs[i][0] == "#")
					{
						html = html.replace(matchs[i], "#{query}");
						continue;
					}
					
					html = html.replace(m, query);
				}
			}
				
			matchs = html.match(/[^]?#{query\.[^}]*}/gi);
			if(matchs != null)
			{
				for(var i=0; i<matchs.length; i++)
				{
					var m = matchs[i].substring(1);
					if(matchs[i][0] == "#")
					{
						html = html.replace(matchs[i], m);
						continue;
					}
					
					var key = m.replace("#{query.", "").replace("}", "");
					var value = req.query[key];
					if(value == "" || value == null)
						value = "";
					
					html = html.replace(m, value);
				}
			}
			
			matchs = html.match(/[^]?#{user\.[^}]*}/gi);
			if(matchs != null)
			{
				for(var i=0; i<matchs.length; i++)
				{
					var m = matchs[i].substring(1);
					if(matchs[i][0] == "#")
					{
						html = html.replace(matchs[i], m);
						continue;
					}
					
					var key = m.replace("#{user.", "").replace("}", "");
					var value = "";
					
					if(req.session && req.session.user)
						value = req.session.user[key];
					
					if(value == null)
						value = "";
					
					html = html.replace(m, value);
				}
			}
			
			matchs = html.match(/[^]?#{path\.[^}]*}/gi);
			if(matchs != null)
			{
				var frameData = {root : "/content/frame/" + _config.frame, module : "/content/module", lib : "/content/lib"};
				for(var i=0; i<matchs.length; i++)
				{
					var m = matchs[i].substring(1);
					if(matchs[i][0] == "#")
					{
						html = html.replace(matchs[i], m);
						continue;
					}
					
					var key = m.replace("#{path.", "").replace("}", "");
					var value = frameData[key];
					
					if(value == null)
						value = "";
					
					html = html.replace(m, value);
				}
			}
			
			matchs = html.match(/[^]?#{var\.[^}]*}/gi);
			if(matchs != null)
			{
				for(var i=0; i<matchs.length; i++)
				{
					var m = matchs[i].substring(1);
					if(matchs[i][0] == "#")
					{
						html = html.replace(matchs[i], m);
						continue;
					}
					
					var key = m.replace("#{var.", "").replace("}", "");
					var value = global._variables[key];
					
					if(value == null)
						value = "";
					
					html = html.replace(m, value);
				}
			}
		}
		catch(err)
		{
			_loge.error("=================================================");
			_loge.error("time : " + new Date().toString());
			_loge.error("name : MainRouter replaceData");
			_loge.error("-------------------------------------------------");
			_loge.error(err.stack);
			_loge.error("=================================================");
		}
	}
	
	return html;
}

function render(req, res, folder, frame, path)
{
	var $ = getLayout(req, res, folder, frame, path);
	if($)
	{
		bindInnerHtml(req, frame, $, "body");
		bindReplaceHtml(req, frame, $, "body");
		replaceInnerTemplate($, "body");
		
		DataBindModule.databind($, "body", req, function(html)
		{
			Render.render(req, res, html);
		});
	}
	else
	{
		render(req, res, "common", "core", "/404.html");
	}
}

function replaceInnerTemplate($, el)
{
	$(el).find("*[data-bind]").each(function()
	{
		replaceInnerTemplate($, this);
		
		var innerHTML = $(this).html();
		if(innerHTML && !$(this).attr("data-template-id"))
		{
			var id = Utils.guid();
			var script = "<script id='" + id + "' type='text/x-handlebars-template' data-precompile='true'>" + innerHTML + "</script>";
			$("head").append(script);
			$(this).attr("data-template-id", id);
			$(this).html("");
		}
	});
}

function bindInnerHtml(req, frame, $, target)
{
	$(target).find("*[data-html]").each(function()
	{
		var src = $(this).attr("data-html");
		$(this).removeAttr("data-html");
		
		if(src)
		{
			if(src.indexOf("/", 0) != 0)
				src = "/" + src;
			
			var layout = Render.getData(_path.content + "/frame/" + frame + "/html" + src);
			if(layout)
			{
				layout = replaceData(layout, req, frame);
				$(this).html(layout);
				$(this).find("script[type='text/x-handlebars-template']").each(function()
		 		{
		 			$("head").append(this);
		 		});
			}
			
			bindReplaceHtml(req, frame, $, this);
			bindInnerHtml(req, frame, $, this);
		}
	});
}

function bindReplaceHtml(req, frame, $, target)
{
	$(target).find("*[data-replace-html]").each(function()
	{
		var src = $(this).attr("data-replace-html");
		$(this).removeAttr("data-replace-html");
		
		if(src)
		{
			if(src.indexOf("/", 0) != 0)
				src = "/" + src;
			
			var layout = Render.getData(_path.content + "/frame/" + frame + "/html" + src);
			if(layout)
			{
				layout = replaceData(layout, req, frame);
				
				var that = $(layout).get(0);
				bindInnerHtml(req, frame, $, that);
				bindReplaceHtml(req, frame, $, that);
				
				$(that).insertBefore(this);
				
				$(that).find("script[type='text/x-handlebars-template']").each(function()
		 		{
		 			$("head").append(this);
		 		});
				
				$(this).remove();
			}
			else
			{
				bindInnerHtml(req, frame, $, this);
				bindReplaceHtml(req, frame, $, this);
			}
		}
	});
}

function getLayout(req, res, folder, frame, path)
{
	if(path[0] != "/")
		path = "/" + path;
	
	if(path == "/")
		path = "/index.html";
	
	var layout = Render.getData(_path.content + "/" + folder + "/" + frame + "/html" + path);
	if(layout)
	{
		path = path.substring(0, path.lastIndexOf("/"));
		
		if(layout != null && layout != "")
		{
			layout = replaceData(layout, req, frame);
			
			$ = cheerio.load(layout);
			
			bindPiece(req, res, folder, frame, path, $, "body");
			
		 	return $;
		}
		else
		{
			return null;
		}
	}
	
	return null;
}

function bindPiece(req, res, folder, frame, path, $, el)
{
	$(el).find("*[data-fragment]").each(function()
	{
		var key = $(this).attr("data-fragment");
		$(this).removeAttr("data-fragment");
		
		if(req.query && req.query.hasOwnProperty(key))
		{
			var fileName = req.query[key];
			var match = fileName.match(/[^]*.html$/gi);
			if(!match)
				fileName += ".html";
				
			var pieceData = Render.getData(global._path.content + "/" + folder + "/" + frame + "/html" + path + "/" + fileName);
	 		if(pieceData)
	 		{
	 			pieceData = replaceData(pieceData, req, frame);
	 			
	 			if(fs.existsSync(global._path.content + "/" + folder + "/" + frame + "/js" + path + "/" + req.query[key] + ".js"))
		 			$("head").append("<script src='/content/" + folder + "/" + frame + "/js" + path + "/" + req.query[key] + ".js'></script>");
		 		if(fs.existsSync(global._path.content + "/" + folder + "/" + frame + "/css" + path + "/" + req.query[key] + ".css"))
		 			$("head").append("<link rel='stylesheet' href='/content/" + folder + "/" + frame + "/css" + path + "/" + req.query[key] + ".css'/>");
		 		
		 		$(this).html(pieceData);
		 		$(this).find("script[type='text/x-handlebars-template']").each(function()
		 		{
		 			$("head").append(this);
		 		});
	 		}
	 		else
	 		{
	 			render(req, res, "common", "core", "/noFragment.html");
	 		}
		}
		
		bindPiece(req, res, folder, frame, path, $, this);
	});
}

function localize(locale, html)
{
	do
	{
		var startIndex = html.indexOf("{{#localize", 0);
		var endIndex = html.indexOf("{{/localize}}", startIndex);
		
		if(startIndex != -1 && endIndex != -1)
		{
			var area = html.substring(startIndex, endIndex + 13);
			
			var token = "default";
			var match = area.match('@{' + locale + '}');
			if(match && match.length > 0)
				token = locale;
			
			var tokenLength = ('@{' + token + '}').length;
			var start = area.indexOf('@{' + token + '}', 0);
			var end = area.indexOf("@{", start + tokenLength);
			if(end == -1)
				end = area.indexOf("{{/localize}}", start + tokenLength);

			if(start != -1 && end != -1)
			{
				var text = area.substring(start + tokenLength, end);
				html = html.replace(area, text.trim());
			}
			else
			{
				html = html.replace(area, "");
			}
		}
		
	}while(startIndex != -1 && endIndex != -1);
	
	var matchs = html.match(/{{##localize}}/gi);
	if(matchs != null)
	{
		for(var i=0; i<matchs.length; i++)
		{
			html = html.replace(matchs[i], "{{#localize}}");
		}
	}
	
	matchs = html.match(/{{\/\/localize}}/gi);
	if(matchs != null)
	{
		for(var i=0; i<matchs.length; i++)
		{
			html = html.replace(matchs[i], "{{\/localize}}");
		}
	}
	
	matchs = html.match(/@#{[^}]*}/gi);
	if(matchs != null)
	{
		for(var i=0; i<matchs.length; i++)
		{
			html = html.replace(matchs[i], matchs[i].replace("@#", "@"));
		}
	}

	return html;
}
