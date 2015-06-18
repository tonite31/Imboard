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
					var html = Render.getData(global._path.content + "/common/signed.html");
					html = replaceData(html, req);
					Render.render(req, res, html);
				}
				else
				{
					if(!req.session)
						req.session = {};
					
					if(req.session.signReferer == null)
						req.session.signReferer = req.headers.referer;
					
					var html = Render.getData(global._path.content + "/common/signin.html");
					html = replaceData(html, req);
					Render.render(req, res, html);
				}
			}
			else if(path.match(/^\/profile\/?$/) != null)
			{
				if(req.session.signReferer == null)
					req.session.signReferer = req.headers.referer;
				
				var html = Render.getData(global._path.content + "/common/profile.html");
				html = replaceData(html, req);
				Render.render(req, res, html);
			}
			else if(path.match(/^\/redirect\/?$/) != null)
			{
				res.redirect(req.session.signReferer ? req.session.signReferer : "/");
			}
			else if(path.match(/^\/signup\/?$/) != null)
			{
				var html = Render.getData(global._path.content + "/common/signup.html");
				html = replaceData(html, req);
//
//				if(req.query.piece != null && req.query.piece == "setPassword")
//				{
//					if(req.session.signupKey == req.query.key)
//					{
//						$ = cheerio.load(html);
//						$("*[data-fragment]").html(Render.getData(_path.content + "/common/signup2.html"));
//						html = $.html();
//					}
//					else
//					{
//						$ = cheerio.load(Render.getData(global._path.content + "/common/404.html"));
//						$("h1").text("잘못된경로로 접속하셨습니다");
//						html = $.html();
//					}
//				}
				
				Render.render(req, res, html);
			}
			else if(path.match(/^\/favicon.ico\/?$/) != null)
			{
				next();
			}
			else
			{
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
			$ = cheerio.load(Render.getData(global._path.content + "/common/500.html"));
			$("#error").html(err.stack.replace(/\n/gi, "<br/>"));
			
			Render.render(req, res, $.html());
		}
	}
};

function replaceData(html, req)
{
	var matchs = html.match(/\#{lan.[^}]*}/gi);
	
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
		if(matchs != null)
		{
			for(var i=0; i<matchs.length; i++)
			{
				var key = matchs[i].replace("#{lan.", "").replace("}", "");
				if(_languages.hasOwnProperty(key))
					html = html.replace(matchs[i], _languages[key][cc]);
			}
		}
		
		matchs = html.match(/\#{query.[^}]*}/gi);
		if(matchs != null)
		{
			for(var i=0; i<matchs.length; i++)
			{
				var key = matchs[i].replace("#{query.", "").replace("}", "");
				var value = req.query[key];
				if(value == "" || value == null)
					value = "";
				
				html = html.replace(matchs[i], value);
			}
		}
		
		matchs = html.match(/\#{user.[^}]*}/gi);
		if(matchs != null)
		{
			for(var i=0; i<matchs.length; i++)
			{
				var key = matchs[i].replace("#{user.", "").replace("}", "");
				var value = "";
				if(req.session && req.session.user)
					value = req.session.user[key];
				
				if(value == null)
					value = "";
				
				html = html.replace(matchs[i], value);
			}
		}
		
		matchs = html.match(/\#{path.[^}]*}/gi);
		if(matchs != null)
		{
			var frameData = {root : "/content/frame/" + _config.frame, module : "/content/module", lib : "/content/lib"};
			for(var i=0; i<matchs.length; i++)
			{
				var key = matchs[i].replace("#{path.", "").replace("}", "");
				var value = frameData[key];
				
				if(value == null)
					value = "";
				
				html = html.replace(matchs[i], value);
			}
		}
	}
	
	return html;
}

function render(req, res, folder, frame, path)
{
	var $ = getLayout(req, res, folder, frame, path);
	
	$("*[data-sfragment]").each(function()
	{
		var src = $(this).attr("data-sfragment");
		$(this).removeAttr("data-sfragment");
		
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
	});
	
	if(!$)
	{
		$ = cheerio.load(Render.getData(global._path.content + "/common/404.html"));
		$("h1").text("잘못된경로입니다");
		Render.render(req, res, $.html());
	}
	else
	{
		DataBindModule.databind($, "body", req, function(html)
		{
			Render.render(req, res, html);
		});
	}
}

function getLayout(req, res, folder, frame, path)
{
	if(path[0] != "/")
		path = "/" + path;
	
	if(path == "/")
		path = "/index.html";
	
	var layout = Render.getData(_path.content + "/" + folder + "/" + frame + "/html" + path);
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

function bindPiece(req, folder, frame, path, $, el)
{
	$(el).find("*[data-fragment]").each(function()
	{
		var key = $(this).attr("data-fragment");
		$(this).removeAttr("data-fragment");
		
		if(req.query && req.query.hasOwnProperty(key))
		{
			var pieceData = Render.getData(global._path.content + "/" + folder + "/" + frame + "/html" + path + "/" + req.query[key] + ".html");
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
	 			$(this).html(Render.getData(global._path.content + "/common/404.html"));
 				$(this).find("h1").text("페이지 조각을 찾을 수 없습니다");
	 		}
		}
		
		bindPiece(req, folder, frame, path, $, this);
	});
}