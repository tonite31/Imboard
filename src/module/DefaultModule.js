module.exports.template = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	$(el).html(template());
	next();
};

module.exports.locale = function($, el, param, req, next)
{
	var cc = "ko-KR";
	if(req.query.locale)
	{
		cc = req.query.locale
	}
	else
	{
		cc = req.headers["accept-language"].split(",")[0];
		var split = cc.split("-");
		cc = split[0] + "-" + split[1].toUpperCase();
	}
	
	var template = this.getTemplate($, el);
	$(el).html(template({locale : cc}));
	next();
};