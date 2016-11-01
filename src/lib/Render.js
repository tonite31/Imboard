var fs = require('fs');

module.exports.getData = function(filepath)
{
	try
	{
		return fs.readFileSync(filepath).toString();
	}
	catch(e)
	{
		return false;
	}
};

module.exports.render = function(req, res, data)
{
	console.log("흠 : ", data);
	res.writeHead(200, {"Content-Type" : "text/html"});
	res.end(data);
}; 