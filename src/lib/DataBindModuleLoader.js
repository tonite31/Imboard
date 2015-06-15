var DataBindModule = require(_path.lib + "/DataBindModule.js");
var fs = require('fs');

var ModuleLoader = function()
{
	if(ModuleLoader.caller != ModuleLoader.getInstance)
		throw Error('this ModuleLoader cannot be instanciated');
};

ModuleLoader.prototype.load = function(dir)
{
	var files = fs.readdirSync(dir);
	
	for(var i=0; i<files.length; i++)
	{
		if(fs.lstatSync(dir + '/' + files[i]).isDirectory())
		{
			this.load(dir + '/' + files[i]);
		}
		else
		{
			if(files[i].lastIndexOf(".js") == -1)
				continue;
			
			var module = require(dir + '/' + files[i]);
			for(var key in module)
			{
				DataBindModule.addModule(key, module[key]);
			}
		}
	}
};

ModuleLoader.instance = null;

ModuleLoader.getInstance = function(){
	if(this.instance == null)
		this.instance = new ModuleLoader();
	
	return this.instance;
};

module.exports = ModuleLoader.getInstance();