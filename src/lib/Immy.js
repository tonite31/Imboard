var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;

var Immy = function(pool, debug, exception)
{
	this.pool = pool;
	this.querys = {};
	this.resultMap = {};
	this.modelMap = {};
	this.typeHandlerMap = {};
	this.debugger = debug ? debug.debug : console.log;
	this.exception = exception ? exception.error : console.error;
	this.connectionList = [];
};

Immy.prototype.scanTypeHandler = function(path)
{
	var fileList = fs.readdirSync(path);
	if(fileList)
	{
		var parser = new DOMParser();
		
		for(var i=0; i<fileList.length; i++)
		{
			var typeHandler = require(path + "/" + fileList[i]);
			for(var key in typeHandler)
			{
				this.typeHandlerMap[key] = typeHandler[key];
			}
		}
	}
};

Immy.prototype.scanModel = function(path)
{
	var fileList = fs.readdirSync(path);
	if(fileList)
	{
		var parser = new DOMParser();
		
		for(var i=0; i<fileList.length; i++)
		{
			var model = require(path + "/" + fileList[i]);
			this.modelMap[fileList[i].replace(".js", "")] = model;
		}
	}
};

Immy.prototype.scanQuery = function(path)
{
	var fileList = fs.readdirSync(path);
	if(fileList)
	{
		var parser = new DOMParser();
		
		for(var i=0; i<fileList.length; i++)
		{
			var file = fs.readFileSync(path + "/" + fileList[i]);
			
			var doc = parser.parseFromString(file.toString(), "text/xml");
			
			if (doc.documentElement.nodeName == 'mapper')
			{
				var namespace = doc.documentElement.getAttributeNode('namespace').value;
				var childNodes = doc.documentElement.childNodes;
				for (var j = 0; j < childNodes.length; j++)
				{
					var node = childNodes[j];
					if(node.nodeName != '#text' && node.nodeName != '#comment')
					{
						var queryType = node.nodeName;
						if(queryType == "resultMap")
						{
							var id = node.getAttribute("id");
							var type = node.getAttribute("type");
							
							this.resultMap[namespace + "_" + id] = {type : type, map : this.parseResultMap(namespace, node)};
						}
						else
						{
							var queryId = node.getAttribute("id");
							var parameterType = node.getAttribute("parameterType");
							var resultType = node.getAttribute("resultType");
							var resultMap = node.getAttribute("resultMap");
							
							this.querys[namespace + "_" + queryId] =
							{
								namespace : namespace,
								id : queryId,
								parameterType : parameterType,
								resultType : resultType,
								resultMap : resultMap,
								query : this.parseQuery(node)
							};
						}
					}
				}
			}
		}
		
		this.parseResultMapCollections(this.resultMap);
	}
};

Immy.prototype.parseResultMap = function(namespace, node)
{
	var result = {};
	for(var i=0; i<node.childNodes.length; i++)
	{
		var child = node.childNodes[i];
		if(child.nodeName == "result" || child.nodeName == "id")
		{
			var column = child.getAttribute("column");
			var property = child.getAttribute("property");
			var typeHandler = child.getAttribute("typeHandler");
			
			result[column] = {property : property, typeHandler : typeHandler ? typeHandler : null, isKey : child.nodeName == "id"};
		}
		else if(child.nodeName == "collection")
		{
			var property = child.getAttribute("property");
			var resultMap = child.getAttribute("resultMap");
			
			if(!result._collections)
				result._collections = [];
			
			result._collections.push({property : property, mapId : namespace + "_" + resultMap});
		}
	}
	
	return result;
};

Immy.prototype.parseResultMapCollections = function(resultMap)
{
	//리절트맵 뽑아내는게 끝났기때문에 collection 바인딩 작업을 여기서 해주자. 쿼리 후 데이터 만들어줄때 반복을 최소화하기 위한 작업을 여기서 처리한다.
	for(var key in resultMap)
	{
		var map = resultMap[key].map;
		if(map._collections)
		{
			var temp = [];
			for(var i=0; i<map._collections.length; i++)
			{
				var row = {};
				var mapId = map._collections[i].mapId;
				var subMap = resultMap[mapId];
				if(subMap)
				{
					//일단 collection in collection은 없다고 치고.
					delete subMap.map._collections;
					subMap.map._property = map._collections[i].property;
					temp.push(subMap.map);
					//					this.parseResultMapCollections(subMap);
				}
			}
			
			if(temp.length > 0)
				map._collections = temp;
		}
	}
};

Immy.prototype.parseQuery = function(node)
{
	var result = [];
	for(var i=0; i<node.childNodes.length; i++)
	{
		var child = node.childNodes[i];
		
		//일단 if와 choose만
		switch(child.nodeName)
		{
		case "if" :
			result.push(this.parseIf(child));
			break;
		case "when" :
			result.push(this.parseIf(child));
			break;
		case "choose" :
			result.push(this.parseChoose(child));
			break;
		case "#text" :
			result.push(child.data);
			break;
		default :
			break;
		}
	}
	
	return result;
};

