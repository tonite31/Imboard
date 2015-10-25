var fs = require('fs');
var xml2js = require('xml2js');
var xmldoc = require('xmldoc');

var mybatis = function(pool, logger)
{
	this.pool = pool;
	this.querys = {};
	this.logger = logger ? logger : console;
	this.connectionList = [];
};

mybatis.prototype.setQuery = function(path)
{
	var self = this;
	var result = fs.readdirSync(path);
	if(result)
	{
		var parser = new xml2js.Parser();
		
		for(var i=0; i<result.length; i++)
		{
			var file = fs.readFileSync(path + "/" + result[i]);
			
			parser.parseString(file, function(err, result)
			{
				if(err)
				{
					self.logger.error("parseString error : ", err.stack);
				}
				else
				{
					var mapper = result.mapper;
					
					var namespace = mapper.$.namespace;
					self.querys[namespace] = {};

					for(var key in mapper)
					{
						if(key == "$")
							continue;
						
						for(var i=0; i<mapper[key].length; i++)
						{
							var query = mapper[key][i]._;
							var id = mapper[key][i].$.id;
							var parameterType = mapper[key][i].$.parameterType;
							var resultType = mapper[key][i].$.resultType;
							var resultMap = mapper[key][i].$.resultMap;
							
							self.querys[namespace][id] = {query : query, parameterType : parameterType, resultType : resultType, resultMap : resultMap};
						}
					}
				}
			});
		}
	}
};

mybatis.prototype.parseIf = function(content)
{
	var matchs = content.match(/<if[^>]*>[^<]*<\/if>/gi);
	if(matchs)
	{
		for(var i=0; i<matchs.length; i++)
		{
			var test = matchs[i].match(/test=\"[^\"]*\"/gi);
			console.log("하 : ", test);
			if(test)
			{
				test = test.replace("test=\"", "").replace("\"", "");
				console.log("조건 : ", test);
			}
		}
	}
	
	return content;
};

mybatis.prototype.parseWhen = function()
{
	
};

mybatis.prototype.getConnection = function(callback)
{
	var self = this;
	this.pool.getConnection(function (err, connection)
	{
    	if(err)
    		console.log(err);
    	
		this.pool.getConnection(function (err, connection)
		{
	    	if(err)
	    	{
	    		self.logger.error("getConnection error : ", err);
	    		return;
	    	}
	    	
	    	try
	    	{
	    		callback(connection);
	    		self.connectionList.push(connection);
	    	}
	        catch(err)
	        {
	        	self.logger.error("getConnection error : ", err.stack);
	        }
	    });
    });
};

mybatis.prototype.releaseConnection = function()
{
	for(var i=0; i<this.connectionList.length; i++)
	{
		this.connectionList[i].release();
	}
	
	this.connectionList = [];
};

mybatis.prototype.getQuery = function(namespace, queryId, param)
{
	var queryInfo = this.querys[namespace][queryId];
	
	var query = queryInfo.query;
	for(var key in param)
	{
		var regexp = new RegExp("#{" + key + "}", "g");
		var match = query.match(regexp);
		query = query.replace(match, "'" + param[key] + "'");
	}
	
	return this.parseIf(query);
};


mybatis.prototype.executeQuery = function(namespace, queryId, param, callback)
{
	var self = this;
	var query = this.getQuery(namespace, queryId, param);
	this.getConnection(function(conn)
	{
		conn.query(query, function(err, result)
		{
			try
			{
				conn.release();
				
				if(callback)
					callback(result);
				
				if(err)
				{
					self.logger.error(err.stack);
				}
			}
			catch(err)
			{
				self.logger.error(err.stack);
			}
		});
	});
};

module.exports = mybatis;