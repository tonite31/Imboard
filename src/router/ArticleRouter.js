var ArticleDao = require(_path.src + "/dao/ArticleDao.js");
var CommentDao = require(_path.src + "/dao/CommentDao.js");
var ArticleVo = require(_path.src + '/vo/ArticleVo.js');
var UserVo = require(_path.src + '/vo/UserVo.js');

var ArticleReaderVo = require(_path.src + "/vo/ArticleReaderVo.js");

var UserDao = require(_path.src + "/dao/UserDao.js");

var ArticleReaderDao = require(_path.src + "/dao/ArticleReaderDao.js");

var easyimg = require('easyimage');

var fs = require('fs');

module.exports.getArticleListCount =
{
	type : 'post',
	path : '/article/getArticleListCount.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		var boardId = param.boardId;
		
		if(req.session.user != null)
		{
			if(!param.searchData)
				param.searchData = {};
			param.searchData.signinUserId = req.session.user.id;
		}
		
		ArticleDao.getArticleListCount(boardId, param.searchData, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.getArticleList =
{
	type : 'post',
	path : '/article/getArticleList.do',
	auth : {check : true},
	callback : function(req, res)
	{
		var param = req.body;
		
		var boardId = param.boardId;
		
		if(param.searchData == null)
			param.searchData = {};
		
		var pageIndex = param.searchData.pageIndex;
		var cpp = param.searchData.cpp;
		
		try
		{
			if(pageIndex != null && cpp != null)
			{
				param.searchData.startIndex = parseInt(cpp) * (parseInt(pageIndex) -1);
				param.searchData.endIndex = parseInt(cpp);
			}
		}
		catch(err)
		{
			param.searchData.startIndex = null;
			param.searchData.endIndex = null;
		}
		
		if(req.session.user != null)
		{
			param.searchData.signinUserId = req.session.user.id;
			param.searchData.signinUserLevel = req.session.user.level;
		}
		
		ArticleDao.getArticleList(boardId, param.searchData, function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.getArticle = 
{
	type : 'post',
	path : '/article/getArticle.do',
	auth : {check : true},
	callback : function(req, res)
	{
		var param = req.body;
		
		if(req.session.user != null)
		{
			if(param.searchData == null)
				param.searchData = {};
			
			param.searchData.signinUserId = req.session.user.id;
			param.searchData.signinUserLevel = req.session.user.level;
		}
		
		_async.waterfall([
		    function(cb)
		    {
				ArticleDao.getArticle(param.boardId, param.seq, param.searchData, function(response)
				{
					if(response != null)
					{
						if(response.password != null)
						{
							if((req.session.user != null && req.session.user.level < 0) || response.password == param.password)
							{
								cb(null, response);
							}
							else
							{
								res.end(JSON.stringify({code : _code.ACCESS_DENIED}));
							}
						}
						else
						{
							cb(null, response);
						}
					}
					else
					{
						res.end(JSON.stringify({code : _code.ERROR}));
					}
				});
		    },
		    function(response, cb)
		    {
		    	response.password = null;
		    	
		    	if(param.seq != null)
		    	{
		    		var userId = null;
					if(req.session.user != null && req.session.user.id != null)
						userId = req.session.user.id;
					else
						userId = (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + "__" + req.headers['user-agent'];
					
					ArticleReaderDao.getArticleReader(param.boardId, param.seq, userId, function(articleReader)
    				{
    					if(articleReader == null)
    					{
    						var vo = new ArticleReaderVo();
    						vo.boardId = param.boardId;
    						vo.articleSeq = param.seq;
    						vo.userId = userId;
    						
    						ArticleReaderDao.insertArticleReader(vo);
    						
    						ArticleDao.updateHit(vo.boardId, vo.articleSeq, function()
    						{
    							res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
    						});
    					}
    					else
    					{
    						res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
    					}
    				});
		    	}
		    	else
		    	{
		    		res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		    	}
		    }
		]);
	}
};

module.exports.insertArticle =
{
	type : 'post',
	path : '/article/insertArticle.do',
	auth : {check : true},
	callback : function(req, res)
	{
		var param = req.body;
		
		var vo = new ArticleVo(param);
		if(vo.writerId == null && req.session.user != null)
			vo.writerId = req.session.user.id;
		
		ArticleDao.getNextSeq(vo.boardId, function(seq)
		{
			if(seq == null)
				seq = 0;
			else
				seq++;
			
			vo.seq = seq;
			
			if(!req.session.user || req.session.user.level >= 0)
				vo.isNotice = null;
			
			ArticleDao.insertArticleWithSeq(vo, function(response)
			{
				res.end(JSON.stringify({code : _code.SUCCESS, message : "SUCCESS", data:{seq : seq}}));
			});
		});
	}
};

function updateArticle(req, res)
{
	var param = req.body;
	
	if(!param.searchData)
		param.searchData.signinUserId = req.session.user ? req.session.user.id : "";
	
	var vo = new ArticleVo(param);
	ArticleDao.getArticle(param.boardId, param.seq, param.searchData, function(response)
	{
		if(response)
		{
			if(req.session && req.session.user)
			{
				var userVo = new UserVo();
				userVo.id = req.session.user.id;
				UserDao.getUser(userVo, function(member)
				{
					if(req.session.user.id == response.writerId || member.level < 0)
					{
						if(!req.session.user || req.session.user.level >= 0)
							vo.isNotice = null;
						
						ArticleDao.updateArticle(vo, function(response)
						{
							if(response == 1)
								res.end(JSON.stringify({code : _code.SUCCESS, data : {seq : param.seq}, msg : "SUCCESS"}));
							else
								res.end(JSON.stringify({code : _code.ERROR, message : "FAIL", data : response}));
						});
					}
					else
					{
						res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : '', msg : "ACCESS_DENIED"}));
					}
				});
			}
			else
			{
				//작성자가 아님
				res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : '', msg : "ACCESS_DENIED"}));
			}
		}
		else
		{
			//글이 없다
			res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : '', msg : "ACCESS_DENIED"}));
		}
	});
}

