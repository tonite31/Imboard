var urlAuthDao = require(_path.src + "/dao/UrlAuthDao.js");

module.exports.create = function(func)
{
	var f = function(req, res, next)
	{
		try
		{
			_log.info("\n\n");
			_log.info("=================================================");
			_log.info("time : " + new Date().toString());
			_log.info("url : " + req.url);
			_log.info("-------------------------------------------------");
			_log.info(" # Request Headers #");
			if(req.headers)
			{
				for(var key in req.headers)
				{
					_log.info(key + "=" + req.headers[key]);
				}
			}
			_log.info("-------------------------------------------------");
			_log.info(" # Request Parameters #");
			if(req.body)
			{
				for(var key in req.body)
				{
					_log.info(key + "=" + (typeof req.body[key] == "object" ? JSON.stringify(req.body[key]) : req.body[key]));
				}
			}
			_log.info("=================================================\n");
			
			urlAuthDao.matchUrlAuth(req.url, "Y", function(urlAuth)
	    	{
	    		if(urlAuth && urlAuth.length > 0)
	    		{
	    			if(req.session.user == null || req.session.user.level == null)
	    			{
	    				if(req.body.__ajax == "true")
						{
							res.end(JSON.stringify({code : _code.SIGNIN}));
						}
	    				else
	    				{
	    					if(!req.session)
	    						req.session = {};

	    					req.session.lastUrl = req.url;
	    					res.redirect("/signin");
		    	 			return;
	    				}
	    			}
	    			else
	    			{
	    				if(urlAuth.level < req.session.user.level)
	    				{
	    					if(req.body.__ajax == "true")
	    					{
	    						res.end(JSON.stringify({code : _code.ACCESS_DENIED}));		
	    					}
	    					else
	    					{
	    						render(req, res, "common", "core", "/accessDenied.html");
	    					}
	    				}
	    				else
	    				{
	    					func(req, res, next);
	    				}
	    			}
	    		}
	    		else
	    		{
	    			func(req, res, next);
	    		}
	    	});
		}
		catch(err)
		{
			_loge.error("=================================================");
			_loge.error("time : " + new Date().toString());
			_loge.error("name : RouterCallbackWrapper create");
			_loge.error("-------------------------------------------------");
			_loge.error(err.stack);
			_loge.error("=================================================");
		}
	};
	
	return f;
};