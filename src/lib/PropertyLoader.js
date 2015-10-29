module.exports.load = function()
{
	try
	{
		global._localize = require(__dirname + '/content/frame/' + _config.frame + '/properties/localize');
	}
	catch(err)
	{
		global._localize = {};
	}

	try
	{
		global._localizeCore = require(__dirname + '/content/common/core/properties/localize');
	}
	catch(err)
	{
		global._localizeCore = {};
	}

	try
	{
		global._localizeSettings = require(__dirname + '/content/common/settings/properties/localize');
	}
	catch(err)
	{
		global._localizeSettings = {};
	}

	try
	{
		global._variables = require(__dirname + "/content/frame/" + _config.frame + "/properties/variables");
	}
	catch(err)
	{
		global._variables = {};
	}
};