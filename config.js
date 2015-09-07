var prompt = require('prompt');
var config = require(__dirname + '/resources/properties/config');
var fs = require('fs');

var loop = true;
var Menu = function()
{
	this.menuList = [];
};

Menu.prototype.addMenu = function(name, callback)
{
	this.menuList.push({name : name, callback : callback});
};

Menu.prototype.showMenu = function(loop, quitCallback)
{
	console.log();
	console.log(" -- imboard configuration -- ");
	for(var i=0; i<this.menuList.length; i++)
	{
		console.log((i+1) + ". " + this.menuList[i].name);
	}

	if(loop)
		console.log("q. quit");

	prompt.start();
	prompt.message = "";
	prompt.delimiter = "";

	var that = this;
	prompt.get(['select a menu : '], function (err, result)
	{
		if(err)
		{
			console.error(err);
			return;
		}

		var menu = result['select a menu : '];
		if(menu == "q")
		{
			if(quitCallback)
				quitCallback();
			return;
		}
		else if(isNaN(menu))
		{
			console.log();
			console.log("selected menu is invalid");
			console.log("-----------------------------------------");

			if(loop)
			{
				that.showMenu(loop, quitCallback);
			}

			return;
		}

		var callback = that.menuList[menu-1].callback;
		if(callback)
		{
			if(loop)
			{
				callback(function()
				{
					console.log();
					console.log("-----------------------------------------");
					that.showMenu(loop, quitCallback);
				});
			}
			else
			{
				callback(quitCallback);
			}
		}
		else
		{
			if(quitCallback)
				quitCallback();
		}
	});
};

var configMenu = new Menu();

configMenu.addMenu("frame", function(callback)
{
	prompt.start();
	prompt.message = "";
	prompt.delimiter = "";

	prompt.get(['frame name : '], function(err, result)
	{
		if(err)
		{
			console.error(err);
			return;
		}

		var name = result['frame name : '];
		config.frame = name ? name : "blog";

		if(callback)
			callback();
	});
});

configMenu.addMenu("server", function(callback)
{
	prompt.start();
	prompt.message = "";
	prompt.delimiter = "";

	prompt.get(['port : ', 'base URL : '], function(err, result)
	{
		if(err)
		{
			console.error(err);
			return;
		}

		var baseUrl = result['base URL : '];
		if(baseUrl[baseUrl.length-1] == "/")
			baseUrl = baseUrl.substring(0, baseUrl.length-1);
		
		if(baseUrl.indexOf("http://") == -1 && baseUrl.indexOf("https://") == -1)
			baseUrl = "http://" + baseUrl;
		
		if(baseUrl.indexOf(":") != -1)
			baseUrl = baseUrl.split(":")[0];

		config.server.port = result['port : '];
		config.server.baseUrl = baseUrl;

		if(callback)
			callback();
	});
});

configMenu.addMenu("log", function(callback)
{
	prompt.start();
	prompt.message = "";
	prompt.delimiter = "";

	prompt.get(['level : '], function(err, result)
	{
		if(err)
		{
			console.error(err);
			return;
		}

		config.log.level = result['level : '];

		if(callback)
			callback();
	});
});

configMenu.addMenu("jdbc", function(callback)
{
	prompt.start();
	prompt.message = "";
	prompt.delimiter = "";

	prompt.get(['host     : ', 'username : ', 'password : ', 'database : ', 'port     : '], function(err, result)
	{
		if(err)
		{
			console.error(err);
			return;
		}

		config.jdbc.host 	 = result['host     : '];
		config.jdbc.user 	 = result['username : '];
		config.jdbc.password = result['password : '];
		config.jdbc.database = result['database : '];
		config.jdbc.port	 = result['port     : '];

		if(callback)
			callback();
	});
});

configMenu.showMenu(loop, function()
{
	fs.writeFile(__dirname + '/resources/properties/config.json', JSON.stringify(config, null, 4), function(err, result)
	{
		if(err)
		{
			console.error(err);
			return;
		}
	});
});