Immy.prototype.parseIf = function(node)
{
	var regex = new RegExp('#\{[^\}]*\}', 'gi');
	
	var test = node.getAttribute("test");
	var result = {test : test, type : "if"};
	
	result.children = this.parseQuery(node);
	
	return result;
};

Immy.prototype.parseChoose = function(node)
{
	var result = {type : "choose", when : []};
	for(var i=0; i<node.childNodes.length; i++)
	{
		var child = node.childNodes[i];
		if(child.nodeName == "when")
		{
			var test = child.getAttribute("test");
			result.when.push({test : test, children : this.parseQuery(child)});
		}
		else if(child.nodeName == "otherwise")
		{
			result.otherwise = child.firstChild.data;
		}
	}
	
	return result;
};

Immy.prototype.getConnection = function(callback)
{
	var self = this;
	this.pool.getConnection(function (err, connection)
	{
		if(err)
			self.exception(err.stack);
		
		callback(connection);
		self.connectionList.push(connection);
	});
};

Immy.prototype.releaseConnection = function()
{
	while(this.connectionList.length > 0)
	{
		var conn = this.connectionList.shift();
		conn.release();
	}
	
	this.connectionList = [];
};

Immy.prototype.getQuery = function(namespace, queryId, param)
{
	var queryInfo = this.querys[namespace + "_" + queryId];
	
	if(queryInfo)
	{
		var query = this.mergeQuery(queryInfo.query, param);
		var params = [];
		var regex = new RegExp('#\{[^\}]*\}', 'gi');
		var matchs = query.match(regex);
		if(matchs)
		{
			for(var i=0; i<matchs.length; i++)
			{
				var key = matchs[i].replace("#\{", "").replace("\}", "");
				
				var value = null;
				if(param)
				{
					if(typeof param == "object")
					{
						if(param[key] != null)
							value = param[key];
						else
							value = null;
					}
					else
					{
						value = param;
					}
				}
				
				query = query.replace(matchs[i], "?");
				
				if(queryInfo.parameterType)
				{
					//만약 파라미터 타입이 지정되어있고 모델이라면 모델에 있는애들만 인서트 해야된다.
				}
				
				params.push(value);
			}
		}
		
		regex = new RegExp('$\{[^\}]*\}', 'gi');
		matchs = query.match(regex);
		if(matchs)
		{
			for(var i=0; i<matchs.length; i++)
			{
				var key = matchs[i].replace("$\{", "").replace("\}", "");
				
				var value = "null";
				if(param[key] != null)
				{
					if(typeof param[key] == "number")
						value = param[key];
					else
						value = "'" + param[key] + "'";
				}
				
				query = query.replace(matchs[i], value);
			}
		}
		
		var temp = {};
		for(var key in queryInfo)
		{
			temp[key] = queryInfo[key];
		}
		
		temp.query = query;
		temp.params = params;
		return temp;
	}
	
	return {};
};

Immy.prototype.mergeQuery = function(info, param)
{
	var result = "";
	for(var i=0; i<info.length; i++)
	{
		if(typeof info[i] == "string")
		{
			result += info[i];
		}
		else
		{
			if(info[i].type == "if")
			{
				var test = info[i].test;
				if(this.test(test, param))
				{
					result += this.mergeQuery(info[i].children, param);
				}
			}
			else if(info[i].type == "choose")
			{
				var isWhen = false;
				for(var j=0; j<info[i].when.length; j++)
				{
					var when = info[i].when[j];
					var test = when.test;
					if(this.test(test, param))
					{
						isWhen = true;
						result += this.mergeQuery(when.children, param);
					}
				}
				
				if(!isWhen)
					result += info[i].otherwise;
			}
		}
	}
	
	return result;
}

Immy.prototype.test = function(test, param)
{
	var regex = new RegExp('#\{[^\}]*\}', 'gi');
	var matchs = test.match(regex);
	if(matchs)
	{
		for(var i=0; i<matchs.length; i++)
		{
			var key = matchs[i].replace("#\{", "").replace("\}", "");
			
			var value = "null";
			if(param[key] != null)
			{
				if(typeof param[key] == "number")
					value = param[key];
				else
					value = "'" + param[key] + "'";
			}
			
			test = test.replace(matchs[i], value);
		}
	}
	
	test = test.replace(/or/gi, "||").replace(/and/gi, "&&");
	
	var f = new Function("if(" + test + "){return true;}else{return false;}");
	return f();
}

