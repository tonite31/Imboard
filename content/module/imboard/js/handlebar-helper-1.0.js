try
{
	if(require)
		Handlebars = require("handlebars");
}
catch(err)
{
	
}

Handlebars.registerHelper('equals', function(a, b, opts)
{
	if(a === b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});

Handlebars.registerHelper('notequals', function(a, b, opts)
{
	if(a !== b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});

Handlebars.registerHelper('empty', function(a, opts)
{
	if(a === undefined || a === null || a === "" || a === '') // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});

Handlebars.registerHelper('notempty', function(a, opts)
{
	if(a === undefined || a === null || a === "" || a === '') // Or === depending on your needs
		return opts.inverse(this);
    else
    	return opts.fn(this);
});

Handlebars.registerHelper('percent', function(a, b, c, opts)
{
	a = new Number(a.replace(/,/gi, ""));
	b = new Number(b.replace(/,/gi, ""));
	c = new Number(c.replace(/,/gi, ""));
	return Math.floor(((a - b) / c) * 100);
});

Handlebars.registerHelper("tojson", function(a, b, opts)
{
	return JSON.parse(a)[b];
});

Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

Handlebars.registerHelper("sign", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    
    return {
        "<": lvalue < rvalue,
        "lt": lvalue < rvalue,
        "<=": lvalue <= rvalue,
        "lt=": lvalue <= rvalue,
        ">": lvalue > rvalue,
        "rt": lvalue > rvalue,
        ">=": lvalue >= rvalue,
        "rt=": lvalue >= rvalue,
        "==": lvalue == rvalue,
        "!=": lvalue != rvalue,
        "===": lvalue === rvalue
    }[operator] ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("shortDate", function(a)
{
	if(a)
	{
		var split = a.split(" ");
		var date = split[0];
		var time = split[1];
		
		date = date.split("-");
		
		var today = new Date();
		if(today.getFullYear() == parseInt(date[0]) && today.getMonth()+1 == parseInt(date[1]) && today.getDate() == parseInt(date[2]))
			return time;
		else
			return date.join("-");
	}
	else
	{
		return "";
	}
});

Handlebars.registerHelper("split", function(a, b, template)
{
	var html = "";
	
	if(b)
	{
		var split = b.split(a);
		if(template)
		{
			for(var i=0; i<split.length; i++)
			{
				html += template.replace("${value}", split[i]);
			}
		}
	}
	
	return html;
});

Handlebars.registerHelper("textThumbnail", function(content, token, count)
{
	var html = "";
	
	if(content)
	{
		content = content.replace(/<img[^>]*>/gi, "").replace(/<div[^>]*>[a-zA-Z\<\>]*<\/div>/gi, "");
		var split = content.split(token);
		for(var i=0; i<count && i<split.length; i++)
		{
			html += split[i] + ((i == count-1 || i == split.length-1) && count < split.length ? "..." : "") + token;
		}
	}
	
	return html;
});

Handlebars.registerHelper('escape', function(variable) {
	  return variable.replace(/(['"])/g, '\\$1');
});