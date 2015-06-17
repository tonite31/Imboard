module.exports.noparam = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	$(el).html(template());
	next();
};