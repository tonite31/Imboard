var UserDao = require(_path.src + "/dao/UserDao.js");
var UserVo = require(_path.src + '/vo/UserVo.js');
var Utils = require(_path.src + '/lib/Utils.js');

module.exports.getUserList =
{
	type : 'post',
	path : '/user/getUserList.do',
	callback : function(req, res)
	{
		var param = req.body;
		UserDao.getUserList(function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.getUser =
{
	type : 'post',
	path : '/user/getUser.do',
	callback : function(req, res)
	{
		var param = req.body;
		UserDao.getUser(new UserVo(param), function(response)
		{
			res.end(JSON.stringify({code : _code.SUCCESS, data : response, msg : "SUCCESS"}));
		});
	}
};

module.exports.insertUser =
{
	type : 'post',
	path : '/user/insertUser.do',
	callback : function(req, res)
	{
		if(req.session.user && req.body.id == req.session.user.id)
		{
			var userVo = new UserVo(req.body);
			req.session.user = userVo;
			UserDao.getUser(userVo, function(response)
			{
				if(response)
				{
					UserDao.updateUser(userVo, function(response)
					{
						req.session.user.name = userVo.name;
						req.session.user.displayId = userVo.displayId;
						res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
					});
				}
				else
				{
					UserDao.insertUser(userVo, function(response)
					{
						res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
					});
				}
			});
		}
		else
		{
			res.end(JSON.stringify({code : _code.FAIL, msg : "SUCCESS"}));
		}
	}
};

module.exports.updateUser =
{
	type : 'post',
	path : '/user/updateUser.do',
	callback : function(req, res)
	{
		var userVo = new UserVo(req.body);
		UserDao.updateUser(userVo, function(response)
		{
			req.session.user.name = userVo.name;
			req.session.user.displayId = userVo.displayId;
			req.session.user.profileImgUrl = userVo.profileImgUrl;
			req.session.user.password = null;
			res.end(JSON.stringify({code : _code.SUCCESS, data : req.session.user, msg : "SUCCESS"}));
		});
	}
};

module.exports.updateUserPassword =
{
	type : 'post',
	path : '/user/updateUserPassword.do',
	callback : function(req, res)
	{
		var userVo = new UserVo(req.body);
		if(req.session && req.session.user.id == userVo.id)
		{
			UserDao.getEncryptKey(userVo.id, function(encryptKey)
			{
				UserDao.getUser(userVo, function(response)
				{
					if(response && Utils.encrypt(userVo.oldPassword, encryptKey) == response.password)
					{
						UserDao.updateUserPassword(userVo.id, Utils.encrypt(userVo.password, encryptKey), function(response)
						{
							res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
						});
					}
				});
			});
		}
	}
};

module.exports.dropOut =
{
	type : 'post',
	path : '/user/dropOut.do',
	callback : function(req, res)
	{
		var param = req.body;
		if(req.session && req.session.user.id == param.id)
		{
			UserDao.dropOut(param.id, function(response)
			{
				res.end(JSON.stringify({code : _code.SUCCESS, data : _code.SUCCESS, msg : "SUCCESS"}));
			});
		}
	}
};

module.exports.initializeAdminAccount =
{
	type : 'post',
	path : '/user/initializeAdminAccount.do',
	callback : function(req, res)
	{
		UserDao.getEncryptKey("admin", function(encryptKey)
		{
			var password = Utils.encrypt("admin", encryptKey);
			UserDao.updateUserPassword("admin", password, function(response)
			{
				res.end(JSON.stringify({code : _code.SUCCESS}));
			});
		});
	}
};

module.exports.getSignedUser = 
{
	type : 'post',
	path : '/user/getSignedUser.do',
	callback : function(req, res)
	{
		if(req.session.user)
		{
			res.end(JSON.stringify({code : global._code.SUCCESS, data : req.session.user}));
		}
		else
		{
			res.end(JSON.stringify({code : global._code.SUCCESS, data : ""}));
		}
	}
};

module.exports.sendEmail = 
{
	type : 'post',
	path : '/user/sendEmail.do',
	callback : function(req, res)
	{
//		var email = req.body.email;
//		
//		var nodemailer = require('nodemailer');
//
//		// create reusable transporter object using SMTP transport
//		var transporter = nodemailer.createTransport({
//		    service: 'Gmail',
//		    auth: {
//		        user: 'tonite32@gmail.com',
//		        pass: 'dkfvmdnjfem1'
//		    }
//		});
//
//		// NB! No need to recreate the transporter object. You can use
//		// the same transporter object for all e-mails
//		
//		var html = Render.getData(_path.content + "/common/signup2.html");
//		
//		var key = Utils.encrypt(new Date().toString(), _config.userPasswordEncryptKey);
//		if(!req.session)
//			req.session = {};
//		
//		req.session.signupKey = key;
//		
//		var url = global._host + "/signup?piece=setPassword&key=" + key;
//
//		// setup e-mail data with unicode symbols
//		var mailOptions = {
//		    from: 'Imboard <admin@imboardworld.com>', // sender address
//		    to: '<' + email + '>', // list of receivers
//		    subject: '회원등록인증', // Subject line
//		    html: '<p>아래 링크를 클릭해서 회원등록을 마무리해주십시오</p><a href="' + url + '">' + url + '</a>' // html body
//		};
//
//		// send mail with defined transport object
//		transporter.sendMail(mailOptions, function(error, info){
//		    if(error){
//		    	res.end(JSON.stringify({code : 1000, data : error}));
//		    }else{
//		    	res.end(JSON.stringify({code : 1000}));
//		    }
//		});
	}
};