module.exports.updateArticle = 
{
	type : 'post',
	path : '/article/updateArticle.do',
	auth : {check : true},
	callback : function(req, res)
	{
		updateArticle(req, res);
	}
};

module.exports.writeArticle =
{
	type : 'post',
	path : '/article/writeArticle.do',
	callback : function(req, res)
	{
		var param = req.body;
		if(!param.searchData)
			param.searchData = {};

		if(req.session.user)
			param.searchData.signinUserId = req.session.user.id;
		
		var vo = new ArticleVo(param);
		if(vo.writerId == null && req.session.user != null)
			vo.writerId = req.session.user.id;
		
		if(vo.seq)
		{
			updateArticle(req, res);
		}
		else
		{
			ArticleDao.getNextSeq(vo.boardId, function(seq)
			{
				if(seq == null)
					seq = 0;
				else
					seq++;
				
				vo.seq = seq;
				
				ArticleDao.insertArticleWithSeq(vo, function(response)
				{
					res.end(JSON.stringify({code : _code.SUCCESS, message : "SUCCESS", data:{seq : seq}}));
				});
			});
		}
	}
};

module.exports.updateArticleBoardId =
{
	type : 'post',
	path : '/article/updateArticleBoardId.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		ArticleDao.updateArticleBoardId(new ArticleVo(param), function(response)
		{
			if(response == 1)
				res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
			else
				res.end(JSON.stringify({code : _code.ERROR, message : "FAIL", data : response}));
		});
	}
};

module.exports.updateHit =
{
	type : 'post',
	path : '/article/updateHit.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		ArticleDao.updateHit(param.boardId, param.seq, function(response)
		{
			if(response == 1)
				res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
			else
				res.end(JSON.stringify({code : _code.ERROR, message : "FAIL", data : response}));
		});
	}
};

module.exports.updateGood =
{
	type : 'post',
	path : '/article/updateGood.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		ArticleDao.updateGood(param.boardId, param.seq, function(response)
		{
			if(response == 1)
				res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
			else
				res.end(JSON.stringify({code : _code.ERROR, message : "FAIL", data : response}));
		});
	}
};

