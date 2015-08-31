var randomstring = require("randomstring");

var fs = require("fs");

var config = require(__dirname + '/resources/properties/config');
var Utils = require(__dirname + "/src/lib/Utils.js");

var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : config.jdbc.host,
	user     : config.jdbc.user,
	password : config.jdbc.password,
	database : config.jdbc.database
});

var QueryExecutor = function(queryList, connection)
{
	this.queryList = queryList;
	this.connection = connection;
};

QueryExecutor.prototype.addQueryList = function(queryList)
{
	for(var i=0; i<queryList.length; i++)
	{
		this.queryList.push(queryList[i]);
	}
};

QueryExecutor.prototype.executeQuery = function(callback)
{
	var that = this;
	if(this.queryList.length > 0)
	{
		var query = this.queryList.shift();
		if(query && query.trim())
		{
			connection.query(query, function(err, result)
			{
				if(err && query.indexOf("DROP") == -1)
					console.error(err);

				that.executeQuery(callback);
			});
		}
		else
		{
			that.executeQuery(callback);
		}
	}
	else
	{
		if(callback)
			callback();
	}
};

QueryExecutor.prototype.clear = function()
{
	this.queryList = [];
};

try
{
	var userdata = fs.readdirSync(__dirname + "/userdata");
}
catch(err)
{
	fs.mkdirSync(__dirname + "/userdata", 0777);
}

connection.connect(function(err)
{
	if(err)
	{
		console.error("connect fail to database");
		console.error(err);
		return;
	}
	
	var result = fs.readFileSync(__dirname + '/resources/setup/db_ddl');
	var split = result.toString().split(";");

	var qe = new QueryExecutor(split, connection);
	qe.executeQuery(function()
	{
		qe.clear();
		
		result = fs.readFileSync(__dirname + '/resources/setup/db_dml');
		split = result.toString().split(";");
		qe.addQueryList(split);
		
		try
		{
			result = fs.readFileSync(__dirname + '/content/frame/' + config.frame + '/properties/database/db_dml');
			split = result.toString().split(";");
			qe.addQueryList(split);
		}
		catch(err)
		{
		}
		
		qe.executeQuery(function()
		{
			try
			{
				var encryptKey = randomstring.generate(10);
				var adminAccountQuery = "INSERT INTO IMB_USER (ID, DISPLAY_ID, PROVIDER, NAME, PROFILE_IMG_URL, LEVEL, PASSWORD, ENCRYPT_KEY) VALUES ('admin', 'admin', 'default', 'admin', '', -2, '" + Utils.encrypt("admin", encryptKey) + "', '" + encryptKey + "')";
				connection.query(adminAccountQuery, function(err, result)
				{
					if(err)
						console.error(err);

					console.log("Install complete!");
					connection.end();
					process.exit();
				});
			}
			catch(err)
			{
				console.error(err);
			}
		});
	});
});