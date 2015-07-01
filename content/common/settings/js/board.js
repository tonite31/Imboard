$(document).ready(function()
{
	initForm();

	$("#addBoardButton").on("click", function()
	{
		var clone = $("#boardList").children("div:first").clone(true);
		$("#boardList").prepend(clone);
		
		clone.find(".panel").attr("class", "panel panel-primary");
		
		clone.find("input[type='hidden']").parent().html("<input type='text' name='id' autofocus='autofocus'/>");
		clone.find(".panel-body input[type!='radio']").val("");
		
		clone.find(".panel-footer input").unbind();
		clone.find(".panel-footer input[value='저장']").attr("data-role", "submit");
		clone.find(".panel-footer input[value='삭제']").val("취소");
		
		var form = clone.find("form").get(0);
		
		$(form).removeAttr("novalidate").attr("data-component", "form");
		$(form).compile(function(data)
		{
			if(!data.id)
				data.id = new Date().getTime();
			
			var result = $.api.board.insertBoard(data);
			
			if(result.code == 1000)
			{
				data.boardId = data.id;
				$.api.boardAuth.updateBoardAuth(data);
				refresh();
			}
			else
			{
				$("#result").text(JSON.stringify(result)).css("color", "white");
			}
		});
		
//		var template = Handlebars.compile(html);
//		var roleList = $.api.role.getRoleList();
//		$("#board > div").prepend(template({roleList : roleList}));
//		
//		$("#newForm").compile(function(data)
//		{
//			if(!data.id)
//				data.id = new Date().getTime();
//			
//			var result = $.api.board.insertBoard(data);
//			
//			if(result.code == 1000)
//			{
//				data.boardId = data.id;
//				$.api.boardAuth.updateBoardAuth(data);
//				refresh();
//			}
//			else
//			{
//				$("#result").text(JSON.stringify(result));
//			}
//		});
//		
//		$("#cancel").on("click", function()
//		{
//			$("#board > div > div:first").remove();
//		});
	});
});

function initForm()
{
	$("form[data-component='form']").compile(function(param)
	{
		if(param.__roleType == "save")
		{
			var result = $.api.board.updateBoard(param);
			if(result.code == 1000)
			{
				param.boardId = param.id;
				result = $.api.boardAuth.updateBoardAuth(param);
				if(result)
				{
					$(this).parent().children("span").text("Saved").css("color", "#777");
				}
				else
				{
					$(this).parent().children("span").text(result.message).css("color", "red");
				}
			}
			else
			{
				$(this).parent().children("span").text(result.message).css("color", "red");
			}
			
			var that = this;
			setTimeout(function()
			{
				$(that).parent().children("span").text("");
			}, 1000 * 10);
		}
		else if(param.__roleType == "delete")
		{
			var parent = $(this).parent().parent();
			var boardId = parent.find("span[data-id='boardId']").text();
			
			var result = $.api.board.deleteBoard(param);
			if(result.code == 1000)
			{
				parent.remove();
				refresh();
			}
		}
	});
}

function refresh()
{
	var result = $.api.board.getBoardList();
	if(result.code == 1000)
	{
		$("#boardList").templating("settings-board-template", {boardList : result.data});
		initForm();
	}
}

function init()
{
//	$("#board button[data-id='save']").on("click", function()
//	{
//		var parent = $(this).parent().parent();
//		var boardId = parent.find("span[data-id='boardId']").text();
//		var boardName = parent.find("input[data-id='boardName']").val();
//		var priority = parent.find("input[data-id='priority']").val();
//		var viewListLevel = parent.find("select[data-id='viewListLevel']").val();
//		var viewDetailLevel = parent.find("select[data-id='viewDetailLevel']").val();
//		var writeLevel = parent.find("select[data-id='writeLevel']").val();
//		var writeCommentLevel = parent.find("select[data-id='writeCommentLevel']").val();
//		var useYn = parent.find("input[type='radio'][name^='useYn_']:checked").val();
//		
//		var result = $.api.board.updateBoard({id : boardId, name : boardName, priority : priority, useYn : useYn});
//		
//		if(result.code == "1000")
//		{
//			var param = {boardId : boardId, viewListLevel : viewListLevel, viewDetailLevel : viewDetailLevel, writeLevel : writeLevel, writeCommentLevel : writeCommentLevel};
//			$.api.boardAuth.updateBoardAuth(param);
//			$(this).parent().children("span").css("color", "gray").text("Updated");
//		}
//		else
//		{
//			$(this).parent().children("span").css("color", "red").text("Update fail");
//		}
//	});
//	
//	$("#board button[data-id='delete']").on("click", function()
//	{
//		var parent = $(this).parent().parent();
//		var boardId = parent.find("span[data-id='boardId']").text();
//		
//		$.api.board.deleteBoard({imboardId : _globalData.imboard.id, boardId : boardId});
//		init();
//	});
}