module.exports.updateBad =
{
	type : 'post',
	path : '/article/updateBad.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		ArticleDao.updateBad(param.boardId, param.seq, function(response)
		{
			if(response == 1)
				res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
			else
				res.end(JSON.stringify({code : _code.ERROR, message : "FAIL", data : response}));
		});
	}
};

module.exports.updateStatus =
{
	type : 'post',
	path : '/article/updateStatus.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		var vo = new ArticleVo(param);
		ArticleDao.updateStatus(vo, function(response)
		{
			if(response == 1)
				res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
			else
				res.end(JSON.stringify({code : _code.ERROR, message : "FAIL", data : response}));
		});
	}
};

module.exports.deleteArticle = 
{
	type : 'post',
	path : '/article/deleteArticle.do',
	auth : {check : true},
	callback : function(req, res)
	{
		var param = req.body;
		if(!param.searchData)
			param.searchData = {};
		
		param.searchData.signinUserId = req.session.user ? req.session.user.id : "";
		
		ArticleDao.getArticle(param.boardId, param.seq, param.searchData, function(response)
		{
			if(response)
			{
				if(req.session && req.session.user)
				{
					var userVo = new UserVo();
					userVo.id = req.session.user.id;
					UserDao.getUser(userVo, function(member)
					{
						if(req.session.user.id == response.writerId || member.level < 0)
						{
							ArticleDao.deleteArticle(param.boardId, param.seq, param.isRemove, function(response)
							{
								if(response == 1)
								{
									CommentDao.deleteCommentByArticle(param.boardId, param.seq, function(response)
									{
										if(response >= 0)
											res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
										else
											res.end(JSON.stringify({code : _code.ERROR, message : "FAIL", data : response}));
									});
								}
								else
								{
									res.end(JSON.stringify({code : _code.ERROR, message : "FAIL", data : response}));
								}
							});
						}
						else
						{
							res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : '', msg : "ACCESS_DENIED"}));
						}
					});
				}
				else
				{
					//작성자가 아님
					res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : '', msg : "ACCESS_DENIED"}));
				}
			}
			else
			{
				//글이 없다
				res.end(JSON.stringify({code : _code.ACCESS_DENIED, data : '', msg : "ACCESS_DENIED"}));
			}
		});
	}
};

module.exports.updateArticleReaderStatus =
{
	type : 'post',
	path : '/article/updateArticleReaderStatus.do',
	callback : function(req, res)
	{
		var param = req.body;
		
		var vo = new ArticleReaderVo(param);
		ArticleReaderDao.getArticleReader(vo.imboardId, vo.boardId, vo.articleSeq, vo.userId, function(response)
		{
			if(response == null)
			{
				ArticleReaderDao.insertArticleReader(vo, function()
				{
					ArticleReaderDao.updateArticleReaderStatus(vo, function(response)
					{
						res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
					});
				});
			}
			else
			{
				ArticleReaderDao.updateArticleReaderStatus(vo, function(response)
				{
					res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
				});
			}
		});
	}
};

module.exports.uploadFile =
{
	type : 'post',
	path : '/article/uploadFile.do',
	multipart : true,
	callback : function(req, res)
	{
		var param = req.body;
		
		var folder = "anonymous";
		if(req.session.user != null && req.session.user.id != null)
		{
			folder = _utils.encrypt(req.session.user.id, _config.encryptKey);
		}
		
		var files = req.files;
		var keyList = [];
		for(var key in files)
			keyList.push(key);
		var pathList = [];
		
		var path = _path.userdata + '/' + folder + "/";
		
		try
		{
			fileList = fs.readdirSync(path);
		}
		catch(err)
		{
			fs.mkdirSync(path, 0777);
		}
		finally
		{
			uploadLocal(files, keyList, path, folder, pathList, function()
			{
				res.end(JSON.stringify({code : 1000, data : pathList, message : "SUCCESS"}));
			});
		}
	}
};

module.exports.uploadFileToAWS =
{
	type : 'post',
	path : '/article/uploadFileToAWS.do',
	multipart : true,
	callback : function(req, res)
	{
		var param = req.body;
		
		var bucketName = _aws.s3.bucketName;
		var resourcesUrl = _aws.s3.resourcesUrl;
		
		var folder = "anonymous";
		if(req.session.user != null && req.session.user.id != null)
		{
			folder = _utils.encrypt(req.session.user.id, _config.encryptKey);
		}
		
		var files = req.files;
		var keyList = [];
		for(var key in files)
			keyList.push(key);
		var pathList = [];
		uploadAws(files, keyList, folder, pathList, function()
		{
			res.end(JSON.stringify({code : 1000, data : pathList, message : "SUCCESS"}));
		});
	}
};

