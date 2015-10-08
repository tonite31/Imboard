var fs = require('fs');
var Handlebars = require("handlebars");
var HandlebarHelper = require(_path.content + "/module/imboard/js/handlebars-helper.js");

var DataBindModule = function()
{
	if(DataBindModule.caller != DataBindModule.getInstance)
		throw Error('this DataBindModule cannot be instanciated');

	this.modules = {};

	this.loadCustomHelper();
};

DataBindModule.prototype.loadCustomHelper = function()
{
	var path = _path.content + "/frame/" + _config.frame + "/properties/handlebars/";

	try
	{
		var result = fs.readdirSync(path);
		for(var i=0; i<result.length; i++)
		{
			require(path + result[i]);
		}
	}
	catch(err)
	{
//		_log.error(err.stack);
	}
};

DataBindModule.prototype.databind = function($, el, req, callback)
{
	var targetList = $(el).find("*[data-bind]");

	var list = [];
	for(var i=0; i<targetList.length; i++)
	{
		list.push(targetList[i]);
	}

	this.compile($, list, req, callback);
};

DataBindModule.prototype.getTemplate = function($, el)
{
	var html = "";
	try
	{
		var templateId = $(el).attr('data-template-id');
		if(templateId)
		{
			var template = $("#" + templateId);
			html = template.html();

			if(template.attr("data-precompile") == "true")
			{
				//프리컴파일형식으로 만들어두자?
			}
			else
			{
				template.remove();
			}
		}
		else
		{
			if($(el).attr("data-precompile") == "true")
			{

			}

			html = $(el).html().replace(/\\&quot;/gi, "\"");
			html = html.replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
			html = html.replace(/&apos;/gi, "\'");
		}

		$(el).removeAttr("data-template-id");

		if(!html)
			html = "<p class='databind-error'>Empty template!</p>";

		var matchs = html.match(/{{[^}]*}}/gi);
		if(matchs)
		{
			for(var i=0; i<matchs.length; i++)
			{
				var replaceString = matchs[i].replace(/&quot;/gi, "\"");
				html = html.replace(matchs[i], replaceString);
			}
		}

		return Handlebars.compile(html);
	}
	catch(err)
	{
		_log.error(err.stack);
	}

	return null;
};

DataBindModule.prototype.getParameters = function($, el)
{
	var param = {};
	var value = "";
	try
	{
		value = $(el).attr("data-param");
		if(value != null)
		{
			param = JSON.parse(value);
			if(param == null)
				param = {};
		}

		$(el).removeAttr("data-param");
	}
	catch(err)
	{
		_log.error(err.stack);
		$(el).html("<span> ParseException : <strong>" + value + "</strong> </span><br/><br/><pre>" + err.stack + "</pre>");
		param = null;
	}

	return param;
};

DataBindModule.prototype.compile = function($, list, req, callback)
{
	var that = this;
	if(list.length <= 0)
	{
		callback($.html());
	}
	else
	{
		var el = list.shift();
		
		var name = $(el).attr("data-bind");
		$(el).removeAttr("data-bind");
		
		if(this.modules.hasOwnProperty(name))
		{
			var param = this.getParameters($, el);
			if(param == null)
			{
				this.compile($, list, req, callback); // 파라미터 가져오는도중 파싱에러가 발생하면 다음 시블링의 data-bind로 넘어간다.
			}
			else
			{
				try
				{
					this.modules[name].call(that, $, el, param, req, function() // 정상적인 파라미터를 얻은경우 모듈 호출.
					{
						that.databind($, el, req, function() //script로 템플릿이 작성된경우는 모듈 호출 후에 data-bind가 새로 등장할 수 있음. 따라서 data-bind 후 템플릿이 실제로 innerHTML로 만들어졌을 때 data-bind가 또 있는지 체크하고 수행함
						{
							that.compile($, list, req, callback); //끝나면 다음 시블링 data-bind로 넘어감.
						});
					});
				}
				catch(err)
				{
					//모듈 호출시 오류 발생하는경우
					_log.error(err.stack);

					//다음으로 넘어감
					this.compile($, list, req, callback); //끝나면 다음 시블링 data-bind로 넘어감.
				}
			}
		}
		else
		{
			$(el).removeAttr("data-param").removeAttr("data-template-id");
			$(el).html("<span> ModuleNotFoundException : " + name + "</span>"); // 모듈이 없는경우 알려주기 위해..
			this.compile($, list, req, callback);
		}
	}
};

DataBindModule.prototype.addModule = function(key, f)
{
	this.modules[key] = f;
};

DataBindModule.instance = null;

DataBindModule.getInstance = function()
{
	if(this.instance == null)
		this.instance = new DataBindModule();

	return this.instance;
};

module.exports = DataBindModule.getInstance();
