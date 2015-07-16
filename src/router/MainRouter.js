var fs = require('fs');

var cheerio = require('cheerio');
var VisitorDao = require(_path.src + "/dao/VisitorDao.js");
var DataBindModule = require(_path.lib + "/DataBindModule.js");

module.exports.main =
{
	type : 'get',
	path : '/*',
	callback : function(req, res, next)
	{
		try
		{
			if(!req.session)
				req.session = {};
			
			if("http://" + req.headers.host != global._host)
			{
				res.redirect(global._host + req.url);
				return;
			}
			
			var path = req.path.replace(".page", ".html");
			if(path.match(/^\/settings\/?$/) != null)
			{
				render(req, res, "common", "settings", "/index.html");
			}
			else if(path.match(/^\/signin\/?$/) != null)
			{
				if(req.session.user != null && req.session.user.id != null)
				{
					render(req, res, "common", "core", "/signed.html");
				}
				else
				{
					render(req, res, "common", "core", "/signin.html");
				}
			}
			else if(path.match(/^\/favicon.ico\/?$/) != null)
			{
				next();
			}
			else
			{
				req.session.lastUrl = req.url;
				
				//분석
				var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
				var userAgent = req.headers['user-agent'];
				var referer = req.headers['referer'];
				
				if(referer == null || referer.indexOf(_host) != -1)
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
			_log.error(err.stack);
			render(req, res, "common", "core", "/500.html");
		}
	}
};

function replaceData(html, req)
{
	var matchs = html.match(/[^]?#{lan.[^}]*}/gi);
	
	var cc = "ko-KR";
	try
	{
		cc = req.headers["accept-language"].split(",")[0];
		var split = cc.split("-");
		cc = split[0] + "-" + split[1].toUpperCase();
	}
	catch(err)
	{
		_log.error(err.stack);
	}
	finally
	{
		try
		{
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
					if(_languages.hasOwnProperty(key))
						html = html.replace(m, _languages[key][cc]);
				}
			}
			
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
		}
		catch(err)
		{
			_log.error(err.stack);
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
				layout = replaceData(layout, req);
				$(this).html(layout);
				$(this).find("script[type='text/x-handlebars-template']").each(function()
		 		{
		 			$("head").append(this);
		 		});
			}
			
			bindInnerHtml(req, frame, $, this);
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
			layout = replaceData(layout, req);
			
			$ = cheerio.load(layout);
			
			bindPiece(req, folder, frame, path, $, "body");
			
		 	return $;
		}
		else
		{
			return null;
		}
	}
	
	return null;
}

function bindPiece(req, folder, frame, path, $, el)
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
	 			pieceData = replaceData(pieceData, req);
	 			
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
		
		bindPiece(req, folder, frame, path, $, this);
	});
}