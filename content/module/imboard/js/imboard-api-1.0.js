(function()
{
	$.query = {};
	var split = location.href.split("?");
	if(split && split.length == 2)
	{
		split = split[1].split("&");
		for(var i=0; i<split.length; i++)
		{
			var keyValue = split[i].split("=");
			if(keyValue[1].indexOf("#") != -1)
				keyValue[1] = keyValue[1].split("#")[0];
			$.query[keyValue[0]] = decodeURIComponent(keyValue[1]);
		}
	}
})();

(function($)
{
	$.api = {};
	
	var httpRequest = function(param)
	{
//		if(!param.data)
//			param.data = {};
	//	
//		param.data.uuid = globalData.uuid;
		
		var successCallback = null;
		if(param.success)
		{
			successCallback = param.success;
			delete param.success;
		}
		
		var errorCallback = function(data) { console.error(data); };
		if(param.error)
		{
			errorCallback = param.error;
			delete param.error;
		}
		
		var json =
		{
			success: function(data)
			{
				if(data)
				{
					try
					{
						data = JSON.parse(data);
						if(data.code)
						{
							data.code = parseInt(data.code);
							if(successCallback != null)
								successCallback(data);
							
							result = data;
						}
	    		   }
	    		   catch(err)
	    		   {
	    			   //FIXME 권한없음이 왔을때 로그인이 안되어있으면 로그인페이지로.. 되어있으면 권한없음 결과 리턴
	    			   console.error(err.stack);
	    			   result = null;
	    			   errorCallback(result);
	    		   }
				}	
			} 
		};
		
		for(var key in param)
		{
			if(param.hasOwnProperty(key))
			{
				json[key] = param[key];
			}
		}
		
		json.__ajax = true;
		var result = null;
	    $.ajax(json);
	    
	    return result;
	};
	
	/**
	 * $.api.board
	 */
	$.api.board = {};
	$.api.board.getBoardList = function(data)
	{
		return httpRequest({
	       url: "/board/getBoardList.do",
	       type: 'post',
	       data: data,
	       async: false
	    });
	};

	$.api.board.getBoard = function(data)
	{
		return httpRequest({
	       url: "/board/getBoard.do",
	       type: 'post',
	       data: data,
	       async: false
	    });
	};
	
	$.api.board.getBoardByName = function(data)
	{
		return httpRequest({
	       url: "/board/getBoardByName.do",
	       type: 'post',
	       data: data,
	       async: false
	    });
	};

	$.api.board.insertBoard = function(data)
	{
		return httpRequest({
	       url: "/board/insertBoard.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.board.updateBoard = function(data)
	{
		return httpRequest({
	       url: "/board/updateBoard.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.board.deleteBoard = function(data)
	{
		return httpRequest({
	       url: "/board/deleteBoard.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	/**
	 * $.api.boardAuth
	 */
	$.api.boardAuth = {};
	$.api.boardAuth.updateBoardAuth = function(data)
	{
		return httpRequest({
	       url: "/boardAuth/updateBoardAuth.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	/**
	 * $.api.article
	 */
	$.api.article = {};
	$.api.article.getArticleListCount = function(data)
	{
		return httpRequest({
	       url: "/article/getArticleListCount.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.article.getArticleList = function(data)
	{
	    return httpRequest({
	       url: "/article/getArticleList.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	//boardId, seq
	$.api.article.getArticle = function(data)
	{
	    return httpRequest({
	       url: "/article/getArticle.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.article.searchArticle = function(data)
	{
	    return httpRequest({
	       url: "/article/getArticle.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	//boardId, subject, content, groupId, parentSeq, thumbnailUrl, tag, password, isNotice
	$.api.article.insertArticle = function(data)
	{
	    return httpRequest({
	       url: "/article/insertArticle.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};
	
	//boardId, seq, subject, content, groupId, parentSeq, thumbnailUrl, tag, password, isNotice
	$.api.article.writeArticle = function(data)
	{
	    return httpRequest({
	       url: "/article/writeArticle.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.article.updateArticle = function(data)
	{
	    return httpRequest({
	       url: "/article/updateArticle.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.article.updateArticleGood = function(data)
	{
	    return httpRequest({
	       url: "/article/updateGood.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.article.updateArticleBad = function(data)
	{
	    return httpRequest({
	       url: "/article/updateBad.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	//boardId, seq, status
	$.api.article.updateStatus = function(data)
	{
		return httpRequest({
		   url: "/article/updateStatus.do",
		   type: 'post',
		   data : data,
		   async: false
		});
	};

	$.api.article.replyArticle = function(data)
	{
	    return httpRequest({
	       url: "/article/insertArticle.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	//boardId, seq, isRemove(option, "Y", "N")
	$.api.article.deleteArticle = function(data)
	{
	    return httpRequest({
	       url: "/article/deleteArticle.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.article.updateArticleReaderStatus = function(data)
	{
	    return httpRequest({
	       url: "/article/updateArticleReaderStatus.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.article.uploadFile = function(data)
	{
		return httpRequest({
	       url: "/article/uploadFile.do",
	       data : data.data,
	       type: 'post',
	       cache: false,
	       contentType: false,
	       processData: false,
	       success : data.success,
	       error : data.error
	    });
	};

	$.api.article.uploadFileToAWS = function(data)
	{
		return httpRequest({
	       url: "/article/uploadFileToAWS.do",
	       data : data.data,
	       type: 'post',
	       cache: false,
	       contentType: false,
	       processData: false,
	       success : data.success,
	       error : data.error
	    });
	};

	/**
	 * $.api.auth
	 */
	$.api.auth = {};
	$.api.auth.signin = function(data)
	{
		var result = httpRequest({
	       url: "/signin.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
		
		return result;
	};

	/**
	 * $.api.comment
	 */
	$.api.comment = {};
	$.api.comment.getCommentListCount = function(data)
	{
		return httpRequest({
	       url: "/comment/getCommentListCount.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.comment.getCommentList = function(data)
	{
	    return httpRequest({
	       url: "/comment/getCommentList.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.comment.writeComment = function(data)
	{
	    return httpRequest({
	       url: "/comment/insertComment.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.comment.updateComment = function(data)
	{
	    return httpRequest({
	       url: "/comment/updateComment.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.comment.updateCommentGood = function(data)
	{
	    return httpRequest({
	       url: "/comment/updateGood.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.comment.updateCommentBad = function(data)
	{
	    return httpRequest({
	       url: "/comment/updateBad.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.comment.replyComment = function(data)
	{
	    return httpRequest({
	       url: "/comment/insertComment.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.comment.deleteComment = function(data)
	{
	    return httpRequest({
	       url: "/comment/deleteComment.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	/**
	 * $.api.menu
	 */
	$.api.menu = {};
	$.api.menu.getMenuList = function(data)
	{
		var menuList = httpRequest({
	       url: "/menu/getMenuList.do",
	       type: 'post',
	       data: data,
	       async: false
	    });
		
		return menuList;
	};

	$.api.menu.getMenu = function(data)
	{
		return httpRequest({
	       url: "/menu/getMenu.do",
	       type: 'post',
	       data: data,
	       async: false
	    });
	};
	
	//id, name, type, parameter, priority, parentMenuId, viewLevel
	$.api.menu.insertMenu = function(data)
	{
		return httpRequest({
	       url: "/menu/insertMenu.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.menu.updateMenu = function(data)
	{
		return httpRequest({
	       url: "/menu/updateMenu.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.menu.deleteMenu = function(data)
	{
		return httpRequest({
	       url: "/menu/deleteMenu.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};


	/**
	 * $.api.user
	 */
	$.api.user = {};
	$.api.user.getUserList = function(data)
	{
		return httpRequest({
	       url: "/user/getUserList.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};
	
	$.api.user.getUser = function(data)
	{
		return httpRequest({
	       url: "/user/getUser.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};
	
	$.api.user.insertUser = function(data)
	{
		return httpRequest({
	       url: "/user/insertUser.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.user.updateUser = function(data)
	{
		return httpRequest({
	       url: "/user/updateUser.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.user.updateUserPassword = function(data)
	{
		return httpRequest({
	       url: "/user/updateUserPassword.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.user.initializeAdminAccount = function()
	{
		return httpRequest({
	       url: "/user/initializeAdminAccount.do",
	       type: 'post',
	       async: false
	    });
	};

	$.api.user.getSignedUser = function()
	{
		var userInfo = httpRequest({
	       url: "/user/getSignedUser.do",
	       type: 'post',
	       async: false
	    });
		
		return userInfo;
	};

//	$.api.user.sendEmail = function(data)
//	{
//		var userInfo = httpRequest({
//	       url: "/user/sendEmail.do",
//	       type: 'post',
//	       data : data,
//	       async: false
//	    });
//		
//		return userInfo;
//	};


	/**
	 * $.api.visitor
	 */
	$.api.visitor = {};
	$.api.visitor.getVisitorList = function(data)
	{
		return httpRequest({
		   url: "/visitor/getVisitorList.do",
		   type: 'post',
		   data : data,
		   async: false
		});
	};


	/**
	 * $.api.urlAuth
	 */
	$.api.urlAuth = {};
	$.api.urlAuth.getUrlAuthList = function(data)
	{
		return httpRequest({
	       url: "/auth/getUrlAuthList.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
	};

	$.api.urlAuth.insertUrlAuth = function(data)
	{
		return httpRequest({
		   url: "/auth/insertUrlAuth.do",
		   type: 'post',
		   data : data,
		   async: false
		});
	};

	$.api.urlAuth.updateUrlAuth = function(data)
	{
		return httpRequest({
		   url: "/auth/updateUrlAuth.do",
		   type: 'post',
		   data : data,
		   async: false
		});
	};

	$.api.urlAuth.deleteUrlAuth = function(data)
	{
		return httpRequest({
		   url: "/auth/deleteUrlAuth.do",
		   type: 'post',
		   data : data,
		   async: false
		});
	};


	/**
	 * $.api.role
	 */
	$.api.role = {};
	$.api.role.getRoleList = function(data)
	{
		return httpRequest({
		   url: "/role/getRoleList.do",
		   type: 'post',
		   data : data,
		   async: false
		});
	};

	$.api.role.insertRole = function(data)
	{
		return httpRequest({
		   url: "/role/insertRole.do",
		   type: 'post',
		   data : data,
		   async: false
		});
	};

	$.api.role.updateRole = function(data)
	{
		return httpRequest({
		   url: "/role/updateRole.do",
		   type: 'post',
		   data : data,
		   async: false
		});
	};

	$.api.role.deleteRole = function(data)
	{
		return httpRequest({
		   url: "/role/deleteRole.do",
		   type: 'post',
		   data : data,
		   async: false
		});
	};

	/**
	 * $.api.member
	 */
	$.api.member = {};
	$.api.member.getMemberList = function(data)
	{
		return httpRequest({
		   url: "/Member/getMemberList.do",
		   type: 'post',
		   data : data,
		   async: false
		});
	};

	$.api.member.registerMember = function(data)
	{
		return httpRequest({
		   url: "/Member/updateMember.do",
		   type: 'post',
		   data : data,
		   async: false
		});
	};

	$.api.member.updateMemberLevel = function(data)
	{
		return httpRequest({
			url: "/Member/updateMemberLevel.do",
			type: 'post',
			data : data,
			async: false
		});
	};

//	$.api.member.updateAccessDate = function(data)
//	{
//		return httpRequest({
//			url: "/Member/updateAccessDate.do",
//			type: 'post',
//			data : data,
//			async: false
//		});
//	};

}(jQuery));