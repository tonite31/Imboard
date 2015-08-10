try
{
	if(require)
		Handlebars = require("handlebars");
}
catch(err)
{
	
}

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