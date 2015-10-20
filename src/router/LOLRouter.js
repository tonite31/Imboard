var DataDao = require(_path.src + "/dao/DataDao.js");
var DataVo = require(_path.src + "/vo/DataVo.js");

var request = require('request');

var LOL = {};

module.exports.lol_getTeam =
{
	type : 'post',
	path : '/lol/getTeam.do',
	callback : function(req, res)
	{
		var param = req.body;
		LOL.getTeam(param.id, function(error, data)
		{
			if(error)
			{
				_log.error(error);
				res.end(JSON.stringify({code : _code.ERROR, data : error}));
			}
			else
			{
				res.end(JSON.stringify({code : _code.SUCCESS, data : data}));
			}
		});
	}
};

module.exports.lol_getMembers =
{
	type : 'post',
	path : '/lol/getMembers.do',
	callback : function(req, res)
	{
		var param = req.body;
		LOL.getMembers(param.teamId, function(error, data)
		{
			if(error)
			{
				_log.error(error);
				res.end(JSON.stringify({code : _code.ERROR, data : error}));
			}
			else
			{
				res.end(JSON.stringify({code : _code.SUCCESS, data : data}));
			}
		});
	}
};

module.exports.lol_getChampions =
{
	type : 'post',
	path : '/lol/getChampions.do',
	callback : function(req, res)
	{
		var param = req.body;
		if(param.refresh)
		{
			LOL.getChampions(function(error, data)
			{
				if(error)
				{
					_log.error(error);
					res.end(JSON.stringify({code : _code.ERROR, data : error}));
				}
				else
				{
					
					var dataVo = new DataVo();
					dataVo.id = "lol_champions";
					dataVo.data = JSON.stringify(data);
					DataDao.getData(dataVo.id, function(response)
					{
						if(response)
						{
							DataDao.updateData(dataVo, function(response)
							{
								res.end(JSON.stringify({code : _code.SUCCESS, data : {data : data}}));
							});
						}
						else
						{
							DataDao.insertData(dataVo, function(response)
							{
								res.end(JSON.stringify({code : _code.SUCCESS, data : {data : data}}));
							});
						}
					});
				}
			});
		}
		else
		{
			DataDao.getData("lol_champions", function(data)
			{
				if(data)
				{
					res.end(JSON.stringify({code : _code.SUCCESS, data : data}));
				}
				else
				{
					res.end(JSON.stringify({code : _code.ERROR}));
				}
			});
		}
	}
};

(function()
{
	var self = this;
	this.region = 'kr';
	this.locale = 'ko_KR';
	this.apiKey = '13d9aaf8-3ac7-4a1e-afca-9dfd52671b18';
	
	this.getTeam = function(id, callback)
	{
		var options =
		{
		    url: 'https://kr.api.pvp.net/api/lol/kr/v2.4/team/' + id,
		    method: 'GET',
		    qs: {'api_key': self.apiKey}
		};
			 
		// Start the request
		request(options, function (error, response, body)
		{
			try
			{
				if(!error)
				{
					switch(response.statusCode)
					{
						case 200:
							callback(null, JSON.parse(body)[id]);
							break;
						case 400:
							callback("Bad request");
							break;
						case 401:
							callback("Unauthorized");
							break;
						case 404:
							callback("Team not found");
							break;
						case 429:
							callback("Rate limit exceeded");
							break;
						case 500:
							callback("Internal server error");
							break;
						case 503:
							callback("Service unavailable");
							break;
					}
				}
				else
				{
					callback(error, null);
				}
			}
			catch(err)
			{
				callback(err.stack);
			}
		});
	};
	
	this.getMembers = function(teamId, callback)
	{
		this.getTeam(teamId, function(error, data)
		{
			if (!error)
			{
				var memberList = data.roster.memberList;
				var forEach = require('async-foreach').forEach;
				
				forEach(memberList, function(member, index)
				{
					var done = this.async();
					
					var options =
					{
					    url: 'https://kr.api.pvp.net/api/lol/' + self.region + '/v1.4/summoner/' + member.playerId,
					    method: 'GET',
					    qs: {'api_key': self.apiKey}
					};
						 
					// Start the request
					request(options, function (error, response, body)
					{
						try
						{
							body = JSON.parse(body);
							
							for(var id in body)
							{
								for(var key in body[id])
								{
									memberList[index][key] = body[id][key];
								}
							}
							
							done();
						}
						catch(err)
						{
							_log.error(err);
						}
					});
				},
				function()
				{
					callback(null, memberList);
				});
			}
		    else
		    {
		    	callback(error, null);
		    }
		});
	};
	
	this.getMember = function(id, callback)
	{
		
	};
	
	this.getChampions = function(callback)
	{
		var options =
		{
		    url: 'https://kr.api.pvp.net/api/lol/' + self.region + '/v1.2/champion',
		    method: 'GET',
		    qs: {'api_key': self.apiKey}
		};
			 
		// Start the request
		request(options, function (error, response, body)
		{
			try
			{
				if(!error)
				{
					switch(response.statusCode)
					{
						case 200:
							var championList = JSON.parse(body)["champions"];
							var forEach = require('async-foreach').forEach;
							
							forEach(championList, function(champion, index)
							{
								var done = this.async();
								var options =
								{
								    url: 'https://global.api.pvp.net/api/lol/static-data/' + self.region + '/v1.2/champion/' + champion.id,
								    method: 'GET',
								    qs: {'api_key': self.apiKey, 'locale' : self.locale, 'champData' : 'image,info'}
								};
									 
								// Start the request
								request(options, function (error, response, body)
								{
									try
									{
										body = JSON.parse(body);
										for(var key in body)
										{
											championList[index][key] = body[key];
										}
										
										done();
									}
									catch(err)
									{
										_log.error(err);
									}
								});
							},
							function()
							{
								callback(null, championList);
							});
							
							break;
						case 400:
							callback("Bad request");
							break;
						case 401:
							callback("Unauthorized");
							break;
						case 429:
							callback("Rate limit exceeded");
							break;
						case 500:
							callback("Internal server error");
							break;
						case 503:
							callback("Service unavailable");
							break;
					}
				}
				else
				{
					callback(error, null);
				}
			}
			catch(err)
			{
				callback(err.stack);
			}
		});
	};
	
}).call(LOL);