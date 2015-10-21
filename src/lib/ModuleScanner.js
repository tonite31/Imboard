var fs = require('fs');

var RouterCallbackWrapper = require(_path.lib + "/RouterCallbackWrapper.js");

var ModuleScanner = function()
{
	if(ModuleScanner.caller != ModuleScanner.getInstance)
		throw Error('this ModuleScanner cannot be instanciated');
	
	this.requestPaths = "";
	
	this._log = {
		debug : function(string){
			console.log(string);
		}
	};
};

ModuleScanner.prototype.setLogger = function(log)
{
	this._log = log;
}

ModuleScanner.prototype.scanRouter = function(dir)
{
	this._log.debug("=================================================");
	this._log.debug("time : " + new Date().toString());
	this._log.debug("-------------------------------------------------");
	this._log.debug(" # Router Scaning #");
	this._log.debug(" -- " + dir);

	var files = fs.readdirSync(dir);
	
	for(var i=0; i<files.length; i++)
	{
		if(fs.lstatSync(dir + '/' + files[i]).isDirectory())
		{
			this.scanRouter(dir + '/' + files[i]);
		}
		else
		{
			if(files[i].lastIndexOf(".js") == -1)
				continue;
			
			this._log.debug(" - " + files[i]);
			var router = require(dir + '/' + files[i]);
			for(var name in router)
			{
				var type = router[name].type;
				var callback = router[name].callback;
				var path = router[name].path ? router[name].path : name;
				var auth = router[name].auth;
				var multipart = router[name].multipart;
				
				if(this.requestPaths.indexOf(";[" + type + "]" + path + "@") == -1)
				{
					if(!type)
						type = "get";
					
					if(!callback)
						throw Error("RouterCallbackNotFoundException : " + dir + '/' + files[i]);

					if(multipart)
						app[type](path, _multipart(), RouterCallbackWrapper.create(callback));
					else
						app[type](path, RouterCallbackWrapper.create(callback));
					this.requestPaths += ";[" + type + "]" + path + "@";
				}
				else
				{
					throw Error("DuplicatedPathException : [" + type + "]" + path + " (" + dir + '/' + files[i] + ")");
				}
			}
		}	
	}
	
	this._log.debug("=================================================\n");
};

ModuleScanner.prototype.scanModel = function(dir)
{
	this._log.debug("=================================================");
	this._log.debug("time : " + new Date().toString());
	this._log.debug("-------------------------------------------------");
	this._log.debug(" # Model Scaning #");
	this._log.debug(" -- " + dir);
	
	var files = fs.readdirSync(dir);
	
	for(var i=0; i<files.length; i++)
	{
		if(fs.lstatSync(dir + '/' + files[i]).isDirectory())
		{
			this.modelScan(dir + '/' + files[i]);
		}
		else
		{
			var lastIndex = files[i].lastIndexOf(".js"); 
			if(lastIndex == -1)
				continue;
			
			var filename = files[i].substring(0, lastIndex);
			
			this._log.debug(" - " + files[i]);
			var model = require(dir + '/' + files[i]);
			global.sqlMapConfig.adicioneModel(filename, model);
		}	
	}
	
	this._log.debug("=================================================\n");
};

ModuleScanner.prototype.scanMybatisXml = function(dir)
{
	this._log.debug("=================================================");
	this._log.debug("time : " + new Date().toString());
	this._log.debug("-------------------------------------------------");
	this._log.debug(" # MybatisXml Scaning #");
	this._log.debug(" -- " + dir);
	
	var files = fs.readdirSync(dir);
	
	for(var i=0; i<files.length; i++)
	{
		if(fs.lstatSync(dir + '/' + files[i]).isDirectory())
		{
			this.mybatisXmlScan(dir + '/' + files[i]);
		}
		else
		{
			if(files[i].lastIndexOf(".xml") == -1)
				continue;
			
			this._log.debug(" - " + files[i]);
			global.sqlMapConfig.adicione(_mybatis.processeArquivo(dir + '/' + files[i]));
		}	
	}
	
	this._log.debug("=================================================\n");
};

ModuleScanner.instance = null;

ModuleScanner.getInstance = function(){
	if(this.instance == null)
		this.instance = new ModuleScanner();
	
	return this.instance;
};

module.exports = ModuleScanner.getInstance();