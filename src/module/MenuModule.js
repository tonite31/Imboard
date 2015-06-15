var MenuDao = require(_path.src + "/dao/MenuDao.js");
var ArticleDao = require(_path.src + "/dao/ArticleDao.js");

module.exports.menuList = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	MenuDao.getMenuList(param.parentMenuId, function(menuList)
	{
		$(el).html(template({menuList : menuList}));
		next();
	});
};

module.exports.menuListWithArticleCount = function($, el, param, req, next)
{
	var template = this.getTemplate($, el);
	MenuDao.getMenuList(param.parentMenuId, function(menuList)
	{
		if(menuList && menuList.length > 0)
		{
			setArticleCount(0, menuList, req, function()
			{
				$(el).html(template({menuList : menuList}));
				next();
			});
		}
		else
		{
			$(el).html(template({menuList : menuList}));
			next();
		}
	});
};

function setArticleCount(index, menuList, req, callback)
{
	if(index < menuList.length)
	{
		var searchData = {};
		if(req.session.user)
			searchData.signinUserId = req.session.user.id;
		
		ArticleDao.getArticleListCount(menuList[index].id, searchData, function(count)
		{
			menuList[index].articleCount = count;
			setArticleCount(index+1, menuList, req, callback);
		});
	}
	else
	{
		callback();
	}
}

//function getMenuList(index, menuList, callback)
//{
//	if(index < menuList.length)
//	{
//		if(menuList[index].childMenuCount > 0)
//		{
//			MenuDao.getMenuList(menuList[index].id, function(response)
//			{
//				if(response && response.length > 0) // 차일드가 있으면 response 루프를 또 돌아야함
//				{
//					menuList[index].childMenuList = response;
//					getMenuList(0, response, function() // response 루프 돌리고 끝나면
//					{
//						getMenuList(index+1, menuList, callback); // index+1로 가는게 맞아.
//					});
//				}
//				else // 차일드가 없으면 menuList index+1로 가는게 맞고
//				{
//					menuList[index].childMenuList = response;
//					getMenuList(index+1, menuList, callback);
//				}
//			});
//		}
//		else
//		{
//			getMenuList(index+1, menuList, callback);
//		}
//	}
//	else
//	{
//		callback(menuList);
//	}
//}