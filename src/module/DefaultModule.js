module.exports.template = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	$(el).html(template());
	next();
};