Immy.prototype.executeQuery = function(namespace, queryId, param, callback)
{
	var self = this;
	self.debugger("=================================================");
	self.debugger("time : " + new Date().toString());
	self.debugger(namespace + " - " + queryId);
	
	var query = this.getQuery(namespace, queryId, param);
	
	this.getConnection(function(conn)
	{
		self.debugger("-------------------------------------------------");
		self.debugger(query.query.replace(/\r\n[\s]*\r\n/gi, "\r\n"));
		self.debugger("-------------------------------------------------");
		self.debugger(query.params);
		self.debugger("=================================================");
		
		conn.query(query.query.replace(/\r\n/gi, " "), query.params, function(err, result)
		{
			self.releaseConnection();
			
			if(err)
			{
				self.exception("\n\n");
				self.exception("=================================================");
				self.exception("time : " + new Date().toString());
				self.exception("name : Immy - executeQuery");
				self.exception("-------------------------------------------------");
				self.exception(err.stack);
				self.exception("=================================================\n\n");
			}
			
			if(result)
			{
				var resultMap = self.resultMap[namespace + "_" + query.resultMap];
				if(resultMap)
				{
					var model = self.modelMap[resultMap.type];
					
					var map = resultMap.map;
					
					var temp = [];
					var row = null;
					while(row = result.shift())
					{
						var data = {};
						
						for(var key in row)
						{
							var value = row[key];
							var d = map[key];

							if(map.hasOwnProperty(key))
							{
								if(d.typeHandler)
									value = self.typeHandlerMap[d.typeHandler](value);
								
								if(d.isKey)
								{
									if(!data._pk)
										data._pk = [];
									
									data._pk.push(d.property);
								}
									
								data[d.property] = value;
							}
							else if(map._collections)
							{
								//없거나 콜렉션 안에 있거나.
								for(var i=0; i<map._collections.length; i++)
								{
									if(map._collections[i].hasOwnProperty(key))
									{
										d = map._collections[i][key];
										if(d.typeHandler)
											value = self.typeHandlerMap[d.typeHandler](value);
										
										if(value)
										{
											if(!data[map._collections[i]._property])
												data[map._collections[i]._property] = [];
											
											var arr = data[map._collections[i]._property];
											var index = arr.length;
											if(index == 0)
												arr[index] = {};
											else
												index--;
											
											arr[index][key] = value;
										}
									}
								}
							}
						}
						
						var merge = true;
						if(map._collections && temp.length > 0)
						{
							var prev = temp[temp.length-1];
							//이전데이터가 있고, primary key가 일치하는게 위에 또 있으면
							if(data._pk)
							{
								for(var i=0; i<data._pk.length; i++)
								{
									if(prev[data._pk[i]] != data[data._pk[i]])
									{
										merge = false;
										break;
									}
								}
								
								if(merge)
								{
									//콜렉션으로 지정되어있던애들만 머지.
									for(var i=0; i<map._collections.length; i++)
									{
										prev[map._collections[i]._property] = prev[map._collections[i]._property].concat(data[map._collections[i]._property]);
									}
								}
							}
							else
							{
								merge = false;
							}
						}
						else
						{
							merge = false;
						}
						
						delete data._pk;
						
						if(!merge)
						{
							temp.push(data);
						}
					}

					result = temp;
				}
				else
				{
					for(var i=0; i<result.length; i++)
					{
						var temp = {};
						for(var key in result[i])
						{
							var replacedKey = key.toLowerCase();
							
							var matchs = replacedKey.match(/_[a-zA-Z]/gi);
							if(matchs)
							{
								for(var j=0; j<matchs.length; j++)
								{
									replacedKey = replacedKey.replace(matchs[j], matchs[j].replace("_", "").toUpperCase());
								}
							}
							
							temp[replacedKey] = result[i][key];
						}
						
						result[i] = temp;
					}
				}
			}
			
			if(callback)
			{
				callback(result);
			}
		});
	});
};

Immy.prototype.selectOne = function(namespace, queryId, param, callback)
{
	this.executeQuery(namespace, queryId, param, function(result)
	{
		if(callback)
		{
			if(result)
			{
				var data = result[0];
				var count = 0;
				var firstKey = null;
				for(var key in data)
				{
					if(data.hasOwnProperty(key))
					{
						count++;
						if(count == 1)
							firstKey = key;
					}
				}
				
				if(count == 1)
					callback(data[firstKey]);
				else
					callback(data);
			}
			else
			{
				callback();
			}
		}
	});
};

Immy.prototype.select = function(namespace, queryId, param, callback)
{
	this.executeQuery(namespace, queryId, param, callback);
};

Immy.prototype.insert = Immy.prototype.update = Immy.prototype.remove = function(namespace, queryId, param, callback)
{
	this.executeQuery(namespace, queryId, param, function(result)
	{
		if(callback)
		{
			if(result)
				callback(result.affectedRows);
			else
				callback();
		}
	});
};

module.exports = Immy;