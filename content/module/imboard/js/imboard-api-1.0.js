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

	$.api.user.sendEmail = function(data)
	{
		var userInfo = httpRequest({
	       url: "/user/sendEmail.do",
	       type: 'post',
	       data : data,
	       async: false
	    });
		
		return userInfo;
	};


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

	$.api.member.updateAccessDate = function(data)
	{
		return httpRequest({
			url: "/Member/updateAccessDate.do",
			type: 'post',
			data : data,
			async: false
		});
	};

	/**
	 *  $.api.imboardData
	 */
	$.api.imboardData = {};
	$.api.imboardData.getImboardData = function(data)
	{
		return httpRequest({
			url: "/imboardData/getImboardData.do",
			type: 'post',
			data : data,
			async: false
		});
	};

	$.api.imboardData.saveData = function(data)
	{
		return httpRequest({
			url: "/imboardData/updateImboardData.do",
			type: 'post',
			data : data,
			async: false
		});
	};

	/**
	 *  $.api.request;
	 */
	$.api.request = {};
	$.api.request.post = function(data, callback)
	{
		return httpRequest({
			url: "/request.do",
			type: 'post',
			data : data,
			success : callback
		});
	};
}(jQuery));

function isMobileWeb() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}