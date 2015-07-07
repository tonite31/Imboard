var randomstring = require("randomstring");

var fs = require("fs");

global._config = require(__dirname + '/resources/properties/config');
var Utils = require(__dirname + "/src/lib/Utils.js");

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
			connection.query(query, function(err, result)
			{
				if(err)
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

connection.connect(function(err)
{
	if(err)
	{
		console.error(err);
		return;
	}
	
	var result = fs.readFileSync(__dirname + '/resources/setup/db_ddl');
	var split = result.toString().split(";");

	console.log(" -- 테이블 생성");
	var qe = new QueryExecutor(split, connection);
	qe.executeQuery(function()
	{
		result = fs.readFileSync(__dirname + '/resources/setup/db_dml');
		split = result.toString().split(";");

		console.log(" -- 초기데이터 입력");
		qe.setQueryList(split);
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

					console.log(" -- 설치완료");
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