function uploadLocal(files, keyList, rootPath, folder, pathList, successCallback)
{
	if(keyList.length == 0)
	{
		successCallback();
		return;
	}
	
	var file = files[keyList.pop()];
	var filepath = file.path;
	var filename = file.originalFilename;
	
	if(filepath.lastIndexOf(".gif") == filepath.length-4)
	{
		easyimg.convert({src : filepath + "[0]", dst : filepath.replace(".gif", ".png"), quality:100}).then(function()
		{
			try
			{
				var data = fs.readFileSync(filepath.replace(".gif", ".png"));
				
				fs.writeFileSync(rootPath + filename.replace(".gif", ".png"), data);
				
				var data = fs.readFileSync(filepath);
				fs.writeFileSync(rootPath + filename, data);
				
				pathList.push("/resources/" + folder + "/" + filename);
				
				uploadLocal(files, keyList, rootPath, folder, pathList, successCallback);
			}
			catch(err)
			{
				_log.error(err.stack);
			}
		});
	}
	else
	{
		var data = fs.readFileSync(filepath);
		fs.writeFileSync(rootPath + filename, data);
		
		pathList.push("/resources/" + folder + "/" + filename);
		uploadLocal(files, keyList, rootPath, folder, pathList, successCallback);
	}
}

function uploadAws(files, keyList, folder, pathList, successCallback)
{
	if(keyList.length == 0)
	{
		successCallback();
		return;
	}
	
	var file = files[keyList.pop()];
	var path = file.path;
	if(path.lastIndexOf(".gif") == path.length -4)
	{
		easyimg.convert({src : path + "[0]", dst : path.replace(".gif", ".png"), quality:100}).then(function()
		{
			uploadFileToS3({filePath : file.path.replace(".gif", ".png"), fileName : file.originalFilename.replace(".gif", ".png"), folder : folder, callback : function(path)
			{
				if(path != null)
				{
					uploadFileToS3({filePath : file.path, fileName : file.originalFilename, folder : folder, callback : function(path)
					{
						if(path != null)
							pathList.push(path);
						
						uploadAws(files, keyList, folder, pathList, successCallback);
					}});
				}
				else
				{
					uploadAws(files, keyList, folder, pathList, successCallback);
				}
			}});
		}, function(){
			uploadAws(files, keyList, folder, pathList, successCallback);
		});
	}
	else
	{
		uploadFileToS3({filePath : file.path, fileName : file.originalFilename, folder : folder, callback : function(path)
		{
			if(path != null)
				pathList.push(path);
			
			uploadAws(files, keyList, folder, pathList, successCallback);
		}});
	}
}

function uploadFileToS3(param)
{
	var filePath = param.filePath;
	var fileName = param.fileName;
	var folder = param.folder;
	var callback = param.callback;
	
	var AWS = require('aws-sdk');
	AWS.config.update({accessKeyId: _aws.accessKeyId, secretAccessKey: _aws.secretAccessKey});
//	AWS.config.loadFromPath(_path.resources + "/properties/aws.json");
	var s3 = new AWS.S3({endpoint:"http://s3.amazonaws.com"});
	
	try
	{
		fs.readFile(filePath, function(err, data)
		{
			if(err)
			{
				_log.log(err, err.stack);
				callback();
			}
			else
			{
				var params = {
					Bucket: _aws.s3.bucketName,
					Key : folder + "/" + fileName,
					ACL : "public-read",
					Body : data
				};

			    s3.putObject(params, function(err, data)
				{
					if(err)
					{
						_log.error(err.stack);
						callback();
					}
					else
					{
						callback(_aws.s3.resourcesUrl + folder + "/" + encodeURIComponent(fileName));
					}
				});
			}
		});
	}
	catch(err)
	{
		_log.error(err.stack);
		callback();
	}
}