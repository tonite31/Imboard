var fs = require('fs');
var Handlebars = require("handlebars");
var HandlebarHelper = require(_path.content + "/module/imboard/js/handlebars-helper.js");

var DataBindModule = function()
{
	if(DataBindModule.caller != DataBindModule.getInstance)
		throw Error('this DataBindModule cannot be instanciated');
	
	this.modules = {};
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
	}
	catch(err)
	{
		_log.error(err.stack);
	}
	
	return Handlebars.compile(html);
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
		$(el).html("<span> 파라미터 <strong>" + value + "</strong> 파싱중 오류가 발생했습니다.</span><br/><br/><pre>" + err.stack + "</pre>");
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
					that.modules[name].call(that, $, el, param, req, function() // 정상적인 파라미터를 얻은경우 모듈 호출.
					{
						that.databind($, el, req, function() //script로 템플릿이 작성된경우는 위에서 검출이 안된다. 따라서 data-bind 후 템플릿이 실제로 innerHTML로 만들어졌을 때 data-bind가 또 있는지 체크하고 수행함
						{
							that.compile($, list, req, callback, index+1); //끝나면 다음 시블링 data-bind로 넘어감.
						});
					});
				}
			}
			else
			{
				$(el).attr("data-bind-description", "module not found"); // 모듈이 없는경우 알려주기 위해..
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