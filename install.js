var fs = require("fs");

global._config = require(__dirname + '/resources/properties/config');

var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : _config.jdbc.host,
	user     : _config.jdbc.user,
	password : _config.jdbc.password,
	database : _config.jdbc.database
});

var QueryExecutor = function(queryList, connection)
{
	this.queryList = queryList;
	this.connection = connection;
};

QueryExecutor.prototype.setQueryList = function(queryList)
{
	this.queryList = queryList;
};

QueryExecutor.prototype.executeQuery = function(callback)
{
	var that = this;
	if(this.queryList.length > 0)
	{
		var query = this.queryList.shift();
		if(query)
		{
			console.log(query);
			connection.query(query, function(err, result)
			{
				if(err)
					console.error(err);

				that.executeQuery();
			});
		}
		else
		{
			that.executeQuery();
		}
	}
	else
	{
		if(callback)
			callback();
	}
};

connection.connect(function(err)
{
	if(err)
	{
		console.error(err);
		return;
	}
	
	var result = fs.readFileSync(__dirname + '/resources/setup/db_ddl');
	var split = result.toString().split(";");

	var qe = new QueryExecutor(split, connection);
	qe.executeQuery(split, function()
	{
		result = fs.readFileSync(__dirname + '/resources/setup/db_dml');
		split = result.toString().split(";");

		qe.setQueryList(split);
		qe.executeQuery(function()
		{
			try
			{
				process.exit(1);
			}
			catch(err)
			{
				console.error(err);
			}
		});
	});
});