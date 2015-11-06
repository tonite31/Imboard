module.exports.load = function(dir)
{
	try
	{
		global._localize = require(dir + '/content/frame/' + _config.frame + '/properties/localize');
	}
	catch(err)
	{
		global._localize = {};
	}

	try
	{
		global._localizeCore = require(dir + '/content/common/core/properties/localize');
	}
	catch(err)
	{
		global._localizeCore = {};
	}

	try
	{
		global._localizeSettings = require(dir + '/content/common/settings/properties/localize');
	}
	catch(err)
	{
		global._localizeSettings = {};
	}

	try
	{
		global._variables = require(dir + "/content/frame/" + _config.frame + "/properties/variables");
	}
	catch(err)
	{
		global._variables = {};
	}
	
	try
	{
		require(dir + "/content/frame/" + _config.frame + "/properties/helper");
	}
	catch(err)
	{
	}
};