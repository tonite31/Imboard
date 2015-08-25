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
	var list = $(el).find("*[data-bind]");
	this.compile($, list, req, callback, 0);
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

DataBindModule.prototype.compile = function($, list, req, callback, index)
{
	var that = this;
	if(index >= list.length)
	{
		callback($.html());
	}
	else
	{
		var el = list[index];
		
		this.databind($, el, req, function() // el의 innerHTML로 템플릿이 작성되어있는경우 data-bind가 발견될 수 있다. 그럼 끝까지 파고들어서 맨 마지막 data-bind부터 실행함.
		{
			//마지막 data-bind el의 innerHTML에 data-bind가 없는 경우 아래 코드가 수행됨
			
			var name = $(el).attr("data-bind");
			$(el).removeAttr("data-bind");
			
			if(that.modules.hasOwnProperty(name)) // data-bind 모듈체크 후
			{
				var param = that.getParameters($, el);
				if(param == null)
				{
					that.compile($, list, req, callback, index+1); // 파라미터 가져오는도중 파싱에러가 발생하면 다음 시블링의 data-bind로 넘어간다.
				}
				else
				{
					try
					{
						that.modules[name].call(that, $, el, param, req, function() // 정상적인 파라미터를 얻은경우 모듈 호출.
						{
							that.databind($, el, req, function() //script로 템플릿이 작성된경우는 위에서 검출이 안된다. 따라서 data-bind 후 템플릿이 실제로 innerHTML로 만들어졌을 때 data-bind가 또 있는지 체크하고 수행함
							{
								that.compile($, list, req, callback, index+1); //끝나면 다음 시블링 data-bind로 넘어감.
							});
						});
					}
					catch(err)
					{
						//모듈 호출시 오류 발생하는경우
						_log.error(err.stack);
						
						//다음으로 넘어감
						that.databind($, el, req, function()
						{
							that.compile($, list, req, callback, index+1); //끝나면 다음 시블링 data-bind로 넘어감.
						});
					}
				}
			}
			else
			{
				$(el).removeAttr("data-param").removeAttr("data-template-id");
				$(el).html("<span> ModuleNotFoundException : " + name + "</span>"); // 모듈이 없는경우 알려주기 위해..
				that.compile($, list, req, callback, index+1);
			}
		});
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