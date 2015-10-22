var fs = require('fs');
var xml2js = require('xml2js');

var context = function(pool)
{
	this.pool = pool;
	this.querys = {};
};

context.prototype.setQuery = function(path)
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

context.prototype.createConnection = function()
{
	//커넥션을 리턴해주고 릴리즈 해주자 직접.
};

context.prototype.releaseConnection = function()
{
	//릴리즈한다. 미들웨어 하나 만들어서 오류떴을때 릴리즈 해주도록 하자.
};

context.prototype.queryForObject = function()
{
	
};

context.prototype.queryForList = function()
{
	
};

context.prototype.insert = function()
{
	
};

context.prototype.update = function()
{
	
};

context.prototype.delete = function()
{
	
};

module.exports = context;