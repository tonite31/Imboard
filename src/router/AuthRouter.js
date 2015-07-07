var randomstring = require("randomstring");

var UserDao = require(_path.src + "/dao/UserDao.js");
var UserVo = require(_path.src + "/vo/UserVo.js");

var Utils = require(_path.src + "/lib/Utils.js");

module.exports.loginCallback =
{
	type : 'get',
	path : '/auth/login.do',
	callback : function(req, res)
	{
		var param = req.query;
		res.redirect("/auth/" + param.provider);
	}
};

module.exports.loginSuccessCallback =
{
	type : 'get',
	path : '/auth/login/success.auth',
	callback : function(req, res)
	{
//		var policy = {
//				  "Version": "2012-10-17",
//				  "Statement": [
//				    {
//				      "Sid": "",
//				      "Effect": "Allow",
//				      "Principal": {
//				        "Federated": "graph.facebook.com"
//				      },
//				      "Action": "sts:AssumeRoleWithWebIdentity",
//				      "Condition": {
//				        "StringEquals": {
//				          "graph.facebook.com:app_id": "Imboard"
//				        }
//				      }
//				    }
//				  ]
//				};
//		
//		var accessToken = req.session.passport.user.accessToken;
//		var sts = new AWS.STS();
//		var params =
//		{
//			RoleArn : "arn:aws:iam::401429871540:role/facebook",
//			RoleSessionName : "facebook",
//			WebIdentityToken : accessToken,
//			ProviderId : 'graph.facebook.com'
//		}
//		
//		console.log("assumeRoleWithWebIdentity");
//		sts.assumeRoleWithWebIdentity(params, function(err, data)
//		{
//			if(err)
//			{
//				_loge.error(err, err.stack);
//				res.end("FAIL");
//			}
//			else
//			{
//				var credential = data.Credentials;
//				AWS.config.credentials = new AWS.Credentials(credential.AccessKeyId, credential.SecretAccessKey, credential.SessionToken);
//
//				var s3 = new AWS.S3();
//				
//				s3.getObject();
//			}
//		});

		if(req.session == null)
			req.session = {};
		
		var user = {};
		user.id = req.session.passport.user.id;
		user.provider = req.session.passport.user.provider;

		req.session.user = user;
		var userVo = new UserVo();
		userVo.id = user.id;
    	UserDao.getUser(userVo, function(result)
		{
			if(!result)
			{
//				res.redirect("/profile");
				var vo = new UserVo();
				vo.id = user.id;
				vo.provider = user.provider;
				vo.encryptKey = randomstring.generate(10);
				
				UserDao.insertUser(vo, function(response)
				{
					req.session.user = vo;
					res.redirect(_config.registeredUserRedirectUrl ? _config.registeredUserRedirectUrl : (req.session.signReferer ? req.session.signReferer : "/"));
				});
			}
			else
			{
				UserDao.getEncryptKey(result.id, function(encryptKey)
				{
					req.session.user = result;
					req.session.user.encryptKey = encryptKey;
					UserDao.updateLastAccessDate(result.id);
					res.redirect(req.session.signReferer ? req.session.signReferer : "/");
				})
			}
		});
	}
};

module.exports.loginFailCallback =
{
	type : 'get',
	path : '/auth/login/fail.do',
	callback : function(req, res)
	{
		res.end(JSON.stringify({code : _code.LOGIN_FAIL, msg : "fail"}));
	}
};

module.exports.signin =
{
	type : 'post',
	path : '/signin.do',
	callback : function(req, res)
	{
		var param = req.body;
		var userVo = new UserVo();
		userVo.id = param.id;
		UserDao.getUser(userVo, function(result)
		{
			UserDao.getEncryptKey(userVo.id, function(encryptKey)
			{
				if(result != null && Utils.encrypt(param.password, encryptKey) == result.password)
				{
					if(!req.session)
						req.session = {};
					
					result.password = null;
					req.session.user = result;
					req.session.user.encryptKey = encryptKey;
					
					UserDao.updateLastAccessDate(result.id);
					
					res.end(JSON.stringify({code : _code.SUCCESS, data : req.session.signReferer ? req.session.signReferer : "/"}));
				}
				else
				{
					res.end(JSON.stringify({code : _code.ERROR}));
				}
			});
		});
	}
};

module.exports.signout =
{
	type : 'get',
	path : '/signout.do',
	callback : function(req, res)
	{
		//
		// passport 에서 지원하는 logout 메소드이다.
		// req.session.passport 의 정보를 삭제한다.
		//
		req.logout();
		req.session.user = null;
		if(req.session.referer != null)
		{
			req.session.isSignOut = true;
			res.redirect(req.session.referer);
		}
		else
		{
			res.redirect('/');
		}
	}
};