try
{
	if(require)
		Handlebars = require("handlebars");
}
catch(err)
{

}

Handlebars.registerHelper('test', function()
{
	var args = arguments;

	var opts = args[args.length-1];

	var test = "";
	for(var i=0; i<args.length-1; i++)
	{
		if(test)
			test += " ";
		if(typeof args[i] == "object")
			args[i] = true;

		test += (args[i] ? args[i] : "''");
	}

	var f = new Function("if(" + test + "){return true;}else{return false;}");

	if(f())
		return opts.fn(this);
	else
		return opts.inverse(this);
});

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

Handlebars.registerHelper("tojson", function(a, b, opts)
{
	try
	{
		return JSON.parse(a)[b];
	}
	catch(err)
	{
		return err;
	}
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
        "gt": lvalue > rvalue,
        ">=": lvalue >= rvalue,
        "gt=": lvalue >= rvalue,
        "==": lvalue == rvalue,
        "!=": lvalue != rvalue,
        "===": lvalue === rvalue,
        "!==": lvalue === rvalue,
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

Handlebars.registerHelper('escape', function(variable) {
	  return variable.replace(/(['"])/g, '\\$1');
});
